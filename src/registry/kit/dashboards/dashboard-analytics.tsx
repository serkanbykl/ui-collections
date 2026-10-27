"use client";

import { createContext, useContext, useState, type MouseEvent, type ReactNode } from "react";

import { cn } from "@/registry/kit/lib/utils";
import { AuroraBackdrop } from "@/registry/kit/ui/aurora-backdrop";
import { ChartArea } from "@/registry/kit/ui/chart-area";
import { ChartBar } from "@/registry/kit/ui/chart-bar";
import { ChartDonut } from "@/registry/kit/ui/chart-donut";
import { ChartSparkline } from "@/registry/kit/ui/chart-sparkline";
import { Button, buttonVariants } from "@/registry/kit/ui/button";
import { NumberTicker } from "@/registry/kit/ui/number-ticker";
import { SegmentedControl } from "@/registry/kit/ui/segmented-control";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/registry/kit/ui/sheet";
import { AccountMenu, type AccountMenuItem } from "@/registry/kit/ui/account-menu";
import { Avatar } from "@/registry/kit/ui/avatar";
import { Badge } from "@/registry/kit/ui/badge";
import { BrandGlyph } from "@/registry/kit/ui/brand-mark";
import { NotificationBell, type NotificationItem, type NotificationTone } from "@/registry/kit/ui/notification-bell";
import { Progress } from "@/registry/kit/ui/progress";
import { SearchInput } from "@/registry/kit/ui/search-input";
import { EmptyState } from "@/registry/kit/ui/states";
import { toast, Toaster } from "@/registry/kit/ui/toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/registry/kit/ui/table";
import { SimpleTooltip, TooltipProvider } from "@/registry/kit/ui/tooltip";
import {
  SidebarBrand,
  SidebarNav,
  SidebarProfile,
  SidebarSearch,
  type SidebarGroup,
} from "@/registry/kit/ui/sidebar-nav";
import { PageHeader } from "@/registry/kit/ui/page-header";
import { Breadcrumb } from "@/registry/kit/ui/breadcrumb";
import { navTrail } from "@/registry/kit/lib/nav-trail";

/* ------------------------------------------------------------------ data */

type Range = "7d" | "30d" | "90d";

/** Small deterministic PRNG so server and client render the same numbers. */
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const endDate = Date.UTC(2026, 9, 25);
const dayLabel = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" });

function walk(rand: () => number, n: number, start: number, drift: number, noise: number) {
  const out: number[] = [];
  let v = start;
  for (let i = 0; i < n; i++) {
    const weekday = new Date(endDate - (n - 1 - i) * 86_400_000).getUTCDay();
    const weekend = weekday === 0 || weekday === 6 ? 0.78 : 1;
    v = Math.max(start * 0.4, v * (1 + drift) + (rand() - 0.5) * noise);
    out.push(Math.round(v * weekend));
  }
  return out;
}

function build(days: number, seed: number) {
  const rand = seeded(seed);
  const labels = Array.from({ length: days }, (_, i) => dayLabel.format(new Date(endDate - (days - 1 - i) * 86_400_000)));
  const visitors = walk(rand, days, 4200, 0.004, 900);
  const previous = walk(rand, days, 3900, 0.002, 900);
  const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);
  const total = sum(visitors);
  const prevTotal = sum(previous);
  const conversion = 3.1 + rand() * 0.9;
  return {
    labels,
    visitors,
    previous,
    kpis: [
      { label: "Visitors", value: total, delta: (total / prevTotal - 1) * 100, trend: visitors.slice(-12) },
      { label: "Page views", value: Math.round(total * 2.7), delta: (total / prevTotal - 1) * 100 + 3.2, trend: visitors.slice(-12).map((v) => v * 2.7) },
      { label: "Conversion", value: conversion, delta: rand() * 0.8 - 0.2, decimals: 2, suffix: "%", trend: Array.from({ length: 12 }, () => 3 + rand()) },
      { label: "Avg. session", value: 3 + rand() * 1.5, delta: -(rand() * 4), decimals: 1, suffix: " min", trend: Array.from({ length: 12 }, () => 3 + rand()) },
    ],
    sources: [
      { label: "Organic search", value: Math.round(total * 0.46) },
      { label: "Direct", value: Math.round(total * 0.27) },
      { label: "Referral", value: Math.round(total * 0.16) },
      { label: "Other", value: Math.round(total * 0.11) },
    ],
    signups: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((_, i) => Math.round((days * 9 + rand() * days * 4) * (i >= 5 ? 0.55 : 1))),
    pages: [
      { path: "/", views: Math.round(total * 0.62), time: "1:42", bounce: 38 },
      { path: "/pricing", views: Math.round(total * 0.31), time: "2:58", bounce: 24 },
      { path: "/docs/getting-started", views: Math.round(total * 0.24), time: "4:12", bounce: 19 },
      { path: "/blog/release-notes", views: Math.round(total * 0.17), time: "3:21", bounce: 41 },
      { path: "/changelog", views: Math.round(total * 0.09), time: "1:05", bounce: 52 },
    ],
  };
}

const datasets: Record<Range, ReturnType<typeof build>> = { "7d": build(7, 11), "30d": build(30, 23), "90d": build(90, 37) };

/* ----------------------------------------------------------------- icons */

const icons = {
  home: "M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z",
  chart: "M4 20V10M10 20V4M16 20v-7M22 20H2",
  users: "M16 19v-1a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v1M9.5 10a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7M21 19v-1a4 4 0 0 0-3-3.87M15 3.13a3.5 3.5 0 0 1 0 6.75",
  funnel: "M3 4h18l-7 8.5V19l-4 2v-8.5z",
  file: "M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8zM14 3v5h5",
  settings: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1",
  search: "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14M20 20l-4-4",
  bell: "M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0",
  menu: "M4 6h16M4 12h16M4 18h16",
  close: "M6 6l12 12M18 6 6 18",
  up: "M7 17 17 7M8 7h9v9",
  down: "M7 7l10 10M17 8v9H8",
  download: "M12 3v12M7 10l5 5 5-5M5 21h14",
};

function Icon({ name, className }: { name: keyof typeof icons; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden className={cn("size-4.5 shrink-0", className)}>
      <path d={icons[name]} />
    </svg>
  );
}

/* ------------------------------------------------------------- pieces */

const groups: SidebarGroup[] = [
  {
    label: "General",
    items: [
      { label: "Overview", href: "#overview", icon: <Icon name="home" /> },
      { label: "Reports", href: "#reports", icon: <Icon name="chart" />, badge: 3 },
    ],
  },
  {
    label: "Insights",
    items: [
      { label: "Audience", href: "#audience", icon: <Icon name="users" /> },
      { label: "Funnels", href: "#funnels", icon: <Icon name="funnel" /> },
      { label: "Pages", href: "#pages", icon: <Icon name="file" /> },
    ],
  },
  {
    label: "System",
    items: [
      {
        label: "Settings",
        href: "#settings",
        icon: <Icon name="settings" />,
        children: [
          { label: "Tracking", href: "#settings/tracking" },
          { label: "Team", href: "#settings/team" },
          { label: "Billing", href: "#settings/billing" },
        ],
      },
    ],
  },
];

// Navigation lives in state; in an app pass your router's Link to SidebarNav as `linkAs`.
const DashNav = createContext<{ current: string; go: (href: string) => void }>({ current: "", go: () => {} });

function DashLink({
  href,
  onClick,
  children,
  ...props
}: {
  href: string;
  onClick?: () => void;
  className?: string;
  "aria-current"?: "page";
  children?: ReactNode;
}) {
  const { go } = useContext(DashNav);
  return (
    <a
      href={href}
      onClick={(e: MouseEvent) => {
        e.preventDefault();
        go(href);
        onClick?.();
      }}
      {...props}
    >
      {children}
    </a>
  );
}

/**
 * Shell options, so several dashboards can read as one product: give each the
 * same logo, brand, profile and `nav`, and link their screens together.
 */
export interface DashboardChrome {
  /** Glyph inside the brand tile. */
  logo?: ReactNode;
  /** Sidebar brand. With `href` the brand is a plain link there. */
  brand?: { title: string; subtitle?: string; href?: string };
  /**
   * The signed-in person, in the sidebar and the header. With `menu`, the
   * header avatar opens an account menu (profile, settings, sign out…).
   */
  profile?: { name: string; role?: string; email?: string; menu?: AccountMenuItem[] };
  /** Replaces the built-in sections with real links, e.g. one item per screen. */
  nav?: SidebarGroup[];
  /** The `nav` href to mark as current. */
  currentHref?: string;
  /** Heading of the first section, and the line under the heading. */
  title?: string;
  subtitle?: string;
  /** Replaces the card at the foot of the sidebar; `null` removes it. */
  sidebarFooter?: ReactNode;
  /** When set, a sign-out link goes here, e.g. back to the marketing site. */
  exitHref?: string;
  /** "View all notifications" link at the foot of the header bell. */
  notificationsHref?: string;
  /** Called when notifications are read, e.g. to keep the read state across pages. */
  onNotificationsChange?: (items: NotificationItem[]) => void;
}

const defaultBrand: NonNullable<DashboardChrome["brand"]> = { title: "Lumen", subtitle: "Product analytics" };
const defaultProfile: NonNullable<DashboardChrome["profile"]> = { name: "Ada Kaya", role: "Growth lead" };

function Sidebar({ onNavigate, chrome }: { onNavigate?: () => void; chrome: DashboardChrome }) {
  const { current } = useContext(DashNav);
  const [query, setQuery] = useState("");
  const brand = chrome.brand ?? defaultBrand;
  const profile = chrome.profile ?? defaultProfile;
  const footer = chrome.sidebarFooter === undefined ? (
    <div className="rounded-field bg-fg/[0.04] p-4 text-sm">
      <div className="font-medium">Events this month</div>
      <Progress value={68.3} aria-label="Events used this month" className="mt-2 h-1.5" />
      <div className="mt-2 text-xs text-muted">683,412 of 1M on the Growth plan</div>
    </div>
  ) : chrome.sidebarFooter;
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex h-16 shrink-0 items-center px-4">
        {brand.href ? (
          <SidebarBrand icon={chrome.logo} title={brand.title} subtitle={brand.subtitle} href={brand.href} />
        ) : (
          <SidebarBrand icon={chrome.logo} title={brand.title} subtitle={brand.subtitle} href="#overview" linkAs={DashLink} />
        )}
      </div>
      <div className="shrink-0 px-3 pt-2 pb-3">
        <SidebarProfile
          name={profile.name}
          role={profile.role}
          action={
            chrome.exitHref ? (
              <SimpleTooltip content="Sign out">
                <a href={chrome.exitHref} aria-label="Sign out" className={buttonVariants({ variant: "ghost", size: "icon-sm", className: "text-muted" })}>
                  <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 17l5-5-5-5M15 12H4" />
                  </svg>
                </a>
              </SimpleTooltip>
            ) : undefined
          }
        />
      </div>
      <div className="shrink-0 px-3 pb-3">
        <SidebarSearch value={query} onChange={setQuery} placeholder="Search menu…" />
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pb-3 [scrollbar-width:thin]">
        {chrome.nav ? (
          <SidebarNav groups={chrome.nav} currentHref={chrome.currentHref} onNavigate={onNavigate} filter={query} />
        ) : (
          <SidebarNav groups={groups} currentHref={current} linkAs={DashLink} onNavigate={onNavigate} filter={query} />
        )}
      </div>
      {footer && <div className="shrink-0 p-3">{footer}</div>}
    </div>
  );
}

function Panel({ title, action, className, children }: { title: string; action?: React.ReactNode; className?: string; children: React.ReactNode }) {
  return (
    <section className={cn("surface rounded-card p-5 md:p-6", className)}>
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="text-sm font-medium text-fg/85">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function Delta({ value }: { value: number }) {
  const up = value >= 0;
  return (
    <Badge variant={up ? "success" : "danger"} className="gap-0.5 px-1.5 text-[11px] tabular-nums">
      <Icon name={up ? "up" : "down"} className="size-3" />
      {up ? "+" : "−"}
      {Math.abs(value).toFixed(1)}%<span className="sr-only">{up ? " increase" : " decrease"}</span>
    </Badge>
  );
}

const defaultNotifications: DashboardNotice[] = [
  { title: "Weekly report is ready", body: "Visitors up 6.4% on the week before.", time: "12 min ago" },
  { title: "Funnel goal reached", body: "Trial → paid hit 4.1% for the first time.", time: "2 h ago", tone: "success" },
  { title: "Spike from news.ycombinator.com", body: "1,283 visitors in the last hour.", time: "Yesterday" },
];

/** A header notification; `body` is the line under the title. */
export interface DashboardNotice {
  id?: string;
  title: string;
  body: string;
  time: string;
  tone?: NotificationTone;
  /** Where the notification leads. */
  href?: string;
  read?: boolean;
}

const toBellItems = (list: DashboardNotice[]): NotificationItem[] =>
  list.map(({ id, body, ...n }, i) => ({ ...n, id: id ?? `${i}-${n.title}`, detail: body }));

const sectionTitles: Record<string, string> = {
  "#overview": "Overview",
  "#reports": "Reports",
  "#audience": "Audience",
  "#funnels": "Funnels",
  "#pages": "Pages",
  "#settings": "Settings",
  "#settings/tracking": "Tracking",
  "#settings/team": "Team",
  "#settings/billing": "Billing",
};

/* ------------------------------------------------------------- screen */

export interface DashboardAnalyticsProps extends DashboardChrome {
  /** Items in the header bell. */
  notifications?: DashboardNotice[];
}

/**
 * Product analytics. Every prop is optional; see DashboardChrome to share one
 * app shell across several dashboards.
 */
export function DashboardAnalytics({ logo = <BrandGlyph />, notifications = defaultNotifications, ...props }: DashboardAnalyticsProps = {}) {
  const chrome = { ...props, logo };
  const profile = props.profile ?? defaultProfile;
  const [range, setRange] = useState<Range>("30d");
  const [menuOpen, setMenuOpen] = useState(false);
  const [current, setCurrent] = useState("#overview");
  const heading = (current === "#overview" && chrome.title) || (sectionTitles[current] ?? "Overview");
  const crumbs = chrome.nav ? navTrail(chrome.nav, chrome.currentHref ?? "", chrome.title) : navTrail(groups, current);
  const [search, setSearch] = useState("");
  const data = datasets[range];
  const query = search.trim().toLowerCase();
  const pages = query ? data.pages.filter((p) => p.path.toLowerCase().includes(query)) : data.pages;

  function exportCsv() {
    toast.success(`Exported lumen-visitors-${range}.csv`, { description: `${data.labels.length} days, one row per day.` });
  }

  return (
    <TooltipProvider>
      <DashNav value={{ current, go: setCurrent }}>
        <div className="relative isolate flex min-h-dvh bg-bg text-fg">
          {/* One shared page backdrop for every app screen; its strength is the theme's --aurora-strength. */}
          <AuroraBackdrop grid={false} className="fixed print:hidden" />
          <aside className="sticky top-0 z-10 hidden h-dvh w-72 shrink-0 border-r border-dashed border-line bg-bg-deep/40 lg:block">
            <Sidebar chrome={chrome} />
          </aside>

          <div className="min-w-0 flex-1">
            <header className="sticky top-0 z-30 flex flex-wrap items-center gap-3 border-b border-line bg-bg/75 px-4 py-3 backdrop-blur-xl md:px-8">
              <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
                <SheetTrigger asChild>
                  <Button size="icon" aria-label="Open menu" className="size-10 lg:hidden">
                    <Icon name="menu" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" bodyClassName="p-0">
                  <SheetTitle className="sr-only">Navigation</SheetTitle>
                  <Sidebar onNavigate={() => setMenuOpen(false)} chrome={chrome} />
                </SheetContent>
              </Sheet>
              <SearchInput label="Search pages" placeholder="Search pages…" value={search} onValueChange={setSearch} shortcut className="min-w-0 flex-1 sm:max-w-xs" />
              <div className="ml-auto flex items-center gap-2">
                <NotificationBell items={toBellItems(notifications)} onItemsChange={chrome.onNotificationsChange} viewAllHref={chrome.notificationsHref} />
                {profile.menu?.length ? (
                  <AccountMenu
                    name={profile.name}
                    email={profile.email}
                    items={profile.menu}
                    fallbackClassName="bg-gradient-to-br from-accent to-info font-semibold text-accent-fg"
                  />
                ) : (
                  <Avatar
                    role="img"
                    alt={profile.name}
                    aria-label={`Signed in as ${profile.name}`}
                    fallbackClassName="bg-gradient-to-br from-accent to-info font-semibold text-accent-fg"
                  />
                )}
                {/* The sidebar is a drawer below lg, so sign-out also lives here. */}
                {chrome.exitHref && (
                  <a href={chrome.exitHref} aria-label="Sign out" className={buttonVariants({ size: "icon", className: "size-10 text-muted lg:hidden" })}>
                    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 17l5-5-5-5M15 12H4" />
                    </svg>
                  </a>
                )}
              </div>
            </header>

            <main id="main" className="grid grid-cols-1 gap-5 px-4 py-6 md:px-8 md:py-8">
              <div>
                {crumbs.length > 1 && (
                  <Breadcrumb
                    items={crumbs}
                    // The built-in menu lives in state, so its crumbs navigate the same way.
                    onSelect={chrome.nav ? undefined : (i) => crumbs[i]?.href && setCurrent(crumbs[i].href)}
                    className="mb-5"
                  />
                )}
                <PageHeader
                  headingLevel="h1"
                  title={heading}
                  description={chrome.subtitle ?? "lumen.app · all traffic"}
                  actions={
                    <div className="flex flex-wrap items-center gap-2">
                      <SegmentedControl
                        aria-label="Date range"
                        value={range}
                        onValueChange={setRange}
                        options={[
                          { value: "7d", label: "7 days" },
                          { value: "30d", label: "30 days" },
                          { value: "90d", label: "90 days" },
                        ]}
                      />
                      <Button size="sm" className="h-11" onClick={exportCsv}>
                        <Icon name="download" />
                        Export CSV
                      </Button>
                    </div>
                  }
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {data.kpis.map((k) => (
                  <section key={k.label} className="surface overflow-hidden rounded-card p-5 [--card-pad:1.25rem]">
                    <div className="flex items-center justify-between gap-2">
                      <h2 className="text-sm text-muted">{k.label}</h2>
                      <Delta value={k.delta} />
                    </div>
                    <div className="mt-3 text-3xl font-semibold tracking-tight">
                      <NumberTicker value={k.value} decimals={"decimals" in k ? k.decimals : 0} suffix={"suffix" in k ? k.suffix : undefined} />
                    </div>
                    <ChartSparkline bleed data={k.trend} label={`${k.label} trend`} className="mt-4 h-10" />
                  </section>
                ))}
              </div>

              <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
                <Panel title="Visitors" className="xl:col-span-2">
                  <ChartArea
                    label={`Daily visitors over the last ${range}, compared with the previous period`}
                    labels={data.labels}
                    series={[
                      { name: "This period", values: data.visitors },
                      { name: "Previous period", values: data.previous },
                    ]}
                    height={260}
                  />
                </Panel>
                <Panel title="Traffic sources">
                  <ChartDonut label="Visitors by traffic source" data={data.sources} centerLabel="Visitors" legend />
                </Panel>
              </div>

              <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
                <Panel title="Sign-ups by weekday">
                  <ChartBar label="Sign-ups by weekday" labels={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]} series={[{ name: "Sign-ups", values: data.signups }]} height={220} />
                </Panel>
                <Panel title={query ? `Top pages matching “${search.trim()}”` : "Top pages"} className="xl:col-span-2">
                  {pages.length === 0 ? (
                    <EmptyState
                      size="compact"
                      title="No pages match that search"
                      description="Try part of a path, such as /pricing or /docs."
                      action={<Button size="sm" variant="ghost" onClick={() => setSearch("")}>Clear search</Button>}
                    />
                  ) : (
                  <Table frame={false} className="min-w-[32rem]">
                    <TableHeader className="bg-transparent">
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="h-9 pl-0">Page</TableHead>
                        <TableHead className="h-9">Views</TableHead>
                        <TableHead className="h-9 text-right">Avg. time</TableHead>
                        <TableHead className="h-9 pr-0 text-right">Bounce</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pages.map((p) => (
                        <TableRow key={p.path}>
                          <TableHead scope="row" className="h-auto py-3 pl-0 font-mono text-[13px] font-normal tracking-normal text-fg/90 normal-case">
                            {p.path}
                          </TableHead>
                          <TableCell className="py-3">
                            <div className="flex items-center gap-3">
                              <span className="w-14 tabular-nums">{p.views.toLocaleString("en-US")}</span>
                              <Progress aria-hidden value={(p.views / data.pages[0]!.views) * 100} className="h-1.5 flex-1 shadow-none" />
                            </div>
                          </TableCell>
                          <TableCell className="py-3 text-right text-muted tabular-nums">{p.time}</TableCell>
                          <TableCell className="py-3 pr-0 text-right text-muted tabular-nums">{p.bounce}%</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  )}
                </Panel>
              </div>
            </main>
          </div>
        </div>
        <Toaster />
      </DashNav>
    </TooltipProvider>
  );
}
