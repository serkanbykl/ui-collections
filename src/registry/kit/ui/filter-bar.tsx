"use client";

import { cn } from "@/registry/kit/lib/utils";
import { Button } from "@/registry/kit/ui/button";

export interface FilterBarProps {
  /** Usually a SearchInput; takes the flexible space. */
  search?: React.ReactNode;
  /** Filter controls such as MultiSelect, Combobox or DateRangePicker. */
  filters?: React.ReactNode;
  /** Right-aligned controls such as column visibility or view toggles. */
  end?: React.ReactNode;
  /** Number of active filters; shows the reset button when above zero. */
  activeCount?: number;
  onReset?: () => void;
  className?: string;
}

/** Standard layout for search, filters and actions above a table or list. Wraps on small screens. */
export function FilterBar({ search, filters, end, activeCount = 0, onReset, className }: FilterBarProps) {
  return (
    <div role="search" className={cn("flex flex-wrap items-center gap-2", className)}>
      {search && <div className="w-full sm:w-64 lg:w-72">{search}</div>}
      <div className="flex flex-wrap items-center gap-2">
        {filters}
        {activeCount > 0 && onReset && (
          <Button variant="ghost" size="sm" onClick={onReset} className="h-11 gap-1.5 px-3.5 text-sm font-normal text-muted">
            <svg viewBox="0 0 24 24" aria-hidden className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
            Reset
            <span className="sr-only">{activeCount} active filters</span>
          </Button>
        )}
      </div>
      {end && <div className="ml-auto flex flex-wrap items-center justify-end gap-2">{end}</div>}
    </div>
  );
}
