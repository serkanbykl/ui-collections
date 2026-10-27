"use client";

import { useState, type FormEvent, type ReactNode } from "react";

import { cn } from "@/registry/kit/lib/utils";
import { AuroraBackdrop } from "@/registry/kit/ui/aurora-backdrop";
import { Button } from "@/registry/kit/ui/button";
import { Input } from "@/registry/kit/ui/field";
import { Reveal } from "@/registry/kit/ui/reveal";

/*
 * Shared frame for system pages (500, 403, offline, maintenance, coming soon):
 * a centred column on the aurora with a big code or icon tile on top.
 */

export function StatusShell({ tile, children, className }: { tile: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className="relative isolate grid min-h-[max(40rem,100dvh)] place-items-center overflow-hidden bg-bg-deep px-5 py-20 text-center text-fg">
      <AuroraBackdrop />
      <div className={cn("w-full max-w-xl", className)}>
        <Reveal trigger="load" aria-hidden className="surface mx-auto inline-grid min-w-32 place-items-center rounded-card px-8 py-4 font-display text-[clamp(4.5rem,16vw,8.5rem)] leading-none tracking-[-0.05em]">
          {tile}
        </Reveal>
        {children}
      </div>
    </section>
  );
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Single email field with a button; shows its own confirmation when no handler is wired. */
export function NotifyForm({
  label = "Email",
  cta,
  done,
  onSubscribe,
  privacyHref,
}: {
  label?: string;
  cta: string;
  /** Confirmation text, given the address. */
  done: (email: string) => string;
  onSubscribe?: (email: string) => string | void | Promise<string | void>;
  privacyHref?: string;
}) {
  const [error, setError] = useState<string>();
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState<string>();

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = String(new FormData(e.currentTarget).get("email") ?? "").trim();
    if (!emailPattern.test(email)) return setError("Enter an email like name@company.com.");
    setError(undefined);
    setPending(true);
    const result = onSubscribe ? await onSubscribe(email) : await new Promise<void>((r) => setTimeout(r, 700));
    setPending(false);
    if (result) setError(result);
    else setSent(email);
  }

  if (sent)
    return (
      <p role="status" className="mx-auto max-w-md rounded-control bg-success-soft px-4 py-3 text-sm text-success">
        {done(sent)}
      </p>
    );

  return (
    <form noValidate onSubmit={submit} className="mx-auto w-full max-w-md text-left">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <Input label={label} name="email" type="email" autoComplete="email" required error={error} className="flex-1" />
        <Button type="submit" variant="solid" loading={pending} className="h-14 shrink-0">
          {pending ? "Saving…" : cta}
        </Button>
      </div>
      {privacyHref && (
        <p className="mt-3 text-xs text-muted">
          One email, no newsletter. See our{" "}
          <a href={privacyHref} className="text-fg/85 underline-offset-4 hover:underline">
            privacy policy
          </a>
          .
        </p>
      )}
    </form>
  );
}
