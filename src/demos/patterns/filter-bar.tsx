"use client";

import { useState } from "react";

import { DateRangePicker, type DateRange } from "@/registry/kit/ui/date-range-picker";
import { FilterBar } from "@/registry/kit/ui/filter-bar";
import { Button } from "@/registry/kit/ui/button";
import { MultiSelect } from "@/registry/kit/ui/multi-select";
import { SearchInput } from "@/registry/kit/ui/search-input";

const today = new Date(2026, 9, 26);

export default function FilterBarDemo() {
  const [query, setQuery] = useState("");
  const [plan, setPlan] = useState<string[]>([]);
  const [range, setRange] = useState<DateRange | undefined>();
  const [exporting, setExporting] = useState<"idle" | "busy" | "done">("idle");
  const active = (query ? 1 : 0) + plan.length + (range ? 1 : 0);

  return (
    <div className="surface w-full max-w-4xl rounded-card p-4">
      <FilterBar
        search={<SearchInput label="Search invoices" value={query} onValueChange={setQuery} />}
        filters={
          <>
            <MultiSelect
              label="Plan"
              value={plan}
              onValueChange={setPlan}
              options={[
                { value: "free", label: "Free" },
                { value: "pro", label: "Pro" },
                { value: "team", label: "Team" },
              ]}
            />
            <DateRangePicker value={range} onValueChange={setRange} today={today} placeholder="Any date" />
          </>
        }
        activeCount={active}
        onReset={() => {
          setQuery("");
          setPlan([]);
          setRange(undefined);
        }}
        end={
          <Button
            size="sm"
            variant="solid"
            shine={false}
            loading={exporting === "busy"}
            onClick={() => {
              setExporting("busy");
              setTimeout(() => setExporting("done"), 1200);
            }}
          >
            {exporting === "done" ? "Exported 214 invoices" : "Export CSV"}
          </Button>
        }
      />
    </div>
  );
}
