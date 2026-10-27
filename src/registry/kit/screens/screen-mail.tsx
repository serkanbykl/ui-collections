"use client";

import { useMemo, useState, type FormEvent } from "react";

import { cn } from "@/registry/kit/lib/utils";
import { Avatar } from "@/registry/kit/ui/avatar";
import { Badge } from "@/registry/kit/ui/badge";
import { Button } from "@/registry/kit/ui/button";
import { Input, Textarea } from "@/registry/kit/ui/field";
import { SearchInput } from "@/registry/kit/ui/search-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/registry/kit/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/registry/kit/ui/sheet";
import { EmptyState } from "@/registry/kit/ui/states";
import { toast } from "@/registry/kit/ui/toast";
import { PageHeader } from "@/registry/kit/ui/page-header";

export type MailFolder = "inbox" | "starred" | "sent" | "drafts" | "archive" | "trash";

export interface MailMessage {
  id: string;
  folder: Exclude<MailFolder, "starred">;
  from: { name: string; email: string };
  to?: string;
  subject: string;
  preview: string;
  body: string[];
  time: string;
  date: string;
  unread?: boolean;
  starred?: boolean;
  label?: { text: string; tone: "accent" | "info" | "warning" | "success" | "danger" };
}

const folderLabels: Record<MailFolder, string> = {
  inbox: "Inbox",
  starred: "Starred",
  sent: "Sent",
  drafts: "Drafts",
  archive: "Archive",
  trash: "Trash",
};

const icon = (d: string) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="size-4 shrink-0">
    <path d={d} />
  </svg>
);

const folderIcons: Record<MailFolder, string> = {
  inbox: "M3 13l3-8h12l3 8v6H3zM3 13h5l1 2h6l1-2h5",
  starred: "m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.5 2.9 1.1-6.1L3.2 9.5l6.1-.9z",
  sent: "M21 3 10 14M21 3l-7 18-4-7-7-4z",
  drafts: "M4 20h4L19 9l-4-4L4 16zM14 6l4 4",
  archive: "M3 5h18v4H3zM5 9v10h14V9M10 13h4",
  trash: "M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3",
};

export const defaultMessages: MailMessage[] = [
  {
    id: "m1",
    folder: "inbox",
    from: { name: "Priya Raman", email: "priya@northwind.io" },
    subject: "Funnel drop at the pricing step",
    preview: "The checkout funnel lost 14.6% at /pricing since Thursday's deploy…",
    body: [
      "Hi Ada,",
      "The checkout funnel lost 14.6% at /pricing since Thursday's deploy. Mobile Safari accounts for 71% of the drop, so I suspect the new plan switcher.",
      "Could you pull the session counts per browser for the last 7 days? I'd like to confirm before we roll back.",
      "Thanks,\nPriya",
    ],
    time: "09:42",
    date: "Mon, 26 Oct",
    unread: true,
    label: { text: "Funnels", tone: "warning" },
  },
  {
    id: "m2",
    folder: "inbox",
    from: { name: "Tomás Ferreira", email: "tomas@kitebase.dev" },
    subject: "Invoice INV-20481 for October",
    preview: "Your invoice for the Growth plan (1,000,000 events) is ready…",
    body: [
      "Hello,",
      "Your invoice INV-20481 for the Growth plan is ready. Total: €289.00, due on 9 November.",
      "You can download the PDF from Billing → Invoices.",
      "— Tomás, Kitebase finance",
    ],
    time: "08:15",
    date: "Mon, 26 Oct",
    unread: true,
    label: { text: "Billing", tone: "info" },
  },
  {
    id: "m3",
    folder: "inbox",
    from: { name: "Hana Sato", email: "hana@orbitly.app" },
    subject: "Re: Custom events for onboarding",
    preview: "That worked. We now track signup_step_completed with 4 properties…",
    body: [
      "That worked. We now track signup_step_completed with four properties, and the funnel finally matches what support sees.",
      "One question: can we rename an event without losing its history?",
    ],
    time: "Sun",
    date: "Sun, 25 Oct",
    starred: true,
  },
  {
    id: "m4",
    folder: "inbox",
    from: { name: "Lumen status", email: "status@lumen.app" },
    subject: "Resolved: delayed ingestion in eu-west",
    preview: "Events sent between 02:14 and 02:51 UTC were delayed by up to 9 minutes…",
    body: [
      "Events sent between 02:14 and 02:51 UTC were delayed by up to 9 minutes. No data was lost and dashboards have caught up.",
      "Full incident report: status.lumen.app/incidents/1182",
    ],
    time: "Sat",
    date: "Sat, 24 Oct",
    label: { text: "Status", tone: "success" },
  },
  {
    id: "m5",
    folder: "inbox",
    from: { name: "Marcus Ode", email: "marcus@polaris.co" },
    subject: "Quarterly review deck",
    preview: "Attached the Q3 numbers. Retention at day 30 went from 31.2% to 38.7%…",
    body: ["Attached the Q3 numbers. Retention at day 30 went from 31.2% to 38.7%. Can we go through it on Thursday at 14:30?"],
    time: "23 Oct",
    date: "Fri, 23 Oct",
  },
  {
    id: "m6",
    folder: "sent",
    from: { name: "Ada Kaya", email: "ada@lumen.app" },
    to: "hana@orbitly.app",
    subject: "Custom events for onboarding",
    preview: "Here's the snippet for tracking each onboarding step…",
    body: ["Here's the snippet for tracking each onboarding step. Send me a screenshot of the live events view once it fires."],
    time: "22 Oct",
    date: "Thu, 22 Oct",
  },
  {
    id: "m7",
    folder: "drafts",
    from: { name: "Ada Kaya", email: "ada@lumen.app" },
    to: "team@lumen.app",
    subject: "Release notes 4.12",
    preview: "Draft: Saved segments, faster exports and a new retention view…",
    body: ["Draft: Saved segments, faster exports and a new retention view."],
    time: "21 Oct",
    date: "Wed, 21 Oct",
  },
];

const inFolder = (m: MailMessage, f: MailFolder) => (f === "starred" ? m.starred && m.folder !== "trash" : m.folder === f);

export interface MailScreenProps {
  messages?: MailMessage[];
  /** Address shown as the sender of new mail. */
  me?: { name: string; email: string };
}

/** Inbox with folders, a searchable list, a reading pane and a compose sheet. One pane at a time on small screens. */
export function MailScreen({ messages: initial = defaultMessages, me = { name: "Ada Kaya", email: "ada@lumen.app" } }: MailScreenProps) {
  const [messages, setMessages] = useState(initial);
  const [folder, setFolder] = useState<MailFolder>("inbox");
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [compose, setCompose] = useState<{ open: boolean; to: string; subject: string; body: string }>({
    open: false,
    to: "",
    subject: "",
    body: "",
  });
  const [toError, setToError] = useState("");
  const [sending, setSending] = useState(false);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return messages.filter(
      (m) =>
        inFolder(m, folder) &&
        (!q || `${m.from.name} ${m.subject} ${m.preview}`.toLowerCase().includes(q)),
    );
  }, [messages, folder, query]);
  const open = messages.find((m) => m.id === openId) ?? null;
  const unread = (f: MailFolder) => messages.filter((m) => inFolder(m, f) && m.unread).length;

  const update = (id: string, patch: Partial<MailMessage>) =>
    setMessages((all) => all.map((m) => (m.id === id ? { ...m, ...patch } : m)));

  function select(id: string) {
    setOpenId(id);
    update(id, { unread: false });
  }

  function move(id: string, to: MailMessage["folder"], message: string) {
    update(id, { folder: to });
    setOpenId(null);
    toast.success(message);
  }

  function startCompose(prefill?: Partial<typeof compose>) {
    setToError("");
    setCompose({ open: true, to: "", subject: "", body: "", ...prefill });
  }

  function send(e: FormEvent) {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(compose.to.trim())) {
      setToError("Enter an address like name@company.com.");
      return;
    }
    setSending(true);
    setTimeout(() => {
      setMessages((all) => [
        {
          id: `m${Date.now()}`,
          folder: "sent",
          from: me,
          to: compose.to.trim(),
          subject: compose.subject.trim() || "(no subject)",
          preview: compose.body.slice(0, 90),
          body: compose.body.split("\n").filter(Boolean),
          time: "Now",
          date: "Today",
        },
        ...all,
      ]);
      setSending(false);
      setCompose((c) => ({ ...c, open: false }));
      toast.success(`Message sent to ${compose.to.trim()}.`);
    }, 700);
  }

  const folders = Object.keys(folderLabels) as MailFolder[];

  return (
    <div className="grid min-w-0 grid-cols-1 gap-6">
      <PageHeader
        title="Mail"
        description={`${unread("inbox")} unread in Inbox · ${messages.filter((m) => m.starred).length} starred`}
      />
      <div className="grid gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="accent" onClick={() => startCompose()}>
            {icon("M12 5v14M5 12h14")}
            Compose
          </Button>
          <div className="w-44 lg:hidden">
            <Select
              value={folder}
              onValueChange={(v) => {
                setFolder(v as MailFolder);
                setOpenId(null);
              }}
            >
              <SelectTrigger aria-label="Folder">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {folders.map((f) => (
                  <SelectItem key={f} value={f}>
                    {folderLabels[f]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[12rem_minmax(0,20rem)_minmax(0,1fr)]">
          <nav aria-label="Mail folders" className="hidden lg:block">
            <ul className="grid gap-0.5">
              {folders.map((f) => {
                const count = unread(f);
                return (
                  <li key={f}>
                    <button
                      type="button"
                      onClick={() => {
                        setFolder(f);
                        setOpenId(null);
                      }}
                      aria-current={folder === f ? "page" : undefined}
                      className={cn(
                        "flex h-10 w-full items-center gap-3 rounded-control px-3 text-left text-sm text-muted transition-colors hover:bg-surface-hover hover:text-fg",
                        "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent",
                        folder === f && "bg-accent/12 font-medium text-accent hover:bg-accent/12 hover:text-accent",
                      )}
                    >
                      {icon(folderIcons[f])}
                      <span className="flex-1">{folderLabels[f]}</span>
                      {count > 0 && <Badge variant="accent-solid">{count}</Badge>}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          <section aria-label={`${folderLabels[folder]} messages`} className={cn("surface min-w-0 rounded-card p-3", open && "hidden lg:block")}>
            <SearchInput value={query} onValueChange={setQuery} label="Search mail" placeholder="Search mail…" className="mb-3" />
            {visible.length === 0 ? (
              <EmptyState
                size="compact"
                title={query ? "No messages match" : `${folderLabels[folder]} is empty`}
                description={query ? "Try a sender's name or a word from the subject." : "Messages you move here will show up in this list."}
              />
            ) : (
              <ul className="grid gap-1">
                {visible.map((m) => (
                  <li key={m.id} className="relative">
                    <button
                      type="button"
                      onClick={() => select(m.id)}
                      aria-current={m.id === openId ? "true" : undefined}
                      className={cn(
                        "grid w-full grid-cols-[auto_minmax(0,1fr)] gap-3 rounded-field p-3 pr-10 text-left transition-colors hover:bg-surface-hover",
                        "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent",
                        m.id === openId && "bg-surface-selected",
                      )}
                    >
                      <Avatar alt={m.folder === "sent" || m.folder === "drafts" ? m.to ?? "" : m.from.name} size="sm" />
                      <span className="min-w-0">
                        <span className="flex items-baseline justify-between gap-2">
                          <span className={cn("truncate text-sm", m.unread ? "font-semibold text-fg" : "text-fg/85")}>
                            {m.folder === "sent" || m.folder === "drafts" ? `To ${m.to}` : m.from.name}
                          </span>
                          <span className="shrink-0 text-xs text-muted">{m.time}</span>
                        </span>
                        <span className={cn("block truncate text-sm", m.unread ? "font-medium text-fg" : "text-fg/80")}>
                          {m.unread && <span className="mr-1.5 inline-block size-1.5 -translate-y-0.5 rounded-full bg-accent" aria-label="Unread" />}
                          {m.subject}
                        </span>
                        <span className="block truncate text-xs text-muted">{m.preview}</span>
                      </span>
                    </button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label={m.starred ? `Unstar ${m.subject}` : `Star ${m.subject}`}
                      aria-pressed={m.starred ?? false}
                      onClick={() => update(m.id, { starred: !m.starred })}
                      className={cn("absolute top-2 right-1", m.starred && "text-warning")}
                    >
                      <svg viewBox="0 0 24 24" className="size-4 shrink-0" fill={m.starred ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" aria-hidden>
                        <path d={folderIcons.starred} />
                      </svg>
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section aria-label="Message" className={cn("surface min-w-0 rounded-card p-5 md:p-6", !open && "hidden lg:block")}>
            {open ? (
              <article className="grid gap-5">
                <div className="flex flex-wrap items-center gap-2">
                  <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setOpenId(null)}>
                    {icon("M15 18l-6-6 6-6")}
                    Back to {folderLabels[folder]}
                  </Button>
                  <div className="ml-auto flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      onClick={() => startCompose({ to: open.from.email, subject: `Re: ${open.subject}`, body: "\n\n" })}
                    >
                      {icon("M9 14 4 9l5-5M4 9h11a5 5 0 0 1 0 10h-1")}
                      Reply
                    </Button>
                    {open.folder !== "archive" && open.folder !== "trash" && (
                      <Button size="sm" variant="ghost" onClick={() => move(open.id, "archive", `Archived “${open.subject}”.`)}>
                        {icon(folderIcons.archive)}
                        Archive
                      </Button>
                    )}
                    {open.folder === "trash" ? (
                      <Button size="sm" variant="ghost" onClick={() => move(open.id, "inbox", `Moved “${open.subject}” back to Inbox.`)}>
                        {icon(folderIcons.inbox)}
                        Restore
                      </Button>
                    ) : (
                      <Button size="sm" variant="ghost" onClick={() => move(open.id, "trash", `Moved “${open.subject}” to Trash.`)}>
                        {icon(folderIcons.trash)}
                        Delete
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" onClick={() => { update(open.id, { unread: true }); setOpenId(null); }}>
                      Mark unread
                    </Button>
                  </div>
                </div>
                <header className="grid gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-semibold text-balance">{open.subject}</h2>
                    {open.label && <Badge variant={open.label.tone}>{open.label.text}</Badge>}
                  </div>
                  <div className="flex items-center gap-3">
                    <Avatar alt={open.from.name} />
                    <div className="min-w-0 text-sm">
                      <p className="font-medium">{open.from.name}</p>
                      <p className="truncate text-muted">
                        {open.from.email}
                        {open.to && <> → {open.to}</>}
                      </p>
                    </div>
                    <time className="ml-auto shrink-0 text-xs text-muted">
                      {open.date}, {open.time}
                    </time>
                  </div>
                </header>
                <div className="grid gap-3 text-sm leading-relaxed text-fg/90">
                  {open.body.map((p, i) => (
                    <p key={i} className="whitespace-pre-line">
                      {p}
                    </p>
                  ))}
                </div>
              </article>
            ) : (
              <EmptyState title="No message selected" description="Choose a message from the list to read it here." />
            )}
          </section>
        </div>

        <Sheet open={compose.open} onOpenChange={(o) => setCompose((c) => ({ ...c, open: o }))}>
          <SheetContent>
            <form onSubmit={send} noValidate className="grid gap-4">
              <SheetHeader>
                <SheetTitle>New message</SheetTitle>
                <SheetDescription>Sent from {me.email}.</SheetDescription>
              </SheetHeader>
              <Input
                label="To"
                type="email"
                value={compose.to}
                error={toError || undefined}
                onChange={(e) => {
                  setToError("");
                  setCompose((c) => ({ ...c, to: e.target.value }));
                }}
              />
              <Input label="Subject" value={compose.subject} onChange={(e) => setCompose((c) => ({ ...c, subject: e.target.value }))} />
              <Textarea label="Message" rows={8} value={compose.body} onChange={(e) => setCompose((c) => ({ ...c, body: e.target.value }))} />
              <SheetFooter>
                <Button type="button" variant="ghost" onClick={() => setCompose((c) => ({ ...c, open: false }))}>
                  Discard
                </Button>
                <Button type="submit" variant="accent" loading={sending}>
                  {sending ? "Sending…" : "Send message"}
                </Button>
              </SheetFooter>
            </form>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
