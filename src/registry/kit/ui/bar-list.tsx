"use client";

import { useRef } from "react";

import { useInViewOnce } from "@/registry/kit/hooks/use-in-view-once";
import { cn } from "@/registry/kit/lib/utils";

export interface BarListItem {
  label: string;
  value: number;
  /** Small text or icon before the label, e.g. a flag or initials. */
  leading?: React.ReactNode;
  /** Makes the row a link. */
  href?: string;
}

export interface BarListProps {
  items: BarListItem[];
  /** Accessible name for the list, e.g. "Top pages, last 7 days". */
  label: string;
  /** Column headings shown above the rows. */
  header?: { label: string; value: string };
  formatValue?: (value: number) => string;
  /** Row height. */
  size?: "sm" | "md";
  className?: string;
}

/**
 * Ranked rows with a proportional fill behind each label: top pages, sources,
 * countries. The fills grow in when first seen. Values are always printed, so
 * the bar is never the only signal.
 */
export function BarList({ items, label, header, formatValue = (v) => v.toLocaleString("en-US"), size = "md", className }: BarListProps) {
  const ref = useRef<HTMLDivElement>(null);
  const shown = useInViewOnce(ref);
  const max = Math.max(...items.map((i) => i.value), 1);

  return (
    <div ref={ref} className={cn("min-w-0 text-sm", className)}>
      {header && (
        <div aria-hidden className="mb-1.5 flex justify-between gap-3 px-2 text-xs text-muted">
          <span>{header.label}</span>
          <span>{header.value}</span>
        </div>
      )}
      <ul aria-label={label} className="grid gap-1">
        {items.map((item, i) => {
          const row = (
            <>
              <span
                aria-hidden
                className="absolute inset-y-0 left-0 origin-left rounded-[max(0.125rem,calc(var(--r-field)-0.25rem))] bg-accent/14 transition-[scale] duration-700 ease-theme"
                style={{ width: `${(item.value / max) * 100}%`, scale: shown ? "1 1" : "0 1", transitionDelay: `${i * 60}ms` }}
              />
              <span className="relative flex min-w-0 items-center gap-2">
                {item.leading}
                <span className="truncate">{item.label}</span>
              </span>
              <span className="relative shrink-0 text-fg/80 tabular-nums">{formatValue(item.value)}</span>
            </>
          );
          const rowClass = cn(
            "relative flex items-center justify-between gap-3 rounded-[max(0.125rem,calc(var(--r-field)-0.25rem))] px-2",
            size === "sm" ? "h-7 text-xs" : "h-8",
          );
          return (
            <li key={item.label}>
              {item.href ? (
                <a
                  href={item.href}
                  className={cn(rowClass, "outline-none hover:text-accent focus-visible:outline-2 focus-visible:outline-accent")}
                >
                  {row}
                </a>
              ) : (
                <div className={rowClass}>{row}</div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
