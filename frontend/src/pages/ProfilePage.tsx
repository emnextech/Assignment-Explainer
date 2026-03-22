import { useEffect, useState } from "react";

import { AppShell } from "../components/layout/AppShell";
import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";
import { Input } from "../components/ui/Input";
import { useAuth } from "../hooks/useAuth";
import { useHistoryList } from "../hooks/useAssignments";
import { useProfileIdentity, useUpdateProfile } from "../hooks/useProfile";

export const ProfilePage = () => {
  const { user, signOut } = useAuth();
  const { data: profile, displayName, initials, university } = useProfileIdentity();
  const updateProfile = useUpdateProfile();
  const historyQuery = useHistoryList();
  const items = historyQuery.data?.items ?? [];
  const completed = items.filter((item) => item.status === "completed").length;
  const latestCourse = items.find((item) => item.courseName)?.courseName ?? "No course yet";
  const stats = [
    { label: "Total explanations", value: String(items.length), compact: false },
    { label: "Completed", value: String(completed), compact: false },
    { label: "Latest course", value: latestCourse, compact: true }
  ];
  const [fullName, setFullName] = useState("");
  const [school, setSchool] = useState("Cavendish University");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const joinedDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString(undefined, {
        month: "long",
        day: "numeric",
        year: "numeric"
      })
    : "Recently";

  useEffect(() => {
    setFullName(profile?.full_name ?? (user?.user_metadata?.full_name as string | undefined) ?? "");
    setSchool(profile?.university ?? "Cavendish University");
  }, [profile?.full_name, profile?.university, user?.user_metadata]);

  const handleSave = async () => {
    setMessage(null);
    setError(null);

    try {
      await updateProfile.mutateAsync({
        fullName,
        university: school
      });
      setMessage("Profile updated successfully.");
    } catch (submissionError) {
      const nextError =
        submissionError instanceof Error ? submissionError.message : "Unable to update profile.";
      setError(nextError);
    }
  };

  return (
    <AppShell onSignOut={() => void signOut()}>
      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="overflow-hidden rounded-[28px] border border-ink/8 bg-white p-5 shadow-soft sm:rounded-[38px] sm:p-8">
          <p className="text-sm uppercase tracking-[0.24em] text-ink/45">Profile</p>
          <div className="mt-4 flex items-center gap-3 sm:gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-ink font-display text-xl text-white sm:h-16 sm:w-16 sm:text-2xl">
              {initials}
            </span>
            <div className="min-w-0 flex-1">
              <h1 className="font-display text-2xl leading-tight text-ink [overflow-wrap:anywhere] sm:text-4xl lg:text-5xl">
                {displayName}
              </h1>
              <p className="mt-1 text-sm text-ink/55 [overflow-wrap:anywhere]">{university}</p>
            </div>
          </div>
          <div className="mt-5 space-y-3 text-sm leading-6 text-ink/72 sm:mt-6 sm:space-y-4 sm:leading-7">
            <p>
              <span className="font-semibold text-ink">Email:</span>{" "}
              {user?.email ?? "Not available"}
            </p>
            <p>
              <span className="font-semibold text-ink">University:</span> {university}
            </p>
            <p>
              <span className="font-semibold text-ink">Joined:</span> {joinedDate}
            </p>
          </div>
          <Button
            className="mt-5 w-full bg-accent md:hidden"
            onClick={() => void signOut()}
            type="button"
          >
            Sign out
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
          {stats.map((item) => (
            <div
              key={item.label}
              className={
                item.label === "Latest course"
                  ? "col-span-2 rounded-[24px] border border-ink/8 bg-white p-4 shadow-soft sm:rounded-[30px] sm:p-6 md:col-span-1"
                  : "col-span-1 rounded-[24px] border border-ink/8 bg-white p-4 shadow-soft sm:rounded-[30px] sm:p-6"
              }
            >
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-ink/45">
                {item.label}
              </p>
              <p
                className={
                  item.compact
                    ? "mt-3 break-words font-display text-xl leading-tight text-ink sm:mt-4 sm:text-2xl"
                    : "mt-3 font-display text-3xl leading-tight text-ink sm:mt-4 sm:text-4xl"
                }
              >
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[28px] border border-ink/8 bg-white p-5 shadow-soft sm:rounded-[34px] sm:p-6">
          <p className="text-sm uppercase tracking-[0.24em] text-ink/45">Edit profile</p>
          <div className="mt-4 space-y-4 sm:mt-5">
            <label className="block space-y-2 text-sm font-semibold text-ink/70">
              Full name
              <Input
                autoComplete="name"
                name="fullName"
                placeholder="Your full name"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
              />
            </label>
            <label className="block space-y-2 text-sm font-semibold text-ink/70">
              University
              <Input
                autoComplete="organization"
                name="university"
                placeholder="Cavendish University"
                value={school}
                onChange={(event) => setSchool(event.target.value)}
              />
            </label>
            <p className="rounded-[24px] border border-ink/8 bg-sand px-4 py-3 text-sm leading-6 text-ink/72 sm:rounded-[28px] sm:leading-7">
              Your name appears across the navbar, dashboard, and result pages, so keep it updated
              to make the workspace feel personal and trustworthy.
            </p>
            {message ? <p className="text-sm font-semibold text-emerald-700">{message}</p> : null}
            {error ? <p className="text-sm font-semibold text-rose-600">{error}</p> : null}
            <Button
              className="w-full bg-accent sm:w-auto"
              disabled={updateProfile.isPending}
              onClick={() => void handleSave()}
              type="button"
            >
              {updateProfile.isPending ? "Saving..." : "Save profile"}
            </Button>
          </div>
        </div>

        <div className="rounded-[28px] border border-ink/8 bg-white p-5 shadow-soft sm:rounded-[34px] sm:p-6">
          <p className="text-sm uppercase tracking-[0.24em] text-ink/45">Profile insights</p>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-ink/75 sm:mt-5 sm:space-y-4 sm:leading-7">
            <li>Your name now appears across the app instead of your raw email address.</li>
            <li>
              Keep your profile updated so the workspace feels like a real student dashboard, not a
              temporary session.
            </li>
            <li>
              Track how many assignments you have completed and which course you are actively
              working in.
            </li>
          </ul>
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-[28px] border border-ink/8 bg-white p-5 shadow-soft sm:rounded-[34px] sm:p-6">
          <p className="text-sm uppercase tracking-[0.24em] text-ink/45">Study routine</p>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-ink/75 sm:mt-5 sm:space-y-4 sm:leading-7">
            <li>
              Create an explanation before you read deeply so you know what the brief is asking.
            </li>
            <li>
              Use the result page as a planning tool, not a replacement for your own argument.
            </li>
            <li>
              Open your history before starting a similar assignment to compare structures and
              mistakes.
            </li>
          </ul>
        </div>
        <div className="rounded-[28px] border border-ink/8 bg-white p-5 shadow-soft sm:rounded-[34px] sm:p-6">
          <p className="text-sm uppercase tracking-[0.24em] text-ink/45">Recent activity</p>
          {items.length ? (
            <div className="mt-4 space-y-3 sm:mt-5">
              {items.slice(0, 3).map((item) => (
                <div
                  key={item.explanationId}
                  className="rounded-[24px] border border-ink/6 bg-sand p-4"
                >
                  <p className="font-semibold text-ink">{item.title ?? "Untitled assignment"}</p>
                  <p className="mt-1 text-sm text-ink/65">{item.courseName ?? "General course"}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-4">
              <EmptyState
                title="No profile activity yet"
                body="Generate your first explanation and your recent assignment activity will show here."
              />
            </div>
          )}
        </div>
      </section>
    </AppShell>
  );
};
