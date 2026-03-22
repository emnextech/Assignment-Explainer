import { jsx as _jsx } from "react/jsx-runtime";
import { SectionCard } from "../ui/SectionCard";
export const ListCard = ({ title, items }) => (_jsx(SectionCard, { title: title, children: _jsx("ol", { className: "space-y-3 text-sm leading-7 text-ink/80", children: items.map((item, index) => (_jsx("li", { className: "rounded-2xl border border-ink/6 bg-sand px-4 py-3", children: item }, `${title}-${item}-${index}`))) }) }));
