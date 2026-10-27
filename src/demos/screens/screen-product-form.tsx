import { AppShell } from "@/registry/kit/blocks/app-shell";
import { ProductFormScreen } from "@/registry/kit/screens/screen-product-form";

export default function ScreenProductFormDemo() {
  return (
    <AppShell title="Edit product">
      <ProductFormScreen />
    </AppShell>
  );
}
