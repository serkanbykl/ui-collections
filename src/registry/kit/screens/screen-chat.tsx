"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent, type KeyboardEvent } from "react";

import { cn } from "@/registry/kit/lib/utils";
import { Avatar } from "@/registry/kit/ui/avatar";
import { Badge } from "@/registry/kit/ui/badge";
import { Button } from "@/registry/kit/ui/button";
import { SearchInput } from "@/registry/kit/ui/search-input";
import { EmptyState } from "@/registry/kit/ui/states";
import { PageHeader } from "@/registry/kit/ui/page-header";

export interface ChatMessage {
  id: string;
  /** "me" for the current user, otherwise the conversation's contact. */
  author: "me" | "them";
  text: string;
  time: string;
}

export interface ChatConversation {
  id: string;
  name: string;
  role: string;
  online?: boolean;
  unread?: number;
  messages: ChatMessage[];
  /** Canned answers the contact "types" back after you send something. */
  replies?: string[];
}

export const defaultConversations: ChatConversation[] = [
  {
    id: "c1",
    name: "Priya Raman",
    role: "Product analyst, Northwind",
    online: true,
    unread: 2,
    messages: [
      { id: "1", author: "them", text: "Morning. Did the cohort export finish overnight?", time: "08:57" },
      { id: "2", author: "me", text: "It did, 48,213 rows. I shared it in #growth-data.", time: "09:03" },
      { id: "3", author: "them", text: "Perfect. The week-4 retention looks off for Android though.", time: "09:11" },
      { id: "4", author: "them", text: "Could it be the SDK update from the 19th?", time: "09:12" },
    ],
    replies: ["Makes sense, I'll check the SDK version split.", "Thanks. Let's compare after the 14:00 sync."],
  },
  {
    id: "c2",
    name: "Jonas Lindqvist",
    role: "Engineering lead",
    online: true,
    messages: [
      { id: "1", author: "me", text: "Is the new ingestion endpoint ready for staging?", time: "Yesterday" },
      { id: "2", author: "them", text: "Deploying now. p95 latency dropped from 212 ms to 87 ms in load tests.", time: "Yesterday" },
    ],
    replies: ["I'll ping you once staging is green."],
  },
  {
    id: "c3",
    name: "Amara Okafor",
    role: "Customer success",
    unread: 1,
    messages: [
      { id: "1", author: "them", text: "Kitebase asked whether saved segments can be shared with view-only members.", time: "Sat" },
    ],
    replies: ["Got it, I'll tell them it's on the 4.13 roadmap."],
  },
  {
    id: "c4",
    name: "Lucía Moreno",
    role: "Design",
    messages: [
      { id: "1", author: "them", text: "New empty states for the funnel builder are in Figma.", time: "Thu" },
      { id: "2", author: "me", text: "Lovely. The illustration for “no steps yet” is my favourite.", time: "Thu" },
    ],
    replies: ["Thank you. I'll hand off the specs tomorrow."],
  },
];

export interface ChatScreenProps {
  conversations?: ChatConversation[];
  /** Delay before the contact replies, in ms. */
  replyDelay?: number;
}

/** Conversation list, message thread and composer with a typing indicator. One pane at a time on small screens. */
export function ChatScreen({ conversations: initial = defaultConversations, replyDelay = 1600 }: ChatScreenProps) {
  const [conversations, setConversations] = useState(initial);
  const [activeId, setActiveId] = useState(initial[0]?.id ?? "");
  const [showThread, setShowThread] = useState(false);
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState<string | null>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const active = conversations.find((c) => c.id === activeId) ?? null;
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return conversations.filter((c) => !q || `${c.name} ${c.role}`.toLowerCase().includes(q));
  }, [conversations, query]);

  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [active?.messages.length, typing, activeId]);

  function openConversation(id: string) {
    setActiveId(id);
    setShowThread(true);
    setConversations((all) => all.map((c) => (c.id === id ? { ...c, unread: 0 } : c)));
  }

  function append(id: string, message: Omit<ChatMessage, "id">) {
    setConversations((all) =>
      all.map((c) => (c.id === id ? { ...c, messages: [...c.messages, { ...message, id: `${c.messages.length + 1}-${message.author}` }] } : c)),
    );
  }

  function send(e?: FormEvent) {
    e?.preventDefault();
    const text = draft.trim();
    if (!text || !active) return;
    const id = active.id;
    append(id, { author: "me", text, time: "Now" });
    setDraft("");
    const replies = active.replies ?? [];
    const sent = active.messages.filter((m) => m.author === "me").length;
    const reply = replies[sent % Math.max(replies.length, 1)];
    if (!reply) return;
    timers.current.push(
      setTimeout(() => setTyping(id), 400),
      setTimeout(() => {
        setTyping(null);
        append(id, { author: "them", text: reply, time: "Now" });
      }, 400 + replyDelay),
    );
  }

  function onKey(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <div className="grid min-w-0 grid-cols-1 gap-6">
      <PageHeader
        title="Chat"
        description={`${conversations.length} conversations · ${conversations.reduce((n, c) => n + (c.unread ?? 0), 0)} unread · ${conversations.filter((c) => c.online).length} online now`}
      />
      <div className="grid gap-4 md:grid-cols-[18rem_minmax(0,1fr)]">
        <section aria-label="Conversations" className={cn("surface min-w-0 rounded-card p-3", showThread && "hidden md:block")}>
          <SearchInput value={query} onValueChange={setQuery} label="Search conversations" placeholder="Search people…" className="mb-3" />
          {visible.length === 0 ? (
            <EmptyState size="compact" title="Nobody matches" description="Search by name or role." />
          ) : (
            <ul className="grid gap-1">
              {visible.map((c) => {
                const last = c.messages.at(-1);
                return (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => openConversation(c.id)}
                      aria-current={c.id === activeId ? "true" : undefined}
                      className={cn(
                        "grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-field p-2.5 text-left transition-colors hover:bg-surface-hover",
                        "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent",
                        c.id === activeId && "bg-surface-selected hover:bg-surface-selected",
                      )}
                    >
                      <span className="relative">
                        <Avatar alt={c.name} size="sm" />
                        {c.online && (
                          <span className="absolute -right-0.5 -bottom-0.5 size-2.5 rounded-full bg-success ring-2 ring-bg" aria-hidden />
                        )}
                      </span>
                      <span className="min-w-0">
                        <span className={cn("block truncate text-sm", c.unread ? "font-semibold" : "font-medium")}>
                          {c.name}
                          {c.online && <span className="sr-only"> (online)</span>}
                        </span>
                        <span className="block truncate text-xs text-muted">
                          {last ? `${last.author === "me" ? "You: " : ""}${last.text}` : c.role}
                        </span>
                      </span>
                      <span className="grid justify-items-end gap-1">
                        <span className="text-[11px] text-subtle">{last?.time}</span>
                        {c.unread ? (
                          <Badge variant="accent-solid" aria-label={`${c.unread} unread`}>
                            {c.unread}
                          </Badge>
                        ) : null}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section
          aria-label={active ? `Conversation with ${active.name}` : "Conversation"}
          className={cn("surface flex h-[38rem] min-w-0 flex-col rounded-card", !showThread && "hidden md:flex")}
        >
          {active ? (
            <>
              <header className="flex items-center gap-3 border-b border-line p-3 md:px-5">
                <Button variant="ghost" size="icon-sm" className="md:hidden" aria-label="Back to conversations" onClick={() => setShowThread(false)}>
                  <svg viewBox="0 0 24 24" className="size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </Button>
                <Avatar alt={active.name} size="sm" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{active.name}</p>
                  <p className="truncate text-xs text-muted">
                    {typing === active.id ? "Typing…" : active.online ? `Online · ${active.role}` : active.role}
                  </p>
                </div>
              </header>

              <div ref={scroller} className="flex-1 overflow-y-auto p-4 md:p-5" role="log" aria-live="polite" aria-label="Messages">
                <ol className="grid gap-3">
                  {active.messages.map((m) => (
                    <li key={m.id} className={cn("flex max-w-[85%] flex-col gap-1 md:max-w-[70%]", m.author === "me" ? "items-end justify-self-end" : "items-start")}>
                      <p
                        className={cn(
                          "rounded-[calc(var(--r-field)*1.4)] px-3.5 py-2 text-sm leading-relaxed",
                          m.author === "me" ? "rounded-br-sm bg-accent text-accent-fg" : "surface-raised rounded-bl-sm",
                        )}
                      >
                        <span className="sr-only">{m.author === "me" ? "You" : active.name}: </span>
                        {m.text}
                      </p>
                      <time className="px-1 text-[11px] text-subtle">{m.time}</time>
                    </li>
                  ))}
                  {typing === active.id && (
                    <li className="surface-raised flex w-fit items-center gap-1 rounded-[calc(var(--r-field)*1.4)] rounded-bl-sm px-3.5 py-3">
                      <span className="sr-only">{active.name} is typing</span>
                      {[0, 160, 320].map((delay) => (
                        <span
                          key={delay}
                          aria-hidden
                          className="size-1.5 animate-bounce rounded-full bg-muted"
                          style={{ animationDelay: `${delay}ms`, animationDuration: "900ms" }}
                        />
                      ))}
                    </li>
                  )}
                </ol>
              </div>

              <form onSubmit={send} className="flex items-end gap-2 border-t border-line p-3">
                <label htmlFor="chat-composer" className="sr-only">
                  Message {active.name}
                </label>
                <textarea
                  id="chat-composer"
                  rows={1}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={onKey}
                  placeholder={`Message ${active.name.split(" ")[0]}…`}
                  className="surface-field max-h-32 min-h-10 flex-1 resize-none rounded-field px-3 py-2.5 text-sm outline-none placeholder:text-subtle focus:bg-field-focus"
                />
                <Button type="submit" variant="accent" disabled={!draft.trim()} aria-label="Send message">
                  <svg viewBox="0 0 24 24" className="size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M21 3 10 14M21 3l-7 18-4-7-7-4z" />
                  </svg>
                  <span className="hidden sm:inline">Send</span>
                </Button>
              </form>
            </>
          ) : (
            <EmptyState title="No conversation open" description="Pick someone from the list to start chatting." className="m-auto" />
          )}
        </section>
      </div>
    </div>
  );
}
