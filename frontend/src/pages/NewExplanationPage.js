import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AssignmentForm } from "../components/forms/AssignmentForm";
import { AppShell } from "../components/layout/AppShell";
import { useAuth } from "../hooks/useAuth";
import { useCreateExplanation } from "../hooks/useAssignments";
export const NewExplanationPage = () => {
    const { authBootstrapError, signOut } = useAuth();
    const navigate = useNavigate();
    const createMutation = useCreateExplanation();
    const [error, setError] = useState(null);
    return (_jsxs(AppShell, { onSignOut: () => void signOut(), children: [_jsxs("div", { className: "mb-6 max-w-4xl", children: [_jsx("p", { className: "text-sm uppercase tracking-[0.25em] text-ink/45", children: "New explanation" }), _jsx("h1", { className: "mt-3 font-display text-5xl text-ink md:text-6xl", children: "Paste the brief, then let the app untangle it." }), _jsx("p", { className: "mt-4 text-sm leading-8 text-ink/65", children: "The goal is to help a student understand the assignment faster, prepare research properly, and avoid wasting time on the wrong structure or weak interpretation." })] }), _jsxs("div", { className: "grid gap-6 xl:grid-cols-[1.05fr_0.95fr]", children: [_jsx("div", { children: _jsx(AssignmentForm, { submitting: createMutation.isPending, onSubmit: async (payload) => {
                                setError(null);
                                try {
                                    const result = await createMutation.mutateAsync(payload);
                                    navigate(`/result/${result.explanationId}`);
                                }
                                catch (submissionError) {
                                    const message = submissionError instanceof Error
                                        ? submissionError.message
                                        : "Unable to generate explanation.";
                                    setError(message);
                                }
                            } }) }), _jsxs("aside", { className: "space-y-4", children: [_jsxs("div", { className: "rounded-[32px] border border-ink/8 bg-white p-6 shadow-soft", children: [_jsx("p", { className: "text-sm uppercase tracking-[0.24em] text-ink/45", children: "Best results come from" }), _jsxs("ul", { className: "mt-5 space-y-4 text-sm leading-7 text-ink/75", children: [_jsx("li", { children: "Pasting the exact lecturer brief instead of paraphrasing it too early." }), _jsx("li", { children: "Including word count and level so the structure fits the assignment properly." }), _jsx("li", { children: "Leaving the command words exactly as written: discuss, evaluate, compare, analyse, justify." })] })] }), _jsxs("div", { className: "rounded-[32px] border border-ink/8 bg-white p-6 shadow-soft", children: [_jsx("p", { className: "text-sm uppercase tracking-[0.24em] text-ink/45", children: "What the result should help with" }), _jsx("div", { className: "mt-5 grid gap-3", children: [
                                            "Understand what the lecturer is actually grading.",
                                            "Plan the reading and research order.",
                                            "Break the response into a usable structure.",
                                            "Avoid common reasoning and interpretation mistakes."
                                        ].map((item) => (_jsx("div", { className: "rounded-[22px] border border-ink/6 bg-sand px-4 py-3 text-sm leading-7 text-ink/75", children: item }, item))) })] })] })] }), authBootstrapError ? (_jsx("p", { className: "mt-4 text-sm font-semibold text-amber-700", children: authBootstrapError })) : null, error ? _jsx("p", { className: "mt-4 text-sm font-semibold text-rose-600", children: error }) : null] }));
};
