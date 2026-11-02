"use client";

import { animate, useInView, useMotionValue } from "motion/react";
import { useEffect, useMemo, useRef } from "react";

import { cn } from "@/registry/kit/lib/utils";

export interface NumberTickerProps {
  value: number;
  /** Starting value, also what renders before hydration. */
  from?: number;
  decimals?: number;
  /** Fixed by default so server and client format identically. */
  locale?: string;
  prefix?: string;
  suffix?: string;
  className?: string;
}

/** Seconds to count, before the theme's --motion-scale. Fixed, so a large number takes no longer than a small one. */
const COUNT_SECONDS = 1.1;

/** Counts up to `value`, easing out, the first time it scrolls into view. Updates the DOM directly, not React state. */
export function NumberTicker({
  value,
  from = 0,
  decimals = 0,
  locale = "en-US",
  prefix,
  suffix,
  className,
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const current = useMotionValue(from);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const format = useMemo(
    () => new Intl.NumberFormat(locale, { minimumFractionDigits: decimals, maximumFractionDigits: decimals }),
    [locale, decimals],
  );

  useEffect(
    () =>
      current.on("change", (v) => {
        if (ref.current) ref.current.textContent = format.format(v);
      }),
    [current, format],
  );

  useEffect(() => {
    if (!inView || !ref.current) return;
    const scale = parseFloat(getComputedStyle(ref.current).getPropertyValue("--motion-scale")) || 1;
    const controls = animate(current, value, { duration: COUNT_SECONDS * scale, ease: [0.16, 1, 0.3, 1] });
    return () => controls.stop();
  }, [inView, value, current]);

  return (
    <span className={cn("tabular-nums", className)}>
      {prefix}
      <span ref={ref}>{format.format(from)}</span>
      {suffix}
    </span>
  );
}
