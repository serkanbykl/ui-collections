"use client";

import { useState } from "react";

import { cn } from "@/registry/kit/lib/utils";
import { SettingsLayout, SettingsSection, type SettingsLink } from "@/registry/kit/screens/settings-layout";
import { Badge } from "@/registry/kit/ui/badge";
import { Button } from "@/registry/kit/ui/button";
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/registry/kit/ui/dialog";
import { Input } from "@/registry/kit/ui/field";
import { Progress } from "@/registry/kit/ui/progress";
import { RadioGroup, RadioGroupCard } from "@/registry/kit/ui/radio-group";
import { SegmentedControl } from "@/registry/kit/ui/segmented-control";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/registry/kit/ui/table";
import { toast } from "@/registry/kit/ui/toast";

export interface BillingPlan {
  id: string;
  name: string;
  /** Price per seat per month, billed monthly. */
  monthly: number;
  /** Price per seat per month, billed yearly. */
  yearly: number;
  summary: string;
}

export interface UsageMeter {
  id: string;
  label: string;
  used: number;
  limit: number;
  unit?: string;
}

export interface Invoice {
  id: string;
  number: string;
  date: string;
  amount: number;
  status: "paid" | "open" | "refunded";
}

export const samplePlans: BillingPlan[] = [
  { id: "starter", name: "Starter", monthly: 12, yearly: 10, summary: "Up to 10 seats, 20 GB storage, community support." },
  { id: "growth", name: "Growth", monthly: 29, yearly: 24, summary: "Up to 50 seats, 100 GB, SSO and audit log." },
  { id: "scale", name: "Scale", monthly: 54, yearly: 45, summary: "Unlimited seats, 1 TB, SCIM and a named support engineer." },
];

export const sampleUsage: UsageMeter[] = [
  { id: "seats", label: "Seats", used: 18, limit: 25 },
  { id: "storage", label: "Storage", used: 61.4, limit: 100, unit: "GB" },
  { id: "api", label: "API requests this month", used: 742_180, limit: 1_000_000 },
  { id: "automations", label: "Automation runs", used: 9_412, limit: 10_000 },
];

export const sampleInvoices: Invoice[] = [
  { id: "inv1", number: "NW-2026-0418", date: "Oct 14, 2026", amount: 522, status: "open" },
  { id: "inv2", number: "NW-2026-0377", date: "Sep 14, 2026", amount: 522, status: "paid" },
  { id: "inv3", number: "NW-2026-0331", date: "Aug 14, 2026", amount: 493, status: "paid" },
  { id: "inv4", number: "NW-2026-0290", date: "Jul 14, 2026", amount: 464, status: "paid" },
  { id: "inv5", number: "NW-2026-0246", date: "Jun 14, 2026", amount: 87, status: "refunded" },
  { id: "inv6", number: "NW-2026-0203", date: "May 14, 2026", amount: 464, status: "paid" },
];

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const num = new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 });

const invoiceStatus = {
  paid: { label: "Paid", variant: "success" as const },
  open: { label: "Due Nov 14", variant: "warning" as const },
  refunded: { label: "Refunded", variant: "outline" as const },
};

export interface SettingsBillingScreenProps {
  plans?: BillingPlan[];
  currentPlan?: string;
  seats?: number;
  usage?: UsageMeter[];
  invoices?: Invoice[];
  links?: SettingsLink[];
  className?: string;
}

/** Current plan, usage meters, payment method, invoice history and a dialog to change plan or billing period. */
export function SettingsBillingScreen({
  plans = samplePlans,
  currentPlan = "growth",
  seats = 18,
  usage = sampleUsage,
  invoices = sampleInvoices,
  links,
  className,
}: SettingsBillingScreenProps) {
  const [planId, setPlanId] = useState(currentPlan);
  const [period, setPeriod] = useState<"monthly" | "yearly">("monthly");
  const [card, setCard] = useState({ brand: "Visa", last4: "4417", expiry: "08/28", name: "Priya Raman" });
  const plan = plans.find((p) => p.id === planId) ?? plans[0]!;
  const total = plan[period] * seats * (period === "yearly" ? 12 : 1);

  return (
    <SettingsLayout active="billing" title="Billing" description={`${plan.name} plan · ${seats} seats · renews November 14, 2026`} links={links} className={className}>
      <div className="grid min-w-0 grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <SettingsSection
          title="Current plan"
          aside={<Badge variant="accent">{period === "yearly" ? "Billed yearly" : "Billed monthly"}</Badge>}
          footer={
            <ChangePlanDialog
              plans={plans}
              planId={planId}
              period={period}
              seats={seats}
              onConfirm={(id, p) => {
                setPlanId(id);
                setPeriod(p);
                const name = plans.find((x) => x.id === id)?.name;
                toast.success(`You're on ${name}, billed ${p}. The difference is prorated on your next invoice.`);
              }}
            />
          }
        >
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-3xl font-semibold tracking-tight">{plan.name}</p>
              <p className="mt-1 text-sm text-muted">{plan.summary}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-semibold tabular-nums">{usd.format(total)}</p>
              <p className="text-xs text-muted">
                {seats} seats × {usd.format(plan[period])} · {period === "yearly" ? "per year" : "per month"}
              </p>
            </div>
          </div>
          <p className="mt-4 text-sm text-muted">Renews on November 14, 2026.</p>
        </SettingsSection>

        <SettingsSection
          title="Payment method"
          footer={
            <UpdateCardDialog
              onSave={(next) => {
                setCard(next);
                toast.success(`Card ending ${next.last4} saved. It's used from the next invoice.`);
              }}
            />
          }
        >
          <div className="flex items-center gap-4">
            <span aria-hidden className="grid h-11 w-16 shrink-0 place-items-center rounded-field bg-linear-to-br from-info/70 to-accent/70 text-xs font-bold tracking-wider text-bg">
              {card.brand.toUpperCase()}
            </span>
            <div className="min-w-0">
              <p className="font-medium">
                {card.brand} ending {card.last4}
              </p>
              <p className="text-sm text-muted">
                Expires {card.expiry} · {card.name}
              </p>
            </div>
          </div>
          <p className="mt-4 text-sm text-muted">Receipts go to billing@northwind.io.</p>
        </SettingsSection>
      </div>

      <SettingsSection title="Usage this cycle" description="Resets on November 14. You get an email at 80% of any limit.">
        <ul className="grid gap-5 md:grid-cols-2">
          {usage.map((m) => {
            const ratio = m.used / m.limit;
            return (
              <li key={m.id} className="grid gap-2">
                <div className="flex items-baseline justify-between gap-3 text-sm">
                  <span className="font-medium">{m.label}</span>
                  <span className={cn("tabular-nums", ratio >= 0.9 ? "text-warning" : "text-muted")}>
                    {num.format(m.used)} / {num.format(m.limit)}
                    {m.unit && ` ${m.unit}`}
                  </span>
                </div>
                <Progress
                  value={m.used}
                  max={m.limit}
                  aria-label={`${m.label}: ${Math.round(ratio * 100)}% used`}
                  tone={ratio >= 0.9 ? "warning" : "accent"}
                />
                {ratio >= 0.9 && <p className="text-xs text-warning">{Math.round((1 - ratio) * 100)}% left. Runs pause at the limit.</p>}
              </li>
            );
          })}
        </ul>
      </SettingsSection>

      <section className="grid min-w-0 grid-cols-1 gap-3">
        <h3 className="text-lg font-semibold">Invoices</h3>
        <Table>
          <TableCaption className="sr-only">Invoices</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="relative w-12">
                <span className="sr-only">Download</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((inv) => (
              <TableRow key={inv.id}>
                <TableCell className="font-mono text-xs whitespace-nowrap">{inv.number}</TableCell>
                <TableCell className="whitespace-nowrap text-muted">{inv.date}</TableCell>
                <TableCell>
                  <Badge variant={invoiceStatus[inv.status].variant}>{invoiceStatus[inv.status].label}</Badge>
                </TableCell>
                <TableCell className="text-right tabular-nums">{usd.format(inv.amount)}</TableCell>
                <TableCell className="text-right">
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    aria-label={`Download ${inv.number} as PDF`}
                    onClick={() => toast.success(`Preparing ${inv.number}.pdf. It downloads in a moment.`)}
                  >
                    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M12 4v11m0 0-4-4m4 4 4-4M5 19h14" />
                    </svg>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </SettingsLayout>
  );
}

function ChangePlanDialog({
  plans,
  planId,
  period,
  seats,
  onConfirm,
}: {
  plans: BillingPlan[];
  planId: string;
  period: "monthly" | "yearly";
  seats: number;
  onConfirm: (planId: string, period: "monthly" | "yearly") => void;
}) {
  const [open, setOpen] = useState(false);
  const [picked, setPicked] = useState(planId);
  const [cycle, setCycle] = useState(period);
  const plan = plans.find((p) => p.id === picked) ?? plans[0]!;
  const unchanged = picked === planId && cycle === period;

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) {
          setPicked(planId);
          setCycle(period);
        }
      }}
    >
      <Button variant="accent" onClick={() => setOpen(true)}>
        Change plan
      </Button>
      <DialogContent size="lg">
        <DialogHeader>
          <DialogTitle>Change plan</DialogTitle>
          <DialogDescription>Prices are per seat. Yearly billing saves about 17%.</DialogDescription>
        </DialogHeader>
        <DialogBody className="grid gap-4">
          <SegmentedControl
            aria-label="Billing period"
            className="justify-self-start"
            value={cycle}
            onValueChange={setCycle}
            options={[
              { value: "monthly", label: "Monthly" },
              { value: "yearly", label: "Yearly" },
            ]}
          />
          <RadioGroup value={picked} onValueChange={setPicked} aria-label="Plan" className="grid gap-3">
            {plans.map((p) => (
              <RadioGroupCard
                key={p.id}
                value={p.id}
                title={
                  <span className="flex items-center gap-2">
                    {p.name}
                    {p.id === planId && <Badge variant="outline">Current</Badge>}
                  </span>
                }
                description={p.summary}
                aside={
                  <span className="text-right whitespace-nowrap">
                    <span className="block font-semibold tabular-nums">{usd.format(p[cycle])}</span>
                    <span className="text-xs text-muted">per seat / mo</span>
                  </span>
                }
              />
            ))}
          </RadioGroup>
        </DialogBody>
        <DialogFooter className="sm:items-center">
          <p className="text-sm text-muted sm:mr-auto">
            New total: <span className="text-fg tabular-nums">{usd.format(plan[cycle] * seats * (cycle === "yearly" ? 12 : 1))}</span>{" "}
            {cycle === "yearly" ? "per year" : "per month"}
          </p>
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <Button
            variant="accent"
            disabled={unchanged}
            onClick={() => {
              onConfirm(picked, cycle);
              setOpen(false);
            }}
          >
            Switch to {plan.name}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function UpdateCardDialog({ onSave }: { onSave: (card: { brand: string; last4: string; expiry: string; name: string }) => void }) {
  const [open, setOpen] = useState(false);
  const [number, setNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [name, setName] = useState("");
  const [touched, setTouched] = useState(false);

  const digits = number.replace(/\D/g, "");
  const errors = {
    number: digits.length < 15 ? "Enter the full card number." : undefined,
    expiry: /^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry) ? undefined : "Use MM/YY.",
    cvc: /^\d{3,4}$/.test(cvc) ? undefined : "3 or 4 digits.",
    name: name.trim() ? undefined : "Enter the name on the card.",
  };
  const valid = Object.values(errors).every((e) => !e);

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setTouched(false);
      }}
    >
      <Button onClick={() => setOpen(true)}>Update card</Button>
      <DialogContent>
        <form
          noValidate
          className="contents"
          onSubmit={(e) => {
            e.preventDefault();
            setTouched(true);
            if (!valid) return;
            onSave({ brand: digits.startsWith("4") ? "Visa" : digits.startsWith("3") ? "Amex" : "Mastercard", last4: digits.slice(-4), expiry, name: name.trim() });
            setOpen(false);
            setNumber("");
            setExpiry("");
            setCvc("");
            setName("");
            setTouched(false);
          }}
        >
          <DialogHeader>
            <DialogTitle>Update payment card</DialogTitle>
            <DialogDescription>Card details go straight to the payment processor. We only keep the last four digits.</DialogDescription>
          </DialogHeader>
          <DialogBody className="grid gap-4">
            <Input
              label="Card number"
              inputMode="numeric"
              autoComplete="cc-number"
              value={number}
              onChange={(e) => setNumber(e.target.value.replace(/[^\d ]/g, "").slice(0, 23))}
              error={touched ? errors.number : undefined}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Expiry (MM/YY)"
                autoComplete="cc-exp"
                value={expiry}
                onChange={(e) => {
                  const d = e.target.value.replace(/\D/g, "").slice(0, 4);
                  setExpiry(d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d);
                }}
                error={touched ? errors.expiry : undefined}
              />
              <Input
                label="CVC"
                inputMode="numeric"
                autoComplete="cc-csc"
                value={cvc}
                onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
                error={touched ? errors.cvc : undefined}
              />
            </div>
            <Input label="Name on card" autoComplete="cc-name" value={name} onChange={(e) => setName(e.target.value)} error={touched ? errors.name : undefined} />
          </DialogBody>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="ghost">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" variant="accent">
              Save card
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
