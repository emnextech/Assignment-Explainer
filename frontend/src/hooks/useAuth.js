import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, startTransition, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";
const AuthContext = createContext(undefined);
const getBootstrapErrorMessage = (error) => {
    const message = error instanceof Error ? error.message : "Failed to prepare your account.";
    if (message.includes("Could not find the table 'public.profiles'")) {
        return "Your Supabase database is missing the app tables. Run the SQL migration before using authenticated features.";
    }
    return message;
};
async function ensureProfile(user) {
    if (!user.email_confirmed_at) {
        return;
    }
    const fullName = user.user_metadata?.full_name ?? null;
    const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        full_name: fullName,
        university: "Cavendish University"
    }, { onConflict: "id" });
    if (error) {
        throw error;
    }
}
export const AuthProvider = ({ children }) => {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [authBootstrapError, setAuthBootstrapError] = useState(null);
    const [isRecoveryMode, setIsRecoveryMode] = useState(false);
    useEffect(() => {
        let active = true;
        supabase.auth.getSession().then(({ data }) => {
            if (!active) {
                return;
            }
            startTransition(() => {
                setSession(data.session);
                setLoading(false);
            });
        });
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, nextSession) => {
            startTransition(() => {
                setSession(nextSession);
                setLoading(false);
                if (event === "PASSWORD_RECOVERY") {
                    setIsRecoveryMode(true);
                }
                if (event === "SIGNED_OUT") {
                    setIsRecoveryMode(false);
                }
            });
        });
        return () => {
            active = false;
            subscription.unsubscribe();
        };
    }, []);
    useEffect(() => {
        if (!session?.user) {
            return;
        }
        setAuthBootstrapError(null);
        ensureProfile(session.user).catch((error) => {
            const message = getBootstrapErrorMessage(error);
            setAuthBootstrapError(message);
            console.error("Failed to bootstrap profile", error);
        });
    }, [session]);
    const value = useMemo(() => ({
        session,
        user: session?.user ?? null,
        loading,
        isVerified: Boolean(session?.user?.email_confirmed_at),
        authBootstrapError,
        isRecoveryMode,
        async signIn(email, password) {
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) {
                throw error;
            }
        },
        async signUp(email, password, fullName) {
            const redirectTo = `${window.location.origin}/auth/callback?next=/dashboard`;
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: redirectTo,
                    data: {
                        full_name: fullName
                    }
                }
            });
            if (error) {
                throw error;
            }
        },
        async resendVerification(email) {
            const { error } = await supabase.auth.resend({
                type: "signup",
                email,
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`
                }
            });
            if (error) {
                throw error;
            }
        },
        async requestPasswordReset(email) {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`
            });
            if (error) {
                throw error;
            }
        },
        async updatePassword(password) {
            const { error } = await supabase.auth.updateUser({
                password
            });
            if (error) {
                throw error;
            }
        },
        consumeRecoveryMode() {
            setIsRecoveryMode(false);
        },
        async signOut() {
            const { error } = await supabase.auth.signOut();
            if (error) {
                throw error;
            }
        }
    }), [authBootstrapError, isRecoveryMode, loading, session]);
    return _jsx(AuthContext.Provider, { value: value, children: children });
};
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider.");
    }
    return context;
};
