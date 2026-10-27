"use client";

import { cn } from "@/registry/kit/lib/utils";

/** Page numbers to show: always the ends, the current page and its neighbours, with gaps as "…". */
function pageRange(page: number, count: number, siblings: number) {
  const pages: (number | "gap")[] = [];
  for (let p = 1; p <= count; p++) {
    if (p === 1 || p === count || Math.abs(p - page) <= siblings) pages.push(p);
    else if (pages.at(-1) !== "gap") pages.push("gap");
  }
  return pages;
}

export interface PaginationProps {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  /** Pages shown either side of the current one. */
  siblings?: number;
  /** First- and last-page buttons at the ends. */
  showEdges?: boolean;
  className?: string;
}

const cell =
  "grid h-9 min-w-9 cursor-pointer place-items-center rounded-[max(0.125rem,calc(var(--r-control)-0.25rem))] px-3 text-sm transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-accent disabled:pointer-events-none disabled:opacity-35";

// Chevrons drawn symmetric about x = 12 so they sit optically centred.
const icons = {
  first: "M18 6l-6 6 6 6M12 6l-6 6 6 6",
  previous: "M15 6l-6 6 6 6",
  next: "M9 6l6 6-6 6",
  last: "M6 6l6 6-6 6M12 6l6 6-6 6",
};

export function Pagination({ page, pageCount, onPageChange, siblings = 1, showEdges = true, className }: PaginationProps) {
  const step = (kind: keyof typeof icons, target: number, label: string) => (
    <button
      type="button"
      aria-label={label}
      disabled={target === page || target < 1 || target > pageCount}
      onClick={() => onPageChange(target)}
      className={cn(cell, "px-0 text-muted hover:bg-fg/8 hover:text-fg")}
    >
      <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d={icons[kind]} />
      </svg>
    </button>
  );

  return (
    <nav aria-label="Pagination" className={cn("surface inline-flex max-w-full flex-wrap items-center justify-center gap-0.5 rounded-control p-1", className)}>
      {showEdges && step("first", 1, "First page")}
      {step("previous", page - 1, "Previous page")}
      {pageRange(page, pageCount, siblings).map((p, i) =>
        p === "gap" ? (
          <span key={`gap-${i}`} aria-hidden className="px-1 text-muted">
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            aria-current={p === page ? "page" : undefined}
            onClick={() => onPageChange(p)}
            className={cn(
              cell,
              "tabular-nums",
              p === page
                ? "bg-fg/14 text-fg shadow-[inset_0_1px_0_rgb(255_255_255/0.3)]"
                : "text-muted hover:bg-fg/8 hover:text-fg",
            )}
          >
            {p}
          </button>
        ),
      )}
      {step("next", page + 1, "Next page")}
      {showEdges && step("last", pageCount, "Last page")}
    </nav>
  );
}
