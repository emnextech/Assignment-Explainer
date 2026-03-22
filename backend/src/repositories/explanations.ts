import type {
  AssignmentExplanationRow,
  AssignmentInput,
  Database,
  ExplanationRecord,
  StructuredExplanation
} from "@assignment-explainer/shared";

import { supabaseAdmin } from "../lib/supabase.js";

type AssignmentInsert = Database["public"]["Tables"]["assignments"]["Insert"];
type ExplanationInsert =
  Database["public"]["Tables"]["assignment_explanations"]["Insert"];
type ExplanationUpdate =
  Database["public"]["Tables"]["assignment_explanations"]["Update"];

type JoinedExplanationRow = AssignmentExplanationRow & {
  assignments: Database["public"]["Tables"]["assignments"]["Row"] | null;
};

const mapStructuredArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string");
};

const toExplanationRecord = (row: JoinedExplanationRow): ExplanationRecord => ({
  assignmentId: row.assignment_id,
  explanationId: row.id,
  status: row.status,
  model: row.model,
  title: row.assignments?.title ?? null,
  courseName: row.assignments?.course_name ?? null,
  questionText: row.assignments?.question_text ?? "",
  wordCount: row.assignments?.word_count ?? null,
  level: row.assignments?.level ?? null,
  createdAt: row.created_at,
  completedAt: row.completed_at,
  refusalReason: row.refusal_reason,
  errorMessage: row.error_message,
  result:
    row.status === "completed"
      ? {
          simplifiedExplanation: row.simplified_explanation ?? "",
          lecturerIntent: row.lecturer_intent ?? "",
          stepByStep: mapStructuredArray(row.step_by_step),
          suggestedStructure: mapStructuredArray(row.suggested_structure),
          keyTopics: mapStructuredArray(row.key_topics),
          commonMistakes: mapStructuredArray(row.common_mistakes)
        }
      : null
});

export type CreatePendingExplanationInput = {
  userId: string;
  assignment: AssignmentInput;
  model: string;
};

export type CompletedExplanationUpdate = {
  explanationId: string;
  result: StructuredExplanation;
  rawResponse: unknown;
};

export type FailedExplanationUpdate = {
  explanationId: string;
  rawResponse?: unknown;
  errorMessage: string;
};

export type RefusedExplanationUpdate = {
  explanationId: string;
  rawResponse?: unknown;
  refusalReason: string;
};

export type ExplanationRepository = {
  ensureProfile(userId: string): Promise<void>;
  createPendingExplanation(input: CreatePendingExplanationInput): Promise<{
    assignmentId: string;
    explanationId: string;
  }>;
  markCompleted(input: CompletedExplanationUpdate): Promise<void>;
  markFailed(input: FailedExplanationUpdate): Promise<void>;
  markRefused(input: RefusedExplanationUpdate): Promise<void>;
  listHistory(userId: string): Promise<ExplanationRecord[]>;
  getHistoryItem(userId: string, explanationId: string): Promise<ExplanationRecord | null>;
};

const updateExplanation = async (explanationId: string, values: ExplanationUpdate) => {
  const { error } = await supabaseAdmin
    .from("assignment_explanations")
    .update(values)
    .eq("id", explanationId);

  if (error) {
    throw new Error(error.message);
  }
};

export const createExplanationRepository = (): ExplanationRepository => ({
  async ensureProfile(userId) {
    const { error } = await supabaseAdmin.from("profiles").upsert(
      {
        id: userId,
        university: "Cavendish University"
      },
      {
        onConflict: "id"
      }
    );

    if (error) {
      throw new Error(error.message);
    }
  },

  async createPendingExplanation({ userId, assignment, model }) {
    const assignmentInsert: AssignmentInsert = {
      user_id: userId,
      title: assignment.title ?? null,
      course_name: assignment.courseName ?? null,
      question_text: assignment.questionText,
      word_count: assignment.wordCount ?? null,
      level: assignment.level ?? null
    };

    const { data: assignmentRow, error: assignmentError } = await supabaseAdmin
      .from("assignments")
      .insert(assignmentInsert)
      .select("id")
      .single();

    if (assignmentError || !assignmentRow) {
      throw new Error(assignmentError?.message ?? "Failed to create assignment row.");
    }

    const explanationInsert: ExplanationInsert = {
      assignment_id: assignmentRow.id,
      user_id: userId,
      status: "pending",
      model
    };

    const { data: explanationRow, error: explanationError } = await supabaseAdmin
      .from("assignment_explanations")
      .insert(explanationInsert)
      .select("id")
      .single();

    if (explanationError || !explanationRow) {
      throw new Error(explanationError?.message ?? "Failed to create explanation row.");
    }

    return {
      assignmentId: assignmentRow.id,
      explanationId: explanationRow.id
    };
  },

  async markCompleted({ explanationId, result, rawResponse }) {
    await updateExplanation(explanationId, {
      status: "completed",
      simplified_explanation: result.simplifiedExplanation,
      lecturer_intent: result.lecturerIntent,
      step_by_step: result.stepByStep,
      suggested_structure: result.suggestedStructure,
      key_topics: result.keyTopics,
      common_mistakes: result.commonMistakes,
      raw_response: rawResponse as Database["public"]["Tables"]["assignment_explanations"]["Update"]["raw_response"],
      completed_at: new Date().toISOString(),
      refusal_reason: null,
      error_message: null
    });
  },

  async markFailed({ explanationId, rawResponse, errorMessage }) {
    await updateExplanation(explanationId, {
      status: "failed",
      raw_response: (rawResponse ?? null) as Database["public"]["Tables"]["assignment_explanations"]["Update"]["raw_response"],
      error_message: errorMessage,
      completed_at: new Date().toISOString()
    });
  },

  async markRefused({ explanationId, rawResponse, refusalReason }) {
    await updateExplanation(explanationId, {
      status: "refused",
      raw_response: (rawResponse ?? null) as Database["public"]["Tables"]["assignment_explanations"]["Update"]["raw_response"],
      refusal_reason: refusalReason,
      completed_at: new Date().toISOString()
    });
  },

  async listHistory(userId) {
    const { data, error } = await supabaseAdmin
      .from("assignment_explanations")
      .select("*, assignments(*)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return (data as JoinedExplanationRow[]).map(toExplanationRecord);
  },

  async getHistoryItem(userId, explanationId) {
    const { data, error } = await supabaseAdmin
      .from("assignment_explanations")
      .select("*, assignments(*)")
      .eq("user_id", userId)
      .eq("id", explanationId)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      return null;
    }

    return toExplanationRecord(data as JoinedExplanationRow);
  }
});
