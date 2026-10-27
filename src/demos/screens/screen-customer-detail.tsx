import { AppShell } from "@/registry/kit/blocks/app-shell";
import { CustomerDetailScreen } from "@/registry/kit/screens/screen-customer-detail";

export default function ScreenCustomerDetailDemo() {
  return (
    <AppShell title="Customer">
      <CustomerDetailScreen />
    </AppShell>
  );
}
