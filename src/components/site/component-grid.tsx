
import { SiteLink as Link } from "@/components/site/site-link";
import { entryHref, type CatalogEntry } from "@/catalog";
import { cn } from "@/registry/kit/lib/utils";
import { SpotlightCard } from "@/registry/kit/ui/spotlight-card";

import { EngineBadge } from "./chrome";

export function ComponentGrid({ entries, className }: { entries: CatalogEntry[]; className?: string }) {
  return (
    <ul className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {entries.map((entry, i) => (
        <li key={entry.slug}>
          <SpotlightCard className="h-full rounded-card">
            <Link href={entryHref(entry)} className="flex h-full flex-col p-7 outline-none focus-visible:bg-fg/[0.04]">
              <div className="flex items-center justify-between">
                <span className="text-xs tracking-[0.18em] text-muted tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <EngineBadge engine={entry.engine} />
              </div>
              <h3 className="mt-8 font-display text-[1.75rem] leading-tight">{entry.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{entry.description}</p>
            </Link>
          </SpotlightCard>
        </li>
      ))}
    </ul>
  );
}
