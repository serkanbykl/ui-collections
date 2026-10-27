import { cn } from "@/registry/kit/lib/utils";
import { Skeleton } from "@/registry/kit/ui/skeleton";

/*
 * Shared empty, error and loading presentations, so every table, widget and
 * page shows these moments the same way.
 */

interface StateProps {
  title: string;
  description?: string;
  /** Icon element; a sensible default is used. */
  icon?: React.ReactNode;
  /** Buttons or links under the text. */
  action?: React.ReactNode;
  /** `compact` for table bodies and small widgets. */
  size?: "default" | "compact";
  className?: string;
}

function StateLayout({
  title,
  description,
  icon,
  action,
  size = "default",
  className,
  tone,
  role,
}: StateProps & { tone: "neutral" | "danger"; role?: "alert" }) {
  const compact = size === "compact";
  return (
    <div
      role={role}
      className={cn(
        "flex flex-col items-center justify-center text-center",
        compact ? "gap-2.5 px-4 py-8" : "gap-4 px-6 py-14",
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "surface grid place-items-center rounded-field",
          compact ? "size-10 [&>svg]:size-[18px]" : "size-14 [&>svg]:size-6",
          tone === "danger" ? "text-danger" : "text-accent",
        )}
      >
        {icon}
      </span>
      <div className="max-w-sm space-y-1.5">
        <p className={cn("text-fg", compact ? "text-sm font-medium" : "font-display text-2xl tracking-[-0.02em]")}>{title}</p>
        {description && <p className="text-sm leading-relaxed text-muted">{description}</p>}
      </div>
      {action && <div className="mt-1 flex flex-wrap items-center justify-center gap-2">{action}</div>}
    </div>
  );
}

const InboxIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 13.5 6.4 6.3A2 2 0 0 1 8.3 5h7.4a2 2 0 0 1 1.9 1.3L20 13.5V18a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-4.5Z" />
    <path d="M4 13.5h4.5l1.2 2h4.6l1.2-2H20" />
  </svg>
);

const AlertIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.3 4.2 2.9 17a2 2 0 0 0 1.7 3h14.8a2 2 0 0 0 1.7-3L13.7 4.2a2 2 0 0 0-3.4 0Z" />
    <path d="M12 9.5v4M12 16.8h.01" />
  </svg>
);

export function EmptyState({ icon = InboxIcon, ...props }: StateProps) {
  return <StateLayout icon={icon} tone="neutral" {...props} />;
}

export function ErrorState({ icon = AlertIcon, ...props }: StateProps) {
  return <StateLayout icon={icon} tone="danger" role="alert" {...props} />;
}

/** One shimmering placeholder block; kept as an alias of `Skeleton`. */
export const SkeletonBlock = Skeleton;

export interface LoadingStateProps {
  /** Announced to assistive tech. */
  label?: string;
  variant?: "lines" | "list" | "stat" | "chart" | "table";
  rows?: number;
  className?: string;
}

/** Skeletons shaped like the content they stand in for. */
export function LoadingState({ label = "Loading", variant = "lines", rows = 4, className }: LoadingStateProps) {
  const range = Array.from({ length: rows }, (_, i) => i);
  return (
    <div role="status" aria-live="polite" className={cn("w-full", className)}>
      <span className="sr-only">{label}…</span>
      {variant === "stat" ? (
        <div className="space-y-3">
          <SkeletonBlock className="h-4 w-24" />
          <SkeletonBlock className="h-9 w-36" />
          <SkeletonBlock className="h-3 w-44" />
        </div>
      ) : variant === "chart" ? (
        <div className="flex h-48 items-end gap-2">
          {[40, 65, 50, 80, 60, 92, 70, 55, 85, 75].map((h, i) => (
            <SkeletonBlock key={i} className="flex-1 rounded-[calc(var(--r-field)*0.4)]" style={{ height: `${h}%` }} />
          ))}
        </div>
      ) : variant === "list" ? (
        <div className="space-y-4">
          {range.map((i) => (
            <div key={i} className="flex items-center gap-3">
              <SkeletonBlock className="size-9 rounded-full" />
              <div className="flex-1 space-y-2">
                <SkeletonBlock className="h-3.5 w-3/5" />
                <SkeletonBlock className="h-3 w-2/5" />
              </div>
            </div>
          ))}
        </div>
      ) : variant === "table" ? (
        <div className="space-y-px overflow-hidden rounded-field">
          <SkeletonBlock className="h-10 rounded-none opacity-70" />
          {range.map((i) => (
            <div key={i} className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 px-4 py-3.5">
              <SkeletonBlock className="h-3.5" />
              <SkeletonBlock className="h-3.5" />
              <SkeletonBlock className="h-3.5 w-3/4" />
              <SkeletonBlock className="h-3.5 w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {range.map((i) => (
            <SkeletonBlock key={i} className="h-4" style={{ width: `${92 - ((i * 17) % 40)}%` }} />
          ))}
        </div>
      )}
    </div>
  );
}
