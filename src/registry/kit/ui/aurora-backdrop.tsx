import type { CSSProperties } from "react";

import { cn } from "@/registry/kit/lib/utils";

// Pools sit at the corners and edges so colour frames the content instead of
// pooling behind the middle of it.
const blobs: { className: string; style: CSSProperties }[] = [
  {
    className: "-top-[40%] -left-[20%] size-[75vmax]",
    style: { "--blob": "var(--c-aurora-1)", "--blob-mix": "34%", "--drift-duration": "44s" } as CSSProperties,
  },
  {
    className: "-right-[22%] -bottom-[48%] size-[80vmax]",
    style: {
      "--blob": "var(--c-aurora-2)",
      "--blob-mix": "36%",
      "--drift-duration": "52s",
      "--drift-x": "-10%",
      "--drift-y": "6%",
    } as CSSProperties,
  },
  {
    className: "-top-[30%] -right-[30%] size-[60vmax]",
    style: {
      "--blob": "var(--c-aurora-3)",
      "--blob-mix": "38%",
      "--drift-duration": "38s",
      "--drift-x": "-8%",
      "--drift-y": "10%",
    } as CSSProperties,
  },
  {
    className: "-bottom-[42%] -left-[26%] size-[62vmax]",
    style: {
      "--blob": "var(--c-aurora-3)",
      "--blob-mix": "30%",
      "--drift-duration": "47s",
      "--drift-x": "10%",
      "--drift-y": "-6%",
    } as CSSProperties,
  },
];

export interface AuroraBackdropProps {
  /** Overlay a faint grid that fades toward the edges. */
  grid?: boolean;
  className?: string;
}

/**
 * Slow-drifting pools of colour for surface to refract. Soft radial gradients
 * moved with transforms only: no blur filter, no JavaScript, no image.
 * Place it inside a `relative isolate` container.
 */
export function AuroraBackdrop({ grid = true, className }: AuroraBackdropProps) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 -z-10 overflow-hidden", className)}>
      {blobs.map((blob, i) => (
        <div
          key={i}
          // The shared animation shorthand resolves its duration on :root, so set it per blob.
          style={{ ...blob.style, animationDuration: "var(--drift-duration)" }}
          className={cn(
            "absolute animate-drift rounded-full will-change-transform",
            // --aurora-strength (set by the theme, 0–1) scales every pool, so themes can keep it a hint.
            // A long, even falloff: a soft wash that reaches far rather than a bright core.
            "[--a:calc(var(--blob-mix)*var(--aurora-strength,1))]",
            "bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--blob)_var(--a),transparent),color-mix(in_oklab,var(--blob)_calc(var(--a)*0.75),transparent)_35%,color-mix(in_oklab,var(--blob)_calc(var(--a)*0.35),transparent)_68%,transparent)]",
            blob.className,
          )}
        />
      ))}
      {grid && (
        <div className="absolute inset-0 bg-[linear-gradient(color-mix(in_oklab,var(--c-fg)_3.5%,transparent)_1px,transparent_1px),linear-gradient(90deg,color-mix(in_oklab,var(--c-fg)_3.5%,transparent)_1px,transparent_1px)] mask-[radial-gradient(ellipse_at_center,#000_10%,transparent_60%)] bg-size-[64px_64px]" />
      )}
    </div>
  );
}
