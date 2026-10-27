import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";

import { cn } from "@/registry/kit/lib/utils";

export const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-control px-2.5 py-0.5 text-xs font-medium whitespace-nowrap [&_svg]:size-3",
  {
    variants: {
      variant: {
        surface: "surface text-fg/90",
        solid: "bg-fg text-bg",
        outline: "border border-fg/20 text-fg/80",
        accent: "bg-accent/15 text-accent",
        "accent-solid": "bg-accent text-accent-fg",
        info: "bg-info/15 text-info",
        success: "bg-success/15 text-success",
        warning: "bg-warning/15 text-warning",
        danger: "bg-danger/15 text-danger",
      },
    },
    defaultVariants: { variant: "surface" },
  },
);

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {
  /** Leading status dot in the current text colour. */
  dot?: boolean;
}

export function Badge({ className, variant, dot, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {dot && <span aria-hidden className="size-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}
