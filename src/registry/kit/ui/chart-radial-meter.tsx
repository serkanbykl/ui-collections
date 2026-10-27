"use client";

import { useRef } from "react";

import { useInViewOnce } from "@/registry/kit/hooks/use-in-view-once";
import { arcPath, chartColors, useChartShape } from "@/registry/kit/lib/chart";
import { cn } from "@/registry/kit/lib/utils";

export interface ChartRadialMeterProps {
  value: number;
  max?: number;
  label: string;
  /** Text in the centre; defaults to the percentage. */
  display?: string;
  /** Switch to status colours at these values (in the same unit as `value`). */
  thresholds?: { warning: number; critical: number };
  className?: string;
}

const size = 160;
const thickness = 12;
// 270° sweep, open at the bottom.
const start = (-135 * Math.PI) / 180;
const end = (135 * Math.PI) / 180;

/**
 * Gauge for a single bounded value: CPU, quota, budget used. The track is a
 * faint step of the fill's own colour; past a threshold the fill turns to a
 * status colour and a labelled status line appears, so meaning never rests
 * on colour alone.
 */
export function ChartRadialMeter({ value, max = 100, label, display, thresholds, className }: ChartRadialMeterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const shown = useInViewOnce(ref);
  const { cap } = useChartShape(ref);
  const fraction = Math.min(Math.max(value / max, 0), 1);
  const status = !thresholds
    ? null
    : value >= thresholds.critical
      ? ({ name: "Critical", color: chartColors.status.critical } as const)
      : value >= thresholds.warning
        ? ({ name: "Warning", color: chartColors.status.warning } as const)
        : null;
  const color = status?.color ?? chartColors.accent;
  const r = size / 2 - thickness / 2 - 2;
  const arc = arcPath(size / 2, size / 2, r, start, end);

  return (
    <div
      ref={ref}
      role="meter"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-valuetext={`${display ?? `${Math.round(fraction * 100)}%`}${status ? `, ${status.name}` : ""}`}
      className={cn("relative aspect-square w-full max-w-40", className)}
    >
      <svg viewBox={`0 0 ${size} ${size}`} className="size-full" aria-hidden>
        <path d={arc} fill="none" stroke={color} strokeOpacity="0.16" strokeWidth={thickness} strokeLinecap={cap} />
        <path
          d={arc}
          fill="none"
          stroke={color}
          strokeWidth={thickness}
          strokeLinecap={cap}
          pathLength={1}
          strokeDasharray="1"
          className="transition-[stroke-dashoffset,stroke] duration-1000 ease-theme"
          // A zero-length round cap still draws a dot; hide the fill entirely at 0.
          style={{ strokeDashoffset: shown ? 1 - fraction : 1, opacity: fraction === 0 ? 0 : 1 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-3xl font-semibold tracking-tight tabular-nums">{display ?? `${Math.round(fraction * 100)}%`}</span>
        <span className="mt-0.5 max-w-[75%] truncate text-xs text-muted">{label}</span>
        {status && (
          <span className="mt-1.5 inline-flex items-center gap-1.5 text-[11px] font-medium text-fg">
            <svg viewBox="0 0 12 12" className="size-3" aria-hidden>
              <path d="M6 1.5 11 10.5H1Z" fill={status.color} />
              <path d="M6 5v2.5M6 9h.01" stroke="var(--color-card)" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            {status.name}
          </span>
        )}
      </div>
    </div>
  );
}
