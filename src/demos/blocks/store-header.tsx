"use client";

import { useState } from "react";

import { StoreHeader } from "@/registry/kit/blocks/store-header";
import { storeItemCount } from "@/registry/kit/screens/screen-store";
import { sampleStoreCart, StoreMiniCart } from "@/registry/kit/screens/screen-store-cart";

import { demoStoreMenu } from "../screens/store-frame";

export default function StoreHeaderDemo() {
  const [lines, setLines] = useState(sampleStoreCart);
  return (
    <div className="min-h-[420px] bg-bg text-fg">
      <StoreHeader
        brand={{ name: "Northwind Supply", href: "#/store" }}
        menu={demoStoreMenu}
        notice={{ message: "Free shipping over $150 and repairs for life.", link: { label: "How repairs work", href: "#/store/help" } }}
        account={{ label: "Sign in", href: "#/signin" }}
        notifications={{
          items: [
            { id: "shipped", title: "Order NW-48213 has shipped", detail: "DHL Express · arrives Thursday, Oct 29", time: "35 min ago", tone: "success" },
            { id: "restock", title: "Trail runner, slate is back in stock", detail: "Your size, EU 42, is available again", time: "Yesterday", tone: "info" },
          ],
        }}
        cartCount={storeItemCount(lines)}
        cart={<StoreMiniCart lines={lines} onLinesChange={setLines} />}
      />
    </div>
  );
}
