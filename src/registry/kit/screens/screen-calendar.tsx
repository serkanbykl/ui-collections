"use client";

import { useMemo, useState, type FormEvent } from "react";

import { cn } from "@/registry/kit/lib/utils";
import { Button } from "@/registry/kit/ui/button";
import { ConfirmDialog } from "@/registry/kit/ui/confirm-dialog";
import { Input } from "@/registry/kit/ui/field";
import { SegmentedControl } from "@/registry/kit/ui/segmented-control";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/registry/kit/ui/select";
import { toast } from "@/registry/kit/ui/toast";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/registry/kit/ui/sheet";
import { PageHeader } from "@/registry/kit/ui/page-header";

export type CalendarTone = "accent" | "info" | "success" | "warning" | "danger";

export interface CalendarEvent {
  id: string;
  title: string;
  /** YYYY-MM-DD */
  date: string;
  /** HH:MM, 24-hour */
  start: string;
  end: string;
  calendar: string;
}

export interface CalendarSource {
  id: string;
  name: string;
  tone: CalendarTone;
}

export const defaultCalendars: CalendarSource[] = [
  { id: "product", name: "Product", tone: "accent" },
  { id: "customers", name: "Customer calls", tone: "info" },
  { id: "team", name: "Team", tone: "success" },
  { id: "releases", name: "Releases", tone: "warning" },
];

export const defaultEvents: CalendarEvent[] = [
  { id: "e1", title: "Funnel review", date: "2026-10-26", start: "09:30", end: "10:15", calendar: "product" },
  { id: "e2", title: "Kitebase onboarding call", date: "2026-10-26", start: "14:00", end: "14:45", calendar: "customers" },
  { id: "e3", title: "Design crit", date: "2026-10-27", start: "11:00", end: "12:00", calendar: "team" },
  { id: "e4", title: "Release 4.12", date: "2026-10-28", start: "16:00", end: "16:30", calendar: "releases" },
  { id: "e5", title: "Orbitly QBR", date: "2026-10-29", start: "14:30", end: "15:30", calendar: "customers" },
  { id: "e6", title: "Retention deep dive", date: "2026-10-29", start: "10:00", end: "11:30", calendar: "product" },
  { id: "e7", title: "Team lunch", date: "2026-10-30", start: "12:30", end: "13:30", calendar: "team" },
  { id: "e8", title: "Pricing page test ends", date: "2026-10-30", start: "17:00", end: "17:15", calendar: "product" },
  { id: "e9", title: "Polaris renewal", date: "2026-10-14", start: "15:00", end: "15:45", calendar: "customers" },
  { id: "e10", title: "Release 4.11", date: "2026-10-07", start: "16:00", end: "16:30", calendar: "releases" },
  { id: "e11", title: "Offsite planning", date: "2026-10-20", start: "10:00", end: "12:00", calendar: "team" },
  { id: "e12", title: "SDK changelog review", date: "2026-10-22", start: "13:00", end: "13:45", calendar: "product" },
  { id: "e13", title: "Northwind check-in", date: "2026-11-03", start: "09:00", end: "09:30", calendar: "customers" },
];

const toneChip: Record<CalendarTone, string> = {
  accent: "bg-accent/15 text-accent",
  info: "bg-info/15 text-info",
  success: "bg-success/15 text-success",
  warning: "bg-warning/15 text-warning",
  danger: "bg-danger/15 text-danger",
};
const toneDot: Record<CalendarTone, string> = {
  accent: "bg-accent",
  info: "bg-info",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
};

// Dates are plain YYYY-MM-DD strings handled in UTC, so server and client render the same grid.
const parse = (iso: string) => new Date(`${iso}T00:00:00Z`);
const iso = (d: Date) => d.toISOString().slice(0, 10);
const addDays = (value: string, n: number) => {
  const d = parse(value);
  d.setUTCDate(d.getUTCDate() + n);
  return iso(d);
};
const addMonths = (value: string, n: number) => {
  const d = parse(value);
  return iso(new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + n, 1)));
};
/** Monday-based weekday, 0–6. */
const weekday = (value: string) => (parse(value).getUTCDay() + 6) % 7;
const startOfWeek = (value: string) => addDays(value, -weekday(value));
const fmt = (value: string, options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("en-GB", { timeZone: "UTC", ...options }).format(parse(value));
const minutes = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const hours = Array.from({ length: 12 }, (_, i) => i + 8);
const HOUR = 52;

export interface CalendarScreenProps {
  events?: CalendarEvent[];
  calendars?: CalendarSource[];
  /** Today's date as YYYY-MM-DD. Passed in so the grid renders the same on server and client. */
  today?: string;
  defaultView?: "month" | "week";
}

type Draft = Omit<CalendarEvent, "id"> & { id?: string };

/** Month and week calendar with an event sheet for creating, editing and deleting events. */
export function CalendarScreen({
  events: initial = defaultEvents,
  calendars = defaultCalendars,
  today = "2026-10-26",
  defaultView = "month",
}: CalendarScreenProps) {
  const [events, setEvents] = useState(initial);
  const [view, setView] = useState<"month" | "week">(defaultView);
  const [cursor, setCursor] = useState(today);
  const [selected, setSelected] = useState(today);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [error, setError] = useState("");

  const tone = (id: string) => calendars.find((c) => c.id === id)?.tone ?? "accent";
  const byDate = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const e of [...events].sort((a, b) => a.start.localeCompare(b.start))) {
      map.set(e.date, [...(map.get(e.date) ?? []), e]);
    }
    return map;
  }, [events]);

  const monthStart = addMonths(cursor, 0);
  const gridStart = startOfWeek(monthStart);
  const monthDays = Array.from({ length: 42 }, (_, i) => addDays(gridStart, i));
  const weekStart = startOfWeek(cursor);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const title =
    view === "month"
      ? fmt(monthStart, { month: "long", year: "numeric" })
      : `${fmt(weekDays[0], { day: "numeric", month: "short" })} – ${fmt(weekDays[6], { day: "numeric", month: "short", year: "numeric" })}`;

  function step(n: number) {
    setCursor((c) => (view === "month" ? addMonths(c, n) : addDays(c, 7 * n)));
  }

  function create(date: string, start = "10:00") {
    const end = `${String(Math.min(Number(start.slice(0, 2)) + 1, 23)).padStart(2, "0")}:${start.slice(3)}`;
    setError("");
    setSelected(date);
    setDraft({ title: "", date, start, end, calendar: calendars[0]?.id ?? "" });
  }

  function edit(event: CalendarEvent) {
    setError("");
    setDraft({ ...event });
  }

  function save(e: FormEvent) {
    e.preventDefault();
    if (!draft) return;
    if (!draft.title.trim()) return setError("Give the event a title.");
    if (minutes(draft.end) <= minutes(draft.start)) return setError("End time must be after the start time.");
    const event = { ...draft, title: draft.title.trim(), id: draft.id ?? `e${events.length + 1}-${draft.date}` };
    setEvents((all) => (draft.id ? all.map((x) => (x.id === draft.id ? event : x)) : [...all, event]));
    toast.success(`${draft.id ? "Updated" : "Added"} “${event.title}” on ${fmt(event.date, { weekday: "long", day: "numeric", month: "long" })}.`);
    setDraft(null);
  }

  function remove() {
    if (!draft?.id) return;
    setEvents((all) => all.filter((x) => x.id !== draft.id));
    toast.success(`Deleted “${draft.title}”.`);
    setDraft(null);
  }

  const chip = (e: CalendarEvent, className?: string) => (
    <button
      key={e.id}
      type="button"
      onClick={(ev) => {
        ev.stopPropagation();
        edit(e);
      }}
      className={cn(
        "block w-full truncate rounded-[calc(var(--r-field)*0.6)] px-1.5 py-0.5 text-left text-xs font-medium transition-[filter] hover:brightness-110",
        "focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent",
        toneChip[tone(e.calendar)],
        className,
      )}
    >
      <span className="tabular-nums opacity-75">{e.start}</span> {e.title}
    </button>
  );

  const selectedEvents = byDate.get(selected) ?? [];

  return (
    <div className="grid min-w-0 grid-cols-1 gap-6">
      <PageHeader
        title="Calendar"
        description={`${events.filter((e) => e.date >= startOfWeek(today) && e.date <= addDays(startOfWeek(today), 6)).length} events this week · ${(byDate.get(today) ?? []).length} today · ${calendars.length} calendars`}
      />
      <div className="grid gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="mr-auto min-w-0 text-xl font-semibold tracking-tight" aria-live="polite">
            {title}
          </h3>
          <SegmentedControl
            aria-label="Calendar view"
            options={[
              { value: "month", label: "Month" },
              { value: "week", label: "Week" },
            ]}
            value={view}
            onValueChange={(v) => setView(v as "month" | "week")}
          />
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon-sm" aria-label={view === "month" ? "Previous month" : "Previous week"} onClick={() => step(-1)}>
              <svg viewBox="0 0 24 24" className="size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </Button>
            <Button size="sm" onClick={() => { setCursor(today); setSelected(today); }}>
              Today
            </Button>
            <Button variant="ghost" size="icon-sm" aria-label={view === "month" ? "Next month" : "Next week"} onClick={() => step(1)}>
              <svg viewBox="0 0 24 24" className="size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M9 18l6-6-6-6" />
              </svg>
            </Button>
          </div>
          <Button variant="accent" size="sm" onClick={() => create(selected)}>
            <svg viewBox="0 0 24 24" className="size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden>
              <path d="M12 5v14M5 12h14" />
            </svg>
            New event
          </Button>
        </div>


        {view === "month" ? (
          <div className="grid gap-4 lg:grid-cols-1">
            <div className="surface overflow-hidden rounded-card">
              <div className="grid grid-cols-7 border-b border-line text-center text-xs font-medium text-muted" aria-hidden>
                {weekdays.map((d) => (
                  <div key={d} className="py-2">
                    <span className="sm:hidden">{d[0]}</span>
                    <span className="hidden sm:inline">{d}</span>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7">
                {monthDays.map((day, i) => {
                  const list = byDate.get(day) ?? [];
                  const outside = day.slice(0, 7) !== monthStart.slice(0, 7);
                  const isToday = day === today;
                  const isSelected = day === selected;
                  return (
                    <div
                      key={day}
                      className={cn(
                        "group relative min-h-16 border-line p-1 sm:min-h-28 sm:p-1.5",
                        i % 7 !== 6 && "border-r",
                        i < 35 && "border-b",
                        outside && "bg-fg/[0.02]",
                        isSelected && "bg-surface-selected",
                      )}
                    >
                      <button
                        type="button"
                        onClick={() => setSelected(day)}
                        onDoubleClick={() => create(day)}
                        aria-pressed={isSelected}
                        aria-label={`${fmt(day, { weekday: "long", day: "numeric", month: "long" })}${list.length ? `, ${list.length} event${list.length > 1 ? "s" : ""}` : ""}`}
                        className={cn(
                          "absolute inset-0 rounded-none transition-colors hover:bg-surface-hover",
                          "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent",
                        )}
                      />
                      <span
                        className={cn(
                          "pointer-events-none relative grid size-6 place-items-center rounded-full text-xs tabular-nums",
                          outside ? "text-subtle" : "text-fg/85",
                          isToday && "bg-accent font-semibold text-accent-fg",
                        )}
                      >
                        {Number(day.slice(8))}
                      </span>
                      <div className="pointer-events-none relative mt-1 hidden gap-0.5 sm:grid [&>*]:pointer-events-auto">
                        {list.slice(0, 2).map((e) => chip(e))}
                        {list.length > 2 && (
                          <button
                            type="button"
                            onClick={() => setSelected(day)}
                            className="rounded px-1.5 text-left text-xs text-muted hover:text-fg focus-visible:outline-2 focus-visible:outline-accent"
                          >
                            {list.length - 2} more
                          </button>
                        )}
                      </div>
                      {list.length > 0 && (
                        <div className="pointer-events-none relative mt-1 flex gap-0.5 sm:hidden" aria-hidden>
                          {list.slice(0, 3).map((e) => (
                            <span key={e.id} className={cn("size-1.5 rounded-full", toneDot[tone(e.calendar)])} />
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <section aria-label="Selected day" className="surface rounded-card p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h3 className="font-medium">{fmt(selected, { weekday: "long", day: "numeric", month: "long" })}</h3>
                <Button size="sm" variant="ghost" onClick={() => create(selected)}>
                  Add event
                </Button>
              </div>
              {selectedEvents.length === 0 ? (
                <p className="text-sm text-muted">Nothing scheduled. Double-click a day or use Add event.</p>
              ) : (
                <ul className="grid gap-2">
                  {selectedEvents.map((e) => (
                    <li key={e.id}>
                      <button
                        type="button"
                        onClick={() => edit(e)}
                        className="flex w-full items-center gap-3 rounded-field p-2 text-left text-sm transition-colors hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-accent"
                      >
                        <span className={cn("h-8 w-1 rounded-full", toneDot[tone(e.calendar)])} aria-hidden />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-medium">{e.title}</span>
                          <span className="block text-xs text-muted tabular-nums">
                            {e.start}–{e.end} · {calendars.find((c) => c.id === e.calendar)?.name}
                          </span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        ) : (
          <div className="surface rounded-card">
            <div className="overflow-x-auto">
              <div className="min-w-[44rem]">
                <div className="grid grid-cols-[3.5rem_repeat(7,minmax(0,1fr))] border-b border-line">
                  <span aria-hidden />
                  {weekDays.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => create(d)}
                      aria-label={`Add event on ${fmt(d, { weekday: "long", day: "numeric", month: "long" })}`}
                      className="grid justify-items-center gap-0.5 py-2 text-xs text-muted transition-colors hover:bg-surface-hover focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent"
                    >
                      {fmt(d, { weekday: "short" })}
                      <span
                        className={cn(
                          "grid size-7 place-items-center rounded-full text-sm tabular-nums text-fg",
                          d === today && "bg-accent font-semibold text-accent-fg",
                        )}
                      >
                        {Number(d.slice(8))}
                      </span>
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-[3.5rem_repeat(7,minmax(0,1fr))]">
                  <div aria-hidden>
                    {hours.map((h) => (
                      <div key={h} style={{ height: HOUR }} className="pr-2 text-right text-[11px] text-subtle tabular-nums">
                        {String(h).padStart(2, "0")}:00
                      </div>
                    ))}
                  </div>
                  {weekDays.map((d) => (
                    <div key={d} className="relative border-l border-line" style={{ height: HOUR * hours.length }}>
                      {hours.map((h) => (
                        <button
                          key={h}
                          type="button"
                          aria-label={`Add event ${fmt(d, { weekday: "short", day: "numeric", month: "short" })} at ${String(h).padStart(2, "0")}:00`}
                          onClick={() => create(d, `${String(h).padStart(2, "0")}:00`)}
                          style={{ height: HOUR }}
                          className="block w-full border-b border-line/60 transition-colors hover:bg-surface-hover focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent"
                        />
                      ))}
                      {(byDate.get(d) ?? []).map((e) => {
                        const top = ((minutes(e.start) - hours[0] * 60) / 60) * HOUR;
                        const height = Math.max(((minutes(e.end) - minutes(e.start)) / 60) * HOUR - 2, 20);
                        if (top < 0 || top >= HOUR * hours.length) return null;
                        return (
                          <button
                            key={e.id}
                            type="button"
                            onClick={() => edit(e)}
                            style={{ top, height }}
                            className={cn(
                              "absolute inset-x-1 overflow-hidden rounded-[calc(var(--r-field)*0.6)] border-l-2 border-current px-1.5 py-1 text-left text-xs transition-[filter] hover:brightness-110",
                              "focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent",
                              toneChip[tone(e.calendar)],
                            )}
                          >
                            <span className="block truncate font-medium">{e.title}</span>
                            <span className="block tabular-nums opacity-75">
                              {e.start}–{e.end}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted" aria-label="Calendars">
          {calendars.map((c) => (
            <li key={c.id} className="flex items-center gap-1.5">
              <span className={cn("size-2 rounded-full", toneDot[c.tone])} aria-hidden />
              {c.name}
            </li>
          ))}
        </ul>

        <Sheet open={draft !== null} onOpenChange={(o) => !o && setDraft(null)}>
          <SheetContent>
            {draft && (
              <form onSubmit={save} noValidate className="grid gap-4">
                <SheetHeader>
                  <SheetTitle>{draft.id ? "Edit event" : "New event"}</SheetTitle>
                  <SheetDescription>{fmt(draft.date, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</SheetDescription>
                </SheetHeader>
                <Input
                  label="Title"
                  value={draft.title}
                  error={error && !draft.title.trim() ? error : undefined}
                  onChange={(e) => {
                    setError("");
                    setDraft({ ...draft, title: e.target.value });
                  }}
                />
                <Input label="Date" type="date" value={draft.date} onChange={(e) => e.target.value && setDraft({ ...draft, date: e.target.value })} />
                <div className="grid grid-cols-2 gap-3">
                  <Input label="Starts" type="time" value={draft.start} onChange={(e) => { setError(""); setDraft({ ...draft, start: e.target.value }); }} />
                  <Input
                    label="Ends"
                    type="time"
                    value={draft.end}
                    error={error && draft.title.trim() ? error : undefined}
                    onChange={(e) => {
                      setError("");
                      setDraft({ ...draft, end: e.target.value });
                    }}
                  />
                </div>
                <div className="grid gap-1.5">
                  <span className="text-sm font-medium" id="event-calendar-label">
                    Calendar
                  </span>
                  <Select value={draft.calendar} onValueChange={(v) => setDraft({ ...draft, calendar: v })}>
                    <SelectTrigger aria-labelledby="event-calendar-label">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {calendars.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <SheetFooter className="flex-row flex-nowrap items-center">
                  {draft.id && (
                    <ConfirmDialog
                      title={`Delete “${draft.title || "this event"}”?`}
                      description="It's removed from the calendar for everyone invited. This can't be undone."
                      confirmLabel="Delete event"
                      onConfirm={remove}
                      trigger={
                        <Button type="button" size="icon" variant="ghost" aria-label="Delete event" title="Delete event" className="size-9 shrink-0 text-danger hover:text-danger">
                          <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                            <path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3" />
                          </svg>
                        </Button>
                      }
                    />
                  )}
                  <Button type="button" size="sm" variant="ghost" className="flex-1" onClick={() => setDraft(null)}>
                    Cancel
                  </Button>
                  <Button type="submit" size="sm" variant="accent" className="flex-1">
                    {draft.id ? "Save changes" : "Add event"}
                  </Button>
                </SheetFooter>
              </form>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
