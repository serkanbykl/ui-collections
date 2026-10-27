import type { CSSProperties } from "react";

import { cn } from "@/registry/kit/lib/utils";

export interface Step {
  title: string;
  description?: string;
}

export interface StepperProps {
  steps: Step[];
  /** Zero-based index of the step in progress. `steps.length` marks all complete. */
  current: number;
  /** Makes completed steps buttons that go back to that step. */
  onStepSelect?: (index: number) => void;
  className?: string;
}

/**
 * Horizontal progress through a sequence. The connecting line fills with a
 * transform and finished steps turn to accent checkmarks; all CSS.
 */
export function Stepper({ steps, current, onStepSelect, className }: StepperProps) {
  const count = steps.length;
  const progress = count > 1 ? Math.min(Math.max(current, 0), count - 1) / (count - 1) : 0;
  const inset = `${50 / count}%`;

  return (
    <ol className={cn("relative flex w-full", className)}>
      {/* Track spans from the first circle's centre to the last one's. */}
      <span aria-hidden className="absolute top-[18px] h-px bg-fg/12" style={{ left: inset, right: inset }} />
      <span
        aria-hidden
        className="absolute top-[18px] h-px origin-left bg-accent shadow-[0_0_8px_var(--color-accent)] transition-transform duration-700 ease-theme"
        style={{ left: inset, right: inset, transform: `scaleX(${progress})` } as CSSProperties}
      />
      {steps.map((step, i) => {
        const state = i < current ? "complete" : i === current ? "current" : "upcoming";
        const selectable = !!onStepSelect && state === "complete" && current < count;
        const Inner = selectable ? "button" : "span";
        return (
          <li
            key={step.title}
            aria-current={state === "current" ? "step" : undefined}
            className="relative flex flex-1 flex-col items-center px-2 text-center"
          >
            <Inner
              {...(selectable ? { type: "button" as const, onClick: () => onStepSelect(i), "aria-label": `${step.title}, completed. Go back to this step` } : {})}
              className={cn(
                "flex flex-col items-center rounded-control",
                selectable && "group/step cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent",
              )}
            >
            <span
              data-state={state}
              className={cn(
                "grid size-9 place-items-center rounded-full text-sm tabular-nums transition-[background-color,color,box-shadow,scale] duration-500 ease-theme",
                selectable && "group-hover/step:scale-110 group-active/step:scale-95",
                "data-[state=complete]:bg-accent data-[state=complete]:text-accent-fg",
                // .surface-raised is a theme class, not a utility, so it can't take a variant.
                state === "current" && "surface-raised text-fg ring-1 ring-accent/60",
                "data-[state=upcoming]:bg-bg-deep data-[state=upcoming]:text-muted data-[state=upcoming]:ring-1 data-[state=upcoming]:ring-line-strong",
              )}
            >
              {state === "complete" ? (
                <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M5 12.5l4.5 4.5L19 7.5" />
                </svg>
              ) : (
                i + 1
              )}
            </span>
            <span className={cn("mt-3 text-sm transition-colors duration-500", state === "upcoming" ? "text-muted" : "text-fg", selectable && "group-hover/step:text-accent")}>
              {step.title}
              <span className="sr-only">{state === "complete" ? " (complete)" : state === "current" ? " (current)" : ""}</span>
            </span>
            {step.description && <span className="mt-1 hidden text-xs text-muted sm:block">{step.description}</span>}
            </Inner>
          </li>
        );
      })}
    </ol>
  );
}
