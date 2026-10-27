"use client";

import { useLayoutEffect, type RefObject } from "react";

/**
 * Positions `indicator` over the child of `container` marked
 * `data-indicator-target="true"`, re-measuring when `activeKey` changes or the
 * container resizes. Writes styles directly, so it never triggers a render.
 * The indicator gets `data-ready` after the first placement; gate its
 * transition on that so it doesn't slide in from the left on mount.
 */
export function useSlidingIndicator(
  container: RefObject<HTMLElement | null>,
  indicator: RefObject<HTMLElement | null>,
  activeKey: string | undefined,
) {
  useLayoutEffect(() => {
    const root = container.current;
    const thumb = indicator.current;
    if (!root || !thumb) return;

    const measure = () => {
      const target = root.querySelector<HTMLElement>('[data-indicator-target="true"]');
      if (!target) {
        thumb.style.setProperty("opacity", "0");
        return;
      }
      thumb.style.setProperty("width", `${target.offsetWidth}px`);
      thumb.style.setProperty("transform", `translateX(${target.offsetLeft}px)`);
      thumb.style.setProperty("opacity", "1");
    };

    measure();
    const frame = requestAnimationFrame(() => thumb.setAttribute("data-ready", "true"));
    const observer = new ResizeObserver(measure);
    observer.observe(root);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [container, indicator, activeKey]);
}
