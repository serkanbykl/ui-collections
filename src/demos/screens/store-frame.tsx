"use client";

import { useState, type ReactNode } from "react";

import { StoreFooter } from "@/registry/kit/blocks/store-footer";
import { StoreHeader, type StoreMenuItem } from "@/registry/kit/blocks/store-header";
import { addStoreLine, formatUsd, sampleStoreCollections, sampleStoreProducts, storeItemCount, type StoreCartLine } from "@/registry/kit/screens/screen-store";
import { sampleStoreCart, StoreMiniCart } from "@/registry/kit/screens/screen-store-cart";

export const demoStoreMenu: StoreMenuItem[] = sampleStoreCollections.map((c) => ({
  label: c.label,
  href: `#/store/c/${c.slug}`,
  description: c.description,
  highlight: c.highlight,
  links: c.highlight
    ? undefined
    : sampleStoreProducts
        .filter(c.match)
        .slice(0, 5)
        .map((p) => ({ label: p.name, href: `#/store/p/${p.slug}`, meta: formatUsd(p.price) })),
}));

/** Store chrome for the screen demos: header with a working cart drawer, and the footer. */
export function StoreDemoFrame({ checkout = false, children }: { checkout?: boolean; children: (cart: { add: (line: StoreCartLine) => void; lines: StoreCartLine[]; setLines: (lines: StoreCartLine[]) => void }) => ReactNode }) {
  const [lines, setLines] = useState(sampleStoreCart);
  const [open, setOpen] = useState(false);
  return (
    <div className="flex min-h-dvh flex-col bg-bg text-fg">
      <StoreHeader
        brand={{ name: "Northwind Supply", href: "#/store" }}
        menu={demoStoreMenu}
        variant={checkout ? "checkout" : "full"}
        backLink={{ label: "Back to cart", href: "#/store/cart" }}
        account={{ label: "Sign in", href: "#/signin" }}
        onSearch={() => setOpen(false)}
        cartCount={storeItemCount(lines)}
        cartOpen={open}
        onCartOpenChange={setOpen}
        cart={<StoreMiniCart lines={lines} onLinesChange={setLines} onNavigate={() => setOpen(false)} />}
      />
      <main id="main" tabIndex={-1} className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 outline-none md:px-8">
        {children({ add: (line) => setLines((current) => addStoreLine(current, line)), lines, setLines })}
      </main>
      {!checkout && <StoreFooter brand={{ name: "Northwind Supply", href: "#/store" }} tagline="Clothing and goods made to be worn for a decade, then mended." />}
    </div>
  );
}
