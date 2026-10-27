"use client";

import { useId, useState } from "react";

import { cn } from "@/registry/kit/lib/utils";
import { Avatar } from "@/registry/kit/ui/avatar";
import { Badge } from "@/registry/kit/ui/badge";
import { Button } from "@/registry/kit/ui/button";
import { Input } from "@/registry/kit/ui/field";
import { Progress } from "@/registry/kit/ui/progress";
import { SearchInput } from "@/registry/kit/ui/search-input";
import { SegmentedControl } from "@/registry/kit/ui/segmented-control";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/registry/kit/ui/select";
import { EmptyState } from "@/registry/kit/ui/states";
import { toast } from "@/registry/kit/ui/toast";
import { PageHeader } from "@/registry/kit/ui/page-header";

export interface TeamMember {
  id: string;
  name: string;
  title: string;
  team: string;
  /** Local time, e.g. "09:14". */
  localTime: string;
  city: string;
  presence: "online" | "away" | "offline";
  avatar?: string;
}

export interface PendingInvite {
  id: string;
  email: string;
  role: string;
  /** Who sent it and when, e.g. "Sent by Lukas · 2 days ago". */
  sent: string;
  expiresIn: string;
}

export const sampleTeam: TeamMember[] = [
  { id: "m1", name: "Amara Okafor", title: "Head of product", team: "Product", localTime: "13:32", city: "Lagos", presence: "online" },
  { id: "m2", name: "Lukas Brandt", title: "Staff engineer", team: "Engineering", localTime: "14:32", city: "Berlin", presence: "online" },
  { id: "m3", name: "Priya Raman", title: "Lead product designer", team: "Design", localTime: "13:32", city: "Lisbon", presence: "away" },
  { id: "m4", name: "Mateo Alvarez", title: "Backend engineer", team: "Engineering", localTime: "09:32", city: "Bogotá", presence: "online" },
  { id: "m5", name: "Leila Haddad", title: "Support lead", team: "Support", localTime: "15:32", city: "Beirut", presence: "offline" },
  { id: "m6", name: "Sofía Herrera", title: "Product designer", team: "Design", localTime: "14:32", city: "Madrid", presence: "online" },
  { id: "m7", name: "Kwame Mensah", title: "Frontend engineer", team: "Engineering", localTime: "12:32", city: "Accra", presence: "away" },
  { id: "m8", name: "Noah Lindqvist", title: "Product manager", team: "Product", localTime: "14:32", city: "Stockholm", presence: "offline" },
  { id: "m9", name: "Elif Demir", title: "Design engineer", team: "Design", localTime: "15:32", city: "Istanbul", presence: "online" },
];

export const samplePendingInvites: PendingInvite[] = [
  { id: "i1", email: "hana.sato@northwind.io", role: "Viewer", sent: "Sent by Amara · 2 days ago", expiresIn: "Expires in 5 days" },
  { id: "i2", email: "rohan@northwind.io", role: "Editor", sent: "Sent by Lukas · 6 days ago", expiresIn: "Expires tomorrow" },
  { id: "i3", email: "g.oneill@contractor.dev", role: "Viewer", sent: "Sent by Noah · 3 h ago", expiresIn: "Expires in 7 days" },
];

const presenceMeta = {
  online: { label: "Online", dot: "bg-success" },
  away: { label: "Away", dot: "bg-warning" },
  offline: { label: "Offline", dot: "bg-fg/30" },
};

const tints = ["bg-accent/15 text-accent", "bg-info/15 text-info", "bg-warning/15 text-warning", "bg-success/15 text-success"];

export interface TeamScreenProps {
  members?: TeamMember[];
  invites?: PendingInvite[];
  /** Seats paid for on the current plan. */
  seats?: number;
  /** Where "Add seats" goes. */
  billingHref?: string;
  className?: string;
}

/** Team overview: seat usage, a searchable member grid filtered by team, and pending invites with resend and revoke. */
export function TeamScreen({
  members = sampleTeam,
  invites = samplePendingInvites,
  seats = 15,
  billingHref = "#/app/settings/billing",
  className,
}: TeamScreenProps) {
  const [query, setQuery] = useState("");
  const [team, setTeam] = useState("all");
  const [pending, setPending] = useState(invites);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Editor");
  const [error, setError] = useState<string>();
  const roleLabel = useId();

  const teams = ["all", ...new Set(members.map((m) => m.team))];
  const visible = members.filter(
    (m) =>
      (team === "all" || m.team === team) &&
      `${m.name} ${m.title} ${m.city}`.toLowerCase().includes(query.trim().toLowerCase()),
  );
  const used = members.length + pending.length;
  const online = members.filter((m) => m.presence === "online").length;

  function invite(event: React.FormEvent) {
    event.preventDefault();
    const value = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) return setError("Enter a full email address, like name@company.com.");
    if (pending.some((i) => i.email === value)) return setError("There's already a pending invite for this address.");
    if (used >= seats) return setError("No seats left. Add seats first, then send the invite.");
    setPending((list) => [{ id: `i${Date.now()}`, email: value, role, sent: "Sent by you · just now", expiresIn: "Expires in 7 days" }, ...list]);
    setEmail("");
    setError(undefined);
    toast.success(`Invite sent to ${value}.`);
  }

  return (
    <div className={cn("grid min-w-0 grid-cols-1 gap-6", className)}>
      <PageHeader title="Team" description={`${members.length} members · ${online} online now`} />

      <div className="grid min-w-0 grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <section className="surface grid gap-4 rounded-card p-5 md:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="font-semibold">Seat usage</h3>
              <p className="mt-1 text-sm text-muted">Pending invites hold a seat until they expire or you revoke them.</p>
            </div>
            <a
              href={billingHref}
              className="rounded-control px-3 py-1.5 text-sm font-medium text-accent outline-none hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-accent"
            >
              Add seats
            </a>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-semibold tabular-nums">{used}</span>
            <span className="text-muted">of {seats} seats used</span>
          </div>
          <Progress
            value={used}
            max={seats}
            aria-label="Seats used"
            tone={used / seats > 0.9 ? "warning" : "accent"}
          />
          <dl className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
            <div className="flex gap-1.5">
              <dt className="text-muted">Members</dt>
              <dd className="tabular-nums">{members.length}</dd>
            </div>
            <div className="flex gap-1.5">
              <dt className="text-muted">Pending</dt>
              <dd className="tabular-nums">{pending.length}</dd>
            </div>
            <div className="flex gap-1.5">
              <dt className="text-muted">Free</dt>
              <dd className="tabular-nums">{Math.max(seats - used, 0)}</dd>
            </div>
          </dl>
        </section>

        <section className="surface rounded-card p-5 md:p-6">
          <h3 className="font-semibold">Invite someone</h3>
          <form onSubmit={invite} noValidate className="mt-4 grid gap-3">
            <Input
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(undefined);
              }}
              error={error}
            />
            <div className="flex gap-2">
              <span id={roleLabel} className="sr-only">
                Role
              </span>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger aria-labelledby={roleLabel} className="flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Editor">Editor</SelectItem>
                  <SelectItem value="Viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
              <Button type="submit" variant="accent" className="h-11">
                Send invite
              </Button>
            </div>
          </form>
        </section>
      </div>


      <section className="grid min-w-0 grid-cols-1 gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg font-semibold">Members</h3>
          <div className="flex w-full flex-wrap items-center gap-2 md:w-auto">
            <SearchInput label="Search members" value={query} onValueChange={setQuery} className="min-w-0 flex-1 md:w-60 md:flex-none" />
            <div className="-mx-1 max-w-full overflow-x-auto px-1 py-0.5">
              <SegmentedControl
                aria-label="Filter by team"
                value={team}
                onValueChange={setTeam}
                options={teams.map((t) => ({ value: t, label: t === "all" ? "All" : t }))}
              />
            </div>
          </div>
        </div>
        {visible.length ? (
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {visible.map((m, i) => (
              <li key={m.id} className="surface flex flex-col gap-4 rounded-card p-5">
                <div className="flex items-center gap-3">
                  <span className="relative shrink-0">
                    <Avatar src={m.avatar} alt={m.name} size="lg" fallbackClassName={cn("font-semibold", tints[i % tints.length])} />
                    <span
                      aria-hidden
                      className={cn("absolute right-0 bottom-0 size-3 rounded-full ring-2 ring-bg", presenceMeta[m.presence].dot)}
                    />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-medium">{m.name}</p>
                    <p className="truncate text-sm text-muted">{m.title}</p>
                    <p className="sr-only">{presenceMeta[m.presence].label}</p>
                  </div>
                </div>
                <div className="mt-auto flex items-center justify-between gap-2 text-sm">
                  <Badge variant="surface">{m.team}</Badge>
                  <span className="text-muted">
                    {m.city} · <span className="tabular-nums">{m.localTime}</span>
                  </span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            title="No one matches"
            description={`Nobody in ${team === "all" ? "the workspace" : team} matches “${query}”.`}
            action={
              <Button
                size="sm"
                onClick={() => {
                  setQuery("");
                  setTeam("all");
                }}
              >
                Clear search
              </Button>
            }
          />
        )}
      </section>

      <section className="grid min-w-0 grid-cols-1 gap-3">
        <h3 className="text-lg font-semibold">
          Pending invites <span className="font-normal text-muted">· {pending.length}</span>
        </h3>
        {pending.length ? (
          <ul className="surface divide-y divide-line rounded-card">
            {pending.map((inv) => (
              <li key={inv.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-4">
                <div className="min-w-0 flex-1 basis-56">
                  <p className="truncate font-medium">{inv.email}</p>
                  <p className="text-xs text-muted">
                    {inv.role} · {inv.sent} · <span className={cn(inv.expiresIn.includes("tomorrow") && "text-warning")}>{inv.expiresIn}</span>
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setPending((list) => list.map((i) => (i.id === inv.id ? { ...i, sent: "Resent by you · just now", expiresIn: "Expires in 7 days" } : i)));
                      toast.success(`Resent the invite to ${inv.email}.`);
                    }}
                  >
                    Resend
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    aria-label={`Revoke invite for ${inv.email}`}
                    onClick={() => {
                      setPending((list) => list.filter((i) => i.id !== inv.id));
                      toast.success(`Revoked the invite to ${inv.email}. The seat is free again.`);
                    }}
                  >
                    Revoke
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState size="compact" title="No pending invites" description="Everyone you invited has joined." />
        )}
      </section>
    </div>
  );
}
