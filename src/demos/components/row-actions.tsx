"use client";

import { useState } from "react";

import { RowActions, type RowAction } from "@/registry/kit/ui/row-actions";

const reports = [
  { id: "r1", name: "Retention review Q3.pdf", meta: "2.3 MB · Marcus Ode" },
  { id: "r2", name: "Board metrics.xlsx", meta: "375 KB · Priya Raman" },
  { id: "r3", name: "Churn interviews.docx", meta: "94 KB · Amara Okafor" },
];

export default function RowActionsDemo() {
  const [starred, setStarred] = useState<string[]>(["r2"]);
  const [notice, setNotice] = useState("");

  const actionsFor = (r: (typeof reports)[number]): RowAction[] => [
    { label: "View details", icon: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-10v5m0-8h.01", onSelect: () => setNotice(`Opened details for ${r.name}.`) },
    {
      label: starred.includes(r.id) ? "Remove from Starred" : "Add to Starred",
      icon: "m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z",
      onSelect: () => setStarred((s) => (s.includes(r.id) ? s.filter((x) => x !== r.id) : [...s, r.id])),
    },
    { label: "Rename", icon: "M4 20h4L19 9l-4-4L4 16zM13.5 6.5l4 4", shortcut: "F2", separatorBefore: true, onSelect: () => setNotice(`Renaming ${r.name}.`) },
    { label: "Move to folder", icon: "M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM10 13h6M13 10l3 3-3 3", onSelect: () => setNotice(`Choose where ${r.name} goes.`) },
    {
      label: "Move to Trash",
      icon: "M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3",
      destructive: true,
      separatorBefore: true,
      onSelect: () => setNotice(`Moved ${r.name} to Trash.`),
    },
  ];

  return (
    <div className="grid w-full max-w-md gap-2">
      <ul className="surface divide-y divide-line rounded-card">
        {reports.map((r) => (
          <li key={r.id} className="flex items-center gap-3 py-2.5 pr-2 pl-4">
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium">
                {r.name}
                {starred.includes(r.id) && (
                  <>
                    <span aria-hidden className="ml-1.5 text-warning">★</span>
                    <span className="sr-only"> (starred)</span>
                  </>
                )}
              </span>
              <span className="block text-xs text-muted">{r.meta}</span>
            </span>
            <RowActions actions={actionsFor(r)} label={`Actions for “${r.name}”`} />
          </li>
        ))}
      </ul>
      <p role="status" className="min-h-5 text-sm text-muted">
        {notice}
      </p>
    </div>
  );
}
