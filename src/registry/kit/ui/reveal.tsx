"use client";

import { Fragment, useRef, type CSSProperties, type HTMLAttributes } from "react";

import { useInViewOnce } from "@/registry/kit/hooks/use-in-view-once";
import { cn } from "@/registry/kit/lib/utils";

type RevealTag = "div" | "section" | "article" | "li" | "p" | "span" | "h1" | "h2" | "h3" | "h4";

interface RevealOptions {
  /** `load` animates on first paint (CSS only, works before hydration); `view` waits until scrolled into view. */
  trigger?: "load" | "view";
  /** Delay before the first part starts, in ms. */
  delay?: number;
  /** Rise distance in px. */
  distance?: number;
  /** Starting blur in px. */
  blur?: number;
}

function useReveal<T extends HTMLElement>(trigger: RevealOptions["trigger"]) {
  const ref = useRef<T>(null);
  const inView = useInViewOnce(ref, { enabled: trigger === "view" });
  return [ref, trigger === "load" || inView ? "in" : "out"] as const;
}

function revealVars({ delay = 0, distance = 14, blur = 0 }: RevealOptions, stagger?: number) {
  return {
    "--reveal-delay": `${delay}ms`,
    "--reveal-stagger": stagger === undefined ? undefined : `${stagger}ms`,
    "--rise-distance": `${distance}px`,
    "--rise-blur": `${blur}px`,
  } as CSSProperties;
}

export interface RevealProps extends RevealOptions, HTMLAttributes<HTMLElement> {
  as?: RevealTag;
}

/** Fades and lifts a block into place. */
export function Reveal({
  as: Tag = "div",
  trigger = "view",
  delay,
  distance,
  blur,
  style,
  ...props
}: RevealProps) {
  const [ref, state] = useReveal<HTMLElement>(trigger);
  return (
    <Tag
      // Union of intrinsic tags can't narrow the ref type; all are HTMLElement.
      ref={ref as React.Ref<never>}
      data-reveal={state}
      data-reveal-part=""
      style={{ ...revealVars({ delay, distance, blur }), ...style }}
      {...props}
    />
  );
}

export interface TextRevealProps extends RevealOptions, Omit<HTMLAttributes<HTMLElement>, "children"> {
  as?: RevealTag;
  children: string;
  /** Gap between consecutive words, in ms. */
  stagger?: number;
}

/** Splits a string into words that rise in one after another. */
export function TextReveal({
  as: Tag = "p",
  trigger = "load",
  delay,
  distance = 10,
  blur = 6,
  stagger = 45,
  className,
  style,
  children,
  ...props
}: TextRevealProps) {
  const [ref, state] = useReveal<HTMLElement>(trigger);
  const words = children.split(/\s+/).filter(Boolean);

  return (
    <Tag
      ref={ref as React.Ref<never>}
      data-reveal={state}
      className={cn("text-balance", className)}
      style={{ ...revealVars({ delay, distance, blur }, stagger), ...style }}
      {...props}
    >
      {words.map((word, i) => (
        <Fragment key={i}>
          <span data-reveal-part="" className="inline-block" style={{ "--i": i } as CSSProperties}>
            {word}
          </span>
          {i < words.length - 1 && " "}
        </Fragment>
      ))}
    </Tag>
  );
}
