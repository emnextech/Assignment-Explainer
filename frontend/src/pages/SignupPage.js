import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "../components/auth/AuthLayout";
import { PasswordInput } from "../components/ui/PasswordInput";
import { useAuth } from "../hooks/useAuth";
import { getSignupErrorMessage } from "../lib/authMessages";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
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
export const SignupPage = () => {
    const { signUp } = useAuth();
    const navigate = useNavigate();
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const passwordHint = useMemo(() => validatePassword(password), [password]);
    const handleSubmit = async (event) => {
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
        }
        catch (submissionError) {
            setError(getSignupErrorMessage(submissionError));
        }
        finally {
            setSubmitting(false);
        }
    };
    return (_jsx(AuthLayout, { asideItems: [
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
        ], asideTitle: "Signup experience", badge: "Student onboarding", description: "Create your account with your real name, verify your email, and then enter the student dashboard with a persistent session.", footer: _jsxs("p", { children: ["Already registered?", " ", _jsx(Link, { to: "/login", className: "font-semibold text-accent", children: "Log in" })] }), title: "Create your account", children: _jsxs("form", { className: "space-y-4", onSubmit: handleSubmit, children: [_jsxs("label", { className: "block space-y-2 text-sm font-semibold text-ink/70", children: ["Full name", _jsx(Input, { autoComplete: "name", enterKeyHint: "next", name: "fullName", placeholder: "Emmanuel Ngwenyama", value: fullName, onChange: (event) => setFullName(event.target.value) })] }), _jsxs("label", { className: "block space-y-2 text-sm font-semibold text-ink/70", children: ["Email address", _jsx(Input, { autoCapitalize: "none", autoComplete: "email", autoCorrect: "off", enterKeyHint: "next", inputMode: "email", name: "email", placeholder: "student@example.com", spellCheck: false, type: "email", value: email, onChange: (event) => setEmail(event.target.value) })] }), _jsxs("label", { className: "block space-y-2 text-sm font-semibold text-ink/70", children: ["Create password", _jsx(PasswordInput, { autoComplete: "new-password", enterKeyHint: "next", name: "password", placeholder: "Choose a strong password", value: password, onChange: (event) => setPassword(event.target.value) })] }), _jsxs("label", { className: "block space-y-2 text-sm font-semibold text-ink/70", children: ["Confirm password", _jsx(PasswordInput, { autoComplete: "new-password", enterKeyHint: "go", name: "confirmPassword", placeholder: "Repeat your password", value: confirmPassword, onChange: (event) => setConfirmPassword(event.target.value) })] }), _jsxs("div", { className: "rounded-[28px] border border-ink/8 bg-sand px-4 py-3 text-sm text-ink/72", children: [_jsx("p", { className: "font-semibold text-ink", children: "Password checklist" }), _jsx("p", { className: "mt-1 leading-7", children: "Use at least 8 characters with upper and lower case letters and at least one number." }), password && passwordHint ? (_jsx("p", { className: "mt-2 font-semibold text-amber-700", children: passwordHint })) : password ? (_jsx("p", { className: "mt-2 font-semibold text-emerald-700", children: "Strong enough for signup." })) : null] }), error ? _jsx("p", { className: "text-sm font-semibold text-rose-600", children: error }) : null, _jsx(Button, { className: "w-full bg-accent", disabled: submitting || !fullName.trim() || !email.trim() || !password || !confirmPassword, type: "submit", children: submitting ? "Creating account..." : "Create account" })] }) }));
};
