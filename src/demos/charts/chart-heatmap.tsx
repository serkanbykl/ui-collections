import { ChartHeatmap } from "@/registry/kit/ui/chart-heatmap";

// Deterministic sample: busier mid-week, quiet weekends, a few spikes.
const values = Array.from({ length: 182 }, (_, i) => {
  const weekday = (i + 3) % 7;
  const base = weekday >= 5 ? 0.6 : 3 + Math.sin(i / 9) * 2;
  const spike = i % 23 === 0 ? 6 : 0;
  return Math.max(0, Math.round(base + spike + ((i * 37) % 5) - 2));
});

export default function ChartHeatmapDemo() {
  return (
    <div className="surface w-full max-w-3xl rounded-card p-6">
      <h3 className="mb-4 text-sm text-muted">Deploys, last 26 weeks</h3>
      <ChartHeatmap values={values} endDate="2026-10-25" label="Production deploys per day over the last 26 weeks" unit="deploys" />
    </div>
  );
}
