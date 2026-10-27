"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createContext, useCallback, useContext, type ComponentProps } from "react";

/**
 * The collection site writes its links from its own root ("/components").
 * In path mode that root is "/glass", so these helpers add the prefix on the
 * way out and strip it when comparing against the current path. On a
 * subdomain the prefix is empty and they change nothing.
 */
const BaseContext = createContext("");

export function SiteBase({ base, children }: { base: string; children: React.ReactNode }) {
  return <BaseContext value={base}>{children}</BaseContext>;
}

/** Turns a site-root path ("/components") into a real one ("/glass/components"). */
export function useSitePath() {
  const base = useContext(BaseContext);
  return useCallback((href: string) => (href.startsWith("/") && !href.startsWith("//") ? `${base}${href === "/" && base ? "" : href}` : href), [base]);
}

/** The current path from the collection's root, so "/glass/blocks" reads as "/blocks". */
export function useSitePathname() {
  const base = useContext(BaseContext);
  const pathname = usePathname();
  if (!base || !pathname.startsWith(base)) return pathname;
  return pathname.slice(base.length) || "/";
}

/** next/link, with site-root hrefs resolved against the collection. */
export function SiteLink({ href, ...props }: ComponentProps<typeof Link>) {
  const resolve = useSitePath();
  return <Link href={typeof href === "string" ? resolve(href) : href} {...props} />;
}
