"use client";

import { useState } from "react";

import { StatusShell } from "@/registry/kit/lib/status-kit";
import { Avatar } from "@/registry/kit/ui/avatar";
import { Button, ButtonShine, buttonVariants } from "@/registry/kit/ui/button";
import { Reveal, TextReveal } from "@/registry/kit/ui/reveal";

export interface Error403Props {
  title?: string;
  description?: string;
  /** Signed-in account, so people can tell if they're in the wrong one. */
  account?: { name: string; email: string };
  homeHref?: string;
  switchAccountHref?: string;
  /** Sends an access request. Return an error message to show it. */
  onRequestAccess?: () => string | void | Promise<string | void>;
}

export function Error403({
  title = "You don't have access to this page.",
  description = "It belongs to the Finance workspace. An admin can add you, usually within a working day.",
  account = { name: "Ada Lindqvist", email: "ada@northwind.dev" },
  homeHref = "/",
  switchAccountHref = "/signin",
  onRequestAccess,
}: Error403Props) {
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; text: string }>();

  return (
    <StatusShell tile="403">
      <TextReveal as="h1" trigger="load" delay={200} className="mx-auto mt-10 max-w-2xl font-display text-4xl md:text-5xl">
        {title}
      </TextReveal>
      <Reveal as="p" trigger="load" delay={400} className="mx-auto mt-4 max-w-md text-muted">
        {description}
      </Reveal>

      <Reveal trigger="load" delay={500} className="surface mx-auto mt-8 flex max-w-sm items-center gap-3 rounded-card p-3 pr-4 text-left">
        <Avatar alt={account.name} />
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-medium">{account.name}</span>
          <span className="block truncate text-xs text-muted">{account.email}</span>
        </span>
        <a href={switchAccountHref} className="shrink-0 text-sm text-accent underline-offset-4 hover:underline">
          Switch
        </a>
      </Reveal>

      <Reveal trigger="load" delay={650} className="mt-8 flex flex-wrap justify-center gap-3">
        {result?.ok ? (
          <p role="status" className="rounded-control bg-success-soft px-4 py-3 text-sm text-success">
            {result.text}
          </p>
        ) : (
          <Button
            variant="solid"
            size="lg"
            shine
            loading={pending}
            onClick={async () => {
              setPending(true);
              const error = onRequestAccess ? await onRequestAccess() : await new Promise<void>((r) => setTimeout(r, 800));
              setPending(false);
              setResult(error ? { ok: false, text: error } : { ok: true, text: "Request sent to 3 workspace admins. We'll email you when it's approved." });
            }}
          >
            {pending ? "Sending request…" : "Request access"}
          </Button>
        )}
        <a href={homeHref} className={buttonVariants({ size: "lg" })}>
          <ButtonShine />
          Go to home
        </a>
      </Reveal>
      {result && !result.ok && (
        <p role="alert" className="mt-4 text-sm text-danger">
          {result.text}
        </p>
      )}
    </StatusShell>
  );
}
