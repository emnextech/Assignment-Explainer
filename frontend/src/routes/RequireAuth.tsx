import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";
import { buildRouteTarget, writeRedirectTarget } from "../lib/authRedirect";

export const RequireAuth = () => {
  const { loading, session, isVerified } = useAuth();
  const location = useLocation();
  const intendedRoute = buildRouteTarget(location.pathname, location.search, location.hash);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-sand px-6 text-sm font-semibold text-ink/60">
        Loading your study space...
      </div>
    );
  }

  if (!session) {
    writeRedirectTarget(intendedRoute);
    return <Navigate replace to={`/login?next=${encodeURIComponent(intendedRoute)}`} />;
  }

  if (!isVerified) {
    writeRedirectTarget(intendedRoute);
    return (
      <Navigate
        replace
        to={`/verify-email?email=${encodeURIComponent(session.user.email ?? "")}&next=${encodeURIComponent(intendedRoute)}`}
      />
    );
  }

  return <Outlet />;
};
