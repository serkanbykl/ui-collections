"use client";

import { useState } from "react";

import { Button } from "@/registry/kit/ui/button";
import { Input } from "@/registry/kit/ui/field";
import { Reveal } from "@/registry/kit/ui/reveal";

export interface NewsletterProps {
  title?: string;
  description?: string;
  /** Receives the email. Throw to show an inline error. Defaults to a short no-op so the block is self-contained. */
  onSubscribe?: (email: string) => void | Promise<void>;
}

const looksLikeEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export function Newsletter({
  title = "One good email a month.",
  description = "Product updates, engineering notes and nothing else. Unsubscribe in one click.",
  onSubscribe,
}: NewsletterProps) {
  const [sent, setSent] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string>();

  return (
    <section className="bg-bg px-6 py-20 text-fg md:px-8">
      <div className="surface mx-auto grid max-w-5xl items-center gap-8 rounded-card p-8 md:grid-cols-2 md:p-12">
        <div>
          <h2 className="font-display text-4xl leading-[1.05] md:text-5xl">{title}</h2>
          <p className="mt-4 text-muted">{description}</p>
        </div>
        {sent ? (
          <Reveal trigger="load" role="status" className="text-center md:text-left">
            <p className="font-display text-3xl">You&apos;re on the list.</p>
            <p className="mt-2 text-sm text-muted">Check your inbox and confirm with one click.</p>
          </Reveal>
        ) : (
          <form
            noValidate
            className="flex flex-col gap-3 sm:flex-row sm:items-start"
            onSubmit={async (e) => {
              e.preventDefault();
              const email = String(new FormData(e.currentTarget).get("email") ?? "").trim();
              if (!looksLikeEmail(email)) {
                setError("Enter an email address like name@company.com.");
                return;
              }
              setError(undefined);
              setPending(true);
              try {
                await (onSubscribe ? onSubscribe(email) : new Promise((resolve) => setTimeout(resolve, 700)));
                setSent(true);
              } catch {
                setError("We couldn't subscribe you just now. Try again in a minute.");
              } finally {
                setPending(false);
              }
            }}
          >
            <Input
              label="Email address"
              name="email"
              type="email"
              autoComplete="email"
              required
              error={error}
              onChange={() => error && setError(undefined)}
              className="flex-1"
            />
            <Button type="submit" variant="solid" size="lg" loading={pending} className="h-14">
              Subscribe
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}
