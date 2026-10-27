"use client";

import { useRef } from "react";

import { useInViewOnce } from "@/registry/kit/hooks/use-in-view-once";
import { chartColors } from "@/registry/kit/lib/chart";
import { cn } from "@/registry/kit/lib/utils";

export interface FunnelStep {
  label: string;
  value: number;
}

export interface ChartFunnelProps {
  /** Two to six steps, first to last. */
  steps: FunnelStep[];
  /** Accessible name, e.g. "Signup funnel, last 30 days". */
  label: string;
  /** Height of the columns in px. */
  height?: number;
  /** Mark the step with the largest drop-off. */
  highlightDrop?: boolean;
  formatValue?: (value: number) => string;
  className?: string;
}

const pct = (part: number, whole: number) => (whole ? `${((part / whole) * 100).toFixed(1).replace(/\.0$/, "")}%` : "0%");

/**
 * Conversion funnel as columns: each step's fill is its share of the first
 * step, and the faint remainder shows who left. Every column prints its value
 * and conversion from the previous step; the biggest leak can be marked.
 */
export function ChartFunnel({
  steps,
  label,
  height = 140,
  highlightDrop = true,
  formatValue = (v) => v.toLocaleString("en-US"),
  className,
}: ChartFunnelProps) {
  const ref = useRef<HTMLOListElement>(null);
  const shown = useInViewOnce(ref);
  const first = steps[0]?.value ?? 1;

  // The step that lost the largest share of the previous one.
  let worst = -1;
  if (highlightDrop) {
    let worstRate = 1;
    steps.forEach((s, i) => {
      if (i === 0) return;
      const rate = s.value / Math.max(steps[i - 1]!.value, 1);
      if (rate < worstRate) {
        worstRate = rate;
        worst = i;
      }
    });
  }

  return (
    <ol
      ref={ref}
      aria-label={label}
      className={cn("grid w-full min-w-0 gap-1.5", className)}
      style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}
    >
      {steps.map((step, i) => {
        const share = step.value / Math.max(first, 1);
        const isWorst = i === worst;
        const color = isWorst ? chartColors.status.warning : chartColors.accent;
        return (
          <li key={step.label} className="flex min-w-0 flex-col gap-2">
            <p className="order-last text-xs leading-tight break-words text-muted">
              {step.label}
            </p>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium tabular-nums">{formatValue(step.value)}</p>
              <p className={cn("truncate text-xs tabular-nums", isWorst ? "text-warning" : "text-muted")}>
                {i === 0 ? "100%" : pct(step.value, steps[i - 1]!.value)}
                {isWorst && <span className="sr-only"> (largest drop-off)</span>}
              </p>
            </div>
            <div aria-hidden className="relative overflow-hidden rounded-[max(0.125rem,calc(var(--r-field)-0.25rem))] bg-fg/6" style={{ height }}>
              <span
                className="absolute inset-x-0 bottom-0 origin-bottom transition-[scale] duration-700 ease-theme"
                style={{
                  height: `${share * 100}%`,
                  scale: shown ? "1 1" : "1 0",
                  transitionDelay: `${i * 90}ms`,
                  background: `linear-gradient(to top, color-mix(in oklab, ${color} 85%, transparent), color-mix(in oklab, ${color} 55%, transparent))`,
                }}
              />
            </div>
          </li>
        );
      })}
    </ol>
  );
}
