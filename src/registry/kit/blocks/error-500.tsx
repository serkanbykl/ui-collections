"use client";

import { useState } from "react";

import { StatusShell } from "@/registry/kit/lib/status-kit";
import { Button, ButtonShine, buttonVariants } from "@/registry/kit/ui/button";
import { Reveal, TextReveal } from "@/registry/kit/ui/reveal";

export interface Error500Props {
  title?: string;
  description?: string;
  /** Error reference support can look up. */
  reference?: string;
  homeHref?: string;
  /** Public status page. Pass null to hide the link. */
  statusHref?: string | null;
  supportHref?: string;
  /** Retries the failed request. Without it the page reloads. */
  onRetry?: () => void | Promise<void>;
}

export function Error500({
  title = "Something broke on our side.",
  description = "Your work is saved. We've logged the error and the on-call engineer has been paged.",
  reference = "ERR-7Q4K-2291",
  homeHref = "/",
  statusHref = "/status",
  supportHref = "/contact",
  onRetry,
}: Error500Props) {
  const [pending, setPending] = useState(false);
  const [copied, setCopied] = useState(false);

  return (
    <StatusShell tile="500">
      <TextReveal as="h1" trigger="load" delay={200} className="mx-auto mt-10 max-w-2xl font-display text-4xl md:text-5xl">
        {title}
      </TextReveal>
      <Reveal as="p" trigger="load" delay={400} className="mx-auto mt-4 max-w-md text-muted">
        {description}
      </Reveal>
      <Reveal trigger="load" delay={550} className="mt-10 flex flex-wrap justify-center gap-3">
        <Button
          variant="solid"
          size="lg"
          shine
          loading={pending}
          onClick={async () => {
            if (!onRetry) return window.location.reload();
            setPending(true);
            await onRetry();
            setPending(false);
          }}
        >
          {pending ? "Retrying…" : "Try again"}
        </Button>
        <a href={homeHref} className={buttonVariants({ size: "lg" })}>
          <ButtonShine />
          Go to home
        </a>
      </Reveal>
      <Reveal trigger="load" delay={700} className="mt-10 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-muted">
        <span className="inline-flex items-center gap-2">
          Reference
          <button
            type="button"
            className="surface cursor-pointer rounded-control px-2.5 py-1 font-mono text-xs text-fg transition-colors hover:bg-surface-hover"
            onClick={async () => {
              await navigator.clipboard?.writeText(reference).catch(() => undefined);
              setCopied(true);
              setTimeout(() => setCopied(false), 1800);
            }}
            aria-label={`Copy reference ${reference}`}
          >
            {reference}
          </button>
          <span role="status" className="w-14 text-left text-xs text-success">
            {copied ? "Copied" : ""}
          </span>
        </span>
        {statusHref && (
          <a href={statusHref} className="underline-offset-4 hover:text-fg hover:underline">
            Check system status
          </a>
        )}
        <a href={supportHref} className="underline-offset-4 hover:text-fg hover:underline">
          Contact support
        </a>
      </Reveal>
    </StatusShell>
  );
}
