"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/registry/kit/lib/utils";

const styles = `
@keyframes kit-scroll-grow { from { transform: scaleX(0) } to { transform: scaleX(1) } }
.kit-scroll-progress { transform: scaleX(0); transform-origin: left }
@supports (animation-timeline: scroll()) {
  .kit-scroll-progress { animation: kit-scroll-grow linear both }
  .kit-scroll-progress[data-scope="page"] { animation-timeline: scroll(root) }
  .kit-scroll-progress[data-scope="container"] { animation-timeline: scroll(nearest) }
}
`;

export interface ScrollProgressProps {
  /**
   * `page` pins a bar to the top of the viewport and tracks the document.
   * `container` sticks to the top of the nearest scrolling ancestor.
   */
  scope?: "page" | "container";
  className?: string;
}

function scrollParent(el: HTMLElement | null): HTMLElement | null {
  for (let node = el?.parentElement; node; node = node.parentElement) {
    const { overflowY } = getComputedStyle(node);
    if (overflowY === "auto" || overflowY === "scroll") return node;
  }
  return null;
}

/**
 * An accent hairline that fills as you scroll. Runs on CSS scroll-driven
 * animations off the main thread; browsers without them get a passive,
 * frame-throttled listener instead.
 */
export function ScrollProgress({ scope = "page", className }: ScrollProgressProps) {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar || CSS.supports("animation-timeline: scroll()")) return;

    const container = scope === "container" ? scrollParent(bar) : null;
    const target: HTMLElement | Window = container ?? window;
    let frame = 0;

    const update = () => {
      frame = 0;
      const el = container ?? document.documentElement;
      const range = el.scrollHeight - el.clientHeight;
      bar.style.setProperty("transform", `scaleX(${range > 0 ? el.scrollTop / range : 0})`);
    };
    const onScroll = () => {
      frame ||= requestAnimationFrame(update);
    };

    update();
    target.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      target.removeEventListener("scroll", onScroll);
    };
  }, [scope]);

  return (
    <>
      <style href="kit-scroll-progress" precedence="medium">
        {styles}
      </style>
      <div
        ref={barRef}
        aria-hidden
        data-scope={scope}
        className={cn(
          "kit-scroll-progress z-50 h-[2px] w-full bg-gradient-to-r from-accent/70 via-accent to-fg shadow-[0_0_10px_var(--color-accent)]",
          scope === "page" ? "fixed inset-x-0 top-0" : "sticky top-0",
          className,
        )}
      />
    </>
  );
}
