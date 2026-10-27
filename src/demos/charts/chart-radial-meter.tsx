import { ChartRadialMeter } from "@/registry/kit/ui/chart-radial-meter";

const thresholds = { warning: 70, critical: 90 };

export default function ChartRadialMeterDemo() {
  return (
    <div className="grid w-full max-w-2xl grid-cols-1 justify-items-center gap-6 sm:grid-cols-3">
      {[
        { label: "CPU", value: 42 },
        { label: "Memory", value: 76 },
        { label: "Disk", value: 93 },
      ].map((m) => (
        <div key={m.label} className="surface grid w-full place-items-center rounded-card p-6">
          <ChartRadialMeter value={m.value} label={m.label} thresholds={thresholds} />
        </div>
      ))}
    </div>
  );
}
