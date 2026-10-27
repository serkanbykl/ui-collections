"use client";

import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";

import { cn } from "@/registry/kit/lib/utils";
import { Button, buttonVariants } from "@/registry/kit/ui/button";
import { Input, Textarea } from "@/registry/kit/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/registry/kit/ui/select";
import { PageHeader } from "@/registry/kit/ui/page-header";

export interface EditorLine {
  id: string;
  description: string;
  quantity: string;
  rate: string;
}

export interface InvoiceDraft {
  number: string;
  client: string;
  issued: string;
  terms: "7" | "14" | "30" | "60";
  lines: EditorLine[];
  /** Percent, as typed: "8.25". */
  taxRate: string;
  /** Flat discount in currency, as typed. */
  discount: string;
  notes: string;
}

export const sampleInvoiceDraft: InvoiceDraft = {
  number: "INV-2026-0419",
  client: "Coastal Kayak Co.",
  issued: "2026-10-24",
  terms: "30",
  lines: [
    { id: "l1", description: "Booking site redesign, discovery workshop", quantity: "1", rate: "640" },
    { id: "l2", description: "Front-end build", quantity: "14", rate: "85" },
    { id: "l3", description: "Stock photography licence", quantity: "6", rate: "19.5" },
  ],
  taxRate: "8.25",
  discount: "0",
  notes: "Payment by bank transfer within the terms above. Thanks for choosing us again.",
};

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const num = (s: string) => {
  const n = Number(s);
  return Number.isFinite(n) ? n : 0;
};
const round = (n: number) => Math.round(n * 100) / 100;

function Section({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  return (
    <section className="surface rounded-card p-5 md:p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h3 className="text-sm font-medium text-fg/85">{title}</h3>
        {action}
      </div>
      {children}
    </section>
  );
}

export interface InvoiceEditorScreenProps {
  initialDraft?: InvoiceDraft;
  /** Called with the draft and computed total when the invoice is sent. */
  onSend?: (draft: InvoiceDraft, total: number) => Promise<void> | void;
  /** Where "Preview" goes. */
  previewHref?: string;
  /** Page title; "Edit invoice" when changing one that exists. */
  title?: string;
  className?: string;
}

/** Build an invoice: add and remove line items, set tax and a discount, and watch the totals update as you type. */
export function InvoiceEditorScreen({ initialDraft = sampleInvoiceDraft, onSend, previewHref = "#/app/invoices/preview", title = "New invoice", className }: InvoiceEditorScreenProps) {
  const [draft, setDraft] = useState(initialDraft);
  const [nextId, setNextId] = useState(initialDraft.lines.length + 1);
  const [state, setState] = useState<"idle" | "sending" | "sent" | "saved">("idle");
  const [error, setError] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const termsId = useId();
  useEffect(() => () => clearTimeout(timer.current), []);

  const subtotal = round(draft.lines.reduce((sum, l) => sum + num(l.quantity) * num(l.rate), 0));
  const discount = Math.min(Math.max(num(draft.discount), 0), subtotal);
  const tax = round((subtotal - discount) * (Math.max(num(draft.taxRate), 0) / 100));
  const total = round(subtotal - discount + tax);

  function patch(p: Partial<InvoiceDraft>) {
    setDraft((d) => ({ ...d, ...p }));
    setState("idle");
    setError(null);
  }

  function updateLine(id: string, p: Partial<EditorLine>) {
    patch({ lines: draft.lines.map((l) => (l.id === id ? { ...l, ...p } : l)) });
  }

  function addLine() {
    patch({ lines: [...draft.lines, { id: `l${nextId}`, description: "", quantity: "1", rate: "" }] });
    setNextId((n) => n + 1);
    requestAnimationFrame(() => document.querySelector<HTMLInputElement>(`[name="line-l${nextId}-description"]`)?.focus());
  }

  async function send(e: FormEvent) {
    e.preventDefault();
    if (!draft.client.trim()) return setError("Add who the invoice is for.");
    if (draft.lines.length === 0 || total <= 0) return setError("Add at least one line item with an amount.");
    if (draft.lines.some((l) => !l.description.trim())) return setError("Every line item needs a description.");
    setState("sending");
    if (onSend) await onSend(draft, total);
    else await new Promise<void>((resolve) => (timer.current = setTimeout(resolve, 900)));
    setState("sent");
  }

  const dueDate = (() => {
    const [y, m, d] = draft.issued.split("-").map(Number);
    if (!y || !m || !d) return "";
    const due = new Date(Date.UTC(y, m - 1, d + Number(draft.terms)));
    return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(due);
  })();

  return (
    <form noValidate onSubmit={send} className={cn("grid grid-cols-1 gap-6", className)}>
      <PageHeader
        title={title}
        description={
          <>
            <span className="font-mono text-sm">{draft.number}</span> · {draft.client.trim() || "No client yet"} · due in {draft.terms || "0"} days
          </>
        }
        actions={
          <>
          <a href={previewHref} className={buttonVariants({ variant: "ghost" })}>
            Preview
          </a>
          <Button type="button" onClick={() => setState("saved")} disabled={state === "sending"}>
            {state === "saved" ? "Draft saved" : "Save draft"}
          </Button>
          <Button type="submit" variant="accent" loading={state === "sending"} disabled={state === "sent"}>
            {state === "sent" ? "Sent" : `Send ${usd.format(total)}`}
          </Button>
          </>
        }
      />

      <div aria-live="polite" className="empty:hidden">
        {error && <p className="rounded-card border border-danger/40 px-4 py-3 text-sm text-danger">{error}</p>}
        {state === "sent" && (
          <p className="rounded-card border border-success/40 px-4 py-3 text-sm text-success">
            Sent {draft.number} to {draft.client.replace(/\.$/, "")}. We&apos;ll let you know when it&apos;s viewed and paid.
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.8fr)_minmax(0,1fr)]">
        <div className="grid min-w-0 grid-cols-1 content-start gap-6">
          <Section title="Billing">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input label="Client" value={draft.client} onChange={(e) => patch({ client: e.target.value })} className="sm:col-span-2" />
              <Input label="Issue date" type="date" value={draft.issued} onChange={(e) => patch({ issued: e.target.value })} />
              <div className="grid grid-cols-1 gap-1.5">
                <Select value={draft.terms} onValueChange={(v) => patch({ terms: v as InvoiceDraft["terms"] })}>
                  <SelectTrigger aria-labelledby={termsId} className="h-14">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(["7", "14", "30", "60"] as const).map((t) => (
                      <SelectItem key={t} value={t}>
                        Net {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span id={termsId} className="px-1 text-xs text-muted">
                  Payment terms · due {dueDate}
                </span>
              </div>
            </div>
          </Section>

          <Section
            title={`Line items · ${draft.lines.length}`}
            action={
              <Button type="button" size="sm" onClick={addLine}>
                Add line
              </Button>
            }
          >
            {draft.lines.length === 0 ? (
              <div className="rounded-card border border-dashed border-line px-4 py-8 text-center">
                <p className="text-sm">No line items yet.</p>
                <p className="mt-1 text-sm text-muted">Add the work or products you&apos;re billing for.</p>
              </div>
            ) : (
              <ul className="grid grid-cols-1 gap-4">
                {draft.lines.map((l, i) => (
                  <li key={l.id} className="grid grid-cols-1 gap-3 border-b border-line pb-4 last:border-0 last:pb-0 sm:grid-cols-[minmax(0,1fr)_5.5rem_7rem_6.5rem_auto] sm:items-center">
                    <Input
                      label={`Item ${i + 1}`}
                      name={`line-${l.id}-description`}
                      value={l.description}
                      onChange={(e) => updateLine(l.id, { description: e.target.value })}
                    />
                    <div className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-3 sm:contents">
                      <Input label="Qty" inputMode="decimal" value={l.quantity} onChange={(e) => updateLine(l.id, { quantity: e.target.value })} />
                      <Input label="Rate" inputMode="decimal" value={l.rate} onChange={(e) => updateLine(l.id, { rate: e.target.value })} />
                    </div>
                    <div className="flex items-center justify-between gap-2 sm:contents">
                      <output className="text-sm tabular-nums sm:text-right" aria-label={`Item ${i + 1} amount`}>
                        {usd.format(num(l.quantity) * num(l.rate))}
                      </output>
                      <Button
                        type="button"
                        size="icon-sm"
                        variant="ghost"
                        aria-label={`Remove item ${i + 1}`}
                        onClick={() => patch({ lines: draft.lines.filter((x) => x.id !== l.id) })}
                      >
                        <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden>
                          <path d="M6 6l12 12M18 6 6 18" />
                        </svg>
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Section>

          <Section title="Notes">
            <Textarea label="Shown at the bottom of the invoice" rows={3} value={draft.notes} onChange={(e) => patch({ notes: e.target.value })} />
          </Section>
        </div>

        <div className="grid grid-cols-1 content-start gap-6 lg:sticky lg:top-20">
          <Section title="Summary">
            <div className="grid grid-cols-2 gap-3">
              <Input label="Tax %" inputMode="decimal" value={draft.taxRate} onChange={(e) => patch({ taxRate: e.target.value })} />
              <Input label="Discount $" inputMode="decimal" value={draft.discount} onChange={(e) => patch({ discount: e.target.value })} />
            </div>
            <dl className="mt-5 grid gap-2.5 text-sm" aria-live="polite">
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Subtotal</dt>
                <dd className="tabular-nums">{usd.format(subtotal)}</dd>
              </div>
              {discount > 0 && (
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">Discount</dt>
                  <dd className="tabular-nums">−{usd.format(discount)}</dd>
                </div>
              )}
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Tax ({num(draft.taxRate)}%)</dt>
                <dd className="tabular-nums">{usd.format(tax)}</dd>
              </div>
              <div className="mt-1 flex items-baseline justify-between gap-4 border-t border-line pt-3">
                <dt className="font-medium">Total due</dt>
                <dd className="text-3xl font-semibold tracking-tight tabular-nums">{usd.format(total)}</dd>
              </div>
            </dl>
          </Section>
        </div>
      </div>
    </form>
  );
}
