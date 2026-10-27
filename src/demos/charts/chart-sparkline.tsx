import { ChartSparkline } from "@/registry/kit/ui/chart-sparkline";

const tiles = [
  { label: "Visitors", value: "48.2K", delta: "+12.4%", data: [22, 28, 25, 31, 30, 36, 34, 41, 39, 44, 47, 52] },
  { label: "Signups", value: "1,284", delta: "+4.1%", data: [80, 84, 79, 91, 88, 95, 93, 90, 101, 99, 104, 108] },
];

export default function ChartSparklineDemo() {
  return (
    <div className="grid w-full max-w-2xl gap-4 sm:grid-cols-2">
      {tiles.map((tile) => (
        <div key={tile.label} className="surface rounded-card p-6">
          <div className="text-sm text-muted">{tile.label}</div>
          <div className="mt-2 flex items-baseline gap-3">
            <span className="text-3xl font-semibold tracking-tight tabular-nums">{tile.value}</span>
            <span className="text-xs text-success">{tile.delta}</span>
          </div>
          <ChartSparkline data={tile.data} label={`${tile.label}, last 12 weeks`} className="mt-5 h-12" />
        </div>
      ))}
    </div>
  );
}
