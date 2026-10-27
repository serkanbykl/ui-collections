import { AppShell } from "@/registry/kit/blocks/app-shell";
import { OrdersScreen } from "@/registry/kit/screens/screen-orders";

export default function ScreenOrdersDemo() {
  return (
    <AppShell title="Orders">
      <OrdersScreen />
    </AppShell>
  );
}
