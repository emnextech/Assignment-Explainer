import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const joinedDate = user?.created_at
        ? new Date(user.created_at).toLocaleDateString(undefined, {
            month: "long",
            day: "numeric",
            year: "numeric"
        })
        : "Recently";
    useEffect(() => {
        setFullName(profile?.full_name ?? user?.user_metadata?.full_name ?? "");
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
        }
        catch (submissionError) {
            const nextError = submissionError instanceof Error ? submissionError.message : "Unable to update profile.";
            setError(nextError);
        }
    };
    return (_jsxs(AppShell, { onSignOut: () => void signOut(), children: [_jsxs("section", { className: "grid gap-6 xl:grid-cols-[0.95fr_1.05fr]", children: [_jsxs("div", { className: "rounded-[38px] border border-ink/8 bg-white p-8 shadow-soft", children: [_jsx("p", { className: "text-sm uppercase tracking-[0.24em] text-ink/45", children: "Profile" }), _jsxs("div", { className: "mt-4 flex items-center gap-4", children: [_jsx("span", { className: "flex h-16 w-16 items-center justify-center rounded-full bg-ink font-display text-2xl text-white", children: initials }), _jsxs("div", { children: [_jsx("h1", { className: "font-display text-5xl text-ink", children: displayName }), _jsx("p", { className: "mt-1 text-sm text-ink/55", children: university })] })] }), _jsxs("div", { className: "mt-6 space-y-4 text-sm leading-7 text-ink/72", children: [_jsxs("p", { children: [_jsx("span", { className: "font-semibold text-ink", children: "Email:" }), " ", user?.email ?? "Not available"] }), _jsxs("p", { children: [_jsx("span", { className: "font-semibold text-ink", children: "University:" }), " ", university] }), _jsxs("p", { children: [_jsx("span", { className: "font-semibold text-ink", children: "Joined:" }), " ", joinedDate] })] })] }), _jsx("div", { className: "grid gap-4 md:grid-cols-3", children: [
                            ["Total explanations", String(items.length)],
                            ["Completed", String(completed)],
                            ["Latest course", latestCourse]
                        ].map(([label, value]) => (_jsxs("div", { className: "rounded-[30px] border border-ink/8 bg-white p-6 shadow-soft", children: [_jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.22em] text-ink/45", children: label }), _jsx("p", { className: "mt-4 font-display text-4xl leading-tight text-ink", children: value })] }, label))) })] }), _jsxs("section", { className: "mt-8 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]", children: [_jsxs("div", { className: "rounded-[34px] border border-ink/8 bg-white p-6 shadow-soft", children: [_jsx("p", { className: "text-sm uppercase tracking-[0.24em] text-ink/45", children: "Edit profile" }), _jsxs("div", { className: "mt-5 space-y-4", children: [_jsxs("label", { className: "block space-y-2 text-sm font-semibold text-ink/70", children: ["Full name", _jsx(Input, { autoComplete: "name", name: "fullName", placeholder: "Your full name", value: fullName, onChange: (event) => setFullName(event.target.value) })] }), _jsxs("label", { className: "block space-y-2 text-sm font-semibold text-ink/70", children: ["University", _jsx(Input, { autoComplete: "organization", name: "university", placeholder: "Cavendish University", value: school, onChange: (event) => setSchool(event.target.value) })] }), _jsx("p", { className: "rounded-[28px] border border-ink/8 bg-sand px-4 py-3 text-sm leading-7 text-ink/72", children: "Your name appears across the navbar, dashboard, and result pages, so keep it updated to make the workspace feel personal and trustworthy." }), message ? _jsx("p", { className: "text-sm font-semibold text-emerald-700", children: message }) : null, error ? _jsx("p", { className: "text-sm font-semibold text-rose-600", children: error }) : null, _jsx(Button, { className: "w-full bg-accent sm:w-auto", disabled: updateProfile.isPending, onClick: () => void handleSave(), type: "button", children: updateProfile.isPending ? "Saving..." : "Save profile" })] })] }), _jsxs("div", { className: "rounded-[34px] border border-ink/8 bg-white p-6 shadow-soft", children: [_jsx("p", { className: "text-sm uppercase tracking-[0.24em] text-ink/45", children: "Profile insights" }), _jsxs("ul", { className: "mt-5 space-y-4 text-sm leading-7 text-ink/75", children: [_jsx("li", { children: "Your name now appears across the app instead of your raw email address." }), _jsx("li", { children: "Keep your profile updated so the workspace feels like a real student dashboard, not a temporary session." }), _jsx("li", { children: "Track how many assignments you have completed and which course you are actively working in." })] })] })] }), _jsxs("section", { className: "mt-8 grid gap-6 lg:grid-cols-[1fr_1fr]", children: [_jsxs("div", { className: "rounded-[34px] border border-ink/8 bg-white p-6 shadow-soft", children: [_jsx("p", { className: "text-sm uppercase tracking-[0.24em] text-ink/45", children: "Study routine" }), _jsxs("ul", { className: "mt-5 space-y-4 text-sm leading-7 text-ink/75", children: [_jsx("li", { children: "Create an explanation before you read deeply so you know what the brief is asking." }), _jsx("li", { children: "Use the result page as a planning tool, not a replacement for your own argument." }), _jsx("li", { children: "Open your history before starting a similar assignment to compare structures and mistakes." })] })] }), _jsxs("div", { className: "rounded-[34px] border border-ink/8 bg-white p-6 shadow-soft", children: [_jsx("p", { className: "text-sm uppercase tracking-[0.24em] text-ink/45", children: "Recent activity" }), items.length ? (_jsx("div", { className: "mt-5 space-y-3", children: items.slice(0, 3).map((item) => (_jsxs("div", { className: "rounded-[24px] border border-ink/6 bg-sand p-4", children: [_jsx("p", { className: "font-semibold text-ink", children: item.title ?? "Untitled assignment" }), _jsx("p", { className: "mt-1 text-sm text-ink/65", children: item.courseName ?? "General course" })] }, item.explanationId))) })) : (_jsx("div", { className: "mt-4", children: _jsx(EmptyState, { title: "No profile activity yet", body: "Generate your first explanation and your recent assignment activity will show here." }) }))] })] })] }));
};
