"use client";

import { Select as SelectPrimitive } from "radix-ui";
import type { ComponentProps } from "react";

import { cn } from "@/registry/kit/lib/utils";

export const Select = SelectPrimitive.Root;
export const SelectGroup = SelectPrimitive.Group;
export const SelectValue = SelectPrimitive.Value;

export function SelectTrigger({ className, children, ...props }: ComponentProps<typeof SelectPrimitive.Trigger>) {
  return (
    <SelectPrimitive.Trigger
      className={cn(
        "surface flex h-11 w-full cursor-pointer items-center justify-between gap-3 rounded-field px-4 text-left text-sm text-fg outline-none",
        "transition-[background-color] duration-300 hover:bg-surface-hover data-placeholder:text-muted",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        "disabled:cursor-not-allowed disabled:opacity-50 [&>span]:truncate",
        className,
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <svg viewBox="0 0 24 24" className="size-4 shrink-0 text-muted" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M8 10l4-4 4 4M8 14l4 4 4-4" />
        </svg>
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

/** The list opens below the trigger at the trigger's width; the inner viewport scrolls, never the surface shell. */
export function SelectContent({ className, children, sideOffset = 8, ...props }: ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        position="popper"
        sideOffset={sideOffset}
        className={cn(
          "surface-raised z-50 max-h-(--radix-select-content-available-height) w-(--radix-select-trigger-width) min-w-40 overflow-hidden rounded-field text-fg",
          "origin-(--radix-select-content-transform-origin) transition-[opacity,scale] duration-200 ease-theme starting:scale-95 starting:opacity-0 data-[state=closed]:animate-pop-out",
          className,
        )}
        {...props}
      >
        <SelectPrimitive.Viewport className="max-h-72 p-1.5">{children}</SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

export function SelectItem({ className, children, ...props }: ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      className={cn(
        "relative flex items-center rounded-[max(0.25rem,calc(var(--r-field)-0.375rem))] py-2 pr-9 pl-3 text-sm text-fg/85 outline-none select-none",
        "data-highlighted:bg-fg/10 data-highlighted:text-fg data-disabled:pointer-events-none data-disabled:opacity-40",
        className,
      )}
      {...props}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator className="absolute right-3 text-accent">
        <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M5 12.5l4.5 4.5L19 7.5" />
        </svg>
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  );
}

export function SelectLabel({ className, ...props }: ComponentProps<typeof SelectPrimitive.Label>) {
  return <SelectPrimitive.Label className={cn("px-3 pt-2 pb-1 text-[11px] tracking-[0.16em] text-muted uppercase", className)} {...props} />;
}

export function SelectSeparator({ className, ...props }: ComponentProps<typeof SelectPrimitive.Separator>) {
  return <SelectPrimitive.Separator className={cn("mx-2 my-1.5 h-px bg-fg/10", className)} {...props} />;
}
