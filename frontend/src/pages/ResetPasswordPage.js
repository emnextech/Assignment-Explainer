import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { AuthLayout } from "../components/auth/AuthLayout";
import { Button } from "../components/ui/Button";
import { PasswordInput } from "../components/ui/PasswordInput";
import { useAuth } from "../hooks/useAuth";
import { getPasswordUpdateMessage } from "../lib/authMessages";
const validatePassword = (password) => {
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
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const passwordHint = useMemo(() => validatePassword(password), [password]);
    if (!session && !isRecoveryMode) {
        return _jsx(Navigate, { to: "/forgot-password", replace: true });
    }
    const handleSubmit = async (event) => {
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
        }
        catch (submissionError) {
            setError(getPasswordUpdateMessage(submissionError));
        }
        finally {
            setSubmitting(false);
        }
    };
    return (_jsx(AuthLayout, { asideItems: [
            {
                title: "Protected recovery step",
                body: "This page only opens after a valid recovery session or a reset callback from email."
            },
            {
                title: "Strong new credentials",
                body: "The form checks the new password before submission so the student gets guidance before Supabase rejects it."
            },
            {
                title: "Fast handoff",
                body: "After a successful update, the flow moves the student back into the app instead of leaving them stranded."
            }
        ], asideTitle: "Password update", badge: "Secure recovery", description: "Choose a stronger password for your account. Once updated, we will return you to the app.", footer: _jsxs("p", { children: ["Need a fresh link?", " ", _jsx(Link, { to: "/forgot-password", className: "font-semibold text-accent", children: "Request password reset again" })] }), title: "Choose a new password", children: _jsxs("form", { className: "space-y-4", onSubmit: handleSubmit, children: [_jsxs("label", { className: "block space-y-2 text-sm font-semibold text-ink/70", children: ["New password", _jsx(PasswordInput, { autoComplete: "new-password", enterKeyHint: "next", name: "password", placeholder: "Choose a strong password", value: password, onChange: (event) => setPassword(event.target.value) })] }), _jsxs("label", { className: "block space-y-2 text-sm font-semibold text-ink/70", children: ["Confirm new password", _jsx(PasswordInput, { autoComplete: "new-password", enterKeyHint: "go", name: "confirmPassword", placeholder: "Repeat your new password", value: confirmPassword, onChange: (event) => setConfirmPassword(event.target.value) })] }), _jsxs("div", { className: "rounded-[28px] border border-ink/8 bg-sand px-4 py-3 text-sm leading-7 text-ink/72", children: ["Use at least 8 characters with upper and lower case letters and at least one number.", password && !error && passwordHint ? (_jsx("p", { className: "mt-2 font-semibold text-amber-700", children: passwordHint })) : password ? (_jsx("p", { className: "mt-2 font-semibold text-emerald-700", children: "Your new password looks strong." })) : null] }), message ? _jsx("p", { className: "text-sm font-semibold text-emerald-700", children: message }) : null, error ? _jsx("p", { className: "text-sm font-semibold text-rose-600", children: error }) : null, _jsx(Button, { className: "w-full bg-accent", disabled: submitting || !password || !confirmPassword, type: "submit", children: submitting ? "Updating..." : "Update password" })] }) }));
};
