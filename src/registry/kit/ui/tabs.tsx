"use client";

import { Tabs as TabsPrimitive } from "radix-ui";
import { useLayoutEffect, useRef, type ComponentProps } from "react";

import { cn } from "@/registry/kit/lib/utils";

export const Tabs = TabsPrimitive.Root;

/**
 * Surface track with a thumb that glides under the active tab. The thumb is
 * positioned by writing styles directly whenever Radix flips a trigger's
 * data-state, so switching tabs never re-renders the list.
 */
export function TabsList({ className, children, ...props }: ComponentProps<typeof TabsPrimitive.List>) {
  const listRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const list = listRef.current;
    const thumb = thumbRef.current;
    if (!list || !thumb) return;

    const measure = () => {
      const active = list.querySelector<HTMLElement>('[role="tab"][data-state="active"]');
      if (!active) return thumb.style.setProperty("opacity", "0");
      thumb.style.setProperty("width", `${active.offsetWidth}px`);
      thumb.style.setProperty("transform", `translateX(${active.offsetLeft}px)`);
      thumb.style.setProperty("opacity", "1");
    };

    measure();
    const frame = requestAnimationFrame(() => thumb.setAttribute("data-ready", "true"));
    const resize = new ResizeObserver(measure);
    resize.observe(list);
    const mutations = new MutationObserver(measure);
    mutations.observe(list, { subtree: true, attributeFilter: ["data-state"] });
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      mutations.disconnect();
    };
  }, []);

  return (
    <TabsPrimitive.List
      ref={listRef}
      className={cn("surface relative inline-flex max-w-full items-center rounded-control p-1", className)}
      {...props}
    >
      <span
        ref={thumbRef}
        aria-hidden
        className="absolute inset-y-1 left-0 rounded-[max(0.125rem,calc(var(--r-control)-0.25rem))] bg-fg/14 opacity-0 shadow-[inset_0_1px_0_rgb(255_255_255/0.3)] data-[ready=true]:transition-[transform,width] data-[ready=true]:duration-500 data-[ready=true]:ease-theme"
      />
      {children}
    </TabsPrimitive.List>
  );
}

export function TabsTrigger({ className, ...props }: ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        "relative h-9 shrink-0 cursor-pointer rounded-[max(0.125rem,calc(var(--r-control)-0.25rem))] px-4 text-sm whitespace-nowrap text-muted transition-colors duration-300",
        "hover:text-fg data-[state=active]:text-fg focus-visible:outline-2 focus-visible:outline-accent",
        "disabled:pointer-events-none disabled:opacity-40",
        className,
      )}
      {...props}
    />
  );
}

export function TabsContent({ className, ...props }: ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      className={cn(
        "mt-5 rounded-field outline-none focus-visible:outline-2 focus-visible:outline-accent",
        "transition-[opacity,translate] duration-300 ease-theme starting:translate-y-1 starting:opacity-0",
        className,
      )}
      {...props}
    />
  );
}
