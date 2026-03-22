import request from "supertest";
import { describe, expect, it, vi } from "vitest";

import type { ExplanationRecord } from "@assignment-explainer/shared";

import { createApp } from "../app.js";
import type { AuthenticatedRequest } from "../middleware/auth.js";
import type { ExplanationRepository } from "../repositories/explanations.js";
import type { ExplanationEngine } from "../services/explanationService.js";

const authMiddleware = (request: any, _response: any, next: any) => {
  (request as AuthenticatedRequest).auth = {
    userId: "user-123",
    email: "student@example.com",
    accessToken: "token"
  };
  next();
};

const baseRecord: ExplanationRecord = {
  assignmentId: "db8db3b3-d54f-4c5b-8c0d-19dbe3323ef1",
  explanationId: "0b3f0d97-2e89-4109-80fa-51258ab57cd9",
  status: "completed",
  model: "gpt-5-mini",
  title: "Economics Assignment 1",
  courseName: "Economics",
  questionText: "Discuss the significance and concept of equilibrium in economic theory.",
  wordCount: 1200,
  level: "Year 1",
  createdAt: new Date().toISOString(),
  completedAt: new Date().toISOString(),
  refusalReason: null,
  errorMessage: null,
  result: {
    simplifiedExplanation: "Explain equilibrium and why it matters.",
    lecturerIntent: "Define and evaluate equilibrium in economic theory.",
    stepByStep: ["Identify the command word", "Define equilibrium", "Explain significance"],
    suggestedStructure: ["Introduction", "Main explanation", "Conclusion"],
    keyTopics: ["Market equilibrium", "Supply and demand", "Price mechanism"],
    commonMistakes: ["Only defining the term", "Ignoring significance"]
  }
};

const createRepositoryStub = (): ExplanationRepository => ({
  ensureProfile: vi.fn().mockResolvedValue(undefined),
  createPendingExplanation: vi.fn().mockResolvedValue({
    assignmentId: baseRecord.assignmentId,
    explanationId: baseRecord.explanationId
  }),
  markCompleted: vi.fn().mockResolvedValue(undefined),
  markFailed: vi.fn().mockResolvedValue(undefined),
  markRefused: vi.fn().mockResolvedValue(undefined),
  listHistory: vi.fn().mockResolvedValue([baseRecord]),
  getHistoryItem: vi.fn().mockResolvedValue(baseRecord)
});

const createEngineStub = (): ExplanationEngine => ({
  generate: vi.fn().mockResolvedValue({
    status: "completed",
    result: baseRecord.result,
    rawResponse: { ok: true }
  })
});

describe("API app", () => {
  it("rejects requests without auth", async () => {
    const app = createApp({
      authenticate: ((_request: unknown, response: { status: (code: number) => { json: (body: unknown) => void } }) => {
        response.status(401).json({ message: "Missing bearer token." });
      }) as any,
      repository: createRepositoryStub(),
      explanationEngine: createEngineStub()
    });

    const response = await request(app).get("/api/history");

    expect(response.status).toBe(401);
  });

  it("returns 400 for invalid assignment input", async () => {
    const app = createApp({
      authenticate: authMiddleware as any,
      repository: createRepositoryStub(),
      explanationEngine: createEngineStub()
    });

    const response = await request(app)
      .post("/api/explain-assignment")
      .send({ questionText: "short" });

    expect(response.status).toBe(400);
  });

  it("creates an explanation and returns ids", async () => {
    const repository = createRepositoryStub();
    const engine = createEngineStub();
    const app = createApp({
      authenticate: authMiddleware as any,
      repository,
      explanationEngine: engine
    });

    const response = await request(app).post("/api/explain-assignment").send({
      title: "Economics Assignment 1",
      courseName: "Economics",
      questionText:
        "Discuss the significance and concept of equilibrium in economic theory.",
      wordCount: 1200,
      level: "Year 1"
    });

    expect(response.status).toBe(201);
    expect(response.body.assignmentId).toBe(baseRecord.assignmentId);
    expect(repository.createPendingExplanation).toHaveBeenCalled();
    expect(repository.markCompleted).toHaveBeenCalled();
  });
});
