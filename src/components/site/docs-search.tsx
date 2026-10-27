"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { useSitePath } from "@/components/site/site-link";
import { categories, entriesIn, entryHref, listedCategories } from "@/catalog";
import { cn } from "@/registry/kit/lib/utils";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  useCommandShortcut,
} from "@/registry/kit/ui/command";

import { categoryIcons, installIcon } from "./nav-icons";

const openEvent = "docs-search:open";

/** Opens the search palette from anywhere, e.g. a sidebar button. */
export function openDocsSearch() {
  window.dispatchEvent(new Event(openEvent));
}

/** Button styled like a search field; opens the palette. */
export function SearchTrigger({ className, onOpen }: { className?: string; onOpen?: () => void }) {
  return (
    <button
      type="button"
      onClick={() => {
        onOpen?.();
        openDocsSearch();
      }}
      className={cn(
        "surface-field flex h-10 w-full cursor-pointer items-center gap-2.5 rounded-control px-3 text-sm text-subtle transition-colors hover:text-muted",
        className,
      )}
    >
      <svg viewBox="0 0 24 24" className="size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden>
        <circle cx="11" cy="11" r="6.5" />
        <path d="m20 20-4-4" />
      </svg>
      <span className="min-w-0 flex-1 truncate text-left">Search…</span>
      <kbd className="shrink-0 rounded-[calc(var(--r-control)*0.5)] border border-line px-1.5 font-sans text-[11px] whitespace-nowrap text-muted">
        Ctrl K
      </kbd>
    </button>
  );
}

const pages = [
  { label: "Home", href: "/", icon: null },
  { label: "Installation", href: "/installation", icon: installIcon },
];

/** The single search palette for the docs. Mount once; listens for ⌘K / Ctrl+K. */
export function DocsSearch() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const sitePath = useSitePath();
  const toggle = useCallback(() => setOpen((v) => !v), []);
  useCommandShortcut(toggle);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener(openEvent, onOpen);
    return () => window.removeEventListener(openEvent, onOpen);
  }, []);

  function go(href: string) {
    setOpen(false);
    router.push(sitePath(href));
  }

  return (
    <CommandDialog open={open} onOpenChange={setOpen} title="Search the library">
      <CommandInput placeholder="Search components, blocks, dashboards…" />
      <CommandList>
        <CommandEmpty>Nothing matches. Try a broader word.</CommandEmpty>
        <CommandGroup heading="Pages">
          {pages.map((page) => (
            <CommandItem key={page.href} value={page.label} onSelect={() => go(page.href)}>
              {page.icon}
              {page.label}
            </CommandItem>
          ))}
        </CommandGroup>
        {listedCategories.map((category) => {
          const entries = entriesIn(category);
          if (!entries.length) return null;
          return (
            <CommandGroup key={category} heading={categories[category].title}>
              {entries.map((entry) => (
                <CommandItem
                  key={entry.slug}
                  value={`${entry.name} ${category}`}
                  keywords={[entry.slug, ...entry.description.split(/\W+/).filter((w) => w.length > 3)]}
                  onSelect={() => go(entryHref(entry))}
                >
                  {categoryIcons[category]}
                  <span className="truncate">{entry.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          );
        })}
      </CommandList>
    </CommandDialog>
  );
}
