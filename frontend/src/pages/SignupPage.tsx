import { useMemo, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import { AuthLayout } from "../components/auth/AuthLayout";
import { PasswordInput } from "../components/ui/PasswordInput";
import { useAuth } from "../hooks/useAuth";
import { getSignupErrorMessage } from "../lib/authMessages";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";

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

export const SignupPage = () => {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const passwordHint = useMemo(() => validatePassword(password), [password]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    if (fullName.trim().length < 2) {
      setError("Add the name you want shown around the app.");
      setSubmitting(false);
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      setSubmitting(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Your password confirmation does not match.");
      setSubmitting(false);
      return;
    }

    try {
      await signUp(email.trim(), password, fullName.trim());
      navigate(`/verify-email?email=${encodeURIComponent(email)}`, {
        replace: true
      });
    } catch (submissionError) {
      setError(getSignupErrorMessage(submissionError));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      asideItems={[
        {
          title: "Verification first",
          body: "Creating the account sends the student to a check-email screen. Access only opens after the inbox confirmation is complete."
        },
        {
          title: "Name-first profile",
          body: "The full name you enter here becomes the starting identity for the dashboard, navbar, and profile page."
        },
        {
          title: "Strong password defaults",
          body: "The form encourages passwords that are easier to trust in a real product, while keeping the guidance clear for first-time users."
        }
      ]}
      asideTitle="Signup experience"
      badge="Student onboarding"
      description="Create your account with your real name, verify your email, and then enter the student dashboard with a persistent session."
      footer={
        <p>
          Already registered?{" "}
          <Link to="/login" className="font-semibold text-accent">
            Log in
          </Link>
        </p>
      }
      title="Create your account"
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block space-y-2 text-sm font-semibold text-ink/70">
          Full name
          <Input
            autoComplete="name"
            enterKeyHint="next"
            name="fullName"
            placeholder="Emmanuel Ngwenyama"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
          />
        </label>
        <label className="block space-y-2 text-sm font-semibold text-ink/70">
          Email address
          <Input
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect="off"
            enterKeyHint="next"
            inputMode="email"
            name="email"
            placeholder="student@example.com"
            spellCheck={false}
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>
        <label className="block space-y-2 text-sm font-semibold text-ink/70">
          Create password
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
          Confirm password
          <PasswordInput
            autoComplete="new-password"
            enterKeyHint="go"
            name="confirmPassword"
            placeholder="Repeat your password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
          />
        </label>
        <div className="rounded-[28px] border border-ink/8 bg-sand px-4 py-3 text-sm text-ink/72">
          <p className="font-semibold text-ink">Password checklist</p>
          <p className="mt-1 leading-7">
            Use at least 8 characters with upper and lower case letters and at least one number.
          </p>
          {password && passwordHint ? (
            <p className="mt-2 font-semibold text-amber-700">{passwordHint}</p>
          ) : password ? (
            <p className="mt-2 font-semibold text-emerald-700">Strong enough for signup.</p>
          ) : null}
        </div>
        {error ? <p className="text-sm font-semibold text-rose-600">{error}</p> : null}
        <Button
          className="w-full bg-accent"
          disabled={submitting || !fullName.trim() || !email.trim() || !password || !confirmPassword}
          type="submit"
        >
          {submitting ? "Creating account..." : "Create account"}
        </Button>
      </form>
    </AuthLayout>
  );
};
