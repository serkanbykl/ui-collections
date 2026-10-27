import type { CSSProperties } from "react";

import { cn } from "@/registry/kit/lib/utils";

// Hoisted and de-duplicated by React (href + precedence).
const keyframes = `
@keyframes kit-shimmer { from { background-position: 150% 0 } to { background-position: -50% 0 } }
`;

export interface ShimmerTextProps {
  children: React.ReactNode;
  as?: "span" | "p" | "h1" | "h2" | "h3";
  /** Seconds per sweep. */
  duration?: number;
  className?: string;
}

/**
 * Text with a slow band of light passing across it, for loading states or
 * a quiet highlight. A clipped, moving background; no JavaScript, works as
 * a Server Component.
 */
export function ShimmerText({ children, as: Tag = "span", duration = 2.6, className }: ShimmerTextProps) {
  return (
    <>
      <style href="kit-shimmer" precedence="medium">
        {keyframes}
      </style>
      <Tag
        className={cn(
          "kit-shimmer inline-block bg-[linear-gradient(110deg,var(--color-muted)_35%,var(--color-fg)_50%,var(--color-muted)_65%)] bg-size-[250%_100%] bg-clip-text text-transparent",
          className,
        )}
        style={{ animation: `kit-shimmer ${duration}s linear infinite` } as CSSProperties}
      >
        {children}
      </Tag>
    </>
  );
}
