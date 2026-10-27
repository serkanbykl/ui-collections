"use client";

import { RadioGroup } from "radix-ui";

import { cn } from "@/registry/kit/lib/utils";

export interface ChoiceOption<T extends string> {
  value: T;
  label: string;
  description?: string;
  /** Visual shown above the label, e.g. a layout thumbnail. */
  preview?: React.ReactNode;
}

export interface ChoiceCardGroupProps<T extends string> {
  /** Accessible name for the group. */
  label: string;
  options: ReadonlyArray<ChoiceOption<T>>;
  value: T;
  onValueChange: (value: T) => void;
  className?: string;
}

/** A radio group drawn as surface cards with optional previews. Arrow keys move the choice. */
export function ChoiceCardGroup<T extends string>({ label, options, value, onValueChange, className }: ChoiceCardGroupProps<T>) {
  return (
    <RadioGroup.Root
      aria-label={label}
      value={value}
      onValueChange={(next) => onValueChange(next as T)}
      className={cn("grid gap-3", className)}
    >
      {options.map((option) => (
        <RadioGroup.Item
          key={option.value}
          value={option.value}
          className={cn(
            "group/choice surface flex cursor-pointer flex-col gap-3 rounded-card p-3 text-left outline-none",
            "transition-[background-color,outline-color,translate] duration-300 ease-theme hover:-translate-y-0.5",
            // Outline, not ring: ring would replace surface's box-shadow.
            "outline-1 -outline-offset-1 outline-transparent focus-visible:outline-2 focus-visible:outline-accent",
            "data-[state=checked]:bg-surface-selected data-[state=checked]:outline-accent/60",
          )}
        >
          {option.preview && <span className="block overflow-hidden rounded-[max(0.25rem,calc(var(--r-card)-0.75rem))]">{option.preview}</span>}
          <span className="flex items-start justify-between gap-3 px-1 pb-0.5">
            <span className="min-w-0">
              <span className="block text-sm font-medium text-fg">{option.label}</span>
              {option.description && <span className="mt-0.5 block text-xs leading-relaxed text-muted">{option.description}</span>}
            </span>
            <span
              aria-hidden
              className="grid size-5 shrink-0 place-items-center rounded-full border border-fg/25 text-accent-fg transition-colors duration-300 group-data-[state=checked]/choice:border-accent group-data-[state=checked]/choice:bg-accent"
            >
              <svg viewBox="0 0 24 24" className="size-3 scale-0 transition-transform duration-300 ease-theme group-data-[state=checked]/choice:scale-100" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12.5l4.5 4.5L19 7.5" />
              </svg>
            </span>
          </span>
        </RadioGroup.Item>
      ))}
    </RadioGroup.Root>
  );
}
