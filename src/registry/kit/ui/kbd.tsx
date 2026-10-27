import type { HTMLAttributes } from "react";

import { cn } from "@/registry/kit/lib/utils";

/** A single key cap. */
export function Kbd({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return (
    <kbd
      className={cn(
        "inline-flex h-6 min-w-6 items-center justify-center rounded-[calc(var(--r-field)*0.4)] border border-fg/15 bg-fg/[0.06] px-1.5",
        "font-mono text-[11px] text-fg/80 shadow-[inset_0_-1px_0_var(--c-line)]",
        className,
      )}
      {...props}
    />
  );
}

/** Keys pressed together, e.g. ⌘ K. */
export function KbdGroup({ keys, className }: { keys: string[]; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1", className)}>
      {keys.map((key) => (
        <Kbd key={key}>{key}</Kbd>
      ))}
    </span>
  );
}
