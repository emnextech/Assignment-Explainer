import { z } from "zod";

export const explanationStatusSchema = z.enum([
  "pending",
  "completed",
  "failed",
  "refused"
]);

export const assignmentInputSchema = z.object({
  title: z.string().trim().min(1).max(160).optional().nullable(),
  courseName: z.string().trim().min(1).max(120).optional().nullable(),
  questionText: z.string().trim().min(20).max(5000),
  wordCount: z.number().int().positive().max(20000).optional().nullable(),
  level: z.string().trim().min(1).max(80).optional().nullable()
});

export const structuredExplanationSchema = z.object({
  simplifiedExplanation: z.string().trim().min(1),
  lecturerIntent: z.string().trim().min(1),
  stepByStep: z.array(z.string().trim().min(1)).min(3),
  suggestedStructure: z.array(z.string().trim().min(1)).min(3),
  keyTopics: z.array(z.string().trim().min(1)).min(3),
  commonMistakes: z.array(z.string().trim().min(1)).min(2)
});

export const explanationRecordSchema = z.object({
  assignmentId: z.string().uuid(),
  explanationId: z.string().uuid(),
  status: explanationStatusSchema,
  model: z.string(),
  title: z.string().nullable(),
  courseName: z.string().nullable(),
  questionText: z.string(),
  wordCount: z.number().int().positive().nullable(),
  level: z.string().nullable(),
  createdAt: z.string(),
  completedAt: z.string().nullable(),
  refusalReason: z.string().nullable(),
  errorMessage: z.string().nullable(),
  result: structuredExplanationSchema.nullable()
});

export const createExplanationResponseSchema = z.object({
  assignmentId: z.string().uuid(),
  explanationId: z.string().uuid(),
  status: explanationStatusSchema,
  result: structuredExplanationSchema.nullable()
});

export const historyListResponseSchema = z.object({
  items: z.array(explanationRecordSchema)
});

export type ExplanationStatus = z.infer<typeof explanationStatusSchema>;
export type AssignmentInput = z.infer<typeof assignmentInputSchema>;
export type StructuredExplanation = z.infer<typeof structuredExplanationSchema>;
export type ExplanationRecord = z.infer<typeof explanationRecordSchema>;
export type CreateExplanationResponse = z.infer<
  typeof createExplanationResponseSchema
>;
export type HistoryListResponse = z.infer<typeof historyListResponseSchema>;
