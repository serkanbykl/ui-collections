"use client";

import {
  columnFilteringFeature,
  columnVisibilityFeature,
  constructFilterFn,
  createColumnHelper,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFn_includesString,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_basic,
  sortFn_text,
  tableFeatures,
  useTable,
  type ColumnDef,
  type ColumnVisibilityState,
  type RowData,
  type SortingState,
} from "@tanstack/react-table";
import { useId } from "react";

import { cn } from "@/registry/kit/lib/utils";
import { Button } from "@/registry/kit/ui/button";
import { Checkbox } from "@/registry/kit/ui/checkbox";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from "@/registry/kit/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/registry/kit/ui/select";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/registry/kit/ui/table";

/** Per-column presentation hints read by DataTable and its controls. */
export interface DataTableColumnMeta {
  /** Name in the column menu, when the header is not plain text. */
  label?: string;
  align?: "left" | "right" | "center";
  className?: string;
}

/** Keeps rows whose value is one of the picked options; pairs with MultiSelect. */
const inArray = constructFilterFn({
  filter: (cellValue: unknown, picked: string[]) => picked.includes(String(cellValue)),
  autoRemove: (picked: unknown) => !Array.isArray(picked) || picked.length === 0,
});

export const dataTableFeatures = tableFeatures({
  columnFilteringFeature,
  globalFilteringFeature,
  rowSortingFeature,
  rowPaginationFeature,
  columnVisibilityFeature,
  rowSelectionFeature,
  filteredRowModel: createFilteredRowModel(),
  sortedRowModel: createSortedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  filterFns: { includesString: filterFn_includesString, inArray },
  sortFns: { alphanumeric: sortFn_alphanumeric, text: sortFn_text, basic: sortFn_basic },
  columnMeta: {} as DataTableColumnMeta,
});

export type DataTableFeatures = typeof dataTableFeatures;
// Columns of one table hold different value types; TanStack's own helpers use `any` here too.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DataTableColumn<TData extends RowData> = ColumnDef<DataTableFeatures, TData, any>;

/** Column helper typed for these features. Build columns at module scope so they stay stable. */
export const createDataTableColumnHelper = <TData extends RowData>() => createColumnHelper<DataTableFeatures, TData>();

export interface UseDataTableOptions<TData extends RowData> {
  data: TData[];
  /** Must be stable: module scope or memoised. */
  columns: DataTableColumn<TData>[];
  getRowId?: (row: TData) => string;
  initialSorting?: SortingState;
  initialVisibility?: ColumnVisibilityState;
  pageSize?: number;
}

/** Client-side table state: search, filters, sorting, selection, pagination and column visibility. */
export function useDataTable<TData extends RowData>({
  data,
  columns,
  getRowId,
  initialSorting = [],
  initialVisibility = {},
  pageSize = 8,
}: UseDataTableOptions<TData>) {
  return useTable({
    features: dataTableFeatures,
    columns,
    data,
    getRowId: getRowId ? (row) => getRowId(row) : undefined,
    globalFilterFn: "includesString",
    initialState: {
      sorting: initialSorting,
      columnVisibility: initialVisibility,
      pagination: { pageIndex: 0, pageSize },
      globalFilter: "",
      columnFilters: [],
      rowSelection: {},
    },
  });
}

export type DataTableInstance<TData extends RowData> = ReturnType<typeof useDataTable<TData>>;

/** A leading checkbox column. Add it first in your columns array. */
export function selectionColumn<TData extends RowData>(): DataTableColumn<TData> {
  return createDataTableColumnHelper<TData>().display({
    id: "select",
    enableSorting: false,
    enableHiding: false,
    meta: { className: "w-10" },
    header: ({ table }) => (
      <Checkbox
        aria-label="Select all rows on this page"
        checked={table.getIsAllPageRowsSelected() ? true : table.getIsSomePageRowsSelected() ? "indeterminate" : false}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(value === true)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox aria-label="Select row" checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(value === true)} />
    ),
  });
}

const alignClass = { left: "text-left", right: "text-right", center: "text-center" } as const;

export interface DataTableProps<TData extends RowData> {
  table: DataTableInstance<TData>;
  /** Accessible caption, visually hidden. */
  caption: string;
  /** Inside the card, above the table: search, filters, column menu. */
  toolbar?: React.ReactNode;
  /** Inside the card, below the table: usually DataTablePagination. */
  footer?: React.ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
}

/** Data table with sortable headers, selectable rows and an empty state. */
export function DataTable<TData extends RowData>({
  table,
  caption,
  toolbar,
  footer,
  emptyTitle = "No matching records",
  emptyDescription = "Try a different search or clear the filters.",
  className,
}: DataTableProps<TData>) {
  const rows = table.getRowModel().rows;
  const columnCount = table.getVisibleLeafColumns().length;

  return (
    <div className={cn("surface overflow-hidden rounded-card", className)}>
      {toolbar && <div className="border-b border-fg/[0.07] px-4 py-3.5 sm:px-5">{toolbar}</div>}
      <Table frame={false}>
        <TableCaption className="sr-only">{caption}</TableCaption>
        <TableHeader>
          {table.getHeaderGroups().map((group) => (
            <TableRow key={group.id} className="hover:bg-transparent">
              {group.headers.map((header) => {
                const meta = header.column.columnDef.meta;
                const sorted = header.column.getIsSorted();
                return (
                  <TableHead
                    key={header.id}
                    sort={sorted === "asc" ? "ascending" : sorted === "desc" ? "descending" : false}
                    onSort={header.column.getCanSort() ? () => header.column.toggleSorting() : undefined}
                    className={cn("sm:px-5", alignClass[meta?.align ?? "left"], meta?.className)}
                  >
                    {header.isPlaceholder ? null : <table.FlexRender header={header} />}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {rows.length ? (
            rows.map((row) => (
              <TableRow
                key={row.id}
                data-selected={row.getIsSelected() || undefined}
                // New rows (page, sort or filter change) fade in; nothing re-renders per frame.
                className="transition-[background-color,opacity] duration-300 ease-theme starting:opacity-0"
              >
                {row.getVisibleCells().map((cell) => {
                  const meta = cell.column.columnDef.meta;
                  return (
                    <TableCell key={cell.id} className={cn("h-13 py-0 whitespace-nowrap text-fg/90 sm:px-5", alignClass[meta?.align ?? "left"], meta?.className)}>
                      <table.FlexRender cell={cell} />
                    </TableCell>
                  );
                })}
              </TableRow>
            ))
          ) : (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={columnCount} className="px-6 py-14 text-center">
                <p className="font-display text-2xl tracking-[-0.02em] text-fg">{emptyTitle}</p>
                <p className="mt-1.5 text-sm text-muted">{emptyDescription}</p>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {footer && <div className="border-t border-fg/[0.07] px-4 py-3 sm:px-5">{footer}</div>}
    </div>
  );
}

/** Menu of checkable columns. Columns with `enableHiding: false` are left out. */
export function DataTableColumnToggle<TData extends RowData>({ table }: { table: DataTableInstance<TData> }) {
  const columns = table.getAllLeafColumns().filter((column) => column.getCanHide());
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" className="h-11 text-sm font-normal text-fg/85">
          <svg viewBox="0 0 24 24" aria-hidden className="size-4 text-muted" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
            <rect x="3.5" y="4.5" width="17" height="15" rx="3" />
            <path d="M9.5 4.5v15M14.5 4.5v15" />
          </svg>
          Columns
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Visible columns</DropdownMenuLabel>
        {columns.map((column) => (
          <DropdownMenuCheckboxItem
            key={column.id}
            checked={column.getIsVisible()}
            onCheckedChange={(checked) => column.toggleVisibility(checked === true)}
            onSelect={(e) => e.preventDefault()}
          >
            {column.columnDef.meta?.label ?? column.id}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/** Range readout, page size and previous/next controls. */
export function DataTablePagination<TData extends RowData>({
  table,
  pageSizes = [8, 16, 32],
}: {
  table: DataTableInstance<TData>;
  pageSizes?: number[];
}) {
  const sizeId = useId();
  const { pageIndex, pageSize } = table.state.pagination;
  const total = table.getFilteredRowModel().rows.length;
  const selected = Object.keys(table.state.rowSelection).length;
  const pageCount = Math.max(table.getPageCount(), 1);
  const first = total === 0 ? 0 : pageIndex * pageSize + 1;
  const last = Math.min(total, (pageIndex + 1) * pageSize);

  return (
    <div className="flex flex-col-reverse items-center justify-between gap-3 text-xs text-muted sm:flex-row">
      <p aria-live="polite" className="tabular-nums">
        {total === 0 ? "No records" : `${first}–${last} of ${total}`}
        {selected > 0 && <span className="ml-2 text-accent">· {selected} selected</span>}
      </p>
      <div className="flex items-center gap-4">
        <label htmlFor={sizeId} className="flex items-center gap-2">
          <span className="max-sm:sr-only">Rows</span>
          <Select value={String(pageSize)} onValueChange={(value) => table.setPageSize(Number(value))}>
            <SelectTrigger id={sizeId} className="h-8 w-auto gap-2 rounded-control px-2.5 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="min-w-20">
              {pageSizes.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>
        <nav aria-label="Pagination" className="flex items-center gap-1">
          <Button variant="ghost" size="icon-sm" aria-label="Previous page" disabled={!table.getCanPreviousPage()} onClick={() => table.previousPage()} className="text-muted">
            <svg viewBox="0 0 24 24" aria-hidden className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 6-6 6 6 6" />
            </svg>
          </Button>
          <span aria-current="page" className="min-w-14 text-center text-fg/85 tabular-nums">
            {pageIndex + 1} / {pageCount}
          </span>
          <Button variant="ghost" size="icon-sm" aria-label="Next page" disabled={!table.getCanNextPage()} onClick={() => table.nextPage()} className="text-muted">
            <svg viewBox="0 0 24 24" aria-hidden className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 6 6 6-6 6" />
            </svg>
          </Button>
        </nav>
      </div>
    </div>
  );
}
