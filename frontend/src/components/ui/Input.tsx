import clsx from "clsx";
import type { InputHTMLAttributes } from "react";

export const Input = ({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) => (
  <input
    className={clsx(
      "w-full rounded-3xl border border-ink/10 bg-white px-4 py-3.5 text-base text-ink outline-none transition placeholder:text-ink/35 focus:border-accent focus:ring-2 focus:ring-accent/20 disabled:bg-sand/70 sm:text-sm",
      className
    )}
    {...props}
  />
);
