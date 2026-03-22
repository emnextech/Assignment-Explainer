import type { PropsWithChildren, ReactNode } from "react";
import { Link } from "react-router-dom";

type AuthAsideItem = {
  title: string;
  body: string;
};

type AuthLayoutProps = PropsWithChildren<{
  badge?: string;
  title: string;
  description: string;
  asideTitle: string;
  asideItems: AuthAsideItem[];
  footer?: ReactNode;
}>;

export const AuthLayout = ({
  badge,
  children,
  title,
  description,
  asideTitle,
  asideItems,
  footer
}: AuthLayoutProps) => (
  <div className="min-h-screen bg-sand px-4 py-4 text-ink sm:px-6 sm:py-6">
    <div className="mx-auto max-w-6xl">
      <header className="sticky top-4 z-30 rounded-full border border-ink/10 bg-white/92 px-4 py-3 shadow-soft backdrop-blur">
        <div className="flex items-center justify-between gap-3">
          <Link className="font-display text-xl font-semibold md:text-2xl" to="/">
            Assignment Explainer
          </Link>
          <Link
            className="rounded-full border border-ink/10 bg-white px-4 py-2 text-sm font-semibold text-ink/75 transition hover:bg-sand hover:text-ink"
            to="/"
          >
            Back home
          </Link>
        </div>
      </header>

      <div className="mt-6 grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
        <section className="rounded-[36px] border border-ink/8 bg-white p-6 shadow-soft sm:p-8">
          {badge ? (
            <p className="inline-flex rounded-full bg-mist px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-teal">
              {badge}
            </p>
          ) : null}
          <h1 className="mt-5 font-display text-4xl leading-tight text-ink sm:text-5xl">
            {title}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-ink/65 sm:text-base">
            {description}
          </p>
          <div className="mt-8">{children}</div>
          {footer ? <div className="mt-6 text-sm text-ink/60">{footer}</div> : null}
        </section>

        <aside className="rounded-[36px] border border-ink/8 bg-ink p-6 text-white shadow-soft sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/55">
            {asideTitle}
          </p>
          <div className="mt-6 space-y-4">
            {asideItems.map((item) => (
              <div key={item.title} className="rounded-[28px] border border-white/10 bg-white/5 p-5">
                <h2 className="font-display text-2xl">{item.title}</h2>
                <p className="mt-2 text-sm leading-7 text-white/72">{item.body}</p>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  </div>
);
