import { describe, expect, it } from "vitest";

import {
  assignmentInputSchema,
  structuredExplanationSchema
} from "./api";

describe("assignmentInputSchema", () => {
  it("accepts a valid explanation request", () => {
    const result = assignmentInputSchema.parse({
      title: "Economics Assignment 1",
      courseName: "Economics",
      questionText:
        "Discuss the significance and concept of equilibrium in economic theory.",
      wordCount: 1200,
      level: "Year 1"
    });

    expect(result.courseName).toBe("Economics");
  });

  it("rejects too-short questions", () => {
    expect(() =>
      assignmentInputSchema.parse({
        questionText: "Too short"
      })
    ).toThrow();
  });
});

describe("structuredExplanationSchema", () => {
  it("requires the expected array sections", () => {
    expect(() =>
      structuredExplanationSchema.parse({
        simplifiedExplanation: "Summary",
        lecturerIntent: "Intent",
        stepByStep: ["One"],
        suggestedStructure: ["One", "Two", "Three"],
        keyTopics: ["A", "B", "C"],
        commonMistakes: ["A", "B"]
      })
    ).toThrow();
  });
});
