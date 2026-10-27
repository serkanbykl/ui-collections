"use client";

import { useState, type ReactNode } from "react";

import { cn } from "@/registry/kit/lib/utils";
import { Badge } from "@/registry/kit/ui/badge";
import { Button } from "@/registry/kit/ui/button";
import { ChartArea } from "@/registry/kit/ui/chart-area";
import { ChartDonut } from "@/registry/kit/ui/chart-donut";
import { ProgressList } from "@/registry/kit/ui/progress-list";
import { SegmentedControl } from "@/registry/kit/ui/segmented-control";
import { StatCard } from "@/registry/kit/ui/stat-card";
import { PageHeader } from "@/registry/kit/ui/page-header";

type Period = "7d" | "30d" | "90d";

export interface EcommercePeriodData {
  labels: string[];
  revenue: number[];
  previous: number[];
  orders: number;
  conversion: number;
  sessions: number;
  change: { revenue: number; orders: number; conversion: number; aov: number };
}

export interface EcommerceDashboardData {
  periods: Record<Period, EcommercePeriodData>;
  channels: { label: string; value: number }[];
  topProducts: { id: string; name: string; units: number; revenue: number }[];
  lowStock: { id: string; name: string; sku: string; left: number }[];
  recentOrders: { id: string; number: string; customer: string; total: number; status: "paid" | "pending" | "refunded"; time: string }[];
}

/** A smooth, deterministic wave so each period has a believable shape without randomness. */
function wave(n: number, base: number, amp: number, seed: number) {
  return Array.from({ length: n }, (_, i) =>
    Math.round(base + amp * Math.sin((i + seed) / 2.3) + amp * 0.45 * Math.cos((i * 3 + seed) / 4.1) + i * (amp / n) * 1.6),
  );
}

const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const sampleEcommerceData: EcommerceDashboardData = {
  periods: {
    "7d": {
      labels: weekdays,
      revenue: [4182, 3907, 4655, 5120, 6348, 7012, 5574],
      previous: [3840, 3711, 4102, 4489, 5530, 6245, 5198],
      orders: 412,
      conversion: 0.0318,
      sessions: 12956,
      change: { revenue: 0.112, orders: 0.084, conversion: 0.006, aov: 0.026 },
    },
    "30d": {
      labels: Array.from({ length: 30 }, (_, i) => (i < 6 ? `Sep ${25 + i}` : `Oct ${i - 5}`)),
      revenue: wave(30, 4700, 1100, 1),
      previous: wave(30, 4300, 950, 3),
      orders: 1683,
      conversion: 0.0297,
      sessions: 56671,
      change: { revenue: 0.087, orders: 0.061, conversion: -0.021, aov: 0.024 },
    },
    "90d": {
      labels: Array.from({ length: 13 }, (_, i) => `W${31 + i}`),
      revenue: wave(13, 32400, 5200, 2),
      previous: wave(13, 29800, 4300, 5),
      orders: 4912,
      conversion: 0.0284,
      sessions: 172958,
      change: { revenue: 0.143, orders: 0.118, conversion: 0.034, aov: 0.022 },
    },
  },
  channels: [
    { label: "Online store", value: 61840 },
    { label: "Instagram shop", value: 23415 },
    { label: "Wholesale", value: 18260 },
    { label: "Retail POS", value: 9733 },
  ],
  topProducts: [
    { id: "p1", name: "Merino crew sock", units: 1847, revenue: 26781.5 },
    { id: "p2", name: "Organic tee, bone", units: 1206, revenue: 34974 },
    { id: "p3", name: "Ceramic mug, 340 ml", units: 668, revenue: 12024 },
    { id: "p4", name: "Cotton rib beanie", units: 503, revenue: 11066 },
    { id: "p5", name: "Linen overshirt", units: 312, revenue: 19968 },
  ],
  lowStock: [
    { id: "s1", name: "Knit polo, navy", sku: "NW-01561", left: 7 },
    { id: "s2", name: "Trail runner, slate", sku: "NW-01339", left: 12 },
    { id: "s3", name: "Waxed field jacket", sku: "NW-01154", left: 37 },
  ],
  recentOrders: [
    { id: "o1", number: "#5104", customer: "Amara Okafor", total: 129.04, status: "paid", time: "4 min ago" },
    { id: "o2", number: "#5101", customer: "Sofia Marino", total: 403.1, status: "paid", time: "22 min ago" },
    { id: "o3", number: "#5098", customer: "Kenji Watanabe", total: 89.9, status: "pending", time: "51 min ago" },
    { id: "o4", number: "#5095", customer: "Hannah Becker", total: 46.5, status: "refunded", time: "1 h ago" },
    { id: "o5", number: "#5092", customer: "Noah Feldman", total: 182.3, status: "paid", time: "2 h ago" },
  ],
};

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const usdShort = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", notation: "compact", maximumFractionDigits: 1 });

function Panel({ title, action, children, className }: { title: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={cn("surface min-w-0 rounded-card p-5 md:p-6", className)}>
      <div className="mb-5 flex items-center justify-between gap-3">
        <h3 className="text-sm font-medium text-fg/85">{title}</h3>
        {action}
      </div>
      {children}
    </section>
  );
}

const icon = (d: ReactNode) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    {d}
  </svg>
);

const orderStatus = {
  paid: { label: "Paid", variant: "success" },
  pending: { label: "Pending", variant: "warning" },
  refunded: { label: "Refunded", variant: "outline" },
} as const;

export interface EcommerceDashboardScreenProps {
  data?: EcommerceDashboardData;
  defaultPeriod?: Period;
  className?: string;
}

/** Store overview: revenue, orders, conversion and AOV tiles, revenue against the previous period, sales by channel, best sellers, low stock and recent orders. */
export function EcommerceDashboardScreen({ data = sampleEcommerceData, defaultPeriod = "30d", className }: EcommerceDashboardScreenProps) {
  const [period, setPeriod] = useState<Period>(defaultPeriod);
  const [restocked, setRestocked] = useState<string[]>([]);
  const p = data.periods[period];
  const revenue = p.revenue.reduce((s, v) => s + v, 0);
  const maxUnits = Math.max(...data.topProducts.map((t) => t.units));
  const periodLabel = period === "7d" ? "last 7 days" : period === "30d" ? "last 30 days" : "last 90 days";

  return (
    <div className={cn("grid grid-cols-1 gap-6", className)}>
      <PageHeader
        title="Store overview"
        description={`Sales across every channel, ${periodLabel}.`}
        actions={
        <SegmentedControl
          aria-label="Period"
          value={period}
          onValueChange={setPeriod}
          options={[
            { value: "7d", label: "7 days" },
            { value: "30d", label: "30 days" },
            { value: "90d", label: "90 days" },
          ]}
        />
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          key={`rev-${period}`}
          label="Revenue"
          value={revenue}
          prefix="$"
          change={p.change.revenue}
          comparison="vs previous period"
          sparkline={p.revenue}
          bleed
          highlight
          icon={icon(<path d="M12 3v18M16.5 7.5C16 6 14.3 5 12 5c-2.8 0-4.5 1.3-4.5 3.3 0 4.5 9 2.5 9 7 0 2-1.8 3.7-4.5 3.7-2.4 0-4.2-1.1-4.7-2.8" />)}
        />
        <StatCard
          key={`ord-${period}`}
          label="Orders"
          value={p.orders}
          tone="info"
          change={p.change.orders}
          comparison="vs previous period"
          icon={icon(<path d="M5 7h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 7Zm4 0a3 3 0 0 1 6 0" />)}
        />
        <StatCard
          key={`cvr-${period}`}
          label="Conversion rate"
          value={p.conversion * 100}
          suffix="%"
          decimals={2}
          tone="success"
          change={p.change.conversion}
          comparison={`${p.sessions.toLocaleString("en-US")} sessions`}
          icon={icon(<path d="M4 17 10 11l4 4 6-7M15 8h5v5" />)}
        />
        <StatCard
          key={`aov-${period}`}
          label="Average order value"
          value={revenue / p.orders}
          prefix="$"
          decimals={2}
          tone="warning"
          change={p.change.aov}
          comparison="vs previous period"
          icon={icon(<path d="M4 12h16M4 6h16M4 18h10" />)}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.8fr)_minmax(0,1fr)]">
        <Panel title="Revenue" action={<span className="text-sm tabular-nums text-muted">{usd.format(revenue)}</span>}>
          <ChartArea
            key={period}
            labels={p.labels}
            series={[
              { name: "This period", values: p.revenue },
              { name: "Previous period", values: p.previous },
            ]}
            label={`Revenue, ${periodLabel}, against the previous period`}
            height={300}
            formatValue={(v) => usdShort.format(v)}
          />
        </Panel>
        <Panel title="Sales by channel">
          <ChartDonut
            data={data.channels}
            label="Sales by channel"
            centerLabel="Total sales"
            centerValue={usdShort.format(data.channels.reduce((s, c) => s + c.value, 0))}
            formatValue={(v) => usd.format(v)}
            legend
          />
        </Panel>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <Panel title="Best sellers">
          <ProgressList
            ranked
            items={data.topProducts.map((t) => ({
              id: t.id,
              label: t.name,
              meta: `${t.units.toLocaleString("en-US")} units · ${usd.format(t.revenue)}`,
              value: t.units / maxUnits,
            }))}
          />
        </Panel>

        <Panel title="Recent orders" action={<span className="text-xs text-muted">Live</span>}>
          <ul className="divide-y divide-line">
            {data.recentOrders.map((o) => (
              <li key={o.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm">
                    <span className="font-medium tabular-nums">{o.number}</span> · {o.customer}
                  </p>
                  <p className="text-xs text-muted">{o.time}</p>
                </div>
                <Badge variant={orderStatus[o.status].variant}>{orderStatus[o.status].label}</Badge>
                <span className="w-20 text-right text-sm tabular-nums">{usd.format(o.total)}</span>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Running low" className="lg:col-span-2 xl:col-span-1">
          <ul className="grid grid-cols-1 gap-3">
            {data.lowStock.map((s) => {
              const done = restocked.includes(s.id);
              return (
                <li key={s.id} className="flex items-center gap-3 rounded-field border border-line p-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{s.name}</p>
                    <p className="text-xs text-muted">
                      <span className="font-mono">{s.sku}</span> ·{" "}
                      <span className={s.left < 10 ? "text-danger" : "text-warning"}>{s.left} left</span>
                    </p>
                  </div>
                  <Button size="sm" variant={done ? "ghost" : "surface"} disabled={done} onClick={() => setRestocked((r) => [...r, s.id])}>
                    {done ? "Reorder sent" : "Reorder"}
                  </Button>
                </li>
              );
            })}
          </ul>
          <p className="mt-4 text-xs text-muted">Reorders go to the supplier on file with your usual quantities.</p>
        </Panel>
      </div>
    </div>
  );
}
