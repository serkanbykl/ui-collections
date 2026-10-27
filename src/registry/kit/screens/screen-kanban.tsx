"use client";

import { useState, type DragEvent, type KeyboardEvent } from "react";

import { cn } from "@/registry/kit/lib/utils";
import { Avatar, AvatarGroup } from "@/registry/kit/ui/avatar";
import { Badge } from "@/registry/kit/ui/badge";
import { Button } from "@/registry/kit/ui/button";
import { ChipGroup } from "@/registry/kit/ui/chip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/registry/kit/ui/dropdown-menu";
import { PageHeader } from "@/registry/kit/ui/page-header";

type Tone = "accent" | "info" | "success" | "warning" | "danger";

export interface KanbanCard {
  id: string;
  title: string;
  column: string;
  labels?: { text: string; tone: Tone }[];
  assignees?: string[];
  /** YYYY-MM-DD */
  due?: string;
  points?: number;
}

export interface KanbanColumn {
  id: string;
  title: string;
  /** Soft work-in-progress limit shown next to the count. */
  limit?: number;
}

export const defaultColumns: KanbanColumn[] = [
  { id: "backlog", title: "Backlog" },
  { id: "progress", title: "In progress", limit: 4 },
  { id: "review", title: "In review", limit: 3 },
  { id: "done", title: "Done" },
];

export const defaultCards: KanbanCard[] = [
  { id: "LUM-412", title: "Rename events without losing history", column: "backlog", labels: [{ text: "Ingestion", tone: "info" }], assignees: ["Jonas Lindqvist"], due: "2026-11-12", points: 5 },
  { id: "LUM-418", title: "Share saved segments with view-only members", column: "backlog", labels: [{ text: "Segments", tone: "accent" }, { text: "Customer ask", tone: "warning" }], assignees: ["Amara Okafor", "Priya Raman"], points: 3 },
  { id: "LUM-421", title: "CSV export for retention tables", column: "backlog", labels: [{ text: "Exports", tone: "success" }], due: "2026-11-20", points: 2 },
  { id: "LUM-397", title: "Fix Mobile Safari plan switcher", column: "progress", labels: [{ text: "Bug", tone: "danger" }], assignees: ["Lucía Moreno"], due: "2026-10-24", points: 2 },
  { id: "LUM-402", title: "Week-over-week comparison on funnels", column: "progress", labels: [{ text: "Funnels", tone: "accent" }], assignees: ["Priya Raman", "Hana Sato", "Jonas Lindqvist"], due: "2026-10-30", points: 8 },
  { id: "LUM-388", title: "New ingestion endpoint to staging", column: "review", labels: [{ text: "Ingestion", tone: "info" }], assignees: ["Jonas Lindqvist"], due: "2026-10-27", points: 5 },
  { id: "LUM-391", title: "Empty states for funnel builder", column: "review", labels: [{ text: "Design", tone: "success" }], assignees: ["Lucía Moreno"], points: 1 },
  { id: "LUM-376", title: "SDK 3.8 changelog", column: "done", labels: [{ text: "Docs", tone: "success" }], assignees: ["Hana Sato"], due: "2026-10-21", points: 1 },
  { id: "LUM-380", title: "Billing page shows event overage", column: "done", labels: [{ text: "Billing", tone: "warning" }], assignees: ["Marcus Ode", "Amara Okafor"], points: 3 },
];

const fmtDue = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", { timeZone: "UTC", day: "numeric", month: "short" }).format(new Date(`${iso}T00:00:00Z`));

export interface KanbanScreenProps {
  columns?: KanbanColumn[];
  cards?: KanbanCard[];
  /** Today's date (YYYY-MM-DD) for overdue marking. */
  today?: string;
  /** Prefix for new card ids. */
  keyPrefix?: string;
}

/** Board with labelled cards. Move cards by dragging, with the card menu, or with ← → when a card is focused. */
export function KanbanScreen({ columns = defaultColumns, cards: initial = defaultCards, today = "2026-10-26", keyPrefix = "LUM" }: KanbanScreenProps) {
  const [cards, setCards] = useState(initial);
  const [dragId, setDragId] = useState<string | null>(null);
  const [overColumn, setOverColumn] = useState<string | null>(null);
  const [adding, setAdding] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [announcement, setAnnouncement] = useState("");
  const [nextNumber, setNextNumber] = useState(430);
  const [labelFilter, setLabelFilter] = useState<string[]>([]);
  const labels = [...new Set(cards.flatMap((c) => c.labels?.map((l) => l.text) ?? []))];
  const matches = (card: KanbanCard) => !labelFilter.length || !!card.labels?.some((l) => labelFilter.includes(l.text));

  const columnTitle = (id: string) => columns.find((c) => c.id === id)?.title ?? id;

  function move(id: string, column: string, beforeId?: string) {
    setCards((all) => {
      const card = all.find((c) => c.id === id);
      if (!card) return all;
      const rest = all.filter((c) => c.id !== id);
      const moved = { ...card, column };
      const index = beforeId ? rest.findIndex((c) => c.id === beforeId) : -1;
      if (index === -1) return [...rest, moved];
      return [...rest.slice(0, index), moved, ...rest.slice(index)];
    });
    const card = cards.find((c) => c.id === id);
    if (card && card.column !== column) setAnnouncement(`Moved ${id} “${card.title}” to ${columnTitle(column)}.`);
  }

  function shift(card: KanbanCard, by: number) {
    const index = columns.findIndex((c) => c.id === card.column) + by;
    if (index < 0 || index >= columns.length) return;
    move(card.id, columns[index].id);
    requestAnimationFrame(() => document.getElementById(`kanban-card-${card.id}`)?.focus());
  }

  function onKey(e: KeyboardEvent<HTMLElement>, card: KanbanCard) {
    if (e.target !== e.currentTarget) return;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      shift(card, 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      shift(card, -1);
    }
  }

  function onDrop(e: DragEvent, column: string, beforeId?: string) {
    e.preventDefault();
    e.stopPropagation();
    const id = e.dataTransfer.getData("text/plain") || dragId;
    if (id && id !== beforeId) move(id, column, beforeId);
    setDragId(null);
    setOverColumn(null);
  }

  function add(e: { preventDefault(): void }, column: string) {
    e.preventDefault();
    const title = newTitle.trim();
    if (!title) return;
    const id = `${keyPrefix}-${nextNumber}`;
    setNextNumber((n) => n + 1);
    setCards((all) => [...all, { id, title, column }]);
    setAnnouncement(`Added ${id} to ${columnTitle(column)}.`);
    setNewTitle("");
    setAdding(null);
  }

  return (
    <div className="grid min-w-0 grid-cols-1 gap-6">
      <PageHeader
        title="Board"
        description={`${cards.length} cards in ${columns.length} columns · ${cards.filter((c) => c.column !== columns.at(-1)?.id).length} still open · ${cards.filter((c) => c.due && c.due < today && c.column !== columns.at(-1)?.id).length} overdue`}
      />
      <div className="grid gap-3">
        <p className="text-sm text-muted">
          Drag cards between columns, or focus a card and press <kbd className="font-sans font-medium text-fg">←</kbd>{" "}
          <kbd className="font-sans font-medium text-fg">→</kbd> to move it.
        </p>
        <p aria-live="polite" className="sr-only">
          {announcement}
        </p>
        {labels.length > 1 && (
          <ChipGroup
            label="Filter by label"
            multiple
            scroll
            size="sm"
            value={labelFilter}
            onValueChange={setLabelFilter}
            options={labels.map((l) => ({ value: l, label: l, count: cards.filter((c) => c.labels?.some((x) => x.text === l)).length }))}
          />
        )}
        <div className="-mx-1 overflow-x-auto px-1 pb-2">
          <div className="grid auto-cols-[minmax(15rem,1fr)] grid-flow-col gap-4">
            {columns.map((column) => {
              const all = cards.filter((c) => c.column === column.id);
              const list = all.filter(matches);
              const over = column.limit !== undefined && all.length > column.limit;
              return (
                <section
                  key={column.id}
                  aria-label={column.title}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setOverColumn(column.id);
                  }}
                  onDragLeave={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget as Node)) setOverColumn(null);
                  }}
                  onDrop={(e) => onDrop(e, column.id)}
                  className={cn(
                    "flex min-h-[28rem] flex-col gap-2 rounded-card border border-line bg-fg/[0.025] p-2.5 transition-colors",
                    overColumn === column.id && dragId && "border-accent bg-accent/5",
                  )}
                >
                  <header className="flex items-center gap-2 px-1.5 pt-1 pb-1.5">
                    <h3 className="text-sm font-semibold">{column.title}</h3>
                    <Badge variant={over ? "warning" : "surface"}>
                      {list.length === all.length ? all.length : `${list.length} of ${all.length}`}
                      {column.limit !== undefined && ` / ${column.limit}`}
                    </Badge>
                    {over && <span className="sr-only">Over the work-in-progress limit</span>}
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="ml-auto"
                      aria-label={`Add card to ${column.title}`}
                      onClick={() => {
                        setAdding(column.id);
                        setNewTitle("");
                      }}
                    >
                      <svg viewBox="0 0 24 24" className="size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden>
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    </Button>
                  </header>

                  <ol className="grid gap-2">
                    {list.map((card) => {
                      const overdue = card.due && card.column !== "done" && card.due < today;
                      const colIndex = columns.findIndex((c) => c.id === card.column);
                      return (
                        <li
                          key={card.id}
                          id={`kanban-card-${card.id}`}
                          tabIndex={0}
                          draggable
                          aria-roledescription="Draggable card"
                          aria-label={`${card.id}: ${card.title}, ${column.title}`}
                          onKeyDown={(e) => onKey(e, card)}
                          onDragStart={(e) => {
                            e.dataTransfer.setData("text/plain", card.id);
                            e.dataTransfer.effectAllowed = "move";
                            setDragId(card.id);
                          }}
                          onDragEnd={() => {
                            setDragId(null);
                            setOverColumn(null);
                          }}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => onDrop(e, column.id, card.id)}
                          className={cn(
                            "surface-raised grid cursor-grab gap-2.5 rounded-field p-3 transition-[opacity,scale] ease-theme active:cursor-grabbing",
                            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                            dragId === card.id && "scale-[0.98] opacity-50",
                          )}
                        >
                          <div className="flex items-start gap-2">
                            <div className="flex min-w-0 flex-1 flex-wrap gap-1">
                              {card.labels?.map((l) => (
                                <Badge key={l.text} variant={l.tone}>
                                  {l.text}
                                </Badge>
                              ))}
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon-sm" className="-mt-1 -mr-1 shrink-0" aria-label={`Actions for ${card.id}`}>
                                  <svg viewBox="0 0 24 24" className="size-4 shrink-0" fill="currentColor" aria-hidden>
                                    <circle cx="5" cy="12" r="1.6" />
                                    <circle cx="12" cy="12" r="1.6" />
                                    <circle cx="19" cy="12" r="1.6" />
                                  </svg>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Move to</DropdownMenuLabel>
                                {columns.map((c) => (
                                  <DropdownMenuItem key={c.id} disabled={c.id === card.column} onSelect={() => move(card.id, c.id)}>
                                    {c.title}
                                  </DropdownMenuItem>
                                ))}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  variant="danger"
                                  onSelect={() => {
                                    setCards((all) => all.filter((c) => c.id !== card.id));
                                    setAnnouncement(`Deleted ${card.id}.`);
                                  }}
                                >
                                  Delete card
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          <p className="text-sm leading-snug font-medium">{card.title}</p>
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 text-xs text-muted">
                            <span className="font-mono whitespace-nowrap">{card.id}</span>
                            {card.due && (
                              <span className={cn("flex items-center gap-1 whitespace-nowrap", overdue && "font-medium text-danger")}>
                                <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden>
                                  <rect x="4" y="5" width="16" height="15" rx="2" />
                                  <path d="M8 3v4M16 3v4M4 10h16" />
                                </svg>
                                {overdue ? `Overdue · ${fmtDue(card.due)}` : fmtDue(card.due)}
                              </span>
                            )}
                            {card.points !== undefined && (
                              <span className="rounded-[calc(var(--r-field)*0.4)] bg-fg/8 px-1.5 tabular-nums" title="Story points">
                                <span className="sr-only">Story points: </span>
                                {card.points}
                              </span>
                            )}
                            {card.assignees && card.assignees.length > 0 && (
                              <AvatarGroup size="sm" max={3} className="ml-auto">
                                {card.assignees.map((a) => (
                                  <Avatar key={a} alt={a} size="sm" />
                                ))}
                              </AvatarGroup>
                            )}
                          </div>
                          <div className="flex justify-between gap-2 sm:hidden">
                            <Button size="sm" variant="ghost" disabled={colIndex === 0} onClick={() => shift(card, -1)}>
                              ← {colIndex > 0 ? columns[colIndex - 1].title : "Start"}
                            </Button>
                            <Button size="sm" variant="ghost" disabled={colIndex === columns.length - 1} onClick={() => shift(card, 1)}>
                              {colIndex < columns.length - 1 ? columns[colIndex + 1].title : "End"} →
                            </Button>
                          </div>
                        </li>
                      );
                    })}
                  </ol>

                  {list.length === 0 && adding !== column.id && (
                    <p className="grid flex-1 place-items-center rounded-field border border-dashed border-line p-6 text-center text-xs text-muted">
                      Drop a card here
                    </p>
                  )}

                  {adding === column.id ? (
                    <form onSubmit={(e) => add(e, column.id)} className="surface-raised grid gap-2 rounded-field p-2">
                      <label htmlFor={`new-card-${column.id}`} className="sr-only">
                        Card title
                      </label>
                      <textarea
                        id={`new-card-${column.id}`}
                        autoFocus
                        rows={2}
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            add(e, column.id);
                          }
                          if (e.key === "Escape") setAdding(null);
                        }}
                        placeholder="What needs doing?"
                        className="surface-field resize-none rounded-field px-2.5 py-2 text-sm outline-none placeholder:text-subtle focus:bg-field-focus"
                      />
                      <div className="flex justify-end gap-2">
                        <Button type="button" size="sm" variant="ghost" onClick={() => setAdding(null)}>
                          Cancel
                        </Button>
                        <Button type="submit" size="sm" variant="accent" disabled={!newTitle.trim()}>
                          Add card
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-auto justify-start text-muted"
                      onClick={() => {
                        setAdding(column.id);
                        setNewTitle("");
                      }}
                    >
                      + Add card
                    </Button>
                  )}
                </section>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
