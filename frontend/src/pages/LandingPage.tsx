import { Link } from "react-router-dom";

import { Button } from "../components/ui/Button";

export const LandingPage = () => (
  <div className="min-h-screen bg-sand px-4 py-4 text-ink md:px-6">
    <header className="sticky top-4 z-40 mx-auto max-w-6xl rounded-full border border-ink/10 bg-white/92 px-4 py-3 shadow-soft backdrop-blur">
      <div className="flex items-center justify-between gap-4">
        <div className="font-display text-xl font-semibold md:text-2xl">Assignment Explainer</div>
        <nav className="hidden items-center gap-2 md:flex">
          <a className="rounded-full px-4 py-2 text-sm font-semibold text-ink/65" href="#how-it-works">
            How it works
          </a>
          <a className="rounded-full px-4 py-2 text-sm font-semibold text-ink/65" href="#student-value">
            Why students use it
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <Link to="/login" className="hidden text-sm font-semibold text-ink/70 md:inline-flex">
            Log in
          </Link>
          <Link to="/signup">
            <Button className="bg-accent">Create account</Button>
          </Link>
        </div>
      </div>
    </header>

    <div className="mx-auto mt-8 max-w-6xl space-y-8 pb-12">
      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[42px] border border-ink/8 bg-white p-8 shadow-soft md:p-12">
          <p className="inline-flex rounded-full bg-mist px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-teal">
            Built for Cavendish students
          </p>
          <h1 className="mt-6 max-w-4xl font-display text-5xl leading-tight md:text-7xl">
            Turn one assignment brief into a clearer plan, structure, and study path.
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-ink/70 md:text-lg">
            Paste the question once and get a cleaner explanation, what your lecturer is really asking for, research priorities, writing structure, and common traps before you waste time drafting the wrong thing.
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

        <aside className="rounded-[42px] border border-ink/8 bg-ink p-8 text-white shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/55">
            What students get
          </p>
          <div className="mt-6 space-y-4">
            {[
              ["Simplified explanation", "Understand the actual task before you begin reading or writing."],
              ["Study direction", "See the best topics to research and the order to tackle them."],
              ["Writing structure", "Break the assignment into sections that match the brief."],
              ["Mistake prevention", "Catch weak arguments, missing scope, and common reasoning slips early."]
            ].map(([title, body]) => (
              <div key={title} className="rounded-[28px] border border-white/10 bg-white/5 p-5">
                <h2 className="font-display text-2xl">{title}</h2>
                <p className="mt-2 text-sm leading-7 text-white/75">{body}</p>
              </div>
            ))}
          </div>
        </aside>
      </section>

      <section id="how-it-works" className="grid gap-4 md:grid-cols-3">
        {[
          ["1. Paste the assignment", "Use the original brief, question, or lecturer instructions."],
          ["2. Get a guided breakdown", "The app explains the task, structure, key topics, and reasoning path."],
          ["3. Save and return later", "Keep a history of past assignments for revision and comparison."]
        ].map(([title, body]) => (
          <div key={title} className="rounded-[32px] border border-ink/8 bg-white p-6 shadow-soft">
            <h2 className="font-display text-3xl text-ink">{title}</h2>
            <p className="mt-3 text-sm leading-7 text-ink/70">{body}</p>
          </div>
        ))}
      </section>

      <section id="student-value" className="rounded-[42px] border border-ink/8 bg-white p-8 shadow-soft md:p-10">
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
              <div key={item} className="rounded-[26px] border border-ink/6 bg-sand p-5 text-sm leading-7 text-ink/75">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  </div>
);
