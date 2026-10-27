"use client";

import { useState } from "react";

import { Slider } from "@/registry/kit/ui/slider";

export default function SliderDemo() {
  const [instances, setInstances] = useState([3]);
  const [range, setRange] = useState([20, 70]);

  return (
    <div className="surface grid w-full max-w-sm gap-8 rounded-card p-6">
      <div className="grid gap-3">
        <div className="flex justify-between text-sm">
          <span id="instances-label">Instances</span>
          <span className="text-muted tabular-nums">{instances[0]}</span>
        </div>
        <Slider value={instances} onValueChange={setInstances} min={1} max={10} aria-labelledby="instances-label" />
      </div>
      <div className="grid gap-3">
        <div className="flex justify-between text-sm">
          <span id="cpu-label">Autoscale between</span>
          <span className="text-muted tabular-nums">
            {range[0]}% – {range[1]}% CPU
          </span>
        </div>
        <Slider value={range} onValueChange={setRange} minStepsBetweenThumbs={5} aria-labelledby="cpu-label" />
      </div>
    </div>
  );
}
