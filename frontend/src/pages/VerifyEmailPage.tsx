import { useMemo, useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";

import { AuthLayout } from "../components/auth/AuthLayout";
import { Button } from "../components/ui/Button";
import { useAuth } from "../hooks/useAuth";
import { getResendVerificationMessage } from "../lib/authMessages";

export const VerifyEmailPage = () => {
  const { isVerified, resendVerification, session } = useAuth();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const email = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("email") ?? session?.user?.email ?? "";
  }, [location.search, session?.user?.email]);
  const next = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const candidate = params.get("next");
    return candidate?.startsWith("/") && !candidate.startsWith("//") ? candidate : "/dashboard";
  }, [location.search]);

  if (session && isVerified) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleResend = async () => {
    if (!email) {
      setError("We need the account email to resend the verification link.");
      return;
    }

    setSending(true);
    setError(null);
    setMessage(null);

    try {
      await resendVerification(email);
      setMessage("A fresh verification email has been sent.");
    } catch (submissionError) {
      setError(getResendVerificationMessage(submissionError));
    } finally {
      setSending(false);
    }
  };

  return (
    <AuthLayout
      asideItems={[
        {
          title: "What happens next",
          body: "Open the verification email, confirm the account, then return through the secure callback route."
        },
        {
          title: "Why we pause access",
          body: "Signup does not automatically mean full access. Verification protects the account and confirms the student can receive account emails."
        },
        {
          title: "Need another email",
          body: "If the first message never arrived, you can request a fresh verification link from this screen."
        }
      ]}
      asideTitle="Verification flow"
      badge="Email confirmation"
      description={
        email
          ? `We sent a verification link to ${email}. Open the email, confirm your account, and then return to log in.`
          : "We sent a verification link to your email address. Open it, confirm your account, and then return to log in."
      }
      title="Check your inbox to verify your email before logging in."
    >
      <div className="space-y-4">
        <div className="rounded-[28px] border border-ink/8 bg-sand px-4 py-4 text-sm leading-7 text-ink/72">
          <p className="font-semibold text-ink">Best next step</p>
          <p className="mt-1">
            Keep this tab open, verify your account from the email, and then come back here or use the link in the email to continue.
          </p>
        </div>
        {message ? <p className="text-sm font-semibold text-emerald-700">{message}</p> : null}
        {error ? <p className="text-sm font-semibold text-rose-600">{error}</p> : null}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            className="w-full bg-accent sm:w-auto"
            disabled={sending}
            onClick={() => void handleResend()}
            type="button"
          >
            {sending ? "Sending..." : "Resend verification email"}
          </Button>
          <Link
            className="inline-flex w-full items-center justify-center rounded-full border border-ink/10 bg-white px-5 py-3.5 text-base font-semibold text-ink transition hover:bg-sand sm:w-auto sm:text-sm"
            to={`/login?verify=1&next=${encodeURIComponent(next)}${email ? `&email=${encodeURIComponent(email)}` : ""}`}
          >
            Back to login
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};
