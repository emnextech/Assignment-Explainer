import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useProfileIdentity } from "../../hooks/useProfile";
import { Button } from "../ui/Button";
export const AppShell = ({ children, onSignOut }) => {
    const { authBootstrapError } = useAuth();
    const navigate = useNavigate();
    const { displayName, initials, university } = useProfileIdentity();
    const links = [
        { to: "/dashboard", label: "Dashboard" },
        { to: "/new-explanation", label: "New" },
        { to: "/history", label: "History" },
        { to: "/profile", label: "Profile" }
    ];
    const handleSignOut = async () => {
        try {
            await onSignOut?.();
        }
        finally {
            navigate("/", { replace: true });
        }
    };
    return (_jsxs("div", { className: "min-h-screen bg-sand pb-28 text-ink md:pb-10", children: [_jsxs("header", { className: "sticky top-4 z-40 px-4 pt-4", children: [_jsx("div", { className: "mx-auto max-w-6xl rounded-full border border-ink/10 bg-white/92 px-4 py-3 shadow-soft backdrop-blur", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Link, { to: "/dashboard", className: "shrink-0 font-display text-xl font-semibold text-ink md:text-2xl", children: "Assignment Explainer" }), _jsx("nav", { className: "hidden min-w-0 flex-1 items-center justify-center gap-2 md:flex", children: links.map((link) => (_jsx(NavLink, { to: link.to, className: ({ isActive }) => [
                                            "rounded-full px-4 py-2 text-sm font-semibold transition",
                                            isActive ? "bg-sand text-ink" : "text-ink/60 hover:bg-sand hover:text-ink"
                                        ].join(" "), children: link.label }, link.to))) }), _jsxs("div", { className: "ml-auto hidden items-center gap-3 md:flex", children: [_jsxs(Link, { to: "/profile", className: "flex items-center gap-3 rounded-full border border-ink/8 bg-sand px-3 py-2 transition hover:border-ink/14", children: [_jsx("span", { className: "flex h-10 w-10 items-center justify-center rounded-full bg-ink text-sm font-semibold text-white", children: initials }), _jsxs("span", { className: "min-w-0 text-left", children: [_jsx("span", { className: "block max-w-40 truncate text-sm font-semibold text-ink", children: displayName }), _jsx("span", { className: "block max-w-40 truncate text-xs text-ink/55", children: university })] })] }), onSignOut ? (_jsx(Button, { className: "bg-accent", onClick: () => void handleSignOut(), type: "button", children: "Sign out" })) : null] })] }) }), authBootstrapError ? (_jsx("div", { className: "mx-auto mt-3 max-w-6xl rounded-[24px] border border-amber-200 bg-amber-50 px-5 py-3 text-sm font-semibold text-amber-800 shadow-soft", children: authBootstrapError })) : null] }), _jsx("main", { className: "mx-auto max-w-6xl px-4 py-8 md:px-6", children: children }), _jsx("nav", { className: "fixed inset-x-0 bottom-4 z-40 px-4 md:hidden", children: _jsx("div", { className: "mx-auto flex max-w-md items-center justify-between rounded-full border border-ink/10 bg-white/95 px-3 py-2 shadow-soft backdrop-blur", children: links.map((link) => (_jsx(NavLink, { to: link.to, className: ({ isActive }) => [
                            "flex-1 rounded-full px-3 py-2 text-center text-xs font-semibold transition",
                            isActive ? "bg-sand text-ink" : "text-ink/60"
                        ].join(" "), children: link.label }, link.to))) }) })] }));
};
