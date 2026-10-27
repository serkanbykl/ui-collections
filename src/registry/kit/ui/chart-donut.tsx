"use client";

import { useId, useRef, useState } from "react";

import { useInViewOnce } from "@/registry/kit/hooks/use-in-view-once";
import { ringSlicePath, seriesColor, useChartShape } from "@/registry/kit/lib/chart";
import { cn } from "@/registry/kit/lib/utils";

export interface DonutSlice {
  label: string;
  value: number;
  color?: string;
}

export interface ChartDonutProps {
  data: DonutSlice[];
  label: string;
  /** Shown in the middle when nothing is hovered. Defaults to the total. */
  centerValue?: string;
  centerLabel?: string;
  formatValue?: (value: number) => string;
  /** Ring thickness in px at the default 200px size. */
  thickness?: number;
  legend?: boolean;
  className?: string;
}

const size = 200;
const gapPx = 4;

/**
 * Donut with a 4px gap between slices whose corners follow the theme's
 * corner setting (square, soft or fully round) and a centre readout that
 * follows the hovered slice. Up to four slices take the categorical slots;
 * a fifth onward should be folded into "Other" before passing data in.
 */
export function ChartDonut({
  data,
  label,
  centerValue,
  centerLabel = "Total",
  formatValue = (v) => v.toLocaleString("en-US"),
  thickness = 18,
  legend = true,
  className,
}: ChartDonutProps) {
  const ref = useRef<HTMLDivElement>(null);
  const shown = useInViewOnce(ref);
  const { corner } = useChartShape(ref);
  const maskId = useId();
  const [active, setActive] = useState<number | null>(null);

  const total = data.reduce((sum, d) => sum + d.value, 0) || 1;
  const r = size / 2 - thickness / 2 - 2;
  // Rounder ends read as touching sooner, so the gap opens up a little with them.
  const pad = data.filter((d) => d.value > 0).length > 1 ? (gapPx + corner * 4) / r : 0;
  const sweeps = data.map((d) => (d.value / total) * Math.PI * 2);
  const slices = data.map((d, i) => {
    const angle = sweeps.slice(0, i).reduce((a, b) => a + b, 0);
    const sweep = sweeps[i]!;
    // A slice smaller than the gap budget still shows as a dot at its centre.
    const half = sweep > pad ? (sweep - pad) / 2 : sweep > 0 ? 0.0005 : -1;
    const mid = angle + sweep / 2;
    return { ...d, color: d.color ?? seriesColor(i), a0: mid - half, a1: mid + half };
  });
  const focus = active === null ? null : slices[active];

  return (
    <div className={cn("flex flex-wrap items-center justify-center gap-6", className)}>
      <div ref={ref} role="img" aria-label={label} className="relative aspect-square w-full max-w-48 shrink-0" onPointerLeave={() => setActive(null)}>
        <svg viewBox={`0 0 ${size} ${size}`} className="size-full" aria-hidden>
          {/* The track only shows when there is nothing to draw, so the gaps between slices stay clear. */}
          {!data.some((d) => d.value > 0) && (
            <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--color-hover)" strokeWidth={thickness} />
          )}
          <defs>
            {/* One sweep reveals the ring on first view; slices keep their own shape and corners. */}
            <mask id={maskId}>
              <circle
                cx={size / 2}
                cy={size / 2}
                r={r}
                fill="none"
                stroke="white"
                strokeWidth={thickness + 12}
                pathLength={1}
                strokeDasharray="1 1"
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
                className="transition-[stroke-dashoffset] duration-1000 ease-theme"
                style={{ strokeDashoffset: shown ? 0 : 1 }}
              />
            </mask>
          </defs>
          <g mask={`url(#${maskId})`}>
            {slices.map((s, i) => {
              if (s.a1 < s.a0) return null;
              const lift = active === i ? 2 : 0;
              const shape = ringSlicePath(size / 2, size / 2, r - thickness / 2 - lift, r + thickness / 2 + lift, s.a0, s.a1, (corner * thickness) / 2);
              return (
                <path
                  key={s.label}
                  d={shape.d}
                  fill={s.color}
                  stroke={shape.stroke ? s.color : "none"}
                  strokeWidth={shape.stroke}
                  strokeLinejoin="round"
                  onPointerEnter={() => setActive(i)}
                  className={cn(
                    "cursor-default transition-opacity duration-300 ease-theme",
                    active !== null && active !== i && "opacity-40",
                  )}
                />
              );
            })}
          </g>
        </svg>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-semibold tracking-tight tabular-nums">
            {focus ? formatValue(focus.value) : (centerValue ?? formatValue(total))}
          </span>
          <span className="mt-0.5 max-w-[70%] truncate text-xs text-muted">{focus ? focus.label : centerLabel}</span>
        </div>
      </div>

      {legend && (
        <ul className="grid min-w-0 flex-1 basis-60 gap-2 text-sm">
          {slices.map((s, i) => (
            <li
              key={s.label}
              onPointerEnter={() => setActive(i)}
              onPointerLeave={() => setActive(null)}
              className={cn(
                "flex items-center gap-3 rounded-[max(0.25rem,calc(var(--r-field)-0.375rem))] px-2 py-1 transition-colors",
                active === i && "bg-fg/[0.06]",
              )}
            >
              <span aria-hidden className="size-2.5 shrink-0 rounded-[calc(var(--r-field)*0.2)]" style={{ backgroundColor: s.color }} />
              <span className="min-w-0 flex-1 truncate text-fg/80">{s.label}</span>
              <span className="shrink-0 text-fg tabular-nums">{formatValue(s.value)}</span>
              <span className="w-9 shrink-0 text-right text-xs text-muted tabular-nums">{Math.round((s.value / total) * 100)}%</span>
            </li>
          ))}
        </ul>
      )}

      <div className="sr-only">
        <table>
        <caption>{label}</caption>
        <tbody>
          {data.map((d) => (
            <tr key={d.label}>
              <th scope="row">{d.label}</th>
              <td>{formatValue(d.value)}</td>
              <td>{Math.round((d.value / total) * 100)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}

