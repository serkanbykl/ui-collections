"use client";

import { useEffect, useState, type ReactNode } from "react";

import { cn } from "@/registry/kit/lib/utils";
import { AuroraBackdrop } from "@/registry/kit/ui/aurora-backdrop";
import { Avatar } from "@/registry/kit/ui/avatar";
import { BrandMark } from "@/registry/kit/ui/brand-mark";
import { Button } from "@/registry/kit/ui/button";

/*
 * Shared pieces for the auth blocks: page layouts, the brand row, provider
 * buttons, email checks and a password strength meter. Blocks import these
 * instead of repeating them.
 */

export const looksLikeEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

/** 0–4: length 8+, length 12+, mixed case, digit or symbol. */
export function passwordStrength(password: string) {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/\d/.test(password) || /[^A-Za-z0-9]/.test(password)) score++;
  return score;
}

const strengthLabels = ["Too short", "Weak", "Fair", "Good", "Strong"];

/** Four-segment strength bar with a text label, so colour is never the only signal. */
export function PasswordStrength({ password }: { password: string }) {
  const score = passwordStrength(password);
  return (
    <div className="flex items-center gap-3" aria-live="polite">
      <div className="flex flex-1 gap-1" aria-hidden>
        {[1, 2, 3, 4].map((step) => (
          <span
            key={step}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors duration-300",
              score >= step ? (score >= 3 ? "bg-accent" : "bg-warning") : "bg-fg/10",
            )}
          />
        ))}
      </div>
      <span className="w-20 text-right text-xs text-muted">{password ? strengthLabels[score] : "Strength"}</span>
    </div>
  );
}

/** Wordmark linking home. */
export function AuthBrand({ brand, logo, homeHref }: { brand: string; logo?: ReactNode; homeHref: string }) {
  return (
    <a href={homeHref} className="flex w-fit items-center gap-2 rounded-control font-display text-2xl tracking-tight outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent">
      {logo ?? <BrandMark />}
      {brand}
    </a>
  );
}

/** Centred card on the aurora: forgot, reset, OTP, verify, lock… */
export function AuthCenter({ children, wide = false }: { children: ReactNode; wide?: boolean }) {
  return (
    <section className="relative isolate grid min-h-[max(40rem,100dvh)] place-items-center overflow-hidden bg-bg-deep px-5 py-16 text-fg">
      <AuroraBackdrop />
      <div className={cn("surface w-full rounded-card p-6 sm:p-8", wide ? "max-w-md" : "max-w-sm")}>{children}</div>
    </section>
  );
}

export interface AuthQuote {
  quote: string;
  name: string;
  role: string;
}

/** Form on one side, a brand panel with a customer quote and proof on the other. Stacks on small screens. */
export function AuthSplit({
  children,
  quote,
  proof,
  side = "right",
}: {
  children: ReactNode;
  quote: AuthQuote;
  /** Short proof line under the quote, e.g. "Trusted by 4,183 teams". */
  proof?: string;
  side?: "left" | "right";
}) {
  return (
    <section className="grid min-h-[max(44rem,100dvh)] bg-bg text-fg lg:grid-cols-2">
      <div className={cn("flex items-center justify-center px-5 py-14 sm:px-10", side === "left" && "lg:order-2")}>
        <div className="w-full max-w-sm">{children}</div>
      </div>
      <aside
        aria-label="What customers say"
        className="relative isolate hidden overflow-hidden bg-bg-deep p-12 lg:flex lg:flex-col lg:justify-end"
      >
        <AuroraBackdrop />
        <figure className="surface max-w-md rounded-card p-8">
          <blockquote className="font-display text-2xl leading-snug">“{quote.quote}”</blockquote>
          <figcaption className="mt-6 flex items-center gap-3">
            <Avatar alt={quote.name} className="bg-accent/15" />
            <span>
              <span className="block text-sm font-medium">{quote.name}</span>
              <span className="block text-xs text-muted">{quote.role}</span>
            </span>
          </figcaption>
        </figure>
        {proof && <p className="mt-6 text-sm text-muted">{proof}</p>}
      </aside>
    </section>
  );
}

const providers = [
  {
    name: "GitHub",
    path: "M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.3-3.4-1.3-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.6 2.4 1.1 3 .9.1-.7.4-1.1.6-1.4-2.2-.2-4.6-1.1-4.6-5a3.9 3.9 0 0 1 1-2.7 3.6 3.6 0 0 1 .1-2.7s.8-.3 2.8 1a9.6 9.6 0 0 1 5 0c1.9-1.3 2.8-1 2.8-1 .5 1.4.2 2.4.1 2.7a3.9 3.9 0 0 1 1 2.7c0 3.9-2.3 4.7-4.6 5 .4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5A10 10 0 0 0 12 2Z",
  },
  {
    name: "Google",
    path: "M21 12.2c0-.7-.1-1.3-.2-1.9H12v3.6h5a4.3 4.3 0 0 1-1.9 2.8v2.3h3A9 9 0 0 0 21 12.2ZM12 21a8.9 8.9 0 0 0 6.1-2.2l-3-2.3a5.5 5.5 0 0 1-8.2-2.9H3.8v2.4A9 9 0 0 0 12 21Zm-5.1-7.4a5.4 5.4 0 0 1 0-3.5V7.7H3.8a9 9 0 0 0 0 8.1l3.1-2.2ZM12 6.6a4.9 4.9 0 0 1 3.4 1.3l2.6-2.6A8.7 8.7 0 0 0 12 3a9 9 0 0 0-8.2 4.7l3.1 2.4A5.4 5.4 0 0 1 12 6.6Z",
  },
];

/** GitHub and Google buttons. Without `onProvider` they say the provider isn't connected instead of doing nothing. */
export function ProviderButtons({ onProvider, verb = "Sign in" }: { onProvider?: (provider: string) => void; verb?: string }) {
  const [busy, setBusy] = useState<string>();
  const [notice, setNotice] = useState<string>();

  async function choose(name: string) {
    setNotice(undefined);
    if (onProvider) return onProvider(name);
    setBusy(name);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setBusy(undefined);
    setNotice(`${name} isn't connected yet. Use your email for now.`);
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-3">
        {providers.map((p) => (
          <Button key={p.name} className="w-full" loading={busy === p.name} onClick={() => choose(p.name)} aria-label={`${verb} with ${p.name}`}>
            <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden>
              <path d={p.path} />
            </svg>
            {p.name}
          </Button>
        ))}
      </div>
      {notice && (
        <p role="status" className="mt-3 text-center text-xs text-muted">
          {notice}
        </p>
      )}
    </div>
  );
}

/** "or with email" rule between providers and the form. */
export function AuthDivider({ label = "or with email" }: { label?: string }) {
  return (
    <div className="my-6 flex items-center gap-3 text-xs text-muted">
      <span className="h-px flex-1 bg-line" aria-hidden />
      {label}
      <span className="h-px flex-1 bg-line" aria-hidden />
    </div>
  );
}

/** Round tinted icon above a heading, for confirmation-style screens. */
export function AuthIcon({ children, tone = "accent" }: { children: ReactNode; tone?: "accent" | "success" | "warning" | "danger" }) {
  const tones = {
    accent: "bg-accent/12 text-accent",
    success: "bg-success-soft text-success",
    warning: "bg-warning-soft text-warning",
    danger: "bg-danger-soft text-danger",
  };
  return (
    <span aria-hidden className={cn("grid size-12 place-items-center rounded-control [&_svg]:size-6", tones[tone])}>
      {children}
    </span>
  );
}

/** Seconds left before "Resend" unlocks. `restart()` starts the wait again. */
export function useResendTimer(seconds: number, startLocked = true) {
  const [left, setLeft] = useState(startLocked ? seconds : 0);
  useEffect(() => {
    if (left <= 0) return;
    const id = setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [left]);
  return { left, restart: () => setLeft(seconds) };
}

/** Pause used by blocks when no handler is wired, so actions still visibly respond. */
export const pretend = (ms = 700) => new Promise<void>((resolve) => setTimeout(resolve, ms));
