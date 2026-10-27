import { ChartFunnel } from "@/registry/kit/ui/chart-funnel";

export default function ChartFunnelDemo() {
  return (
    <div className="surface w-full max-w-2xl rounded-card p-6">
      <div className="mb-5 flex items-baseline justify-between gap-3">
        <h3 className="text-sm font-medium">Signup funnel</h3>
        <span className="text-xs text-muted">Last 30 days</span>
      </div>
      <ChartFunnel
        label="Signup funnel, last 30 days"
        steps={[
          { label: "Visited pricing", value: 12480 },
          { label: "Opened signup", value: 4371 },
          { label: "Verified email", value: 3618 },
          { label: "Created project", value: 2904 },
          { label: "Invited a teammate", value: 1127 },
        ]}
      />
    </div>
  );
}
