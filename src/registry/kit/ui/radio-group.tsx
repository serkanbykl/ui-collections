"use client";

import { RadioGroup as RadioPrimitive } from "radix-ui";
import type { ComponentProps } from "react";

import { cn } from "@/registry/kit/lib/utils";

export function RadioGroup({ className, ...props }: ComponentProps<typeof RadioPrimitive.Root>) {
  return <RadioPrimitive.Root className={cn("grid gap-3", className)} {...props} />;
}

export function RadioGroupItem({ className, ...props }: ComponentProps<typeof RadioPrimitive.Item>) {
  return (
    <RadioPrimitive.Item
      className={cn(
        "grid size-5 shrink-0 cursor-pointer place-items-center rounded-full border border-fg/25 bg-fg/5",
        "transition-[border-color,scale] duration-200 ease-theme active:scale-90 data-[state=checked]:border-accent",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <RadioPrimitive.Indicator className="size-2.5 rounded-full bg-accent transition-[scale] duration-200 ease-theme starting:scale-0" />
    </RadioPrimitive.Item>
  );
}

export interface RadioGroupCardProps extends Omit<ComponentProps<typeof RadioPrimitive.Item>, "title"> {
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Right-aligned detail, such as a price. */
  aside?: React.ReactNode;
}

/** A whole surface card as one radio option. */
export function RadioGroupCard({ title, description, aside, className, ...props }: RadioGroupCardProps) {
  return (
    <RadioPrimitive.Item
      className={cn(
        "group/card surface flex w-full cursor-pointer items-start gap-4 rounded-card p-4 text-left",
        "transition-[outline-color,background-color] duration-300 ease-theme hover:bg-surface-hover",
        // Outline, not an inset shadow: a shadow would replace the surface's own.
        "outline-[1.5px] -outline-offset-[1.5px] outline-transparent",
        "data-[state=checked]:bg-surface-selected data-[state=checked]:outline-accent",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border border-fg/25 transition-colors group-data-[state=checked]/card:border-accent">
        <RadioPrimitive.Indicator className="size-2.5 rounded-full bg-accent transition-[scale] duration-200 ease-theme starting:scale-0" />
      </span>
      <span className="grid flex-1 gap-1">
        <span className="text-sm font-medium text-fg">{title}</span>
        {description && <span className="text-sm text-muted">{description}</span>}
      </span>
      {aside && <span className="text-sm text-fg/85 tabular-nums">{aside}</span>}
    </RadioPrimitive.Item>
  );
}
