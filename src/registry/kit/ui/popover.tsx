"use client";

import { Popover as PopoverPrimitive } from "radix-ui";
import type { ComponentProps } from "react";

import { cn } from "@/registry/kit/lib/utils";

export const Popover = PopoverPrimitive.Root;
export const PopoverTrigger = PopoverPrimitive.Trigger;
export const PopoverAnchor = PopoverPrimitive.Anchor;
export const PopoverClose = PopoverPrimitive.Close;

/** Raised bubble that grows from its trigger. */
export function PopoverContent({
  className,
  align = "center",
  sideOffset = 10,
  ...props
}: ComponentProps<typeof PopoverPrimitive.Content>) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "surface-raised z-50 w-72 rounded-card p-5 text-sm text-fg outline-none",
          "origin-(--radix-popover-content-transform-origin) transition-[opacity,scale] duration-200 ease-theme starting:scale-95 starting:opacity-0 data-[state=closed]:animate-pop-out",
          className,
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
}
