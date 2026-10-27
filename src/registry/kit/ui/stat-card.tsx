"use client";

import { useId } from "react";

import { cn } from "@/registry/kit/lib/utils";
import { Badge } from "@/registry/kit/ui/badge";
import { NumberTicker } from "@/registry/kit/ui/number-ticker";

export type StatTone = "accent" | "success" | "warning" | "info" | "danger";

const toneColor: Record<StatTone, string> = {
  accent: "var(--color-accent)",
  success: "var(--color-success)",
  warning: "var(--color-warning)",
  info: "var(--color-info)",
  danger: "var(--color-danger)",
};

export interface TrendChipProps {
  /** Relative change as a ratio: 0.12 is +12%. `null` shows a neutral dash. */
  change: number | null;
  /** Set false where a fall is good, e.g. error rate or churn. */
  positiveIsGood?: boolean;
  className?: string;
}

/** Up/down chip coloured by whether the change is good, not by its sign. */
export function TrendChip({ change, positiveIsGood = true, className }: TrendChipProps) {
  if (change === null || Math.abs(change) < 0.0005) {
    return (
      <Badge variant="outline" className={cn("border-transparent px-2 font-normal text-muted", className)}>
        — no change
      </Badge>
    );
  }
  const up = change > 0;
  const good = up === positiveIsGood;
  return (
    <Badge variant={good ? "success" : "danger"} className={cn("gap-0.5 px-2 tabular-nums", className)}>
      <svg viewBox="0 0 24 24" aria-hidden className={cn("size-3.5!", !up && "rotate-90")} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 17 17 7M9 7h8v8" />
      </svg>
      <span className="sr-only">{up ? "Up" : "Down"}</span>
      {Math.abs(change * 100).toFixed(Math.abs(change) < 0.1 ? 1 : 0)}%
    </Badge>
  );
}

/** Decorative trend line across the card (edge to edge with `bleed`). Wipes in from the left on mount. */
function Sparkline({ data, color, bleed }: { data: number[]; color: string; bleed: boolean }) {
  const id = useId();
  const w = 200;
  const h = 40;
  const min = Math.min(...data);
  const span = Math.max(...data) - min || 1;
  const points = data.map((v, i) => [(i / (data.length - 1)) * w, h - 3 - ((v - min) / span) * (h - 6)] as const);
  const line = points.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      aria-hidden
      className={cn("h-10 w-full overflow-visible transition-[clip-path] duration-1000 ease-theme [clip-path:inset(-4px)] starting:[clip-path:inset(-4px_100%_-4px_-4px)]", bleed && "-mx-5 w-[calc(100%+2.5rem)] max-w-none")}
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${line} L${w} ${h} L0 ${h} Z`} fill={`url(#${id})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export interface StatCardProps {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  /** Icon element shown in a tinted tile. */
  icon?: React.ReactNode;
  /** Colour of the icon tile and sparkline. Pick by meaning. */
  tone?: StatTone;
  change?: number | null;
  positiveIsGood?: boolean;
  /** e.g. "vs last 30 days" */
  comparison?: string;
  sparkline?: number[];
  /** The one metric that matters most: a solid accent gradient with light text and a soft ring. */
  highlight?: boolean;
  /** Same as `highlight`. */
  solid?: boolean;
  /** Run the sparkline to the card's left and right edges. */
  bleed?: boolean;
  className?: string;
}

/** KPI tile: label, counting value, trend chip and an optional sparkline (the trend then sits beside the value). */
export function StatCard({
  label,
  value,
  prefix,
  suffix,
  decimals,
  icon,
  tone = "accent",
  change,
  positiveIsGood,
  comparison,
  sparkline,
  highlight = false,
  solid = false,
  bleed = false,
  className,
}: StatCardProps) {
  const filled = solid || highlight;
  const color = filled ? "currentColor" : toneColor[tone];
  const hasLine = sparkline !== undefined && sparkline.length > 1;
  const trend = (change !== undefined || comparison) && (
    <div className="flex min-w-0 flex-wrap items-center gap-2">
      {change !== undefined && (
        <TrendChip change={change} positiveIsGood={positiveIsGood} className={filled ? "border-transparent bg-feature-fg/20 text-current" : undefined} />
      )}
      {comparison && <span className={cn("truncate text-xs", filled ? "opacity-80" : "text-muted")}>{comparison}</span>}
    </div>
  );
  return (
    <article
      className={cn(
        "surface relative isolate flex min-w-0 flex-col gap-4 overflow-hidden rounded-card p-5",
        filled &&
          "border-transparent bg-[linear-gradient(135deg,var(--color-feature),color-mix(in_oklab,var(--color-feature)_80%,white))] text-feature-fg [--glass-rim:0.6]",
        className,
      )}
    >
      {filled && (
        <span aria-hidden className="pointer-events-none absolute -top-14 -right-12 -z-10 size-44 rounded-full border-[28px] border-current opacity-[0.09]" />
      )}
      <div className="flex items-center gap-3">
        {icon && (
          <span
            aria-hidden
            className="grid size-9 shrink-0 place-items-center rounded-field [&>svg]:size-[18px]"
            style={{ color, backgroundColor: `color-mix(in oklab, ${color} ${filled ? 18 : 14}%, transparent)` }}
          >
            {icon}
          </span>
        )}
        <h3 className={cn("min-w-0 flex-1 truncate text-sm", filled ? "font-medium" : "text-fg/80")}>{label}</h3>
      </div>
      {/* With a sparkline, the trend sits beside the value, so the chart doesn't
          add a row and the card stays as tall as its neighbours. */}
      <div className={cn(hasLine && "flex flex-wrap items-center gap-x-3 gap-y-2")}>
        <p className="text-3xl leading-none font-semibold tracking-tight whitespace-nowrap">
          <NumberTicker value={value} decimals={decimals} prefix={prefix} suffix={suffix} />
        </p>
        {hasLine && trend}
      </div>
      {hasLine && <Sparkline data={sparkline} color={color} bleed={bleed} />}
      {!hasLine && trend}
    </article>
  );
}
