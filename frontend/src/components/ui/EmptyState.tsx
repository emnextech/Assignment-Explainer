import { SectionCard } from "../ui/SectionCard";

export const EmptyState = ({
  title,
  body
}: {
  title: string;
  body: string;
}) => (
  <SectionCard title={title}>
    <p className="max-w-2xl text-sm leading-7 text-ink/70">{body}</p>
  </SectionCard>
);
