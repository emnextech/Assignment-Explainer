import clsx from "clsx";
import type { TextareaHTMLAttributes } from "react";

export const Textarea = ({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea
    className={clsx(
      "min-h-44 w-full rounded-[28px] border border-ink/10 bg-white px-4 py-3.5 text-base text-ink outline-none transition placeholder:text-ink/35 focus:border-accent focus:ring-2 focus:ring-accent/20 disabled:bg-sand/70 sm:text-sm",
      className
    )}
    {...props}
  />
);
