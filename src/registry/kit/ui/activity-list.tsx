import { cn } from "@/registry/kit/lib/utils";
import { Avatar } from "@/registry/kit/ui/avatar";

export type ActivityTone = "accent" | "success" | "warning" | "info" | "danger" | "neutral";

const toneClass: Record<ActivityTone, string> = {
  accent: "bg-accent/15 text-accent",
  success: "bg-success/15 text-success",
  warning: "bg-warning/15 text-warning",
  info: "bg-info/15 text-info",
  danger: "bg-danger/15 text-danger",
  neutral: "bg-fg/10 text-fg/80",
};

export interface ActivityItem {
  id: string;
  /** Who did it. Their initials fill the avatar. */
  actor: string;
  /** What happened, e.g. "deployed". */
  action: string;
  /** What it happened to, e.g. "api@a41c9e". */
  target?: string;
  /** Human time, e.g. "12 min ago". */
  time: string;
  /** Machine-readable time for the <time> element. */
  dateTime?: string;
  tone?: ActivityTone;
}

/** A vertical timeline of who did what. Works as a Server Component. */
export function ActivityList({ items, className }: { items: ActivityItem[]; className?: string }) {
  return (
    <ol className={cn("flex flex-col gap-5", className)}>
      {items.map((item, index) => (
        <li key={item.id} className="relative flex gap-3.5">
          {index < items.length - 1 && (
            <span aria-hidden className="absolute top-10 -bottom-5 left-[17px] w-px bg-gradient-to-b from-fg/15 to-fg/[0.03]" />
          )}
          <Avatar aria-hidden alt={item.actor} className="size-9 ring-fg/10" fallbackClassName={cn("bg-none shadow-none", toneClass[item.tone ?? "neutral"])} />
          <div className="min-w-0 flex-1 pt-0.5">
            <p className="text-sm leading-snug text-muted">
              <span className="font-medium text-fg">{item.actor}</span> {item.action}
              {item.target && (
                <>
                  {" "}
                  <span className="font-medium text-fg/90">{item.target}</span>
                </>
              )}
            </p>
            <time dateTime={item.dateTime} className="mt-0.5 block text-xs text-muted/70">
              {item.time}
            </time>
          </div>
        </li>
      ))}
    </ol>
  );
}
