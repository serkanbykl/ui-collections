"use client";

import { useEffect, useId, useRef, useState, type CSSProperties } from "react";

import { cn } from "@/registry/kit/lib/utils";

import { defaultValues, type RangeControl, type TunerControl, type TunerValues } from "@/registry/kit/lib/theme-presets";

export { defaultValues, glassControls, tideControls } from "@/registry/kit/lib/theme-presets";
export type { ChoiceControl, ColorControl, RangeControl, TunerControl, TunerValues } from "@/registry/kit/lib/theme-presets";

function cssValue(c: RangeControl, v: number) {
  return c.toCss ? c.toCss(v) : `${v}${c.unit}`;
}

const controlDefault = (controls: TunerControl[], id: string) => controls.find((c) => c.id === id)?.default;

/** Picking a preset with a colour moves the colour wells tied to that choice onto it, so a custom accent starts from it. */
function followColors(controls: TunerControl[], choiceId: string, color: string | undefined): TunerValues {
  if (!color) return {};
  return Object.fromEntries(controls.filter((c) => c.kind === "color" && c.selects?.id === choiceId).map((c) => [c.id, color]));
}

/**
 * Props that apply the values to an element and everything inside it:
 * `<div {...tunerProps(controls, values)}>`. Put them on <html> to retune a page.
 */
export function tunerProps(controls: TunerControl[], values: TunerValues) {
  const style: Record<string, string> = {};
  const attributes: Record<string, string> = {};
  for (const c of controls) {
    const v = values[c.id] ?? c.default;
    if (c.kind === "range") style[c.variable] = cssValue(c, Number(v));
    else if (c.kind === "color") {
      // Only while the choice that reads it is on, so snippets stay free of unused colours.
      if (!c.selects || (values[c.selects.id] ?? controlDefault(controls, c.selects.id)) === c.selects.value) style[c.variable] = String(v);
    } else attributes[c.attribute] = String(v);
  }
  return { style: style as CSSProperties, ...attributes };
}

/** Writes the values onto an element imperatively, e.g. document.documentElement. */
export function applyTuner(el: HTMLElement, controls: TunerControl[], values: TunerValues) {
  const { style, ...attributes } = tunerProps(controls, values);
  for (const [name, value] of Object.entries(style)) el.style.setProperty(name, String(value));
  for (const [name, value] of Object.entries(attributes)) el.setAttribute(name, String(value));
}

/** The values as copyable CSS and HTML. */
export function tunerSnippet(controls: TunerControl[], values: TunerValues) {
  const { style, ...attributes } = tunerProps(controls, values);
  const vars = Object.entries(style).map(([k, v]) => `  ${k}: ${v};`);
  // One attribute per line keeps the snippet narrow enough for a side panel.
  const attrs = Object.entries(attributes).map(([k, v]) => `  ${k}="${v}"`);
  return [vars.length ? `:root {\n${vars.join("\n")}\n}` : "", attrs.length ? `<html\n${attrs.join("\n")}\n>` : ""]
    .filter(Boolean)
    .join("\n\n");
}

/** How long a dragged colour rests before it restyles the page. */
const COLOR_COMMIT_MS = 120;

/**
 * Native colour input. Dragging in the picker fires a change per pixel, and
 * each one restyles the whole page (and any preview frames following it), so
 * the swatch follows the pointer at once while the theme follows at most once
 * per interval, and always lands on the last value.
 */
function ColorWell({
  id,
  label,
  value,
  active,
  onCommit,
}: {
  id: string;
  label: string;
  value: string;
  active: boolean;
  onCommit: (value: string) => void;
}) {
  const [draft, setDraft] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const pending = useRef<string | null>(null);
  const latest = useRef(onCommit);
  useEffect(() => {
    latest.current = onCommit;
  });
  useEffect(() => () => clearTimeout(timer.current), []);

  const flush = () => {
    clearTimeout(timer.current);
    timer.current = undefined;
    if (pending.current !== null) latest.current(pending.current);
    pending.current = null;
  };
  const shown = draft ?? value;

  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <label htmlFor={id} className="text-fg/85">
        {label}
      </label>
      <span className="flex items-center gap-2.5">
        <output htmlFor={id} className={cn("font-mono text-xs uppercase tabular-nums", active ? "text-muted" : "text-subtle")}>
          {shown}
        </output>
        <input
          id={id}
          type="color"
          value={shown}
          onChange={(e) => {
            setDraft(e.target.value);
            pending.current = e.target.value;
            // At most one restyle per interval while dragging; the last value always lands.
            timer.current ??= setTimeout(flush, COLOR_COMMIT_MS);
          }}
          onBlur={() => {
            flush();
            setDraft(null);
          }}
          className={cn(
            "size-8 cursor-pointer appearance-none rounded-control border border-line-strong bg-transparent p-0.5 transition-colors duration-200 hover:border-fg/40",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
            "[&::-webkit-color-swatch]:rounded-[calc(var(--radius-control)-2px)] [&::-webkit-color-swatch]:border-0 [&::-webkit-color-swatch-wrapper]:p-0",
            "[&::-moz-color-swatch]:rounded-[calc(var(--radius-control)-2px)] [&::-moz-color-swatch]:border-0",
          )}
        />
      </span>
    </div>
  );
}

/** Slider, choice and colour controls for theme dials. Controlled; pair with `tunerProps()` or `applyTuner()`. */
export function ThemeTuner({
  controls,
  value,
  onChange,
  className,
}: {
  controls: TunerControl[];
  value: TunerValues;
  onChange: (value: TunerValues) => void;
  className?: string;
}) {
  const baseId = useId();
  const changed = controls.some((c) => (value[c.id] ?? c.default) !== c.default);

  return (
    <div className={cn("grid gap-5", className)}>
      {controls.map((c) => {
        const id = `${baseId}-${c.id}`;
        const current = value[c.id] ?? c.default;

        if (c.kind === "choice") {
          return (
            <fieldset key={c.id} className="grid gap-2.5">
              <legend className="mb-2.5 text-sm text-fg/85">{c.label}</legend>
              <div className="flex flex-wrap gap-1.5">
                {c.options.map((o) => (
                  <label
                    key={o.value}
                    className={cn(
                      "cursor-pointer rounded-control border px-3 py-1.5 text-xs transition-colors duration-200",
                      "has-focus-visible:outline-2 has-focus-visible:outline-accent",
                      current === o.value
                        ? "border-accent bg-accent text-accent-fg"
                        : "border-line text-muted hover:border-line-strong hover:text-fg",
                    )}
                  >
                    <input
                      type="radio"
                      name={id}
                      value={o.value}
                      checked={current === o.value}
                      onChange={() => onChange({ ...value, [c.id]: o.value, ...followColors(controls, c.id, o.color) })}
                      className="sr-only"
                    />
                    {o.label}
                  </label>
                ))}
              </div>
            </fieldset>
          );
        }

        if (c.kind === "color") {
          return (
            <ColorWell
              key={c.id}
              id={id}
              label={c.label}
              value={String(current)}
              active={!c.selects || (value[c.selects.id] ?? controlDefault(controls, c.selects.id)) === c.selects.value}
              onCommit={(next) => onChange({ ...value, [c.id]: next, ...(c.selects ? { [c.selects.id]: c.selects.value } : {}) })}
            />
          );
        }

        const n = Number(current);
        const percent = ((n - c.min) / (c.max - c.min)) * 100;
        return (
          <div key={c.id} className="grid gap-2.5">
            <div className="flex items-baseline justify-between text-sm">
              <label htmlFor={id} className="text-fg/85">
                {c.label}
              </label>
              <output htmlFor={id} className="font-mono text-xs text-muted tabular-nums">
                {n}
                {c.unit}
              </output>
            </div>
            <input
              id={id}
              type="range"
              min={c.min}
              max={c.max}
              step={c.step}
              value={n}
              onChange={(e) => onChange({ ...value, [c.id]: Number(e.target.value) })}
              style={{ "--fill": `${percent}%` } as CSSProperties}
              className={cn(
                "h-5 w-full cursor-pointer appearance-none bg-transparent outline-none",
                "[&::-webkit-slider-runnable-track]:h-1 [&::-webkit-slider-runnable-track]:rounded-full",
                "[&::-webkit-slider-runnable-track]:bg-[linear-gradient(90deg,var(--color-accent)_var(--fill),color-mix(in_oklab,var(--color-fg)_14%,transparent)_var(--fill))]",
                "[&::-moz-range-track]:h-1 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-fg/15",
                "[&::-moz-range-progress]:h-1 [&::-moz-range-progress]:rounded-full [&::-moz-range-progress]:bg-accent",
                "[&::-webkit-slider-thumb]:-mt-1.5 [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-[0_0_0_1px_var(--color-line-strong),0_1px_3px_rgb(0_0_0/0.3)]",
                "[&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:shadow-[0_0_0_1px_var(--color-line-strong),0_1px_3px_rgb(0_0_0/0.3)]",
                "focus-visible:[&::-webkit-slider-thumb]:shadow-[0_0_0_4px_color-mix(in_oklab,var(--color-accent)_45%,transparent)]",
                "focus-visible:[&::-moz-range-thumb]:shadow-[0_0_0_4px_color-mix(in_oklab,var(--color-accent)_45%,transparent)]",
              )}
            />
          </div>
        );
      })}
      <button
        type="button"
        disabled={!changed}
        onClick={() => onChange(defaultValues(controls))}
        className="justify-self-start text-xs text-muted underline-offset-4 transition-colors hover:text-fg hover:underline disabled:pointer-events-none disabled:opacity-40"
      >
        Reset to defaults
      </button>
    </div>
  );
}
