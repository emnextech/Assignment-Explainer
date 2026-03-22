import { useParams } from "react-router-dom";

import { ListCard } from "../components/cards/ListCard";
import { SummaryCard } from "../components/cards/SummaryCard";
import { AppShell } from "../components/layout/AppShell";
import { EmptyState } from "../components/ui/EmptyState";
import { StatusBadge } from "../components/ui/StatusBadge";
import { useAuth } from "../hooks/useAuth";
import { useHistoryItem } from "../hooks/useAssignments";

const buildActionPlan = (steps: string[], topics: string[]) =>
  [
    steps[0] ? `Start by ${steps[0].charAt(0).toLowerCase()}${steps[0].slice(1)}.` : null,
    steps[1] ? `Then move to ${steps[1].charAt(0).toLowerCase()}${steps[1].slice(1)}.` : null,
    topics[0] ? `Prioritise research on ${topics[0].toLowerCase()}.` : null,
    topics[1] ? `After that, connect your reading to ${topics[1].toLowerCase()}.` : null
  ].filter((item): item is string => Boolean(item));

const buildWritingChecklist = (mistakes: string[], structure: string[]) =>
  [
    structure[0]
      ? `Make sure your ${structure[0].toLowerCase()} sets the context and scope clearly.`
      : null,
    structure[structure.length - 1]
      ? `End with a ${structure[structure.length - 1].toLowerCase()} that answers the brief directly.`
      : null,
    mistakes[0] ? `Avoid ${mistakes[0].charAt(0).toLowerCase()}${mistakes[0].slice(1)}.` : null,
    mistakes[1]
      ? `Double-check that you are not ${mistakes[1].charAt(0).toLowerCase()}${mistakes[1].slice(1)}.`
      : null
  ].filter((item): item is string => Boolean(item));

const buildWordGuide = (wordCount: number | null, structure: string[]) => {
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
  const errorMessage =
    itemQuery.error instanceof Error
      ? itemQuery.error.message
      : "We could not load this explanation right now.";

  return (
    <AppShell onSignOut={() => void signOut()}>
      {itemQuery.isLoading ? (
        <EmptyState
          title="Loading result"
          body="Pulling the explanation details from your history."
        />
      ) : itemQuery.isError ? (
        <EmptyState title="Result unavailable" body={errorMessage} />
      ) : !item ? (
        <EmptyState
          title="Result not found"
          body="This explanation may have been deleted or never existed."
        />
      ) : (
        <div className="space-y-6">
          <section className="rounded-[36px] border border-ink/8 bg-white p-8 shadow-soft">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-3xl">
                <p className="text-sm uppercase tracking-[0.25em] text-ink/45">Assignment result</p>
                <h1 className="mt-3 font-display text-5xl text-ink">
                  {item.title ?? "Untitled assignment"}
                </h1>
                <p className="mt-3 text-sm leading-7 text-ink/70">{item.questionText}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {item.courseName ? (
                    <span className="rounded-full bg-sand px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-ink/70">
                      {item.courseName}
                    </span>
                  ) : null}
                  {item.level ? (
                    <span className="rounded-full bg-sand px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-ink/70">
                      {item.level}
                    </span>
                  ) : null}
                  {item.wordCount ? (
                    <span className="rounded-full bg-sand px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-ink/70">
                      {item.wordCount} words
                    </span>
                  ) : null}
                </div>
              </div>
              <StatusBadge status={item.status} />
            </div>
          </section>

          {item.status !== "completed" || !item.result ? (
            <EmptyState
              title={
                item.status === "refused"
                  ? "The request was refused"
                  : "The explanation did not complete"
              }
              body={
                item.refusalReason ??
                item.errorMessage ??
                "Try refining the prompt, then generate another explanation from the New page."
              }
            />
          ) : (
            <>
              <section className="grid gap-4 md:grid-cols-3">
                {[
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
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-[28px] border border-ink/8 bg-white p-5 shadow-soft"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-ink/45">
                      {label}
                    </p>
                    <p className="mt-3 text-sm leading-7 text-ink/78">{value}</p>
                  </div>
                ))}
              </section>

              <div className="grid gap-6 lg:grid-cols-2">
                <SummaryCard
                  title="Simplified Explanation"
                  body={item.result.simplifiedExplanation}
                />
                <SummaryCard title="What the Lecturer Wants" body={item.result.lecturerIntent} />
                <ListCard title="Step-by-Step Breakdown" items={item.result.stepByStep} />
                <ListCard title="Suggested Structure" items={item.result.suggestedStructure} />
                <ListCard title="Key Topics to Research" items={item.result.keyTopics} />
                <ListCard title="Common Mistakes" items={item.result.commonMistakes} />
                <ListCard
                  title="Action Plan For This Assignment"
                  items={buildActionPlan(item.result.stepByStep, item.result.keyTopics)}
                />
                <ListCard
                  title="Before You Start Writing"
                  items={buildWritingChecklist(
                    item.result.commonMistakes,
                    item.result.suggestedStructure
                  )}
                />
                {item.wordCount ? (
                  <ListCard
                    title="Suggested Word Budget"
                    items={buildWordGuide(item.wordCount, item.result.suggestedStructure)}
                  />
                ) : null}
              </div>
            </>
          )}
        </div>
      )}
    </AppShell>
  );
};
