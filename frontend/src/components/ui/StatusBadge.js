import { jsx as _jsx } from "react/jsx-runtime";
import clsx from "clsx";
const statusClasses = {
    pending: "bg-slate-100 text-slate-700",
    completed: "bg-emerald-100 text-emerald-700",
    failed: "bg-rose-100 text-rose-700",
    refused: "bg-amber-100 text-amber-700"
};
export const StatusBadge = ({ status, className }) => (_jsx("span", { className: clsx("inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]", statusClasses[status], className), children: status }));
