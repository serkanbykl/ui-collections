"use client";

import { Slider as SliderPrimitive } from "radix-ui";
import type { ComponentProps } from "react";

import { cn } from "@/registry/kit/lib/utils";

/** Accent-filled track with round thumbs. Pass two values for a range. */
/** `aria-label` names the thumb(s), where screen readers announce it. */
export function Slider({ className, value, defaultValue, "aria-label": ariaLabel, ...props }: ComponentProps<typeof SliderPrimitive.Root>) {
  const thumbs = (value ?? defaultValue ?? [0]).length;
  return (
    <SliderPrimitive.Root
      value={value}
      defaultValue={defaultValue}
      className={cn(
        "relative flex h-6 w-full touch-none items-center select-none data-disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-1.5 grow overflow-hidden rounded-full bg-fg/12 shadow-[inset_0_1px_2px_rgb(0_0_0/0.2)]">
        <SliderPrimitive.Range className="absolute h-full rounded-full bg-accent" />
      </SliderPrimitive.Track>
      {Array.from({ length: thumbs }, (_, i) => (
        <SliderPrimitive.Thumb
          key={i}
          aria-label={ariaLabel}
          className={cn(
            "block size-5 cursor-grab rounded-full bg-white shadow-[0_2px_8px_rgb(0_0_0/0.3),0_0_0_4px_color-mix(in_oklab,var(--color-fg)_12%,transparent)]",
            "transition-[scale,box-shadow] duration-200 ease-theme hover:scale-110 active:cursor-grabbing active:scale-125",
            "focus-visible:shadow-[0_2px_8px_rgb(0_0_0/0.3),0_0_0_5px_color-mix(in_oklab,var(--color-accent)_45%,transparent)] focus-visible:outline-none",
          )}
        />
      ))}
    </SliderPrimitive.Root>
  );
}
