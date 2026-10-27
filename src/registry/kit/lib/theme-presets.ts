/**
 * Theme dial types and the presets each collection ships. Kept out of the
 * "use client" tuner so server code can read them too.
 */

/** A slider that writes one CSS custom property. */
export interface RangeControl {
  kind: "range";
  id: string;
  label: string;
  variable: `--${string}`;
  min: number;
  max: number;
  step: number;
  /** Shown next to the value. */
  unit: string;
  /** Slider value → CSS value. Defaults to `${value}${unit}`. */
  toCss?: (value: number) => string;
  default: number;
}

/** A segmented choice that writes one data attribute. */
export interface ChoiceControl {
  kind: "choice";
  id: string;
  label: string;
  attribute: `data-${string}`;
  options: { value: string; label: string }[];
  default: string;
}

export type TunerControl = RangeControl | ChoiceControl;
export type TunerValues = Record<string, number | string>;

export function defaultValues(controls: TunerControl[]): TunerValues {
  return Object.fromEntries(controls.map((c) => [c.id, c.default]));
}

/** Dials for the glass theme: mode, plus CSS variables read by its surfaces. */
export const glassControls: TunerControl[] = [
  {
    kind: "choice",
    id: "mode",
    label: "Mode",
    attribute: "data-mode",
    options: [
      { value: "dark", label: "Dark" },
      { value: "light", label: "Light" },
    ],
    default: "dark",
  },
  {
    kind: "choice",
    id: "accent",
    label: "Accent",
    attribute: "data-accent",
    options: [
      { value: "teal", label: "Teal" },
      { value: "green", label: "Green" },
      { value: "sky", label: "Sky" },
      { value: "violet", label: "Violet" },
      { value: "amber", label: "Amber" },
      { value: "rose", label: "Rose" },
    ],
    default: "teal",
  },
  {
    kind: "choice",
    id: "radius",
    label: "Corners",
    attribute: "data-radius",
    options: [
      { value: "sharp", label: "Sharp" },
      { value: "balanced", label: "Balanced" },
      { value: "rounded", label: "Rounded" },
    ],
    default: "rounded",
  },
  { kind: "range", id: "blur", label: "Blur", variable: "--glass-blur", min: 0, max: 40, step: 1, unit: "px", default: 14 },
  { kind: "range", id: "saturate", label: "Saturation", variable: "--glass-saturate", min: 100, max: 260, step: 5, unit: "%", default: 180 },
  { kind: "range", id: "tint", label: "Frost", variable: "--glass-tint", min: 0, max: 30, step: 0.5, unit: "%", toCss: (v) => `${v / 100}`, default: 6 },
  { kind: "range", id: "rim", label: "Rim light", variable: "--glass-rim", min: 0, max: 100, step: 1, unit: "%", toCss: (v) => `${v / 100}`, default: 50 },
  { kind: "range", id: "shine", label: "Specular", variable: "--glass-shine", min: 0, max: 100, step: 1, unit: "%", toCss: (v) => `${v / 100}`, default: 35 },
  { kind: "range", id: "depth", label: "Depth", variable: "--glass-depth", min: 0, max: 80, step: 1, unit: "%", toCss: (v) => `${v / 100}`, default: 35 },
  { kind: "range", id: "aurora", label: "Backdrop colour", variable: "--aurora-strength", min: 0, max: 100, step: 5, unit: "%", toCss: (v) => `${v / 100}`, default: 20 },
];

/** Dials for the tide theme: data attributes read by tide.css. */
export const tideControls: TunerControl[] = [
  {
    kind: "choice",
    id: "mode",
    label: "Mode",
    attribute: "data-mode",
    options: [
      { value: "light", label: "Light" },
      { value: "dark", label: "Dark" },
    ],
    default: "light",
  },
  {
    kind: "choice",
    id: "accent",
    label: "Accent",
    attribute: "data-accent",
    options: [
      { value: "green", label: "Green" },
      { value: "teal", label: "Teal" },
      { value: "olive", label: "Olive" },
      { value: "gold", label: "Gold" },
      { value: "sage", label: "Sage" },
      { value: "kalamata", label: "Kalamata" },
    ],
    default: "green",
  },
  {
    kind: "choice",
    id: "radius",
    label: "Corners",
    attribute: "data-radius",
    options: [
      { value: "sharp", label: "Sharp" },
      { value: "balanced", label: "Balanced" },
      { value: "rounded", label: "Rounded" },
    ],
    default: "balanced",
  },
  {
    kind: "choice",
    id: "surface",
    label: "Surfaces",
    attribute: "data-surface",
    options: [
      { value: "bordered", label: "Bordered" },
      { value: "elevated", label: "Elevated" },
      { value: "flat", label: "Flat" },
    ],
    default: "bordered",
  },
  { kind: "range", id: "aurora", label: "Backdrop colour", variable: "--aurora-strength", min: 0, max: 100, step: 5, unit: "%", toCss: (v) => `${v / 100}`, default: 0 },
];
