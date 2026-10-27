import { AppShell } from "@/registry/kit/blocks/app-shell";
import { TimelineScreen } from "@/registry/kit/screens/screen-timeline";

export default function ScreenTimelineDemo() {
  return (
    <AppShell title="Activity">
      <TimelineScreen />
    </AppShell>
  );
}
