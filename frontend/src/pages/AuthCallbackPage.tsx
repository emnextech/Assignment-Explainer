import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import type { EmailOtpType } from "@supabase/supabase-js";

import { supabase } from "../lib/supabase";
import { clearRedirectTarget, resolveRedirectTarget } from "../lib/authRedirect";

const allowedOtpTypes = new Set<EmailOtpType>([
  "signup",
  "invite",
  "magiclink",
  "recovery",
  "email_change"
]);

export const AuthCallbackPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);

  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const next = resolveRedirectTarget(location.search, "/dashboard");

  useEffect(() => {
    let cancelled = false;

    const finalizeAuth = async () => {
      const queryError = params.get("error_description") ?? params.get("error");
      if (queryError) {
        if (!cancelled) {
          setError(queryError);
        }
        return;
      }

      const code = params.get("code");
      if (code) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

        if (exchangeError) {
          if (!cancelled) {
            setError(exchangeError.message);
          }
          return;
        }
      }

      const tokenHash = params.get("token_hash");
      const type = params.get("type") as EmailOtpType | null;

      if (tokenHash && type && allowedOtpTypes.has(type)) {
        const { error: verifyError } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type
        });

        if (verifyError) {
          if (!cancelled) {
            setError(verifyError.message);
          }
          return;
        }
      }

      const {
        data: { session },
        error: sessionError
      } = await supabase.auth.getSession();

      if (sessionError) {
        if (!cancelled) {
          setError(sessionError.message);
        }
        return;
      }

      if (!session) {
        if (!cancelled) {
          setError("Your auth link is missing or has expired. Request a new one and try again.");
        }
        return;
      }

      const redirectTarget =
        type === "recovery" || next === "/reset-password" ? "/reset-password" : next;

      clearRedirectTarget();
      navigate(redirectTarget, { replace: true });
    };

    void finalizeAuth();

    return () => {
      cancelled = true;
    };
  }, [navigate, next, params]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-sand px-6 py-10">
      <div className="w-full max-w-lg rounded-[36px] bg-white p-8 shadow-soft">
        <h1 className="font-display text-4xl text-ink">
          {error ? "Authentication link problem" : "Securing your session"}
        </h1>
        <p className="mt-4 text-sm leading-7 text-ink/65">
          {error
            ? error
            : "We are confirming your email action and preparing the next secure page."}
        </p>
        {error ? (
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              className="rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white"
              to={`/login?next=${encodeURIComponent(next)}`}
            >
              Go to login
            </Link>
            <Link
              className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-ink ring-1 ring-ink/10"
              to="/forgot-password"
            >
              Reset password again
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
};
