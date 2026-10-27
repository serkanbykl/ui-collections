import { AppShell } from "@/registry/kit/blocks/app-shell";
import { ProductsScreen } from "@/registry/kit/screens/screen-products";

export default function ScreenProductsDemo() {
  return (
    <AppShell title="Products">
      <ProductsScreen />
    </AppShell>
  );
}
