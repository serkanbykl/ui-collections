"use client";

import { useState } from "react";

import { SegmentedControl } from "@/registry/kit/ui/segmented-control";

const plans = {
  monthly: "$24 / month",
  yearly: "$229 / year",
  lifetime: "$589 once",
};

export default function SegmentedControlDemo() {
  const [plan, setPlan] = useState<keyof typeof plans>("yearly");

  return (
    <div className="flex flex-col items-center gap-8">
      <SegmentedControl
        aria-label="Billing period"
        value={plan}
        onValueChange={setPlan}
        options={[
          { value: "monthly", label: "Monthly" },
          { value: "yearly", label: "Yearly" },
          { value: "lifetime", label: "Lifetime" },
        ]}
      />
      <p className="font-display text-5xl tracking-[-0.02em]">{plans[plan]}</p>
    </div>
  );
}
