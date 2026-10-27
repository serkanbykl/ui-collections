"use client";

import { useId, type ReactNode } from "react";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/registry/kit/ui/select";
import { Slider } from "@/registry/kit/ui/slider";
import { Switch } from "@/registry/kit/ui/switch";

/** Settings panel shared by the carousel demos, built from the library's own controls. */
export function OptionsPanel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section aria-label={title} className="surface rounded-card p-4 sm:p-5">
      <h3 className="text-sm font-medium">{title}</h3>
      <div className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
    </section>
  );
}

function Row({ id, label, children }: { id: string; label: string; children: ReactNode }) {
  return (
    <div className="flex min-h-11 items-center justify-between gap-3">
      <label htmlFor={id} id={`${id}-label`} className="text-sm text-muted">
        {label}
      </label>
      {children}
    </div>
  );
}

export function ChoiceOption<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: { value: T; label: string }[]; onChange: (value: T) => void }) {
  const id = useId();
  return (
    <Row id={id} label={label}>
      <Select value={value} onValueChange={(v) => onChange(v as T)}>
        <SelectTrigger id={id} className="h-9 w-36 shrink-0">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Row>
  );
}

export function SwitchOption({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  const id = useId();
  return (
    <Row id={id} label={label}>
      <Switch id={id} checked={checked} onCheckedChange={onChange} />
    </Row>
  );
}

export function RangeOption({ label, value, min, max, step = 1, format, disabled, onChange }: { label: string; value: number; min: number; max: number; step?: number; format: (v: number) => string; disabled?: boolean; onChange: (value: number) => void }) {
  const id = useId();
  return (
    <div className="flex min-h-11 items-center justify-between gap-3">
      <span id={`${id}-label`} className="shrink-0 text-sm text-muted">
        {label}
      </span>
      <div className="flex w-36 shrink-0 items-center gap-3">
        <Slider value={[value]} min={min} max={max} step={step} disabled={disabled} onValueChange={([v]) => onChange(v!)} aria-label={label} />
        <span className="w-10 shrink-0 text-end text-xs text-fg tabular-nums">{format(value)}</span>
      </div>
    </div>
  );
}
