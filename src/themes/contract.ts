/**
 * The theme contract. Every collection's src/themes/<id>.css must define all
 * of these under `[data-theme="<id>"]`; scripts/check-themes.mts enforces it.
 * Components may only style themselves through these tokens and selectors.
 */

/** Custom properties, mapped to Tailwind in src/themes/base.css. */
export const themeVariables = [
  // Colour
  "--c-bg", // page background
  "--c-bg-deep", // darker band / stage background
  "--c-card", // solid card fill where a theme needs one
  "--c-fg", // primary text; also the base for low-alpha overlays (bg-fg/5)
  "--c-muted", // secondary text
  "--c-subtle", // tertiary text, placeholders
  "--c-accent", // brand accent
  "--c-accent-fg", // text on accent fills
  "--c-line", // hairline borders
  "--c-line-strong", // stronger borders
  "--c-hover", // hover / selected overlay
  "--c-field", // input fill
  "--c-field-focus", // input fill while focused (opaque where --c-field is)
  "--c-surface-hover", // .surface fill on hover; must keep opaque surfaces opaque
  "--c-surface-selected", // .surface fill when checked/selected
  "--c-success",
  "--c-success-soft",
  "--c-warning",
  "--c-warning-soft",
  "--c-info",
  "--c-info-soft",
  "--c-danger",
  "--c-danger-soft",
  "--c-aurora-1", // backdrop colours
  "--c-aurora-2",
  "--c-aurora-3",
  // Shape
  "--r-card",
  "--r-control",
  "--r-field",
  // Type
  "--f-display",
  "--f-sans",
  "--f-display-weight",
  "--f-display-tracking",
  // Motion
  "--e-theme",
  "--hover-scale",
  "--press-scale",
  "--shine", // 0 or 1: light sweep on buttons
] as const;

/** Class selectors each theme must style (in @layer components). */
export const themeSurfaces = [".surface", ".surface-raised", ".surface-field"] as const;
