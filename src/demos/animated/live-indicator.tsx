import { LiveIndicator } from "@/registry/kit/ui/live-indicator";

export default function LiveIndicatorDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <LiveIndicator pill label="All systems normal" />
      <LiveIndicator pill status="away" label="Degraded latency" />
      <LiveIndicator pill status="busy" label="Build failed" pulse />
      <LiveIndicator pill status="offline" label="Paused" />
    </div>
  );
}
