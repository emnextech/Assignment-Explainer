import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import { AuthLayout } from "../components/auth/AuthLayout";
import { AuthNotice } from "../components/auth/AuthNotice";
import { PasswordChecklist } from "../components/auth/PasswordChecklist";
import { PasswordInput } from "../components/ui/PasswordInput";
import { useAuth } from "../hooks/useAuth";
import { getSignupErrorMessage, isRateLimitError } from "../lib/authMessages";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";

const SIGNUP_RETRY_COOLDOWN_MS = 60_000;

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
  const [cooldownUntil, setCooldownUntil] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [submitting, setSubmitting] = useState(false);
  const passwordHint = useMemo(() => validatePassword(password), [password]);
  const cooldownSeconds = useMemo(() => {
    if (!cooldownUntil) {
      return 0;
    }

    return Math.max(0, Math.ceil((cooldownUntil - now) / 1000));
  }, [cooldownUntil, now]);
  const isCooldownActive = cooldownSeconds > 0;

  useEffect(() => {
    if (!cooldownUntil) {
      return;
    }

    const timer = window.setInterval(() => {
      const currentTime = Date.now();
      setNow(currentTime);

      if (currentTime >= cooldownUntil) {
        setCooldownUntil(null);
      }
    }, 1000);

    return () => window.clearInterval(timer);
  }, [cooldownUntil]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isCooldownActive) {
      setError(
        `Signup is cooling down for this network. Try again in ${cooldownSeconds}s or log in if the account was already created.`
      );
      return;
    }

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
      await signUp(email.trim().toLowerCase(), password, fullName.trim());
      navigate(
        `/verify-email?email=${encodeURIComponent(email.trim().toLowerCase())}&source=signup`,
        {
          replace: true
        }
      );
    } catch (submissionError) {
      if (isRateLimitError(submissionError)) {
        setCooldownUntil(Date.now() + SIGNUP_RETRY_COOLDOWN_MS);
        setNow(Date.now());
      }

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
          body: "Creating the account sends you to a check-email screen. Access only opens after inbox confirmation is complete."
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
      badge="Account onboarding"
      description="Create your account with your real name, verify your email, and then enter your dashboard with a persistent session."
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
      <form className="space-y-3.5" onSubmit={handleSubmit}>
        {isCooldownActive ? (
          <AuthNotice variant="warning">
            Signup is temporarily paused for this network for {cooldownSeconds}s. This can happen on
            shared Wi-Fi when another person has already triggered the signup limit.
          </AuthNotice>
        ) : null}
        <AuthNotice variant="info">
          If you are on school, office, or hostel Wi-Fi, another person on the same network can
          trigger Supabase signup rate limits. If that happens, wait a minute or switch to login if
          the account was already created.
        </AuthNotice>
        <label className="block space-y-2 text-sm font-semibold text-ink/70">
          Full name
          <Input
            autoCapitalize="words"
            autoComplete="name"
            enterKeyHint="next"
            name="fullName"
            placeholder="Your full name"
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
            placeholder="example@gmail.com"
            spellCheck={false}
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <p className="text-xs font-semibold text-ink/50">
            Use any email you can access for verification.
          </p>
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
        <PasswordChecklist password={password} />
        {password && passwordHint ? (
          <AuthNotice variant="warning">{passwordHint}</AuthNotice>
        ) : null}
        {error ? (
          <AuthNotice variant="error" politeness="assertive">
            {error}
          </AuthNotice>
        ) : null}
        <Button
          className="w-full bg-accent"
          disabled={
            submitting ||
            isCooldownActive ||
            !fullName.trim() ||
            !email.trim() ||
            !password ||
            !confirmPassword
          }
          type="submit"
        >
          {submitting
            ? "Creating account..."
            : isCooldownActive
              ? `Try again in ${cooldownSeconds}s`
              : "Create account"}
        </Button>
      </form>
    </AuthLayout>
  );
};
