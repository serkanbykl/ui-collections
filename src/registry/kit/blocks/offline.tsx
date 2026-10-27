"use client";

import { useEffect, useState } from "react";

import { StatusShell } from "@/registry/kit/lib/status-kit";
import { Button } from "@/registry/kit/ui/button";
import { Reveal, TextReveal } from "@/registry/kit/ui/reveal";

export interface OfflineProps {
  title?: string;
  description?: string;
  /** Pages kept for offline reading. Pass an empty array to hide the list. */
  saved?: { label: string; href: string }[];
  /** Retries the connection. Without it the page reloads once the browser reports a connection. */
  onRetry?: () => void | Promise<void>;
}

const defaultSaved = [
  { label: "Q3 planning notes", href: "/docs/q3-planning" },
  { label: "Release checklist", href: "/docs/release-checklist" },
  { label: "On-call handbook", href: "/docs/on-call" },
];

export function Offline({
  title = "You're offline.",
  description = "Changes you make are kept on this device and sync when you reconnect.",
  saved = defaultSaved,
  onRetry,
}: OfflineProps) {
  const [online, setOnline] = useState<boolean>();
  const [checking, setChecking] = useState(false);
  const [note, setNote] = useState<string>();

  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  async function retry() {
    setChecking(true);
    setNote(undefined);
    if (onRetry) await onRetry();
    else await new Promise((r) => setTimeout(r, 900));
    setChecking(false);
    if (onRetry) return;
    if (navigator.onLine) setNote("The connection is back. Reload to pick up where you left off.");
    else setNote("Still no connection. We'll keep trying in the background.");
  }

  return (
    <StatusShell
      tile={
        <svg viewBox="0 0 24 24" className="size-[0.8em]" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 8.8a15 15 0 0 1 4.2-2.6M9.8 5.2A15 15 0 0 1 22 8.8M5 12.3a10 10 0 0 1 3.6-2M15.4 10.4a10 10 0 0 1 3.6 1.9M8.5 15.8a5 5 0 0 1 7 0" />
          <circle cx="12" cy="19.5" r="0.6" fill="currentColor" />
          <path d="M3 3l18 18" />
        </svg>
      }
    >
      <TextReveal as="h1" trigger="load" delay={200} className="mx-auto mt-10 max-w-2xl font-display text-4xl md:text-5xl">
        {title}
      </TextReveal>
      <Reveal as="p" trigger="load" delay={400} className="mx-auto mt-4 max-w-md text-muted">
        {description}
      </Reveal>
      <Reveal trigger="load" delay={550} className="mt-8 flex flex-col items-center gap-3">
        <span className="inline-flex items-center gap-2 text-sm text-muted">
          <span className={online ? "size-2 rounded-full bg-success" : "size-2 rounded-full bg-warning"} aria-hidden />
          {online === undefined ? "Checking connection" : online ? "Your browser reports a connection" : "No network connection"}
        </span>
        {note?.startsWith("The connection") ? (
          <Button variant="solid" size="lg" onClick={() => window.location.reload()}>
            Reload page
          </Button>
        ) : (
          <Button variant="solid" size="lg" shine loading={checking} onClick={retry}>
            {checking ? "Checking…" : "Try again"}
          </Button>
        )}
        <p role="status" className="min-h-5 text-sm text-muted">
          {note}
        </p>
      </Reveal>

      {saved.length > 0 && (
        <Reveal as="section" trigger="load" delay={700} aria-labelledby="offline-saved" className="surface mx-auto mt-6 max-w-sm rounded-card p-5 text-left">
          <h2 id="offline-saved" className="text-sm font-medium">
            Available offline
          </h2>
          <ul className="mt-3 grid gap-1">
            {saved.map((page) => (
              <li key={page.href}>
                <a href={page.href} className="-mx-2 flex items-center justify-between rounded-control px-2 py-2 text-sm text-muted transition-colors hover:bg-fg/5 hover:text-fg">
                  {page.label}
                  <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
                    <path d="M9 6l6 6-6 6" />
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      )}
    </StatusShell>
  );
}
