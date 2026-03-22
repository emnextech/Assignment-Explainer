import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { useAuth } from "./useAuth";
const buildDisplayName = (profile, authName, email) => {
    const profileName = profile?.full_name?.trim();
    if (profileName) {
        return profileName;
    }
    if (authName?.trim()) {
        return authName.trim();
    }
    if (email?.includes("@")) {
        return email.split("@")[0];
    }
    return "Student";
};
const buildInitials = (name) => {
    const parts = name
        .split(" ")
        .map((part) => part.trim())
        .filter(Boolean);
    if (parts.length === 0) {
        return "ST";
    }
    return parts
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? "")
        .join("");
};
export const useProfile = () => {
    const { session, user } = useAuth();
    return useQuery({
        queryKey: ["profile", user?.id],
        enabled: Boolean(session?.access_token && user?.id),
        queryFn: async () => {
            const { data, error } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", user.id)
                .maybeSingle();
            if (error) {
                throw error;
            }
            return (data ?? null);
        }
    });
};
export const useUpdateProfile = () => {
    const queryClient = useQueryClient();
    const { user } = useAuth();
    return useMutation({
        mutationFn: async ({ fullName, university }) => {
            if (!user?.id) {
                throw new Error("You must be signed in to update your profile.");
            }
            const { error } = await supabase.from("profiles").upsert({
                id: user.id,
                full_name: fullName.trim() || null,
                university: university.trim() || "Cavendish University"
            }, {
                onConflict: "id"
            });
            if (error) {
                throw error;
            }
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["profile", user?.id] });
        }
    });
};
export const useProfileIdentity = () => {
    const { user } = useAuth();
    const profileQuery = useProfile();
    const displayName = buildDisplayName(profileQuery.data ?? null, user?.user_metadata?.full_name ?? null, user?.email);
    return {
        ...profileQuery,
        displayName,
        initials: buildInitials(displayName),
        university: profileQuery.data?.university ?? "Cavendish University"
    };
};
