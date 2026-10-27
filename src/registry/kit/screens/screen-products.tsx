"use client";

import { useMemo, useState } from "react";

import { cn } from "@/registry/kit/lib/utils";
import { Badge } from "@/registry/kit/ui/badge";
import { SelectionBar } from "@/registry/kit/ui/selection-bar";
import { Button, buttonVariants } from "@/registry/kit/ui/button";
import {
  createDataTableColumnHelper,
  DataTable,
  DataTableColumnToggle,
  DataTablePagination,
  selectionColumn,
  useDataTable,
  type DataTableColumn,
} from "@/registry/kit/ui/data-table";
import { ChipGroup } from "@/registry/kit/ui/chip";
import { FilterBar } from "@/registry/kit/ui/filter-bar";
import { MultiSelect } from "@/registry/kit/ui/multi-select";
import { SearchInput } from "@/registry/kit/ui/search-input";
import { toast } from "@/registry/kit/ui/toast";
import { PageHeader } from "@/registry/kit/ui/page-header";

export type ProductStatus = "active" | "draft" | "archived";

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  status: ProductStatus;
  /** Units sold in the last 30 days. */
  sold: number;
}

const statusMeta: Record<ProductStatus, { label: string; variant: "success" | "warning" | "outline" }> = {
  active: { label: "Active", variant: "success" },
  draft: { label: "Draft", variant: "warning" },
  archived: { label: "Archived", variant: "outline" },
};

const names = [
  "Linen overshirt",
  "Merino crew sock",
  "Canvas tote, olive",
  "Waxed field jacket",
  "Cotton rib beanie",
  "Selvedge denim, straight",
  "Organic tee, bone",
  "Leather card holder",
  "Trail runner, slate",
  "Wool scarf, rust",
  "Recycled rain shell",
  "Hemp cap, natural",
  "Ceramic mug, 340 ml",
  "Cord trousers, tobacco",
  "Knit polo, navy",
  "Bamboo boxer, 3-pack",
];
const categories = ["Apparel", "Accessories", "Footwear", "Home"];
const productCategories = [
  "Apparel",
  "Apparel",
  "Accessories",
  "Apparel",
  "Accessories",
  "Apparel",
  "Apparel",
  "Accessories",
  "Footwear",
  "Accessories",
  "Apparel",
  "Accessories",
  "Home",
  "Apparel",
  "Apparel",
  "Apparel",
];
const statuses: ProductStatus[] = ["active", "active", "draft", "active", "archived", "active", "active"];

export const sampleProducts: Product[] = names.map((name, i) => ({
  id: `prd_${(7201 + i * 53).toString(36)}`,
  name,
  sku: `NW-${(1043 + i * 37).toString().padStart(5, "0")}`,
  category: productCategories[i]!,
  price: [64, 14.5, 32, 189, 22, 118, 29, 41, 136, 54, 149, 26, 18, 92, 68, 33][i]!,
  stock: [214, 1183, 0, 37, 418, 96, 742, 155, 12, 281, 64, 0, 503, 88, 7, 361][i]!,
  status: statuses[i % statuses.length]!,
  sold: [312, 1847, 96, 58, 503, 174, 1206, 233, 141, 87, 119, 42, 668, 71, 39, 455][i]!,
}));

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

/** A product tile in place of a photo: a tinted square with the item's initials. */
function Thumb({ name, index }: { name: string; index: number }) {
  const tones = ["bg-accent/15 text-accent", "bg-info/15 text-info", "bg-warning/15 text-warning", "bg-success/15 text-success"];
  const initials = name
    .split(/[\s,]+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  return (
    <span aria-hidden className={cn("grid size-10 shrink-0 place-items-center rounded-field text-xs font-semibold", tones[index % tones.length])}>
      {initials}
    </span>
  );
}

const col = createDataTableColumnHelper<Product>();

function makeColumns(detailHref?: string): DataTableColumn<Product>[] {
  return [
    selectionColumn<Product>(),
    col.accessor("name", {
      header: "Product",
      meta: { label: "Product" },
      cell: ({ row }) => (
        <div className="flex min-w-48 items-center gap-3">
          <Thumb name={row.original.name} index={row.index} />
          <div className="min-w-0">
            {detailHref ? (
              <a href={`${detailHref}/${row.original.id}`} className="block truncate font-medium text-fg hover:text-accent">
                {row.original.name}
              </a>
            ) : (
              <div className="truncate font-medium text-fg">{row.original.name}</div>
            )}
            <div className="font-mono text-xs text-muted">{row.original.sku}</div>
          </div>
        </div>
      ),
    }),
    col.accessor("category", {
      header: "Category",
      filterFn: "inArray",
      meta: { label: "Category" },
    }),
    col.accessor("status", {
      header: "Status",
      filterFn: "inArray",
      meta: { label: "Status" },
      cell: ({ row }) => <Badge variant={statusMeta[row.original.status].variant}>{statusMeta[row.original.status].label}</Badge>,
    }),
    col.accessor("stock", {
      header: "Stock",
      meta: { label: "Stock", align: "right" },
      cell: ({ row }) => {
        const stock = row.original.stock;
        return (
          <span className={cn("tabular-nums", stock === 0 ? "text-danger" : stock < 40 ? "text-warning" : "text-fg")}>
            {stock === 0 ? "Out of stock" : stock.toLocaleString("en-US")}
          </span>
        );
      },
    }),
    col.accessor("price", {
      header: "Price",
      meta: { label: "Price", align: "right" },
      cell: ({ row }) => <span className="tabular-nums">{usd.format(row.original.price)}</span>,
    }),
    col.accessor("sold", {
      header: "Sold (30d)",
      meta: { label: "Sold (30d)", align: "right" },
      cell: ({ row }) => <span className="tabular-nums text-muted">{row.original.sold.toLocaleString("en-US")}</span>,
    }),
  ];
}

export interface ProductsScreenProps {
  products?: Product[];
  /** Where "Add product" goes. */
  newHref?: string;
  /** When set, product names link to `${detailHref}/${id}`. */
  detailHref?: string;
  className?: string;
}

/** Catalogue table: search, status and category filters, bulk archive and export, column toggle and pagination. */
export function ProductsScreen({ products = sampleProducts, newHref = "#/app/products/new", detailHref, className }: ProductsScreenProps) {
  const [rows, setRows] = useState(products);
  const [columns] = useState(() => makeColumns(detailHref));
  const table = useDataTable({
    data: rows,
    columns,
    getRowId: (p) => p.id,
    pageSize: 8,
  });

  const search = table.state.globalFilter as string;
  const statusFilter = (table.getColumn("status")?.getFilterValue() as ProductStatus[] | undefined) ?? [];
  const categoryFilter = (table.getColumn("category")?.getFilterValue() as string[] | undefined) ?? [];
  const selectedIds = Object.keys(table.state.rowSelection).filter((id) => table.state.rowSelection[id]);

  const totals = useMemo(
    () => ({
      active: rows.filter((p) => p.status === "active").length,
      low: rows.filter((p) => p.stock > 0 && p.stock < 40).length,
      out: rows.filter((p) => p.stock === 0).length,
    }),
    [rows],
  );

  function archiveSelected() {
    const count = selectedIds.length;
    setRows((current) => current.map((p) => (selectedIds.includes(p.id) ? { ...p, status: "archived" } : p)));
    table.setRowSelection({});
    toast.success(`Archived ${count} ${count === 1 ? "product" : "products"}. They stay out of your storefront until you restore them.`);
  }

  function exportSelected() {
    const picked = rows.filter((p) => selectedIds.includes(p.id));
    const csv = ["sku,name,price,stock", ...picked.map((p) => `${p.sku},"${p.name}",${p.price},${p.stock}`)].join("\n");
    navigator.clipboard?.writeText(csv).catch(() => {});
    toast.success(`Copied ${picked.length} ${picked.length === 1 ? "row" : "rows"} as CSV.`, { description: "Paste into a spreadsheet to edit them." });
  }

  return (
    <div className={cn("grid grid-cols-1 gap-6", className)}>
      <PageHeader
        title="Products"
        description={`${totals.active} active · ${totals.low} running low · ${totals.out} out of stock`}
        actions={
          <a href={newHref} className={buttonVariants({ variant: "accent" })}>
            Add product
          </a>
        }
      />

      <SelectionBar count={selectedIds.length} onClear={() => table.setRowSelection({})}>
        <Button size="sm" onClick={exportSelected}>
          Copy as CSV
        </Button>
        <Button size="sm" variant="danger" onClick={archiveSelected}>
          Archive selected
        </Button>
      </SelectionBar>

      <DataTable
        table={table}
        caption="Products"
        emptyTitle="No products match these filters"
        emptyDescription="Clear a filter or search for a SKU instead."
        toolbar={
          <FilterBar
            search={<SearchInput label="Search products" value={search} onValueChange={(v) => table.setGlobalFilter(v)} />}
            filters={
              <>
                <ChipGroup
                  label="Filter by status"
                  multiple
                  value={statusFilter}
                  onValueChange={(v) => table.getColumn("status")?.setFilterValue(v)}
                  options={(Object.keys(statusMeta) as ProductStatus[]).map((s) => ({
                    value: s,
                    label: statusMeta[s].label,
                    count: rows.filter((p) => p.status === s).length,
                  }))}
                />
                <MultiSelect
                  label="Category"
                  value={categoryFilter}
                  onValueChange={(v) => table.getColumn("category")?.setFilterValue(v)}
                  options={categories.map((c) => ({
                    value: c,
                    label: c,
                    count: rows.filter((p) => p.category === c).length,
                  }))}
                />
              </>
            }
            activeCount={statusFilter.length + categoryFilter.length + (search ? 1 : 0)}
            onReset={() => {
              table.setGlobalFilter("");
              table.getColumn("status")?.setFilterValue([]);
              table.getColumn("category")?.setFilterValue([]);
            }}
            end={<DataTableColumnToggle table={table} />}
          />
        }
        footer={<DataTablePagination table={table} pageSizes={[8, 16]} />}
      />
    </div>
  );
}
