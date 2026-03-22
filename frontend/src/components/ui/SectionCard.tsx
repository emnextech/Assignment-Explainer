import type { PropsWithChildren } from "react";

export const SectionCard = ({
  title,
  children,
  subtitle
}: PropsWithChildren<{ title: string; subtitle?: string }>) => (
  <section className="rounded-[32px] border border-ink/8 bg-white p-6 shadow-soft">
    <div className="mb-4">
      <h2 className="font-display text-2xl text-ink">{title}</h2>
      {subtitle ? <p className="mt-1 max-w-2xl text-sm leading-7 text-ink/60">{subtitle}</p> : null}
    </div>
    {children}
  </section>
);
