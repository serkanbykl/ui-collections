import { AppShell } from "@/registry/kit/blocks/app-shell";
import { InvoiceEditorScreen } from "@/registry/kit/screens/screen-invoice-editor";

export default function ScreenInvoiceEditorDemo() {
  return (
    <AppShell title="New invoice">
      <InvoiceEditorScreen />
    </AppShell>
  );
}
