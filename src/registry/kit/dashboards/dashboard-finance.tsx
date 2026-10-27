"use client";

import { createContext, useContext, useState, type MouseEvent, type ReactNode } from "react";

import { cn } from "@/registry/kit/lib/utils";
import { AuroraBackdrop } from "@/registry/kit/ui/aurora-backdrop";
import { ChartArea } from "@/registry/kit/ui/chart-area";
import { ChartDonut } from "@/registry/kit/ui/chart-donut";
import { ChartRadialMeter } from "@/registry/kit/ui/chart-radial-meter";
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

type Range = "week" | "month" | "quarter";

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
const usd = (v: number) => v.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const usdCents = (v: number) => v.toLocaleString("en-US", { style: "currency", currency: "USD" });

function build(days: number, seed: number) {
  const rand = seeded(seed);
  const labels = Array.from({ length: days }, (_, i) => dayLabel.format(new Date(endDate - (days - 1 - i) * 86_400_000)));
  const balance: number[] = [];
  let b = 41_800;
  for (let i = 0; i < days; i++) {
    // Salary on the 1st and 15th, steady spending in between.
    const date = new Date(endDate - (days - 1 - i) * 86_400_000).getUTCDate();
    b += (date === 1 || date === 15 ? 4_200 : 0) - (120 + rand() * 260);
    balance.push(Math.round(b));
  }
  const scale = days / 30;
  const income = Math.round(8_400 * scale);
  const expenses = Math.round((5_100 + rand() * 600) * scale);
  return {
    labels,
    balance,
    current: balance[balance.length - 1]! + 0.55,
    change: ((balance[balance.length - 1]! - balance[0]!) / balance[0]!) * 100,
    tiles: [
      { label: "Income", value: income, delta: 4.2, trend: Array.from({ length: 12 }, (_, i) => 7_800 + i * 60 + rand() * 400) },
      { label: "Expenses", value: expenses, delta: -2.8, trend: Array.from({ length: 12 }, () => 4_900 + rand() * 900) },
      { label: "Saved", value: income - expenses, delta: 9.6, trend: Array.from({ length: 12 }, (_, i) => 2_400 + i * 90 + rand() * 500) },
    ],
    categories: [
      { label: "Housing", value: Math.round(1_850 * scale) },
      { label: "Groceries", value: Math.round((560 + rand() * 160) * scale) },
      { label: "Transport", value: Math.round((260 + rand() * 120) * scale) },
      { label: "Other", value: Math.round((380 + rand() * 200) * scale) },
    ],
  };
}

const datasets: Record<Range, ReturnType<typeof build>> = { week: build(7, 5), month: build(30, 8), quarter: build(90, 13) };

export interface FinanceAction {
  label: string;
  icon: "send" | "request" | "plus" | "list";
  /** Section to open, e.g. "#payees". */
  go?: string;
  /** A link to follow instead of a button. */
  href?: string;
  /** Text copied to the clipboard. */
  copy?: string;
  toast?: { title: string; description?: string };
}

/**
 * Every word and record on the screen. Pass a partial `content` to reframe
 * the dashboard, e.g. as a company's revenue screen; the chart data stays.
 */
export interface FinanceContent {
  balanceLabel: string;
  seriesName: string;
  actions: FinanceAction[];
  goal: {
    title: string;
    target: number;
    start: number;
    note: ReactNode;
    /** Word after the amount, e.g. "saved". */
    progressLabel: string;
    /** A button that moves the goal forward; leave out for a read-only goal. */
    step?: { amount: number; label: string; toast: { title: string; description?: string } };
  };
  /** Labels for the three tiles, in order; `upIsGood: false` for costs. */
  tiles: { label: string; upIsGood?: boolean }[];
  /** Labels for the four slices of the breakdown donut, in order. */
  categoryLabels: string[];
  breakdownTitle: string;
  breakdownCenter: string;
  budgetsTitle: string;
  budgets: { label: string; spent: number; limit: number }[];
  ledgerTitle: string;
  /** Headings of the first two columns. */
  ledgerColumns: [string, string];
  ledgerSearch: string;
  ledgerEmptyHint: string;
  viewAllLabel: string;
  transactions: { merchant: string; category: string; date: string; amount: number }[];
  notifications: DashboardNotice[];
}

export const walletContent: FinanceContent = {
  balanceLabel: "Total balance",
  seriesName: "Balance",
  actions: [
    { label: "Send money", icon: "send", go: "#payees" },
    {
      label: "Request money",
      icon: "request",
      copy: "https://ledger.example/pay/ada-kaya",
      toast: { title: "Payment link copied", description: "Anyone with the link can pay you by card or bank transfer." },
    },
    { label: "Top up $250", icon: "plus", toast: { title: "Top-up of $250.00 on its way", description: "From Northwind Bank •••• 0193, usually within 2 minutes." } },
  ],
  goal: {
    title: "Savings goal",
    target: 20_000,
    start: 12_840,
    note: (
      <>
        New laptop fund. At this pace you reach it in <span className="text-fg">5 months</span>.
      </>
    ),
    progressLabel: "saved",
    step: {
      amount: 150,
      label: "Add $150 to goal",
      toast: { title: "Moved $150.00 to New laptop fund", description: "From Everyday account. Undo within 10 minutes in Transactions." },
    },
  },
  tiles: [{ label: "Income" }, { label: "Expenses", upIsGood: false }, { label: "Saved" }],
  categoryLabels: ["Housing", "Groceries", "Transport", "Other"],
  breakdownTitle: "Spending",
  breakdownCenter: "Spent",
  budgetsTitle: "Budgets",
  budgets: [
    { label: "Groceries", spent: 612, limit: 700 },
    { label: "Eating out", spent: 284, limit: 250 },
    { label: "Transport", spent: 198, limit: 320 },
    { label: "Subscriptions", spent: 86, limit: 90 },
  ],
  ledgerTitle: "Recent transactions",
  ledgerColumns: ["Merchant", "Category"],
  ledgerSearch: "Search transactions",
  ledgerEmptyHint: "Search by merchant or category, such as Groceries.",
  viewAllLabel: "View all transactions",
  transactions: [
    { merchant: "Cornerstone Market", category: "Groceries", date: "Oct 25", amount: -84.2 },
    { merchant: "Northwind Payroll", category: "Income", date: "Oct 24", amount: 4_200 },
    { merchant: "Metro Transit", category: "Transport", date: "Oct 24", amount: -2.9 },
    { merchant: "Lumen Studio", category: "Subscriptions", date: "Oct 23", amount: -12 },
    { merchant: "Harbor Rent Co.", category: "Housing", date: "Oct 22", amount: -1_850 },
    { merchant: "Fern & Co. Café", category: "Eating out", date: "Oct 21", amount: -18.5 },
  ],
  notifications: [
    { title: "Eating out is over budget", body: "$284 of $250 with six days left.", time: "1 h ago", tone: "warning" },
    { title: "Salary received", body: "+$4,200.00 from Northwind Payroll.", time: "Yesterday", tone: "success" },
    { title: "Card ending 4821 renewed", body: "The new card arrives by Nov 3.", time: "Oct 21" },
  ],
};

/* ----------------------------------------------------------------- icons */

const icons = {
  home: "M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z",
  card: "M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM3 10h18M7 15h3",
  list: "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01",
  pie: "M21 12A9 9 0 1 1 12 3v9zM15 3.5A9 9 0 0 1 20.5 9H15z",
  users: "M16 19v-1a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v1M9.5 10a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7M21 19v-1a4 4 0 0 0-3-3.87M15 3.13a3.5 3.5 0 0 1 0 6.75",
  settings: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6M4 12h2M18 12h2M12 4v2M12 18v2M6.3 6.3l1.4 1.4M16.3 16.3l1.4 1.4M6.3 17.7l1.4-1.4M16.3 7.7l1.4-1.4",
  search: "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14M20 20l-4-4",
  bell: "M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0",
  menu: "M4 6h16M4 12h16M4 18h16",
  close: "M6 6l12 12M18 6 6 18",
  up: "M7 17 17 7M8 7h9v9",
  down: "M7 7l10 10M17 8v9H8",
  send: "M22 2 11 13M22 2l-7 20-4-9-9-4z",
  request: "M12 5v14M5 12l7 7 7-7",
  plus: "M12 5v14M5 12h14",
  list2: "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01",
  alert: "M12 3 2 20h20zM12 10v4M12 17h.01",
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
    label: "Money",
    items: [
      { label: "Overview", href: "#overview", icon: <Icon name="home" /> },
      { label: "Cards", href: "#cards", icon: <Icon name="card" /> },
      { label: "Transactions", href: "#transactions", icon: <Icon name="list" />, badge: 3 },
    ],
  },
  {
    label: "Planning",
    items: [
      { label: "Budgets", href: "#budgets", icon: <Icon name="pie" /> },
      { label: "Payees", href: "#payees", icon: <Icon name="users" /> },
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

const defaultBrand: NonNullable<DashboardChrome["brand"]> = { title: "Ledger", subtitle: "Personal finance" };
const defaultProfile: NonNullable<DashboardChrome["profile"]> = { name: "Ada Kaya", role: "Personal account" };

function Sidebar({ onNavigate, chrome }: { onNavigate?: () => void; chrome: DashboardChrome }) {
  const { current } = useContext(DashNav);
  const [query, setQuery] = useState("");
  const brand = chrome.brand ?? defaultBrand;
  const profile = chrome.profile ?? defaultProfile;
  // By default, a card that tilts its light like the real one.
  const footer = chrome.sidebarFooter === undefined ? (
      <div className="relative overflow-hidden rounded-field bg-gradient-to-br from-accent/30 via-info/20 to-warning/15 p-4 shadow-[inset_0_1px_0_rgb(255_255_255/0.25)]">
        <div className="flex items-center justify-between text-xs text-fg/70">
          <span>Ledger Debit</span>
          <span className="font-medium tracking-widest">VISA</span>
        </div>
        <div className="mt-6 font-mono text-sm tracking-[0.2em]">•••• 4821</div>
        <div className="mt-1 text-xs text-fg/60">Ada Kaya · 08/29</div>
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
              <a href={chrome.exitHref} aria-label="Sign out" className={buttonVariants({ variant: "ghost", size: "icon-sm", className: "text-muted" })}>
                <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 17l5-5-5-5M15 12H4" />
                </svg>
              </a>
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

function Delta({ value, upIsGood = true }: { value: number; upIsGood?: boolean }) {
  const up = value >= 0;
  const good = up === upIsGood;
  return (
    <Badge variant={good ? "success" : "danger"} className="gap-0.5 px-1.5 text-[11px] tabular-nums">
      <Icon name={up ? "up" : "down"} className="size-3" />
      {up ? "+" : "−"}
      {Math.abs(value).toFixed(1)}%<span className="sr-only">{up ? " increase" : " decrease"}</span>
    </Badge>
  );
}

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
  "#overview": "Wallet",
  "#cards": "Cards",
  "#transactions": "Transactions",
  "#budgets": "Budgets",
  "#payees": "Payees",
};

/* ------------------------------------------------------------- screen */

/** Every prop is optional; see DashboardChrome to share one app shell across several dashboards. */
export interface DashboardFinanceProps extends DashboardChrome {
  content?: Partial<FinanceContent>;
}

export function DashboardFinance({ logo = <BrandGlyph />, content, ...props }: DashboardFinanceProps = {}) {
  const c = { ...walletContent, ...content };
  const chrome = { ...props, logo };
  const profile = props.profile ?? defaultProfile;
  const [range, setRange] = useState<Range>("month");
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [current, setCurrent] = useState("#overview");
  const heading = (current === "#overview" && chrome.title) || (sectionTitles[current] ?? "Wallet");
  const crumbs = chrome.nav ? navTrail(chrome.nav, chrome.currentHref ?? "", chrome.title) : navTrail(groups, current);
  const [saved, setSaved] = useState(c.goal.start);
  const data = datasets[range];
  const query = search.trim().toLowerCase();
  const rows = query
    ? c.transactions.filter((t) => `${t.merchant} ${t.category}`.toLowerCase().includes(query))
    : c.transactions;
  const { goal } = c;

  function addToGoal() {
    if (!goal.step) return;
    setSaved((v) => Math.min(goal.target, v + goal.step!.amount));
    toast.success(goal.step.toast.title, { description: goal.step.toast.description });
  }

  function run(action: FinanceAction) {
    if (action.go) setCurrent(action.go);
    if (action.copy) void navigator.clipboard?.writeText(action.copy).catch(() => {});
    if (action.toast) toast.success(action.toast.title, { description: action.toast.description });
  }

  return (
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
            <SearchInput label={c.ledgerSearch} placeholder={`${c.ledgerSearch}…`} value={search} onValueChange={setSearch} className="min-w-0 flex-1 sm:max-w-xs" />
            <div className="ml-auto flex items-center gap-2">
              <NotificationBell items={toBellItems(c.notifications)} onItemsChange={chrome.onNotificationsChange} viewAllHref={chrome.notificationsHref} />
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
                description={chrome.subtitle ?? "Everyday account · USD"}
                actions={
                  <SegmentedControl
                    aria-label="Period"
                    value={range}
                    onValueChange={setRange}
                    options={[
                      { value: "week", label: "Week" },
                      { value: "month", label: "Month" },
                      { value: "quarter", label: "Quarter" },
                    ]}
                  />
                }
              />
            </div>

            <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
              <section className="surface rounded-card p-5 md:p-6 xl:col-span-2">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="text-sm text-muted">{c.balanceLabel}</h2>
                    <div className="mt-2 flex flex-wrap items-baseline gap-3">
                      <span className="text-5xl font-semibold tracking-tight md:text-6xl">
                        <NumberTicker value={data.current} decimals={2} prefix="$" />
                      </span>
                      <Delta value={data.change} />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {c.actions.map((action, i) => {
                      const variant = i === 0 ? "solid" : "surface";
                      const icon = <Icon name={action.icon === "list" ? "list2" : action.icon} />;
                      return action.href ? (
                        <a key={action.label} href={action.href} className={buttonVariants({ variant, size: "sm" })}>
                          {icon}
                          {action.label}
                        </a>
                      ) : (
                        <Button key={action.label} variant={variant} size="sm" onClick={() => run(action)}>
                          {icon}
                          {action.label}
                        </Button>
                      );
                    })}
                  </div>
                </div>
                <ChartArea
                  className="mt-6"
                  label={`${c.seriesName} over the selected ${range}`}
                  labels={data.labels}
                  series={[{ name: c.seriesName, values: data.balance }]}
                  formatValue={usd}
                  height={240}
                />
              </section>

              <Panel title={goal.title}>
                <div className="grid place-items-center gap-4 py-2">
                  <ChartRadialMeter value={saved} max={goal.target} label={`of ${usd(goal.target)}`} display={`${Math.round((saved / goal.target) * 100)}%`} />
                  <p className="max-w-56 text-center text-sm text-muted">{goal.note}</p>
                  <p className="text-xs text-muted tabular-nums">
                    {usd(saved)} {goal.progressLabel}
                  </p>
                  {goal.step && (
                    <Button size="sm" onClick={addToGoal} disabled={saved >= goal.target}>
                      {goal.step.label}
                    </Button>
                  )}
                </div>
              </Panel>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {data.tiles.map((tile, i) => {
                const t = { ...tile, ...c.tiles[i] };
                return (
                <section key={t.label} className="surface rounded-card p-5">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="text-sm text-muted">{t.label}</h2>
                    <Delta value={t.delta} upIsGood={t.upIsGood ?? true} />
                  </div>
                  <div className="mt-3 text-3xl font-semibold tracking-tight">
                    <NumberTicker value={t.value} prefix="$" />
                  </div>
                  <ChartSparkline data={t.trend} label={`${t.label} trend`} className="mt-4 h-10" />
                </section>
                );
              })}
            </div>

            <div className="grid grid-cols-1 gap-5 xl:grid-cols-5">
              <Panel title={c.breakdownTitle} className="xl:col-span-2">
                <ChartDonut
                  label={c.breakdownTitle}
                  data={data.categories.map((d, i) => ({ ...d, label: c.categoryLabels[i] ?? d.label }))}
                  formatValue={usd}
                  centerLabel={c.breakdownCenter}
                />
                <div className="mt-6 grid gap-4 border-t border-line pt-5">
                  <h3 className="text-xs tracking-[0.14em] text-muted uppercase">{c.budgetsTitle}</h3>
                  {c.budgets.map((b) => {
                    const pct = Math.min(b.spent / b.limit, 1);
                    const over = b.spent > b.limit;
                    return (
                      <div key={b.label}>
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-2 text-fg/85">
                            {b.label}
                            {over && (
                              <Badge variant="danger" className="gap-1 px-1.5 text-[11px]">
                                <Icon name="alert" />
                                Over
                              </Badge>
                            )}
                          </span>
                          <span className="text-muted tabular-nums">
                            {usd(b.spent)} <span className="text-muted/60">/ {usd(b.limit)}</span>
                          </span>
                        </div>
                        <Progress
                          aria-label={`${b.label}: ${usd(b.spent)} of ${usd(b.limit)}`}
                          value={pct * 100}
                          className={cn("mt-2 h-1.5 shadow-none", over && "bg-danger/20")}
                          tone={over ? "danger" : pct > 0.9 ? "warning" : "accent"}
                        />
                      </div>
                    );
                  })}
                </div>
              </Panel>

              <Panel title={c.ledgerTitle} className="xl:col-span-3" action={
                  <Button variant="ghost" size="sm" onClick={() => { setSearch(""); setCurrent("#transactions"); }}>
                    {c.viewAllLabel}
                  </Button>
                }
              >
                {rows.length === 0 ? (
                  <EmptyState
                    size="compact"
                    title="Nothing matches that search"
                    description={c.ledgerEmptyHint}
                    action={<Button size="sm" variant="ghost" onClick={() => setSearch("")}>Clear search</Button>}
                  />
                ) : (
                <Table frame={false} className="min-w-[30rem]">
                  <TableHeader className="bg-transparent">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="h-9 pl-0">{c.ledgerColumns[0]}</TableHead>
                      <TableHead className="h-9">{c.ledgerColumns[1]}</TableHead>
                      <TableHead className="h-9">Date</TableHead>
                      <TableHead className="h-9 pr-0 text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.map((t) => (
                      <TableRow key={t.merchant + t.date}>
                        <TableHead scope="row" className="h-auto py-3 pl-0 font-normal tracking-normal text-fg normal-case">
                          <span className="flex items-center gap-3 text-sm">
                            <Avatar aria-hidden alt={t.merchant} fallback={t.merchant.slice(0, 1)} className="size-9 font-semibold" />
                            <span className="text-fg/90">{t.merchant}</span>
                          </span>
                        </TableHead>
                        <TableCell className="py-3 text-muted">{t.category}</TableCell>
                        <TableCell className="py-3 text-muted tabular-nums">{t.date}</TableCell>
                        <TableCell className={cn("py-3 pr-0 text-right font-medium tabular-nums", t.amount > 0 ? "text-success" : "text-fg")}>
                          {t.amount > 0 ? "+" : "−"}
                          {usdCents(Math.abs(t.amount))}
                        </TableCell>
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
  );
}
