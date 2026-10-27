"use client";

import { useState } from "react";

import { cn } from "@/registry/kit/lib/utils";
import { Avatar } from "@/registry/kit/ui/avatar";
import { Badge } from "@/registry/kit/ui/badge";
import { SelectionBar } from "@/registry/kit/ui/selection-bar";
import { Button } from "@/registry/kit/ui/button";
import {
  createDataTableColumnHelper,
  DataTable,
  DataTableColumnToggle,
  DataTablePagination,
  selectionColumn,
  useDataTable,
  type DataTableColumn,
} from "@/registry/kit/ui/data-table";
import { FilterBar } from "@/registry/kit/ui/filter-bar";
import { MultiSelect } from "@/registry/kit/ui/multi-select";
import { SearchInput } from "@/registry/kit/ui/search-input";
import { StatCard } from "@/registry/kit/ui/stat-card";
import { toast } from "@/registry/kit/ui/toast";
import { PageHeader } from "@/registry/kit/ui/page-header";

export type CustomerSegment = "vip" | "returning" | "new" | "at-risk";

export interface Customer {
  id: string;
  name: string;
  email: string;
  location: string;
  orders: number;
  spent: number;
  /** ISO date of the latest order. */
  lastOrder: string;
  segment: CustomerSegment;
  subscribed: boolean;
}

const segmentMeta: Record<CustomerSegment, { label: string; variant: "accent" | "success" | "info" | "warning" }> = {
  vip: { label: "VIP", variant: "accent" },
  returning: { label: "Returning", variant: "success" },
  new: { label: "New", variant: "info" },
  "at-risk": { label: "At risk", variant: "warning" },
};

const raw: [string, string, string, number, number, string, CustomerSegment, boolean][] = [
  ["Amara Okafor", "amara.okafor@fastmail.com", "Portland, US", 7, 842.35, "2026-10-24", "returning", true],
  ["Jonas Lindqvist", "jonas@lindqvist.se", "Malmö, SE", 19, 3417.8, "2026-10-21", "vip", true],
  ["Priya Raman", "priya.raman@gmail.com", "Bengaluru, IN", 1, 64, "2026-10-22", "new", false],
  ["Mateo Herrera", "mateo.h@proton.me", "Valencia, ES", 4, 391.6, "2026-07-09", "at-risk", true],
  ["Chloé Dubois", "chloe.dubois@orange.fr", "Lyon, FR", 11, 1580.25, "2026-10-12", "vip", true],
  ["Kenji Watanabe", "kenji.w@icloud.com", "Osaka, JP", 2, 211.9, "2026-10-03", "new", true],
  ["Hannah Becker", "h.becker@posteo.de", "Leipzig, DE", 6, 734.4, "2026-09-28", "returning", false],
  ["Tomás Rivera", "tomas@riverastudio.co", "Mexico City, MX", 3, 288.15, "2026-06-17", "at-risk", false],
  ["Ines Carvalho", "ines.carvalho@sapo.pt", "Porto, PT", 9, 1104.7, "2026-10-18", "returning", true],
  ["Daniel Mensah", "dmensah@outlook.com", "Accra, GH", 1, 118.75, "2026-10-19", "new", true],
  ["Sofia Marino", "sofia.marino@libero.it", "Turin, IT", 23, 4962.1, "2026-10-23", "vip", true],
  ["Liam O'Connell", "liam.oc@eircom.net", "Cork, IE", 5, 517.3, "2026-08-02", "at-risk", true],
  ["Yara Haddad", "yara.haddad@gmail.com", "Beirut, LB", 2, 157.4, "2026-09-11", "new", false],
  ["Noah Feldman", "noah@feldman.dev", "Toronto, CA", 8, 963.85, "2026-10-15", "returning", true],
];

export const sampleCustomers: Customer[] = raw.map(([name, email, location, orders, spent, lastOrder, segment, subscribed], i) => ({
  id: `cus_${(9311 + i * 41).toString(36)}`,
  name,
  email,
  location,
  orders,
  spent,
  lastOrder,
  segment,
  subscribed,
}));

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const shortDate = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
const initials = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2);

const col = createDataTableColumnHelper<Customer>();

function makeColumns(detailHref: string): DataTableColumn<Customer>[] {
  return [
    selectionColumn<Customer>(),
    col.accessor("name", {
      header: "Customer",
      meta: { label: "Customer" },
      cell: ({ row }) => (
        <div className="flex min-w-52 items-center gap-3">
          <Avatar size="sm" fallback={initials(row.original.name)} alt="" />
          <div className="min-w-0">
            <a href={`${detailHref}/${row.original.id}`} className="block truncate font-medium hover:text-accent">
              {row.original.name}
            </a>
            <div className="truncate text-xs text-muted">{row.original.email}</div>
          </div>
        </div>
      ),
    }),
    col.accessor("segment", {
      header: "Segment",
      filterFn: "inArray",
      meta: { label: "Segment" },
      cell: ({ row }) => <Badge variant={segmentMeta[row.original.segment].variant}>{segmentMeta[row.original.segment].label}</Badge>,
    }),
    col.accessor("location", {
      header: "Location",
      meta: { label: "Location" },
      cell: ({ row }) => <span className="whitespace-nowrap text-muted">{row.original.location}</span>,
    }),
    col.accessor("orders", {
      header: "Orders",
      meta: { label: "Orders", align: "right" },
      cell: ({ row }) => <span className="tabular-nums">{row.original.orders}</span>,
    }),
    col.accessor("spent", {
      header: "Spent",
      meta: { label: "Spent", align: "right" },
      cell: ({ row }) => <span className="tabular-nums">{usd.format(row.original.spent)}</span>,
    }),
    col.accessor("lastOrder", {
      header: "Last order",
      meta: { label: "Last order" },
      cell: ({ row }) => (
        <time dateTime={row.original.lastOrder} className="whitespace-nowrap text-muted">
          {shortDate.format(new Date(`${row.original.lastOrder}T00:00:00Z`))}
        </time>
      ),
    }),
  ];
}

const defaultColumns = makeColumns("#/app/customers");

export interface CustomersScreenProps {
  customers?: Customer[];
  /** Customer names link to `${detailHref}/${id}`. */
  detailHref?: string;
  className?: string;
}

/** Customer list: KPI tiles, segment filter, search, bulk "copy emails" and links to each profile. */
export function CustomersScreen({ customers = sampleCustomers, detailHref, className }: CustomersScreenProps) {
  const [columns] = useState(() => (detailHref ? makeColumns(detailHref) : defaultColumns));
  const table = useDataTable({ data: customers, columns, getRowId: (c) => c.id, pageSize: 8, initialSorting: [{ id: "spent", desc: true }] });

  const search = table.state.globalFilter as string;
  const segmentFilter = (table.getColumn("segment")?.getFilterValue() as CustomerSegment[] | undefined) ?? [];
  const selected = customers.filter((c) => table.state.rowSelection[c.id]);

  const revenue = customers.reduce((sum, c) => sum + c.spent, 0);
  const orders = customers.reduce((sum, c) => sum + c.orders, 0);
  const repeat = customers.filter((c) => c.orders > 1).length / Math.max(customers.length, 1);

  function copyEmails() {
    const subscribed = selected.filter((c) => c.subscribed);
    navigator.clipboard?.writeText(subscribed.map((c) => c.email).join(", ")).catch(() => {});
    const skipped = selected.length - subscribed.length;
    toast.success(`Copied ${subscribed.length} ${subscribed.length === 1 ? "email" : "emails"}.`, {
      description: skipped ? `Skipped ${skipped} who opted out of marketing.` : undefined,
    });
    table.setRowSelection({});
  }

  return (
    <div className={cn("grid grid-cols-1 gap-6", className)}>
      <PageHeader
        title="Customers"
        description={`${customers.length} customers · ${orders.toLocaleString("en-US")} orders · ${Math.round(repeat * 100)}% bought more than once`}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Customers" value={customers.length} change={0.091} comparison="vs last quarter" tone="info" />
        <StatCard label="Average order value" value={revenue / Math.max(orders, 1)} prefix="$" decimals={2} change={0.034} comparison="vs last quarter" />
        <StatCard label="Repeat purchase rate" value={repeat * 100} suffix="%" decimals={1} change={-0.012} comparison="vs last quarter" tone="success" />
      </div>

      <SelectionBar count={selected.length} onClear={() => table.setRowSelection({})}>
        <Button size="sm" onClick={copyEmails}>
          Copy emails
        </Button>
      </SelectionBar>

      <DataTable
        table={table}
        caption="Customers"
        emptyTitle="No customers match"
        emptyDescription="Try another name or email, or clear the segment filter."
        toolbar={
          <FilterBar
            search={<SearchInput label="Search customers" value={search} onValueChange={(v) => table.setGlobalFilter(v)} />}
            filters={
              <MultiSelect
                label="Segment"
                value={segmentFilter}
                onValueChange={(v) => table.getColumn("segment")?.setFilterValue(v)}
                options={(Object.keys(segmentMeta) as CustomerSegment[]).map((s) => ({
                  value: s,
                  label: segmentMeta[s].label,
                  count: customers.filter((c) => c.segment === s).length,
                }))}
              />
            }
            activeCount={segmentFilter.length + (search ? 1 : 0)}
            onReset={() => {
              table.setGlobalFilter("");
              table.getColumn("segment")?.setFilterValue([]);
            }}
            end={<DataTableColumnToggle table={table} />}
          />
        }
        footer={<DataTablePagination table={table} pageSizes={[8, 16]} />}
      />
    </div>
  );
}
