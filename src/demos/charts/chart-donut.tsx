"use client";

import { ChartDonut } from "@/registry/kit/ui/chart-donut";

const usd = (v: number) => `$${v.toLocaleString("en-US")}`;

export default function ChartDonutDemo() {
  return (
    <div className="surface w-full max-w-xl rounded-card p-6">
      <h3 className="mb-5 text-sm text-muted">Spending this month</h3>
      <ChartDonut
        label="Spending by category this month"
        formatValue={usd}
        centerLabel="Spent"
        data={[
          { label: "Housing", value: 1850 },
          { label: "Groceries", value: 640 },
          { label: "Transport", value: 310 },
          { label: "Other", value: 420 },
        ]}
      />
    </div>
  );
}
