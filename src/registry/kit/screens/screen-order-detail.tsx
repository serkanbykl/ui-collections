"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";

import { cn } from "@/registry/kit/lib/utils";
import { ActivityList, type ActivityItem } from "@/registry/kit/ui/activity-list";
import { Avatar } from "@/registry/kit/ui/avatar";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/registry/kit/ui/select";
import { PageHeader } from "@/registry/kit/ui/page-header";

export interface OrderLine {
  id: string;
  name: string;
  variant: string;
  sku: string;
  quantity: number;
  price: number;
}

export interface OrderDetail {
  number: string;
  placedAt: string;
  status: "unfulfilled" | "fulfilled";
  lines: OrderLine[];
  shipping: number;
  discount: number;
  /** Tax rate as a ratio, applied after the discount. */
  taxRate: number;
  /** Already refunded, in currency. */
  refunded: number;
  customer: {
    name: string;
    email: string;
    phone: string;
    orders: number;
    address: string[];
  };
  timeline: ActivityItem[];
}

export const sampleOrderDetail: OrderDetail = {
  number: "#5104",
  placedAt: "Oct 24, 2026 at 9:41 AM",
  status: "unfulfilled",
  lines: [
    { id: "l1", name: "Linen overshirt", variant: "Bone / M", sku: "NW-01043-BOM", quantity: 1, price: 64 },
    { id: "l2", name: "Merino crew sock", variant: "Charcoal / 2-pack", sku: "NW-01080-CH2", quantity: 3, price: 14.5 },
    { id: "l3", name: "Ceramic mug, 340 ml", variant: "Sand", sku: "NW-01487-SA", quantity: 1, price: 18 },
  ],
  shipping: 7.9,
  discount: 12.55,
  taxRate: 0.0725,
  refunded: 0,
  customer: {
    name: "Amara Okafor",
    email: "amara.okafor@fastmail.com",
    phone: "+1 (503) 555-0148",
    orders: 7,
    address: ["Amara Okafor", "2214 SE Ankeny St, Apt 3", "Portland, OR 97214", "United States"],
  },
  timeline: [
    { id: "t3", actor: "Lumen Pay", action: "captured", target: "$129.04 on Visa ·· 4417", time: "Oct 24, 9:41 AM", tone: "success" },
    { id: "t2", actor: "Amara Okafor", action: "applied discount", target: "AUTUMN10", time: "Oct 24, 9:40 AM", tone: "info" },
    { id: "t1", actor: "Amara Okafor", action: "placed order", target: "from the online store", time: "Oct 24, 9:39 AM", tone: "neutral" },
  ],
};

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

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

const truckIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M3 6h11v10H3zM14 10h4l3 3v3h-7" />
    <circle cx="7" cy="17.5" r="1.5" />
    <circle cx="17" cy="17.5" r="1.5" />
  </svg>
);

const refundIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M9 14 4 9l5-5" />
    <path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11" />
  </svg>
);

export interface OrderDetailScreenProps {
  order?: OrderDetail;
  className?: string;
}

/** One order: line items, totals, payment and fulfilment timeline, customer card, and fulfil / refund flows behind confirm dialogs. */
export function OrderDetailScreen({ order = sampleOrderDetail, className }: OrderDetailScreenProps) {
  const [status, setStatus] = useState(order.status);
  const [refunded, setRefunded] = useState(order.refunded);
  const [timeline, setTimeline] = useState(order.timeline);
  const [dialog, setDialog] = useState<"fulfil" | "refund" | null>(null);
  const [busy, setBusy] = useState(false);
  const [carrier, setCarrier] = useState("ups");
  const [tracking, setTracking] = useState("1Z 84F 2W0 03 1947 6620");
  const [amount, setAmount] = useState("");
  const [amountError, setAmountError] = useState<string>();
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const subtotal = order.lines.reduce((sum, l) => sum + l.price * l.quantity, 0);
  const tax = Math.round((subtotal - order.discount) * order.taxRate * 100) / 100;
  const total = subtotal - order.discount + order.shipping + tax;
  const refundable = Math.round((total - refunded) * 100) / 100;
  const units = order.lines.reduce((sum, l) => sum + l.quantity, 0);

  function run(after: () => void) {
    setBusy(true);
    timer.current = setTimeout(() => {
      after();
      setBusy(false);
      setDialog(null);
    }, 700);
  }

  function fulfil(e: FormEvent) {
    e.preventDefault();
    run(() => {
      setStatus("fulfilled");
      setTimeline((t) => [
        { id: `f${t.length}`, actor: "You", action: `shipped ${units} items with ${carrier.toUpperCase()}`, target: tracking, time: "Just now", tone: "accent" },
        ...t,
      ]);
    });
  }

  function refund(e: FormEvent) {
    e.preventDefault();
    const value = Number(amount);
    if (!amount || Number.isNaN(value) || value <= 0) return setAmountError("Enter an amount above zero.");
    if (value > refundable) return setAmountError(`You can refund up to ${usd.format(refundable)}.`);
    run(() => {
      setRefunded((r) => Math.round((r + value) * 100) / 100);
      setTimeline((t) => [
        { id: `r${t.length}`, actor: "You", action: "refunded", target: `${usd.format(value)} to Visa ·· 4417`, time: "Just now", tone: "warning" },
        ...t,
      ]);
    });
  }

  const paymentBadge =
    refunded === 0 ? (
      <Badge variant="success" dot>
        Paid
      </Badge>
    ) : refunded >= total - 0.005 ? (
      <Badge variant="outline">Refunded</Badge>
    ) : (
      <Badge variant="info" dot>
        Partially refunded
      </Badge>
    );

  return (
    <div className={cn("grid grid-cols-1 gap-6", className)}>
      <PageHeader
        title={`Order ${order.number}`}
        titleClassName="tabular-nums"
        description={`Placed ${order.placedAt} by ${order.customer.name} · ${order.lines.length} ${order.lines.length === 1 ? "line" : "lines"}`}
        actions={
          <>
          <Button
            onClick={() => {
              setAmount(refundable.toFixed(2));
              setAmountError(undefined);
              setDialog("refund");
            }}
            disabled={refundable <= 0}
          >
            Refund
          </Button>
          <Button variant="accent" onClick={() => setDialog("fulfil")} disabled={status === "fulfilled"}>
            {status === "fulfilled" ? "Fulfilled" : `Fulfil ${units} items`}
          </Button>
          </>
        }
      >
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {paymentBadge}
          <Badge variant={status === "fulfilled" ? "success" : "warning"}>{status === "fulfilled" ? "Fulfilled" : "Unfulfilled"}</Badge>
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
        <div className="grid grid-cols-1 content-start gap-6">
          <Panel title={`Items · ${units}`}>
            <ul className="divide-y divide-line">
              {order.lines.map((l, i) => (
                <li key={l.id} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                  <span
                    aria-hidden
                    className={cn(
                      "grid size-12 shrink-0 place-items-center rounded-field text-xs font-semibold",
                      ["bg-accent/15 text-accent", "bg-info/15 text-info", "bg-warning/15 text-warning"][i % 3],
                    )}
                  >
                    {l.name.slice(0, 2).toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{l.name}</p>
                    <p className="truncate text-sm text-muted">
                      {l.variant} · <span className="font-mono text-xs">{l.sku}</span>
                    </p>
                  </div>
                  <p className="shrink-0 text-right text-sm tabular-nums">
                    <span className="text-muted">
                      {usd.format(l.price)} × {l.quantity}
                    </span>
                    <br />
                    {usd.format(l.price * l.quantity)}
                  </p>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title="Payment">
            <dl className="grid grid-cols-1 gap-2.5 text-sm">
              {[
                ["Subtotal", usd.format(subtotal)],
                ["Discount · AUTUMN10", `−${usd.format(order.discount)}`],
                ["Shipping · Standard", usd.format(order.shipping)],
                [`Tax · ${(order.taxRate * 100).toFixed(2)}%`, usd.format(tax)],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4">
                  <dt className="text-muted">{k}</dt>
                  <dd className="tabular-nums">{v}</dd>
                </div>
              ))}
              <div className="mt-1 flex justify-between gap-4 border-t border-line pt-3 font-medium">
                <dt>Total</dt>
                <dd className="tabular-nums">{usd.format(total)}</dd>
              </div>
              {refunded > 0 && (
                <>
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted">Refunded</dt>
                    <dd className="tabular-nums text-muted">−{usd.format(refunded)}</dd>
                  </div>
                  <div className="flex justify-between gap-4 font-medium">
                    <dt>Net payment</dt>
                    <dd className="tabular-nums">{usd.format(total - refunded)}</dd>
                  </div>
                </>
              )}
            </dl>
          </Panel>

          <Panel title="Timeline">
            <ActivityList items={timeline} />
          </Panel>
        </div>

        <div className="grid grid-cols-1 content-start gap-6">
          <Panel title="Customer">
            <div className="flex items-center gap-3">
              <Avatar fallback={order.customer.name.split(" ").map((w) => w[0]).join("")} alt="" />
              <div className="min-w-0">
                <p className="truncate font-medium">{order.customer.name}</p>
                <p className="text-sm text-muted">{order.customer.orders} orders</p>
              </div>
            </div>
            <dl className="mt-5 grid gap-4 text-sm">
              <div>
                <dt className="text-muted">Contact</dt>
                <dd className="mt-1 grid gap-0.5">
                  <a href={`mailto:${order.customer.email}`} className="truncate text-accent underline-offset-4 hover:underline">
                    {order.customer.email}
                  </a>
                  <span className="tabular-nums">{order.customer.phone}</span>
                </dd>
              </div>
              <div>
                <dt className="text-muted">Ship to</dt>
                <dd className="mt-1">
                  <address className="not-italic leading-relaxed">
                    {order.customer.address.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </address>
                </dd>
              </div>
              {status === "fulfilled" && (
                <div>
                  <dt className="text-muted">Tracking</dt>
                  <dd className="mt-1 font-mono text-xs">
                    {carrier.toUpperCase()} · {tracking}
                  </dd>
                </div>
              )}
            </dl>
          </Panel>
        </div>
      </div>

      <Dialog open={dialog === "fulfil"} onOpenChange={(o) => !busy && setDialog(o ? "fulfil" : null)}>
        <DialogContent size="sm">
          <form onSubmit={fulfil} className="contents">
            <DialogHeader icon={truckIcon} tone="accent">
              <DialogTitle>Fulfil {units} items</DialogTitle>
              <DialogDescription>{order.customer.name} gets a shipping email with the tracking link.</DialogDescription>
            </DialogHeader>
            <DialogBody className="grid grid-cols-1 gap-4 pb-1">
              <Select value={carrier} onValueChange={setCarrier}>
                <SelectTrigger aria-label="Carrier" className="h-14">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ups">UPS</SelectItem>
                  <SelectItem value="usps">USPS</SelectItem>
                  <SelectItem value="fedex">FedEx</SelectItem>
                </SelectContent>
              </Select>
              <Input label="Tracking number" value={tracking} onChange={(e) => setTracking(e.target.value)} />
            </DialogBody>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="ghost" disabled={busy}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" variant="accent" loading={busy}>
                Mark as fulfilled
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={dialog === "refund"} onOpenChange={(o) => !busy && setDialog(o ? "refund" : null)}>
        <DialogContent size="sm">
          <form onSubmit={refund} noValidate className="contents">
            <DialogHeader icon={refundIcon} tone="danger">
              <DialogTitle>Refund order {order.number}</DialogTitle>
              <DialogDescription>The money goes back to Visa ·· 4417 in 5–10 business days. This can&apos;t be undone.</DialogDescription>
            </DialogHeader>
            <DialogBody className="pb-1">
              <Input
                label="Amount (USD)"
                inputMode="decimal"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setAmountError(undefined);
                }}
                error={amountError}
                hint={`Up to ${usd.format(refundable)}`}
              />
            </DialogBody>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="ghost" disabled={busy}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" variant="danger" loading={busy}>
                Refund {Number(amount) > 0 ? usd.format(Number(amount)) : ""}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
