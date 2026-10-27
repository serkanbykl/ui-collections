import { cn } from "@/registry/kit/lib/utils";

const sizes = { sm: "size-3.5", md: "size-5", lg: "size-8" };

export interface SpinnerProps {
  size?: keyof typeof sizes;
  /** Announced to screen readers. Pass `null` when a parent already says it's busy. */
  label?: string | null;
  className?: string;
}

/**
 * Loading indicator in the current text colour: a faint track and a turning
 * arc. Keeps spinning under reduced motion, since a frozen spinner reads as
 * finished.
 */
export function Spinner({ size = "md", label = "Loading", className }: SpinnerProps) {
  return (
    <span
      role={label ? "status" : undefined}
      aria-label={label ?? undefined}
      aria-hidden={label ? undefined : true}
      className={cn("inline-block shrink-0", sizes[size], className)}
    >
      <svg viewBox="0 0 24 24" fill="none" className="size-full animate-spin" aria-hidden>
        <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeOpacity="0.2" strokeWidth="2.5" />
        <path d="M21.5 12A9.5 9.5 0 0 0 12 2.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    </span>
  );
}
