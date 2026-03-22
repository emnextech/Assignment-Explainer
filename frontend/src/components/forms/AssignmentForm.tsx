import { useEffect, useMemo, useState, type FormEvent } from "react";

import { assignmentInputSchema, type AssignmentInput } from "@assignment-explainer/shared";

import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";

type FormState = {
  title: string;
  courseName: string;
  questionText: string;
  wordCount: string;
  level: string;
};

type AssignmentFormProps = {
  onSubmit: (payload: AssignmentInput) => Promise<void>;
  submitting?: boolean;
};

const initialState: FormState = {
  title: "",
  courseName: "",
  questionText: "",
  wordCount: "",
  level: ""
};

const draftStorageKey = "assignment-explainer.assignment-form.draft";

export const AssignmentForm = ({ onSubmit, submitting = false }: AssignmentFormProps) => {
  const [values, setValues] = useState<FormState>(initialState);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [error, setError] = useState<string | null>(null);
  const [draftMessage, setDraftMessage] = useState<string | null>(null);

  const estimatedReading = useMemo(() => {
    const words = values.questionText.trim().split(/\s+/).filter(Boolean).length;
    if (!words) {
      return null;
    }

    return `${words} words in prompt`;
  }, [values.questionText]);

  useEffect(() => {
    const rawDraft = window.localStorage.getItem(draftStorageKey);

    if (!rawDraft) {
      return;
    }

    try {
      const nextValues = JSON.parse(rawDraft) as Partial<FormState>;
      setValues((current) => ({
        ...current,
        ...nextValues
      }));
      setDraftMessage("Draft restored from this browser.");
    } catch {
      window.localStorage.removeItem(draftStorageKey);
    }
  }, []);

  useEffect(() => {
    const hasContent = Object.values(values).some((value) => value.trim().length > 0);

    if (!hasContent) {
      window.localStorage.removeItem(draftStorageKey);
      return;
    }

    window.localStorage.setItem(draftStorageKey, JSON.stringify(values));
    setDraftMessage("Draft saved locally on this device.");
  }, [values]);

  const handleChange = (field: keyof FormState, value: string) => {
    const nextValue = field === "wordCount" ? value.replace(/[^\d]/g, "") : value;

    setValues((current) => ({ ...current, [field]: nextValue }));
    setFieldErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setFieldErrors({});

    const payload = {
      title: values.title || null,
      courseName: values.courseName || null,
      questionText: values.questionText,
      wordCount: values.wordCount ? Number(values.wordCount) : null,
      level: values.level || null
    } satisfies AssignmentInput;

    const parsed = assignmentInputSchema.safeParse(payload);

    if (!parsed.success) {
      const nextFieldErrors: Partial<Record<keyof FormState, string>> = {};

      parsed.error.issues.forEach((issue) => {
        const key = issue.path[0];

        if (
          typeof key === "string" &&
          ["title", "courseName", "questionText", "wordCount", "level"].includes(key)
        ) {
          nextFieldErrors[key as keyof FormState] ??= issue.message;
        }
      });

      setFieldErrors(nextFieldErrors);
      setError(parsed.error.issues[0]?.message ?? "Please review the form fields.");
      return;
    }

    await onSubmit(parsed.data);
    window.localStorage.removeItem(draftStorageKey);
    setDraftMessage("Draft cleared after successful submission.");
  };

  const handleReset = () => {
    setValues(initialState);
    setFieldErrors({});
    setError(null);
    setDraftMessage("Draft cleared from this device.");
    window.localStorage.removeItem(draftStorageKey);
  };

  return (
    <form className="space-y-5 rounded-[36px] bg-white p-6 shadow-soft" onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm font-semibold text-ink/70">
          Assignment title
          <Input
            autoCapitalize="words"
            autoComplete="off"
            maxLength={160}
            placeholder="Economics Assignment 1"
            value={values.title}
            onChange={(event) => handleChange("title", event.target.value)}
          />
          {fieldErrors.title ? (
            <p className="text-xs font-semibold text-rose-600">{fieldErrors.title}</p>
          ) : null}
        </label>
        <label className="space-y-2 text-sm font-semibold text-ink/70">
          Course name
          <Input
            autoCapitalize="words"
            autoComplete="off"
            maxLength={120}
            placeholder="Economics"
            value={values.courseName}
            onChange={(event) => handleChange("courseName", event.target.value)}
          />
          {fieldErrors.courseName ? (
            <p className="text-xs font-semibold text-rose-600">{fieldErrors.courseName}</p>
          ) : null}
        </label>
      </div>

      <label className="space-y-2 text-sm font-semibold text-ink/70">
        Assignment question
        <Textarea
          autoCapitalize="sentences"
          maxLength={5000}
          placeholder="Paste the exact question or brief from your lecturer here."
          value={values.questionText}
          onChange={(event) => handleChange("questionText", event.target.value)}
        />
        <div className="flex items-center justify-between text-xs text-ink/50">
          <span>We explain the assignment. We do not write the full submission.</span>
          <span>{estimatedReading ?? "Add enough detail for a useful breakdown."}</span>
        </div>
        {fieldErrors.questionText ? (
          <p className="text-xs font-semibold text-rose-600">{fieldErrors.questionText}</p>
        ) : null}
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm font-semibold text-ink/70">
          Word count (optional)
          <Input
            inputMode="numeric"
            maxLength={5}
            placeholder="1200"
            value={values.wordCount}
            onChange={(event) => handleChange("wordCount", event.target.value)}
          />
          {fieldErrors.wordCount ? (
            <p className="text-xs font-semibold text-rose-600">{fieldErrors.wordCount}</p>
          ) : null}
        </label>
        <label className="space-y-2 text-sm font-semibold text-ink/70">
          Level or year (optional)
          <Input
            autoCapitalize="words"
            maxLength={80}
            placeholder="Year 1"
            value={values.level}
            onChange={(event) => handleChange("level", event.target.value)}
          />
          {fieldErrors.level ? (
            <p className="text-xs font-semibold text-rose-600">{fieldErrors.level}</p>
          ) : null}
        </label>
      </div>

      {draftMessage ? <p className="text-sm font-semibold text-ink/55">{draftMessage}</p> : null}
      {error ? <p className="text-sm font-semibold text-rose-600">{error}</p> : null}

      <div className="rounded-[28px] border border-ink/8 bg-sand px-4 py-4 text-sm leading-7 text-ink/72">
        The better the brief, the better the explanation. Include the exact command words, any required structure, and the word count if your lecturer gave one.
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button className="w-full bg-accent sm:w-auto" disabled={submitting} type="submit">
          {submitting ? "Explaining..." : "Explain assignment"}
        </Button>
        <Button
          className="w-full border border-ink/10 bg-white !text-ink hover:bg-sand sm:w-auto"
          disabled={submitting}
          onClick={handleReset}
          type="button"
        >
          Clear form
        </Button>
        <p className="text-sm text-ink/60">You can revisit every explanation from the history page.</p>
      </div>
    </form>
  );
};
