import clsx from "clsx";

import type { ExplanationStatus } from "@assignment-explainer/shared";

const steps = [
  "Parse assignment brief",
  "Extract lecturer intent",
  "Build study structure",
  "Generate final breakdown"
] as const;

const hashSeed = (seed: string) =>
  seed.split("").reduce((total, char) => total + char.charCodeAt(0), 0);

const getCurrentStepIndex = (status: ExplanationStatus, explanationId: string) => {
  const pendingStep = (hashSeed(explanationId) % 3) + 1;

  if (status === "completed") {
    return 3;
  }

  if (status === "pending") {
    return pendingStep;
  }

  if (status === "refused") {
    return 1;
  }

  return Math.min(pendingStep, 2);
};

const statusLabel: Record<ExplanationStatus, string> = {
  pending: "AI is processing",
  completed: "Generation completed",
  failed: "Generation interrupted",
  refused: "Safety policy refused"
};

export const AiProgressChart = ({
  explanationId,
  status
}: {
  explanationId: string;
  status: ExplanationStatus;
}) => {
  const currentStepIndex = getCurrentStepIndex(status, explanationId);

  return (
    <section
      className="mt-4 rounded-2xl border border-ink/8 bg-sand/70 p-4"
      aria-label="AI progress"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink/52">
          AI processing flow
        </p>
        <p className="text-xs font-semibold text-ink/60">{statusLabel[status]}</p>
      </div>

      <ol className="mt-3 space-y-2.5">
        {steps.map((step, index) => {
          const isDone = index < currentStepIndex || status === "completed";
          const isCurrent = index === currentStepIndex && status === "pending";
          const isBlocked =
            index === currentStepIndex && (status === "failed" || status === "refused");

          let fillWidth = "0%";
          if (isDone) {
            fillWidth = "100%";
          } else if (isCurrent) {
            fillWidth = "64%";
          } else if (isBlocked) {
            fillWidth = "35%";
          }

          const stateText = isDone
            ? "Done"
            : isCurrent
              ? "In progress"
              : isBlocked
                ? "Blocked"
                : "Queued";

          return (
            <li key={step} className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
              <span
                className={clsx(
                  "h-2.5 w-2.5 rounded-full",
                  isDone && "bg-emerald-500",
                  isCurrent && "bg-accent animate-pulse",
                  isBlocked && "bg-rose-500",
                  !isDone && !isCurrent && !isBlocked && "bg-ink/20"
                )}
              />

              <div>
                <p className="text-xs font-semibold text-ink/78">{step}</p>
                <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-ink/10">
                  <div
                    className={clsx(
                      "h-full rounded-full transition-all duration-700",
                      isDone && "bg-emerald-500",
                      isCurrent && "bg-accent",
                      isBlocked && "bg-rose-500"
                    )}
                    style={{ width: fillWidth }}
                  />
                </div>
              </div>

              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/52">
                {stateText}
              </span>
            </li>
          );
        })}
      </ol>
    </section>
  );
};
