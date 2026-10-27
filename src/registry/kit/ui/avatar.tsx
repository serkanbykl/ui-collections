"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { Avatar as AvatarPrimitive } from "radix-ui";
import { Children, type ComponentProps } from "react";

import { cn } from "@/registry/kit/lib/utils";

const avatarVariants = cva("relative inline-flex shrink-0 overflow-hidden rounded-full ring-1 ring-fg/15", {
  variants: {
    size: {
      sm: "size-8 text-[11px] [--avatar-r:16px] [--avatar-o:6px]",
      md: "size-10 text-xs [--avatar-r:20px] [--avatar-o:8px]",
      lg: "size-14 text-base [--avatar-r:28px] [--avatar-o:12px]",
    },
  },
  defaultVariants: { size: "md" },
});

export interface AvatarProps extends ComponentProps<typeof AvatarPrimitive.Root>, VariantProps<typeof avatarVariants> {
  src?: string;
  alt: string;
  /** Shown while the image loads or if it fails. Defaults to initials from `alt`. */
  fallback?: string;
  /** Classes for the initials fallback, e.g. a tinted gradient instead of the surface. */
  fallbackClassName?: string;
}

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

/** Photo with a surface initials fallback that fades out once the image loads. */
export function Avatar({ src, alt, fallback, fallbackClassName, size, className, ...props }: AvatarProps) {
  return (
    <AvatarPrimitive.Root className={cn(avatarVariants({ size }), className)} {...props}>
      {src && <AvatarPrimitive.Image src={src} alt={alt} className="size-full object-cover" />}
      <AvatarPrimitive.Fallback
        delayMs={src ? 400 : 0}
        className={cn("surface grid size-full place-items-center rounded-full font-medium text-fg/90", fallbackClassName)}
      >
        {fallback ?? initials(alt)}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  );
}

/**
 * Overlapping stack. Extra avatars beyond `max` collapse into a +N bubble.
 * Each avatar has a crescent cut where the next one overlaps it, with a thin
 * gap, instead of a ring in a guessed background colour: the gap is truly
 * transparent, so it reads right on any surface, and translucent avatars
 * don't show each other's edges through.
 */
export function AvatarGroup({
  max = 4,
  size,
  className,
  children,
}: {
  max?: number;
  size?: AvatarProps["size"];
  className?: string;
  children: React.ReactNode;
}) {
  const items = Children.toArray(children);
  const hidden = items.length - max;
  return (
    <div
      className={cn(
        // Each size sets its radius (--avatar-r) and overlap (--avatar-o), small enough that the cut clears the initials.
        // The next avatar's centre sits at 150% − overlap; its edge plus a 2.5px gap is cut away. Radii are px: a
        // percentage inside calc() makes Chromium drop the gradient.
        "flex [&>*+*]:-ml-(--avatar-o) [&>*:not(:last-child)]:[mask-image:radial-gradient(calc(var(--avatar-r)_+_2.5px)_calc(var(--avatar-r)_+_2.5px)_at_calc(150%_-_var(--avatar-o))_50%,transparent_98%,#000)]",
        className,
      )}
    >
      {items.slice(0, max)}
      {hidden > 0 && (
        <span className={cn(avatarVariants({ size }), "surface-raised grid place-items-center font-medium text-fg")}>
          +{hidden}
        </span>
      )}
    </div>
  );
}
