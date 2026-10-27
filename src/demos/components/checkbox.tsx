"use client";

import { useState } from "react";

import { Checkbox } from "@/registry/kit/ui/checkbox";

const environments = ["Production", "Preview", "Development"];

export default function CheckboxDemo() {
  const [selected, setSelected] = useState(["Production", "Preview"]);
  const all = selected.length === environments.length ? true : selected.length ? "indeterminate" : false;

  return (
    <fieldset className="surface grid w-full max-w-xs gap-3 rounded-card p-6">
      <legend className="sr-only">Expose variable to</legend>
      <label className="flex items-center gap-3 border-b border-fg/10 pb-3 text-sm font-medium">
        <Checkbox checked={all} onCheckedChange={(v) => setSelected(v ? environments : [])} />
        All environments
      </label>
      {environments.map((env) => (
        <label key={env} className="flex items-center gap-3 text-sm text-fg/85">
          <Checkbox
            checked={selected.includes(env)}
            onCheckedChange={(v) => setSelected((s) => (v ? [...s, env] : s.filter((x) => x !== env)))}
          />
          {env}
        </label>
      ))}
    </fieldset>
  );
}
