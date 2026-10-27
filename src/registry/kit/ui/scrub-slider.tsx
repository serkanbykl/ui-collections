"use client";

import { useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from "react";

import { cn } from "@/registry/kit/lib/utils";

export interface ScrubSliderProps {
  label: string;
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  /** Appended to the displayed value, e.g. "%" or " ms". */
  unit?: string;
  className?: string;
}

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

/**
 * A surface pill you drag sideways to scrub a value, like the dials in a
 * photo editor. Dragging is relative, so a grab anywhere never jumps the
 * value. Ticks and fill are CSS; keyboard works as a standard slider.
 */
export function ScrubSlider({
  label,
  value,
  defaultValue = 50,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  unit = "",
  className,
}: ScrubSliderProps) {
  const [internal, setInternal] = useState(defaultValue);
  const current = value ?? internal;
  const drag = useRef<{ x: number; start: number } | null>(null);
  const decimals = (String(step).split(".")[1] ?? "").length;

  function set(next: number) {
    const snapped = clamp(Math.round((next - min) / step) * step + min, min, max);
    const rounded = Number(snapped.toFixed(decimals));
    if (rounded === current) return;
    setInternal(rounded);
    onValueChange?.(rounded);
  }

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { x: event.clientX, start: current };
    event.currentTarget.setAttribute("data-dragging", "true");
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!drag.current) return;
    const width = event.currentTarget.getBoundingClientRect().width;
    set(drag.current.start + ((event.clientX - drag.current.x) / width) * (max - min));
  }

  function onPointerUp(event: PointerEvent<HTMLDivElement>) {
    drag.current = null;
    event.currentTarget.removeAttribute("data-dragging");
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const big = step * 10;
    const next = {
      ArrowRight: current + step,
      ArrowUp: current + step,
      ArrowLeft: current - step,
      ArrowDown: current - step,
      PageUp: current + big,
      PageDown: current - big,
      Home: min,
      End: max,
    }[event.key];
    if (next === undefined) return;
    event.preventDefault();
    set(next);
  }

  const fraction = (current - min) / (max - min);

  return (
    <div
      role="slider"
      tabIndex={0}
      aria-label={label}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={current}
      aria-valuetext={`${current}${unit}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onKeyDown={onKeyDown}
      style={{ "--fill": fraction } as CSSProperties}
      className={cn(
        "surface group/scrub relative flex h-14 w-full cursor-ew-resize touch-none items-center justify-between overflow-hidden rounded-field px-5 select-none",
        "transition-[scale] duration-300 ease-theme data-[dragging=true]:scale-[1.01]",
        "outline-none focus-visible:ring-2 focus-visible:ring-accent/60",
        className,
      )}
    >
      {/* Fill */}
      <span
        aria-hidden
        className="absolute inset-0 origin-left scale-x-(--fill) bg-fg/[0.07] transition-[scale] duration-150 ease-out"
      />
      {/* Ticks, brighter while dragging */}
      <span
        aria-hidden
        className="absolute inset-x-5 bottom-2 h-2 bg-[repeating-linear-gradient(90deg,color-mix(in_oklab,var(--color-fg)_30%,transparent)_0_1px,transparent_1px_10px)] opacity-50 transition-opacity duration-300 group-data-[dragging=true]/scrub:opacity-100"
      />
      <span className="relative text-sm text-muted">{label}</span>
      <span className="relative font-display text-2xl tracking-[-0.02em] tabular-nums">
        {current}
        <span className="font-sans text-sm text-muted">{unit}</span>
      </span>
    </div>
  );
}
