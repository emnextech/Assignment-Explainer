import { jsx as _jsx } from "react/jsx-runtime";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { buildRouteTarget, writeRedirectTarget } from "../lib/authRedirect";
export const RequireAuth = () => {
    const { loading, session, isVerified } = useAuth();
    const location = useLocation();
    const intendedRoute = buildRouteTarget(location.pathname, location.search, location.hash);
    if (loading) {
        return (_jsx("div", { className: "flex min-h-screen items-center justify-center bg-sand px-6 text-sm font-semibold text-ink/60", children: "Loading your study space..." }));
    }
    if (!session) {
        writeRedirectTarget(intendedRoute);
        return _jsx(Navigate, { replace: true, to: `/login?next=${encodeURIComponent(intendedRoute)}` });
    }
    if (!isVerified) {
        writeRedirectTarget(intendedRoute);
        return (_jsx(Navigate, { replace: true, to: `/verify-email?email=${encodeURIComponent(session.user.email ?? "")}&next=${encodeURIComponent(intendedRoute)}` }));
    }
    return _jsx(Outlet, {});
};
