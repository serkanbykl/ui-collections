"use client";

import { useState } from "react";

import { MultiSelect } from "@/registry/kit/ui/multi-select";

const regions = [
  { value: "fra", label: "Frankfurt", count: 42 },
  { value: "iad", label: "Washington", count: 38 },
  { value: "sfo", label: "San Francisco", count: 21 },
  { value: "gru", label: "São Paulo", count: 12 },
  { value: "sin", label: "Singapore", count: 17 },
  { value: "syd", label: "Sydney", count: 9 },
  { value: "hnd", label: "Tokyo", count: 15 },
  { value: "cpt", label: "Cape Town", count: 4 },
];

export default function MultiSelectDemo() {
  const [status, setStatus] = useState<string[]>(["active"]);
  const [region, setRegion] = useState<string[]>([]);

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <MultiSelect
        label="Status"
        value={status}
        onValueChange={setStatus}
        options={[
          { value: "active", label: "Active", count: 96 },
          { value: "paused", label: "Paused", count: 41 },
          { value: "archived", label: "Archived", count: 21 },
        ]}
      />
      <MultiSelect label="Region" value={region} onValueChange={setRegion} options={regions} />
    </div>
  );
}
