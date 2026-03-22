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
        <div className="rounded-[38px] border border-ink/8 bg-white p-8 shadow-soft">
          <p className="text-sm uppercase tracking-[0.24em] text-ink/45">Profile</p>
          <div className="mt-4 flex items-center gap-4">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-ink font-display text-2xl text-white">
              {initials}
            </span>
            <div>
              <h1 className="font-display text-5xl text-ink">{displayName}</h1>
              <p className="mt-1 text-sm text-ink/55">{university}</p>
            </div>
          </div>
          <div className="mt-6 space-y-4 text-sm leading-7 text-ink/72">
            <p>
              <span className="font-semibold text-ink">Email:</span> {user?.email ?? "Not available"}
            </p>
            <p>
              <span className="font-semibold text-ink">University:</span> {university}
            </p>
            <p>
              <span className="font-semibold text-ink">Joined:</span> {joinedDate}
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["Total explanations", String(items.length)],
            ["Completed", String(completed)],
            ["Latest course", latestCourse]
          ].map(([label, value]) => (
            <div key={label} className="rounded-[30px] border border-ink/8 bg-white p-6 shadow-soft">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-ink/45">{label}</p>
              <p className="mt-4 font-display text-4xl leading-tight text-ink">{value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[34px] border border-ink/8 bg-white p-6 shadow-soft">
          <p className="text-sm uppercase tracking-[0.24em] text-ink/45">Edit profile</p>
          <div className="mt-5 space-y-4">
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
            <p className="rounded-[28px] border border-ink/8 bg-sand px-4 py-3 text-sm leading-7 text-ink/72">
              Your name appears across the navbar, dashboard, and result pages, so keep it updated to make the workspace feel personal and trustworthy.
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

        <div className="rounded-[34px] border border-ink/8 bg-white p-6 shadow-soft">
          <p className="text-sm uppercase tracking-[0.24em] text-ink/45">Profile insights</p>
          <ul className="mt-5 space-y-4 text-sm leading-7 text-ink/75">
            <li>Your name now appears across the app instead of your raw email address.</li>
            <li>Keep your profile updated so the workspace feels like a real student dashboard, not a temporary session.</li>
            <li>Track how many assignments you have completed and which course you are actively working in.</li>
          </ul>
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-[34px] border border-ink/8 bg-white p-6 shadow-soft">
          <p className="text-sm uppercase tracking-[0.24em] text-ink/45">Study routine</p>
          <ul className="mt-5 space-y-4 text-sm leading-7 text-ink/75">
            <li>Create an explanation before you read deeply so you know what the brief is asking.</li>
            <li>Use the result page as a planning tool, not a replacement for your own argument.</li>
            <li>Open your history before starting a similar assignment to compare structures and mistakes.</li>
          </ul>
        </div>
        <div className="rounded-[34px] border border-ink/8 bg-white p-6 shadow-soft">
          <p className="text-sm uppercase tracking-[0.24em] text-ink/45">Recent activity</p>
          {items.length ? (
            <div className="mt-5 space-y-3">
              {items.slice(0, 3).map((item) => (
                <div key={item.explanationId} className="rounded-[24px] border border-ink/6 bg-sand p-4">
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
