import { Link } from "react-router-dom";

import { AppShell } from "../components/layout/AppShell";
import { EmptyState } from "../components/ui/EmptyState";
import { StatusBadge } from "../components/ui/StatusBadge";
import { useAuth } from "../hooks/useAuth";
import { useHistoryList } from "../hooks/useAssignments";

export const DashboardPage = () => {
  const { signOut } = useAuth();
  const historyQuery = useHistoryList();
  const items = historyQuery.data?.items ?? [];
  const recentItems = items.slice(0, 3);
  const completedCount = items.filter((item) => item.status === "completed").length;
  const courseCount = new Set(items.map((item) => item.courseName).filter(Boolean)).size;

  return (
    <AppShell onSignOut={() => void signOut()}>
      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[40px] border border-ink/8 bg-white p-8 shadow-soft md:p-10">
          <p className="text-sm uppercase tracking-[0.25em] text-ink/45">Dashboard</p>
          <h1 className="mt-4 max-w-3xl font-display text-5xl leading-tight text-ink md:text-6xl">
            Understand the assignment before you start writing.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-8 text-ink/68">
            Build a clearer plan for every brief, keep your past explanations organized, and use each result as a practical study guide instead of a passive summary.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link className="rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white" to="/new-explanation">
              Create new explanation
            </Link>
            <Link className="rounded-full border border-ink/10 bg-white px-5 py-3 text-sm font-semibold text-ink" to="/history">
              View history
            </Link>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
          {[
            ["Assignments saved", String(items.length)],
            ["Completed breakdowns", String(completedCount)],
            ["Courses tracked", String(courseCount)]
          ].map(([label, value]) => (
            <div key={label} className="rounded-[30px] border border-ink/8 bg-white p-6 shadow-soft">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-ink/45">{label}</p>
              <p className="mt-4 font-display text-5xl text-ink">{value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-3xl text-ink">Recent explanations</h2>
            <Link className="text-sm font-semibold text-accent" to="/history">
              See all history
            </Link>
          </div>
          {historyQuery.isLoading ? (
            <EmptyState title="Loading history" body="Fetching your saved assignment explanations." />
          ) : recentItems.length === 0 ? (
            <EmptyState
              title="No saved explanations yet"
              body="Create your first explanation to start building a reusable study history."
            />
          ) : (
            <div className="grid gap-4">
              {recentItems.map((item) => (
                <Link
                  className="rounded-[30px] border border-ink/8 bg-white p-5 shadow-soft transition hover:-translate-y-1"
                  key={item.explanationId}
                  to={`/result/${item.explanationId}`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-display text-2xl text-ink">{item.title ?? "Untitled assignment"}</p>
                      <p className="mt-1 text-sm text-ink/60">{item.courseName ?? "General course"}</p>
                    </div>
                    <StatusBadge status={item.status} />
                  </div>
                  <p className="mt-4 line-clamp-2 text-sm leading-7 text-ink/70">{item.questionText}</p>
                </Link>
              ))}
            </div>
          )}
        </div>

        <aside className="rounded-[34px] border border-ink/8 bg-white p-6 shadow-soft">
          <p className="text-sm uppercase tracking-[0.24em] text-ink/45">Make each result more useful</p>
          <ul className="mt-5 space-y-4 text-sm leading-7 text-ink/75">
            <li>Start with the lecturer-intent section before touching your draft.</li>
            <li>Use the step-by-step breakdown to plan your reading order.</li>
            <li>Turn key topics into search phrases for library or web research.</li>
            <li>Compare common mistakes against your outline before submission.</li>
          </ul>
        </aside>
      </section>
    </AppShell>
  );
};
