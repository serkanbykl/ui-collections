"use client";

import { Fragment, useEffect, useRef, type CSSProperties } from "react";

import { cn } from "@/registry/kit/lib/utils";

type Tag = "p" | "h2" | "h3" | "blockquote" | "div";

export interface ScrollTextRevealProps {
  children: string;
  as?: Tag;
  /** Opacity of words not yet reached, 0–1. */
  dim?: number;
  className?: string;
}

/**
 * A statement whose words light up one by one, in reading order, as it
 * scrolls through the viewport. Scroll writes a single `--p` (0–1) to the
 * element; CSS derives each word's opacity from it, so React never
 * re-renders. Listens only while on screen. Shown in full under reduced
 * motion or without JavaScript.
 */
export function ScrollTextReveal({ children, as: Element = "p", dim = 0.28, className }: ScrollTextRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const words = children.split(/\s+/).filter(Boolean);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Measure against the nearest scrolling ancestor, or the viewport.
    let scroller: HTMLElement | null = el.parentElement;
    while (scroller && !/(auto|scroll)/.test(getComputedStyle(scroller).overflowY)) scroller = scroller.parentElement;

    let frame = 0;
    const update = () => {
      frame = 0;
      const box = el.getBoundingClientRect();
      const view = scroller ? scroller.getBoundingClientRect() : { top: 0, height: window.innerHeight };
      // Starts as the top passes 85% of the view, done as the bottom reaches 45%.
      const progress = (view.top + view.height * 0.85 - box.top) / (box.height + view.height * 0.4);
      el.style.setProperty("--p", String(Math.min(1, Math.max(0, progress))));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        update();
        // Capture: also hears scrolling inside any scrollable ancestor.
        document.addEventListener("scroll", onScroll, { capture: true, passive: true });
        window.addEventListener("resize", onScroll);
      } else {
        document.removeEventListener("scroll", onScroll, { capture: true });
        window.removeEventListener("resize", onScroll);
      }
    });
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      document.removeEventListener("scroll", onScroll, { capture: true });
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <Element
      ref={ref as React.Ref<never>}
      className={cn("text-balance", className)}
      style={{ "--p": 0, "--n": words.length, "--dim": dim } as CSSProperties}
    >
      {words.map((word, i) => (
        <Fragment key={i}>
          <span
            className="transition-opacity duration-200 ease-theme [@media(scripting:none)]:opacity-100!"
            style={{ "--i": i, opacity: "clamp(var(--dim), calc(var(--p) * (var(--n) + 3) - var(--i)), 1)" } as CSSProperties}
          >
            {word}
          </span>
          {i < words.length - 1 && " "}
        </Fragment>
      ))}
    </Element>
  );
}
