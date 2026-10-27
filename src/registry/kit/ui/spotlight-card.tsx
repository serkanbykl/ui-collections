"use client";

import type { CSSProperties, HTMLAttributes, PointerEvent } from "react";

import { cn } from "@/registry/kit/lib/utils";

const rimMask: CSSProperties = {
  padding: 1,
  WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
  WebkitMaskComposite: "xor",
  maskComposite: "exclude",
};

export interface SpotlightCardProps extends HTMLAttributes<HTMLDivElement> {
  /** Radius of the light pool in px. */
  radius?: number;
  /** Any CSS color; defaults to the theme accent. */
  color?: string;
}

/**
 * Card lit by a soft pool of light that follows the pointer, with a
 * brighter catch on the rim. Pointer position is written to CSS variables,
 * so moving the mouse never re-renders React.
 */
export function SpotlightCard({
  radius = 360,
  color = "var(--color-accent)",
  className,
  style,
  children,
  onPointerMove,
  ...props
}: SpotlightCardProps) {
  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const el = event.currentTarget;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
    el.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
    onPointerMove?.(event);
  }

  const light = (strength: number) =>
    `radial-gradient(var(--spot-r) circle at var(--spot-x, 50%) var(--spot-y, 50%), color-mix(in oklab, ${color} ${strength}%, transparent), transparent 70%)`;

  return (
    <div
      className={cn("group/spot surface overflow-hidden rounded-card", className)}
      style={{ "--spot-r": `${radius}px`, ...style } as CSSProperties}
      onPointerMove={handlePointerMove}
      {...props}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover/spot:opacity-100"
        style={{ background: light(9) }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover/spot:opacity-100"
        style={{ ...rimMask, background: light(70) }}
      />
      {/* A column, so content can pin a footer with mt-auto when cards share a row height. */}
      <div className="relative flex h-full flex-col">{children}</div>
    </div>
  );
}
