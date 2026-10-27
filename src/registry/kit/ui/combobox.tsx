"use client";

import { Command } from "cmdk";
import { Popover } from "radix-ui";
import { useState } from "react";

import { wordFilter } from "@/registry/kit/lib/search";
import { cn } from "@/registry/kit/lib/utils";

export interface ComboboxOption<T extends string> {
  value: T;
  label: string;
  /** Secondary line, also searched. */
  description?: string;
}

export interface ComboboxProps<T extends string> {
  options: ComboboxOption<T>[];
  value: T | undefined;
  onValueChange: (value: T) => void;
  /** Accessible name for the trigger. */
  label: string;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  className?: string;
}

const surface = cn(
  "surface-raised z-50 flex flex-col overflow-hidden rounded-field text-fg outline-none",
  "origin-(--radix-popover-content-transform-origin) transition-[opacity,scale] duration-200 ease-theme",
  "starting:scale-[0.97] starting:opacity-0 data-[state=closed]:animate-pop-out",
);

/** Searchable single select for long lists, such as people, repositories or regions. */
export function Combobox<T extends string>({
  options,
  value,
  onValueChange,
  label,
  placeholder = "Select…",
  searchPlaceholder = "Search…",
  emptyText = "No matches. Try a shorter search.",
  className,
}: ComboboxProps<T>) {
  const [open, setOpen] = useState(false);
  const current = options.find((o) => o.value === value);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger
        role="combobox"
        aria-label={label}
        aria-expanded={open}
        className={cn(
          "flex h-11 w-full cursor-pointer items-center justify-between gap-3 surface-field rounded-field px-4 text-left text-sm outline-none",
          "transition-[border-color,background-color,box-shadow] duration-300 ease-theme hover:border-fg/20",
          "focus-visible:border-accent/50 focus-visible:shadow-[0_0_0_4px_color-mix(in_oklab,var(--color-accent)_12%,transparent)]",
          "data-[state=open]:border-accent/50",
          className,
        )}
      >
        <span className={cn("truncate", current ? "text-fg" : "text-muted")}>{current?.label ?? placeholder}</span>
        <svg viewBox="0 0 24 24" aria-hidden className="size-4 shrink-0 text-muted" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="m8 9 4-4 4 4M8 15l4 4 4-4" />
        </svg>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={8}
          className={cn(surface, "w-(--radix-popover-trigger-width) min-w-56 max-h-(--radix-popover-content-available-height)")}
        >
          <Command loop filter={wordFilter} className="flex min-h-0 flex-col">
            <div className="flex items-center gap-2 border-b border-fg/10 px-3.5">
              <svg viewBox="0 0 24 24" aria-hidden className="size-4 shrink-0 text-muted" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
                <circle cx="11" cy="11" r="6.5" />
                <path d="m16 16 4 4" />
              </svg>
              <Command.Input
                placeholder={searchPlaceholder}
                className="h-11 w-full bg-transparent text-sm text-fg outline-none placeholder:text-muted/80"
              />
            </div>
            <Command.List className="max-h-72 min-h-0 overflow-y-auto overscroll-contain p-1.5 [scrollbar-width:thin]">
              <Command.Empty className="px-3 py-6 text-center text-sm text-muted">{emptyText}</Command.Empty>
              {options.map((option) => {
                const isCurrent = option.value === value;
                return (
                  <Command.Item
                    key={option.value}
                    value={`${option.label} ${option.description ?? ""}`}
                    onSelect={() => {
                      onValueChange(option.value);
                      setOpen(false);
                    }}
                    className="flex cursor-pointer items-center gap-3 rounded-[max(0.25rem,calc(var(--r-field)-0.375rem))] px-2.5 py-2 text-sm outline-none data-[selected=true]:bg-fg/[0.08]"
                  >
                    <span className="min-w-0 flex-1">
                      <span className={cn("block truncate", isCurrent ? "text-fg" : "text-fg/85")}>{option.label}</span>
                      {option.description && (
                        <span className="block truncate text-xs text-muted">{option.description}</span>
                      )}
                    </span>
                    <svg viewBox="0 0 24 24" aria-hidden className={cn("size-4 shrink-0 text-accent", !isCurrent && "invisible")} fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12.5l4.5 4.5L19 7.5" />
                    </svg>
                  </Command.Item>
                );
              })}
            </Command.List>
          </Command>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
