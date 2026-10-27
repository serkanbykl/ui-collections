"use client";

import { useState } from "react";

import { Pagination } from "@/registry/kit/ui/pagination";

export default function PaginationDemo() {
  const [page, setPage] = useState(6);

  return (
    <div className="flex flex-col items-center gap-4">
      <Pagination page={page} pageCount={12} onPageChange={setPage} />
      <p className="text-xs text-muted tabular-nums">
        Showing deployments {(page - 1) * 20 + 1}–{page * 20} of 240
      </p>
    </div>
  );
}
