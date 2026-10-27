"use client";

import { useId, useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";

import { cn } from "@/registry/kit/lib/utils";

export interface FluidTab<T extends string> {
  value: T;
  label: React.ReactNode;
  /** Panel shown while this tab is selected. */
  content?: React.ReactNode;
}

export interface FluidTabsProps<T extends string> {
  items: FluidTab<T>[];
  value?: T;
  defaultValue?: T;
  onValueChange?: (value: T) => void;
  "aria-label": string;
  className?: string;
}

const glide = "420ms";
const lag = "110ms";

/**
 * Tabs whose surface pill stretches toward the next tab before its trailing
 * edge catches up, like a stretching droplet. Each edge is its own CSS
 * transition with a direction-dependent delay; nothing animates in JS.
 */
export function FluidTabs<T extends string>({
  items,
  value,
  defaultValue,
  onValueChange,
  className,
  ...aria
}: FluidTabsProps<T>) {
  const [internal, setInternal] = useState(defaultValue ?? items[0]?.value);
  const current = value ?? internal;
  const index = items.findIndex((i) => i.value === current);
  const baseId = useId();
  const listRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);
  const previous = useRef(index);

  useLayoutEffect(() => {
    const list = listRef.current;
    const pill = pillRef.current;
    if (!list || !pill) return;

    const place = (animate: boolean) => {
      const tab = list.querySelectorAll<HTMLElement>('[role="tab"]')[index];
      if (!tab) return;
      const movingRight = index > previous.current;
      // The leading edge sets off first; the trailing edge follows.
      const leftDelay = animate && movingRight ? lag : "0ms";
      const rightDelay = animate && !movingRight ? lag : "0ms";
      pill.style.setProperty(
        "transition",
        animate
          ? `left ${glide} var(--ease-theme) ${leftDelay}, right ${glide} var(--ease-theme) ${rightDelay}`
          : "none",
      );
      pill.style.setProperty("left", `${tab.offsetLeft}px`);
      pill.style.setProperty("right", `${list.clientWidth - tab.offsetLeft - tab.offsetWidth}px`);
      pill.style.setProperty("opacity", "1");
    };

    place(pill.dataset.placed === "true");
    pill.setAttribute("data-placed", "true");
    previous.current = index;

    const observer = new ResizeObserver(() => place(false));
    observer.observe(list);
    return () => observer.disconnect();
  }, [index]);

  function select(next: T) {
    setInternal(next);
    onValueChange?.(next);
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const last = items.length - 1;
    const next = {
      ArrowRight: index === last ? 0 : index + 1,
      ArrowLeft: index === 0 ? last : index - 1,
      Home: 0,
      End: last,
    }[event.key];
    if (next === undefined) return;
    event.preventDefault();
    select(items[next]!.value);
    listRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus();
  }

  const active = items[index];

  return (
    <div className={cn("grid min-w-0 gap-6", className)}>
      {/* Scrolls on narrow screens; the surface itself never scrolls (glass draws its rim with ::before). */}
      <div className="-my-1 max-w-full justify-self-start overflow-x-auto py-1 [scrollbar-width:none]">
      <div
        ref={listRef}
        role="tablist"
        onKeyDown={onKeyDown}
        className="surface relative inline-flex rounded-control p-1"
        {...aria}
      >
        <span
          ref={pillRef}
          aria-hidden
          className="absolute inset-y-1 rounded-control bg-fg/14 opacity-0 shadow-[inset_1px_1px_0_-0.5px_rgb(255_255_255/0.5),0_4px_12px_-4px_rgb(0_0_0/0.25)]"
        />
        {items.map((item, i) => {
          const selected = i === index;
          return (
            <button
              key={item.value}
              id={`${baseId}-tab-${i}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={item.content !== undefined ? `${baseId}-panel` : undefined}
              tabIndex={selected ? 0 : -1}
              onClick={() => select(item.value)}
              className={cn(
                "relative h-10 shrink-0 cursor-pointer rounded-control px-5 text-sm whitespace-nowrap transition-colors duration-300 outline-none focus-visible:ring-2 focus-visible:ring-accent/60",
                selected ? "text-fg" : "text-muted hover:text-fg",
              )}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      </div>
      {active?.content !== undefined && (
        <div
          key={active.value}
          id={`${baseId}-panel`}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-${index}`}
          tabIndex={0}
          className="animate-rise outline-none"
          style={{ "--rise-distance": "6px" } as CSSProperties}
        >
          {active.content}
        </div>
      )}
    </div>
  );
}
