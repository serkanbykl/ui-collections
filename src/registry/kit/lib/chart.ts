"use client";

import { useEffect, useState, type RefObject } from "react";

/**
 * Colours and maths shared by the chart components.
 *
 * The categorical order is validated against every theme's card surface
 * (dark teal #06263a, cream #fdfcf8, olive-black #1d1f17): lightness band,
 * chroma floor, adjacent CVD and normal-vision separation and 3:1 contrast
 * all pass. Assign slots in order and never cycle: a fifth series folds into
 * "Other". Everything else reads the theme contract, so charts follow the
 * active theme and mode.
 */
export const chartColors = {
  series: ["#1b9a88", "#3987e5", "#d95926", "#9085e9"],
  other: "var(--color-subtle)",
  /** Single-series accent. */
  accent: "var(--color-accent)",
  /** Reserved for state; always paired with an icon and a label. */
  status: {
    good: "var(--color-success)",
    warning: "var(--color-warning)",
    serious: "#ec835a",
    critical: "var(--color-danger)",
  },
  grid: "var(--color-line)",
  axis: "var(--color-muted)",
  /** Surface used for the 2px gaps and rings between marks. */
  surface: "var(--color-card)",
} as const;

export function seriesColor(index: number) {
  return chartColors.series[index] ?? chartColors.other;
}

const compactFormat = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 });
export const formatCompact = (value: number) => compactFormat.format(value);

/** A round upper bound and evenly spaced ticks from zero. */
export function niceTicks(max: number, count = 4) {
  if (max <= 0) return [0, 1];
  const raw = max / count;
  const magnitude = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * magnitude).find((s) => s >= raw) ?? raw;
  const ticks: number[] = [];
  for (let t = 0; t <= max + step * 0.0001; t += step) ticks.push(Number(t.toFixed(10)));
  if (ticks[ticks.length - 1]! < max) ticks.push(ticks[ticks.length - 1]! + step);
  return ticks;
}

export function scaleLinear([d0, d1]: [number, number], [r0, r1]: [number, number]) {
  const span = d1 - d0 || 1;
  return (value: number) => r0 + ((value - d0) / span) * (r1 - r0);
}

type Point = [number, number];

/** Monotone cubic path (Fritsch–Carlson): smooth, never overshoots the data. */
export function linePath(points: Point[]) {
  const n = points.length;
  if (n === 0) return "";
  if (n === 1) return `M${points[0]![0]},${points[0]![1]}`;

  const dx: number[] = [];
  const slope: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    dx[i] = points[i + 1]![0] - points[i]![0];
    slope[i] = (points[i + 1]![1] - points[i]![1]) / (dx[i] || 1);
  }
  const tangent: number[] = [slope[0]!];
  for (let i = 1; i < n - 1; i++) {
    const a = slope[i - 1]!;
    const b = slope[i]!;
    tangent[i] = a * b <= 0 ? 0 : (3 * (dx[i - 1]! + dx[i]!)) / ((2 * dx[i]! + dx[i - 1]!) / a + (dx[i]! + 2 * dx[i - 1]!) / b);
  }
  tangent[n - 1] = slope[n - 2]!;

  let d = `M${points[0]![0]},${points[0]![1]}`;
  for (let i = 0; i < n - 1; i++) {
    const [x0, y0] = points[i]!;
    const [x1, y1] = points[i + 1]!;
    const h = dx[i]! / 3;
    d += `C${x0 + h},${y0 + h * tangent[i]!} ${x1 - h},${y1 - h * tangent[i + 1]!} ${x1},${y1}`;
  }
  return d;
}

/** Closes a line path down to `baseline` for an area fill. */
export function areaPath(points: Point[], baseline: number) {
  if (points.length === 0) return "";
  const first = points[0]!;
  const last = points[points.length - 1]!;
  return `${linePath(points)}L${last[0]},${baseline}L${first[0]},${baseline}Z`;
}

/** SVG arc from angle a0 to a1 (radians, 0 = 12 o'clock, clockwise). */
export function arcPath(cx: number, cy: number, r: number, a0: number, a1: number) {
  const point = (a: number) => [cx + r * Math.sin(a), cy - r * Math.cos(a)] as const;
  const [x0, y0] = point(a0);
  const [x1, y1] = point(a1);
  const large = a1 - a0 > Math.PI ? 1 : 0;
  return `M${x0},${y0}A${r},${r} 0 ${large} 1 ${x1},${y1}`;
}

/**
 * A ring slice from angle a0 to a1 (radians, 0 at 12 o'clock, clockwise)
 * with every corner rounded by `c` px. The shape is drawn inset by `c` and
 * outlined with a round-joined stroke of width 2c, which grows it back to
 * full size with true rounded corners. c = half the ring width gives fully
 * round ends; c = 0 gives square ones.
 */
export function ringSlicePath(cx: number, cy: number, rIn: number, rOut: number, a0: number, a1: number, c: number) {
  const mid = (rIn + rOut) / 2;
  const radius = Math.max(0, Math.min(c, (rOut - rIn) / 2, ((a1 - a0) * mid) / 2));
  const ri = rIn + radius;
  const ro = rOut - radius;
  const pinch = (r: number) => (r > 0 ? Math.asin(Math.min(1, radius / r)) : 0);
  const clamp = (lo: number, hi: number): [number, number] => (hi > lo ? [lo, hi] : [(a0 + a1) / 2, (a0 + a1) / 2]);
  const [o0, o1] = clamp(a0 + pinch(ro), a1 - pinch(ro));
  const [i0, i1] = clamp(a0 + pinch(ri), a1 - pinch(ri));
  const p = (r: number, a: number) => `${(cx + r * Math.sin(a)).toFixed(2)},${(cy - r * Math.cos(a)).toFixed(2)}`;
  const large = (from: number, to: number) => (to - from > Math.PI ? 1 : 0);
  return {
    d: `M${p(ro, o0)}A${ro},${ro} 0 ${large(o0, o1)} 1 ${p(ro, o1)}L${p(ri, i1)}A${ri},${ri} 0 ${large(i0, i1)} 0 ${p(ri, i0)}Z`,
    stroke: radius * 2,
  };
}

/** Rendered width of an element, tracked with ResizeObserver. */
export function useElementWidth(ref: RefObject<HTMLElement | null>, fallback = 600) {
  const [width, setWidth] = useState(fallback);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      const next = Math.round(entry?.contentRect.width ?? 0);
      if (next > 0) setWidth(next);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);
  return width;
}

export interface ChartShape {
  /** Line ends on rings and gauges. */
  cap: "round" | "butt";
  /** Corner rounding of ring slices, 0 (square) to 1 (fully round ends). */
  corner: number;
  /** Corner radius at a column's data end, in px. */
  barRadius: number;
}

const readShape = (el: Element): ChartShape => {
  const style = getComputedStyle(el);
  const cap = style.getPropertyValue("--chart-cap").trim();
  const radius = parseFloat(style.getPropertyValue("--chart-bar-radius"));
  const corner = parseFloat(style.getPropertyValue("--chart-corner"));
  return {
    cap: cap === "butt" ? "butt" : "round",
    barRadius: Number.isFinite(radius) ? radius : 4,
    corner: Number.isFinite(corner) ? corner : cap === "butt" ? 0 : 1,
  };
};

/**
 * Chart shapes follow the theme's corner setting (`--chart-cap`,
 * `--chart-bar-radius`), re-read whenever a theme attribute changes so the
 * tuner updates charts live.
 */
export function useChartShape(ref: RefObject<Element | null>): ChartShape {
  const [shape, setShape] = useState<ChartShape>({ cap: "round", barRadius: 4, corner: 1 });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () =>
      setShape((prev) => {
        const next = readShape(el);
        return next.cap === prev.cap && next.barRadius === prev.barRadius && next.corner === prev.corner ? prev : next;
      });
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, { attributes: true, subtree: true, attributeFilter: ["data-radius", "data-theme", "style"] });
    return () => observer.disconnect();
  }, [ref]);
  return shape;
}
