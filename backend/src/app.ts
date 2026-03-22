import type { RequestHandler } from "express";

import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

import {
  assignmentInputSchema,
  createExplanationResponseSchema,
  historyListResponseSchema
} from "@assignment-explainer/shared";

import { env } from "./env";
import {
  authenticateRequest,
  type AuthenticatedRequest
} from "./middleware/auth";
import {
  createExplanationRepository,
  type ExplanationRepository
} from "./repositories/explanations";
import {
  createExplanationEngine,
  type ExplanationEngine
} from "./services/explanationService";

const asyncHandler =
  (
    handler: (request: AuthenticatedRequest, response: express.Response) => Promise<void>
  ): RequestHandler =>
  async (request, response, next) => {
    try {
      await handler(request as AuthenticatedRequest, response);
    } catch (error) {
      next(error);
    }
  };

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Unexpected server error.";

const normalizeServerError = (error: unknown) => {
  const message = getErrorMessage(error);

  if (
    message.includes("Could not find the table 'public.profiles'") ||
    message.includes("Could not find the table 'public.assignments'") ||
    message.includes("Could not find the table 'public.assignment_explanations'")
  ) {
    return {
      status: 500,
      message:
        "Your Supabase project is missing the Assignment Explainer tables. Run the SQL migration in supabase/migrations before using the API."
    };
  }

  return {
    status: 500,
    message
  };
};

export type AppDependencies = {
  authenticate?: RequestHandler;
  repository?: ExplanationRepository;
  explanationEngine?: ExplanationEngine;
};

export const createApp = (dependencies: AppDependencies = {}) => {
  const app = express();
  const authenticate = dependencies.authenticate ?? authenticateRequest;
  const repository = dependencies.repository ?? createExplanationRepository();
  const explanationEngine = dependencies.explanationEngine ?? createExplanationEngine();

  const explainLimiter = rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.RATE_LIMIT_MAX,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Too many explanation requests. Please try again later." }
  });

  app.use(helmet());
  app.use(
    cors({
      origin: env.FRONTEND_URL,
      credentials: true
    })
  );
  app.use(express.json({ limit: "1mb" }));

  app.get("/api/health", (_request, response) => {
    response.json({ status: "ok" });
  });

  app.post(
    "/api/explain-assignment",
    authenticate,
    explainLimiter,
    asyncHandler(async (request, response) => {
      const parsed = assignmentInputSchema.safeParse(request.body);

      if (!parsed.success) {
        response.status(400).json({
          message: "Invalid assignment payload.",
          issues: parsed.error.flatten()
        });
        return;
      }

      await repository.ensureProfile(request.auth.userId);

      const pending = await repository.createPendingExplanation({
        userId: request.auth.userId,
        assignment: parsed.data,
        model: env.OPENAI_MODEL
      });

      try {
        const generated = await explanationEngine.generate(parsed.data);

        if (generated.status === "refused") {
          await repository.markRefused({
            explanationId: pending.explanationId,
            refusalReason: generated.refusalReason,
            rawResponse: generated.rawResponse
          });

          const responseBody = createExplanationResponseSchema.parse({
            assignmentId: pending.assignmentId,
            explanationId: pending.explanationId,
            status: "refused",
            result: null
          });

          response.status(201).json(responseBody);
          return;
        }

        await repository.markCompleted({
          explanationId: pending.explanationId,
          result: generated.result,
          rawResponse: generated.rawResponse
        });

        const responseBody = createExplanationResponseSchema.parse({
          assignmentId: pending.assignmentId,
          explanationId: pending.explanationId,
          status: "completed",
          result: generated.result
        });

        response.status(201).json(responseBody);
      } catch (error) {
        const message = getErrorMessage(error);
        await repository.markFailed({
          explanationId: pending.explanationId,
          errorMessage: message
        });

        const responseBody = createExplanationResponseSchema.parse({
          assignmentId: pending.assignmentId,
          explanationId: pending.explanationId,
          status: "failed",
          result: null
        });

        response.status(502).json({
          ...responseBody,
          message:
            message ||
            "The explanation request was saved, but the generation step failed."
        });
      }
    })
  );

  app.get(
    "/api/history",
    authenticate,
    asyncHandler(async (request, response) => {
      const items = await repository.listHistory(request.auth.userId);
      response.json(historyListResponseSchema.parse({ items }));
    })
  );

  app.get(
    "/api/history/:id",
    authenticate,
    asyncHandler(async (request, response) => {
      const item = await repository.getHistoryItem(
        request.auth.userId,
        String(request.params.id)
      );

      if (!item) {
        response.status(404).json({ message: "Explanation not found." });
        return;
      }

      response.json(item);
    })
  );

  app.use(
    (
      error: unknown,
      _request: express.Request,
      response: express.Response,
      _next: express.NextFunction
    ) => {
      const normalized = normalizeServerError(error);
      response.status(normalized.status).json({ message: normalized.message });
    }
  );

  return app;
};
