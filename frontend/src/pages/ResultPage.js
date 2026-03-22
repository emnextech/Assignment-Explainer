import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useParams } from "react-router-dom";
import { ListCard } from "../components/cards/ListCard";
import { SummaryCard } from "../components/cards/SummaryCard";
import { AppShell } from "../components/layout/AppShell";
import { EmptyState } from "../components/ui/EmptyState";
import { StatusBadge } from "../components/ui/StatusBadge";
import { useAuth } from "../hooks/useAuth";
import { useHistoryItem } from "../hooks/useAssignments";
const buildActionPlan = (steps, topics) => [
    steps[0] ? `Start by ${steps[0].charAt(0).toLowerCase()}${steps[0].slice(1)}.` : null,
    steps[1] ? `Then move to ${steps[1].charAt(0).toLowerCase()}${steps[1].slice(1)}.` : null,
    topics[0] ? `Prioritise research on ${topics[0].toLowerCase()}.` : null,
    topics[1] ? `After that, connect your reading to ${topics[1].toLowerCase()}.` : null
].filter((item) => Boolean(item));
const buildWritingChecklist = (mistakes, structure) => [
    structure[0] ? `Make sure your ${structure[0].toLowerCase()} sets the context and scope clearly.` : null,
    structure[structure.length - 1]
        ? `End with a ${structure[structure.length - 1].toLowerCase()} that answers the brief directly.`
        : null,
    mistakes[0] ? `Avoid ${mistakes[0].charAt(0).toLowerCase()}${mistakes[0].slice(1)}.` : null,
    mistakes[1]
        ? `Double-check that you are not ${mistakes[1].charAt(0).toLowerCase()}${mistakes[1].slice(1)}.`
        : null
].filter((item) => Boolean(item));
const buildWordGuide = (wordCount, structure) => {
    if (!wordCount || structure.length === 0) {
        return [];
    }
    const safeSections = structure.slice(0, 6);
    const weights = safeSections.map((section, index) => {
        const normalized = section.toLowerCase();
        if (normalized.includes("introduction")) {
            return 0.15;
        }
        if (normalized.includes("conclusion")) {
            return 0.1;
        }
        if (index === 0) {
            return 0.15;
        }
        return 0.75 / Math.max(safeSections.length - 1, 1);
    });
    return safeSections.map((section, index) => {
        const words = Math.max(80, Math.round(wordCount * weights[index]));
        return `${section}: about ${words} words`;
    });
};
export const ResultPage = () => {
    const { id = "" } = useParams();
    const { signOut } = useAuth();
    const itemQuery = useHistoryItem(id);
    const item = itemQuery.data;
    return (_jsx(AppShell, { onSignOut: () => void signOut(), children: itemQuery.isLoading ? (_jsx(EmptyState, { title: "Loading result", body: "Pulling the explanation details from your history." })) : !item ? (_jsx(EmptyState, { title: "Result not found", body: "This explanation may have been deleted or never existed." })) : (_jsxs("div", { className: "space-y-6", children: [_jsx("section", { className: "rounded-[36px] border border-ink/8 bg-white p-8 shadow-soft", children: _jsxs("div", { className: "flex flex-wrap items-start justify-between gap-4", children: [_jsxs("div", { className: "max-w-3xl", children: [_jsx("p", { className: "text-sm uppercase tracking-[0.25em] text-ink/45", children: "Assignment result" }), _jsx("h1", { className: "mt-3 font-display text-5xl text-ink", children: item.title ?? "Untitled assignment" }), _jsx("p", { className: "mt-3 text-sm leading-7 text-ink/70", children: item.questionText }), _jsxs("div", { className: "mt-5 flex flex-wrap gap-2", children: [item.courseName ? (_jsx("span", { className: "rounded-full bg-sand px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-ink/70", children: item.courseName })) : null, item.level ? (_jsx("span", { className: "rounded-full bg-sand px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-ink/70", children: item.level })) : null, item.wordCount ? (_jsxs("span", { className: "rounded-full bg-sand px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-ink/70", children: [item.wordCount, " words"] })) : null] })] }), _jsx(StatusBadge, { status: item.status })] }) }), item.status !== "completed" || !item.result ? (_jsx(EmptyState, { title: item.status === "refused" ? "The request was refused" : "The explanation did not complete", body: item.refusalReason ??
                        item.errorMessage ??
                        "Try refining the prompt, then generate another explanation from the New page." })) : (_jsxs(_Fragment, { children: [_jsx("section", { className: "grid gap-4 md:grid-cols-3", children: [
                                [
                                    "Next action",
                                    buildActionPlan(item.result.stepByStep, item.result.keyTopics)[0] ??
                                        "Start with the first step in the breakdown."
                                ],
                                [
                                    "Research focus",
                                    item.result.keyTopics[0] ?? "Review the first key topic before drafting."
                                ],
                                [
                                    "Main risk",
                                    item.result.commonMistakes[0] ?? "Check the common mistakes before writing."
                                ]
                            ].map(([label, value]) => (_jsxs("div", { className: "rounded-[28px] border border-ink/8 bg-white p-5 shadow-soft", children: [_jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.22em] text-ink/45", children: label }), _jsx("p", { className: "mt-3 text-sm leading-7 text-ink/78", children: value })] }, label))) }), _jsxs("div", { className: "grid gap-6 lg:grid-cols-2", children: [_jsx(SummaryCard, { title: "Simplified Explanation", body: item.result.simplifiedExplanation }), _jsx(SummaryCard, { title: "What the Lecturer Wants", body: item.result.lecturerIntent }), _jsx(ListCard, { title: "Step-by-Step Breakdown", items: item.result.stepByStep }), _jsx(ListCard, { title: "Suggested Structure", items: item.result.suggestedStructure }), _jsx(ListCard, { title: "Key Topics to Research", items: item.result.keyTopics }), _jsx(ListCard, { title: "Common Mistakes", items: item.result.commonMistakes }), _jsx(ListCard, { title: "Action Plan For This Assignment", items: buildActionPlan(item.result.stepByStep, item.result.keyTopics) }), _jsx(ListCard, { title: "Before You Start Writing", items: buildWritingChecklist(item.result.commonMistakes, item.result.suggestedStructure) }), item.wordCount ? (_jsx(ListCard, { title: "Suggested Word Budget", items: buildWordGuide(item.wordCount, item.result.suggestedStructure) })) : null] })] }))] })) }));
};
