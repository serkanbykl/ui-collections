"use client";

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

type Status = "ready" | "building" | "failed" | "queued";

interface Deployment {
  id: string;
  service: string;
  branch: string;
  environment: "Production" | "Preview" | "Staging";
  status: Status;
  duration: number;
  author: string;
}

const statusStyle: Record<Status, { label: string; className: string }> = {
  ready: { label: "Ready", className: "bg-success/12 text-success" },
  building: { label: "Building", className: "bg-info/12 text-info" },
  failed: { label: "Failed", className: "bg-danger/12 text-danger" },
  queued: { label: "Queued", className: "bg-fg/10 text-fg/75" },
};

const services = ["api", "web", "worker", "auth", "billing", "search", "gateway"];
const authors = ["Ada Park", "Leo Varga", "Mina Okafor", "Sam Ruiz", "Iris Chen"];
const branches = ["main", "feat/onboarding", "fix/rate-limit", "chore/deps", "feat/search-v2"];
const statuses: Status[] = ["ready", "ready", "building", "ready", "failed", "queued", "ready"];
const environments: Deployment["environment"][] = ["Production", "Preview", "Staging"];

const deployments: Deployment[] = Array.from({ length: 34 }, (_, i) => ({
  id: `dpl_${(4810 + i * 37).toString(36)}`,
  service: services[i % services.length]!,
  branch: branches[(i * 3) % branches.length]!,
  environment: environments[i % 3]!,
  status: statuses[(i * 5) % statuses.length]!,
  duration: 38 + ((i * 47) % 260),
  author: authors[(i * 2) % authors.length]!,
}));

const col = createDataTableColumnHelper<Deployment>();

// Module scope keeps the column array stable between renders.
const columns: DataTableColumn<Deployment>[] = [
  selectionColumn<Deployment>(),
  col.accessor("service", {
    header: "Service",
    meta: { label: "Service" },
    cell: ({ row }) => (
      <div>
        <div className="font-medium text-fg">{row.original.service}</div>
        <div className="font-mono text-xs text-muted">{row.original.branch}</div>
      </div>
    ),
  }),
  col.accessor("environment", { header: "Environment", meta: { label: "Environment" } }),
  col.accessor("status", {
    header: "Status",
    filterFn: "inArray",
    meta: { label: "Status" },
    cell: ({ row }) => {
      const style = statusStyle[row.original.status];
      return <span className={`rounded-control px-2.5 py-1 text-xs font-medium ${style.className}`}>{style.label}</span>;
    },
  }),
  col.accessor("duration", {
    header: "Duration",
    meta: { label: "Duration", align: "right" },
    cell: ({ row }) => {
      const s = row.original.duration;
      return <span className="font-mono text-xs tabular-nums">{`${Math.floor(s / 60)}m ${s % 60}s`}</span>;
    },
  }),
  col.accessor("author", { header: "Author", meta: { label: "Author" } }),
];

export default function DataTableDemo() {
  const table = useDataTable({ data: deployments, columns, getRowId: (row) => row.id, pageSize: 6 });
  const statusFilter = (table.getColumn("status")?.getFilterValue() as Status[] | undefined) ?? [];
  const search = table.state.globalFilter as string;

  return (
    <DataTable
      className="w-full max-w-4xl"
      table={table}
      caption="Recent deployments"
      toolbar={
        <FilterBar
          search={<SearchInput label="Search deployments" value={search} onValueChange={(v) => table.setGlobalFilter(v)} />}
          filters={
            <MultiSelect
              label="Status"
              value={statusFilter}
              onValueChange={(v) => table.getColumn("status")?.setFilterValue(v)}
              options={(Object.keys(statusStyle) as Status[]).map((s) => ({
                value: s,
                label: statusStyle[s].label,
                count: deployments.filter((d) => d.status === s).length,
              }))}
            />
          }
          activeCount={statusFilter.length + (search ? 1 : 0)}
          onReset={() => {
            table.setGlobalFilter("");
            table.getColumn("status")?.setFilterValue([]);
          }}
          end={<DataTableColumnToggle table={table} />}
        />
      }
      footer={<DataTablePagination table={table} pageSizes={[6, 12, 24]} />}
    />
  );
}
