import { jsx as _jsx } from "react/jsx-runtime";
import { SectionCard } from "../ui/SectionCard";
export const SummaryCard = ({ title, body }) => (_jsx(SectionCard, { title: title, children: _jsx("p", { className: "text-sm leading-8 text-ink/80", children: body }) }));
