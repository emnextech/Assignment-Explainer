import clsx from "clsx";

type RuleItem = {
  label: string;
  passed: boolean;
};

const getPasswordRules = (password: string): RuleItem[] => [
  { label: "8+ characters", passed: password.length >= 8 },
  { label: "One uppercase", passed: /[A-Z]/.test(password) },
  { label: "One lowercase", passed: /[a-z]/.test(password) },
  { label: "One number", passed: /\d/.test(password) }
];

export const PasswordChecklist = ({ password }: { password: string }) => {
  const rules = getPasswordRules(password);
  const passedCount = rules.filter((rule) => rule.passed).length;
  const strengthLabel =
    passedCount === 4 ? "Strong" : passedCount >= 2 ? "Fair" : password.length ? "Weak" : "Not set";

  return (
    <div className="rounded-[20px] border border-ink/8 bg-sand px-4 py-3 text-sm text-ink/72 sm:rounded-[24px] sm:py-4">
      <div className="flex items-center justify-between gap-3">
        <p className="font-semibold text-ink">Password requirements</p>
        <span
          className={clsx(
            "rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em]",
            strengthLabel === "Strong" && "bg-emerald-100 text-emerald-700",
            strengthLabel === "Fair" && "bg-amber-100 text-amber-700",
            strengthLabel === "Weak" && "bg-rose-100 text-rose-700",
            strengthLabel === "Not set" && "bg-white text-ink/60"
          )}
        >
          {strengthLabel}
        </span>
      </div>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
        {rules.map((rule) => (
          <li key={rule.label} className="flex min-w-0 items-center gap-2 leading-6">
            <span
              className={clsx(
                "inline-flex h-5 w-5 items-center justify-center rounded-full border text-[11px] font-bold",
                rule.passed
                  ? "border-emerald-300 bg-emerald-100 text-emerald-700"
                  : "border-ink/15 bg-white text-ink/45"
              )}
            >
              {rule.passed ? "ok" : "-"}
            </span>
            <span className="[overflow-wrap:anywhere]">{rule.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
