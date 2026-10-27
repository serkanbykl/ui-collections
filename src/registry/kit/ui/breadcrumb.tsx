import type { HTMLAttributes } from "react";

import { cn } from "@/registry/kit/lib/utils";

export interface BreadcrumbItem {
  label: React.ReactNode;
  href?: string;
}

const crumbClass =
  "rounded-md text-muted outline-none transition-colors hover:text-fg focus-visible:outline-2 focus-visible:outline-accent";

/**
 * Trail of links. The last item is the current page and isn't a link.
 * Pass `onSelect` to handle navigation yourself (client routing, in-app
 * drill-down); items then render as buttons when they have no `href`.
 * `itemProps` adds attributes and handlers to each crumb, e.g. to make
 * crumbs drop targets in a file browser.
 */
export function Breadcrumb({
  items,
  onSelect,
  itemProps,
  className,
}: {
  items: BreadcrumbItem[];
  onSelect?: (index: number) => void;
  itemProps?: (index: number) => HTMLAttributes<HTMLElement> & Record<`data-${string}`, string | boolean | undefined>;
  className?: string;
}) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-1.5 text-sm">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={i} className="flex items-center gap-1.5">
              {last ? (
                <span aria-current="page" {...itemProps?.(i)} className={cn("rounded-md text-fg", itemProps?.(i).className)}>
                  {item.label}
                </span>
              ) : item.href ? (
                <a href={item.href} onClick={onSelect && (() => onSelect(i))} {...itemProps?.(i)} className={cn(crumbClass, itemProps?.(i).className)}>
                  {item.label}
                </a>
              ) : onSelect ? (
                <button type="button" onClick={() => onSelect(i)} {...itemProps?.(i)} className={cn(crumbClass, "cursor-pointer", itemProps?.(i).className)}>
                  {item.label}
                </button>
              ) : (
                <span {...itemProps?.(i)} className={cn("text-muted", itemProps?.(i).className)}>{item.label}</span>
              )}
              {!last && (
                <svg viewBox="0 0 24 24" className="size-3.5 text-fg/30" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                  <path d="M9 6l6 6-6 6" />
                </svg>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
