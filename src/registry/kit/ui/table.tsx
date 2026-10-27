import type { HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from "react";

import { cn } from "@/registry/kit/lib/utils";

export interface TableProps extends HTMLAttributes<HTMLTableElement> {
  /** Draw the surface frame. Turn off for a table that already sits inside a panel. */
  frame?: boolean;
}

/** Surface frame; the table scrolls horizontally inside it on narrow screens. */
export function Table({ className, frame = true, ...props }: TableProps) {
  const table = (
    <div className="overflow-x-auto">
      <table className={cn("w-full border-collapse text-left text-sm", className)} {...props} />
    </div>
  );
  return frame ? <div className="surface overflow-hidden rounded-card">{table}</div> : table;
}

export function TableHeader({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={cn("border-b border-line bg-fg/[0.03]", className)} {...props} />;
}

export function TableBody({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={cn("[&>tr:not(:last-child)]:border-b [&>tr]:border-fg/[0.06]", className)} {...props} />;
}

export function TableRow({ className, ...props }: HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={cn("transition-colors duration-200 hover:bg-fg/[0.04] data-[selected=true]:bg-accent/[0.07]", className)}
      {...props}
    />
  );
}

export type SortDirection = "ascending" | "descending" | false;

export interface TableHeadProps extends ThHTMLAttributes<HTMLTableCellElement> {
  /** Makes the header a sort button showing this direction. */
  sort?: SortDirection;
  onSort?: () => void;
}

export function TableHead({ className, sort, onSort, children, ...props }: TableHeadProps) {
  const sortable = onSort !== undefined;
  return (
    <th
      scope="col"
      aria-sort={sortable ? sort || "none" : undefined}
      className={cn("h-11 px-4 text-xs font-medium tracking-[0.08em] whitespace-nowrap text-muted uppercase", className)}
      {...props}
    >
      {sortable ? (
        <button
          type="button"
          onClick={onSort}
          className="group/sort -mx-1.5 inline-flex cursor-pointer items-center gap-1.5 rounded-md px-1.5 py-1 uppercase transition-colors hover:text-fg focus-visible:outline-2 focus-visible:outline-accent"
        >
          {children}
          <svg
            viewBox="0 0 24 24"
            className={cn(
              "size-3.5 transition-[rotate,opacity] duration-300 ease-theme",
              sort ? "text-accent opacity-100" : "opacity-0 group-hover/sort:opacity-60",
              sort === "descending" && "rotate-180",
            )}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M12 19V5M6 11l6-6 6 6" />
          </svg>
        </button>
      ) : (
        children
      )}
    </th>
  );
}

export function TableCell({ className, ...props }: TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={cn("px-4 py-3.5 align-middle text-fg/85", className)} {...props} />;
}

export function TableCaption({ className, ...props }: HTMLAttributes<HTMLTableCaptionElement>) {
  return <caption className={cn("caption-bottom px-4 py-3 text-left text-xs text-muted", className)} {...props} />;
}
