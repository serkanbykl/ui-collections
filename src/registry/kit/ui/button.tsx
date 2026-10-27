import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/registry/kit/lib/utils";
import { Spinner } from "@/registry/kit/ui/spinner";

export const buttonVariants = cva(
  [
    "group/button relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-control",
    "font-medium whitespace-nowrap select-none",
    // Tailwind v4 writes `scale` as its own property, not `transform`.
    "transition-[scale,background-color,color,border-color] duration-300 ease-theme",
    "hover:scale-(--hover-scale) active:scale-(--press-scale)",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
    "disabled:pointer-events-none disabled:opacity-50",
  ],
  {
    variants: {
      variant: {
        // Hover fill comes from --c-button-hover when a theme sets it (tide keeps the
        // button solid white and firms up its edge instead of greying it out).
        surface:
          "surface text-fg hover:bg-[var(--c-button-hover,var(--c-surface-hover))] hover:[--surface-border:var(--c-line-strong)] hover:[--surface-shadow:var(--shadow-sm)]",
        solid: "bg-fg text-bg hover:bg-fg/90",
        accent: "bg-accent text-accent-fg hover:bg-accent/90",
        danger: "bg-danger text-bg hover:bg-danger/90",
        ghost: "text-fg/75 hover:bg-fg/5 hover:text-fg",
      },
      // Heights step 28 · 36 · 44 · 56 · 64; icons match their text size.
      size: {
        // A leading or trailing icon carries its own side bearing, so that side
        // gets a little less padding and the label + icon reads as centred.
        xs: "h-7 gap-1.5 px-3 text-xs [&_svg]:size-3.5 has-[>svg:first-child]:pl-2.5 has-[>svg:last-child]:pr-2.5",
        sm: "h-9 px-4 text-[13px] has-[>svg:first-child]:pl-3.5 has-[>svg:last-child]:pr-3.5",
        md: "h-11 px-6 text-sm has-[>svg:first-child]:pl-5 has-[>svg:last-child]:pr-5",
        lg: "h-14 px-10 text-base has-[>svg:first-child]:pl-9 has-[>svg:last-child]:pr-9",
        xl: "h-16 gap-2.5 px-12 text-lg [&_svg]:size-5 has-[>svg:first-child]:pl-11 has-[>svg:last-child]:pr-11",
        "icon-xs": "size-7 [&_svg]:size-3.5",
        "icon-sm": "size-8 [&_svg]:size-4",
        icon: "size-11",
        "icon-lg": "size-14 [&_svg]:size-6",
      },
    },
    defaultVariants: { variant: "surface", size: "md" },
  },
);

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    /** Light sweep on hover. Ignored for the ghost variant. */
    shine?: boolean;
    /** Shows a spinner, disables the button and marks it busy. */
    loading?: boolean;
  };

/**
 * A sweep of light crossing the button on hover, shown only in themes that set
 * `--shine: 1`. Also usable inside links styled with `buttonVariants`.
 */
export function ButtonShine() {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-fg/25 to-transparent opacity-0 transition-[translate,opacity] duration-700 ease-theme group-hover/button:translate-x-[300%] group-hover/button:opacity-(--shine)"
    />
  );
}

export function Button({
  className,
  variant,
  size,
  shine = true,
  loading = false,
  disabled,
  type = "button",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(buttonVariants({ variant, size }), loading && "cursor-progress", className)}
      {...props}
    >
      {loading && <Spinner size="sm" label={null} />}
      {children}
      {/* Last, so a leading icon is the first child for the optical padding below. */}
      {shine && variant !== "ghost" && !loading && <ButtonShine />}
    </button>
  );
}
