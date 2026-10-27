"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { cn } from "@/registry/kit/lib/utils";
import { Button } from "@/registry/kit/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/registry/kit/ui/dialog";
import { SearchInput } from "@/registry/kit/ui/search-input";
import { EmptyState } from "@/registry/kit/ui/states";
import { toast } from "@/registry/kit/ui/toast";
import { PageHeader } from "@/registry/kit/ui/page-header";

export interface Note {
  id: string;
  title: string;
  body: string;
  /** Display string, e.g. "09:14" or "23 Oct". */
  edited: string;
  pinned?: boolean;
}

export const defaultNotes: Note[] = [
  {
    id: "n1",
    title: "Funnel drop at /pricing",
    body:
      "Started Thursday after deploy 4.11.3.\n\n- 71% of the drop is Mobile Safari\n- Plan switcher re-renders on scroll\n- Desktop conversion unchanged (3.84% vs 3.79%)\n\nNext: browser split for the last 7 days, then decide on rollback with Priya.",
    edited: "09:14",
    pinned: true,
  },
  {
    id: "n2",
    title: "Orbitly QBR talking points",
    body: "Day-30 retention 31.2% → 38.7%.\nCustom onboarding events live since 22 Oct.\nAsk: event renames without losing history (LUM-412).",
    edited: "Yesterday",
  },
  {
    id: "n3",
    title: "Release 4.12 checklist",
    body: "Saved segments\nFaster CSV exports (median 4.1 s → 1.3 s)\nRetention view\nChangelog + in-app note\nEmail to 1,284 workspace owners",
    edited: "23 Oct",
    pinned: true,
  },
  {
    id: "n4",
    title: "Ideas for the empty dashboard",
    body: "Show a sample project with fake data, a 3-step checklist, and a link to the SDK quickstart.",
    edited: "19 Oct",
  },
];

export interface NotesScreenProps {
  notes?: Note[];
}

/** Searchable notes list with pinning, an editor that saves as you type, and delete confirmation. */
export function NotesScreen({ notes: initial = defaultNotes }: NotesScreenProps) {
  const [notes, setNotes] = useState(initial);
  const [activeId, setActiveId] = useState<string | null>(initial[0]?.id ?? null);
  const [showEditor, setShowEditor] = useState(false);
  const [query, setQuery] = useState("");
  const [saveState, setSaveState] = useState<"saved" | "saving">("saved");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const titleRef = useRef<HTMLInputElement>(null);
  const counter = useRef(initial.length);

  useEffect(() => () => clearTimeout(timer.current), []);

  const active = notes.find((n) => n.id === activeId) ?? null;
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return notes
      .filter((n) => !q || `${n.title} ${n.body}`.toLowerCase().includes(q))
      .sort((a, b) => Number(b.pinned ?? false) - Number(a.pinned ?? false));
  }, [notes, query]);

  function edit(patch: Partial<Note>) {
    if (!active) return;
    setNotes((all) => all.map((n) => (n.id === active.id ? { ...n, ...patch, edited: "Just now" } : n)));
    setSaveState("saving");
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setSaveState("saved"), 650);
  }

  function create() {
    counter.current += 1;
    const note: Note = { id: `n${counter.current}`, title: "", body: "", edited: "Just now" };
    setNotes((all) => [note, ...all]);
    setActiveId(note.id);
    setShowEditor(true);
    setQuery("");
    requestAnimationFrame(() => titleRef.current?.focus());
  }

  function remove() {
    if (!active) return;
    const rest = notes.filter((n) => n.id !== active.id);
    setNotes(rest);
    toast.success(`Deleted “${active.title || "Untitled note"}”.`);
    setActiveId(rest[0]?.id ?? null);
    setShowEditor(false);
    setConfirmDelete(false);
  }

  const preview = (n: Note) => n.body.replace(/\s+/g, " ").trim() || "No text yet";

  return (
    <div className="grid min-w-0 grid-cols-1 gap-6">
      <PageHeader
        title="Notes"
        description={`${notes.length} ${notes.length === 1 ? "note" : "notes"} · ${notes.filter((n) => n.pinned).length} pinned · saved as you type`}
      />
      <div className="grid gap-4 md:grid-cols-[18rem_minmax(0,1fr)]">
        <section aria-label="Notes" className={cn("surface grid min-w-0 content-start gap-3 rounded-card p-3", showEditor && "hidden md:grid")}>
          <div className="flex gap-2">
            <SearchInput value={query} onValueChange={setQuery} label="Search notes" placeholder="Search notes…" className="min-w-0 flex-1" />
            <Button variant="accent" size="icon" aria-label="New note" onClick={create}>
              <svg viewBox="0 0 24 24" className="size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden>
                <path d="M12 5v14M5 12h14" />
              </svg>
            </Button>
          </div>
          {visible.length === 0 ? (
            <EmptyState
              size="compact"
              title={query ? "No notes match" : "No notes yet"}
              description={query ? "Try another word from the title or body." : "Start one with the plus button."}
            />
          ) : (
            <ul className="grid gap-1">
              {visible.map((n) => (
                <li key={n.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveId(n.id);
                      setShowEditor(true);
                    }}
                    aria-current={n.id === activeId ? "true" : undefined}
                    className={cn(
                      "grid w-full gap-0.5 rounded-field p-3 text-left transition-colors hover:bg-surface-hover",
                      "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent",
                      n.id === activeId && "bg-surface-selected hover:bg-surface-selected",
                    )}
                  >
                    <span className="flex items-center gap-1.5 text-sm font-medium">
                      {n.pinned && (
                        <svg viewBox="0 0 24 24" className="size-3.5 shrink-0 text-accent" fill="currentColor" aria-label="Pinned" role="img">
                          <path d="M9 3h6l-1 6 4 4v2h-5v6l-1 1-1-1v-6H6v-2l4-4z" />
                        </svg>
                      )}
                      <span className="truncate">{n.title || "Untitled note"}</span>
                    </span>
                    <span className="line-clamp-2 text-xs text-muted">{preview(n)}</span>
                    <span className="text-[11px] text-subtle">{n.edited}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section aria-label="Editor" className={cn("surface flex min-h-[32rem] min-w-0 flex-col rounded-card", !showEditor && "hidden md:flex")}>
          {active ? (
            <>
              <div className="flex flex-wrap items-center gap-2 border-b border-line p-3">
                <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setShowEditor(false)}>
                  <svg viewBox="0 0 24 24" className="size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                  All notes
                </Button>
                <span className="text-xs text-muted" aria-live="polite">
                  {saveState === "saving" ? "Saving…" : `Saved · ${active.edited}`}
                </span>
                <div className="ml-auto flex gap-1">
                  <Button variant="ghost" size="sm" aria-pressed={active.pinned ?? false} onClick={() => edit({ pinned: !active.pinned })}>
                    <svg viewBox="0 0 24 24" className="size-4 shrink-0" fill={active.pinned ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" aria-hidden>
                      <path d="M9 3h6l-1 6 4 4v2h-5v6l-1 1-1-1v-6H6v-2l4-4z" />
                    </svg>
                    {active.pinned ? "Unpin" : "Pin"}
                  </Button>
                  <Button variant="ghost" size="sm" className="hover:text-danger" onClick={() => setConfirmDelete(true)}>
                    <svg viewBox="0 0 24 24" className="size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />
                    </svg>
                    Delete
                  </Button>
                </div>
              </div>
              <div className="flex flex-1 flex-col gap-3 p-4 md:p-6">
                <label htmlFor="note-title" className="sr-only">
                  Title
                </label>
                <input
                  id="note-title"
                  ref={titleRef}
                  value={active.title}
                  onChange={(e) => edit({ title: e.target.value })}
                  placeholder="Untitled note"
                  className="w-full bg-transparent text-3xl font-semibold tracking-tight outline-none placeholder:text-subtle"
                />
                <label htmlFor="note-body" className="sr-only">
                  Note
                </label>
                <textarea
                  id="note-body"
                  value={active.body}
                  onChange={(e) => edit({ body: e.target.value })}
                  placeholder="Write something…"
                  className="min-h-72 w-full flex-1 resize-none bg-transparent text-sm leading-relaxed outline-none placeholder:text-subtle"
                />
                <p className="text-xs text-subtle tabular-nums">
                  {active.body.trim() ? active.body.trim().split(/\s+/).length : 0} words · {active.body.length} characters
                </p>
              </div>
            </>
          ) : (
            <EmptyState
              title="No note open"
              description="Pick a note from the list or start a new one."
              action={
                <Button variant="accent" size="sm" onClick={create}>
                  New note
                </Button>
              }
              className="m-auto"
            />
          )}
        </section>

        <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
          <DialogContent size="sm">
            <DialogHeader
              tone="danger"
              icon={
                <svg viewBox="0 0 24 24" className="size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />
                </svg>
              }
            >
              <DialogTitle>Delete this note?</DialogTitle>
              <DialogDescription>“{active?.title || "Untitled note"}” will be removed. This can&apos;t be undone.</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="ghost">Keep note</Button>
              </DialogClose>
              <Button variant="danger" onClick={remove}>
                Delete note
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
