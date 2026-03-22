import { jsx as _jsx } from "react/jsx-runtime";
import clsx from "clsx";
export const Button = ({ children, className, ...props }) => (_jsx("button", { className: clsx("inline-flex items-center justify-center rounded-full px-5 py-3.5 text-base font-semibold transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm", "bg-ink text-white shadow-soft", className), ...props, children: children }));
