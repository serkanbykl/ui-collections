"use client";

import { cn } from "@/registry/kit/lib/utils";
import { Button, buttonVariants } from "@/registry/kit/ui/button";
import { Stepper } from "@/registry/kit/ui/stepper";
import { formatUsd, sampleStorePromos, storeItemCount, storeTotals, type StoreCartLine, type StoreTotals } from "@/registry/kit/screens/screen-store";
import { sampleStoreCart, storeCheckoutSteps, StoreLineRow, StoreSummaryRows } from "@/registry/kit/screens/screen-store-cart";

export interface StoreOrder {
  number: string;
  placedOn: string;
  email: string;
  name: string;
  /** Address lines as they print on the label. */
  address: string[];
  shippingMethod: string;
  /** e.g. "Thu, Oct 29 – Mon, Nov 2". */
  arrives: string;
  /** e.g. "Visa ending 4242". */
  payment: string;
  lines: StoreCartLine[];
  promoCode?: string | null;
  totals: StoreTotals;
}

export const sampleStoreOrder: StoreOrder = {
  number: "NW-48213",
  placedOn: "Oct 27, 2026",
  email: "maya.lindqvist@fernpost.example",
  name: "Maya Lindqvist",
  address: ["Maya Lindqvist", "418 Alder Street, Apt 3B", "Portland, OR 97205", "United States"],
  shippingMethod: "Standard shipping",
  arrives: "Mon, Nov 2 – Wed, Nov 4",
  payment: "Visa ending 4242",
  lines: sampleStoreCart,
  promoCode: "AUTUMN15",
  totals: storeTotals(sampleStoreCart, sampleStorePromos[0]),
};

export interface StoreConfirmationScreenProps {
  order?: StoreOrder;
  storeHref?: string;
  productHref?: (slug: string) => string;
  className?: string;
}

/** Order placed: number, what happens next, delivery and payment details, the items and a printable receipt. */
export function StoreConfirmationScreen({
  order = sampleStoreOrder,
  storeHref = "#/store",
  productHref = (slug) => `#/store/p/${slug}`,
  className,
}: StoreConfirmationScreenProps) {
  const first = order.name.split(" ")[0];
  const items = storeItemCount(order.lines);
  const next = [
    { title: "Confirmation sent", detail: `A receipt is on its way to ${order.email}.`, done: true },
    { title: "Packed within 1 business day", detail: "We'll email a tracking link as soon as the parcel leaves our Lisbon warehouse.", done: false },
    { title: `Arrives ${order.arrives}`, detail: "Not the right fit? Returns are free for 30 days from delivery.", done: false },
  ];

  return (
    <div className={cn("grid grid-cols-1 gap-6", className)}>
      <Stepper steps={storeCheckoutSteps} current={storeCheckoutSteps.length} className="mx-auto max-w-xl print:hidden" />

      <section className="surface rounded-card p-6 text-center md:p-10">
        <span aria-hidden className="mx-auto grid size-14 place-items-center rounded-full bg-success/15 text-success">
          <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12.5l4.5 4.5L19 7.5" />
          </svg>
        </span>
        <p className="mt-5 text-sm text-muted">
          Order <span className="font-mono text-fg">{order.number}</span> · {order.placedOn}
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight md:text-4xl">Thanks, {first}. Your order is confirmed.</h1>
        <p className="mx-auto mt-3 max-w-lg text-muted">
          We&apos;ve received your payment of {formatUsd(order.totals.total)} for {items} {items === 1 ? "item" : "items"} and sent a receipt to {order.email}.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3 print:hidden">
          <a href={storeHref} className={buttonVariants({ variant: "accent" })}>
            Continue shopping
          </a>
          <Button onClick={() => window.print()}>Print receipt</Button>
        </div>
      </section>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="grid gap-6">
          <section aria-labelledby="order-next" className="surface rounded-card p-5 md:p-6">
            <h2 id="order-next" className="mb-5 text-sm font-medium text-fg/85">
              What happens next
            </h2>
            <ol className="grid gap-5">
              {next.map((step, i) => (
                <li key={step.title} className="flex gap-4">
                  <span
                    aria-hidden
                    className={cn(
                      "grid size-8 shrink-0 place-items-center rounded-full text-sm tabular-nums",
                      step.done ? "bg-accent text-accent-fg" : "bg-bg-deep text-muted ring-1 ring-line-strong",
                    )}
                  >
                    {i + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="font-medium">
                      {step.title}
                      {step.done && <span className="sr-only"> (done)</span>}
                    </p>
                    <p className="mt-0.5 text-sm text-muted">{step.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section aria-labelledby="order-items" className="surface rounded-card p-5 md:p-6">
            <h2 id="order-items" className="mb-5 text-sm font-medium text-fg/85">
              Items
            </h2>
            <ul className="grid gap-5">
              {order.lines.map((line) => (
                <li key={line.id} className="border-line not-first:border-t not-first:pt-5">
                  <StoreLineRow
                    line={line}
                    href={productHref(line.slug)}
                    aside={
                      <p className="shrink-0 text-right tabular-nums">
                        <span className="block font-medium">{formatUsd(line.price * line.quantity)}</span>
                        <span className="text-xs text-muted">Qty {line.quantity}</span>
                      </p>
                    }
                  />
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside aria-labelledby="order-details" className="surface grid gap-5 rounded-card p-5 md:p-6">
          <h2 id="order-details" className="text-sm font-medium text-fg/85">
            Order details
          </h2>
          <dl className="grid gap-4 text-sm">
            <div>
              <dt className="text-muted">Ship to</dt>
              <dd className="mt-1">
                {order.address.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </dd>
            </div>
            <div>
              <dt className="text-muted">Delivery</dt>
              <dd className="mt-1">
                {order.shippingMethod} · arrives {order.arrives}
              </dd>
            </div>
            <div>
              <dt className="text-muted">Payment</dt>
              <dd className="mt-1">{order.payment}</dd>
            </div>
          </dl>
          <div className="border-t border-line pt-5">
            <StoreSummaryRows
              totals={order.totals}
              promo={order.promoCode ? { code: order.promoCode, label: "" } : null}
              shippingLabel={order.shippingMethod}
            />
          </div>
        </aside>
      </div>
    </div>
  );
}
