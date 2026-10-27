"use client";

import { useState } from "react";

import { cn } from "@/registry/kit/lib/utils";
import { Badge } from "@/registry/kit/ui/badge";
import { Button, buttonVariants } from "@/registry/kit/ui/button";
import { toast } from "@/registry/kit/ui/toast";
import { PageHeader } from "@/registry/kit/ui/page-header";

export interface InvoiceParty {
  name: string;
  lines: string[];
  email?: string;
}

export interface InvoiceLine {
  description: string;
  detail?: string;
  quantity: number;
  rate: number;
}

export interface InvoiceDocument {
  number: string;
  status: "paid" | "open" | "overdue" | "draft";
  issued: string;
  due: string;
  from: InvoiceParty;
  to: InvoiceParty;
  lines: InvoiceLine[];
  /** Tax rate as a ratio. */
  taxRate: number;
  currency: string;
  notes: string;
  payment: { label: string; value: string }[];
}

export const sampleInvoiceDocument: InvoiceDocument = {
  number: "INV-2026-0418",
  status: "open",
  issued: "October 20, 2026",
  due: "November 19, 2026",
  from: {
    name: "Lumen Studio LLC",
    lines: ["418 Water Street, Suite 2", "Portland, ME 04101", "EIN 84-3920176"],
    email: "billing@lumen.studio",
  },
  to: {
    name: "Halden & Moss Architects",
    lines: ["Attn: Rasmus Halden", "77 Commercial Wharf", "Boston, MA 02110"],
    email: "accounts@haldenmoss.com",
  },
  lines: [
    { description: "Brand identity refresh", detail: "Logo system, colour and type guidelines", quantity: 1, rate: 2400 },
    { description: "Website design", detail: "Home, studio, 6 project templates", quantity: 32, rate: 85 },
    { description: "Photography retouching", detail: "Project archive, 48 images", quantity: 48, rate: 6.5 },
    { description: "Hosting setup", detail: "Domain, SSL and CDN, first year", quantity: 1, rate: 168 },
  ],
  taxRate: 0.055,
  currency: "USD",
  notes: "Thank you for the work together. Payment is due within 30 days; a 1.5% monthly fee applies to late balances.",
  payment: [
    { label: "Bank", value: "Cascade Federal Credit Union" },
    { label: "Account", value: "•••• 7716" },
    { label: "Routing", value: "211 274 450" },
    { label: "Reference", value: "INV-2026-0418" },
  ],
};

const statusMeta = {
  paid: { label: "Paid", variant: "success" },
  open: { label: "Awaiting payment", variant: "info" },
  overdue: { label: "Overdue", variant: "danger" },
  draft: { label: "Draft", variant: "outline" },
} as const;

export interface InvoicePreviewScreenProps {
  invoice?: InvoiceDocument;
  /** Where "Edit" goes. */
  editHref?: string;
  className?: string;
}

/**
 * A printable invoice. The toolbar hides when printing and the sheet drops its
 * surface for plain black on white, so "Print or save PDF" gives a clean page.
 */
export function InvoicePreviewScreen({ invoice = sampleInvoiceDocument, editHref = "#/app/invoices/edit", className }: InvoicePreviewScreenProps) {
  const [copied, setCopied] = useState(false);
  const money = new Intl.NumberFormat("en-US", { style: "currency", currency: invoice.currency });
  const subtotal = invoice.lines.reduce((sum, l) => sum + l.quantity * l.rate, 0);
  const tax = Math.round(subtotal * invoice.taxRate * 100) / 100;
  const total = subtotal + tax;

  function copyLink() {
    navigator.clipboard?.writeText(`https://pay.lumen.studio/${invoice.number.toLowerCase()}`).catch(() => {});
    setCopied(true);
    toast.success("Payment link copied", { description: "Anyone with the link can pay this invoice by card." });
  }

  return (
    <div className={cn("grid grid-cols-1 gap-6 print:block", className)}>
      <PageHeader
        className="print:hidden"
        title={invoice.number}
        description={
          <>
            <Badge variant={statusMeta[invoice.status].variant} dot className="mr-2 align-middle">
              {statusMeta[invoice.status].label}
            </Badge>
            Billed to {invoice.to.name} · due {invoice.due}
          </>
        }
        actions={
          <>
          <a href={editHref} className={buttonVariants({ variant: "ghost" })}>
            Edit
          </a>
          <Button onClick={copyLink}>{copied ? "Link copied" : "Copy payment link"}</Button>
          <Button variant="accent" onClick={() => window.print()}>
            Print or save PDF
          </Button>
          </>
        }
      />

      <article
        aria-label={`Invoice ${invoice.number}`}
        className="surface-raised mx-auto w-full max-w-4xl rounded-card p-6 sm:p-10 md:p-12 print:max-w-none print:rounded-none print:bg-white print:p-0 print:text-black print:shadow-none print:before:hidden"
      >
        <header className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <span aria-hidden className="grid size-11 place-items-center rounded-control bg-accent text-lg font-semibold text-accent-fg print:border print:border-black print:bg-white print:text-black">
              {invoice.from.name[0]}
            </span>
            <p className="mt-4 font-medium">{invoice.from.name}</p>
            {invoice.from.lines.map((l) => (
              <p key={l} className="text-sm text-muted print:text-black/70">
                {l}
              </p>
            ))}
          </div>
          <div className="text-left sm:text-right">
            <p className="text-3xl font-semibold tracking-tight">Invoice</p>
            <p className="mt-1 font-mono text-sm text-muted print:text-black/70">{invoice.number}</p>
          </div>
        </header>

        <div className="mt-10 grid gap-6 border-y border-line py-6 sm:grid-cols-3 print:border-black/20">
          <div>
            <p className="text-xs tracking-wide text-muted uppercase print:text-black/60">Billed to</p>
            <p className="mt-2 font-medium">{invoice.to.name}</p>
            {invoice.to.lines.map((l) => (
              <p key={l} className="text-sm text-muted print:text-black/70">
                {l}
              </p>
            ))}
            {invoice.to.email && <p className="text-sm text-muted print:text-black/70">{invoice.to.email}</p>}
          </div>
          <div>
            <p className="text-xs tracking-wide text-muted uppercase print:text-black/60">Issued</p>
            <p className="mt-2 text-sm">{invoice.issued}</p>
            <p className="mt-4 text-xs tracking-wide text-muted uppercase print:text-black/60">Due</p>
            <p className="mt-2 text-sm">{invoice.due}</p>
          </div>
          <div className="sm:text-right">
            <p className="text-xs tracking-wide text-muted uppercase print:text-black/60">Amount due</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight tabular-nums">{money.format(invoice.status === "paid" ? 0 : total)}</p>
          </div>
        </div>

        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[30rem] text-sm">
            <thead>
              <tr className="text-left text-xs tracking-wide text-muted uppercase print:text-black/60">
                <th className="pb-3 font-normal">Description</th>
                <th className="pb-3 text-right font-normal">Qty</th>
                <th className="pb-3 text-right font-normal">Rate</th>
                <th className="pb-3 text-right font-normal">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line print:divide-black/15">
              {invoice.lines.map((l) => (
                <tr key={l.description} className="align-top">
                  <td className="py-3 pr-4">
                    <p className="font-medium">{l.description}</p>
                    {l.detail && <p className="text-muted print:text-black/60">{l.detail}</p>}
                  </td>
                  <td className="py-3 text-right tabular-nums">{l.quantity}</td>
                  <td className="py-3 pl-4 text-right tabular-nums">{money.format(l.rate)}</td>
                  <td className="py-3 pl-4 text-right tabular-nums">{money.format(l.quantity * l.rate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <dl className="mt-6 ml-auto grid max-w-xs gap-2 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-muted print:text-black/70">Subtotal</dt>
            <dd className="tabular-nums">{money.format(subtotal)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted print:text-black/70">Sales tax ({(invoice.taxRate * 100).toFixed(1)}%)</dt>
            <dd className="tabular-nums">{money.format(tax)}</dd>
          </div>
          <div className="mt-1 flex justify-between gap-4 border-t border-line pt-3 text-base font-medium print:border-black/30">
            <dt>Total</dt>
            <dd className="tabular-nums">{money.format(total)}</dd>
          </div>
        </dl>

        <footer className="mt-12 grid gap-8 border-t border-line pt-6 text-sm sm:grid-cols-2 print:border-black/20">
          <div>
            <p className="text-xs tracking-wide text-muted uppercase print:text-black/60">Pay by bank transfer</p>
            <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
              {invoice.payment.map((p) => (
                <div key={p.label} className="contents">
                  <dt className="text-muted print:text-black/70">{p.label}</dt>
                  <dd className="tabular-nums">{p.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div>
            <p className="text-xs tracking-wide text-muted uppercase print:text-black/60">Notes</p>
            <p className="mt-2 leading-relaxed text-muted print:text-black/70">{invoice.notes}</p>
            {invoice.from.email && <p className="mt-2 text-muted print:text-black/70">Questions? {invoice.from.email}</p>}
          </div>
        </footer>
      </article>
    </div>
  );
}
