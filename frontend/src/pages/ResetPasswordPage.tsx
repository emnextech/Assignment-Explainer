import { useMemo, useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

import { AuthLayout } from "../components/auth/AuthLayout";
import { AuthNotice } from "../components/auth/AuthNotice";
import { PasswordChecklist } from "../components/auth/PasswordChecklist";
import { Button } from "../components/ui/Button";
import { PasswordInput } from "../components/ui/PasswordInput";
import { useAuth } from "../hooks/useAuth";
import { getPasswordUpdateMessage } from "../lib/authMessages";

const validatePassword = (password: string) => {
  if (password.length < 8) {
    return "Use at least 8 characters.";
  }

  if (!/[A-Z]/.test(password)) {
    return "Add at least one uppercase letter.";
  }

  if (!/[a-z]/.test(password)) {
    return "Add at least one lowercase letter.";
  }

  if (!/\d/.test(password)) {
    return "Add at least one number.";
  }

  return null;
};

export const ResetPasswordPage = () => {
  const { consumeRecoveryMode, isRecoveryMode, session, updatePassword } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const passwordHint = useMemo(() => validatePassword(password), [password]);

  if (!session && !isRecoveryMode) {
    return <Navigate to="/forgot-password" replace />;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setMessage(null);

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      setError("Your passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      await updatePassword(password);
      consumeRecoveryMode();
      setMessage("Your password has been updated. Redirecting you to your workspace...");
      setPassword("");
      setConfirmPassword("");
      window.setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 1200);
    } catch (submissionError) {
      setError(getPasswordUpdateMessage(submissionError));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      asideItems={[
        {
          title: "Protected recovery step",
          body: "This page only opens after a valid recovery session or a reset callback from email."
        },
        {
          title: "Strong new credentials",
          body: "The form checks the new password before submission so you get guidance before Supabase rejects it."
        },
        {
          title: "Fast handoff",
          body: "After a successful update, the flow moves you back into the app instead of leaving you stranded."
        }
      ]}
      asideTitle="Password update"
      badge="Secure recovery"
      description="Choose a stronger password for your account. Once updated, we will return you to the app."
      footer={
        <p>
          Need a fresh link?{" "}
          <Link to="/forgot-password" className="font-semibold text-accent">
            Request password reset again
          </Link>
        </p>
      }
      title="Choose a new password"
    >
      <form className="space-y-3.5" onSubmit={handleSubmit}>
        <label className="block space-y-2 text-sm font-semibold text-ink/70">
          New password
          <PasswordInput
            autoComplete="new-password"
            enterKeyHint="next"
            name="password"
            placeholder="Choose a strong password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        <label className="block space-y-2 text-sm font-semibold text-ink/70">
          Confirm new password
          <PasswordInput
            autoComplete="new-password"
            enterKeyHint="go"
            name="confirmPassword"
            placeholder="Repeat your new password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
          />
        </label>
        <PasswordChecklist password={password} />
        {password && !error && passwordHint ? (
          <AuthNotice variant="warning">{passwordHint}</AuthNotice>
        ) : null}
        {message ? <AuthNotice variant="success">{message}</AuthNotice> : null}
        {error ? (
          <AuthNotice variant="error" politeness="assertive">
            {error}
          </AuthNotice>
        ) : null}
        <Button
          className="w-full bg-accent"
          disabled={submitting || !password || !confirmPassword}
          type="submit"
        >
          {submitting ? "Updating..." : "Update password"}
        </Button>
      </form>
    </AuthLayout>
  );
};
