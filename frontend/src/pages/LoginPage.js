import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { AuthLayout } from "../components/auth/AuthLayout";
import { PasswordInput } from "../components/ui/PasswordInput";
import { useAuth } from "../hooks/useAuth";
import { getLoginErrorMessage, getResendVerificationMessage, isVerificationError } from "../lib/authMessages";
import { clearRedirectTarget, resolveRedirectTarget, writeRedirectTarget } from "../lib/authRedirect";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
export const LoginPage = () => {
    const { authBootstrapError, resendVerification, session, isVerified, signIn } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const initialEmail = new URLSearchParams(location.search).get("email") ?? "";
    const [email, setEmail] = useState(initialEmail);
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const [resending, setResending] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const next = resolveRedirectTarget(location.search, "/dashboard");
    if (session && isVerified) {
        return _jsx(Navigate, { to: next, replace: true });
    }
    const needsVerification = new URLSearchParams(location.search).get("verify") === "1";
    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmitting(true);
        setError(null);
        setMessage(null);
        try {
            await signIn(email, password);
            clearRedirectTarget();
            navigate(next, { replace: true });
        }
        catch (submissionError) {
            if (isVerificationError(submissionError)) {
                writeRedirectTarget(next);
                navigate(`/verify-email?email=${encodeURIComponent(email)}&next=${encodeURIComponent(next)}`, { replace: true });
                return;
            }
            setError(getLoginErrorMessage(submissionError));
        }
        finally {
            setSubmitting(false);
        }
    };
    const handleResendVerification = async () => {
        if (!email) {
            setError("Enter the email address you want to verify first.");
            return;
        }
        setResending(true);
        setError(null);
        setMessage(null);
        try {
            await resendVerification(email);
            setMessage("A fresh verification email has been sent.");
        }
        catch (submissionError) {
            setError(getResendVerificationMessage(submissionError));
        }
        finally {
            setResending(false);
        }
    };
    return (_jsx(AuthLayout, { asideItems: [
            {
                title: "Where you return after login",
                body: "If you were heading to a protected page, we send you back there after sign-in instead of dumping you on the wrong screen."
            },
            {
                title: "Safe feedback",
                body: "Login errors stay exact but safe. The form never tells someone whether a specific account exists."
            },
            {
                title: "Session stays stable",
                body: "Once signed in, the app restores your session on refresh and avoids redirect flicker on protected pages."
            }
        ], asideTitle: "What this form gets right", badge: "Secure login", description: "Sign in to continue reviewing saved explanations, manage your profile, or create a fresh assignment breakdown.", footer: _jsxs("p", { children: ["Need an account?", " ", _jsx(Link, { to: "/signup", className: "font-semibold text-accent", children: "Create one" })] }), title: "Welcome back", children: _jsxs("form", { className: "space-y-4", onSubmit: handleSubmit, children: [authBootstrapError ? (_jsx("p", { className: "rounded-3xl bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700", children: authBootstrapError })) : null, needsVerification ? (_jsx("p", { className: "rounded-3xl bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700", children: "Verify your email first, then sign in." })) : null, _jsxs("label", { className: "block space-y-2 text-sm font-semibold text-ink/70", children: ["Email address", _jsx(Input, { autoCapitalize: "none", autoComplete: "email", autoCorrect: "off", enterKeyHint: "next", inputMode: "email", name: "email", placeholder: "student@example.com", spellCheck: false, type: "email", value: email, onChange: (event) => setEmail(event.target.value) })] }), _jsxs("label", { className: "block space-y-2 text-sm font-semibold text-ink/70", children: ["Password", _jsx(PasswordInput, { autoComplete: "current-password", enterKeyHint: "go", name: "password", placeholder: "Enter your password", value: password, onChange: (event) => setPassword(event.target.value) })] }), _jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3 text-sm", children: [_jsx(Link, { to: "/forgot-password", className: "font-semibold text-accent", children: "Forgot password?" }), _jsx("button", { className: "font-semibold text-ink/70 underline-offset-4 hover:text-ink hover:underline", disabled: resending, onClick: () => void handleResendVerification(), type: "button", children: resending ? "Sending verification..." : "Resend verification email" })] }), message ? _jsx("p", { className: "text-sm font-semibold text-emerald-700", children: message }) : null, error ? _jsx("p", { className: "text-sm font-semibold text-rose-600", children: error }) : null, _jsx(Button, { className: "w-full bg-accent", disabled: submitting || !email.trim() || !password, type: "submit", children: submitting ? "Signing in..." : "Log in" })] }) }));
};
