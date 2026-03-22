import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Link } from "react-router-dom";
import { AuthLayout } from "../components/auth/AuthLayout";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { useAuth } from "../hooks/useAuth";
import { getPasswordResetRequestMessage } from "../lib/authMessages";
export const ForgotPasswordPage = () => {
    const { requestPasswordReset } = useAuth();
    const [email, setEmail] = useState("");
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmitting(true);
        setError(null);
        setMessage(null);
        try {
            await requestPasswordReset(email);
            setMessage("If that email exists, a password reset link is on its way. Check your inbox and spam folder.");
        }
        catch (submissionError) {
            setError(getPasswordResetRequestMessage(submissionError));
        }
        finally {
            setSubmitting(false);
        }
    };
    return (_jsx(AuthLayout, { asideItems: [
            {
                title: "No account leakage",
                body: "The success message stays generic, so this form does not confirm whether a specific email address has an account."
            },
            {
                title: "Secure return path",
                body: "The reset link returns through your callback route, then moves the student into the password update screen."
            },
            {
                title: "Works on mobile",
                body: "The reset experience is designed for students who open the email link directly from a phone."
            }
        ], asideTitle: "Password recovery", badge: "Password reset", description: "Enter your account email and we will send a secure reset link if the address is registered.", footer: _jsxs("p", { children: ["Remembered it?", " ", _jsx(Link, { to: "/login", className: "font-semibold text-accent", children: "Back to login" })] }), title: "Reset your password", children: _jsxs("form", { className: "space-y-4", onSubmit: handleSubmit, children: [_jsxs("label", { className: "block space-y-2 text-sm font-semibold text-ink/70", children: ["Account email", _jsx(Input, { autoCapitalize: "none", autoComplete: "email", autoCorrect: "off", inputMode: "email", name: "email", placeholder: "student@example.com", spellCheck: false, type: "email", value: email, onChange: (event) => setEmail(event.target.value) })] }), _jsx("p", { className: "rounded-[28px] border border-ink/8 bg-sand px-4 py-3 text-sm leading-7 text-ink/72", children: "For privacy, we always show the same confirmation message whether the account exists or not." }), message ? _jsx("p", { className: "text-sm font-semibold text-emerald-700", children: message }) : null, error ? _jsx("p", { className: "text-sm font-semibold text-rose-600", children: error }) : null, _jsx(Button, { className: "w-full bg-accent", disabled: submitting || !email.trim(), type: "submit", children: submitting ? "Sending..." : "Send reset link" })] }) }));
};
