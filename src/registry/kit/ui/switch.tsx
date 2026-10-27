"use client";

import { Switch as SwitchPrimitive } from "radix-ui";
import type { ComponentProps } from "react";

import { cn } from "@/registry/kit/lib/utils";

/** iOS-style toggle. The thumb stretches while pressed. */
export function Switch({ className, ...props }: ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      className={cn(
        "group/switch inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full p-0.5",
        "bg-fg/12 shadow-[inset_0_1px_2px_rgb(0_0_0/0.22)] transition-colors duration-300 ease-theme",
        "data-[state=unchecked]:hover:bg-fg/[0.18] data-[state=checked]:bg-accent/85 data-[state=checked]:hover:bg-accent",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          "block h-6 w-6 rounded-full bg-white shadow-[0_2px_6px_rgb(0_0_0/0.3)]",
          "transition-[translate,width] duration-300 ease-theme",
          "group-active/switch:w-7 data-[state=checked]:translate-x-5 data-[state=checked]:group-active/switch:translate-x-4",
        )}
      />
    </SwitchPrimitive.Root>
  );
}
