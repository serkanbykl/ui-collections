"use client";

import { useEffect, useState } from "react";

import { Progress } from "@/registry/kit/ui/progress";

const steps = ["Cloning", "Installing", "Building", "Uploading", "Ready"];

export default function ProgressDemo() {
  const [value, setValue] = useState(8);

  useEffect(() => {
    const timer = setInterval(() => setValue((v) => (v >= 100 ? 8 : Math.min(100, v + 12))), 900);
    return () => clearInterval(timer);
  }, []);

  const step = steps[Math.min(steps.length - 1, Math.floor((value / 100) * (steps.length - 1)))];

  return (
    <div className="surface grid w-full max-w-sm gap-3 rounded-card p-6">
      <div className="flex justify-between text-sm">
        <span id="build-label">{step}</span>
        <span className="text-muted tabular-nums">{value}%</span>
      </div>
      <Progress value={value} aria-labelledby="build-label" />
      <p className="text-xs text-muted">marketing-site · main · 4f2a91c</p>
    </div>
  );
}
