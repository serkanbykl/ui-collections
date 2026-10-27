"use client";

import { useState } from "react";

import { cn } from "@/registry/kit/lib/utils";
import { ChipGroup } from "@/registry/kit/ui/chip";
import { Badge } from "@/registry/kit/ui/badge";
import { Button, buttonVariants } from "@/registry/kit/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/registry/kit/ui/dropdown-menu";
import { EmptyState } from "@/registry/kit/ui/states";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/registry/kit/ui/table";
import { toast } from "@/registry/kit/ui/toast";
import { PageHeader } from "@/registry/kit/ui/page-header";

export type InvoiceStatus = "paid" | "open" | "overdue" | "draft";

export interface Invoice {
  id: string;
  number: string;
  client: string;
  /** ISO dates. */
  issued: string;
  due: string;
  amount: number;
  status: InvoiceStatus;
}

const statusMeta: Record<InvoiceStatus, { label: string; variant: "success" | "info" | "danger" | "outline" }> = {
  paid: { label: "Paid", variant: "success" },
  open: { label: "Open", variant: "info" },
  overdue: { label: "Overdue", variant: "danger" },
  draft: { label: "Draft", variant: "outline" },
};

export const sampleInvoices: Invoice[] = [
  { id: "inv_1", number: "INV-2026-0418", client: "Halden & Moss Architects", issued: "2026-10-20", due: "2026-11-19", amount: 4820, status: "open" },
  { id: "inv_2", number: "INV-2026-0417", client: "Northwind Coffee Roasters", issued: "2026-10-14", due: "2026-10-28", amount: 1265.5, status: "open" },
  { id: "inv_3", number: "INV-2026-0416", client: "Brightline Physio", issued: "2026-10-02", due: "2026-10-16", amount: 940, status: "overdue" },
  { id: "inv_4", number: "INV-2026-0415", client: "Okafor Studio", issued: "2026-09-29", due: "2026-10-29", amount: 7350, status: "paid" },
  { id: "inv_5", number: "INV-2026-0414", client: "Lindqvist Design AB", issued: "2026-09-22", due: "2026-10-06", amount: 2187.25, status: "overdue" },
  { id: "inv_6", number: "INV-2026-0413", client: "Tidewater Books", issued: "2026-09-18", due: "2026-10-18", amount: 615, status: "paid" },
  { id: "inv_7", number: "INV-2026-0412", client: "Marino & Figli", issued: "2026-09-09", due: "2026-10-09", amount: 3092.8, status: "paid" },
  { id: "inv_8", number: "INV-2026-0419", client: "Coastal Kayak Co.", issued: "2026-10-24", due: "2026-11-23", amount: 1480, status: "draft" },
  { id: "inv_9", number: "INV-2026-0411", client: "Halden & Moss Architects", issued: "2026-08-30", due: "2026-09-29", amount: 5210, status: "paid" },
];

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const shortDate = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
const fmt = (iso: string) => shortDate.format(new Date(`${iso}T00:00:00Z`));

type Filter = "all" | InvoiceStatus;

export interface InvoicesScreenProps {
  invoices?: Invoice[];
  /** Invoice numbers link to `${previewHref}/${id}`. */
  previewHref?: string;
  /** Where "New invoice" goes. */
  newHref?: string;
  className?: string;
}

/** Invoice list with totals by status, filter chips, per-row actions (mark paid, remind, void) and an empty state. */
export function InvoicesScreen({ invoices = sampleInvoices, previewHref = "#/app/invoices", newHref = "#/app/invoices/new", className }: InvoicesScreenProps) {
  const [rows, setRows] = useState(invoices);
  const [filter, setFilter] = useState<Filter>("all");

  const sum = (s: InvoiceStatus) => rows.filter((r) => r.status === s).reduce((t, r) => t + r.amount, 0);
  const count = (s: InvoiceStatus) => rows.filter((r) => r.status === s).length;
  const visible = filter === "all" ? rows : rows.filter((r) => r.status === filter);

  const summary = [
    { key: "open", label: "Outstanding", value: sum("open"), note: `${count("open")} invoices awaiting payment`, tone: "text-fg" },
    { key: "overdue", label: "Overdue", value: sum("overdue"), note: `${count("overdue")} past their due date`, tone: "text-danger" },
    { key: "paid", label: "Paid", value: sum("paid"), note: `${count("paid")} settled since Sep 1`, tone: "text-success" },
  ] as const;

  function update(id: string, status: InvoiceStatus, message: string) {
    setRows((all) => all.map((r) => (r.id === id ? { ...r, status } : r)));
    toast.success(message);
  }

  return (
    <div className={cn("grid grid-cols-1 gap-6", className)}>
      <PageHeader
        title="Invoices"
        description={`${rows.length} invoices · ${count("open")} awaiting payment · ${count("overdue")} overdue`}
        actions={
          <a href={newHref} className={buttonVariants({ variant: "accent" })}>
            New invoice
          </a>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {summary.map((s) => (
          <button
            key={s.key}
            type="button"
            onClick={() => setFilter(filter === s.key ? "all" : s.key)}
            aria-pressed={filter === s.key}
            className={cn(
              "surface lift cursor-pointer rounded-card p-5 text-left",
              filter === s.key && "bg-surface-selected ring-1 ring-accent/50",
            )}
          >
            <span className="text-sm text-muted">{s.label}</span>
            <span className={cn("mt-2 block text-3xl font-semibold tracking-tight tabular-nums", s.tone)}>{usd.format(s.value)}</span>
            <span className="mt-1 block text-xs text-muted">{s.note}</span>
          </button>
        ))}
      </div>

      <ChipGroup
        label="Filter by status"
        scroll
        value={filter}
        onValueChange={(v) => setFilter((v ?? "all") as Filter)}
        options={(["all", "open", "overdue", "paid", "draft"] as Filter[]).map((f) => ({
          value: f,
          label: f === "all" ? "All" : statusMeta[f].label,
          count: f === "all" ? rows.length : count(f),
        }))}
      />

      {visible.length === 0 ? (
        <div className="surface rounded-card">
          <EmptyState
            title={`No ${filter === "all" ? "" : statusMeta[filter].label.toLowerCase() + " "}invoices`}
            description="When an invoice reaches this status it shows up here."
            action={
              <Button size="sm" onClick={() => setFilter("all")}>
                Show all invoices
              </Button>
            }
          />
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Issued</TableHead>
              <TableHead>Due</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="w-12">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visible.map((inv) => (
              <TableRow key={inv.id}>
                <TableCell>
                  <a href={`${previewHref}/${inv.id}`} className="font-mono text-xs whitespace-nowrap hover:text-accent">
                    {inv.number}
                  </a>
                </TableCell>
                <TableCell className="min-w-44 font-medium">{inv.client}</TableCell>
                <TableCell className="whitespace-nowrap text-muted">{fmt(inv.issued)}</TableCell>
                <TableCell className={cn("whitespace-nowrap", inv.status === "overdue" ? "text-danger" : "text-muted")}>{fmt(inv.due)}</TableCell>
                <TableCell>
                  <Badge variant={statusMeta[inv.status].variant} dot>
                    {statusMeta[inv.status].label}
                  </Badge>
                </TableCell>
                <TableCell className="text-right tabular-nums">{usd.format(inv.amount)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon-sm" variant="ghost" aria-label={`Actions for ${inv.number}`}>
                        <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden>
                          <circle cx="5" cy="12" r="1.75" />
                          <circle cx="12" cy="12" r="1.75" />
                          <circle cx="19" cy="12" r="1.75" />
                        </svg>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <a href={`${previewHref}/${inv.id}`}>View invoice</a>
                      </DropdownMenuItem>
                      {inv.status === "draft" && (
                        <DropdownMenuItem onSelect={() => update(inv.id, "open", `Sent ${inv.number} to ${inv.client}.`)}>Send invoice</DropdownMenuItem>
                      )}
                      {(inv.status === "open" || inv.status === "overdue") && (
                        <DropdownMenuItem onSelect={() => update(inv.id, "paid", `Marked ${inv.number} as paid. ${usd.format(inv.amount)} moved to Paid.`)}>
                          Mark as paid
                        </DropdownMenuItem>
                      )}
                      {inv.status === "overdue" && (
                        <DropdownMenuItem onSelect={() => toast.success(`Sent a payment reminder for ${inv.number} to ${inv.client}.`)}>Send reminder</DropdownMenuItem>
                      )}
                      {inv.status !== "paid" && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-danger"
                            onSelect={() => {
                              setRows((all) => all.filter((r) => r.id !== inv.id));
                              toast.success(`Voided ${inv.number}. It no longer counts toward your totals.`);
                            }}
                          >
                            Void invoice
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
