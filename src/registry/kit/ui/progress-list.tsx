import { cn } from "@/registry/kit/lib/utils";
import { Badge } from "@/registry/kit/ui/badge";
import { Progress, type ProgressTone } from "@/registry/kit/ui/progress";

export type { ProgressTone };

export interface ProgressItem {
  id: string;
  label: string;
  /** Secondary line under the label. */
  meta?: string;
  /** Ratio from 0 to 1. */
  value: number;
  tone?: ProgressTone;
  /** Turns the label into a link. */
  href?: string;
}

export interface ProgressListProps {
  items: ProgressItem[];
  /** Show 1, 2, 3… before each row. */
  ranked?: boolean;
  className?: string;
}

const percent = new Intl.NumberFormat("en-US", { style: "percent", maximumFractionDigits: 0 });

/** Labelled rows with a percentage chip and a gradient bar that grows in. Works as a Server Component. */
export function ProgressList({ items, ranked = false, className }: ProgressListProps) {
  return (
    <ul className={cn("flex flex-col gap-4", className)}>
      {items.map((item, index) => {
        const tone = item.tone ?? "accent";
        const value = Math.min(Math.max(item.value, 0), 1);
        return (
          <li key={item.id} className="flex items-center gap-3">
            {ranked && (
              <span aria-hidden className="grid size-8 shrink-0 place-items-center rounded-field bg-fg/[0.06] font-mono text-xs text-muted">
                {index + 1}
              </span>
            )}
            <div className="min-w-0 flex-1 space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  {item.href ? (
                    <a
                      href={item.href}
                      className="block truncate rounded-sm text-sm font-medium outline-none hover:text-accent focus-visible:outline-2 focus-visible:outline-accent"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <p className="truncate text-sm font-medium">{item.label}</p>
                  )}
                  {item.meta && <p className="truncate text-xs text-muted">{item.meta}</p>}
                </div>
                <Badge variant={tone} className="shrink-0 px-2 tabular-nums">
                  {percent.format(value)}
                </Badge>
              </div>
              <Progress
                aria-label={item.label}
                value={Math.round(value * 100)}
                tone={tone}
                className="h-1.5 bg-fg/[0.08] shadow-none"
                indicatorClassName="duration-1000"
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
