"use client";

import { useRef, useState, type CSSProperties } from "react";

import { useInViewOnce } from "@/registry/kit/hooks/use-in-view-once";
import { cn } from "@/registry/kit/lib/utils";

export interface ChartHeatmapProps {
  /** One value per day, oldest first. */
  values: number[];
  /** ISO date (YYYY-MM-DD) of the last value. */
  endDate: string;
  label: string;
  /** Unit for the readout, e.g. "deploys". */
  unit?: string;
  className?: string;
}

const day = 86_400_000;
// One hue, faint to bright: low values recede toward the surface.
const levels = [
  "color-mix(in oklab, var(--color-fg) 6%, transparent)",
  "color-mix(in oklab, var(--color-accent) 22%, transparent)",
  "color-mix(in oklab, var(--color-accent) 42%, transparent)",
  "color-mix(in oklab, var(--color-accent) 66%, transparent)",
  "color-mix(in oklab, var(--color-accent) 92%, transparent)",
];
const dateFormat = new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: "UTC" });
const monthFormat = new Intl.DateTimeFormat("en-US", { month: "short", timeZone: "UTC" });

/**
 * Contribution-style calendar: one cell per day, weeks as columns. Hover a
 * cell to read its date and value in the line below the grid.
 */
export function ChartHeatmap({ values, endDate, label, unit = "", className }: ChartHeatmapProps) {
  const ref = useRef<HTMLDivElement>(null);
  const shown = useInViewOnce(ref);
  const [active, setActive] = useState<number | null>(null);

  const end = Date.parse(`${endDate}T00:00:00Z`);
  const first = end - (values.length - 1) * day;
  // Monday-first rows; pad the first column so weekdays line up.
  const lead = (new Date(first).getUTCDay() + 6) % 7;
  const columns = Math.ceil((lead + values.length) / 7);
  const max = Math.max(...values, 1);
  const level = (v: number) => (v <= 0 ? 0 : Math.min(4, Math.ceil((v / max) * 4)));
  const dateOf = (i: number) => new Date(first + i * day);

  const months = Array.from({ length: columns }, (_, col) => {
    const i = Math.max(0, col * 7 - lead);
    const month = monthFormat.format(dateOf(i));
    const prev = col === 0 ? null : monthFormat.format(dateOf(Math.max(0, (col - 1) * 7 - lead)));
    return month !== prev ? month : "";
  });

  const total = values.reduce((a, b) => a + b, 0);
  const weeks = Array.from({ length: columns }, (_, col) => {
    const from = Math.max(0, col * 7 - lead);
    const to = Math.min(values.length, (col + 1) * 7 - lead);
    return { start: dateOf(from), sum: values.slice(from, to).reduce((a, b) => a + b, 0) };
  });

  return (
    <div className={cn("grid gap-3", className)}>
      <div ref={ref} role="img" aria-label={`${label}. ${total.toLocaleString("en-US")} ${unit} in total.`} onPointerLeave={() => setActive(null)}>
        <div className="mb-1.5 grid gap-[3px] text-[10px] text-muted" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }} aria-hidden>
          {months.map((m, i) => (
            <span key={i} className="overflow-visible whitespace-nowrap">
              {m}
            </span>
          ))}
        </div>
        <div
          aria-hidden
          className="grid grid-flow-col grid-rows-7 gap-[3px]"
          style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: lead }, (_, i) => (
            <span key={`pad-${i}`} />
          ))}
          {values.map((v, i) => (
            <span
              key={i}
              onPointerEnter={() => setActive(i)}
              className={cn(
                "aspect-square rounded-[calc(var(--r-field)*0.35)] transition-[opacity,scale] duration-500 ease-theme",
                shown ? "scale-100 opacity-100" : "scale-50 opacity-0",
                active === i && "ring-1 ring-fg",
              )}
              style={
                {
                  backgroundColor: levels[level(v)],
                  transitionDelay: shown ? `${Math.floor((i + lead) / 7) * 12}ms` : "0ms",
                } as CSSProperties
              }
            />
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted">
        <span className="min-h-4 tabular-nums">
          {active === null ? (
            `${total.toLocaleString("en-US")} ${unit} in ${values.length} days`
          ) : (
            <>
              <span className="text-fg">{dateFormat.format(dateOf(active))}</span> · {values[active]?.toLocaleString("en-US")} {unit}
            </>
          )}
        </span>
        <span className="flex items-center gap-1.5" aria-hidden>
          Less
          {levels.map((c) => (
            <span key={c} className="size-2.5 rounded-[calc(var(--r-field)*0.2)]" style={{ backgroundColor: c }} />
          ))}
          More
        </span>
      </div>

      <div className="sr-only">
        <table>
        <caption>{label}, weekly totals</caption>
        <tbody>
          {weeks.map((w) => (
            <tr key={w.start.toISOString()}>
              <th scope="row">Week of {dateFormat.format(w.start)}</th>
              <td>
                {w.sum} {unit}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}
