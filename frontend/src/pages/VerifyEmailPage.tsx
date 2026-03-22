import { useMemo, useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";

import { AuthLayout } from "../components/auth/AuthLayout";
import { AuthNotice } from "../components/auth/AuthNotice";
import { Button } from "../components/ui/Button";
import { useAuth } from "../hooks/useAuth";
import { getResendVerificationMessage } from "../lib/authMessages";
import { resolveRedirectTarget } from "../lib/authRedirect";

type VerificationSource = "signup" | "login" | "session";

const verificationCopy: Record<
  VerificationSource,
  {
    badge: string;
    title: string;
    description: (email: string) => string;
    info: string;
    primaryAction: string;
  }
> = {
  signup: {
    badge: "Email confirmation",
    title: "Check your inbox to finish creating your account.",
    description: (email) =>
      email
        ? `We sent a verification link to ${email}. Open the email, confirm the account, and then come back to sign in.`
        : "We sent a verification link to your email address. Open it, confirm the account, and then come back to sign in.",
    info: "Keep this tab open, confirm your email from your inbox, then return here or continue from the email link.",
    primaryAction: "Resend verification email"
  },
  login: {
    badge: "Verify before login",
    title: "Your account needs email confirmation before sign in.",
    description: (email) =>
      email
        ? `${email} still needs to be verified before we can complete login. Open the original email or request a fresh verification link here.`
        : "Your account still needs to be verified before we can complete login. Open the original email or request a fresh verification link here.",
    info: "Once the email is confirmed, come back through the login screen and your normal sign-in will work.",
    primaryAction: "Send another verification link"
  },
  session: {
    badge: "Verification required",
    title: "Confirm your email to continue into the app.",
    description: (email) =>
      email
        ? `We paused access until ${email} is verified. Confirm the email, then we will send you back to the page you were trying to open.`
        : "We paused access until your email is verified. Confirm the email, then we will send you back to the page you were trying to open.",
    info: "After you confirm the address, the secure callback should bring you back automatically.",
    primaryAction: "Resend verification email"
  }
};

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
  const next = useMemo(() => resolveRedirectTarget(location.search, "/dashboard"), [location.search]);
  const source = useMemo<VerificationSource>(() => {
    const candidate = new URLSearchParams(location.search).get("source");
    return candidate === "login" || candidate === "session" ? candidate : "signup";
  }, [location.search]);
  const copy = verificationCopy[source];

  if (session && isVerified) {
    return <Navigate to={next} replace />;
  }

  const handleResend = async () => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setError("We need the account email to resend the verification link.");
      return;
    }

    setSending(true);
    setError(null);
    setMessage(null);

    try {
      await resendVerification(normalizedEmail);
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
          body: "Signup does not automatically mean full access. Verification protects the account and confirms you can receive account emails."
        },
        {
          title: "Need another email",
          body: "If the first message never arrived, you can request a fresh verification link from this screen."
        }
      ]}
      asideTitle="Verification flow"
      badge={copy.badge}
      description={copy.description(email)}
      title={copy.title}
    >
      <div className="space-y-4">
        <AuthNotice variant="info">{copy.info}</AuthNotice>
        {message ? <AuthNotice variant="success">{message}</AuthNotice> : null}
        {error ? (
          <AuthNotice variant="error" politeness="assertive">
            {error}
          </AuthNotice>
        ) : null}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            className="w-full bg-accent sm:w-auto"
            disabled={sending}
            onClick={() => void handleResend()}
            type="button"
          >
            {sending ? "Sending..." : copy.primaryAction}
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
