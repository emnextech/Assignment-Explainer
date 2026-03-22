import { describe, expect, it, vi } from "vitest";

import {
  createGeminiExplanationEngine,
  createOpenAiExplanationEngine
} from "../services/explanationService";

const validResponse = {
  output_text: JSON.stringify({
    simplifiedExplanation: "Explain the assignment in simpler language.",
    lecturerIntent: "Clarify what the lecturer expects.",
    stepByStep: ["Read the task", "Break it down", "Plan the answer"],
    suggestedStructure: ["Intro", "Body", "Conclusion"],
    keyTopics: ["Equilibrium", "Supply and demand", "Price"],
    commonMistakes: ["Ignoring the command word", "Being too descriptive"]
  }),
  output: []
};

describe("createOpenAiExplanationEngine", () => {
  it("returns completed results for valid structured output", async () => {
    const client = {
      responses: {
        create: vi.fn().mockResolvedValue(validResponse)
      }
    } as any;

    const engine = createOpenAiExplanationEngine(client, "gpt-5-mini");
    const result = await engine.generate({
      title: "Economics Assignment 1",
      courseName: "Economics",
      questionText:
        "Discuss the significance and concept of equilibrium in economic theory.",
      wordCount: 1200,
      level: "Year 1"
    });

    expect(result.status).toBe("completed");
    if (result.status === "completed") {
      expect(result.result.keyTopics).toContain("Equilibrium");
    }
  });

  it("returns refused when the model refuses", async () => {
    const client = {
      responses: {
        create: vi.fn().mockResolvedValue({
          output_text: "",
          output: [
            {
              type: "message",
              content: [{ type: "refusal", refusal: "I cannot help with that." }]
            }
          ]
        })
      }
    } as any;

    const engine = createOpenAiExplanationEngine(client, "gpt-5-mini");
    const result = await engine.generate({
      title: null,
      courseName: null,
      questionText:
        "Explain how to cheat on an assignment and avoid detection in a way that beats plagiarism tools.",
      wordCount: null,
      level: null
    });

    expect(result.status).toBe("refused");
  });

  it("throws when the model returns invalid JSON", async () => {
    const client = {
      responses: {
        create: vi.fn().mockResolvedValue({
          output_text: "not json",
          output: []
        })
      }
    } as any;

    const engine = createOpenAiExplanationEngine(client, "gpt-5-mini");

    await expect(
      engine.generate({
        title: null,
        courseName: null,
        questionText:
          "Discuss the significance and concept of equilibrium in economic theory.",
        wordCount: null,
        level: null
      })
    ).rejects.toThrow();
  });
});

describe("createGeminiExplanationEngine", () => {
  it("returns completed results for valid structured output", async () => {
    const client = {
      generateContent: vi.fn().mockResolvedValue({
        text: JSON.stringify({
          simplifiedExplanation: "Explain the assignment in simpler language.",
          lecturerIntent: "Clarify what the lecturer expects.",
          stepByStep: ["Read the task", "Break it down", "Plan the answer"],
          suggestedStructure: ["Intro", "Body", "Conclusion"],
          keyTopics: ["Equilibrium", "Supply and demand", "Price"],
          commonMistakes: ["Ignoring the command word", "Being too descriptive"]
        })
      })
    };

    const engine = createGeminiExplanationEngine(client as any, "gemini-2.5-flash");
    const result = await engine.generate({
      title: "Economics Assignment 1",
      courseName: "Economics",
      questionText:
        "Discuss the significance and concept of equilibrium in economic theory.",
      wordCount: 1200,
      level: "Year 1"
    });

    expect(result.status).toBe("completed");
  });

  it("returns refused when Gemini blocks the request", async () => {
    const client = {
      generateContent: vi.fn().mockResolvedValue({
        promptFeedback: {
          blockReason: "SAFETY"
        }
      })
    };

    const engine = createGeminiExplanationEngine(client as any, "gemini-2.5-flash");
    const result = await engine.generate({
      title: null,
      courseName: null,
      questionText:
        "Explain how to cheat on an assignment and avoid detection in a way that beats plagiarism tools.",
      wordCount: null,
      level: null
    });

    expect(result.status).toBe("refused");
  });
});
