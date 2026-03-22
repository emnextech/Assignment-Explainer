import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import briefLensMark from "../assets/brand/brieflens-mark.svg";
import { Button } from "../components/ui/Button";

const navItems = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#student-value", label: "Why students use it" },
  { href: "#faq", label: "FAQ" }
];

const GitHubIcon = () => (
  <svg aria-hidden="true" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 .5C5.649.5.5 5.649.5 12A11.5 11.5 0 0 0 8.36 22.04c.575.106.785-.25.785-.556 0-.274-.01-1-.016-1.962-3.181.691-3.853-1.532-3.853-1.532-.52-1.321-1.27-1.673-1.27-1.673-1.039-.71.078-.696.078-.696 1.148.08 1.752 1.178 1.752 1.178 1.02 1.748 2.676 1.243 3.328.95.104-.739.4-1.244.727-1.53-2.54-.289-5.212-1.27-5.212-5.654 0-1.249.447-2.272 1.178-3.072-.119-.288-.51-1.45.112-3.022 0 0 .96-.307 3.145 1.174A10.95 10.95 0 0 1 12 6.032c.973.004 1.954.132 2.87.388 2.182-1.48 3.141-1.174 3.141-1.174.624 1.572.233 2.734.114 3.022.734.8 1.176 1.823 1.176 3.072 0 4.395-2.677 5.362-5.225 5.646.411.354.777 1.05.777 2.117 0 1.529-.014 2.761-.014 3.137 0 .308.207.667.79.554A11.502 11.502 0 0 0 23.5 12C23.5 5.649 18.351.5 12 .5Z" />
  </svg>
);

export const LandingPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!mobileMenuOpen) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <div className="min-h-screen px-4 py-4 text-ink md:px-6">
      <header className="sticky top-4 z-50 mx-auto max-w-6xl animate-reveal-up rounded-[28px] border border-ink/10 bg-white/92 px-4 py-3 shadow-soft backdrop-blur motion-stable">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img alt="BriefLens logo" className="h-8 w-8" src={briefLensMark} />
            <div className="font-display text-xl font-semibold md:text-2xl">BriefLens</div>
          </div>

          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <a
                key={item.href}
                className="rounded-full px-4 py-2 text-sm font-semibold text-ink/65 transition hover:bg-sand hover:text-ink"
                href={item.href}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Link to="/login" className="text-sm font-semibold text-ink/70">
              Log in
            </Link>
            <Link to="/signup">
              <Button className="bg-accent">Create account</Button>
            </Link>
          </div>

          <button
            aria-controls="mobile-site-menu"
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 bg-white text-ink transition-colors hover:bg-sand md:hidden"
            onClick={() => setMobileMenuOpen((current) => !current)}
            type="button"
          >
            <span className="relative h-4 w-4">
              <span
                className={[
                  "absolute left-0 top-0 h-0.5 w-4 rounded-full bg-ink transition-transform duration-300",
                  mobileMenuOpen ? "translate-y-[7px] rotate-45" : "translate-y-0"
                ].join(" ")}
              />
              <span
                className={[
                  "absolute left-0 top-[7px] h-0.5 w-4 rounded-full bg-ink transition-opacity duration-200",
                  mobileMenuOpen ? "opacity-0" : "opacity-100"
                ].join(" ")}
              />
              <span
                className={[
                  "absolute left-0 top-[14px] h-0.5 w-4 rounded-full bg-ink transition-transform duration-300",
                  mobileMenuOpen ? "-translate-y-[7px] -rotate-45" : "translate-y-0"
                ].join(" ")}
              />
            </span>
          </button>
        </div>

        <button
          aria-hidden={!mobileMenuOpen}
          className={[
            "fixed inset-0 z-30 bg-ink/30 transition-opacity duration-250 md:hidden",
            mobileMenuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
          ].join(" ")}
          onClick={() => setMobileMenuOpen(false)}
          tabIndex={mobileMenuOpen ? 0 : -1}
          type="button"
        />

        <div
          id="mobile-site-menu"
          className={[
            "absolute left-0 right-0 top-[calc(100%+0.55rem)] z-40 mx-2 overflow-hidden rounded-3xl border border-ink/10 bg-white p-3 shadow-soft transition-[max-height,opacity,transform] duration-300 ease-out md:hidden motion-stable",
            mobileMenuOpen
              ? "max-h-[360px] translate-y-0 opacity-100"
              : "pointer-events-none max-h-0 -translate-y-2 opacity-0"
          ].join(" ")}
        >
          <p className="px-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink/45">
            Menu
          </p>
          <nav className="mt-2 grid gap-1.5">
            {navItems.map((item) => (
              <a
                key={item.href}
                className="rounded-2xl px-3 py-3 text-sm font-semibold text-ink/78 transition hover:bg-sand"
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="mt-3 grid grid-cols-2 gap-2 border-t border-ink/10 pt-3">
            <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full border border-ink/10 bg-white !text-ink hover:bg-sand">
                Log in
              </Button>
            </Link>
            <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full bg-accent">Get started</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto mt-8 max-w-6xl space-y-8 pb-12">
        <section className="grid gap-6 lg:grid-cols-[1.12fr_0.88fr]">
          <div className="animate-reveal-up rounded-[42px] border border-ink/8 bg-white p-8 shadow-soft motion-stable md:p-12">
            <p className="inline-flex rounded-full bg-mist px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-teal">
              Built for Cavendish students
            </p>
            <h1 className="mt-6 max-w-4xl font-display text-5xl leading-tight md:text-7xl">
              Turn one assignment brief into a clearer plan, structure, and study path.
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-ink/70 md:text-lg">
              Paste the question once and get a cleaner explanation, what your lecturer is really
              asking for, research priorities, writing structure, and common traps before you waste
              time drafting the wrong thing.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/signup">
                <Button className="bg-accent">Start free</Button>
              </Link>
              <Link to="/login">
                <Button className="border border-ink/10 bg-white !text-ink hover:bg-sand">
                  I already have an account
                </Button>
              </Link>
            </div>
          </div>

          <aside className="animate-reveal-right rounded-[42px] border border-ink/8 bg-ink p-8 text-white shadow-soft motion-stable">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/55">
                AI processing
              </p>
              <span className="h-2.5 w-2.5 animate-soft-pulse rounded-full bg-accent" />
            </div>
            <div className="mt-6 space-y-3">
              {[
                [
                  "Parse assignment brief",
                  "The model identifies instruction verbs, deliverables, and scope."
                ],
                [
                  "Extract lecturer intent",
                  "It finds what markers usually expect beyond plain wording."
                ],
                [
                  "Build study structure",
                  "It assembles a practical order for research and drafting."
                ],
                ["Quality and risk checks", "It flags weak reasoning patterns before you write."]
              ].map(([title, body]) => (
                <div
                  key={title}
                  className="rounded-[24px] border border-white/10 bg-white/5 p-4 transition-transform duration-300 hover:-translate-y-0.5"
                >
                  <h2 className="font-display text-2xl">{title}</h2>
                  <p className="mt-2 text-sm leading-7 text-white/75">{body}</p>
                </div>
              ))}
            </div>
          </aside>
        </section>

        <section className="grid gap-4 rounded-[36px] border border-ink/8 bg-white p-6 shadow-soft md:grid-cols-4">
          {[
            ["20 sec", "Average first breakdown"],
            ["4-step", "AI reasoning flow"],
            ["24/7", "Assignment support"],
            ["100%", "Student-owned writing"]
          ].map(([value, label]) => (
            <div
              key={label}
              className="rounded-2xl border border-ink/8 bg-sand px-4 py-4 text-center transition-transform duration-300 hover:-translate-y-0.5"
            >
              <p className="font-display text-4xl text-ink">{value}</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-ink/56">
                {label}
              </p>
            </div>
          ))}
        </section>

        <section id="how-it-works" className="grid gap-4 md:grid-cols-3">
          {[
            [
              "1. Paste the assignment",
              "Use the original brief, question, or lecturer instructions."
            ],
            [
              "2. Get a guided breakdown",
              "The app explains the task, structure, key topics, and reasoning path."
            ],
            [
              "3. Save and return later",
              "Keep a history of past assignments for revision and comparison."
            ]
          ].map(([title, body], index) => (
            <div
              key={title}
              className="animate-reveal-up rounded-[32px] border border-ink/8 bg-white p-6 shadow-soft motion-stable"
              style={{ animationDelay: `${index * 120}ms` }}
            >
              <h2 className="font-display text-3xl text-ink">{title}</h2>
              <p className="mt-3 text-sm leading-7 text-ink/70">{body}</p>
            </div>
          ))}
        </section>

        <section
          id="student-value"
          className="rounded-[42px] border border-ink/8 bg-white p-8 shadow-soft md:p-10"
        >
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-ink/45">
                Why it helps
              </p>
              <h2 className="mt-4 font-display text-5xl leading-tight text-ink">
                More than a summary. It helps students think, plan, and write better.
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                "Clarifies command words and hidden expectations in the brief.",
                "Turns long assignment instructions into a manageable order of work.",
                "Highlights which topics deserve research before drafting begins.",
                "Shows what weak reasoning or common fallacies could cost marks."
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-[26px] border border-ink/6 bg-sand p-5 text-sm leading-7 text-ink/75 transition-transform duration-300 hover:-translate-y-0.5"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="faq"
          className="rounded-[42px] border border-ink/8 bg-white p-8 shadow-soft md:p-10"
        >
          <h2 className="font-display text-5xl text-ink">FAQ</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {[
              [
                "Will this write my assignment for me?",
                "No. It explains and structures the work. You still write the final submission."
              ],
              [
                "Can I use this on mobile?",
                "Yes. The dashboard, form flow, and history all work on small screens."
              ],
              [
                "Does it keep my old assignments?",
                "Yes. Every generated explanation is saved in your history for revision."
              ],
              [
                "What if my prompt is unclear?",
                "The breakdown will still help, but results improve when you paste the exact brief."
              ]
            ].map(([question, answer]) => (
              <div key={question} className="rounded-[24px] border border-ink/8 bg-sand p-5">
                <h3 className="font-display text-2xl text-ink">{question}</h3>
                <p className="mt-2 text-sm leading-7 text-ink/72">{answer}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <footer className="mx-auto mt-10 max-w-6xl rounded-[32px] border border-ink/10 bg-white px-6 py-8 shadow-soft">
        <div className="grid gap-8 md:grid-cols-[1.3fr_0.7fr_0.7fr]">
          <div>
            <div className="flex items-center gap-2">
              <img alt="BriefLens logo" className="h-8 w-8" src={briefLensMark} />
              <p className="font-display text-3xl text-ink">BriefLens</p>
            </div>
            <p className="mt-3 max-w-xl text-sm leading-7 text-ink/70">
              Built to help students understand assignment expectations faster, structure their work
              clearly, and avoid common mistakes before writing.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink/50">Product</p>
            <div className="mt-3 grid gap-2 text-sm font-semibold text-ink/72">
              <a href="#how-it-works">How it works</a>
              <a href="#student-value">Student value</a>
              <a href="#faq">FAQ</a>
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink/50">Account</p>
            <div className="mt-3 grid gap-2 text-sm font-semibold text-ink/72">
              <Link to="/login">Log in</Link>
              <Link to="/signup">Create account</Link>
            </div>
          </div>
        </div>
        <div className="mt-8 flex flex-col gap-3 border-t border-ink/10 pt-4 text-xs font-semibold uppercase tracking-[0.18em] text-ink/45 md:flex-row md:items-center md:justify-between">
          <span>BriefLens. Study guidance, not ghostwriting.</span>
          <div className="inline-flex items-center gap-2 text-ink/60">
            <span>Built with love by</span>
            <a
              className="inline-flex items-center gap-2 transition hover:text-ink"
              href="https://github.com/emnextech"
              rel="noreferrer"
              target="_blank"
            >
              <GitHubIcon />
              <span>@emnextech</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
