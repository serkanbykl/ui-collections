"use client";

import { useState } from "react";

import { cn } from "@/registry/kit/lib/utils";
import { Avatar } from "@/registry/kit/ui/avatar";
import { Button } from "@/registry/kit/ui/button";
import { FilterBar } from "@/registry/kit/ui/filter-bar";
import { MultiSelect } from "@/registry/kit/ui/multi-select";
import { SearchInput } from "@/registry/kit/ui/search-input";
import { EmptyState } from "@/registry/kit/ui/states";
import { PageHeader } from "@/registry/kit/ui/page-header";

export type TimelineKind = "comment" | "deploy" | "billing" | "member" | "task";

export interface TimelineEvent {
  id: string;
  kind: TimelineKind;
  actor: string;
  action: string;
  target?: string;
  /** Quoted text or detail under the line, e.g. a comment. */
  detail?: string;
  /** Day heading this event sits under, e.g. "Today". */
  day: string;
  time: string;
}

const kindMeta: Record<TimelineKind, { label: string; icon: string; tint: string }> = {
  comment: { label: "Comments", icon: "M4 5h16v11H8l-4 4V5Z", tint: "bg-info/15 text-info" },
  deploy: { label: "Deploys", icon: "M12 3v12m0-12 4 4m-4-4L8 7M5 21h14", tint: "bg-success/15 text-success" },
  billing: { label: "Billing", icon: "M3 7h18v10H3zM3 11h18", tint: "bg-warning/15 text-warning" },
  member: { label: "People", icon: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 21c1-4 4.2-6 8-6s7 2 8 6", tint: "bg-accent/15 text-accent" },
  task: { label: "Tasks", icon: "m5 12 4 4 10-10", tint: "bg-fg/10 text-fg/80" },
};

export const sampleTimeline: TimelineEvent[] = [
  { id: "e1", kind: "deploy", actor: "Lukas Brandt", action: "deployed", target: "api 2.41.0 to production", day: "Today", time: "14:08" },
  { id: "e2", kind: "comment", actor: "Priya Raman", action: "commented on", target: "Invoice PDF layout", detail: "Moved the tax breakdown under the total. It now fits on one page for up to 14 line items.", day: "Today", time: "13:52" },
  { id: "e3", kind: "task", actor: "Sofía Herrera", action: "completed", target: "Empty states for the files view", day: "Today", time: "11:30" },
  { id: "e4", kind: "member", actor: "Amara Okafor", action: "invited", target: "g.oneill@contractor.dev as a viewer", day: "Today", time: "10:17" },
  { id: "e5", kind: "billing", actor: "Northwind billing", action: "paid invoice", target: "NW-2026-0418 · $522.00", day: "Yesterday", time: "18:44" },
  { id: "e6", kind: "comment", actor: "Kwame Mensah", action: "replied in", target: "Dark mode tokens", detail: "The muted text fails contrast on the card surface. Bumping it from 55% to 62% fixes it.", day: "Yesterday", time: "16:21" },
  { id: "e7", kind: "deploy", actor: "Mateo Alvarez", action: "rolled back", target: "web 5.12.3 on staging", detail: "Checkout tests failed on Safari 18 after the font change.", day: "Yesterday", time: "15:03" },
  { id: "e8", kind: "task", actor: "Noah Lindqvist", action: "moved", target: "Usage-based pricing spike to In review", day: "Yesterday", time: "09:46" },
  { id: "e9", kind: "member", actor: "Leila Haddad", action: "changed the role of", target: "Tomasz Wiśniewski to editor", day: "Thursday, Oct 22", time: "17:12" },
  { id: "e10", kind: "comment", actor: "Elif Demir", action: "commented on", target: "Settings navigation", detail: "Can we keep the menu sticky on tablet too? It scrolls away on long pages.", day: "Thursday, Oct 22", time: "14:38" },
  { id: "e11", kind: "billing", actor: "Hana Sato", action: "added", target: "4 seats to the Growth plan", day: "Thursday, Oct 22", time: "10:05" },
];

export const olderTimeline: TimelineEvent[] = [
  { id: "e12", kind: "deploy", actor: "Lukas Brandt", action: "deployed", target: "api 2.40.2 to production", day: "Wednesday, Oct 21", time: "16:55" },
  { id: "e13", kind: "task", actor: "Priya Raman", action: "closed", target: "Onboarding checklist", day: "Wednesday, Oct 21", time: "12:20" },
  { id: "e14", kind: "member", actor: "Rohan Mehta", action: "joined the workspace", day: "Wednesday, Oct 21", time: "09:02" },
];

export interface TimelineScreenProps {
  events?: TimelineEvent[];
  /** Revealed by "Load older activity"; omit to hide the button. */
  older?: TimelineEvent[];
  className?: string;
}

/** Workspace activity grouped by day, with type and person filters, search and a button to load older days. */
export function TimelineScreen({ events = sampleTimeline, older = olderTimeline, className }: TimelineScreenProps) {
  const [showOlder, setShowOlder] = useState(false);
  const [query, setQuery] = useState("");
  const [kinds, setKinds] = useState<TimelineKind[]>([]);
  const [people, setPeople] = useState<string[]>([]);

  const all = showOlder ? [...events, ...older] : events;
  const q = query.trim().toLowerCase();
  const visible = all.filter(
    (e) =>
      (!kinds.length || kinds.includes(e.kind)) &&
      (!people.length || people.includes(e.actor)) &&
      (!q || `${e.actor} ${e.action} ${e.target ?? ""} ${e.detail ?? ""}`.toLowerCase().includes(q)),
  );
  const days = [...new Set(visible.map((e) => e.day))];
  const actors = [...new Set(all.map((e) => e.actor))].sort();

  function reset() {
    setQuery("");
    setKinds([]);
    setPeople([]);
  }

  return (
    <div className={cn("grid min-w-0 grid-cols-1 gap-6", className)}>
      <PageHeader
        title="Activity"
        description={`${all.length} changes over the last ${new Set(all.map((e) => e.day)).size} days, newest first`}
      />

      <FilterBar
        search={<SearchInput label="Search activity" value={query} onValueChange={setQuery} />}
        filters={
          <>
            <MultiSelect
              label="Type"
              value={kinds}
              onValueChange={setKinds}
              options={(Object.keys(kindMeta) as TimelineKind[]).map((k) => ({ value: k, label: kindMeta[k].label, count: all.filter((e) => e.kind === k).length }))}
            />
            <MultiSelect
              label="Person"
              value={people}
              onValueChange={setPeople}
              searchable
              options={actors.map((a) => ({ value: a, label: a, count: all.filter((e) => e.actor === a).length }))}
            />
          </>
        }
        activeCount={kinds.length + people.length + (q ? 1 : 0)}
        onReset={reset}
      />

      {days.length ? (
        <div className="grid gap-8">
          {days.map((day) => (
            <section key={day} aria-labelledby={`day-${day.replace(/\W+/g, "-")}`}>
              <h3 id={`day-${day.replace(/\W+/g, "-")}`} className="mb-4 text-sm font-medium text-muted">
                {day}
              </h3>
              <ol className="relative grid gap-5 before:absolute before:top-2 before:bottom-2 before:left-[1.1875rem] before:w-px before:bg-line">
                {visible
                  .filter((e) => e.day === day)
                  .map((e) => (
                    <li key={e.id} className="relative flex gap-4">
                      <span aria-hidden className={cn("relative z-10 grid size-10 shrink-0 place-items-center rounded-full ring-4 ring-bg", kindMeta[e.kind].tint)}>
                        <svg viewBox="0 0 24 24" className="size-[1.125rem]" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                          <path d={kindMeta[e.kind].icon} />
                        </svg>
                      </span>
                      <div className="min-w-0 flex-1 pt-2">
                        <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                          <p className="min-w-0 text-sm">
                            <span className="font-medium">{e.actor}</span> <span className="text-muted">{e.action}</span>
                            {e.target && <span className="font-medium"> {e.target}</span>}
                          </p>
                          <time className="shrink-0 text-xs text-subtle tabular-nums">{e.time}</time>
                        </div>
                        {e.detail && (
                          <div className="surface mt-2.5 flex items-center gap-3 rounded-card p-3.5 text-sm">
                            <Avatar size="sm" alt={e.actor} className="hidden shrink-0 sm:flex" />
                            <p className="min-w-0 text-fg/85">{e.detail}</p>
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
              </ol>
            </section>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No activity matches"
          description="Nothing in this period fits these filters."
          action={
            <Button size="sm" onClick={reset}>
              Clear filters
            </Button>
          }
        />
      )}

      {older.length > 0 && !showOlder && (
        <div className="flex justify-center">
          <Button onClick={() => setShowOlder(true)}>Load older activity</Button>
        </div>
      )}
      {showOlder && (
        <p role="status" className="text-center text-sm text-muted">
          You&apos;ve reached the start of the last 7 days. Older activity is in the audit log.
        </p>
      )}
    </div>
  );
}
