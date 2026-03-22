import {
  createContext,
  startTransition,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren
} from "react";

import type {
  AuthChangeEvent,
  Session,
  User
} from "@supabase/supabase-js";

import { supabase } from "../lib/supabase";

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  isVerified: boolean;
  authBootstrapError: string | null;
  isRecoveryMode: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  resendVerification: (email: string) => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  consumeRecoveryMode: () => void;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const getBootstrapErrorMessage = (error: unknown) => {
  const message = error instanceof Error ? error.message : "Failed to prepare your account.";

  if (message.includes("Could not find the table 'public.profiles'")) {
    return "Your Supabase database is missing the app tables. Run the SQL migration before using authenticated features.";
  }

  return message;
};

async function ensureProfile(user: User) {
  if (!user.email_confirmed_at) {
    return;
  }

  const fullName = (user.user_metadata?.full_name as string | undefined) ?? null;
  const { error } = await supabase.from("profiles").upsert(
    {
      id: user.id,
      full_name: fullName,
      university: "Cavendish University"
    },
    { onConflict: "id" }
  );

  if (error) {
    throw error;
  }
}

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [authBootstrapError, setAuthBootstrapError] = useState<string | null>(null);
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

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, nextSession) => {
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

  const value = useMemo<AuthContextValue>(
    () => ({
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
    }),
    [authBootstrapError, isRecoveryMode, loading, session]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
};
