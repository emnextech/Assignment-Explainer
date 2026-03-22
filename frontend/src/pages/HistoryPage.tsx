import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { AppShell } from "../components/layout/AppShell";
import { EmptyState } from "../components/ui/EmptyState";
import { Input } from "../components/ui/Input";
import { StatusBadge } from "../components/ui/StatusBadge";
import { useAuth } from "../hooks/useAuth";
import { useHistoryList } from "../hooks/useAssignments";

export const HistoryPage = () => {
  const { signOut } = useAuth();
  const historyQuery = useHistoryList();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const items = historyQuery.data?.items ?? [];
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesQuery =
        !query.trim() ||
        [item.title, item.courseName, item.questionText]
          .filter(Boolean)
          .some((value) => value!.toLowerCase().includes(query.toLowerCase()));

      const matchesStatus = statusFilter === "all" || item.status === statusFilter;

      return matchesQuery && matchesStatus;
    });
  }, [items, query, statusFilter]);

  return (
    <AppShell onSignOut={() => void signOut()}>
      <div className="mb-6 max-w-4xl">
        <p className="text-sm uppercase tracking-[0.25em] text-ink/45">History</p>
        <h1 className="mt-3 font-display text-5xl text-ink md:text-6xl">
          Every explanation you have saved, in one place.
        </h1>
        <p className="mt-4 text-sm leading-8 text-ink/65">
          Revisit older briefs, compare how different courses frame their questions, and open each breakdown when you need a faster restart.
        </p>
      </div>
      <div className="mb-6 grid gap-4 rounded-[30px] border border-ink/8 bg-white p-5 shadow-soft md:grid-cols-[1fr_auto]">
        <Input
          placeholder="Search by title, course, or assignment question"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <div className="flex flex-wrap gap-2">
          {["all", "completed", "pending", "failed", "refused"].map((status) => (
            <button
              key={status}
              className={[
                "rounded-full px-4 py-2 text-sm font-semibold transition",
                statusFilter === status
                  ? "bg-ink text-white"
                  : "border border-ink/10 bg-sand text-ink/70"
              ].join(" ")}
              onClick={() => setStatusFilter(status)}
              type="button"
            >
              {status}
            </button>
          ))}
        </div>
      </div>
      {historyQuery.isLoading ? (
        <EmptyState title="Loading history" body="Collecting your latest assignment explanations." />
      ) : filteredItems.length ? (
        <div className="grid gap-4">
          {filteredItems.map((item) => (
            <Link
              key={item.explanationId}
              to={`/result/${item.explanationId}`}
              className="rounded-[32px] border border-ink/8 bg-white p-6 shadow-soft transition hover:-translate-y-1"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="max-w-3xl">
                  <p className="font-display text-2xl text-ink">{item.title ?? "Untitled assignment"}</p>
                  <p className="mt-1 text-sm text-ink/55">{item.courseName ?? "General course"}</p>
                </div>
                <StatusBadge status={item.status} />
              </div>
              <p className="mt-4 text-sm leading-7 text-ink/70">{item.questionText}</p>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState
          title={items.length ? "No matching explanations" : "No history yet"}
          body={
            items.length
              ? "Try a different search term or status filter."
              : "Once you generate an explanation, it will show up here with its status and detail view."
          }
        />
      )}
    </AppShell>
  );
};
