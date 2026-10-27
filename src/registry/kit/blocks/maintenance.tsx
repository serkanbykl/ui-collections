"use client";

import { NotifyForm, StatusShell } from "@/registry/kit/lib/status-kit";
import { cn } from "@/registry/kit/lib/utils";
import { Badge } from "@/registry/kit/ui/badge";
import { Progress } from "@/registry/kit/ui/progress";
import { Reveal, TextReveal } from "@/registry/kit/ui/reveal";

export interface MaintenanceUpdate {
  /** Display time, e.g. "09:42 UTC". */
  time: string;
  text: string;
  tone?: "info" | "success" | "warning";
}

export interface MaintenanceProps {
  title?: string;
  description?: string;
  /** Human-readable window, e.g. "Sun 26 Oct, 08:00–10:30 UTC". */
  schedule?: string;
  /** 0–100. Pass undefined to hide the bar. */
  progress?: number;
  /** Newest first. */
  updates?: MaintenanceUpdate[];
  /** Public status page. Pass null to hide the link. */
  statusHref?: string | null;
  privacyHref?: string;
  /** Saves an email to notify when service returns. */
  onSubscribe?: (email: string) => string | void | Promise<string | void>;
}

const defaultUpdates: MaintenanceUpdate[] = [
  { time: "09:42 UTC", text: "Database migration is 64% through. Reads will return first.", tone: "info" },
  { time: "08:51 UTC", text: "Backups verified across both regions.", tone: "success" },
  { time: "08:03 UTC", text: "Maintenance started. Sign-in and sync are paused.", tone: "warning" },
];

const dot = { info: "bg-info", success: "bg-success", warning: "bg-warning" };

export function Maintenance({
  title = "We're upgrading the database.",
  description = "Your data is safe. Sign-in and sync are paused until the migration finishes.",
  schedule = "Sun 26 Oct, 08:00–10:30 UTC",
  progress = 64,
  updates = defaultUpdates,
  statusHref = "/status",
  privacyHref = "/privacy",
  onSubscribe,
}: MaintenanceProps) {
  return (
    <StatusShell
      tile={
        <svg viewBox="0 0 24 24" className="size-[0.8em]" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.7 6.3a4 4 0 0 0-5.4 5.2L3.5 17.3a1.8 1.8 0 0 0 2.5 2.5l5.8-5.8a4 4 0 0 0 5.2-5.4l-2.5 2.5-2.1-.4-.4-2.1 2.7-2.5Z" />
        </svg>
      }
    >
      <Reveal trigger="load" delay={100} className="mt-8">
        <Badge variant="warning" dot>
          Scheduled maintenance
        </Badge>
      </Reveal>
      <TextReveal as="h1" trigger="load" delay={200} className="mx-auto mt-5 max-w-2xl font-display text-4xl md:text-5xl">
        {title}
      </TextReveal>
      <Reveal as="p" trigger="load" delay={400} className="mx-auto mt-4 max-w-md text-muted">
        {description}
      </Reveal>

      <Reveal trigger="load" delay={550} className="surface mx-auto mt-10 max-w-lg rounded-card p-5 text-left sm:p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h2 className="text-sm font-medium">Planned window</h2>
          <span className="text-sm text-muted tabular-nums">{schedule}</span>
        </div>
        {progress !== undefined && (
          <div className="mt-4">
            <Progress value={progress} aria-label="Maintenance progress" />
            <p className="mt-2 text-xs text-muted tabular-nums">{progress}% complete</p>
          </div>
        )}
        {updates.length > 0 && (
          <>
            <h2 className="mt-6 text-sm font-medium">Updates</h2>
            <ol className="mt-3 grid gap-4">
              {updates.map((update, i) => (
                <li key={update.time + update.text} className="grid grid-cols-[auto_minmax(0,1fr)] gap-3">
                  <span className={cn("mt-1.5 size-2 rounded-full", dot[update.tone ?? "info"], i > 0 && "opacity-60")} aria-hidden />
                  <div>
                    <p className="text-sm">{update.text}</p>
                    <p className="mt-0.5 text-xs text-muted tabular-nums">{update.time}</p>
                  </div>
                </li>
              ))}
            </ol>
          </>
        )}
        {statusHref && (
          <a href={statusHref} className="mt-6 inline-block text-sm text-accent underline-offset-4 hover:underline">
            Follow live on the status page
          </a>
        )}
      </Reveal>

      <Reveal trigger="load" delay={700} className="mt-10">
        <p className="mb-4 text-sm text-muted">Get one email when everything is back.</p>
        <NotifyForm cta="Notify me" done={(email) => `Got it. We'll email ${email} the moment service is back.`} onSubscribe={onSubscribe} privacyHref={privacyHref} />
      </Reveal>
    </StatusShell>
  );
}
