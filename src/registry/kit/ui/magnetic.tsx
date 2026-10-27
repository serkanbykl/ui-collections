"use client";

import { m, useMotionValue, useSpring } from "motion/react";
import type { PointerEvent } from "react";

import { MotionScope } from "@/registry/kit/lib/motion";
import { cn } from "@/registry/kit/lib/utils";

const spring = { stiffness: 170, damping: 20, mass: 0.5 };

export interface MagneticProps {
  children: React.ReactNode;
  /** How far the content follows the pointer, as a fraction of its offset from centre. */
  strength?: number;
  className?: string;
}

/** Pulls its content toward a hovering mouse pointer and springs back on leave. */
export function Magnetic({ children, strength = 0.18, className }: MagneticProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, spring);
  const springY = useSpring(y, spring);

  function onPointerMove(event: PointerEvent<HTMLSpanElement>) {
    if (event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - rect.left - rect.width / 2) * strength);
    y.set((event.clientY - rect.top - rect.height / 2) * strength);
  }

  function reset() {
    x.set(0);
    y.set(0);
  }

  return (
    <MotionScope>
      <m.span
        className={cn("inline-block", className)}
        style={{ x: springX, y: springY }}
        onPointerMove={onPointerMove}
        onPointerLeave={reset}
      >
        {children}
      </m.span>
    </MotionScope>
  );
}
