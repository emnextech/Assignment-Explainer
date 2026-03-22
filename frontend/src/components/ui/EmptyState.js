import { jsx as _jsx } from "react/jsx-runtime";
import { SectionCard } from "../ui/SectionCard";
export const EmptyState = ({ title, body }) => (_jsx(SectionCard, { title: title, children: _jsx("p", { className: "max-w-2xl text-sm leading-7 text-ink/70", children: body }) }));
