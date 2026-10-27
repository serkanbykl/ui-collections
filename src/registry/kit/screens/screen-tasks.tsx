"use client";

import { useMemo, useState, type FormEvent } from "react";

import { cn } from "@/registry/kit/lib/utils";
import { Badge } from "@/registry/kit/ui/badge";
import { Button } from "@/registry/kit/ui/button";
import { Checkbox } from "@/registry/kit/ui/checkbox";
import { ChipGroup } from "@/registry/kit/ui/chip";
import { Input } from "@/registry/kit/ui/field";
import { Progress } from "@/registry/kit/ui/progress";
import { SearchInput } from "@/registry/kit/ui/search-input";
import { SegmentedControl } from "@/registry/kit/ui/segmented-control";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/registry/kit/ui/select";
import { EmptyState } from "@/registry/kit/ui/states";
import { PageHeader } from "@/registry/kit/ui/page-header";

export type TaskPriority = "high" | "medium" | "low";

export interface Task {
  id: string;
  title: string;
  priority: TaskPriority;
  /** YYYY-MM-DD */
  due?: string;
  project?: string;
  done?: boolean;
}

export const defaultTasks: Task[] = [
  { id: "t1", title: "Confirm Mobile Safari drop with browser split", priority: "high", due: "2026-10-26", project: "Funnels" },
  { id: "t2", title: "Reply to Kitebase about shared segments", priority: "medium", due: "2026-10-27", project: "Customers" },
  { id: "t3", title: "Review Jonas's ingestion PR #2291", priority: "high", due: "2026-10-23", project: "Ingestion" },
  { id: "t4", title: "Draft release notes for 4.12", priority: "medium", due: "2026-10-28", project: "Releases" },
  { id: "t5", title: "Update the retention dashboard screenshots in docs", priority: "low", due: "2026-11-04", project: "Docs" },
  { id: "t6", title: "Book room for the Orbitly QBR", priority: "low", due: "2026-10-29", project: "Customers", done: true },
  { id: "t7", title: "Archive Q2 experiments", priority: "low", project: "Product", done: true },
  { id: "t8", title: "Send invoice INV-20481 to finance", priority: "medium", due: "2026-10-25", project: "Billing", done: true },
];

const priorityMeta: Record<TaskPriority, { label: string; variant: "danger" | "warning" | "outline"; rank: number }> = {
  high: { label: "High", variant: "danger", rank: 0 },
  medium: { label: "Medium", variant: "warning", rank: 1 },
  low: { label: "Low", variant: "outline", rank: 2 },
};

const fmt = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", { timeZone: "UTC", weekday: "short", day: "numeric", month: "short" }).format(new Date(`${iso}T00:00:00Z`));

export interface TasksScreenProps {
  tasks?: Task[];
  /** Today's date (YYYY-MM-DD) for due and overdue labels. */
  today?: string;
}

type Status = "all" | "active" | "completed";

/** To-do list with status and priority filters, due dates, and complete with undo. */
export function TasksScreen({ tasks: initial = defaultTasks, today = "2026-10-26" }: TasksScreenProps) {
  const [tasks, setTasks] = useState(initial);
  const [status, setStatus] = useState<Status>("active");
  const [priority, setPriority] = useState<"all" | TaskPriority>("all");
  const [query, setQuery] = useState("");
  const [title, setTitle] = useState("");
  const [newPriority, setNewPriority] = useState<TaskPriority>("medium");
  const [due, setDue] = useState(today);
  const [error, setError] = useState("");
  const [undo, setUndo] = useState<{ id: string; text: string } | null>(null);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tasks
      .filter((t) => (status === "all" ? true : status === "active" ? !t.done : t.done))
      .filter((t) => priority === "all" || t.priority === priority)
      .filter((t) => !q || `${t.title} ${t.project ?? ""}`.toLowerCase().includes(q))
      .sort(
        (a, b) =>
          Number(a.done ?? false) - Number(b.done ?? false) ||
          priorityMeta[a.priority].rank - priorityMeta[b.priority].rank ||
          (a.due ?? "9999").localeCompare(b.due ?? "9999"),
      );
  }, [tasks, status, priority, query]);

  const doneCount = tasks.filter((t) => t.done).length;
  const overdueCount = tasks.filter((t) => !t.done && t.due && t.due < today).length;

  function toggle(task: Task) {
    const done = !task.done;
    setTasks((all) => all.map((t) => (t.id === task.id ? { ...t, done } : t)));
    setUndo({ id: task.id, text: done ? `Completed “${task.title}”.` : `Reopened “${task.title}”.` });
  }

  function revert() {
    if (!undo) return;
    setTasks((all) => all.map((t) => (t.id === undo.id ? { ...t, done: !t.done } : t)));
    setUndo(null);
  }

  function add(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setError("Describe the task in a few words.");
      return;
    }
    const task: Task = { id: `t${tasks.length + 1}-${title.length}`, title: title.trim(), priority: newPriority, due: due || undefined };
    setTasks((all) => [task, ...all]);
    setUndo(null);
    setTitle("");
    if (status === "completed") setStatus("active");
  }

  const dueLabel = (t: Task) => {
    if (!t.due) return null;
    if (t.due === today) return { text: "Due today", className: "text-warning" };
    if (!t.done && t.due < today) return { text: `Overdue · ${fmt(t.due)}`, className: "text-danger font-medium" };
    return { text: fmt(t.due), className: "text-muted" };
  };

  return (
    <div className="grid min-w-0 grid-cols-1 gap-6">
      <PageHeader
        title="Tasks"
        description={`${tasks.length - doneCount} open · ${tasks.filter((t) => !t.done && t.due === today).length} due today · ${overdueCount} overdue`}
      />
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_17rem]">
        <div className="grid min-w-0 content-start gap-4">
          <form onSubmit={add} noValidate className="surface grid gap-3 rounded-card p-4 sm:grid-cols-[minmax(0,1fr)_11.5rem_10rem_auto] sm:items-start">
            <Input
              label="New task"
              value={title}
              error={error || undefined}
              onChange={(e) => {
                setError("");
                setTitle(e.target.value);
              }}
            />
            <Select value={newPriority} onValueChange={(v) => setNewPriority(v as TaskPriority)}>
              <SelectTrigger aria-label="Priority" className="h-14">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(priorityMeta) as TaskPriority[]).map((p) => (
                  <SelectItem key={p} value={p}>
                    {priorityMeta[p].label} priority
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input label="Due" type="date" value={due} onChange={(e) => setDue(e.target.value)} />
            <Button type="submit" variant="accent" size="lg" className="h-14">
              Add task
            </Button>
          </form>

          <div className="flex flex-wrap items-center gap-2">
            <SegmentedControl
              aria-label="Status"
              options={[
                { value: "active", label: "Active" },
                { value: "completed", label: "Completed" },
                { value: "all", label: "All" },
              ]}
              value={status}
              onValueChange={(v) => setStatus(v as Status)}
            />
            <ChipGroup
              label="Filter by priority"
              deselectable
              value={priority === "all" ? null : priority}
              onValueChange={(v) => setPriority((v ?? "all") as "all" | TaskPriority)}
              options={(Object.keys(priorityMeta) as TaskPriority[]).map((p) => ({
                value: p,
                label: priorityMeta[p].label,
                count: tasks.filter((t) => t.priority === p && !t.done).length,
              }))}
            />
            <SearchInput value={query} onValueChange={setQuery} label="Search tasks" placeholder="Search tasks…" className="min-w-48 flex-1" />
          </div>

          <div aria-live="polite" className="-my-2 min-h-9">
            {undo && (
              <div className="flex items-center gap-3 text-sm text-muted">
                <span className="min-w-0 truncate">{undo.text}</span>
                <Button size="sm" variant="ghost" onClick={revert}>
                  Undo
                </Button>
              </div>
            )}
          </div>

          <section aria-label="Tasks" className="surface rounded-card p-2">
            {visible.length === 0 ? (
              <EmptyState
                title={status === "completed" ? "Nothing completed yet" : query || priority !== "all" ? "No tasks match" : "You're all caught up"}
                description={
                  query || priority !== "all" ? "Clear the search or pick another priority." : "Add a task above when something new comes in."
                }
                action={
                  query || priority !== "all" ? (
                    <Button
                      size="sm"
                      onClick={() => {
                        setQuery("");
                        setPriority("all");
                      }}
                    >
                      Clear filters
                    </Button>
                  ) : undefined
                }
              />
            ) : (
              <ul className="divide-y divide-line">
                {visible.map((t) => {
                  const d = dueLabel(t);
                  const id = `task-${t.id}`;
                  return (
                    <li key={t.id} className="flex items-start gap-3 px-3 py-3">
                      <Checkbox id={id} checked={t.done ?? false} onCheckedChange={() => toggle(t)} className="mt-0.5" />
                      <div className="min-w-0 flex-1">
                        <label htmlFor={id} className={cn("block cursor-pointer text-sm", t.done && "text-muted line-through")}>
                          {t.title}
                        </label>
                        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                          {t.project && <span className="text-muted">{t.project}</span>}
                          {d && <span className={d.className}>{d.text}</span>}
                        </div>
                      </div>
                      <Badge variant={t.done ? "outline" : priorityMeta[t.priority].variant} className="shrink-0">
                        {priorityMeta[t.priority].label}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Delete “${t.title}”`}
                        className="-my-1 shrink-0 text-muted hover:text-danger"
                        onClick={() => {
                          setTasks((all) => all.filter((x) => x.id !== t.id));
                          setUndo(null);
                        }}
                      >
                        <svg viewBox="0 0 24 24" className="size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                          <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />
                        </svg>
                      </Button>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </div>

        <aside className="grid content-start gap-4" aria-label="Progress">
          <div className="surface grid gap-3 rounded-card p-4">
            <h3 className="text-sm font-medium text-muted">This week</h3>
            <p className="text-3xl font-semibold tracking-tight tabular-nums">
              {doneCount}
              <span className="text-lg text-muted"> / {tasks.length} done</span>
            </p>
            <Progress value={doneCount} max={Math.max(tasks.length, 1)} aria-label="Tasks completed" />
          </div>
          <dl className="surface grid gap-3 rounded-card p-4 text-sm">
            {(Object.keys(priorityMeta) as TaskPriority[]).map((p) => (
              <div key={p} className="flex items-center justify-between">
                <dt>
                  <Badge variant={priorityMeta[p].variant}>{priorityMeta[p].label}</Badge>
                </dt>
                <dd className="tabular-nums text-muted">{tasks.filter((t) => t.priority === p && !t.done).length} open</dd>
              </div>
            ))}
            <div className="flex items-center justify-between border-t border-line pt-3">
              <dt>Overdue</dt>
              <dd className={cn("tabular-nums", overdueCount ? "font-medium text-danger" : "text-muted")}>{overdueCount}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </div>
  );
}
