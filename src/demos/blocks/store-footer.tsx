import { StoreFooter } from "@/registry/kit/blocks/store-footer";

export default function StoreFooterDemo() {
  return (
    <StoreFooter
      brand={{ name: "Northwind Supply", href: "#/store" }}
      tagline="Clothing and goods made to be worn for a decade, then mended. Sewn in Portugal, shipped from Lisbon."
      columns={[
        { title: "Shop", links: [{ label: "New in", href: "#/store/c/new" }, { label: "Men", href: "#/store/c/men" }, { label: "Women", href: "#/store/c/women" }, { label: "Sale", href: "#/store/c/sale" }] },
        { title: "Help", links: [{ label: "Help and FAQ", href: "#/store/help" }, { label: "Shipping and returns", href: "#/store/help" }, { label: "Email us", href: "mailto:help@northwind.example" }] },
        { title: "Account", links: [{ label: "Sign in", href: "#/signin" }, { label: "Create an account", href: "#/signup" }] },
      ]}
      legal={[
        { label: "Privacy", href: "#/privacy" },
        { label: "Terms", href: "#/terms" },
      ]}
    />
  );
}
