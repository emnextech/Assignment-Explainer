import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";
import {
  clearRedirectTarget,
  resolveRedirectTarget,
  writeRedirectTarget
} from "../lib/authRedirect";

export const GuestOnly = ({ allowUnverifiedSession = false }: { allowUnverifiedSession?: boolean }) => {
  const { isVerified, loading, session } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (session && isVerified) {
      clearRedirectTarget();
    }
  }, [isVerified, session]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-sand px-6 text-sm font-semibold text-ink/60">
        Preparing the secure sign-in flow...
      </div>
    );
  }

  if (!session) {
    return <Outlet />;
  }

  if (!isVerified) {
    if (allowUnverifiedSession) {
      return <Outlet />;
    }

    const next = resolveRedirectTarget(location.search, "/dashboard");
    writeRedirectTarget(next);
    return (
      <Navigate
        replace
        to={`/verify-email?email=${encodeURIComponent(session.user.email ?? "")}&next=${encodeURIComponent(next)}&source=session`}
      />
    );
  }

  const next = resolveRedirectTarget(location.search, "/dashboard");
  return <Navigate replace to={next} />;
};
