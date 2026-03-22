import { SectionCard } from "../ui/SectionCard";

export const SummaryCard = ({ title, body }: { title: string; body: string }) => (
  <SectionCard title={title}>
    <p className="text-sm leading-8 text-ink/80">{body}</p>
  </SectionCard>
);
