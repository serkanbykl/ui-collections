"use client";

import { Command } from "cmdk";
import { Popover } from "radix-ui";
import { useState } from "react";

import { wordFilter } from "@/registry/kit/lib/search";
import { cn } from "@/registry/kit/lib/utils";

export interface FacetOption<T extends string> {
  value: T;
  label: string;
  /** Number of matching records, shown on the right. */
  count?: number;
}

export interface MultiSelectProps<T extends string> {
  /** Facet name, shown on the trigger and as the list heading. */
  label: string;
  options: FacetOption<T>[];
  value: T[];
  onValueChange: (value: T[]) => void;
  /** Show a search box. Defaults to on above six options. */
  searchable?: boolean;
  className?: string;
}

// Surface shells must not scroll (glass draws its rim with ::before); the list inside does.
const surface = cn(
  "surface-raised z-50 flex flex-col overflow-hidden rounded-field text-fg outline-none",
  "origin-(--radix-popover-content-transform-origin) transition-[opacity,scale] duration-200 ease-theme",
  "starting:scale-[0.97] starting:opacity-0 data-[state=closed]:animate-pop-out",
);

/** Faceted filter: a dashed pill that opens a checkable list, with a count of what's picked. */
export function MultiSelect<T extends string>({
  label,
  options,
  value,
  onValueChange,
  searchable,
  className,
}: MultiSelectProps<T>) {
  const [open, setOpen] = useState(false);
  const selected = new Set(value);
  const showSearch = searchable ?? options.length > 6;
  const single = value.length === 1 ? options.find((o) => o.value === value[0])?.label : undefined;

  const toggle = (option: T) =>
    onValueChange(selected.has(option) ? value.filter((v) => v !== option) : [...value, option]);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger
        className={cn(
          "inline-flex h-11 cursor-pointer items-center gap-2 rounded-control border px-4 text-sm whitespace-nowrap outline-none",
          "transition-[border-color,background-color,color] duration-300 ease-theme focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
          value.length
            ? "border-accent/40 bg-accent/[0.08] text-fg"
            : "border-dashed border-fg/20 text-fg/80 hover:border-fg/35 hover:text-fg",
          className,
        )}
      >
        <svg viewBox="0 0 24 24" aria-hidden className={cn("size-4", value.length ? "text-accent" : "text-muted")} fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
          <path d="M4 6h16M7 12h10M10 18h4" />
        </svg>
        {label}
        {value.length > 0 && (
          <span className="max-w-32 truncate rounded-control bg-accent px-2 py-px text-[11px] font-medium text-accent-fg">
            {single ?? `${value.length} selected`}
          </span>
        )}
        <svg viewBox="0 0 24 24" aria-hidden className={cn("size-3.5 text-muted transition-transform duration-300", open && "rotate-180")} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content align="start" sideOffset={8} className={cn(surface, "w-64 max-h-(--radix-popover-content-available-height)")}>
          <Command loop filter={wordFilter} className="flex min-h-0 flex-col">
            {showSearch && (
              <div className="flex items-center gap-2 border-b border-fg/10 px-3.5">
                <svg viewBox="0 0 24 24" aria-hidden className="size-4 shrink-0 text-muted" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
                  <circle cx="11" cy="11" r="6.5" />
                  <path d="m16 16 4 4" />
                </svg>
                <Command.Input
                  placeholder={`Search ${label.toLowerCase()}`}
                  className="h-11 w-full bg-transparent text-sm text-fg outline-none placeholder:text-muted/80"
                />
              </div>
            )}
            <Command.List className="max-h-72 min-h-0 overflow-y-auto overscroll-contain p-1.5 [scrollbar-width:thin]">
              <Command.Empty className="px-3 py-6 text-center text-sm text-muted">No matches. Try a shorter search.</Command.Empty>
              <Command.Group
                heading={label}
                className="[&_[cmdk-group-heading]]:px-2.5 [&_[cmdk-group-heading]]:pt-1.5 [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:tracking-[0.16em] [&_[cmdk-group-heading]]:text-muted [&_[cmdk-group-heading]]:uppercase"
              >
                {options.map((option) => {
                  const checked = selected.has(option.value);
                  return (
                    <Command.Item
                      key={option.value}
                      value={option.label}
                      onSelect={() => toggle(option.value)}
                      aria-checked={checked}
                      className="flex cursor-pointer items-center gap-2.5 rounded-[max(0.25rem,calc(var(--r-field)-0.375rem))] px-2.5 py-2 text-sm text-fg/85 outline-none data-[selected=true]:bg-fg/[0.08] data-[selected=true]:text-fg"
                    >
                      <span
                        aria-hidden
                        className={cn(
                          "grid size-4 shrink-0 place-items-center rounded-[calc(var(--r-field)*0.35)] border transition-colors duration-200",
                          checked ? "border-accent bg-accent text-accent-fg" : "border-fg/25",
                        )}
                      >
                        <svg viewBox="0 0 24 24" className={cn("size-3 transition-transform duration-200", checked ? "scale-100" : "scale-0")} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12.5l4.5 4.5L19 7.5" />
                        </svg>
                      </span>
                      <span className="flex-1 truncate">{option.label}</span>
                      {option.count !== undefined && (
                        <span className="font-mono text-xs text-muted tabular-nums">{option.count}</span>
                      )}
                    </Command.Item>
                  );
                })}
              </Command.Group>
              {value.length > 0 && (
                <Command.Group className="mt-1 border-t border-fg/10 pt-1">
                  <Command.Item
                    value="__clear"
                    onSelect={() => onValueChange([])}
                    className="cursor-pointer rounded-[max(0.25rem,calc(var(--r-field)-0.375rem))] px-2.5 py-2 text-center text-sm text-muted outline-none data-[selected=true]:bg-fg/[0.08] data-[selected=true]:text-fg"
                  >
                    Clear selection
                  </Command.Item>
                </Command.Group>
              )}
            </Command.List>
          </Command>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
