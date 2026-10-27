import { StatCard } from "@/registry/kit/ui/stat-card";

const icon = (d: string) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d={d} />
  </svg>
);

export default function StatCardDemo() {
  return (
    <div className="grid w-full max-w-4xl gap-4 sm:grid-cols-3">
      <StatCard
        highlight
        label="Monthly revenue"
        value={48.2}
        prefix="$"
        suffix="k"
        decimals={1}
        icon={icon("M12 3v18M16.5 7.5c0-1.7-2-3-4.5-3s-4.5 1.3-4.5 3 2 2.6 4.5 3 4.5 1.3 4.5 3-2 3-4.5 3-4.5-1.3-4.5-3")}
        change={0.124}
        comparison="vs last month"
        sparkline={[31, 34, 33, 37, 36, 40, 42, 41, 45, 48]}
      />
      <StatCard
        label="Active projects"
        value={1284}
        tone="info"
        icon={icon("M4 7h16M4 12h16M4 17h10")}
        change={0.032}
        comparison="vs last month"
        sparkline={[12, 12.4, 12.3, 12.6, 12.7, 12.8, 12.84]}
      />
      <StatCard
        label="Error rate"
        value={0.42}
        suffix="%"
        decimals={2}
        tone="danger"
        icon={icon("M12 8v5M12 16.5h.01M10.3 4.2 2.9 17a2 2 0 0 0 1.7 3h14.8a2 2 0 0 0 1.7-3L13.7 4.2a2 2 0 0 0-3.4 0Z")}
        change={-0.18}
        positiveIsGood={false}
        comparison="vs last week"
        sparkline={[0.7, 0.65, 0.66, 0.58, 0.55, 0.5, 0.42]}
      />
    </div>
  );
}
