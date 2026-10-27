"use client";

import { useRef, useState, type KeyboardEvent } from "react";

import { useSlidingIndicator } from "@/registry/kit/hooks/use-sliding-indicator";
import { cn } from "@/registry/kit/lib/utils";

export interface SegmentedOption<T extends string> {
  value: T;
  label: React.ReactNode;
}

export interface SegmentedControlProps<T extends string> {
  options: SegmentedOption<T>[];
  value?: T;
  defaultValue?: T;
  onValueChange?: (value: T) => void;
  "aria-label": string;
  className?: string;
}

/** A single-choice switch with a surface thumb that glides between options. Arrow keys move the selection. */
export function SegmentedControl<T extends string>({
  options,
  value,
  defaultValue,
  onValueChange,
  className,
  ...aria
}: SegmentedControlProps<T>) {
  const [internal, setInternal] = useState(defaultValue ?? options[0]?.value);
  const current = value ?? internal;
  const rootRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLSpanElement>(null);
  useSlidingIndicator(rootRef, thumbRef, current);

  function select(next: T) {
    setInternal(next);
    onValueChange?.(next);
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const index = options.findIndex((o) => o.value === current);
    const last = options.length - 1;
    const next = {
      ArrowRight: index === last ? 0 : index + 1,
      ArrowDown: index === last ? 0 : index + 1,
      ArrowLeft: index === 0 ? last : index - 1,
      ArrowUp: index === 0 ? last : index - 1,
      Home: 0,
      End: last,
    }[event.key];
    if (next === undefined) return;
    event.preventDefault();
    select(options[next]!.value);
    rootRef.current?.querySelectorAll<HTMLButtonElement>('[role="radio"]')[next]?.focus();
  }

  return (
    <div
      ref={rootRef}
      role="radiogroup"
      onKeyDown={onKeyDown}
      className={cn("surface relative inline-flex rounded-control p-1", className)}
      {...aria}
    >
      <span
        ref={thumbRef}
        aria-hidden
        className="absolute inset-y-1 left-0 rounded-[max(0.125rem,calc(var(--r-control)-0.25rem))] bg-fg/12 opacity-0 shadow-[inset_0_1px_0_rgb(255_255_255/0.25)] data-[ready=true]:transition-[transform,width] data-[ready=true]:duration-500 data-[ready=true]:ease-theme"
      />
      {options.map((option) => {
        const checked = option.value === current;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={checked}
            tabIndex={checked ? 0 : -1}
            data-indicator-target={checked}
            onClick={() => select(option.value)}
            className={cn(
              "relative h-9 cursor-pointer rounded-[max(0.125rem,calc(var(--r-control)-0.25rem))] px-4 text-sm transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-accent",
              checked ? "text-fg" : "text-muted hover:text-fg",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
