import { AppShell } from "@/registry/kit/blocks/app-shell";
import { InvoicePreviewScreen } from "@/registry/kit/screens/screen-invoice-preview";

export default function ScreenInvoicePreviewDemo() {
  return (
    <AppShell title="Invoice">
      <InvoicePreviewScreen />
    </AppShell>
  );
}
