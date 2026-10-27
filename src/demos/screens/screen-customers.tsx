import { AppShell } from "@/registry/kit/blocks/app-shell";
import { CustomersScreen } from "@/registry/kit/screens/screen-customers";

export default function ScreenCustomersDemo() {
  return (
    <AppShell title="Customers">
      <CustomersScreen />
    </AppShell>
  );
}
