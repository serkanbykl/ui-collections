"use client";

import { LazyMotion, MotionConfig, domAnimation } from "motion/react";

/**
 * Loads only the `domAnimation` feature set (no drag/layout). Motion runs for
 * everyone, reduced-motion setting or not: these are short, small springs,
 * mostly following the user's own pointer (see AGENTS.md rule 3). Components
 * wrap themselves in it so they work without an app-level provider; nesting
 * is cheap.
 */
export function MotionScope({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="never">{children}</MotionConfig>
    </LazyMotion>
  );
}
