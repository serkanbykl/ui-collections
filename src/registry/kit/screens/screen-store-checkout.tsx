"use client";

import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";

import { cn } from "@/registry/kit/lib/utils";
import { Alert } from "@/registry/kit/ui/alert";
import { Badge } from "@/registry/kit/ui/badge";
import { Dialog, DialogBody, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/registry/kit/ui/dialog";
import { Button, buttonVariants } from "@/registry/kit/ui/button";
import { Checkbox } from "@/registry/kit/ui/checkbox";
import { Input, type InputProps } from "@/registry/kit/ui/field";
import { RadioGroup, RadioGroupCard } from "@/registry/kit/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/registry/kit/ui/select";
import { EmptyState } from "@/registry/kit/ui/states";
import { Stepper } from "@/registry/kit/ui/stepper";
import { Switch } from "@/registry/kit/ui/switch";
import {
  formatUsd,
  sampleStorePromos,
  storeItemCount,
  StoreProductArt,
  storeLineOptions,
  storeTotals,
  STORE_FREE_SHIPPING_FROM,
  STORE_STANDARD_SHIPPING,
  type StoreCartLine,
  type StorePromo,
} from "@/registry/kit/screens/screen-store";
import { sampleStoreCart, storeCheckoutSteps, StoreSummaryRows } from "@/registry/kit/screens/screen-store-cart";
import { StoreConfirmationScreen, type StoreOrder } from "@/registry/kit/screens/screen-store-confirmation";

type MethodId = "standard" | "express" | "next-day";

const methods: { id: MethodId; title: string; detail: string; price: number; days: [number, number] }[] = [
  { id: "standard", title: "Standard", detail: "3–5 business days", price: STORE_STANDARD_SHIPPING, days: [3, 5] },
  { id: "express", title: "Express", detail: "1–2 business days", price: 18, days: [1, 2] },
  { id: "next-day", title: "Next business day", detail: "Order by 2 pm", price: 29, days: [1, 1] },
];

const countries = ["United States", "Canada", "United Kingdom", "Portugal", "Germany", "Netherlands"];

export interface StoreCheckoutValues {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  apartment: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
  cardNumber: string;
  cardName: string;
  expiry: string;
  cvc: string;
  billingAddress: string;
  billingCity: string;
  billingPostalCode: string;
}

export const emptyStoreCheckout: StoreCheckoutValues = {
  email: "",
  firstName: "",
  lastName: "",
  address: "",
  apartment: "",
  city: "",
  region: "",
  postalCode: "",
  country: "United States",
  cardNumber: "",
  cardName: "",
  expiry: "",
  cvc: "",
  billingAddress: "",
  billingCity: "",
  billingPostalCode: "",
};

type Field = keyof StoreCheckoutValues;
type Errors = Partial<Record<Field, string>>;
type Step = "details" | "shipping" | "payment";
const stepOrder: Step[] = ["details", "shipping", "payment"];

const digits = (value: string) => value.replace(/\D/g, "");

/** Luhn checksum, the same check card networks use. */
function luhn(number: string) {
  let sum = 0;
  for (let i = 0; i < number.length; i++) {
    let d = Number(number[number.length - 1 - i]);
    if (i % 2 === 1) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
  }
  return number.length >= 13 && sum % 10 === 0;
}

const cardBrand = (number: string) =>
  /^4/.test(number) ? "Visa" : /^(5[1-5]|2[2-7])/.test(number) ? "Mastercard" : /^3[47]/.test(number) ? "American Express" : "Card";

function validateDetails(v: StoreCheckoutValues): Errors {
  const e: Errors = {};
  if (!v.email.trim()) e.email = "Enter your email for the receipt.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) e.email = "Enter an email like name@example.com.";
  if (!v.firstName.trim()) e.firstName = "Enter a first name.";
  if (!v.lastName.trim()) e.lastName = "Enter a last name.";
  if (!v.address.trim()) e.address = "Enter a street address.";
  if (!v.city.trim()) e.city = "Enter a city.";
  if (!v.postalCode.trim()) e.postalCode = "Enter a postal code.";
  else if (v.country === "United States" && !/^\d{5}(-\d{4})?$/.test(v.postalCode.trim())) e.postalCode = "US ZIP codes have 5 digits, like 97205.";
  return e;
}

function validatePayment(v: StoreCheckoutValues, today: Date, billingSame: boolean): Errors {
  const e: Errors = {};
  const card = digits(v.cardNumber);
  if (!card) e.cardNumber = "Enter your card number.";
  else if (!luhn(card)) e.cardNumber = "This card number isn't valid. Check the digits.";
  if (!v.cardName.trim()) e.cardName = "Enter the name shown on the card.";
  const exp = /^(\d{2})\s*\/\s*(\d{2})$/.exec(v.expiry.trim());
  if (!exp) e.expiry = "Use MM / YY, like 08 / 28.";
  else {
    const month = Number(exp[1]);
    const year = 2000 + Number(exp[2]);
    if (month < 1 || month > 12) e.expiry = "Month must be between 01 and 12.";
    else if (year < today.getFullYear() || (year === today.getFullYear() && month < today.getMonth() + 1)) e.expiry = "This card has expired.";
  }
  const cvcLength = /^3[47]/.test(card) ? 4 : 3;
  if (digits(v.cvc).length !== cvcLength) e.cvc = `Enter the ${cvcLength}-digit code on the ${cvcLength === 4 ? "front" : "back"} of the card.`;
  if (!billingSame) {
    if (!v.billingAddress.trim()) e.billingAddress = "Enter the billing street address.";
    if (!v.billingCity.trim()) e.billingCity = "Enter the billing city.";
    if (!v.billingPostalCode.trim()) e.billingPostalCode = "Enter the billing postal code.";
  }
  return e;
}

const fieldOrder: Field[] = ["email", "firstName", "lastName", "address", "city", "postalCode", "cardNumber", "cardName", "expiry", "cvc", "billingAddress", "billingCity", "billingPostalCode"];

const fieldLabels: Partial<Record<Field, string>> = {
  email: "Email",
  firstName: "First name",
  lastName: "Last name",
  address: "Address",
  city: "City",
  postalCode: "Postal code",
  cardNumber: "Card number",
  cardName: "Name on card",
  expiry: "Expiry",
  cvc: "Security code",
  billingAddress: "Billing address",
  billingCity: "Billing city",
  billingPostalCode: "Billing postal code",
};

function addBusinessDays(from: Date, days: number) {
  const d = new Date(from);
  let left = days;
  while (left > 0) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() !== 0 && d.getDay() !== 6) left--;
  }
  return d;
}

const shortDate = (d: Date) => d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

export interface StoreCheckoutScreenProps {
  lines?: StoreCartLine[];
  promoCode?: string | null;
  promos?: StorePromo[];
  initialValues?: StoreCheckoutValues;
  /**
   * Called with the placed order once payment goes through. Without it the
   * confirmation shows in place.
   */
  onPlaceOrder?: (order: StoreOrder) => void;
  /** Anchors expiry checks and delivery dates, so server and client agree. */
  today?: Date;
  cartHref?: string;
  storeHref?: string;
  className?: string;
}

/**
 * Checkout in three steps (details, shipping, payment), each validated before
 * moving on, with Back, values kept between steps, a clickable stepper for
 * finished steps and an order summary beside it (collapsible on phones).
 * Payment checks the card (Luhn, expiry, CVC), can take a separate billing
 * address, shows a paying state, and declines card 4000 0000 0000 0002.
 */
export function StoreCheckoutScreen({
  lines = sampleStoreCart,
  promoCode = null,
  promos = sampleStorePromos,
  initialValues = emptyStoreCheckout,
  onPlaceOrder,
  today = new Date(2026, 9, 27),
  cartHref = "#/store/cart",
  storeHref = "#/store",
  className,
}: StoreCheckoutScreenProps) {
  const prefix = useId();
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Errors>({});
  const [step, setStep] = useState<Step>("details");
  const [method, setMethod] = useState<MethodId>("standard");
  const [newsletter, setNewsletter] = useState(true);
  const [billingSame, setBillingSame] = useState(true);
  const [paying, setPaying] = useState(false);
  const [declined, setDeclined] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [placed, setPlaced] = useState<StoreOrder | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const moved = useRef(false);
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => {
    // Move focus to the new step's heading, but not on first render.
    if (!moved.current) return;
    headingRef.current?.focus({ preventScroll: true });
    headingRef.current?.scrollIntoView({ block: "nearest" });
  }, [step]);

  const promo = promos.find((p) => p.code === promoCode) ?? null;
  const chosen = methods.find((m) => m.id === method)!;
  const totals = storeTotals(lines, promo, chosen.price, method === "standard");
  const standardFree = storeTotals(lines, promo).shipping === 0;
  const items = storeItemCount(lines);
  const fieldId = (name: Field) => `${prefix}-${name}`;
  const errorList = fieldOrder.filter((f) => errors[f]);
  const stepIndex = stepOrder.indexOf(step);

  if (placed) return <StoreConfirmationScreen order={placed} storeHref={storeHref} className={className} />;

  function set<K extends Field>(name: K, value: StoreCheckoutValues[K]) {
    setValues((v) => ({ ...v, [name]: value }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: undefined }));
    if (name === "cardNumber") setDeclined(false);
  }

  function goTo(next: Step) {
    moved.current = true;
    setShowErrors(false);
    setErrors({});
    setStep(next);
  }

  function fail(found: Errors) {
    setErrors(found);
    setShowErrors(true);
    requestAnimationFrame(() => errorRef.current?.focus());
  }

  function shipTo() {
    const name = `${values.firstName.trim()} ${values.lastName.trim()}`;
    return [
      name,
      [values.address.trim(), values.apartment.trim()].filter(Boolean).join(", "),
      `${values.city.trim()}${values.region.trim() ? `, ${values.region.trim()}` : ""} ${values.postalCode.trim()}`,
      values.country,
    ];
  }

  function submitDetails(event: FormEvent) {
    event.preventDefault();
    const found = validateDetails(values);
    if (Object.keys(found).length) return fail(found);
    goTo("shipping");
  }

  function submitShipping(event: FormEvent) {
    event.preventDefault();
    goTo("payment");
  }

  function submitPayment(event: FormEvent) {
    event.preventDefault();
    const found = validatePayment(values, today, billingSame);
    setDeclined(false);
    if (Object.keys(found).length) return fail(found);
    setShowErrors(false);
    setPaying(true);
    timer.current = setTimeout(() => {
      setPaying(false);
      const card = digits(values.cardNumber);
      if (card.endsWith("0002")) {
        // A decline blocks the purchase, so it gets a dialog rather than an inline note.
        setDeclined(true);
        return;
      }
      const from = addBusinessDays(today, chosen.days[0]);
      const to = addBusinessDays(today, chosen.days[1]);
      const order: StoreOrder = {
        number: `NW-${48213 + Math.floor(Math.random() * 900)}`,
        placedOn: today.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        email: values.email.trim(),
        name: `${values.firstName.trim()} ${values.lastName.trim()}`,
        address: shipTo(),
        shippingMethod: `${chosen.title} shipping`,
        arrives: chosen.days[0] === chosen.days[1] ? shortDate(from) : `${shortDate(from)} – ${shortDate(to)}`,
        payment: `${cardBrand(card)} ending ${card.slice(-4)}`,
        lines,
        promoCode: promo?.code ?? null,
        totals,
      };
      if (onPlaceOrder) onPlaceOrder(order);
      else setPlaced(order);
    }, 1100);
  }

  const field = (name: Field, props: Partial<InputProps> = {}) => (
    <Input id={fieldId(name)} label={fieldLabels[name] ?? name} value={values[name]} onChange={(e) => set(name, e.target.value)} error={errors[name]} required {...props} />
  );

  const errorSummary = showErrors && errorList.length > 0 && (
    <div ref={errorRef} tabIndex={-1} className="rounded-card outline-none focus-visible:outline-2 focus-visible:outline-accent">
      <Alert variant="danger" title={`Check ${errorList.length} ${errorList.length === 1 ? "field" : "fields"} to continue`}>
        <ul className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-sm">
          {errorList.map((f) => (
            <li key={f}>
              <button type="button" className="cursor-pointer text-danger underline underline-offset-4" onClick={() => document.getElementById(fieldId(f))?.focus()}>
                {fieldLabels[f]}
              </button>
            </li>
          ))}
        </ul>
      </Alert>
    </div>
  );

  // What earlier steps decided, with a way back to each.
  const review = (rows: { label: string; value: ReactNode; step: Step }[]) => (
    <dl className="surface divide-y divide-line rounded-card px-5 text-sm">
      {rows.map((row) => (
        <div key={row.label} className="flex flex-wrap items-center gap-x-4 gap-y-1 py-3">
          <dt className="w-16 shrink-0 text-muted">{row.label}</dt>
          <dd className="min-w-0 flex-1 basis-40 break-words">{row.value}</dd>
          <dd>
            <Button size="sm" variant="ghost" className="h-8 px-3" onClick={() => goTo(row.step)} aria-label={`Change ${row.label.toLowerCase()}`}>
              Change
            </Button>
          </dd>
        </div>
      ))}
    </dl>
  );

  const stepTitle = { details: "Contact and address", shipping: "Shipping method", payment: "Payment" }[step];

  const header = (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight md:text-4xl">Checkout</h1>
        <p className="mt-2 text-muted">Secure payment · free returns within 30 days</p>
      </div>
    </div>
  );

  if (lines.length === 0)
    return (
      <div className={cn("grid grid-cols-1 gap-6", className)}>
        {header}
        <div className="surface rounded-card">
          <EmptyState
            title="There's nothing to check out"
            description="Your cart is empty. Add something from the store, then come back here to pay."
            action={
              <a href={storeHref} className={buttonVariants({ variant: "accent" })}>
                Browse the store
              </a>
            }
          />
        </div>
      </div>
    );

  const back = (to: Step | "cart") =>
    to === "cart" ? (
      <a href={cartHref} className={buttonVariants({ variant: "ghost" })}>
        Back to cart
      </a>
    ) : (
      <Button variant="ghost" onClick={() => goTo(to)}>
        Back to {to}
      </Button>
    );

  const actions = (backTo: Step | "cart", submit: ReactNode) => (
    <div className="flex flex-wrap-reverse items-center justify-between gap-3">
      {back(backTo)}
      {submit}
    </div>
  );

  return (
    <div className={cn("grid grid-cols-1 gap-6", className)}>
      {header}
      <Stepper
        steps={storeCheckoutSteps}
        current={stepIndex + 1}
        onStepSelect={(i) => {
          if (i === 0) window.location.assign(cartHref);
          else goTo(stepOrder[i - 1]!);
        }}
        className="mx-auto max-w-2xl"
      />

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <aside aria-labelledby={`${prefix}-summary`} className="surface grid gap-5 rounded-card p-5 md:p-6 lg:sticky lg:top-24 lg:order-2">
          <div className="flex items-center justify-between gap-3">
            <h2 id={`${prefix}-summary`} className="text-sm font-medium text-fg/85">
              Order summary
            </h2>
            <button
              type="button"
              aria-expanded={summaryOpen}
              aria-controls={`${prefix}-summary-body`}
              onClick={() => setSummaryOpen((o) => !o)}
              className="flex cursor-pointer items-center gap-1.5 rounded-control text-sm font-semibold tabular-nums outline-none focus-visible:outline-2 focus-visible:outline-accent lg:hidden"
            >
              {formatUsd(totals.total)}
              <span className="sr-only">{summaryOpen ? ", hide order details" : ", show order details"}</span>
              <svg viewBox="0 0 24 24" className={cn("size-4 text-muted transition-[rotate] duration-300", summaryOpen && "rotate-180")} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
            <a href={cartHref} className="hidden text-sm text-accent underline-offset-4 hover:underline lg:inline">
              Edit cart
            </a>
          </div>
          <div id={`${prefix}-summary-body`} className={cn("gap-5", summaryOpen ? "grid" : "hidden", "lg:grid")}>
            <ul className="grid gap-3">
              {lines.map((line) => (
                <li key={line.id} className="flex items-center gap-3">
                  <span className="relative shrink-0">
                    <StoreProductArt kind={line.kind} tone={line.tone} className="size-12 rounded-field" />
                    <span className="absolute -top-1.5 -right-1.5 grid size-5 place-items-center rounded-full bg-fg text-[11px] font-semibold text-bg tabular-nums">
                      <span className="sr-only">Quantity </span>
                      {line.quantity}
                    </span>
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{line.name}</p>
                    <p className="truncate text-xs text-muted">{storeLineOptions(line) || "One size"}</p>
                  </div>
                  <span className="shrink-0 text-sm tabular-nums">{formatUsd(line.price * line.quantity)}</span>
                </li>
              ))}
            </ul>
            {promo && (
              <p className="flex flex-wrap items-center gap-2 text-xs text-muted">
                <Badge variant="success">{promo.code}</Badge>
                {promo.label}
              </p>
            )}
            <div className="border-t border-line pt-5">
              <StoreSummaryRows totals={totals} promo={promo} shippingLabel={`${chosen.title} shipping`} shippingNote={chosen.detail} />
            </div>
            <p className="text-xs text-muted">
              {items} {items === 1 ? "item" : "items"} · duties included
              <a href={cartHref} className="ml-2 text-accent underline-offset-4 hover:underline lg:hidden">
                Edit cart
              </a>
            </p>
          </div>
        </aside>

        <div className="grid min-w-0 gap-5 lg:order-1">
          <h2 ref={headingRef} tabIndex={-1} className="flex scroll-mt-24 items-center gap-3 text-lg font-semibold tracking-tight outline-none">
            <span aria-hidden className="grid size-7 place-items-center rounded-full bg-accent/15 text-xs text-accent tabular-nums">
              {stepIndex + 1}
            </span>
            {stepTitle}
            <span className="sr-only">, step {stepIndex + 1} of 3</span>
          </h2>

          {errorSummary}

          {step === "details" && (
            <form onSubmit={submitDetails} noValidate className="grid gap-5">
              <section aria-label="Contact" className="surface grid gap-4 rounded-card p-5 md:p-6">
                {field("email", { type: "email", autoComplete: "email", inputMode: "email", hint: "We send the receipt and tracking link here." })}
                <label className="flex cursor-pointer items-center gap-3 text-sm text-muted">
                  <Checkbox checked={newsletter} onCheckedChange={(c) => setNewsletter(c === true)} />
                  Email me about restocks and new pieces, about twice a month
                </label>
              </section>
              <section aria-label="Shipping address" className="surface grid gap-4 rounded-card p-5 sm:grid-cols-2 md:p-6">
                {field("firstName", { autoComplete: "given-name" })}
                {field("lastName", { autoComplete: "family-name" })}
                {field("address", { autoComplete: "address-line1", className: "sm:col-span-2" })}
                {field("apartment", { label: "Apartment, suite (optional)", autoComplete: "address-line2", required: false, className: "sm:col-span-2" })}
                {field("city", { autoComplete: "address-level2" })}
                {field("region", { label: "State or region (optional)", autoComplete: "address-level1", required: false })}
                {field("postalCode", { autoComplete: "postal-code" })}
                <div>
                  <span id={`${prefix}-country-label`} className="sr-only">
                    Country
                  </span>
                  <Select value={values.country} onValueChange={(v) => set("country", v)}>
                    <SelectTrigger aria-labelledby={`${prefix}-country-label ${prefix}-country-value`} className="h-14">
                      <span className="grid min-w-0 text-left">
                        <span aria-hidden className="text-[11.7px] text-muted">
                          Country
                        </span>
                        <span id={`${prefix}-country-value`} className="truncate text-[15px]">
                          <SelectValue />
                        </span>
                      </span>
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </section>
              {actions(
                "cart",
                <Button type="submit" variant="accent">
                  Continue to shipping
                </Button>,
              )}
            </form>
          )}

          {step === "shipping" && (
            <form onSubmit={submitShipping} className="grid gap-5">
              {review([
                { label: "Contact", value: values.email, step: "details" },
                { label: "Ship to", value: shipTo().slice(1).join(", "), step: "details" },
              ])}
              <RadioGroup value={method} onValueChange={(v) => setMethod(v as MethodId)} aria-label="Shipping method">
                {methods.map((m) => (
                  <RadioGroupCard
                    key={m.id}
                    value={m.id}
                    title={m.title}
                    description={`${m.detail} · arrives by ${shortDate(addBusinessDays(today, m.days[1]))}`}
                    aside={m.id === "standard" && standardFree ? "Free" : formatUsd(m.price)}
                  />
                ))}
              </RadioGroup>
              {!standardFree && <p className="text-xs text-muted">Standard shipping is free on orders over ${STORE_FREE_SHIPPING_FROM} after discounts.</p>}
              {actions(
                "details",
                <Button type="submit" variant="accent">
                  Continue to payment
                </Button>,
              )}
            </form>
          )}

          {step === "payment" && (
            <form onSubmit={submitPayment} noValidate className="grid gap-5">
              {review([
                { label: "Contact", value: values.email, step: "details" },
                { label: "Ship to", value: shipTo().slice(1).join(", "), step: "details" },
                { label: "Method", value: `${chosen.title} · ${chosen.detail} · ${method === "standard" && standardFree ? "Free" : formatUsd(chosen.price)}`, step: "shipping" },
              ])}
              <Dialog open={declined} onOpenChange={setDeclined}>
                <DialogContent
                  size="sm"
                  onCloseAutoFocus={(e) => {
                    // Back on the form, land in the card number ready to replace it.
                    e.preventDefault();
                    const input = document.getElementById(fieldId("cardNumber")) as HTMLInputElement | null;
                    input?.focus();
                    input?.select();
                  }}
                >
                  <DialogHeader
                    tone="danger"
                    icon={
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <path d="M3 7h18v12H3zM3 11h18M15 15.5l3 3m0-3-3 3" />
                      </svg>
                    }
                  >
                    <DialogTitle>Your card was declined</DialogTitle>
                    <DialogDescription>
                      Your bank didn&apos;t approve this payment, and nothing was charged. Your order is saved, so you can try another card now.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogBody>
                    <dl className="surface-field grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-1.5 rounded-field px-4 py-3 text-sm">
                      <dt className="text-muted">Card</dt>
                      <dd className="text-right tabular-nums">•••• {digits(values.cardNumber).slice(-4)}</dd>
                      <dt className="text-muted">Amount</dt>
                      <dd className="text-right font-medium tabular-nums">{formatUsd(totals.total)}</dd>
                    </dl>
                    <p className="mt-3 text-xs text-muted">If this card should work, your bank can tell you why it was declined.</p>
                  </DialogBody>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="ghost">Close</Button>
                    </DialogClose>
                    <DialogClose asChild>
                      <Button variant="accent">Use another card</Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <section aria-label="Card" className="surface grid gap-4 rounded-card p-5 sm:grid-cols-2 md:p-6">
                <p className="flex items-center gap-1.5 text-xs text-muted sm:col-span-2">
                  <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M7 11V8a5 5 0 0 1 10 0v3M5 11h14v10H5z" />
                  </svg>
                  Encrypted. We never store your full card number.
                </p>
                {field("cardNumber", {
                  autoComplete: "cc-number",
                  inputMode: "numeric",
                  className: "sm:col-span-2",
                  hint: "Test cards: 4242 4242 4242 4242 is approved, 4000 0000 0000 0002 is declined.",
                  onChange: (e) =>
                    set(
                      "cardNumber",
                      digits(e.target.value)
                        .slice(0, 19)
                        .replace(/(\d{4})(?=\d)/g, "$1 "),
                    ),
                })}
                {field("cardName", { autoComplete: "cc-name", className: "sm:col-span-2" })}
                {field("expiry", {
                  autoComplete: "cc-exp",
                  inputMode: "numeric",
                  hint: "MM / YY",
                  onChange: (e) => {
                    const d = digits(e.target.value).slice(0, 4);
                    set("expiry", d.length > 2 ? `${d.slice(0, 2)} / ${d.slice(2)}` : d);
                  },
                })}
                {field("cvc", { autoComplete: "cc-csc", inputMode: "numeric", hint: "3 digits on the back", onChange: (e) => set("cvc", digits(e.target.value).slice(0, 4)) })}
              </section>
              <section aria-label="Billing address" className="surface grid gap-4 rounded-card p-5 sm:grid-cols-2 md:p-6">
                <div className="flex items-center justify-between gap-4 text-sm sm:col-span-2">
                  <label htmlFor={`${prefix}-billing-same`} className="min-w-0 cursor-pointer">
                    <span className="block font-medium">Billing address same as shipping</span>
                    <span className="block truncate text-xs text-muted">{shipTo().slice(1, 3).join(", ")}</span>
                  </label>
                  <Switch
                    id={`${prefix}-billing-same`}
                    checked={billingSame}
                    onCheckedChange={(c) => {
                      setBillingSame(c);
                      if (c) setErrors((e) => ({ ...e, billingAddress: undefined, billingCity: undefined, billingPostalCode: undefined }));
                    }}
                  />
                </div>
                {!billingSame && (
                  <>
                    {field("billingAddress", { autoComplete: "billing address-line1", className: "sm:col-span-2" })}
                    {field("billingCity", { autoComplete: "billing address-level2" })}
                    {field("billingPostalCode", { autoComplete: "billing postal-code" })}
                  </>
                )}
              </section>
              {actions(
                "shipping",
                <Button type="submit" variant="accent" loading={paying}>
                  {paying ? "Processing payment…" : `Place order · ${formatUsd(totals.total)}`}
                </Button>,
              )}
              <p className="text-xs text-muted">By placing your order you agree to our terms of sale. You can cancel within an hour by replying to the confirmation email.</p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
