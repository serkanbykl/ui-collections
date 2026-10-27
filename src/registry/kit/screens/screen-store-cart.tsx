"use client";

import { useState, type FormEvent, type ReactNode } from "react";

import { cn } from "@/registry/kit/lib/utils";
import { Badge } from "@/registry/kit/ui/badge";
import { Button, buttonVariants } from "@/registry/kit/ui/button";
import { Input } from "@/registry/kit/ui/field";
import { Progress } from "@/registry/kit/ui/progress";
import { EmptyState } from "@/registry/kit/ui/states";
import { Stepper } from "@/registry/kit/ui/stepper";
import {
  formatUsd,
  sampleStorePromos,
  sampleStoreProducts,
  storeItemCount,
  storeLine,
  storeLineOptions,
  StoreProductArt,
  storeTotals,
  STORE_FREE_SHIPPING_FROM,
  STORE_MAX_QUANTITY,
  type StoreCartLine,
  type StorePromo,
} from "@/registry/kit/screens/screen-store";

export const storeCheckoutSteps = [{ title: "Cart" }, { title: "Details" }, { title: "Shipping" }, { title: "Payment" }, { title: "Done" }];

export const sampleStoreCart: StoreCartLine[] = [
  storeLine(sampleStoreProducts[0]!, { color: "Olive", size: "M" }),
  storeLine(sampleStoreProducts[1]!, { color: "Charcoal", size: "40–43", quantity: 2 }),
];

const cartGlyph = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 8H6M10 21h.01M18 21h.01" />
  </svg>
);

/** Rows of the order summary; shared by cart, checkout and confirmation. */
export function StoreSummaryRows({
  totals,
  promo,
  shippingLabel = "Shipping",
  shippingNote,
}: {
  totals: ReturnType<typeof storeTotals>;
  promo?: StorePromo | null;
  shippingLabel?: string;
  shippingNote?: ReactNode;
}) {
  return (
    <dl className="grid gap-2.5 text-sm">
      <div className="flex justify-between gap-4">
        <dt className="text-muted">Subtotal</dt>
        <dd className="tabular-nums">{formatUsd(totals.subtotal)}</dd>
      </div>
      {totals.discount > 0 && (
        <div className="flex justify-between gap-4">
          <dt className="text-muted">Discount{promo ? ` · ${promo.code}` : ""}</dt>
          <dd className="text-success tabular-nums">−{formatUsd(totals.discount)}</dd>
        </div>
      )}
      <div className="flex justify-between gap-4">
        <dt className="text-muted">
          {shippingLabel}
          {shippingNote && <span className="block text-xs text-subtle">{shippingNote}</span>}
        </dt>
        <dd className="tabular-nums">{totals.shipping === 0 ? "Free" : formatUsd(totals.shipping)}</dd>
      </div>
      <div className="mt-1 flex justify-between gap-4 border-t border-line pt-3.5 text-base font-semibold">
        <dt>Total</dt>
        <dd className="tabular-nums">{formatUsd(totals.total)}</dd>
      </div>
    </dl>
  );
}

/** A small product row: tile, name, options and a trailing slot. */
export function StoreLineRow({ line, href, children, aside }: { line: StoreCartLine; href?: string; children?: ReactNode; aside?: ReactNode }) {
  const options = storeLineOptions(line);
  return (
    <div className="flex min-w-0 gap-3 sm:gap-4">
      <StoreProductArt kind={line.kind} tone={line.tone} className="size-16 shrink-0 rounded-field sm:size-20" />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-medium">
              {href ? (
                <a href={href} className="rounded-sm outline-none hover:text-accent focus-visible:outline-2 focus-visible:outline-accent">
                  {line.name}
                </a>
              ) : (
                line.name
              )}
            </p>
            <p className="mt-0.5 text-sm text-muted">
              {options && `${options} · `}
              {formatUsd(line.price)}
            </p>
          </div>
          {aside}
        </div>
        {children}
      </div>
    </div>
  );
}

export interface StoreCartScreenProps {
  /** Cart lines. Kept locally (starting from a sample cart) when left out. */
  lines?: StoreCartLine[];
  onLinesChange?: (lines: StoreCartLine[]) => void;
  /** The applied promo code. */
  promoCode?: string | null;
  onPromoCodeChange?: (code: string | null) => void;
  promos?: StorePromo[];
  storeHref?: string;
  checkoutHref?: string;
  productHref?: (slug: string) => string;
  className?: string;
}

/** Cart: line items with quantity steppers and undoable remove, a validated promo code, a free-shipping meter and the order summary. */
export function StoreCartScreen({
  lines: linesProp,
  onLinesChange,
  promoCode: promoProp,
  onPromoCodeChange,
  promos = sampleStorePromos,
  storeHref = "#/store",
  checkoutHref = "#/store/checkout",
  productHref = (slug) => `#/store/p/${slug}`,
  className,
}: StoreCartScreenProps) {
  const [localLines, setLocalLines] = useState(sampleStoreCart);
  const [localPromo, setLocalPromo] = useState<string | null>(null);
  const lines = linesProp ?? localLines;
  const promoCode = promoProp === undefined ? localPromo : promoProp;
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState<string>();
  const [removed, setRemoved] = useState<{ line: StoreCartLine; index: number } | null>(null);

  const promo = promos.find((p) => p.code === promoCode) ?? null;
  const totals = storeTotals(lines, promo);
  const items = storeItemCount(lines);

  function setLines(next: StoreCartLine[]) {
    if (linesProp === undefined) setLocalLines(next);
    onLinesChange?.(next);
  }
  function setPromo(next: string | null) {
    if (promoProp === undefined) setLocalPromo(next);
    onPromoCodeChange?.(next);
  }

  function changeQuantity(id: string, delta: number) {
    setLines(lines.map((l) => (l.id === id ? { ...l, quantity: Math.min(Math.max(l.quantity + delta, 1), STORE_MAX_QUANTITY) } : l)));
  }
  function remove(index: number) {
    setRemoved({ line: lines[index]!, index });
    setLines(lines.filter((_, i) => i !== index));
  }
  function undo() {
    if (!removed) return;
    const next = [...lines];
    next.splice(Math.min(removed.index, next.length), 0, removed.line);
    setLines(next);
    setRemoved(null);
  }

  function applyCode(event: FormEvent) {
    event.preventDefault();
    const entered = code.trim().toUpperCase();
    if (!entered) return setCodeError("Enter a code first.");
    const match = promos.find((p) => p.code === entered);
    if (!match) return setCodeError(`${entered} isn't a valid code. Check the spelling, or try another one.`);
    setCodeError(undefined);
    setCode("");
    setPromo(match.code);
  }

  const removedNotice = removed && (
    <p role="status" className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
      Removed {removed.line.name} from your cart.
      <Button size="sm" variant="ghost" onClick={undo}>
        Undo
      </Button>
    </p>
  );

  return (
    <div className={cn("grid grid-cols-1 gap-6", className)}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight md:text-4xl">Your cart</h1>
          <p className="mt-2 text-muted">
            {items === 0 ? "Nothing here yet" : `${items} ${items === 1 ? "item" : "items"} · ${formatUsd(totals.subtotal)}`}
          </p>
        </div>
        <a href={storeHref} className={buttonVariants({ variant: "ghost" })}>
          Continue shopping
        </a>
      </div>

      <Stepper steps={storeCheckoutSteps} current={0} className="mx-auto max-w-xl" />

      {lines.length === 0 ? (
        <div className="surface rounded-card">
          {removedNotice && <div className="px-5 pt-5">{removedNotice}</div>}
          <EmptyState
            icon={cartGlyph}
            title="Your cart is empty"
            description="Products you add from the store show up here. Your cart is kept while you browse."
            action={
              <a href={storeHref} className={buttonVariants({ variant: "accent" })}>
                Browse the store
              </a>
            }
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <section aria-labelledby="cart-items" className="surface rounded-card p-5 md:p-6">
            <h2 id="cart-items" className="sr-only">
              Items
            </h2>
            {removedNotice && <div className="mb-4">{removedNotice}</div>}
            <ul className="grid gap-5">
              {lines.map((line, index) => (
                <li key={line.id} className="border-line not-first:border-t not-first:pt-5">
                  <StoreLineRow
                    line={line}
                    href={productHref(line.slug)}
                    aside={<p className="shrink-0 font-medium tabular-nums">{formatUsd(line.price * line.quantity)}</p>}
                  >
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                      <div role="group" aria-label={`Quantity of ${line.name}`} className="surface flex h-9 items-center gap-0.5 rounded-control px-0.5">
                        <Button size="icon-sm" variant="ghost" aria-label={`Decrease quantity of ${line.name}`} disabled={line.quantity <= 1} onClick={() => changeQuantity(line.id, -1)}>
                          −
                        </Button>
                        <output aria-live="polite" className="w-7 text-center text-sm tabular-nums">
                          {line.quantity}
                        </output>
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          aria-label={`Increase quantity of ${line.name}`}
                          disabled={line.quantity >= STORE_MAX_QUANTITY}
                          onClick={() => changeQuantity(line.id, 1)}
                        >
                          +
                        </Button>
                      </div>
                      <Button size="sm" variant="ghost" className="text-muted hover:text-danger" aria-label={`Remove ${line.name} from cart`} onClick={() => remove(index)}>
                        Remove
                      </Button>
                    </div>
                  </StoreLineRow>
                </li>
              ))}
            </ul>
          </section>

          <aside aria-labelledby="cart-summary" className="grid gap-4 lg:sticky lg:top-24">
            <section className="surface rounded-card p-5 md:p-6">
              <h2 id="cart-summary" className="mb-4 text-sm font-medium text-fg/85">
                Order summary
              </h2>

              {totals.toFreeShipping > 0 && !promo?.freeShipping ? (
                <div className="mb-5 grid gap-2">
                  <p className="text-sm">
                    Add <span className="font-medium tabular-nums">{formatUsd(totals.toFreeShipping)}</span> more for free shipping.
                  </p>
                  <Progress value={STORE_FREE_SHIPPING_FROM - totals.toFreeShipping} max={STORE_FREE_SHIPPING_FROM} aria-label="Progress to free shipping" className="h-1.5" />
                </div>
              ) : (
                <p className="mb-5 text-sm text-success">Your order ships free.</p>
              )}

              {promo ? (
                <div className="mb-5 flex flex-wrap items-center justify-between gap-2 rounded-field border border-line p-3">
                  <div className="min-w-0">
                    <Badge variant="success">{promo.code}</Badge>
                    <p className="mt-1 text-xs text-muted">{promo.label}</p>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => setPromo(null)} aria-label={`Remove code ${promo.code}`}>
                    Remove
                  </Button>
                </div>
              ) : (
                <form
                  onSubmit={applyCode}
                  noValidate
                  // Subgrid rows keep Apply level with the field, label above and error below.
                  className="mb-5 grid grid-cols-[minmax(0,1fr)_auto] gap-x-2">
                  <Input
                    label="Promo code"
                    value={code}
                    onChange={(e) => {
                      setCode(e.target.value);
                      if (codeError) setCodeError(undefined);
                    }}
                    error={codeError}
                    autoComplete="off"
                    size="md"
                    className="row-span-3 grid min-w-0 grid-rows-subgrid"
                  />
                  <Button type="submit" size="md" className="col-start-2 row-start-2">
                    Apply
                  </Button>
                </form>
              )}

              <StoreSummaryRows totals={totals} promo={promo} shippingLabel="Standard shipping" shippingNote="3–5 business days" />

              <a href={checkoutHref} className={buttonVariants({ variant: "accent", className: "mt-6 w-full" })}>
                Go to checkout
              </a>
              <p className="mt-3 text-center text-xs text-muted">Free returns within 30 days.</p>
            </section>
          </aside>
        </div>
      )}
    </div>
  );
}

export interface StoreMiniCartProps {
  lines: StoreCartLine[];
  onLinesChange?: (lines: StoreCartLine[]) => void;
  promoCode?: string | null;
  promos?: StorePromo[];
  cartHref?: string;
  checkoutHref?: string;
  storeHref?: string;
  productHref?: (slug: string) => string;
  /** Called when a link inside is followed, e.g. to close the drawer. */
  onNavigate?: () => void;
}

/** Compact cart for a drawer: lines with quantity steppers and remove, the subtotal, and links to the cart and checkout. */
export function StoreMiniCart({
  lines,
  onLinesChange,
  promoCode = null,
  promos = sampleStorePromos,
  cartHref = "#/store/cart",
  checkoutHref = "#/store/checkout",
  storeHref = "#/store",
  productHref = (slug) => `#/store/p/${slug}`,
  onNavigate,
}: StoreMiniCartProps) {
  const promo = promos.find((p) => p.code === promoCode) ?? null;
  const totals = storeTotals(lines, promo);

  if (lines.length === 0)
    return (
      <EmptyState
        icon={cartGlyph}
        size="compact"
        className="flex-1"
        title="Your cart is empty"
        description="Products you add show up here."
        action={
          <a href={storeHref} onClick={onNavigate} className={buttonVariants({ variant: "accent", size: "sm" })}>
            Browse the store
          </a>
        }
      />
    );

  const change = (id: string, delta: number) =>
    onLinesChange?.(lines.map((l) => (l.id === id ? { ...l, quantity: Math.min(Math.max(l.quantity + delta, 1), STORE_MAX_QUANTITY) } : l)));

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <ul className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
        {lines.map((line) => (
          <li key={line.id} className="border-line not-first:mt-4 not-first:border-t not-first:pt-4">
            <StoreLineRow line={line} href={productHref(line.slug)}>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                <div role="group" aria-label={`Quantity of ${line.name}`} className="surface flex h-8 items-center rounded-control">
                  <Button size="icon-sm" variant="ghost" aria-label={`Decrease quantity of ${line.name}`} disabled={line.quantity <= 1} onClick={() => change(line.id, -1)}>
                    −
                  </Button>
                  <output aria-live="polite" className="w-6 text-center text-sm tabular-nums">
                    {line.quantity}
                  </output>
                  <Button size="icon-sm" variant="ghost" aria-label={`Increase quantity of ${line.name}`} disabled={line.quantity >= STORE_MAX_QUANTITY} onClick={() => change(line.id, 1)}>
                    +
                  </Button>
                </div>
                <Button size="sm" variant="ghost" className="h-8 px-3 text-muted hover:text-danger" aria-label={`Remove ${line.name} from cart`} onClick={() => onLinesChange?.(lines.filter((l) => l.id !== line.id))}>
                  Remove
                </Button>
              </div>
            </StoreLineRow>
          </li>
        ))}
      </ul>
      <div className="grid gap-3 border-t border-line px-6 py-5">
        <div className="flex justify-between gap-4 text-sm">
          <span className="text-muted">Subtotal{totals.discount > 0 ? " after discount" : ""}</span>
          <span className="font-semibold tabular-nums">{formatUsd(totals.subtotal - totals.discount)}</span>
        </div>
        <p className="text-xs text-muted">
          {totals.toFreeShipping > 0 && !promo?.freeShipping ? `Add ${formatUsd(totals.toFreeShipping)} more for free shipping.` : "Your order ships free."}
        </p>
        <div className="grid grid-cols-2 gap-2">
          <a href={cartHref} onClick={onNavigate} className={buttonVariants({ variant: "surface" })}>
            View cart
          </a>
          <a href={checkoutHref} onClick={onNavigate} className={buttonVariants({ variant: "accent" })}>
            Checkout
          </a>
        </div>
      </div>
    </div>
  );
}
