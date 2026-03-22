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
  const [error, setError] = useState<string | null>(null);

  return (
    <AppShell onSignOut={() => void signOut()}>
      <div className="mb-6 max-w-4xl">
        <p className="text-sm uppercase tracking-[0.25em] text-ink/45">New explanation</p>
        <h1 className="mt-3 font-display text-5xl text-ink md:text-6xl">
          Paste the brief, then let the app untangle it.
        </h1>
        <p className="mt-4 text-sm leading-8 text-ink/65">
          The goal is to help a student understand the assignment faster, prepare research properly,
          and avoid wasting time on the wrong structure or weak interpretation.
        </p>
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div>
          <AssignmentForm
            submitting={createMutation.isPending}
            onSubmit={async (payload) => {
              setError(null);
              try {
                const result = await createMutation.mutateAsync(payload);
                navigate(`/result/${result.explanationId}`);
              } catch (submissionError) {
                const message =
                  submissionError instanceof Error
                    ? submissionError.message
                    : "Unable to generate explanation.";
                setError(message);
              }
            }}
          />
        </div>
        <aside className="space-y-4">
          <div className="rounded-[32px] border border-ink/8 bg-white p-6 shadow-soft">
            <p className="text-sm uppercase tracking-[0.24em] text-ink/45">
              Best results come from
            </p>
            <ul className="mt-5 space-y-4 text-sm leading-7 text-ink/75">
              <li>Pasting the exact lecturer brief instead of paraphrasing it too early.</li>
              <li>Including word count and level so the structure fits the assignment properly.</li>
              <li>
                Leaving the command words exactly as written: discuss, evaluate, compare, analyse,
                justify.
              </li>
            </ul>
          </div>
          <div className="rounded-[32px] border border-ink/8 bg-white p-6 shadow-soft">
            <p className="text-sm uppercase tracking-[0.24em] text-ink/45">
              What the result should help with
            </p>
            <div className="mt-5 grid gap-3">
              {[
                "Understand what the lecturer is actually grading.",
                "Plan the reading and research order.",
                "Break the response into a usable structure.",
                "Avoid common reasoning and interpretation mistakes."
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-[22px] border border-ink/6 bg-sand px-4 py-3 text-sm leading-7 text-ink/75"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
      {authBootstrapError ? (
        <p className="mt-4 text-sm font-semibold text-amber-700">{authBootstrapError}</p>
      ) : null}
      {error ? <p className="mt-4 text-sm font-semibold text-rose-600">{error}</p> : null}
    </AppShell>
  );
};
