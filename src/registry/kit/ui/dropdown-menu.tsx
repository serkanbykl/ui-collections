"use client";

import { DropdownMenu as MenuPrimitive } from "radix-ui";
import type { ComponentProps, HTMLAttributes } from "react";

import { cn } from "@/registry/kit/lib/utils";

export const DropdownMenu = MenuPrimitive.Root;
export const DropdownMenuTrigger = MenuPrimitive.Trigger;
export const DropdownMenuGroup = MenuPrimitive.Group;

export function DropdownMenuContent({
  className,
  sideOffset = 8,
  align = "start",
  ...props
}: ComponentProps<typeof MenuPrimitive.Content>) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Content
        sideOffset={sideOffset}
        align={align}
        className={cn(
          "surface-raised z-50 min-w-52 rounded-field p-1.5 text-fg outline-none",
          "origin-(--radix-dropdown-menu-content-transform-origin) transition-[opacity,scale] duration-200 ease-theme starting:scale-95 starting:opacity-0 data-[state=closed]:animate-pop-out",
          className,
        )}
        {...props}
      />
    </MenuPrimitive.Portal>
  );
}

const itemClass = cn(
  "relative flex items-center gap-2.5 rounded-[max(0.25rem,calc(var(--r-field)-0.375rem))] px-3 py-2 text-sm text-fg/85 outline-none select-none",
  "transition-colors data-highlighted:bg-fg/10 data-highlighted:text-fg data-disabled:pointer-events-none data-disabled:opacity-40",
  "[&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-muted data-highlighted:[&_svg]:text-fg",
);

export function DropdownMenuItem({
  className,
  variant = "default",
  ...props
}: ComponentProps<typeof MenuPrimitive.Item> & { variant?: "default" | "danger" }) {
  return (
    <MenuPrimitive.Item
      className={cn(
        itemClass,
        // The base highlight turns icons to fg; a danger item's icon keeps its colour.
        variant === "danger" && "text-danger data-highlighted:bg-danger/15 data-highlighted:text-danger [&_svg]:text-danger data-highlighted:[&_svg]:text-danger",
        className,
      )}
      {...props}
    />
  );
}

export function DropdownMenuCheckboxItem({ className, children, ...props }: ComponentProps<typeof MenuPrimitive.CheckboxItem>) {
  return (
    <MenuPrimitive.CheckboxItem className={cn(itemClass, "pl-9", className)} {...props}>
      <span className="absolute left-3 grid size-4 place-items-center">
        <MenuPrimitive.ItemIndicator>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" className="text-accent!" aria-hidden>
            <path d="M5 12.5l4.5 4.5L19 7.5" />
          </svg>
        </MenuPrimitive.ItemIndicator>
      </span>
      {children}
    </MenuPrimitive.CheckboxItem>
  );
}

export function DropdownMenuLabel({ className, ...props }: ComponentProps<typeof MenuPrimitive.Label>) {
  return <MenuPrimitive.Label className={cn("px-3 pt-2 pb-1 text-[11px] tracking-[0.16em] text-muted uppercase", className)} {...props} />;
}

export function DropdownMenuSeparator({ className, ...props }: ComponentProps<typeof MenuPrimitive.Separator>) {
  return <MenuPrimitive.Separator className={cn("mx-2 my-1.5 h-px bg-fg/10", className)} {...props} />;
}

export function DropdownMenuShortcut({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn("ml-auto pl-4 font-mono text-[11px] text-muted", className)} {...props} />;
}
