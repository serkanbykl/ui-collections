import { AppShell } from "@/registry/kit/blocks/app-shell";
import { EcommerceDashboardScreen } from "@/registry/kit/screens/screen-dashboard-ecommerce";

export default function ScreenDashboardEcommerceDemo() {
  return (
    <AppShell title="Store overview">
      <EcommerceDashboardScreen />
    </AppShell>
  );
}
