"use client";

import { useEffect, useState, type ReactNode } from "react";

import { cn } from "@/registry/kit/lib/utils";
import { AppWindow } from "@/registry/kit/ui/app-window";
import { Badge } from "@/registry/kit/ui/badge";
import { BarList, type BarListItem } from "@/registry/kit/ui/bar-list";
import { ButtonShine, buttonVariants } from "@/registry/kit/ui/button";
import { ChartArea } from "@/registry/kit/ui/chart-area";
import { LiveIndicator } from "@/registry/kit/ui/live-indicator";
import { Reveal, TextReveal } from "@/registry/kit/ui/reveal";
import { SegmentedControl } from "@/registry/kit/ui/segmented-control";
import { TrendChip } from "@/registry/kit/ui/stat-card";

/* ------------------------------------------------------- product preview */

export interface PreviewStat {
  label: string;
  /** Already formatted, e.g. "48,213" or "2m 41s". */
  value: string;
  /** Ratio against the previous period: 0.124 is +12.4%. */
  change?: number | null;
  positiveIsGood?: boolean;
}

export interface PreviewRange {
  id: string;
  /** Option label in the range switch, e.g. "7 days". */
  label: string;
  /** X-axis labels, one per value. */
  labels: string[];
  values: number[];
  stats: PreviewStat[];
  pages: BarListItem[];
}

export interface ProductPreviewProps {
  /** Workspace or site name in the top-left. */
  site?: string;
  /** Name of the charted series. */
  metric?: string;
  /** Date ranges the switch moves between. The first is selected. */
  ranges?: PreviewRange[];
  /** People online now; drifts by a few every few seconds. Pass null to hide. */
  live?: number | null;
  /** Heading above the ranked list. */
  pagesTitle?: string;
}

const week = ["21 Oct", "22 Oct", "23 Oct", "24 Oct", "25 Oct", "26 Oct", "27 Oct"];
const month = Array.from({ length: 30 }, (_, i) => {
  const d = new Date(Date.UTC(2026, 8, 28 + i));
  return `${d.getUTCDate()} ${d.toLocaleString("en-GB", { month: "short", timeZone: "UTC" })}`;
});

const defaultRanges: PreviewRange[] = [
  {
    id: "7d",
    label: "7 days",
    labels: week,
    values: [6412, 7208, 6987, 7531, 6044, 4893, 5138],
    stats: [
      { label: "Visitors", value: "44,213", change: 0.124 },
      { label: "Page views", value: "131,870", change: 0.087 },
      { label: "Bounce rate", value: "38.2%", change: -0.031, positiveIsGood: false },
      { label: "Visit length", value: "2m 41s", change: 0.046 },
    ],
    pages: [
      { label: "/pricing", value: 9412 },
      { label: "/", value: 8106 },
      { label: "/blog/cookie-free", value: 5233 },
      { label: "/docs/install", value: 3871 },
      { label: "/changelog", value: 2190 },
    ],
  },
  {
    id: "30d",
    label: "30 days",
    labels: month,
    values: [
      5121, 5480, 5302, 4410, 4187, 5609, 5874, 5713, 5988, 6034, 4652, 4380, 6011, 6247, 6119, 6403, 6290, 4975, 4706, 6388, 6612, 6487, 6905, 7146,
      5531, 5012, 6412, 7208, 6987, 7531,
    ],
    stats: [
      { label: "Visitors", value: "178,904", change: 0.093 },
      { label: "Page views", value: "547,312", change: 0.112 },
      { label: "Bounce rate", value: "39.6%", change: -0.018, positiveIsGood: false },
      { label: "Visit length", value: "2m 33s", change: 0.021 },
    ],
    pages: [
      { label: "/", value: 36218 },
      { label: "/pricing", value: 34907 },
      { label: "/blog/cookie-free", value: 21645 },
      { label: "/docs/install", value: 15032 },
      { label: "/customers", value: 9874 },
    ],
  },
];

// A fixed walk so the counter looks alive without random numbers in render.
const drift = [2, -1, 3, -2, 1, -3, 2, 1, -2, -1];

/**
 * A compact analytics screen for hero windows: site and live count, a range
 * switch, four headline numbers with trend chips, an area chart and a ranked
 * list. The switch really switches the data.
 */
export function ProductPreview({ site = "polaris.example", metric = "Visitors", ranges = defaultRanges, live = 128, pagesTitle = "Top pages" }: ProductPreviewProps) {
  const [rangeId, setRangeId] = useState(ranges[0]?.id ?? "");
  const range = ranges.find((r) => r.id === rangeId) ?? ranges[0]!;
  const [online, setOnline] = useState(live ?? 0);

  useEffect(() => {
    if (live === null) return;
    let step = 0;
    const id = setInterval(() => {
      setOnline((n) => Math.max(1, n + drift[step++ % drift.length]!));
    }, 2600);
    return () => clearInterval(id);
  }, [live]);

  return (
    <div className="grid gap-4 p-4 md:gap-5 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span aria-hidden className="grid size-8 shrink-0 place-items-center rounded-field bg-accent/15 text-xs font-semibold text-accent">
            {site.slice(0, 2).toUpperCase()}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{site}</p>
            {live !== null && (
              <LiveIndicator className="text-xs text-muted" label={<span className="tabular-nums">{online} online now</span>} />
            )}
          </div>
        </div>
        {ranges.length > 1 && (
          <SegmentedControl
            aria-label="Date range"
            options={ranges.map((r) => ({ value: r.id, label: r.label }))}
            value={range.id}
            onValueChange={setRangeId}
          />
        )}
      </div>

      <dl className="grid grid-cols-2 overflow-hidden rounded-field border border-line md:grid-cols-4">
        {range.stats.map((s, i) => (
          <div
            key={s.label}
            className={cn(
              "flex min-w-0 flex-col gap-1.5 p-3 md:p-4",
              i % 2 === 1 && "border-l border-line",
              i >= 2 && "border-t border-line md:border-t-0",
              i === 2 && "md:border-l",
            )}
          >
            <dt className="truncate text-xs text-muted">{s.label}</dt>
            <dd className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="text-lg leading-none font-semibold tracking-tight tabular-nums md:text-2xl">{s.value}</span>
              {s.change !== undefined && <TrendChip change={s.change} positiveIsGood={s.positiveIsGood} />}
            </dd>
          </div>
        ))}
      </dl>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
        <div className="min-w-0">
          <p className="mb-2 text-xs font-medium text-muted">
            {metric} · last {range.label}
          </p>
          <ChartArea key={range.id} labels={range.labels} series={[{ name: metric, values: range.values }]} label={`${metric} per day, last ${range.label}`} height={210} />
        </div>
        <div className="hidden min-w-0 sm:block">
          <p className="mb-2 text-xs font-medium text-muted">{pagesTitle}</p>
          <BarList items={range.pages} label={`${pagesTitle}, last ${range.label}`} header={{ label: "Page", value: metric }} size="sm" />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ hero */

export interface HeroProductProps {
  /** Short news line in a pill above the headline. Omit to hide. */
  badge?: string;
  badgeHref?: string;
  title?: string;
  description?: string;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
  /** Short proof or risk reducers under the buttons, each with a tick. */
  notes?: string[];
  /** The product shot inside the window. Defaults to an analytics preview. */
  visual?: ReactNode;
  /** Address shown in the window's title bar. */
  url?: string;
  /** Customer names, shown as plain wordmarks under the window. */
  logos?: string[];
  logosLabel?: string;
}

const tick = (
  <svg aria-hidden viewBox="0 0 24 24" className="size-4 shrink-0 text-accent" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="m5 12.5 4.5 4.5L19 7" />
  </svg>
);

// Varied type treatments so text-only wordmarks read as different brands.
const wordmarkStyles = [
  "font-semibold tracking-tight",
  "font-mono text-[0.8em] tracking-[0.2em] uppercase",
  "font-display italic",
  "font-bold tracking-[-0.04em] lowercase",
  "font-medium tracking-[0.08em] uppercase text-[0.85em]",
  "font-semibold",
];

/**
 * Product-led hero: a tight headline, one-line subhead, one primary action,
 * ticked proof points and a real product screen in an app window, with
 * customer wordmarks underneath.
 */
export function HeroProduct({
  badge = "Funnels 2.0 is live",
  badgeHref = "/changelog",
  title = "Know what visitors do, without cookies.",
  description = "Privacy-friendly analytics with every answer on one screen. Add one script and see your first visitors in a minute.",
  primary = { label: "Start free trial", href: "/signup" },
  secondary = { label: "Open live demo", href: "/demo" },
  notes = ["14 days free", "No card required", "Hosted in the EU"],
  visual,
  url = "app.lumen.example/polaris",
  logos = ["Polaris", "Kitebase", "Halcyon", "Orbitly", "Fernhill", "Northwind"],
  logosLabel = "Counting visits for 38,214 sites, including",
}: HeroProductProps) {
  return (
    <section className="relative isolate overflow-hidden bg-bg px-4 pt-16 pb-14 text-fg sm:px-6 md:px-8 md:pt-24 md:pb-20">
      {/* Glow and a faint grid, both from theme tokens. */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 -z-10 h-[46rem] bg-[radial-gradient(55%_60%_at_50%_0%,color-mix(in_oklab,var(--color-accent)_20%,transparent),transparent_70%)]"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 -z-10 h-[40rem] [background-image:linear-gradient(var(--color-line)_1px,transparent_1px),linear-gradient(90deg,var(--color-line)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(60%_70%_at_50%_0%,black,transparent)] opacity-60"
      />

      <div className="mx-auto flex max-w-6xl flex-col items-center text-center">
        {badge && (
          <Reveal trigger="load">
            <a
              href={badgeHref}
              className="surface inline-flex items-center gap-2 rounded-control py-1 pr-3.5 pl-1 text-xs text-fg/85 transition-colors hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-accent"
            >
              <Badge variant="accent-solid">New</Badge>
              {badge}
              <span aria-hidden>→</span>
            </a>
          </Reveal>
        )}
        <TextReveal as="h1" delay={60} className="mt-6 max-w-3xl font-display text-[clamp(2.4rem,6vw,4.4rem)] leading-[1.02] text-balance">
          {title}
        </TextReveal>
        <Reveal as="p" trigger="load" delay={300} className="mt-5 max-w-xl text-base leading-relaxed text-muted text-pretty md:text-lg">
          {description}
        </Reveal>
        <Reveal trigger="load" delay={420} className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a href={primary.href} className={buttonVariants({ variant: "solid" })}>
            <ButtonShine />
            {primary.label}
          </a>
          <a href={secondary.href} className={buttonVariants({ variant: "ghost" })}>
            {secondary.label}
            <span aria-hidden>→</span>
          </a>
        </Reveal>
        {notes.length > 0 && (
          <Reveal trigger="load" delay={500} className="mt-5">
            <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-muted">
              {notes.map((n) => (
                <li key={n} className="flex items-center gap-1.5">
                  {tick}
                  {n}
                </li>
              ))}
            </ul>
          </Reveal>
        )}
      </div>

      <Reveal trigger="load" delay={560} className="relative mx-auto mt-12 max-w-6xl md:mt-16">
        <div
          aria-hidden
          className="absolute inset-x-[8%] -top-6 bottom-10 -z-10 rounded-[50%] bg-accent/25 blur-3xl"
        />
        <AppWindow url={url} className="shadow-[0_40px_90px_-30px_rgb(0_0_0/0.45)]">
          {visual ?? <ProductPreview />}
        </AppWindow>
      </Reveal>

      {logos.length > 0 && (
        <div className="mx-auto mt-12 max-w-5xl text-center md:mt-14">
          <p className="text-sm text-muted">{logosLabel}</p>
          <ul className="mt-5 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-lg text-fg/55 md:text-xl">
            {logos.map((name, i) => (
              <li key={name} className={wordmarkStyles[i % wordmarkStyles.length]}>
                {name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
