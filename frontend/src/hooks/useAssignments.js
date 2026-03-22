import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createExplanation, fetchHistory, fetchHistoryItem } from "../lib/api";
import { useAuth } from "./useAuth";
export const useHistoryList = () => {
    const { session, isVerified } = useAuth();
    return useQuery({
        queryKey: ["history"],
        queryFn: () => fetchHistory(session.access_token),
        enabled: Boolean(session?.access_token && isVerified)
    });
};
export const useHistoryItem = (explanationId) => {
    const { session, isVerified } = useAuth();
    return useQuery({
        queryKey: ["history", explanationId],
        queryFn: () => fetchHistoryItem(explanationId, session.access_token),
        enabled: Boolean(explanationId && session?.access_token && isVerified)
    });
};
export const useCreateExplanation = () => {
    const { session } = useAuth();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload) => {
            if (!session?.access_token) {
                throw new Error("You must be signed in first.");
            }
            return createExplanation(payload, session.access_token);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["history"] });
        }
    });
};
