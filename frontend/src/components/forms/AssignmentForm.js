import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import { assignmentInputSchema } from "@assignment-explainer/shared";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";
const initialState = {
    title: "",
    courseName: "",
    questionText: "",
    wordCount: "",
    level: ""
};
const draftStorageKey = "assignment-explainer.assignment-form.draft";
export const AssignmentForm = ({ onSubmit, submitting = false }) => {
    const [values, setValues] = useState(initialState);
    const [fieldErrors, setFieldErrors] = useState({});
    const [error, setError] = useState(null);
    const [draftMessage, setDraftMessage] = useState(null);
    const estimatedReading = useMemo(() => {
        const words = values.questionText.trim().split(/\s+/).filter(Boolean).length;
        if (!words) {
            return null;
        }
        return `${words} words in prompt`;
    }, [values.questionText]);
    useEffect(() => {
        const rawDraft = window.localStorage.getItem(draftStorageKey);
        if (!rawDraft) {
            return;
        }
        try {
            const nextValues = JSON.parse(rawDraft);
            setValues((current) => ({
                ...current,
                ...nextValues
            }));
            setDraftMessage("Draft restored from this browser.");
        }
        catch {
            window.localStorage.removeItem(draftStorageKey);
        }
    }, []);
    useEffect(() => {
        const hasContent = Object.values(values).some((value) => value.trim().length > 0);
        if (!hasContent) {
            window.localStorage.removeItem(draftStorageKey);
            return;
        }
        window.localStorage.setItem(draftStorageKey, JSON.stringify(values));
        setDraftMessage("Draft saved locally on this device.");
    }, [values]);
    const handleChange = (field, value) => {
        const nextValue = field === "wordCount" ? value.replace(/[^\d]/g, "") : value;
        setValues((current) => ({ ...current, [field]: nextValue }));
        setFieldErrors((current) => ({ ...current, [field]: undefined }));
    };
    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);
        setFieldErrors({});
        const payload = {
            title: values.title || null,
            courseName: values.courseName || null,
            questionText: values.questionText,
            wordCount: values.wordCount ? Number(values.wordCount) : null,
            level: values.level || null
        };
        const parsed = assignmentInputSchema.safeParse(payload);
        if (!parsed.success) {
            const nextFieldErrors = {};
            parsed.error.issues.forEach((issue) => {
                const key = issue.path[0];
                if (typeof key === "string" &&
                    ["title", "courseName", "questionText", "wordCount", "level"].includes(key)) {
                    nextFieldErrors[key] ??= issue.message;
                }
            });
            setFieldErrors(nextFieldErrors);
            setError(parsed.error.issues[0]?.message ?? "Please review the form fields.");
            return;
        }
        await onSubmit(parsed.data);
        window.localStorage.removeItem(draftStorageKey);
        setDraftMessage("Draft cleared after successful submission.");
    };
    const handleReset = () => {
        setValues(initialState);
        setFieldErrors({});
        setError(null);
        setDraftMessage("Draft cleared from this device.");
        window.localStorage.removeItem(draftStorageKey);
    };
    return (_jsxs("form", { className: "space-y-5 rounded-[36px] bg-white p-6 shadow-soft", onSubmit: handleSubmit, children: [_jsxs("div", { className: "grid gap-4 md:grid-cols-2", children: [_jsxs("label", { className: "space-y-2 text-sm font-semibold text-ink/70", children: ["Assignment title", _jsx(Input, { autoCapitalize: "words", autoComplete: "off", maxLength: 160, placeholder: "Economics Assignment 1", value: values.title, onChange: (event) => handleChange("title", event.target.value) }), fieldErrors.title ? (_jsx("p", { className: "text-xs font-semibold text-rose-600", children: fieldErrors.title })) : null] }), _jsxs("label", { className: "space-y-2 text-sm font-semibold text-ink/70", children: ["Course name", _jsx(Input, { autoCapitalize: "words", autoComplete: "off", maxLength: 120, placeholder: "Economics", value: values.courseName, onChange: (event) => handleChange("courseName", event.target.value) }), fieldErrors.courseName ? (_jsx("p", { className: "text-xs font-semibold text-rose-600", children: fieldErrors.courseName })) : null] })] }), _jsxs("label", { className: "space-y-2 text-sm font-semibold text-ink/70", children: ["Assignment question", _jsx(Textarea, { autoCapitalize: "sentences", maxLength: 5000, placeholder: "Paste the exact question or brief from your lecturer here.", value: values.questionText, onChange: (event) => handleChange("questionText", event.target.value) }), _jsxs("div", { className: "flex items-center justify-between text-xs text-ink/50", children: [_jsx("span", { children: "We explain the assignment. We do not write the full submission." }), _jsx("span", { children: estimatedReading ?? "Add enough detail for a useful breakdown." })] }), fieldErrors.questionText ? (_jsx("p", { className: "text-xs font-semibold text-rose-600", children: fieldErrors.questionText })) : null] }), _jsxs("div", { className: "grid gap-4 md:grid-cols-2", children: [_jsxs("label", { className: "space-y-2 text-sm font-semibold text-ink/70", children: ["Word count (optional)", _jsx(Input, { inputMode: "numeric", maxLength: 5, placeholder: "1200", value: values.wordCount, onChange: (event) => handleChange("wordCount", event.target.value) }), fieldErrors.wordCount ? (_jsx("p", { className: "text-xs font-semibold text-rose-600", children: fieldErrors.wordCount })) : null] }), _jsxs("label", { className: "space-y-2 text-sm font-semibold text-ink/70", children: ["Level or year (optional)", _jsx(Input, { autoCapitalize: "words", maxLength: 80, placeholder: "Year 1", value: values.level, onChange: (event) => handleChange("level", event.target.value) }), fieldErrors.level ? (_jsx("p", { className: "text-xs font-semibold text-rose-600", children: fieldErrors.level })) : null] })] }), draftMessage ? _jsx("p", { className: "text-sm font-semibold text-ink/55", children: draftMessage }) : null, error ? _jsx("p", { className: "text-sm font-semibold text-rose-600", children: error }) : null, _jsx("div", { className: "rounded-[28px] border border-ink/8 bg-sand px-4 py-4 text-sm leading-7 text-ink/72", children: "The better the brief, the better the explanation. Include the exact command words, any required structure, and the word count if your lecturer gave one." }), _jsxs("div", { className: "flex flex-col gap-3 sm:flex-row sm:items-center", children: [_jsx(Button, { className: "w-full bg-accent sm:w-auto", disabled: submitting, type: "submit", children: submitting ? "Explaining..." : "Explain assignment" }), _jsx(Button, { className: "w-full border border-ink/10 bg-white !text-ink hover:bg-sand sm:w-auto", disabled: submitting, onClick: handleReset, type: "button", children: "Clear form" }), _jsx("p", { className: "text-sm text-ink/60", children: "You can revisit every explanation from the history page." })] })] }));
};
