"use client";

import { useInView, useMotionValue, useSpring } from "motion/react";
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

/** Counts up to `value` on a spring the first time it scrolls into view. Updates the DOM directly, not React state. */
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
  const target = useMotionValue(from);
  const spring = useSpring(target, { stiffness: 55, damping: 18, restDelta: 0.001 });
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const format = useMemo(
    () => new Intl.NumberFormat(locale, { minimumFractionDigits: decimals, maximumFractionDigits: decimals }),
    [locale, decimals],
  );

  useEffect(
    () =>
      spring.on("change", (v) => {
        if (ref.current) ref.current.textContent = format.format(v);
      }),
    [spring, format],
  );

  useEffect(() => {
    if (!inView) return;
    target.set(value);
  }, [inView, value, target]);

  return (
    <span className={cn("tabular-nums", className)}>
      {prefix}
      <span ref={ref}>{format.format(from)}</span>
      {suffix}
    </span>
  );
}
