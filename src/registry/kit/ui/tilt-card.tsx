"use client";

import type { CSSProperties, HTMLAttributes, PointerEvent } from "react";

import { cn } from "@/registry/kit/lib/utils";

export interface TiltCardProps extends HTMLAttributes<HTMLDivElement> {
  /** Maximum tilt in degrees. */
  max?: number;
  /** Specular glare that follows the pointer. */
  glare?: boolean;
}

/**
 * A surface card that tips toward the mouse in 3D, with a glint of light
 * where the pointer sits. Angles go straight into CSS variables, so the card
 * never re-renders; it eases back flat when the pointer leaves.
 */
export function TiltCard({ max = 7, glare = true, className, style, children, ...props }: TiltCardProps) {
  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse") return;
    const el = event.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    el.style.setProperty("--rx", `${(0.5 - y) * max * 2}deg`);
    el.style.setProperty("--ry", `${(x - 0.5) * max * 2}deg`);
    el.style.setProperty("--gx", `${x * 100}%`);
    el.style.setProperty("--gy", `${y * 100}%`);
    el.setAttribute("data-tilting", "true");
  }

  function onPointerLeave(event: PointerEvent<HTMLDivElement>) {
    const el = event.currentTarget;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
    el.removeAttribute("data-tilting");
  }

  return (
    <div className="[perspective:1000px]">
      <div
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        style={{ transform: "rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg))", ...style } as CSSProperties}
        className={cn(
          "group/tilt surface relative overflow-hidden rounded-card [transform-style:preserve-3d] will-change-transform",
          // Quick to follow, slow to settle.
          "transition-transform duration-700 ease-theme data-[tilting=true]:duration-150 data-[tilting=true]:ease-out",
          className,
        )}
        {...props}
      >
        {glare && (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[radial-gradient(420px_circle_at_var(--gx,50%)_var(--gy,0%),rgb(255_255_255/0.16),transparent_55%)] opacity-0 transition-opacity duration-500 group-data-[tilting=true]/tilt:opacity-100"
          />
        )}
        <div className="relative">{children}</div>
      </div>
    </div>
  );
}
