"use client";

import { useId, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";

import { useInViewOnce } from "@/registry/kit/hooks/use-in-view-once";
import {
  areaPath,
  chartColors,
  formatCompact,
  linePath,
  niceTicks,
  scaleLinear,
  seriesColor,
  useElementWidth,
} from "@/registry/kit/lib/chart";
import { cn } from "@/registry/kit/lib/utils";

export interface AreaSeries {
  name: string;
  values: number[];
  /** Overrides the categorical slot. */
  color?: string;
}

export interface ChartAreaProps {
  /** X-axis labels, one per value. */
  labels: string[];
  series: AreaSeries[];
  /** Accessible name for the chart. */
  label: string;
  height?: number;
  formatValue?: (value: number) => string;
  className?: string;
}

const margin = { top: 12, right: 12, bottom: 28, left: 44 };

/**
 * Smooth area chart with a crosshair tooltip. One series uses the theme accent;
 * several take the categorical slots in order and get a legend. Arrow keys
 * move the crosshair when the chart has focus.
 */
export function ChartArea({
  labels,
  series,
  label,
  height = 240,
  formatValue = (v) => v.toLocaleString("en-US"),
  className,
}: ChartAreaProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const width = useElementWidth(rootRef);
  const shown = useInViewOnce(rootRef);
  const [active, setActive] = useState<number | null>(null);
  const baseId = useId();

  const colors = series.map((s, i) => s.color ?? (series.length === 1 ? chartColors.accent : seriesColor(i)));
  const ticks = niceTicks(Math.max(...series.flatMap((s) => s.values), 0));
  const top = ticks[ticks.length - 1]!;
  const innerWidth = Math.max(width - margin.left - margin.right, 10);
  const x = scaleLinear([0, Math.max(labels.length - 1, 1)], [margin.left, margin.left + innerWidth]);
  const y = scaleLinear([0, top], [height - margin.bottom, margin.top]);
  const baseline = height - margin.bottom;
  // Thin x labels so they never collide (~64px each).
  const labelEvery = Math.max(1, Math.ceil(labels.length / Math.max(Math.floor(innerWidth / 64), 1)));

  function indexAt(clientX: number) {
    const rect = rootRef.current?.getBoundingClientRect();
    if (!rect) return null;
    const ratio = (clientX - rect.left - margin.left) / innerWidth;
    return Math.min(labels.length - 1, Math.max(0, Math.round(ratio * (labels.length - 1))));
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const step = event.key === "ArrowRight" ? 1 : -1;
    setActive((i) => Math.min(labels.length - 1, Math.max(0, (i ?? (step > 0 ? -1 : labels.length)) + step)));
  }

  const tooltipLeft = active === null ? 0 : x(active);
  const flip = tooltipLeft > width * 0.6;

  return (
    <div className={cn("grid gap-4", className)}>
      {series.length > 1 && (
        <ul className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted">
          {series.map((s, i) => (
            <li key={s.name} className="flex items-center gap-2">
              <span aria-hidden className="h-0.5 w-3 rounded-full" style={{ backgroundColor: colors[i] }} />
              {s.name}
            </li>
          ))}
        </ul>
      )}

      <div
        ref={rootRef}
        role="img"
        aria-label={label}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onBlur={() => setActive(null)}
        onPointerMove={(e: PointerEvent<HTMLDivElement>) => setActive(indexAt(e.clientX))}
        onPointerLeave={() => setActive(null)}
        className="relative touch-pan-y rounded-field outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
        style={{ height }}
      >
        <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden className="overflow-visible">
          <defs>
            {series.map((s, i) => (
              <linearGradient key={s.name} id={`${baseId}-${i}`} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor={colors[i]} stopOpacity={series.length === 1 ? 0.24 : 0.14} />
                <stop offset="1" stopColor={colors[i]} stopOpacity="0" />
              </linearGradient>
            ))}
          </defs>

          {ticks.map((t) => (
            <g key={t}>
              <line x1={margin.left} x2={width - margin.right} y1={y(t)} y2={y(t)} stroke={chartColors.grid} />
              <text x={margin.left - 10} y={y(t)} dy="0.32em" textAnchor="end" fontSize="11" fill={chartColors.axis}>
                {formatCompact(t)}
              </text>
            </g>
          ))}

          {labels.map((l, i) =>
            i % labelEvery === 0 ? (
              <text key={l + i} x={x(i)} y={height - 8} textAnchor="middle" fontSize="11" fill={chartColors.axis}>
                {l}
              </text>
            ) : null,
          )}

          {series.map((s, i) => {
            const points = s.values.map((v, j) => [x(j), y(v)] as [number, number]);
            return (
              <g key={s.name}>
                <path
                  d={areaPath(points, baseline)}
                  fill={`url(#${baseId}-${i})`}
                  className={cn("transition-opacity delay-500 duration-700 ease-theme", shown ? "opacity-100" : "opacity-0")}
                />
                <path
                  d={linePath(points)}
                  fill="none"
                  stroke={colors[i]}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  pathLength={1}
                  strokeDasharray="1"
                  className="transition-[stroke-dashoffset] duration-[1400ms] ease-theme"
                  style={{ strokeDashoffset: shown ? 0 : 1, transitionDelay: `${i * 120}ms` }}
                />
              </g>
            );
          })}

          {active !== null && (
            <g>
              <line x1={x(active)} x2={x(active)} y1={margin.top} y2={baseline} stroke="var(--color-line-strong)" />
              {series.map((s, i) => (
                <circle
                  key={s.name}
                  cx={x(active)}
                  cy={y(s.values[active] ?? 0)}
                  r="4.5"
                  fill={colors[i]}
                  stroke={chartColors.surface}
                  strokeWidth="2"
                />
              ))}
            </g>
          )}
        </svg>

        {active !== null && (
          <div
            aria-hidden
            className="surface-raised pointer-events-none absolute top-1 z-10 min-w-32 rounded-field px-3.5 py-2.5 text-xs"
            style={{ left: tooltipLeft, transform: `translateX(${flip ? "calc(-100% - 12px)" : "12px"})` }}
          >
            <div className="mb-1.5 text-muted">{labels[active]}</div>
            {series.map((s, i) => (
              <div key={s.name} className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-2 text-fg/80">
                  <span className="size-2 rounded-full" style={{ backgroundColor: colors[i] }} />
                  {s.name}
                </span>
                <span className="font-medium text-fg tabular-nums">{formatValue(s.values[active] ?? 0)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="sr-only">
        <table>
        <caption>{label}</caption>
        <thead>
          <tr>
            <th scope="col">Label</th>
            {series.map((s) => (
              <th key={s.name} scope="col">
                {s.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {labels.map((l, i) => (
            <tr key={l + i}>
              <th scope="row">{l}</th>
              {series.map((s) => (
                <td key={s.name}>{formatValue(s.values[i] ?? 0)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}
