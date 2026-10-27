import { AuroraBackdrop } from "@/registry/kit/ui/aurora-backdrop";
import { NumberTicker } from "@/registry/kit/ui/number-ticker";

export interface Stat {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  label: string;
}

const defaultStats: Stat[] = [
  { value: 99.99, decimals: 2, suffix: "%", label: "Uptime over 12 months" },
  { value: 38, suffix: " ms", label: "Median global latency" },
  { value: 2.4, decimals: 1, suffix: "M", label: "Deploys per month" },
  { value: 143, label: "Edge regions" },
];

export function StatsBand({ stats = defaultStats }: { stats?: Stat[] }) {
  return (
    <section className="relative isolate overflow-hidden bg-bg-deep px-6 py-20 text-fg md:px-8">
      <AuroraBackdrop grid={false} className="opacity-50" />
      <dl className="surface mx-auto grid max-w-6xl grid-cols-2 gap-y-10 rounded-card px-6 py-10 md:grid-cols-4 md:px-10">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className={`flex flex-col-reverse px-4 text-center ${i > 0 ? "md:border-l md:border-fg/10" : ""}`}
          >
            <dt className="mt-2 text-sm text-muted">{stat.label}</dt>
            <dd className="font-display text-5xl md:text-6xl">
              <NumberTicker value={stat.value} decimals={stat.decimals} prefix={stat.prefix} suffix={stat.suffix} />
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
