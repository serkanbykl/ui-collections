"use client";

import { Progress as ProgressPrimitive } from "radix-ui";
import type { ComponentProps, CSSProperties } from "react";

import { cn } from "@/registry/kit/lib/utils";

export type ProgressTone = "accent" | "success" | "warning" | "danger" | "info";

export interface ProgressProps extends ComponentProps<typeof ProgressPrimitive.Root> {
  /** Fill colour; every tone uses the same light-to-full gradient. */
  tone?: ProgressTone;
  /** Extra classes for the fill. */
  indicatorClassName?: string;
}

/** Slim track whose fill eases to each new value. */
export function Progress({ className, tone = "accent", indicatorClassName, value = 0, max = 100, ...props }: ProgressProps) {
  const percent = Math.min(100, Math.max(0, ((value ?? 0) / max) * 100));
  return (
    <ProgressPrimitive.Root
      value={value}
      max={max}
      className={cn("relative h-2 w-full overflow-hidden rounded-full bg-fg/10 shadow-[inset_0_1px_2px_rgb(0_0_0/0.2)]", className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn(
          // The fill is slid in from the left, so the gradient starts where it becomes visible:
          // every bar fades light to full over its own length, however short.
          "h-full w-full rounded-full bg-[linear-gradient(90deg,transparent_var(--from),color-mix(in_oklab,var(--bar)_45%,transparent)_var(--from),var(--bar))] transition-[translate] duration-700 ease-theme",
          indicatorClassName,
        )}
        style={{ translate: `${percent - 100}% 0`, "--bar": `var(--color-${tone})`, "--from": `${100 - percent}%` } as CSSProperties}
      />
    </ProgressPrimitive.Root>
  );
}
