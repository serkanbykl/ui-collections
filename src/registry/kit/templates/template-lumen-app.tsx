"use client";

import type { ReactNode } from "react";

import { AppShell, type AppShellMenuItem } from "@/registry/kit/blocks/app-shell";
import { DashboardAnalytics, type DashboardChrome } from "@/registry/kit/dashboards/dashboard-analytics";
import { DashboardDevops, type DashboardNotice, type Deployment, type Service } from "@/registry/kit/dashboards/dashboard-devops";
import { DashboardFinance, type FinanceContent } from "@/registry/kit/dashboards/dashboard-finance";
import { CalendarScreen } from "@/registry/kit/screens/screen-calendar";
import { ChatScreen } from "@/registry/kit/screens/screen-chat";
import { ContactsScreen } from "@/registry/kit/screens/screen-contacts";
import { CustomerDetailScreen } from "@/registry/kit/screens/screen-customer-detail";
import { CustomersScreen, sampleCustomers } from "@/registry/kit/screens/screen-customers";
import { CrmDashboardScreen } from "@/registry/kit/screens/screen-dashboard-crm";
import { EcommerceDashboardScreen } from "@/registry/kit/screens/screen-dashboard-ecommerce";
import { ProjectsDashboardScreen } from "@/registry/kit/screens/screen-dashboard-projects";
import { FaqScreen } from "@/registry/kit/screens/screen-faq";
import { FileManagerScreen } from "@/registry/kit/screens/screen-file-manager";
import { HelpArticleScreen } from "@/registry/kit/screens/screen-help-article";
import { HelpCenterScreen } from "@/registry/kit/screens/screen-help-center";
import { InvoiceEditorScreen } from "@/registry/kit/screens/screen-invoice-editor";
import { InvoicePreviewScreen } from "@/registry/kit/screens/screen-invoice-preview";
import { InvoicesScreen, sampleInvoices } from "@/registry/kit/screens/screen-invoices";
import { KanbanScreen } from "@/registry/kit/screens/screen-kanban";
import { MailScreen, defaultMessages } from "@/registry/kit/screens/screen-mail";
import { NotesScreen } from "@/registry/kit/screens/screen-notes";
import { OrderDetailScreen, sampleOrderDetail } from "@/registry/kit/screens/screen-order-detail";
import { OrdersScreen, sampleOrders } from "@/registry/kit/screens/screen-orders";
import { ProductDetailScreen, sampleProductDetail } from "@/registry/kit/screens/screen-product-detail";
import { ProductFormScreen, emptyProductForm } from "@/registry/kit/screens/screen-product-form";
import { ProductsScreen, sampleProducts } from "@/registry/kit/screens/screen-products";
import { RolesScreen } from "@/registry/kit/screens/screen-roles";
import { SearchResultsScreen } from "@/registry/kit/screens/screen-search-results";
import { SettingsApiScreen } from "@/registry/kit/screens/screen-settings-api";
import { SettingsBillingScreen } from "@/registry/kit/screens/screen-settings-billing";
import { SettingsConnectionsScreen } from "@/registry/kit/screens/screen-settings-connections";
import { SettingsGeneralScreen } from "@/registry/kit/screens/screen-settings-general";
import { SettingsNotificationsScreen } from "@/registry/kit/screens/screen-settings-notifications";
import { SettingsSecurityScreen } from "@/registry/kit/screens/screen-settings-security";
import { storeItemCount } from "@/registry/kit/screens/screen-store";
import { TasksScreen } from "@/registry/kit/screens/screen-tasks";
import { TeamScreen } from "@/registry/kit/screens/screen-team";
import { storeHome, useLumenCart } from "@/registry/kit/templates/template-lumen-store";
import { TimelineScreen } from "@/registry/kit/screens/screen-timeline";
import { UserProfileScreen, sampleProfile } from "@/registry/kit/screens/screen-user-profile";
import { UsersScreen, sampleUsers } from "@/registry/kit/screens/screen-users";
import type { SettingsLink } from "@/registry/kit/screens/settings-layout";
import type { NotificationItem } from "@/registry/kit/ui/notification-bell";
import { Progress } from "@/registry/kit/ui/progress";
import type { SidebarGroup } from "@/registry/kit/ui/sidebar-nav";

/*
 * Lumen's app area: one navigation, one person and one shell shared by every
 * screen. The three full dashboards bring their own shell, so they get the
 * same nav, brand and profile through their DashboardChrome props.
 */

export const href = (route: string) => `#${route}`;

export const go = (route: string) => {
  window.location.hash = route;
};

/** Lumen's glyph: a small sun, set inside the accent BrandMark tile. */
export function LumenGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
      <circle cx="12" cy="12" r="3.25" fill="currentColor" stroke="none" />
      <path d="M12 3.5v2M12 18.5v2M3.5 12h2M18.5 12h2M6 6l1.4 1.4M16.6 16.6 18 18M6 18l1.4-1.4M16.6 7.4 18 6" />
    </svg>
  );
}

function AppIcon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="size-4.5 shrink-0">
      <path d={d} />
    </svg>
  );
}

const icon = {
  analytics: "M4 19V9M10 19V5M16 19v-7M22 19H2",
  cart: "M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 8H6M10 21h.01M18 21h.01",
  crm: "M16 11a4 4 0 1 0-8 0M3 21a9 9 0 0 1 18 0M12 7V3M8 5l4 2 4-2",
  projects: "M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM8 13h8",
  billing: "M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM3 10h18M7 15h3",
  status: "M3 12h4l3-8 4 16 3-8h4",
  mail: "M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zM3.5 6l8.5 7 8.5-7",
  chat: "M21 12a8 8 0 0 1-11.8 7L4 20l1.1-4.6A8 8 0 1 1 21 12z",
  calendar: "M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zM4 10h16M8 2v4M16 2v4",
  kanban: "M4 4h4v16H4zM10 4h4v10h-4zM16 4h4v13h-4z",
  tasks: "M9 6h11M9 12h11M9 18h11M4 6l1 1 2-2M4 12l1 1 2-2M4 18l1 1 2-2",
  notes: "M6 3h9l5 5v13H6zM14 3v6h6M9 13h7M9 17h5",
  files: "M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
  contacts: "M5 3h13a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H5zM12 11a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM8 17a4 4 0 0 1 8 0M3 7h2M3 12h2M3 17h2",
  products: "M21 8 12 3 3 8v8l9 5 9-5zM3 8l9 5 9-5M12 13v8",
  store: "M4 9h16l-1 11a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1zM8 9V7a4 4 0 0 1 8 0v2",
  orders: "M6 3h12l2 4v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7zM4 7h16M9 11a3 3 0 0 0 6 0",
  customers: "M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM2 21a7 7 0 0 1 14 0M17 11a3 3 0 1 0 0-6M22 21a6 6 0 0 0-4-5.7",
  invoices: "M6 2h9l5 5v15H6zM14 2v6h6M9 13h6M9 17h6M9 9h2",
  users: "M16 21v-1a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v1M9 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM19 8v6M22 11h-6",
  profile: "M12 12a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9zM4 21a8 8 0 0 1 16 0",
  roles: "M12 3 4 6v6c0 4.5 3.4 8.3 8 9 4.6-.7 8-4.5 8-9V6zM9 12l2 2 4-4",
  team: "M17 20a5 5 0 0 0-10 0M12 12a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM20 18a4 4 0 0 0-3-3.8M4 18a4 4 0 0 1 3-3.8",
  general: "M4 7h10M18 7h2M4 17h4M12 17h8M16 5v4M10 15v4",
  security: "M6 10V8a6 6 0 0 1 12 0v2M5 10h14v11H5zM12 14v3",
  bell: "M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0",
  card: "M2 7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2zM2 10h20M6 15h4",
  api: "M8 6 2 12l6 6M16 6l6 6-6 6M14 4l-4 16",
  plug: "M9 2v6M15 2v6M6 8h12v4a6 6 0 0 1-12 0zM12 18v4",
  help: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6V14M12 17h.01",
  faq: "M4 5h16v11H8l-4 4zM9 9h6M9 12h4",
  search: "M11 17.5a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13M20 20l-4-4",
  activity: "M12 8v4l3 2M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5",
  lock: "M7 11V8a5 5 0 0 1 10 0v3M5 11h14v10H5z",
  signOut: "M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 17l5-5-5-5M15 12H4",
};

const item = (label: string, route: string, d: string, extra?: Partial<SidebarGroup["items"][number]>) => ({
  label,
  href: href(route),
  icon: <AppIcon d={d} />,
  ...extra,
});

const unreadMail = defaultMessages.filter((m) => m.folder === "inbox" && m.unread).length;

/** The one navigation every app page shows. */
export const appNav: SidebarGroup[] = [
  {
    label: "Dashboards",
    items: [
      item("Analytics", "/app", icon.analytics),
      item("eCommerce", "/app/ecommerce", icon.cart),
      item("CRM", "/app/crm", icon.crm),
      item("Projects", "/app/projects", icon.projects),
      item("Billing", "/app/billing", icon.billing),
      item("Status", "/app/status", icon.status, { badge: 1 }),
    ],
  },
  {
    label: "Apps",
    items: [
      item("Mail", "/app/mail", icon.mail, unreadMail ? { badge: unreadMail } : undefined),
      item("Chat", "/app/chat", icon.chat),
      item("Calendar", "/app/calendar", icon.calendar),
      item("Kanban", "/app/kanban", icon.kanban),
      item("Tasks", "/app/tasks", icon.tasks),
      item("Notes", "/app/notes", icon.notes),
      item("Files", "/app/files", icon.files),
      item("Contacts", "/app/contacts", icon.contacts),
    ],
  },
  {
    label: "E-commerce",
    items: [
      item("Products", "/app/products", icon.products, {
        overviewLabel: "All products",
        children: [
          { label: "Add product", href: href("/app/products/new") },
          { label: "Edit product", href: href("/app/products/edit") },
        ],
      }),
      item("Orders", "/app/orders", icon.orders),
      // Opens the public storefront, like "View store" in a commerce admin.
      item("Store", "/store", icon.store, {
        overviewLabel: "Storefront",
        children: [
          { label: "Cart", href: href("/store/cart") },
          { label: "Checkout", href: href("/store/checkout") },
        ],
      }),
      item("Customers", "/app/customers", icon.customers),
      item("Invoices", "/app/invoices", icon.invoices, {
        overviewLabel: "All invoices",
        children: [
          { label: "Invoice preview", href: href("/app/invoices/preview") },
          { label: "New invoice", href: href("/app/invoices/new") },
        ],
      }),
    ],
  },
  {
    label: "Users",
    items: [
      item("Users", "/app/users", icon.users),
      item("Profile", "/app/profile", icon.profile),
      item("Roles", "/app/roles", icon.roles),
      item("Team", "/app/team", icon.team),
    ],
  },
  {
    label: "Settings",
    items: [
      item("General", "/app/settings", icon.general),
      item("Security", "/app/settings/security", icon.security),
      item("Notifications", "/app/settings/notifications", icon.bell),
      item("Plan and billing", "/app/settings/billing", icon.card),
      item("API & webhooks", "/app/settings/api", icon.api),
      item("Connections", "/app/settings/connections", icon.plug),
    ],
  },
  {
    label: "Support",
    items: [
      item("Help center", "/app/help", icon.help),
      item("FAQ", "/app/help/faq", icon.faq),
      item("Search", "/app/search", icon.search),
      item("Activity", "/app/activity", icon.activity),
    ],
  },
];

const settingsLinks: SettingsLink[] = [
  { id: "general", label: "General", href: href("/app/settings") },
  { id: "security", label: "Security", href: href("/app/settings/security") },
  { id: "notifications", label: "Notifications", href: href("/app/settings/notifications") },
  { id: "billing", label: "Billing", href: href("/app/settings/billing") },
  { id: "api", label: "API & webhooks", href: href("/app/settings/api") },
  { id: "connections", label: "Connections", href: href("/app/settings/connections") },
];

const me = { name: "Ada Kaya", role: "Growth lead", email: "ada@lumen.example" };

const userMenu: AppShellMenuItem[] = [
  { label: "Your profile", href: href("/app/profile"), icon: <AppIcon d={icon.profile} /> },
  { label: "Settings", href: href("/app/settings"), icon: <AppIcon d={icon.general} /> },
  { label: "Plan and billing", href: href("/app/settings/billing"), icon: <AppIcon d={icon.card} /> },
  { label: "Help center", href: href("/app/help"), icon: <AppIcon d={icon.help} /> },
  { label: "Lock screen", href: href("/lock"), icon: <AppIcon d={icon.lock} />, separated: true },
  { label: "Sign out", href: href("/signin"), icon: <AppIcon d={icon.signOut} />, variant: "danger" },
];

const usageCard = (
  <div className="rounded-field bg-fg/[0.04] p-4 text-sm">
    <div className="font-medium">Events this month</div>
    <Progress value={68.3} aria-label="Events used this month" className="mt-2 h-1.5" />
    <div className="mt-2 text-xs text-muted">683,412 of 1M on the Growth plan</div>
  </div>
);

const brand = { title: "Lumen", subtitle: "Product analytics", href: href("/app") };

const firstOrder = sampleOrders[0]!;
const overdueInvoice = sampleInvoices.find((i) => i.status === "overdue") ?? sampleInvoices[0]!;

// Every bell in the app links to a real page; the read state is shared, so a
// notification read in one shell stays read on the next page.
const readNotices = new Set<string>();
const notices = <T extends { id?: string; read?: boolean }>(list: T[]) => list.map((n) => (n.id && readNotices.has(n.id) ? { ...n, read: true } : n));
// The analytics dashboard is the app's home, so its bell shows the shell's notifications.
const asDashboardNotices = (list: NotificationItem[]): DashboardNotice[] => list.map(({ detail, time, ...n }) => ({ ...n, body: detail ?? "", time: time ?? "" }));
const rememberRead = (list: NotificationItem[]) => list.forEach((n) => n.read && readNotices.add(n.id));
const notificationsHref = href("/app/activity");

const shellNotices: NotificationItem[] = [
  {
    id: "order",
    title: `Order ${firstOrder.number} is ready to fulfil`,
    detail: `${firstOrder.customer} · ${firstOrder.items} ${firstOrder.items === 1 ? "item" : "items"}`,
    time: "6 minutes ago",
    href: href(`/app/orders/${firstOrder.id}`),
  },
  { id: "spike", title: "Spike from news.ycombinator.com", detail: "1,283 visitors in the last hour", time: "12 minutes ago", tone: "info", href: href("/app") },
  {
    id: "invoice",
    title: `Invoice ${overdueInvoice.number} is overdue`,
    detail: `${overdueInvoice.client} · due ${overdueInvoice.due}`,
    time: "2 hours ago",
    tone: "warning",
    href: href(`/app/invoices/${overdueInvoice.id}`),
  },
  { id: "member", title: "Hana Sato accepted your invite", detail: "Joined Lumen as Editor", time: "Yesterday", tone: "success", href: href("/app/team"), read: true },
];

// Shared by the three dashboards, which render their own shell.
const dashboardChrome: DashboardChrome = {
  logo: <LumenGlyph />,
  brand,
  profile: { ...me, menu: userMenu },
  nav: appNav,
  sidebarFooter: usageCard,
  exitHref: href("/signin"),
  notificationsHref,
  onNotificationsChange: rememberRead,
};

/* ------------------------------------------------- dashboard content */

// The finance dashboard, reframed as Lumen's own revenue and billing screen.
const revenue: Partial<FinanceContent> = {
  balanceLabel: "Monthly recurring revenue",
  seriesName: "MRR",
  actions: [
    { label: "Download invoices", icon: "list", toast: { title: "Exported invoices-oct-2026.zip", description: "412 invoices from Oct 1 to Oct 25, as PDF." } },
    { label: "Send payment reminders", icon: "send", toast: { title: "Reminders sent to 3 customers", description: "Each has an invoice more than 7 days overdue." } },
  ],
  goal: {
    title: "ARR goal",
    target: 600_000,
    start: 498_960,
    note: (
      <>
        Year-end target. At October&apos;s growth you reach it in <span className="text-fg">4 months</span>.
      </>
    ),
    progressLabel: "annual run rate",
  },
  tiles: [{ label: "New MRR" }, { label: "Churned MRR", upIsGood: false }, { label: "Net new MRR" }],
  categoryLabels: ["Business", "Growth", "Business yearly", "Add-ons"],
  breakdownTitle: "Revenue by plan",
  breakdownCenter: "Revenue",
  budgetsTitle: "Costs against budget",
  budgets: [
    { label: "Hosting", spent: 612, limit: 700 },
    { label: "Ads", spent: 284, limit: 250 },
    { label: "Support tools", spent: 198, limit: 320 },
    { label: "Email delivery", spent: 86, limit: 90 },
  ],
  ledgerTitle: "Recent payments",
  ledgerColumns: ["Customer", "Plan"],
  ledgerSearch: "Search payments",
  ledgerEmptyHint: "Search by customer or plan, such as Growth.",
  viewAllLabel: "View all payments",
  transactions: [
    { merchant: "Polaris", category: "Business yearly", date: "Oct 25", amount: 948 },
    { merchant: "Kitebase", category: "Growth", date: "Oct 25", amount: 24 },
    { merchant: "Orbitly", category: "Business", date: "Oct 24", amount: 96 },
    { merchant: "Hetzner Online", category: "Hosting", date: "Oct 24", amount: -612.4 },
    { merchant: "Fernwood Studio", category: "Refund · Growth", date: "Oct 23", amount: -24 },
    { merchant: "Marlow & Finch", category: "Growth yearly", date: "Oct 22", amount: 228 },
  ],
  notifications: [
    { id: "pay-failed", title: "Payment failed: Fernwood Studio", body: "Card declined on a $24.00 Growth renewal. We retry on Oct 28.", time: "40 min ago", tone: "danger", href: href("/app/invoices") },
    { id: "polaris", title: "Polaris moved to Business yearly", body: "+$948.00, starting today.", time: "3 h ago", tone: "success", href: href("/app/customers") },
    { id: "ads", title: "Ads are over budget", body: "$284 of $250 with six days left.", time: "Yesterday", tone: "warning", href: href("/app/settings/billing") },
  ],
};

// The devops dashboard, reframed as the status of Lumen's own platform.
const services: Service[] = [
  { name: "ingest", region: "eu-central", status: "operational", uptime: "99.99%" },
  { name: "dashboard", region: "eu-central", status: "operational", uptime: "99.98%" },
  { name: "script-cdn", region: "global", status: "operational", uptime: "99.99%" },
  { name: "exports", region: "eu-north", status: "degraded", uptime: "99.71%" },
  { name: "ga-importer", region: "eu-north", status: "operational", uptime: "99.95%" },
];

const deployments: Deployment[] = [
  { sha: "a41f9c2", message: "Stream CSV exports instead of buffering", service: "exports", author: "MK", status: "building", duration: "1m 12s", when: "just now" },
  { sha: "7be03d1", message: "Funnels 2.0: median time between steps", service: "dashboard", author: "AK", status: "success", duration: "2m 48s", when: "18 min ago" },
  { sha: "c90e4a7", message: "Drop bot traffic before counting", service: "ingest", author: "JL", status: "success", duration: "3m 05s", when: "1 h ago" },
  { sha: "1d2c8f0", message: "Import GA4 custom dimensions", service: "ga-importer", author: "SR", status: "failed", duration: "0m 54s", when: "2 h ago" },
  { sha: "e5a7b33", message: "Serve l.js with Brotli at the edge", service: "script-cdn", author: "AK", status: "success", duration: "2m 11s", when: "4 h ago" },
];

const statusNotifications: DashboardNotice[] = [
  { id: "exports", title: "exports is degraded", body: "Large CSV exports take 3× longer than usual. A fix is deploying.", time: "12 min ago", tone: "warning", href: href("/app/activity") },
  { id: "deploy", title: "Deploy failed: 1d2c8f0", body: "GA4 import tests timed out. Nothing reached production.", time: "2 h ago", tone: "danger", href: href("/app/activity") },
  { id: "cdn", title: "script-cdn p95 at 41 ms", body: "Down from 58 ms after enabling Brotli.", time: "4 h ago", tone: "success", read: true },
];

const myProfile = {
  ...sampleProfile,
  name: me.name,
  title: me.role,
  team: "Growth",
  location: "Istanbul, Türkiye",
  localTime: "16:32",
  email: me.email,
  joined: "Joined January 2024",
  bio: "Runs growth at Lumen: onboarding, pricing experiments and the funnels everyone else reads. Before Lumen she led lifecycle marketing at Kitebase.",
};

/** The app menu with the storefront cart's item count on Store. */
function navWithCart(count: number): SidebarGroup[] {
  return appNav.map((group) => ({
    ...group,
    items: group.items.map((i) => (i.href === href(storeHome) && count > 0 ? { ...i, badge: count } : i)),
  }));
}

/* -------------------------------------------------------------- pages */

export interface AppPage {
  /** Hash path; `:id` matches any one segment. */
  path: string;
  /** Top-bar title and the label in the page index. */
  title: string;
  /** Group in the page index. */
  section: string;
  /** A concrete path for `:id` routes. */
  sample?: string;
  /** The nav link to mark; defaults to `path`. */
  nav?: string;
  /** Full-page dashboards render their own shell. */
  dashboard?: boolean;
  /** `route` is the matched path; `nav` the app menu with live counts. */
  render: (ctx: { route: string; nav: SidebarGroup[] }) => ReactNode;
}

const settings = (path: string, title: string, render: () => ReactNode): AppPage => ({ path, title, section: "Settings", render });

export const appPages: AppPage[] = [
  // Dashboards: three full dashboards and three screens in the shared shell.
  {
    path: "/app",
    title: "Analytics",
    section: "Dashboards",
    dashboard: true,
    render: ({ nav }) => <DashboardAnalytics {...dashboardChrome} notifications={notices(asDashboardNotices(shellNotices))} nav={nav} currentHref={href("/app")} title="Analytics" subtitle="lumen.app · all traffic" />,
  },
  { path: "/app/ecommerce", title: "eCommerce", section: "Dashboards", render: () => <EcommerceDashboardScreen /> },
  { path: "/app/crm", title: "CRM", section: "Dashboards", render: () => <CrmDashboardScreen /> },
  { path: "/app/projects", title: "Projects", section: "Dashboards", render: () => <ProjectsDashboardScreen projectHref={href("/app/kanban")} /> },
  {
    path: "/app/billing",
    title: "Billing",
    section: "Dashboards",
    dashboard: true,
    render: ({ nav }) => <DashboardFinance {...dashboardChrome} nav={nav} currentHref={href("/app/billing")} title="Billing" subtitle="Lumen Inc. · revenue in USD" content={{ ...revenue, notifications: notices(revenue.notifications ?? []) }} />,
  },
  {
    path: "/app/status",
    title: "Status",
    section: "Dashboards",
    dashboard: true,
    render: ({ nav }) => (
      <DashboardDevops
        {...dashboardChrome}
        nav={nav}
        currentHref={href("/app/status")}
        title="Status"
        subtitle={`lumen-platform · ${services.length} services`}
        services={services}
        deployments={deployments}
        notifications={notices(statusNotifications)}
      />
    ),
  },

  // Apps.
  { path: "/app/mail", title: "Mail", section: "Apps", render: () => <MailScreen me={{ name: me.name, email: me.email }} /> },
  { path: "/app/chat", title: "Chat", section: "Apps", render: () => <ChatScreen /> },
  { path: "/app/calendar", title: "Calendar", section: "Apps", render: () => <CalendarScreen /> },
  { path: "/app/kanban", title: "Kanban", section: "Apps", render: () => <KanbanScreen /> },
  // Project names on the projects dashboard open that project's board.
  { path: "/app/kanban/:id", title: "Project board", section: "Apps", sample: "/app/kanban/funnels-2", nav: "/app/kanban", render: () => <KanbanScreen /> },
  { path: "/app/tasks", title: "Tasks", section: "Apps", render: () => <TasksScreen /> },
  { path: "/app/notes", title: "Notes", section: "Apps", render: () => <NotesScreen /> },
  { path: "/app/files", title: "Files", section: "Apps", render: () => <FileManagerScreen me={me.name} /> },
  { path: "/app/contacts", title: "Contacts", section: "Apps", render: () => <ContactsScreen /> },

  // E-commerce.
  { path: "/app/products", title: "Products", section: "E-commerce", render: () => <ProductsScreen newHref={href("/app/products/new")} detailHref={href("/app/products")} /> },
  {
    path: "/app/products/new",
    title: "Add product",
    section: "E-commerce",
    render: () => <ProductFormScreen initialValues={emptyProductForm} cancelHref={href("/app/products")} />,
  },
  { path: "/app/products/edit", title: "Edit product", section: "E-commerce", render: () => <ProductFormScreen cancelHref={href(`/app/products/${sampleProducts[0]!.id}`)} /> },
  {
    path: "/app/products/:id",
    title: sampleProductDetail.name,
    section: "E-commerce",
    sample: `/app/products/${sampleProducts[0]!.id}`,
    nav: "/app/products",
    render: () => <ProductDetailScreen editHref={href("/app/products/edit")} />,
  },
  { path: "/app/orders", title: "Orders", section: "E-commerce", render: () => <OrdersScreen detailHref={href("/app/orders")} /> },
  {
    path: "/app/orders/:id",
    title: `Order ${sampleOrderDetail.number}`,
    section: "E-commerce",
    sample: `/app/orders/${sampleOrders[0]!.id}`,
    nav: "/app/orders",
    render: () => <OrderDetailScreen />,
  },
  { path: "/app/customers", title: "Customers", section: "E-commerce", render: () => <CustomersScreen detailHref={href("/app/customers")} /> },
  {
    path: "/app/customers/:id",
    title: "Customer",
    section: "E-commerce",
    sample: `/app/customers/${sampleCustomers[0]!.id}`,
    nav: "/app/customers",
    render: () => <CustomerDetailScreen orderHref={href("/app/orders")} />,
  },

  // Invoices.
  {
    path: "/app/invoices",
    title: "Invoices",
    section: "Invoices",
    render: () => <InvoicesScreen previewHref={href("/app/invoices")} newHref={href("/app/invoices/new")} />,
  },
  { path: "/app/invoices/new", title: "New invoice", section: "Invoices", render: () => <InvoiceEditorScreen previewHref={href("/app/invoices/preview")} /> },
  {
    path: "/app/invoices/edit",
    title: "Edit invoice",
    section: "Invoices",
    nav: "/app/invoices",
    render: () => <InvoiceEditorScreen title="Edit invoice" previewHref={href("/app/invoices/preview")} />,
  },
  { path: "/app/invoices/preview", title: "Invoice preview", section: "Invoices", render: () => <InvoicePreviewScreen editHref={href("/app/invoices/edit")} /> },
  {
    path: "/app/invoices/:id",
    title: "Invoice",
    section: "Invoices",
    sample: `/app/invoices/${sampleInvoices[0]!.id}`,
    nav: "/app/invoices",
    render: () => <InvoicePreviewScreen editHref={href("/app/invoices/edit")} />,
  },

  // Users.
  { path: "/app/users", title: "Users", section: "Users", render: () => <UsersScreen profileHref={href("/app/users")} /> },
  {
    path: "/app/users/:id",
    title: sampleProfile.name,
    section: "Users",
    sample: `/app/users/${sampleUsers[1]!.id}`,
    nav: "/app/users",
    render: () => <UserProfileScreen />,
  },
  { path: "/app/profile", title: "Your profile", section: "Users", nav: "/app/profile", render: () => <UserProfileScreen person={myProfile} /> },
  { path: "/app/roles", title: "Roles", section: "Users", render: () => <RolesScreen /> },
  { path: "/app/team", title: "Team", section: "Users", render: () => <TeamScreen billingHref={href("/app/settings/billing")} /> },

  // Settings.
  settings("/app/settings", "General settings", () => <SettingsGeneralScreen links={settingsLinks} onDeleteAccount={() => go("/")} />),
  settings("/app/settings/security", "Security", () => <SettingsSecurityScreen links={settingsLinks} accountLabel={me.email} />),
  settings("/app/settings/notifications", "Notifications", () => <SettingsNotificationsScreen links={settingsLinks} />),
  settings("/app/settings/billing", "Plan and billing", () => <SettingsBillingScreen links={settingsLinks} />),
  settings("/app/settings/api", "API & webhooks", () => <SettingsApiScreen links={settingsLinks} />),
  settings("/app/settings/connections", "Connections", () => <SettingsConnectionsScreen links={settingsLinks} />),

  // Support.
  {
    path: "/app/help",
    title: "Help center",
    section: "Support",
    render: () => (
      <HelpCenterScreen
        articleHref={(id) => href(`/app/help/article/${id}`)}
        categoryHref={() => href("/app/help/faq")}
        contactHref={href("/contact")}
      />
    ),
  },
  {
    path: "/app/help/article",
    title: "Help article",
    section: "Support",
    nav: "/app/help",
    render: () => <HelpArticleScreen helpHref={href("/app/help")} />,
  },
  {
    path: "/app/help/article/:id",
    title: "Help article",
    section: "Support",
    sample: "/app/help/article/sso-okta",
    nav: "/app/help",
    render: () => <HelpArticleScreen helpHref={href("/app/help")} />,
  },
  { path: "/app/help/faq", title: "FAQ", section: "Support", render: () => <FaqScreen contactHref={href("/contact")} /> },
  { path: "/app/search", title: "Search", section: "Support", render: () => <SearchResultsScreen /> },
  { path: "/app/activity", title: "Activity", section: "Support", render: () => <TimelineScreen /> },
];

/** One app page in the shared shell, or a full dashboard. */
export function LumenAppPage({ page, route = page.path }: { page: AppPage; route?: string }) {
  const { lines } = useLumenCart();
  const nav = navWithCart(storeItemCount(lines));
  const content = page.render({ route, nav });
  if (page.dashboard) return <>{content}</>;
  return (
    <AppShell
      logo={<LumenGlyph />}
      brand={brand}
      nav={nav}
      currentHref={href(page.nav ?? page.path)}
      title={page.title}
      user={{ ...me, settingsHref: href("/app/settings"), menu: userMenu }}
      sidebarFooter={usageCard}
      notifications={notices(shellNotices)}
      onNotificationsChange={rememberRead}
      notificationsHref={notificationsHref}
    >
      {content}
    </AppShell>
  );
}
