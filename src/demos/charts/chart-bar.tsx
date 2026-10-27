import { ChartBar } from "@/registry/kit/ui/chart-bar";

export default function ChartBarDemo() {
  return (
    <div className="surface w-full max-w-3xl rounded-card p-6">
      <h3 className="text-sm text-muted">Builds per weekday</h3>
      <ChartBar
        className="mt-4"
        label="Successful and failed builds per weekday"
        labels={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]}
        series={[
          { name: "Passed", values: [142, 168, 175, 159, 131, 42, 28] },
          { name: "Failed", values: [12, 9, 15, 11, 18, 3, 2] },
        ]}
      />
    </div>
  );
}
