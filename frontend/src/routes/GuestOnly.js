import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { clearRedirectTarget, resolveRedirectTarget, writeRedirectTarget } from "../lib/authRedirect";
export const GuestOnly = ({ allowUnverifiedSession = false }) => {
    const { isVerified, loading, session } = useAuth();
    const location = useLocation();
    useEffect(() => {
        if (session && isVerified) {
            clearRedirectTarget();
        }
    }, [isVerified, session]);
    if (loading) {
        return (_jsx("div", { className: "flex min-h-screen items-center justify-center bg-sand px-6 text-sm font-semibold text-ink/60", children: "Preparing the secure sign-in flow..." }));
    }
    if (!session) {
        return _jsx(Outlet, {});
    }
    if (!isVerified) {
        if (allowUnverifiedSession) {
            return _jsx(Outlet, {});
        }
        const next = resolveRedirectTarget(location.search, "/dashboard");
        writeRedirectTarget(next);
        return (_jsx(Navigate, { replace: true, to: `/verify-email?email=${encodeURIComponent(session.user.email ?? "")}&next=${encodeURIComponent(next)}` }));
    }
    const next = resolveRedirectTarget(location.search, "/dashboard");
    return _jsx(Navigate, { replace: true, to: next });
};
