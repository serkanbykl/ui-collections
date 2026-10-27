"use client";

import { differenceInCalendarDays, format, isSameDay, subDays } from "date-fns";
import { Popover } from "radix-ui";
import { useState } from "react";
import { DayPicker, type ChevronProps, type DateRange } from "react-day-picker";

import { cn } from "@/registry/kit/lib/utils";
import { Button } from "@/registry/kit/ui/button";

export type { DateRange };

export interface DateRangePreset {
  label: string;
  /** Length of the range in days, ending on `today`. */
  days: number;
}

export const defaultRangePresets: DateRangePreset[] = [
  { label: "Last 7 days", days: 7 },
  { label: "Last 30 days", days: 30 },
  { label: "Last 90 days", days: 90 },
  { label: "Last 12 months", days: 365 },
];

export interface DateRangePickerProps {
  value: DateRange | undefined;
  onValueChange: (value: DateRange) => void;
  /**
   * Anchor for presets and the latest selectable day. Passed in rather than
   * read from the clock so server and client render the same label.
   */
  today: Date;
  /** Earliest selectable day. */
  minDate?: Date;
  presets?: DateRangePreset[];
  placeholder?: string;
  className?: string;
}

const surface = cn(
  "surface-raised z-50 flex max-h-(--radix-popover-content-available-height) flex-col overflow-hidden rounded-card text-fg outline-none",
  "origin-(--radix-popover-content-transform-origin) transition-[opacity,scale] duration-200 ease-theme",
  "starting:scale-[0.97] starting:opacity-0 data-[state=closed]:animate-pop-out",
);

const presetRange = (preset: DateRangePreset, today: Date): DateRange => ({ from: subDays(today, preset.days - 1), to: today });

const sameRange = (a: DateRange | undefined, b: DateRange) =>
  !!a?.from && !!a.to && !!b.from && !!b.to && isSameDay(a.from, b.from) && isSameDay(a.to, b.to);

function Chevron({ orientation, className }: ChevronProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={cn("size-4", className)} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={orientation === "left" ? "m15 6-6 6 6 6" : orientation === "right" ? "m9 6 6 6-6 6" : "m6 9 6 6 6-6"} />
    </svg>
  );
}

// react-day-picker ships no styles we rely on; every part is styled here.
const calendarClasses = {
  root: "relative",
  months: "relative flex flex-col gap-6 sm:flex-row",
  month: "space-y-3",
  month_caption: "flex h-9 items-center justify-center",
  caption_label: "text-sm font-medium",
  nav: "absolute inset-x-0 top-0 z-10 flex h-9 items-center justify-between",
  button_previous:
    "grid size-9 cursor-pointer place-items-center rounded-full text-muted outline-none transition-colors hover:bg-fg/10 hover:text-fg focus-visible:outline-2 focus-visible:outline-accent disabled:pointer-events-none disabled:opacity-30",
  button_next:
    "grid size-9 cursor-pointer place-items-center rounded-full text-muted outline-none transition-colors hover:bg-fg/10 hover:text-fg focus-visible:outline-2 focus-visible:outline-accent disabled:pointer-events-none disabled:opacity-30",
  month_grid: "border-collapse",
  weekdays: "",
  weekday: "size-9 text-[11px] font-normal text-muted uppercase",
  week: "",
  day: "relative size-9 p-0 text-center text-sm",
  day_button:
    "relative z-10 size-9 cursor-pointer rounded-full text-fg/85 outline-none transition-colors duration-200 hover:bg-fg/10 focus-visible:outline-2 focus-visible:outline-accent",
  selected: "[&>button]:bg-accent [&>button]:font-medium [&>button]:text-accent-fg [&>button]:hover:bg-accent",
  range_start: "rounded-l-full bg-accent/15",
  range_end: "rounded-r-full bg-accent/15",
  range_middle: "bg-accent/15 [&>button]:bg-transparent! [&>button]:font-normal! [&>button]:text-fg! [&>button]:hover:bg-fg/10!",
  today: "[&>button]:ring-1 [&>button]:ring-accent/60",
  outside: "opacity-35",
  disabled: "opacity-30 [&>button]:cursor-not-allowed [&>button]:hover:bg-transparent",
  hidden: "invisible",
};

/** Range picker with quick presets and a two-month calendar. Changes apply on confirm. */
export function DateRangePicker({
  value,
  onValueChange,
  today,
  minDate,
  presets = defaultRangePresets,
  placeholder = "Pick a date range",
  className,
}: DateRangePickerProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<DateRange | undefined>(value);
  const activePreset = presets.find((p) => sameRange(value, presetRange(p, today)));
  const label = activePreset
    ? activePreset.label
    : value?.from && value.to
      ? `${format(value.from, "MMM d, yyyy")} – ${format(value.to, "MMM d, yyyy")}`
      : placeholder;

  function onOpenChange(next: boolean) {
    setOpen(next);
    if (next) setDraft(value);
  }

  function apply(range: DateRange) {
    onValueChange(range);
    setOpen(false);
  }

  return (
    <Popover.Root open={open} onOpenChange={onOpenChange}>
      <Popover.Trigger
        aria-label={`Date range: ${label}`}
        className={cn(
          "surface-field inline-flex h-11 cursor-pointer items-center gap-2 rounded-control px-4 text-sm whitespace-nowrap text-fg/90 outline-none",
          "transition-[border-color,background-color] duration-300 ease-theme hover:border-fg/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
          "data-[state=open]:border-accent/50",
          className,
        )}
      >
        <svg viewBox="0 0 24 24" aria-hidden className="size-4 text-muted" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
          <rect x="3.5" y="5" width="17" height="15" rx="3" />
          <path d="M3.5 10h17M8 3v4M16 3v4" />
        </svg>
        <span className="truncate">{label}</span>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content align="start" sideOffset={8} collisionPadding={12} className={surface}>
          <div className="flex min-h-0 flex-col overflow-y-auto overscroll-contain [scrollbar-width:thin] sm:flex-row">
            <ul aria-label="Presets" className="flex shrink-0 gap-1 overflow-x-auto border-b border-fg/10 p-2 sm:w-40 sm:flex-col sm:border-r sm:border-b-0">
              {presets.map((preset) => {
                const active = activePreset?.label === preset.label;
                return (
                  <li key={preset.label} className="shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => apply(presetRange(preset, today))}
                      aria-pressed={active}
                      className={cn(
                        "h-auto w-full justify-start rounded-[max(0.25rem,calc(var(--r-field)-0.375rem))] px-3 py-2 text-left text-sm font-normal hover:scale-100",
                        active ? "bg-accent/15 text-fg hover:bg-accent/15" : "text-muted",
                      )}
                    >
                      {preset.label}
                    </Button>
                  </li>
                );
              })}
            </ul>
            <div className="flex flex-col">
              <div className="p-4">
                <DayPicker
                  mode="range"
                  numberOfMonths={2}
                  defaultMonth={draft?.from ?? subDays(today, 31)}
                  selected={draft}
                  onSelect={setDraft}
                  disabled={[{ after: today }, ...(minDate ? [{ before: minDate }] : [])]}
                  classNames={calendarClasses}
                  components={{ Chevron }}
                />
              </div>
              <div className="flex items-center justify-between gap-3 border-t border-fg/10 px-4 py-3">
                <p aria-live="polite" className="text-xs text-muted">
                  {draft?.from && draft.to
                    ? `${differenceInCalendarDays(draft.to, draft.from) + 1} days selected`
                    : "Pick a start and end day"}
                </p>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    variant="solid"
                    size="sm"
                    shine={false}
                    disabled={!draft?.from || !draft.to}
                    onClick={() => draft?.from && draft.to && apply(draft)}
                  >
                    Apply
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
