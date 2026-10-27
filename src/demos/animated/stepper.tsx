"use client";

import { useState } from "react";

import { Button } from "@/registry/kit/ui/button";
import { Stepper } from "@/registry/kit/ui/stepper";

const steps = [
  { title: "Account", description: "Name and email" },
  { title: "Workspace", description: "Team and plan" },
  { title: "Connect", description: "Link a repository" },
  { title: "Launch", description: "First deploy" },
];

export default function StepperDemo() {
  const [current, setCurrent] = useState(1);

  return (
    <div className="grid w-full max-w-2xl gap-10">
      <Stepper steps={steps} current={current} />
      <div className="flex justify-center gap-3">
        <Button size="sm" variant="ghost" disabled={current === 0} onClick={() => setCurrent((c) => c - 1)}>
          Back
        </Button>
        <Button size="sm" disabled={current === steps.length} onClick={() => setCurrent((c) => c + 1)}>
          {current >= steps.length - 1 ? "Finish" : "Continue"}
        </Button>
      </div>
    </div>
  );
}
