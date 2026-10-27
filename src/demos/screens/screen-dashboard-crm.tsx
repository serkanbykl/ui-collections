import { AppShell } from "@/registry/kit/blocks/app-shell";
import { CrmDashboardScreen } from "@/registry/kit/screens/screen-dashboard-crm";

export default function ScreenDashboardCrmDemo() {
  return (
    <AppShell title="Pipeline">
      <CrmDashboardScreen />
    </AppShell>
  );
}
