import type OpenAI from "openai";

import {
  structuredExplanationSchema,
  type AssignmentInput,
  type StructuredExplanation
} from "@assignment-explainer/shared";

import { createOpenAiClient } from "../lib/openai";
import { env } from "../env";

const responseSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "simplifiedExplanation",
    "lecturerIntent",
    "stepByStep",
    "suggestedStructure",
    "keyTopics",
    "commonMistakes"
  ],
  properties: {
    simplifiedExplanation: { type: "string" },
    lecturerIntent: { type: "string" },
    stepByStep: {
      type: "array",
      items: { type: "string" },
      minItems: 3
    },
    suggestedStructure: {
      type: "array",
      items: { type: "string" },
      minItems: 3
    },
    keyTopics: {
      type: "array",
      items: { type: "string" },
      minItems: 3
    },
    commonMistakes: {
      type: "array",
      items: { type: "string" },
      minItems: 2
    }
  }
} as const;

export type ExplanationEngineResult =
  | {
      status: "completed";
      result: StructuredExplanation;
      rawResponse: unknown;
    }
  | {
      status: "refused";
      refusalReason: string;
      rawResponse: unknown;
    };

export type ExplanationEngine = {
  generate(input: AssignmentInput): Promise<ExplanationEngineResult>;
};

type ResponsesClient = Pick<OpenAI, "responses">;

const buildPrompt = (input: AssignmentInput) => {
  const details = [
    `Title: ${input.title ?? "Not provided"}`,
    `Course: ${input.courseName ?? "Not provided"}`,
    `Word count: ${input.wordCount ?? "Not provided"}`,
    `Level: ${input.level ?? "Not provided"}`,
    "Question:",
    input.questionText
  ];

  return details.join("\n");
};

const extractRefusal = (response: any): string | null => {
  const outputs = Array.isArray(response?.output) ? response.output : [];

  for (const item of outputs) {
    if (item?.type !== "message" || !Array.isArray(item.content)) {
      continue;
    }

    for (const content of item.content) {
      if (content?.type === "refusal" && typeof content.refusal === "string") {
        return content.refusal;
      }
    }
  }

  return null;
};

const extractGeminiText = (response: any) => {
  if (typeof response?.text === "string" && response.text.trim()) {
    return response.text;
  }

  const candidates = Array.isArray(response?.candidates) ? response.candidates : [];
  for (const candidate of candidates) {
    const parts = Array.isArray(candidate?.content?.parts) ? candidate.content.parts : [];
    const text = parts
      .map((part: { text?: string }) => part?.text)
      .find((value: unknown): value is string => typeof value === "string" && value.trim().length > 0);

    if (text) {
      return text;
    }
  }

  return null;
};

const extractGeminiRefusal = (response: any): string | null => {
  const candidates = Array.isArray(response?.candidates) ? response.candidates : [];
  for (const candidate of candidates) {
    if (candidate?.finishReason === "SAFETY") {
      return "The request was blocked by Gemini safety filters.";
    }
  }

  const promptFeedback = response?.promptFeedback;
  if (promptFeedback?.blockReason) {
    return `The request was blocked by Gemini: ${promptFeedback.blockReason}.`;
  }

  return null;
};

const instructionText =
  "You are an academic assignment explainer for university students. Help the student understand the assignment without writing the full answer. Keep the advice practical, clear, and honest. Do not fabricate citations or sources.";

export const createOpenAiExplanationEngine = (
  client: ResponsesClient = createOpenAiClient(),
  model: string = env.OPENAI_MODEL
): ExplanationEngine => ({
  async generate(input) {
    const response = await client.responses.create({
      model,
      store: false,
      instructions: instructionText,
      input: [
        {
          role: "user",
          content: [{ type: "input_text", text: buildPrompt(input) }]
        }
      ],
      text: {
        format: {
          type: "json_schema",
          name: "assignment_explanation",
          strict: true,
          schema: responseSchema
        }
      }
    });

    const refusalReason = extractRefusal(response);

    if (refusalReason) {
      return {
        status: "refused",
        refusalReason,
        rawResponse: response
      };
    }

    const parsedJson = JSON.parse(response.output_text);
    const result = structuredExplanationSchema.parse(parsedJson);

    return {
      status: "completed",
      result,
      rawResponse: response
    };
  }
});

type GeminiResponse = {
  text?: string;
  candidates?: Array<{
    finishReason?: string;
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
  promptFeedback?: {
    blockReason?: string;
  };
};

type GeminiClient = {
  generateContent(input: {
    model: string;
    contents: string;
    config: {
      responseMimeType: "application/json";
      responseJsonSchema: typeof responseSchema;
      systemInstruction: string;
    };
  }): Promise<GeminiResponse>;
};

export const createGeminiExplanationEngine = (
  client: GeminiClient,
  model: string = env.GEMINI_MODEL
): ExplanationEngine => ({
  async generate(input) {
    const response = await client.generateContent({
      model,
      contents: buildPrompt(input),
      config: {
        systemInstruction: instructionText,
        responseMimeType: "application/json",
        responseJsonSchema: responseSchema
      }
    });

    const refusalReason = extractGeminiRefusal(response);
    if (refusalReason) {
      return {
        status: "refused",
        refusalReason,
        rawResponse: response
      };
    }

    const text = extractGeminiText(response);
    if (!text) {
      throw new Error("Gemini returned no text output.");
    }

    const parsedJson = JSON.parse(text);
    const result = structuredExplanationSchema.parse(parsedJson);

    return {
      status: "completed",
      result,
      rawResponse: response
    };
  }
});

export const createGeminiClient = (apiKey: string): GeminiClient => ({
  async generateContent({ model, contents, config }) {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: config.systemInstruction }]
          },
          contents: [
            {
              parts: [{ text: contents }]
            }
          ],
          generationConfig: {
            responseMimeType: config.responseMimeType,
            responseJsonSchema: config.responseJsonSchema
          }
        })
      }
    );

    const data = (await response.json()) as GeminiResponse & { error?: { message?: string } };
    if (!response.ok) {
      throw new Error(data.error?.message ?? "Gemini request failed.");
    }

    return data;
  }
});

export const createExplanationEngine = (): ExplanationEngine => {
  if (env.LLM_PROVIDER === "openai") {
    return createOpenAiExplanationEngine();
  }

  return createGeminiExplanationEngine(createGeminiClient(env.GEMINI_API_KEY!));
};
