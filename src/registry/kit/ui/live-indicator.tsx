import type { CSSProperties } from "react";

import { cn } from "@/registry/kit/lib/utils";

const keyframes = `
@keyframes kit-pulse { 0% { transform: scale(1); opacity: .55 } 80%, 100% { transform: scale(2.6); opacity: 0 } }
`;

const tones = {
  online: { color: "var(--color-accent)", text: "Online" },
  busy: { color: "var(--color-danger)", text: "Busy" },
  away: { color: "var(--color-warning)", text: "Away" },
  offline: { color: "var(--color-muted)", text: "Offline" },
};

export interface LiveIndicatorProps {
  status?: keyof typeof tones;
  /** Visible text. Without it the status is announced to screen readers only. */
  label?: React.ReactNode;
  /** Ripple outward. Defaults to on for online. */
  pulse?: boolean;
  /** Wrap in a surface pill. */
  pill?: boolean;
  className?: string;
}

/** A status dot with a slow ripple, for live data, presence and deploys. CSS only. */
export function LiveIndicator({ status = "online", label, pulse, pill = false, className }: LiveIndicatorProps) {
  const tone = tones[status];
  const ripple = pulse ?? status === "online";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 text-sm",
        pill && "surface rounded-control py-1.5 pr-3.5 pl-3",
        className,
      )}
      style={{ "--dot": tone.color } as CSSProperties}
    >
      <style href="kit-pulse" precedence="medium">
        {keyframes}
      </style>
      <span aria-hidden className="relative grid size-2.5 place-items-center">
        {ripple && (
          <span
            className="kit-pulse absolute inset-0 rounded-full bg-(--dot)"
            style={{ animation: "kit-pulse 2.4s cubic-bezier(0.22, 1, 0.36, 1) infinite" }}
          />
        )}
        <span className="relative size-2.5 rounded-full bg-(--dot) shadow-[0_0_8px_var(--dot)]" />
      </span>
      {label ?? <span className="sr-only">{tone.text}</span>}
    </span>
  );
}
