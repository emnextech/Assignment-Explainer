import {
  createExplanationResponseSchema,
  explanationRecordSchema,
  historyListResponseSchema,
  type AssignmentInput,
  type CreateExplanationResponse,
  type ExplanationRecord,
  type HistoryListResponse
} from "@assignment-explainer/shared";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

type ApiErrorPayload = {
  message?: unknown;
  error?: unknown;
  status?: unknown;
};

const getHeaders = (accessToken: string | null) => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json"
  };

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  return headers;
};

async function parseJson(response: Response) {
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

function getApiErrorMessage(data: unknown, fallback: string) {
  const payload: ApiErrorPayload =
    typeof data === "object" && data !== null ? (data as ApiErrorPayload) : {};

  if (typeof payload.message === "string" && payload.message.trim()) {
    return payload.message;
  }

  if (typeof payload.error === "string" && payload.error.trim()) {
    return payload.error;
  }

  if (payload.status === "failed") {
    return "The explanation request was saved, but the AI generation failed. Open the history item for details or try again.";
  }

  if (payload.status === "refused") {
    return "The request was refused by the AI safety system. Try simplifying or rephrasing the assignment prompt.";
  }

  return fallback;
}

export async function createExplanation(
  payload: AssignmentInput,
  accessToken: string
): Promise<CreateExplanationResponse> {
  const response = await fetch(`${apiBaseUrl}/api/explain-assignment`, {
    method: "POST",
    headers: getHeaders(accessToken),
    body: JSON.stringify(payload)
  });

  const data = await parseJson(response);

  if (!response.ok) {
    throw new Error(getApiErrorMessage(data, "Failed to create assignment explanation."));
  }

  return createExplanationResponseSchema.parse(data);
}

export async function fetchHistory(accessToken: string): Promise<HistoryListResponse> {
  const response = await fetch(`${apiBaseUrl}/api/history`, {
    headers: getHeaders(accessToken)
  });
  const data = await parseJson(response);

  if (!response.ok) {
    throw new Error(getApiErrorMessage(data, "Failed to load explanation history."));
  }

  return historyListResponseSchema.parse(data);
}

export async function fetchHistoryItem(
  explanationId: string,
  accessToken: string
): Promise<ExplanationRecord> {
  const response = await fetch(`${apiBaseUrl}/api/history/${explanationId}`, {
    headers: getHeaders(accessToken)
  });
  const data = await parseJson(response);

  if (!response.ok) {
    throw new Error(getApiErrorMessage(data, "Failed to load explanation details."));
  }

  return explanationRecordSchema.parse(data);
}
