import { AppShell } from "@/registry/kit/blocks/app-shell";
import { ProjectsDashboardScreen } from "@/registry/kit/screens/screen-dashboard-projects";

export default function ScreenDashboardProjectsDemo() {
  return (
    <AppShell title="Projects">
      <ProjectsDashboardScreen />
    </AppShell>
  );
}
