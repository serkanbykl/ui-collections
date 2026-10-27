import { AppShell } from "@/registry/kit/blocks/app-shell";
import { OrderDetailScreen } from "@/registry/kit/screens/screen-order-detail";

export default function ScreenOrderDetailDemo() {
  return (
    <AppShell title="Order #5104">
      <OrderDetailScreen />
    </AppShell>
  );
}
