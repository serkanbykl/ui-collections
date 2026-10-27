"use client";

import { useMemo, useState } from "react";

import { cn } from "@/registry/kit/lib/utils";
import { Avatar } from "@/registry/kit/ui/avatar";
import { Badge } from "@/registry/kit/ui/badge";
import { SelectionBar } from "@/registry/kit/ui/selection-bar";
import { Button } from "@/registry/kit/ui/button";
import { ChipGroup } from "@/registry/kit/ui/chip";
import { createDataTableColumnHelper, DataTable, DataTablePagination, selectionColumn, useDataTable, type DataTableColumn } from "@/registry/kit/ui/data-table";
import { DateRangePicker, type DateRange } from "@/registry/kit/ui/date-range-picker";
import { FilterBar } from "@/registry/kit/ui/filter-bar";
import { SearchInput } from "@/registry/kit/ui/search-input";
import { toast } from "@/registry/kit/ui/toast";
import { PageHeader } from "@/registry/kit/ui/page-header";

export type OrderStatus = "unfulfilled" | "fulfilled" | "refunded" | "cancelled";
export type PaymentStatus = "paid" | "pending" | "refunded";

export interface Order {
  id: string;
  number: string;
  customer: string;
  email: string;
  /** ISO date, YYYY-MM-DD. */
  date: string;
  items: number;
  total: number;
  status: OrderStatus;
  payment: PaymentStatus;
  channel: "Online store" | "POS" | "Wholesale";
}

const statusMeta: Record<OrderStatus, { label: string; variant: "warning" | "success" | "info" | "outline" }> = {
  unfulfilled: { label: "Unfulfilled", variant: "warning" },
  fulfilled: { label: "Fulfilled", variant: "success" },
  refunded: { label: "Refunded", variant: "info" },
  cancelled: { label: "Cancelled", variant: "outline" },
};

const paymentMeta: Record<PaymentStatus, { label: string; variant: "success" | "warning" | "outline" }> = {
  paid: { label: "Paid", variant: "success" },
  pending: { label: "Pending", variant: "warning" },
  refunded: { label: "Refunded", variant: "outline" },
};

const people = [
  ["Amara Okafor", "amara.okafor@fastmail.com"],
  ["Jonas Lindqvist", "jonas@lindqvist.se"],
  ["Priya Raman", "priya.raman@gmail.com"],
  ["Mateo Herrera", "mateo.h@proton.me"],
  ["Chloé Dubois", "chloe.dubois@orange.fr"],
  ["Kenji Watanabe", "kenji.w@icloud.com"],
  ["Hannah Becker", "h.becker@posteo.de"],
  ["Tomás Rivera", "tomas@riverastudio.co"],
  ["Ines Carvalho", "ines.carvalho@sapo.pt"],
  ["Daniel Mensah", "dmensah@outlook.com"],
  ["Sofia Marino", "sofia.marino@libero.it"],
] as const;

const statusCycle: OrderStatus[] = ["unfulfilled", "fulfilled", "fulfilled", "unfulfilled", "fulfilled", "refunded", "fulfilled", "cancelled", "fulfilled"];
const channels: Order["channel"][] = ["Online store", "Online store", "POS", "Online store", "Wholesale"];
const totals = [128.4, 64, 311.75, 89.9, 1240, 46.5, 182.3, 72, 219.6, 58.25, 403.1, 141, 96.8, 33, 267.45, 154.2, 812, 61.9, 118.75, 245, 79.3, 192.6];

export const sampleOrders: Order[] = totals.map((total, i) => {
  const [customer, email] = people[(i * 7) % people.length]!;
  const status = statusCycle[i % statusCycle.length]!;
  const day = 24 - Math.floor(i * 1.9);
  const date = day > 0 ? `2026-10-${String(day).padStart(2, "0")}` : `2026-09-${String(30 + day).padStart(2, "0")}`;
  return {
    id: `ord_${(5104 - i * 7).toString(36)}`,
    number: `#${5104 - i * 3}`,
    customer,
    email,
    date,
    items: (i % 4) + 1 + (total > 300 ? 3 : 0),
    total,
    status,
    payment: status === "refunded" ? "refunded" : status === "cancelled" ? "refunded" : i % 6 === 3 ? "pending" : "paid",
    channel: channels[i % channels.length]!,
  };
});

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});
const shortDate = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});
const parse = (iso: string) => new Date(`${iso}T00:00:00Z`);
const toUtcDay = (d: Date) => Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());

const initials = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2);

const col = createDataTableColumnHelper<Order>();

function makeColumns(detailHref?: string): DataTableColumn<Order>[] {
  return [
    selectionColumn<Order>(),
    col.accessor("number", {
      header: "Order",
      meta: { label: "Order" },
      cell: ({ row }) =>
        detailHref ? (
          <a href={`${detailHref}/${row.original.id}`} className="font-medium tabular-nums hover:text-accent">
            {row.original.number}
          </a>
        ) : (
          <span className="font-medium tabular-nums">{row.original.number}</span>
        ),
    }),
    col.accessor("date", {
      header: "Date",
      meta: { label: "Date" },
      cell: ({ row }) => (
        <time dateTime={row.original.date} className="whitespace-nowrap text-muted">
          {shortDate.format(parse(row.original.date))}
        </time>
      ),
    }),
    col.accessor("customer", {
      header: "Customer",
      meta: { label: "Customer" },
      cell: ({ row }) => (
        <div className="flex min-w-44 items-center gap-3">
          <Avatar size="sm" fallback={initials(row.original.customer)} alt="" />
          <div className="min-w-0">
            <div className="truncate">{row.original.customer}</div>
            <div className="truncate text-xs text-muted">{row.original.channel}</div>
          </div>
        </div>
      ),
    }),
    col.accessor("payment", {
      header: "Payment",
      meta: { label: "Payment" },
      cell: ({ row }) => (
        <Badge variant={paymentMeta[row.original.payment].variant} dot>
          {paymentMeta[row.original.payment].label}
        </Badge>
      ),
    }),
    col.accessor("status", {
      header: "Fulfilment",
      meta: { label: "Fulfilment" },
      cell: ({ row }) => <Badge variant={statusMeta[row.original.status].variant}>{statusMeta[row.original.status].label}</Badge>,
    }),
    col.accessor("items", {
      header: "Items",
      meta: { label: "Items", align: "right" },
      cell: ({ row }) => <span className="tabular-nums text-muted">{row.original.items}</span>,
    }),
    col.accessor("total", {
      header: "Total",
      meta: { label: "Total", align: "right" },
      cell: ({ row }) => <span className="tabular-nums">{usd.format(row.original.total)}</span>,
    }),
  ];
}

type Tab = "all" | OrderStatus;
const tabs: { value: Tab; label: string }[] = [
  { value: "all", label: "All" },
  { value: "unfulfilled", label: "Unfulfilled" },
  { value: "fulfilled", label: "Fulfilled" },
  { value: "refunded", label: "Refunded" },
  { value: "cancelled", label: "Cancelled" },
];

export interface OrdersScreenProps {
  orders?: Order[];
  /** Anchors the date presets. Defaults to the day after the newest sample order. */
  today?: Date;
  /** When set, order numbers link to `${detailHref}/${id}`. */
  detailHref?: string;
  className?: string;
}

const defaultToday = new Date(2026, 9, 24);

/** Order list with fulfilment status chips, a date range, search, a running total and bulk "mark fulfilled". */
export function OrdersScreen({ orders = sampleOrders, today = defaultToday, detailHref, className }: OrdersScreenProps) {
  const [rows, setRows] = useState(orders);
  const [columns] = useState(() => makeColumns(detailHref));
  const [tab, setTab] = useState<Tab>("all");
  const [range, setRange] = useState<DateRange | undefined>({
    from: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 29),
    to: today,
  });

  const inRange = useMemo(
    () =>
      rows.filter((o) => {
        if (!range?.from) return true;
        const t = parse(o.date).getTime();
        return t >= toUtcDay(range.from) && t <= toUtcDay(range.to ?? range.from);
      }),
    [rows, range],
  );
  const visible = useMemo(() => (tab === "all" ? inRange : inRange.filter((o) => o.status === tab)), [inRange, tab]);

  const table = useDataTable({
    data: visible,
    columns,
    getRowId: (o) => o.id,
    pageSize: 8,
    initialSorting: [{ id: "date", desc: true }],
  });
  const search = table.state.globalFilter as string;
  const selectedIds = Object.keys(table.state.rowSelection).filter((id) => table.state.rowSelection[id]);
  const filteredRows = table.getFilteredRowModel().rows;
  const revenue = filteredRows.reduce((sum, r) => sum + (r.original.payment === "paid" ? r.original.total : 0), 0);
  const selectedUnfulfilled = rows.filter((o) => selectedIds.includes(o.id) && o.status === "unfulfilled");

  function markFulfilled() {
    const ids = selectedUnfulfilled.map((o) => o.id);
    setRows((all) => all.map((o) => (ids.includes(o.id) ? { ...o, status: "fulfilled" } : o)));
    table.setRowSelection({});
    toast.success(`Marked ${ids.length} ${ids.length === 1 ? "order" : "orders"} as fulfilled. Customers get a shipping email.`);
  }

  return (
    <div className={cn("grid grid-cols-1 gap-6", className)}>
      <PageHeader
        title="Orders"
        description={`${filteredRows.length} ${filteredRows.length === 1 ? "order" : "orders"} · ${usd.format(revenue)} paid`}
        actions={<DateRangePicker value={range} onValueChange={setRange} today={today} />}
      />

      <ChipGroup
        label="Fulfilment status"
        scroll
        value={tab}
        onValueChange={(v) => {
          setTab((v ?? "all") as Tab);
          table.setRowSelection({});
        }}
        options={tabs.map((t) => ({ ...t, count: t.value === "all" ? inRange.length : inRange.filter((o) => o.status === t.value).length }))}
      />

      <SelectionBar count={selectedIds.length} onClear={() => table.setRowSelection({})}>
        <Button size="sm" variant="accent" onClick={markFulfilled} disabled={selectedUnfulfilled.length === 0}>
          Mark {selectedUnfulfilled.length || ""} fulfilled
        </Button>
      </SelectionBar>

      <DataTable
        table={table}
        caption="Orders"
        emptyTitle="No orders in this view"
        emptyDescription="Widen the date range or switch to All."
        toolbar={
          <FilterBar
            search={<SearchInput label="Search orders, customers" value={search} onValueChange={(v) => table.setGlobalFilter(v)} />}
            activeCount={(search ? 1 : 0) + (tab !== "all" ? 1 : 0)}
            onReset={() => {
              table.setGlobalFilter("");
              setTab("all");
            }}
          />
        }
        footer={<DataTablePagination table={table} pageSizes={[8, 16]} />}
      />
    </div>
  );
}
