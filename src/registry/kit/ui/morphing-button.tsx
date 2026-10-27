import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/registry/kit/lib/utils";
import { buttonVariants } from "@/registry/kit/ui/button";

export interface MorphState {
  label: React.ReactNode;
  icon?: React.ReactNode;
}

export interface MorphingButtonProps<T extends string> extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  /** Key of the state to show. */
  state: T;
  /** Every state the button can be in. The button is sized to the widest. */
  states: Record<T, MorphState>;
  variant?: "surface" | "solid";
  size?: "sm" | "md" | "lg";
}

/**
 * A button whose label morphs between states (copy → copied,
 * send → sending → sent). All labels share one grid cell, so the width
 * never jumps; the outgoing label blurs away as the next one settles in.
 */
export function MorphingButton<T extends string>({
  state,
  states,
  variant = "surface",
  size = "md",
  className,
  type = "button",
  ...props
}: MorphingButtonProps<T>) {
  return (
    <button type={type} className={cn(buttonVariants({ variant, size }), className)} {...props}>
      <span className="grid" aria-live="polite">
        {(Object.entries(states) as [T, MorphState][]).map(([key, s]) => {
          const active = key === state;
          return (
            <span
              key={key}
              aria-hidden={!active}
              data-active={active}
              className={cn(
                "col-start-1 row-start-1 flex items-center justify-center gap-2",
                "transition-[opacity,scale,filter] duration-300 ease-theme",
                "data-[active=false]:scale-90 data-[active=false]:opacity-0 data-[active=false]:blur-[3px]",
              )}
            >
              {s.icon && (
                <span aria-hidden className="grid size-4 place-items-center [&>svg]:size-full">
                  {s.icon}
                </span>
              )}
              {s.label}
            </span>
          );
        })}
      </span>
    </button>
  );
}
