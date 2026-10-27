import type { CSSProperties } from "react";

import { cn } from "@/registry/kit/lib/utils";

const shapes = {
  block: "rounded-field",
  text: "h-3.5 rounded-control",
  circle: "rounded-full",
};

export interface SkeletonProps {
  /** `text` is one line of copy; `circle` is for avatars (size it with `size-*`). */
  shape?: keyof typeof shapes;
  className?: string;
  style?: CSSProperties;
}

/**
 * Placeholder for content that is loading: a faint shape with a band of light
 * sweeping across it. Size it with classes; the sweep stops under reduced motion.
 */
export function Skeleton({ shape = "block", className, style }: SkeletonProps) {
  return (
    <span
      aria-hidden
      style={style}
      className={cn(
        "block bg-size-[200%_100%] animate-shimmer",
        "bg-[linear-gradient(90deg,color-mix(in_oklab,var(--c-fg)_6%,transparent)_25%,color-mix(in_oklab,var(--c-fg)_12%,transparent)_50%,color-mix(in_oklab,var(--c-fg)_6%,transparent)_75%)]",
        shapes[shape],
        className,
      )}
    />
  );
}

/** A paragraph of placeholder lines; the last one is shorter, like real text. */
export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <span className={cn("grid gap-2.5", className)} aria-hidden>
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton key={i} shape="text" className={i === lines - 1 && lines > 1 ? "w-3/5" : "w-full"} />
      ))}
    </span>
  );
}
