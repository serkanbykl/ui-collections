"use client";

import { useState } from "react";

import { SiteLink as Link, useSitePathname } from "@/components/site/site-link";
import { categories, entriesIn, entryHref, listedCategories, type CatalogEntry } from "@/catalog";
import { author } from "@/collections";
import { cn } from "@/registry/kit/lib/utils";
import { buttonVariants } from "@/registry/kit/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/registry/kit/ui/sheet";
import { SidebarBrand, SidebarNav, SidebarProfile, type SidebarGroup, type SidebarLink } from "@/registry/kit/ui/sidebar-nav";

import { SearchTrigger } from "./docs-search";
import { categoryIcons, installIcon, slidersIcon, sparkIcon } from "./nav-icons";
import { openThemeDock } from "./theme-settings";

/**
 * Entries named "Family · Variant" (and a plain "Family" entry, shown as
 * Default) collapse into one expandable family; everything else stays flat.
 */
function byFamily(entries: CatalogEntry[]): SidebarLink[] {
  const families = new Map<string, CatalogEntry[]>();
  for (const entry of entries) {
    const family = entry.name.split(" · ")[0]!;
    families.set(family, [...(families.get(family) ?? []), entry]);
  }
  return [...families].map(([family, members]) =>
    members.length === 1
      ? { label: members[0]!.name, href: entryHref(members[0]!) }
      : {
          label: family,
          href: entryHref(members[0]!),
          children: members.map((e) => ({ label: e.name.split(" · ")[1] ?? "Default", href: entryHref(e) })),
        },
  );
}

const groups: SidebarGroup[] = [
  { label: "Getting started", items: [{ label: "Installation", href: "/installation", icon: installIcon }] },
  {
    label: "Library",
    items: listedCategories
      .map((category) => ({ category, entries: entriesIn(category) }))
      .filter(({ entries }) => entries.length > 0)
      .map(({ category, entries }) => ({
        label: categories[category].title,
        href: `/${category}`,
        icon: categoryIcons[category],
        badge: entries.length,
        children: byFamily(entries),
      })),
  },
];

/** Closes the mobile drawer (if any), then opens the floating tuner. */
function tune(onNavigate?: () => void) {
  onNavigate?.();
  openThemeDock();
}

function SidebarBody({ name, onNavigate }: { name: string; onNavigate?: () => void }) {
  const pathname = useSitePathname();

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex h-16 shrink-0 items-center px-4">
        <SidebarBrand icon={sparkIcon} title={name} subtitle="Component library" linkAs={Link} />
      </div>
      <div className="shrink-0 px-3 pt-2 pb-3">
        <SidebarProfile
          name={author.name}
          role={author.role}
          avatar="/avatar.svg"
          action={
            <button
              type="button"
              onClick={() => tune(onNavigate)}
              aria-label="Tune the theme"
              className="flex size-8 cursor-pointer items-center justify-center rounded-control text-muted transition-colors hover:bg-hover hover:text-fg [&_svg]:size-4"
            >
              {slidersIcon}
            </button>
          }
        />
      </div>
      <div className="shrink-0 px-3 pb-3">
        <SearchTrigger onOpen={onNavigate} />
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pb-3 [scrollbar-width:thin]">
        <SidebarNav groups={groups} currentHref={pathname} linkAs={Link} onNavigate={onNavigate} />
      </div>
      <div className="shrink-0 p-3 [@media(max-height:820px)]:hidden">
        <button
          type="button"
          onClick={() => tune(onNavigate)}
          className="group relative isolate block w-full cursor-pointer overflow-hidden rounded-card bg-accent p-4 text-left text-accent-fg outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <span aria-hidden className="absolute -top-8 -right-8 -z-10 size-24 rounded-full border-[14px] border-accent-fg/10" />
          <span className="block text-sm font-semibold">Make it yours</span>
          <span className="mt-0.5 flex items-center gap-1 text-xs opacity-80">
            Tune the theme
            <span aria-hidden className="transition-[translate] duration-200 group-hover:translate-x-0.5">
              →
            </span>
          </span>
        </button>
      </div>
    </div>
  );
}

const quickLinks = [
  { href: "/components", label: "Components" },
  { href: "/blocks", label: "Blocks" },
  { href: "/templates", label: "Templates" },
];

/** Header shortcuts to the main sections; the one you're in is marked. */
export function DocsQuickLinks() {
  const pathname = useSitePathname();
  return quickLinks.map((link) => {
    const current = pathname === link.href || pathname.startsWith(`${link.href}/`);
    return (
      <Link
        key={link.href}
        href={link.href}
        aria-current={current ? "page" : undefined}
        className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "hidden sm:inline-flex", current && "bg-hover text-fg")}
      >
        {link.label}
      </Link>
    );
  });
}

/** Desktop: the full-height sidebar. */
export function DocsSidebar({ name }: { name: string }) {
  return <SidebarBody name={name} />;
}

/** Mobile: a menu button that opens the same sidebar in a sheet. */
export function DocsMobileNav({ name, className }: { name: string; className?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        aria-label="Open navigation"
        className={cn(
          "flex size-10 items-center justify-center rounded-control text-fg transition-colors hover:bg-hover",
          className,
        )}
      >
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden>
          <path d="M4 7h16M4 12h16M4 17h10" />
        </svg>
      </SheetTrigger>
      <SheetContent side="left" bodyClassName="p-0">
        <SheetTitle className="sr-only">Navigation</SheetTitle>
        <SidebarBody name={name} onNavigate={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}
