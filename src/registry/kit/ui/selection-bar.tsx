"use client";

import { useEffect, useRef, type ReactNode } from "react";

import { cn } from "@/registry/kit/lib/utils";
import { Button } from "@/registry/kit/ui/button";

export interface SelectionBarProps {
  /** Number of selected rows; the bar shows while it is above zero. */
  count: number;
  onClear: () => void;
  /** Bulk action buttons, usually `size="sm"`. */
  children: ReactNode;
  /** What the rows are, for the count: "3 orders selected". */
  noun?: [singular: string, plural: string];
  className?: string;
}

/**
 * Floating bar for bulk actions on selected rows. It hovers over the bottom
 * of the viewport instead of joining the page flow, so selecting rows never
 * pushes the table or changes its width. While it shows, it publishes the
 * space it takes as `--selection-bar-space` on <html>, and the Toaster lifts
 * its toasts above it so an Undo toast never covers the bar.
 */
export function SelectionBar({ count, onClear, children, noun, className }: SelectionBarProps) {
  const ref = useRef<HTMLDivElement>(null);
  const shown = count > 0;

  useEffect(() => {
    const el = ref.current;
    if (!shown || !el) return;
    const root = document.documentElement;
    const publish = () => {
      const space = window.innerHeight - el.getBoundingClientRect().top + 12;
      root.style.setProperty("--selection-bar-space", `${Math.round(space)}px`);
    };
    publish();
    const observer = new ResizeObserver(publish);
    observer.observe(el);
    window.addEventListener("resize", publish);
    root.setAttribute("data-selection-bar", "");
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", publish);
      root.removeAttribute("data-selection-bar");
      root.style.removeProperty("--selection-bar-space");
    };
  }, [shown]);

  if (!shown) return null;
  const label = noun ? `${count} ${count === 1 ? noun[0] : noun[1]} selected` : `${count} selected`;
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-center px-4 sm:bottom-6 print:hidden">
      <div
        ref={ref}
        role="region"
        aria-label="Bulk actions"
        className={cn(
          "surface-raised pointer-events-auto flex max-w-full animate-pop-in flex-wrap items-center gap-2 rounded-card py-2 pr-2 pl-4 shadow-xl",
          className,
        )}
      >
        <span role="status" className="text-sm font-medium whitespace-nowrap tabular-nums">
          {label}
        </span>
        <span aria-hidden className="mx-1 hidden h-5 w-px bg-line sm:block" />
        <div className="flex flex-wrap items-center gap-2">{children}</div>
        <Button size="icon" variant="ghost" aria-label="Clear selection" className="size-8" onClick={onClear}>
          <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </Button>
      </div>
    </div>
  );
}
