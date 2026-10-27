"use client";

import { useId, useState } from "react";

import { cn } from "@/registry/kit/lib/utils";

export interface AccordionItem {
  id: string;
  title: React.ReactNode;
  content: React.ReactNode;
  /** Small leading marker such as a step number. */
  marker?: React.ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
  /** `single` keeps at most one panel open. */
  type?: "single" | "multiple";
  defaultOpen?: string[];
  className?: string;
}

/**
 * Editorial accordion. Panels animate their height with a CSS grid-row
 * transition, so no measuring and no JS animation. Closed panels are `inert`.
 */
export function Accordion({ items, type = "single", defaultOpen = [], className }: AccordionProps) {
  const [open, setOpen] = useState(defaultOpen);
  const baseId = useId();

  function toggle(id: string) {
    setOpen((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : type === "single" ? [id] : [...prev, id],
    );
  }

  return (
    <div className={cn("border-y border-line", className)}>
      {items.map((item) => {
        const isOpen = open.includes(item.id);
        const triggerId = `${baseId}-${item.id}-trigger`;
        const panelId = `${baseId}-${item.id}-panel`;
        return (
          <div key={item.id} data-open={isOpen} className="group/item border-line not-first:border-t">
            <h3>
              <button
                id={triggerId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(item.id)}
                className="group/trigger flex w-full cursor-pointer items-baseline gap-5 py-6 text-left outline-none focus-visible:bg-fg/[0.03] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent md:gap-8"
              >
                {item.marker !== undefined && (
                  <span className="w-8 shrink-0 font-display text-xl text-fg/45 tabular-nums transition-colors duration-500 group-data-[open=true]/item:text-accent md:text-2xl">
                    {item.marker}
                  </span>
                )}
                <span className="flex-1 font-display text-2xl leading-tight tracking-[-0.02em] text-fg md:text-3xl">
                  {item.title}
                </span>
                <span aria-hidden className="relative size-4 shrink-0 self-center text-fg/70 transition-colors duration-300 group-hover/trigger:text-fg">
                  <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-current" />
                  <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 rotate-90 bg-current transition-transform duration-500 ease-theme group-data-[open=true]/item:rotate-0" />
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              inert={!isOpen}
              className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-theme group-data-[open=true]/item:grid-rows-[1fr]"
            >
              <div className="overflow-hidden">
                <div
                  className={cn(
                    "pb-7 text-[15px] leading-relaxed text-muted opacity-0 transition-opacity duration-500 group-data-[open=true]/item:opacity-100",
                    item.marker !== undefined && "md:pl-16 pl-13",
                  )}
                >
                  {item.content}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
