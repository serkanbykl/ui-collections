import { AppShell } from "@/registry/kit/blocks/app-shell";
import { ProductDetailScreen } from "@/registry/kit/screens/screen-product-detail";

export default function ScreenProductDetailDemo() {
  return (
    <AppShell title="Product">
      <ProductDetailScreen />
    </AppShell>
  );
}
