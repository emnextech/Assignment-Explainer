import clsx from "clsx";
import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

export const Button = ({
  children,
  className,
  ...props
}: PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>) => (
  <button
    className={clsx(
      "inline-flex items-center justify-center rounded-full px-5 py-3.5 text-base font-semibold transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm",
      "bg-ink text-white shadow-soft",
      className
    )}
    {...props}
  >
    {children}
  </button>
);
