import { SectionCard } from "../ui/SectionCard";

export const ListCard = ({ title, items }: { title: string; items: string[] }) => (
  <SectionCard title={title}>
    <ol className="space-y-3 text-sm leading-7 text-ink/80">
      {items.map((item, index) => (
        <li
          key={`${title}-${item}-${index}`}
          className="rounded-2xl border border-ink/6 bg-sand px-4 py-3"
        >
          {item}
        </li>
      ))}
    </ol>
  </SectionCard>
);
