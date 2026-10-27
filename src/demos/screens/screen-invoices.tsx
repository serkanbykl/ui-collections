import { AppShell } from "@/registry/kit/blocks/app-shell";
import { InvoicesScreen } from "@/registry/kit/screens/screen-invoices";

export default function ScreenInvoicesDemo() {
  return (
    <AppShell title="Invoices">
      <InvoicesScreen />
    </AppShell>
  );
}
