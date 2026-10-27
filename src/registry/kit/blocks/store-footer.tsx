"use client";

import { useState, type FormEvent, type ReactNode } from "react";

import { Badge } from "@/registry/kit/ui/badge";
import { BrandMark } from "@/registry/kit/ui/brand-mark";
import { Button } from "@/registry/kit/ui/button";
import { Input } from "@/registry/kit/ui/field";

export interface StoreFooterColumn {
  title: string;
  links: { label: string; href: string }[];
}

export interface StoreFooterProps {
  brand: { name: string; href: string; logo?: ReactNode };
  tagline?: string;
  columns?: StoreFooterColumn[];
  newsletter?: { title: string; description: string } | null;
  /** Receives the email. Throw to show an inline error. */
  onSubscribe?: (email: string) => void | Promise<void>;
  /** Accepted payment methods, shown as labels. */
  payments?: string[];
  legal?: { label: string; href: string }[];
  year?: number;
  className?: string;
}

const looksLikeEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

function Signup({
  title,
  description,
  onSubscribe,
}: {
  title: string;
  description: string;
  onSubscribe?: (email: string) => void | Promise<void>;
}) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string>();
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState<string | null>(null);

  async function submit(event: FormEvent) {
    event.preventDefault();
    const value = email.trim();
    if (!value) return setError("Enter your email address.");
    if (!looksLikeEmail(value))
      return setError("Enter an email like name@example.com.");
    setError(undefined);
    setPending(true);
    try {
      await (onSubscribe
        ? onSubscribe(value)
        : new Promise((resolve) => setTimeout(resolve, 700)));
      setSent(value);
    } catch {
      setError("We couldn't sign you up just now. Try again in a minute.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="min-w-0">
      <h2 className="text-base font-semibold">{title}</h2>
      <p className="mt-1.5 text-sm text-muted">{description}</p>
      {sent ? (
        <p role="status" className="mt-4 text-sm text-success">
          You&apos;re signed up. We sent a confirmation link to {sent}.
        </p>
      ) : (
        <form
          noValidate
          onSubmit={submit}
          // Subgrid rows keep the button level with the field, label above and error below.
          className="mt-4 grid grid-cols-[minmax(0,1fr)_auto] gap-x-2"
        >
          <Input
            label="Email address"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError(undefined);
            }}
            error={error}
            size="md"
            className="row-span-3 grid min-w-0 grid-rows-subgrid"
          />
          <Button
            type="submit"
            variant="solid"
            size="md"
            loading={pending}
            className="col-start-2 row-start-2"
          >
            Sign up
          </Button>
        </form>
      )}
    </div>
  );
}

/** Storefront footer: brand, link columns, a newsletter signup with validation, payment methods and legal links. */
export function StoreFooter({
  brand,
  tagline,
  columns = [],
  newsletter = {
    title: "Get new pieces first",
    description:
      "About two emails a month: restocks, new fabrics and the odd repair story.",
  },
  onSubscribe,
  payments = ["Visa", "Mastercard", "Amex", "Apple Pay", "PayPal"],
  legal = [],
  year = 2026,
  className,
}: StoreFooterProps) {
  return (
    <footer
      className={className ?? "border-t border-line bg-bg-deep/50 text-fg"}
    >
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:px-8 md:py-16 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,2fr)]">
        <div className="grid content-start gap-8">
          <div>
            <a
              href={brand.href}
              className="inline-flex items-center gap-2.5 rounded-control text-lg font-semibold tracking-tight outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
              {brand.logo ?? <BrandMark />}
              {brand.name}
            </a>
            {tagline && (
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">
                {tagline}
              </p>
            )}
          </div>
          {newsletter && <Signup {...newsletter} onSubscribe={onSubscribe} />}
        </div>
        {columns.length > 0 && (
          <nav
            aria-label="Store footer"
            className="grid grid-cols-2 gap-8 sm:grid-cols-3"
          >
            {columns.map((col) => (
              <div key={col.title}>
                <h2 className="text-xs font-medium tracking-[0.16em] text-muted uppercase">
                  {col.title}
                </h2>
                <ul className="mt-4 grid gap-2.5 text-sm">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="rounded-sm text-fg/80 transition-colors outline-none hover:text-fg focus-visible:outline-2 focus-visible:outline-accent"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        )}
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 text-xs text-muted md:flex-row md:items-center md:justify-between md:px-8">
          <p>
            © {year} {brand.name}. Prices in USD, duties included.
          </p>
          {payments.length > 0 && (
            <ul
              aria-label="Payment methods we accept"
              className="flex flex-wrap gap-1.5"
            >
              {payments.map((p) => (
                <li key={p}>
                  <Badge variant="outline">{p}</Badge>
                </li>
              ))}
            </ul>
          )}
          {legal.length > 0 && (
            <ul className="flex flex-wrap gap-x-4 gap-y-2">
              {legal.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="hover:text-fg">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </footer>
  );
}
