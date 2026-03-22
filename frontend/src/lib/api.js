import { createExplanationResponseSchema, explanationRecordSchema, historyListResponseSchema } from "@assignment-explainer/shared";
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const getHeaders = (accessToken) => {
    const headers = {
        "Content-Type": "application/json"
    };
    if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`;
    }
    return headers;
};
async function parseJson(response) {
    const text = await response.text();
    return text ? JSON.parse(text) : null;
}
function getApiErrorMessage(data, fallback) {
    if (typeof data?.message === "string" && data.message.trim()) {
        return data.message;
    }
    if (typeof data?.error === "string" && data.error.trim()) {
        return data.error;
    }
    if (data?.status === "failed") {
        return "The explanation request was saved, but the AI generation failed. Open the history item for details or try again.";
    }
    if (data?.status === "refused") {
        return "The request was refused by the AI safety system. Try simplifying or rephrasing the assignment prompt.";
    }
    return fallback;
}
export async function createExplanation(payload, accessToken) {
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
export async function fetchHistory(accessToken) {
    const response = await fetch(`${apiBaseUrl}/api/history`, {
        headers: getHeaders(accessToken)
    });
    const data = await parseJson(response);
    if (!response.ok) {
        throw new Error(getApiErrorMessage(data, "Failed to load explanation history."));
    }
    return historyListResponseSchema.parse(data);
}
export async function fetchHistoryItem(explanationId, accessToken) {
    const response = await fetch(`${apiBaseUrl}/api/history/${explanationId}`, {
        headers: getHeaders(accessToken)
    });
    const data = await parseJson(response);
    if (!response.ok) {
        throw new Error(getApiErrorMessage(data, "Failed to load explanation details."));
    }
    return explanationRecordSchema.parse(data);
}
