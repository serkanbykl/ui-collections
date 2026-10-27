import { NumberTicker } from "@/registry/kit/ui/number-ticker";

const stats = [
  { value: 99.98, decimals: 2, suffix: "%", label: "Uptime this year" },
  { value: 42, suffix: " ms", label: "Median response" },
  { value: 1283, label: "Deploys shipped" },
];

export default function NumberTickerDemo() {
  return (
    <dl className="grid w-full max-w-3xl gap-8 text-center sm:grid-cols-3">
      {stats.map((stat) => (
        <div key={stat.label} className="flex flex-col-reverse">
          <dt className="mt-2 text-sm text-muted">{stat.label}</dt>
          <dd className="font-display text-6xl tracking-[-0.03em]">
            <NumberTicker value={stat.value} decimals={stat.decimals} suffix={stat.suffix} />
          </dd>
        </div>
      ))}
    </dl>
  );
}
