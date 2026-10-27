"use client";

import { useState, type FormEvent, type ReactNode } from "react";

import { cn } from "@/registry/kit/lib/utils";
import { Avatar } from "@/registry/kit/ui/avatar";
import { Badge } from "@/registry/kit/ui/badge";
import { Button, buttonVariants } from "@/registry/kit/ui/button";
import { ChartBar } from "@/registry/kit/ui/chart-bar";
import { Textarea } from "@/registry/kit/ui/field";
import { StatCard } from "@/registry/kit/ui/stat-card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/registry/kit/ui/table";
import { PageHeader } from "@/registry/kit/ui/page-header";

export interface CustomerOrder {
  id: string;
  number: string;
  /** ISO date. */
  date: string;
  items: number;
  total: number;
  status: "fulfilled" | "unfulfilled" | "refunded";
}

export interface CustomerNote {
  id: string;
  author: string;
  text: string;
  date: string;
}

export interface CustomerProfile {
  name: string;
  email: string;
  phone: string;
  location: string;
  since: string;
  tags: string[];
  marketing: boolean;
  orders: CustomerOrder[];
  /** Spend per month, oldest first, matching `months`. */
  monthlySpend: number[];
  months: string[];
  notes: CustomerNote[];
}

export const sampleCustomerProfile: CustomerProfile = {
  name: "Jonas Lindqvist",
  email: "jonas@lindqvist.se",
  phone: "+46 70 482 19 33",
  location: "Malmö, Sweden",
  since: "March 2024",
  tags: ["VIP", "Wholesale lead", "Prefers DHL"],
  marketing: true,
  orders: [
    { id: "o1", number: "#5097", date: "2026-10-21", items: 3, total: 311.75, status: "unfulfilled" },
    { id: "o2", number: "#5031", date: "2026-09-14", items: 1, total: 189, status: "fulfilled" },
    { id: "o3", number: "#4968", date: "2026-08-02", items: 4, total: 246.3, status: "fulfilled" },
    { id: "o4", number: "#4882", date: "2026-06-19", items: 2, total: 82.5, status: "refunded" },
    { id: "o5", number: "#4815", date: "2026-05-07", items: 5, total: 403.1, status: "fulfilled" },
    { id: "o6", number: "#4741", date: "2026-03-28", items: 2, total: 136, status: "fulfilled" },
  ],
  months: ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"],
  monthlySpend: [214.6, 487.2, 0, 92.4, 136, 58.25, 403.1, 82.5, 0, 246.3, 189, 311.75],
  notes: [
    { id: "n1", author: "Mira (support)", text: "Asked about bulk pricing for his studio, about 40 tees a quarter. Sent the wholesale sheet.", date: "Sep 16" },
  ],
};

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const shortDate = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
const statusMeta = {
  fulfilled: { label: "Fulfilled", variant: "success" },
  unfulfilled: { label: "Unfulfilled", variant: "warning" },
  refunded: { label: "Refunded", variant: "outline" },
} as const;

function Panel({ title, action, children, className }: { title: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={cn("surface rounded-card p-5 md:p-6", className)}>
      <div className="mb-5 flex items-center justify-between gap-3">
        <h3 className="text-sm font-medium text-fg/85">{title}</h3>
        {action}
      </div>
      {children}
    </section>
  );
}

export interface CustomerDetailScreenProps {
  customer?: CustomerProfile;
  /** Order numbers link to `${orderHref}/${id}`. */
  orderHref?: string;
  className?: string;
}

/** One customer: profile and tags, lifetime value tiles, spend by month, order history and internal notes. */
export function CustomerDetailScreen({ customer = sampleCustomerProfile, orderHref = "#/app/orders", className }: CustomerDetailScreenProps) {
  const [notes, setNotes] = useState(customer.notes);
  const [draft, setDraft] = useState("");
  const [marketing, setMarketing] = useState(customer.marketing);

  const paid = customer.orders.filter((o) => o.status !== "refunded");
  const lifetime = paid.reduce((sum, o) => sum + o.total, 0);
  const aov = lifetime / Math.max(paid.length, 1);

  function addNote(e: FormEvent) {
    e.preventDefault();
    if (!draft.trim()) return;
    setNotes((n) => [{ id: `n${n.length + 1}`, author: "You", text: draft.trim(), date: "Just now" }, ...n]);
    setDraft("");
  }

  return (
    <div className={cn("grid grid-cols-1 gap-6", className)}>
      <PageHeader
        media={<Avatar size="lg" fallback={customer.name.split(" ").map((w) => w[0]).join("")} alt="" />}
        title={customer.name}
        description={`${customer.location} · Customer since ${customer.since} · ${customer.orders.length} ${customer.orders.length === 1 ? "order" : "orders"}`}
        actions={
          <a href={`mailto:${customer.email}`} className={buttonVariants({ variant: "surface" })}>
            Email {customer.name.split(" ")[0]}
          </a>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Lifetime value" value={lifetime} prefix="$" decimals={2} tone="accent" highlight change={0.214} comparison="vs last year" />
        <StatCard label="Orders" value={customer.orders.length} tone="info" change={0.5} comparison="vs last year" />
        <StatCard label="Average order" value={aov} prefix="$" decimals={2} tone="success" change={-0.047} comparison="vs last year" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
        <div className="grid min-w-0 grid-cols-1 content-start gap-6">
          <Panel title="Spend by month">
            <ChartBar labels={customer.months} series={[{ name: "Spend", values: customer.monthlySpend }]} label={`${customer.name}'s spend by month`} height={200} formatValue={(v) => usd.format(v)} />
          </Panel>

          <Panel title="Orders">
            <Table frame={false}>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customer.orders.map((o) => (
                  <TableRow key={o.id}>
                    <TableCell>
                      <a href={`${orderHref}/${o.id}`} className="font-medium tabular-nums hover:text-accent">
                        {o.number}
                      </a>
                      <span className="ml-2 text-xs text-muted">{o.items} {o.items === 1 ? "item" : "items"}</span>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-muted">{shortDate.format(new Date(`${o.date}T00:00:00Z`))}</TableCell>
                    <TableCell>
                      <Badge variant={statusMeta[o.status].variant}>{statusMeta[o.status].label}</Badge>
                    </TableCell>
                    <TableCell className={cn("text-right tabular-nums", o.status === "refunded" && "text-muted line-through")}>{usd.format(o.total)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Panel>
        </div>

        <div className="grid grid-cols-1 content-start gap-6">
          <Panel title="Contact">
            <dl className="grid grid-cols-1 gap-4 text-sm">
              <div>
                <dt className="text-muted">Email</dt>
                <dd className="mt-1 truncate">{customer.email}</dd>
              </div>
              <div>
                <dt className="text-muted">Phone</dt>
                <dd className="mt-1 tabular-nums">{customer.phone}</dd>
              </div>
              <div>
                <dt className="text-muted">Marketing</dt>
                <dd className="mt-1 flex items-center justify-between gap-3">
                  <span>{marketing ? "Subscribed to email" : "Not subscribed"}</span>
                  <Button size="sm" variant="ghost" onClick={() => setMarketing((m) => !m)}>
                    {marketing ? "Unsubscribe" : "Subscribe"}
                  </Button>
                </dd>
              </div>
            </dl>
            <div className="mt-5 flex flex-wrap gap-2">
              {customer.tags.map((t) => (
                <Badge key={t} variant={t === "VIP" ? "accent" : "surface"}>
                  {t}
                </Badge>
              ))}
            </div>
          </Panel>

          <Panel title="Notes">
            <form onSubmit={addNote} className="grid grid-cols-1 gap-3">
              <Textarea label="Add a note for your team" rows={3} value={draft} onChange={(e) => setDraft(e.target.value)} />
              <Button type="submit" size="sm" className="justify-self-end" disabled={!draft.trim()}>
                Save note
              </Button>
            </form>
            {notes.length === 0 ? (
              <p className="mt-4 text-sm text-muted">No notes yet. Notes are only visible to your team.</p>
            ) : (
              <ul className="mt-5 grid grid-cols-1 gap-4">
                {notes.map((n) => (
                  <li key={n.id} className="border-l-2 border-line pl-3">
                    <p className="text-sm leading-relaxed">{n.text}</p>
                    <p className="mt-1 text-xs text-muted">
                      {n.author} · {n.date}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>
      </div>
    </div>
  );
}
