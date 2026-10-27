"use client";

import { useState, type MouseEvent } from "react";

import { Button } from "@/registry/kit/ui/button";
import { SiteNav } from "@/registry/kit/ui/site-nav";

const items = [
  { label: "Product", href: "#product" },
  { label: "Docs", href: "#docs" },
  { label: "Changelog", href: "#changelog" },
  { label: "Pricing", href: "#pricing" },
];

export default function SiteNavDemo() {
  // The demo page has no such sections, so clicks move the active pill instead of the URL.
  const [active, setActive] = useState("#docs");
  const [signedIn, setSignedIn] = useState(false);

  function onClickCapture(e: MouseEvent) {
    const link = (e.target as HTMLElement).closest("a[href^='#']");
    if (!link) return;
    e.preventDefault();
    setActive(link.getAttribute("href")!);
  }

  return (
    <div className="w-full self-start" onClickCapture={onClickCapture}>
      <SiteNav
        fixed={false}
        activeHref={active}
        items={items}
        brand={<span className="font-display text-2xl tracking-tight">acme</span>}
        action={
          <Button size="sm" onClick={() => setSignedIn((v) => !v)}>
            {signedIn ? "Sign out" : "Sign in"}
          </Button>
        }
      />
    </div>
  );
}
