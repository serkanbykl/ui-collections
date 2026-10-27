"use client";

import { useEffect, useState } from "react";

import { NotifyForm } from "@/registry/kit/lib/status-kit";
import { AuroraBackdrop } from "@/registry/kit/ui/aurora-backdrop";
import { Badge } from "@/registry/kit/ui/badge";
import { BrandMark } from "@/registry/kit/ui/brand-mark";
import { Reveal, TextReveal } from "@/registry/kit/ui/reveal";

export interface ComingSoonProps {
  brand?: string;
  logo?: React.ReactNode;
  homeHref?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  /** Launch time as an ISO string. Without it the demo counts down 23 days from first render. */
  launchAt?: string;
  privacyHref?: string;
  /** Adds an email to the launch list. Return an error message to show it. */
  onSubscribe?: (email: string) => string | void | Promise<string | void>;
}

const units = [
  { key: "days", label: "Days", ms: 86_400_000 },
  { key: "hours", label: "Hours", ms: 3_600_000 },
  { key: "minutes", label: "Minutes", ms: 60_000 },
  { key: "seconds", label: "Seconds", ms: 1000 },
] as const;

function split(ms: number) {
  let rest = Math.max(0, ms);
  return units.map((unit) => {
    const value = Math.floor(rest / unit.ms);
    rest -= value * unit.ms;
    return { ...unit, value };
  });
}

export function ComingSoon({
  brand = "lumen",
  logo,
  homeHref = "/",
  eyebrow = "Lumen Docs · Public beta",
  title = "Docs your team will keep up to date.",
  description = "Write once, publish to web, PDF and in-app help. Join 2,417 teams on the launch list.",
  launchAt,
  privacyHref = "/privacy",
  onSubscribe,
}: ComingSoonProps) {
  // The target and the clock only exist on the client, so server and client render the same placeholder.
  const [target, setTarget] = useState<number>();
  const [now, setNow] = useState<number>();

  useEffect(() => {
    const start = Date.now();
    const goal = launchAt ? Date.parse(launchAt) : start + 23 * 86_400_000 + 14 * 3_600_000 + 7 * 60_000;
    const tick = () => {
      setTarget(goal);
      setNow(Date.now());
    };
    const first = setTimeout(tick, 0);
    const id = setInterval(tick, 1000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, [launchAt]);

  const left = target !== undefined && now !== undefined ? target - now : undefined;
  const parts = split(left ?? 0);
  const launched = left !== undefined && left <= 0;

  return (
    <section className="relative isolate flex min-h-[max(40rem,100dvh)] flex-col overflow-hidden bg-bg-deep px-5 text-fg">
      <AuroraBackdrop />
      <header className="mx-auto flex w-full max-w-5xl items-center py-6">
        <a href={homeHref} className="flex items-center gap-2 rounded-control font-display text-2xl tracking-tight">
          {logo ?? <BrandMark />}
          {brand}
        </a>
      </header>

      <div className="mx-auto grid w-full max-w-3xl flex-1 place-items-center py-14 text-center">
        <div className="w-full">
          <Reveal trigger="load">
            <Badge variant="accent" dot>
              {eyebrow}
            </Badge>
          </Reveal>
          <TextReveal as="h1" trigger="load" delay={150} className="mx-auto mt-6 max-w-2xl font-display text-5xl leading-[1.02] md:text-7xl">
            {title}
          </TextReveal>
          <Reveal as="p" trigger="load" delay={350} className="mx-auto mt-5 max-w-lg text-lg text-muted">
            {description}
          </Reveal>

          <Reveal trigger="load" delay={500} className="mt-10">
            {launched ? (
              <p className="font-display text-3xl">We&apos;re live. Refresh to get in.</p>
            ) : (
              <div role="timer" aria-label="Time until launch" className="mx-auto grid max-w-xl grid-cols-4 gap-2 sm:gap-3">
                {parts.map((part) => (
                  <div key={part.key} className="surface rounded-card px-1 py-4 sm:py-5">
                    <span className="block font-display text-4xl leading-none tabular-nums sm:text-5xl">
                      {left === undefined ? "--" : String(part.value).padStart(2, "0")}
                    </span>
                    <span className="mt-2 block text-[11px] tracking-wide text-muted uppercase sm:text-xs">{part.label}</span>
                  </div>
                ))}
              </div>
            )}
            {target !== undefined && (
              <p className="mt-4 text-sm text-muted">
                Launching{" "}
                <time dateTime={new Date(target).toISOString()}>
                  {new Date(target).toLocaleString("en-GB", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                </time>
              </p>
            )}
          </Reveal>

          <Reveal trigger="load" delay={650} className="mt-10">
            <NotifyForm
              label="Work email"
              cta="Join the launch list"
              done={(email) => `You're on the list. We'll email ${email} on launch day, and only then.`}
              onSubscribe={onSubscribe}
              privacyHref={privacyHref}
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
