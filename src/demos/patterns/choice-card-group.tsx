"use client";

import { useState } from "react";

import { ChoiceCardGroup } from "@/registry/kit/ui/choice-card-group";

type Strategy = "rolling" | "canary" | "blue-green";

function Bars({ heights, accent }: { heights: number[]; accent: number[] }) {
  return (
    <span className="flex h-16 items-end gap-1 bg-fg/[0.03] px-3 pb-3">
      {heights.map((h, i) => (
        <span
          key={i}
          className={accent.includes(i) ? "flex-1 rounded-[calc(var(--r-field)*0.25)] bg-accent/70" : "flex-1 rounded-[calc(var(--r-field)*0.25)] bg-fg/15"}
          style={{ height: `${h}%` }}
        />
      ))}
    </span>
  );
}

export default function ChoiceCardGroupDemo() {
  const [strategy, setStrategy] = useState<Strategy>("canary");

  return (
    <ChoiceCardGroup
      label="Rollout strategy"
      value={strategy}
      onValueChange={setStrategy}
      className="w-full max-w-3xl sm:grid-cols-3"
      options={[
        { value: "rolling", label: "Rolling", description: "Replace instances a few at a time.", preview: <Bars heights={[70, 70, 70, 40, 40, 40]} accent={[0, 1, 2]} /> },
        { value: "canary", label: "Canary", description: "Send 5% of traffic first, then widen.", preview: <Bars heights={[30, 80, 80, 80, 80, 80]} accent={[0]} /> },
        { value: "blue-green", label: "Blue–green", description: "Switch all traffic at once.", preview: <Bars heights={[60, 60, 60, 60, 60, 60]} accent={[3, 4, 5]} /> },
      ]}
    />
  );
}
