"use client";

import { useState } from "react";

import { Button } from "@/registry/kit/ui/button";
import { defaultValues, glassControls, ThemeTuner, tideControls, tunerProps } from "@/registry/kit/ui/theme-tuner";

// Each collection ships its own dials; this demo shows both scoped to a preview.
const presets = { glass: glassControls, tide: tideControls };

export default function ThemeTunerDemo({ theme = "glass" }: { theme?: keyof typeof presets }) {
  const controls = presets[theme];
  const [values, setValues] = useState(() => defaultValues(controls));

  return (
    <div className="grid w-full max-w-3xl items-center gap-8 md:grid-cols-2">
      <ThemeTuner controls={controls} value={values} onChange={setValues} className="surface-raised rounded-card p-6" />
      {/* The values restyle everything inside this element, and nothing outside it. */}
      <div {...tunerProps(controls, values)} className="grid gap-4">
        <div className="surface rounded-card p-7">
          <div className="text-xs tracking-[0.18em] text-muted uppercase">Preview</div>
          <p className="mt-4 font-display text-3xl leading-tight">Change a dial and watch the surface follow.</p>
        </div>
        <Button className="justify-self-start">Publish changes</Button>
      </div>
    </div>
  );
}
