import type { PropsWithChildren, ReactNode } from "react";
import { Link } from "react-router-dom";

import briefLensMark from "../../assets/brand/brieflens-mark.svg";

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
          <Link className="shrink-0" to="/">
            <span className="flex items-center gap-2">
              <img alt="BriefLens logo" className="h-8 w-8" src={briefLensMark} />
              <span className="font-display text-xl font-semibold md:text-2xl">BriefLens</span>
            </span>
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
        <section className="rounded-[32px] border border-ink/8 bg-white p-5 shadow-soft sm:rounded-[36px] sm:p-8">
          {badge ? (
            <p className="inline-flex rounded-full bg-mist px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-teal">
              {badge}
            </p>
          ) : null}
          <h1 className="mt-5 font-display text-4xl leading-tight text-ink sm:text-5xl">{title}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-ink/65 [overflow-wrap:anywhere] sm:mt-4 sm:leading-7 sm:text-base">
            {description}
          </p>
          <div className="mt-4 hidden flex-wrap gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/45 sm:flex">
            <span className="rounded-full bg-sand px-3 py-1">Secure flow</span>
            <span className="rounded-full bg-sand px-3 py-1">Privacy-safe messaging</span>
            <span className="rounded-full bg-sand px-3 py-1">Mobile-ready</span>
          </div>
          <div className="mt-6 sm:mt-8">{children}</div>
          {footer ? <div className="mt-6 text-sm text-ink/60">{footer}</div> : null}
        </section>

        <aside className="rounded-[32px] border border-ink/8 bg-ink p-5 text-white shadow-soft sm:rounded-[36px] sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/55">
            {asideTitle}
          </p>
          <div className="mt-4 space-y-3 sm:mt-6 sm:space-y-4">
            {asideItems.map((item) => (
              <div
                key={item.title}
                className="rounded-[22px] border border-white/10 bg-white/5 p-4 sm:rounded-[28px] sm:p-5"
              >
                <h2 className="font-display text-xl [overflow-wrap:anywhere] sm:text-2xl">
                  {item.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-white/75 [overflow-wrap:anywhere] sm:leading-7">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  </div>
);
