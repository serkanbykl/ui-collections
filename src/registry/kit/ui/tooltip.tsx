"use client";

import { Tooltip as TooltipPrimitive } from "radix-ui";
import type { ComponentProps } from "react";

import { cn } from "@/registry/kit/lib/utils";

/** Wrap the app (or a region) once so tooltips share a delay. */
export function TooltipProvider({ delayDuration = 250, ...props }: ComponentProps<typeof TooltipPrimitive.Provider>) {
  return <TooltipPrimitive.Provider delayDuration={delayDuration} {...props} />;
}

export const Tooltip = TooltipPrimitive.Root;
export const TooltipTrigger = TooltipPrimitive.Trigger;

export function TooltipContent({ className, sideOffset = 8, ...props }: ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        sideOffset={sideOffset}
        className={cn(
          "surface-raised z-50 max-w-64 rounded-control px-3.5 py-1.5 text-xs text-fg",
          "origin-(--radix-tooltip-content-transform-origin) transition-[opacity,scale] duration-150 ease-theme starting:scale-90 starting:opacity-0 data-[state=closed]:animate-pop-out",
          className,
        )}
        {...props}
      />
    </TooltipPrimitive.Portal>
  );
}

/** Shorthand for the common case: one trigger, one line of text. */
export function SimpleTooltip({
  content,
  children,
  side,
}: {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: ComponentProps<typeof TooltipPrimitive.Content>["side"];
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side={side}>{content}</TooltipContent>
    </Tooltip>
  );
}
