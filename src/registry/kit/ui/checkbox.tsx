"use client";

import { Checkbox as CheckboxPrimitive } from "radix-ui";
import type { ComponentProps } from "react";

import { cn } from "@/registry/kit/lib/utils";

/** Rounded checkbox with an accent fill. Supports `checked="indeterminate"`. */
export function Checkbox({ className, ...props }: ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      className={cn(
        "peer grid size-5 shrink-0 cursor-pointer place-items-center rounded-[calc(var(--r-field)*0.4)] border border-fg/25 bg-fg/5 text-accent-fg",
        "transition-[background-color,border-color,scale] duration-200 ease-theme hover:border-fg/45 active:scale-90",
        "data-[state=checked]:border-accent data-[state=checked]:bg-accent",
        "data-[state=indeterminate]:border-accent data-[state=indeterminate]:bg-accent",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="group/indicator grid place-items-center transition-[scale,opacity] duration-200 ease-theme starting:scale-50 starting:opacity-0">
        <svg viewBox="0 0 24 24" className="size-3.5 group-data-[state=indeterminate]/indicator:hidden" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M5 12.5l4.5 4.5L19 7.5" />
        </svg>
        <svg viewBox="0 0 24 24" className="hidden size-3.5 group-data-[state=indeterminate]/indicator:block" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden>
          <path d="M6 12h12" />
        </svg>
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}
