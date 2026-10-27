import type { CSSProperties, HTMLAttributes } from "react";

import { cn } from "@/registry/kit/lib/utils";

export interface MarqueeProps extends HTMLAttributes<HTMLDivElement> {
  /** Seconds for one full loop. */
  duration?: number;
  /** Any CSS length between items. */
  gap?: string;
  reverse?: boolean;
  pauseOnHover?: boolean;
  /** Fade the left and right edges. */
  fade?: boolean;
}

/**
 * Infinite horizontal ticker. CSS-only (works as a Server Component); the
 * duplicate track is `inert` so links aren't announced or focused twice.
 */
export function Marquee({
  duration = 30,
  gap = "3rem",
  reverse = false,
  pauseOnHover = true,
  fade = true,
  className,
  style,
  children,
  ...props
}: MarqueeProps) {
  const track = "flex shrink-0 items-center gap-(--marquee-gap) pr-(--marquee-gap)";
  return (
    <div
      className={cn(
        "group/marquee flex overflow-hidden",
        fade && "mask-[linear-gradient(to_right,transparent,#000_12%,#000_88%,transparent)]",
        className,
      )}
      style={{ "--marquee-duration": `${duration}s`, "--marquee-gap": gap, ...style } as CSSProperties}
      {...props}
    >
      <div
        className={cn(
          "flex w-max shrink-0 animate-marquee",
          reverse && "[animation-direction:reverse]",
          pauseOnHover && "group-hover/marquee:[animation-play-state:paused]",
        )}
        // Set here: the shared animation shorthand resolves its duration on :root.
        style={{ animationDuration: `${duration}s` }}
      >
        <div className={track}>{children}</div>
        <div className={track} aria-hidden inert>
          {children}
        </div>
      </div>
    </div>
  );
}
