import clsx from "clsx";
import type { ReactNode } from "react";

type AuthNoticeVariant = "info" | "success" | "warning" | "error";

const variantClasses: Record<AuthNoticeVariant, string> = {
  info: "border-teal-200 bg-teal-50 text-teal-800",
  success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  warning: "border-amber-200 bg-amber-50 text-amber-800",
  error: "border-rose-200 bg-rose-50 text-rose-800"
};

const variantSymbols: Record<AuthNoticeVariant, string> = {
  info: "i",
  success: "ok",
  warning: "!",
  error: "x"
};

export const AuthNotice = ({
  children,
  className,
  variant,
  politeness = "polite"
}: {
  children: ReactNode;
  variant: AuthNoticeVariant;
  className?: string;
  politeness?: "polite" | "assertive";
}) => (
  <div
    aria-live={politeness}
    className={clsx(
      "flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold leading-6",
      variantClasses[variant],
      className
    )}
    role={variant === "error" || variant === "warning" ? "alert" : "status"}
  >
    <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full border border-current/30 bg-white/60 px-1 text-[11px] uppercase tracking-[0.08em]">
      {variantSymbols[variant]}
    </span>
    <span>{children}</span>
  </div>
);
