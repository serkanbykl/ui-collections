"use client";

import { useRef, useState } from "react";

import { useInViewOnce } from "@/registry/kit/hooks/use-in-view-once";
import { chartColors, formatCompact, niceTicks, scaleLinear, seriesColor, useElementWidth, useChartShape } from "@/registry/kit/lib/chart";
import { cn } from "@/registry/kit/lib/utils";

export interface BarSeries {
  name: string;
  values: number[];
  color?: string;
}

export interface ChartBarProps {
  /** One label per category along the x-axis. */
  labels: string[];
  /** One series draws single columns; several are grouped side by side. */
  series: BarSeries[];
  label: string;
  height?: number;
  formatValue?: (value: number) => string;
  className?: string;
}

const margin = { top: 20, right: 8, bottom: 28, left: 44 };
const maxBar = 24;
const gap = 2;
/** Column with a rounded data end and a square baseline. */
function columnPath(x: number, y: number, w: number, base: number, radius: number) {
  const r = Math.min(radius, w / 2, Math.max(base - y, 0));
  return `M${x},${base}V${y + r}Q${x},${y} ${x + r},${y}H${x + w - r}Q${x + w},${y} ${x + w},${y + r}V${base}Z`;
}

/**
 * Column chart, single or grouped. Columns grow from the baseline when first
 * seen; hovering one shows its value at the tip and dims the rest.
 */
export function ChartBar({
  labels,
  series,
  label,
  height = 240,
  formatValue = (v) => v.toLocaleString("en-US"),
  className,
}: ChartBarProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const { barRadius } = useChartShape(rootRef);
  const width = useElementWidth(rootRef);
  const shown = useInViewOnce(rootRef);
  const [active, setActive] = useState<{ cat: number; s: number } | null>(null);

  const colors = series.map((s, i) => s.color ?? (series.length === 1 ? chartColors.accent : seriesColor(i)));
  const ticks = niceTicks(Math.max(...series.flatMap((s) => s.values), 0));
  const y = scaleLinear([0, ticks[ticks.length - 1]!], [height - margin.bottom, margin.top]);
  const base = height - margin.bottom;
  const band = (width - margin.left - margin.right) / Math.max(labels.length, 1);
  const barWidth = Math.max(4, Math.min(maxBar, (band * 0.7 - gap * (series.length - 1)) / series.length));
  const groupWidth = barWidth * series.length + gap * (series.length - 1);

  return (
    <div className={cn("grid gap-4", className)}>
      {series.length > 1 && (
        <ul className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted">
          {series.map((s, i) => (
            <li key={s.name} className="flex items-center gap-2">
              <span aria-hidden className="size-2.5 rounded-[calc(var(--r-field)*0.2)]" style={{ backgroundColor: colors[i] }} />
              {s.name}
            </li>
          ))}
        </ul>
      )}

      <div ref={rootRef} role="img" aria-label={label} className="relative" style={{ height }} onPointerLeave={() => setActive(null)}>
        <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden>
          {ticks.map((t) => (
            <g key={t}>
              <line x1={margin.left} x2={width - margin.right} y1={y(t)} y2={y(t)} stroke={chartColors.grid} />
              <text x={margin.left - 10} y={y(t)} dy="0.32em" textAnchor="end" fontSize="11" fill={chartColors.axis}>
                {formatCompact(t)}
              </text>
            </g>
          ))}

          {labels.map((l, cat) => {
            const groupX = margin.left + band * cat + (band - groupWidth) / 2;
            return (
              <g key={l + cat}>
                {series.map((s, si) => {
                  const value = s.values[cat] ?? 0;
                  const bx = groupX + si * (barWidth + gap);
                  const isActive = active?.cat === cat && active.s === si;
                  const dimmed = active !== null && !isActive;
                  return (
                    <g key={s.name}>
                      <path
                        d={columnPath(bx, y(value), barWidth, base, barRadius)}
                        fill={colors[si]}
                        className={cn(
                          "origin-bottom transition-[scale,opacity] duration-700 ease-theme [transform-box:fill-box]",
                          shown ? "scale-y-100" : "scale-y-0",
                          dimmed && "opacity-40",
                        )}
                        style={{ transitionDelay: active === null ? `${cat * 40}ms` : "0ms" }}
                      />
                      {isActive && (
                        <text x={bx + barWidth / 2} y={y(value) - 6} textAnchor="middle" fontSize="11" fill="var(--color-fg)" fontWeight="500">
                          {formatValue(value)}
                        </text>
                      )}
                      {/* Hit target: the full column height, wider than the mark. */}
                      <rect
                        x={bx - gap / 2}
                        y={margin.top}
                        width={barWidth + gap}
                        height={base - margin.top}
                        fill="transparent"
                        onPointerEnter={() => setActive({ cat, s: si })}
                      />
                    </g>
                  );
                })}
                <text x={margin.left + band * cat + band / 2} y={height - 8} textAnchor="middle" fontSize="11" fill={chartColors.axis}>
                  {l}
                </text>
              </g>
            );
          })}
          <line x1={margin.left} x2={width - margin.right} y1={base} y2={base} stroke="var(--color-line-strong)" />
        </svg>
      </div>

      <div className="sr-only">
        <table>
        <caption>{label}</caption>
        <thead>
          <tr>
            <th scope="col">Category</th>
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
