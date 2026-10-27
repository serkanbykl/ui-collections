"use client";

import type { ReactNode } from "react";

import { cn } from "@/registry/kit/lib/utils";
import { BarList } from "@/registry/kit/ui/bar-list";
import { ChartFunnel } from "@/registry/kit/ui/chart-funnel";
import { ChartSparkline } from "@/registry/kit/ui/chart-sparkline";
import { CopyButton } from "@/registry/kit/ui/copy-button";
import { Reveal, TextReveal } from "@/registry/kit/ui/reveal";

export interface BentoItem {
  /** Outcome-led title. */
  title: string;
  /** The detail or proof behind it, one or two sentences. */
  body: string;
  /** A small working piece of the product: a chart, a list, a toggle, a snippet. */
  visual?: ReactNode;
  /** Width on large screens: sm = a third, md = half, lg = two thirds. */
  size?: "sm" | "md" | "lg";
  /** Vivid feature fill. Best with a simple visual (a number, a line). */
  featured?: boolean;
}

export interface BentoFeaturesProps {
  eyebrow?: string;
  title?: string;
  description?: string;
  items?: BentoItem[];
  /** Link beside the heading, e.g. to a features page. */
  action?: { label: string; href: string };
  /** Use "h1" when the grid opens the page. */
  headingLevel?: "h1" | "h2";
}

const span = {
  sm: "lg:col-span-2",
  md: "lg:col-span-3",
  lg: "md:col-span-2 lg:col-span-4",
};

const defaultItems: BentoItem[] = [
  {
    title: "Catch the slow step before customers do",
    body: "Every deploy is traced end to end. Brightline found a 1.8 s checkout call in its first hour.",
    size: "lg",
    visual: (
      <ChartFunnel
        label="Checkout requests completed, last 24 hours"
        steps={[
          { label: "Cart", value: 12480 },
          { label: "Shipping", value: 9214 },
          { label: "Payment", value: 5106 },
          { label: "Paid", value: 4683 },
        ]}
        height={120}
      />
    ),
  },
  {
    title: "99.98% uptime, in public",
    body: "A status page your customers can read, updated by the same checks your team sees.",
    featured: true,
    visual: (
      <div className="w-full">
        <p className="text-4xl font-semibold tracking-tight tabular-nums">99.98%</p>
        <ChartSparkline data={[99.91, 99.95, 99.97, 99.93, 99.99, 99.98, 99.99, 100, 99.97, 99.98]} label="Uptime, last 10 weeks" color="currentColor" fill={false} className="mt-4 h-10" />
      </div>
    ),
  },
  {
    title: "Know which endpoint costs most",
    body: "Requests ranked by total time, so the fix with the biggest payoff is always on top.",
    visual: (
      <BarList
        label="Slowest endpoints by total time"
        size="sm"
        className="w-full"
        formatValue={(v) => `${v} ms`}
        items={[
          { label: "POST /checkout", value: 1840 },
          { label: "GET /search", value: 912 },
          { label: "GET /orders/:id", value: 377 },
        ]}
      />
    ),
  },
  {
    title: "Install in one line",
    body: "One package, no agents to run. Traces start with the next request.",
    visual: (
      <div className="flex w-full items-center justify-between gap-2 rounded-field border border-line px-3 py-2">
        <code className="truncate font-mono text-xs">npm i @brightline/trace</code>
        <CopyButton value="npm i @brightline/trace" iconOnly label="Copy install command" variant="ghost" />
      </div>
    ),
  },
  {
    title: "Alerts that say what broke",
    body: "Each alert names the release, the endpoint and the owner, so nobody guesses at 3 a.m.",
    visual: (
      <div className="grid w-full gap-1.5 text-xs">
        <p className="flex items-center justify-between gap-3 rounded-field border border-line px-3 py-2">
          <span className="truncate">p95 over 800 ms on /search</span>
          <span className="shrink-0 text-warning">v4.12.1</span>
        </p>
        <p className="flex items-center justify-between gap-3 rounded-field border border-line px-3 py-2">
          <span className="truncate">Error rate back under 0.1%</span>
          <span className="shrink-0 text-success">Resolved</span>
        </p>
      </div>
    ),
  },
];

/**
 * Feature bento whose tiles hold working product moments instead of icons:
 * pass any React content as a tile's visual. Three columns on large screens,
 * two on tablets, one on phones.
 */
export function BentoFeatures({
  eyebrow = "What you get",
  title = "See the problem, the cause and the owner on one screen.",
  description = "Five things teams notice in their first week.",
  items = defaultItems,
  action,
  headingLevel = "h2",
}: BentoFeaturesProps) {
  const TileHeading = headingLevel === "h1" ? "h2" : "h3";
  return (
    <section className="bg-bg px-4 py-16 text-fg sm:px-6 md:px-8 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
          <div className="max-w-2xl">
            {eyebrow && <p className="text-sm font-medium text-accent">{eyebrow}</p>}
            <TextReveal as={headingLevel} trigger="view" className="mt-3 font-display text-3xl leading-[1.08] md:text-5xl">
              {title}
            </TextReveal>
            {description && <p className="mt-4 text-muted md:text-lg">{description}</p>}
          </div>
          {action && (
            <a href={action.href} className="text-sm font-medium text-accent underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-accent">
              {action.label} →
            </a>
          )}
        </div>

        <ul className="mt-10 grid gap-3 md:mt-12 md:grid-cols-2 md:gap-4 lg:grid-cols-6">
          {items.map((item, i) => (
            <Reveal
              as="li"
              key={item.title}
              delay={(i % 3) * 70}
              className={cn(
                "surface relative isolate flex min-w-0 flex-col overflow-hidden rounded-card p-5 md:p-6",
                span[item.size ?? "sm"],
                item.featured &&
                  "border-transparent bg-[linear-gradient(135deg,var(--color-feature),color-mix(in_oklab,var(--color-feature)_80%,white))] text-feature-fg [--glass-rim:0.6]",
              )}
            >
              {item.visual && (
                <div
                  className={cn(
                    "mb-6 grid min-h-32 flex-1 grid-cols-[minmax(0,1fr)] items-center",
                    !item.featured && "rounded-field border border-line bg-bg/40 p-4",
                  )}
                >
                  {item.visual}
                </div>
              )}
              <TileHeading className="text-base font-semibold">{item.title}</TileHeading>
              <p className={cn("mt-1.5 text-sm leading-relaxed", item.featured ? "opacity-85" : "text-muted")}>{item.body}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
