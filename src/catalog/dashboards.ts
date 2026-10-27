import type { CatalogEntry } from "./types.ts";

// Shared by all three screens.
const shell = [
  "page-header",
  "breadcrumb",
  "nav-trail",
  "chart-area",
  "chart-sparkline",
  "button",
  "number-ticker",
  "segmented-control",
  "chart-lib",
  "sidebar-nav",
  "sheet",
  "aurora-backdrop",
];

/** Complete application screens. Each is one file with its own sample data. */
export const dashboards: CatalogEntry[] = [
  {
    slug: "dashboard-analytics",
    name: "Analytics",
    description: "Product analytics: KPI tiles with sparklines, visitors against the previous period, traffic sources, sign-ups by weekday and top pages.",
    category: "dashboards",
    engine: "CSS",
    files: ["dashboards/dashboard-analytics.tsx"],
    uses: [...shell, "chart-bar", "chart-donut", "avatar", "account-menu", "badge", "brand-mark", "progress", "search-input", "table", "tooltip", "states", "toast", "notification-bell"],
    previewHeight: 960,
    props: [
      { name: "exitHref", type: "string", description: "Adds a sign-out link to the profile card, e.g. back to your marketing site." },
      { name: "logo", type: "ReactNode", default: "<BrandGlyph />", description: "Glyph inside the accent brand tile." },
      { name: "notifications", type: "DashboardNotice[]", description: "Header bell items: title, body, time, and optional id, tone, href and read." },
      { name: "notificationsHref / onNotificationsChange", type: "string / (items) => void", description: "Link to all notifications, and a callback to keep the read state across pages. Same on Finance and DevOps." },
    ],
  },
  {
    slug: "dashboard-finance",
    name: "Finance",
    description: "A personal wallet: hero balance with quick actions, balance history, a savings goal meter, spending by category, budgets and recent transactions.",
    category: "dashboards",
    engine: "CSS",
    files: ["dashboards/dashboard-finance.tsx"],
    uses: [...shell, "chart-donut", "chart-radial-meter", "avatar", "account-menu", "badge", "brand-mark", "progress", "search-input", "table", "states", "toast", "notification-bell"],
    previewHeight: 960,
  },
  {
    slug: "dashboard-devops",
    name: "DevOps",
    description: "Platform health: deploy KPIs, hourly latency percentiles, resource gauges, a deploy heatmap, service status and recent deployments.",
    category: "dashboards",
    engine: "CSS",
    files: ["dashboards/dashboard-devops.tsx"],
    uses: [...shell, "chart-heatmap", "chart-radial-meter", "avatar", "account-menu", "badge", "live-indicator", "search-input", "spinner", "table", "states", "toast", "notification-bell"],
    previewHeight: 960,
  },
];
