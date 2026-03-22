import clsx from "clsx";
import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

export const Button = ({
  children,
  className,
  ...props
}: PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>) => (
  <button
    className={clsx(
      "inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-semibold leading-none transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60",
      "bg-ink text-white shadow-soft",
      className
    )}
    {...props}
  >
    {children}
  </button>
);
