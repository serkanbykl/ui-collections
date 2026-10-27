"use client";

import { useId, useRef } from "react";

import { useInViewOnce } from "@/registry/kit/hooks/use-in-view-once";
import { chartColors, linePath, scaleLinear } from "@/registry/kit/lib/chart";
import { cn } from "@/registry/kit/lib/utils";

export interface ChartSparklineProps {
  data: number[];
  /** Accessible description, e.g. "Visitors over the last 12 weeks". */
  label: string;
  /** Any CSS colour. */
  color?: string;
  /** Soft wash under the line. */
  fill?: boolean;
  /**
   * Run to the card's left, right and bottom edges, cancelling its padding
   * (read from `--card-pad`, default 1.25rem). The card needs `overflow-hidden`
   * so its rounded corners clip the line. The end marker is dropped, as it
   * would sit on the edge.
   */
  bleed?: boolean;
  className?: string;
}

/**
 * Trend line for stat tiles. Stretches to its box; the stroke stays 2px at
 * any size and the end point is marked. Draws itself in when first seen.
 */
export function ChartSparkline({ data, label, color = chartColors.accent, fill = true, bleed = false, className }: ChartSparklineProps) {
  const ref = useRef<HTMLDivElement>(null);
  const shown = useInViewOnce(ref);
  const gradientId = useId();

  const min = Math.min(...data);
  const max = Math.max(...data);
  const x = scaleLinear([0, Math.max(data.length - 1, 1)], [0, 100]);
  // Keep headroom so the line never touches the edges. Bled to the card's
  // bottom edge, the lowest point sits higher so the wash shows under it.
  const y = scaleLinear([min, max === min ? min + 1 : max], bleed ? [74, 12] : [90, 10]);
  const points = data.map((v, i) => [x(i), y(v)] as [number, number]);
  const line = linePath(points);
  const last = points[points.length - 1];

  return (
    <div ref={ref} role="img" aria-label={`${label}. From ${data[0]} to ${data[data.length - 1]}.`} className={cn(
        "relative h-10 w-full",
        bleed && "-mx-(--card-pad,1.25rem) -mb-(--card-pad,1.25rem) h-12 w-[calc(100%+2*var(--card-pad,1.25rem))]!",
        className,
      )}
    >
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 size-full overflow-visible" aria-hidden>
        <defs>
          <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor={color} stopOpacity="0.22" />
            <stop offset="1" stopColor={color} stopOpacity="0" />
          </linearGradient>
          {/* Draw-in reveal. A dash-offset trick would break here: with a
              non-scaling stroke in a stretched viewBox, dashes are measured in
              screen pixels and the line stops part-way. */}
          <clipPath id={`${gradientId}-reveal`}>
            <rect
              x="-5"
              y="-10"
              width="110"
              height="120"
              className="origin-left transition-[scale] duration-1000 ease-theme [transform-box:fill-box]"
              style={{ scale: shown ? "1 1" : "0 1" }}
            />
          </clipPath>
        </defs>
        {fill && (
          <path
            d={`${line}L100,100L0,100Z`}
            fill={`url(#${gradientId})`}
            className={cn("transition-opacity delay-300 duration-700 ease-theme", shown ? "opacity-100" : "opacity-0")}
          />
        )}
        <path
          d={line}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          clipPath={`url(#${gradientId}-reveal)`}
        />
      </svg>
      {last && !bleed && (
        <span
          aria-hidden
          className={cn(
            "absolute size-2 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-card transition-opacity delay-700 duration-300",
            shown ? "opacity-100" : "opacity-0",
          )}
          style={{ left: `${last[0]}%`, top: `${last[1]}%`, backgroundColor: color }}
        />
      )}
    </div>
  );
}
