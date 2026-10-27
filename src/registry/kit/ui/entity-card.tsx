import { cn } from "@/registry/kit/lib/utils";

export interface EntityCardProps {
  /** Top area: a preview, gradient or image. */
  cover?: React.ReactNode;
  /** Leading tile beside the title, used instead of a cover. */
  media?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  /** Makes the title a link; the whole card stays one tab stop. */
  href?: string;
  /** Makes the title a button instead, for opening the item in place (a drawer, a selection). */
  onOpen?: () => void;
  /** Badges or chips under the title. */
  badges?: React.ReactNode;
  /** Overflow menu or buttons in the top-right corner. */
  actions?: React.ReactNode;
  selected?: boolean;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

/** One card frame for every collection, so grids of projects, people or files share anatomy, spacing and hover. */
// Stretched over the card so the whole card is one target, still one tab stop.
const stretched =
  "rounded-md outline-none after:absolute after:inset-0 after:rounded-[inherit] hover:[&>span]:text-accent focus-visible:outline-2 focus-visible:outline-accent";

export function EntityCard({
  cover,
  media,
  title,
  subtitle,
  href,
  onOpen,
  badges,
  actions,
  selected = false,
  children,
  footer,
  className,
}: EntityCardProps) {
  const heading = <span className="line-clamp-2 text-[15px] leading-snug font-medium break-words text-fg">{title}</span>;
  return (
    <article
      className={cn(
        "group/card surface relative flex h-full flex-col overflow-hidden rounded-card transition-[translate,background-color,outline-color] duration-300 ease-theme hover:-translate-y-0.5",
        "outline-1 -outline-offset-1 outline-transparent",
        selected && "bg-surface-selected outline-accent/60",
        className,
      )}
    >
      {cover && <div className="relative">{cover}</div>}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start gap-3">
          {media}
          <div className="min-w-0 flex-1">
            {href ? (
              <a href={href} className={stretched}>
                {heading}
              </a>
            ) : onOpen ? (
              <button type="button" onClick={onOpen} aria-pressed={selected} className={cn(stretched, "cursor-pointer text-left")}>
                {heading}
              </button>
            ) : (
              heading
            )}
            {subtitle && <p className="mt-0.5 truncate text-xs text-muted">{subtitle}</p>}
          </div>
          {/* Above the stretched link so its buttons stay clickable. */}
          {actions && <div className="relative z-10 -mt-1 -mr-1.5 shrink-0">{actions}</div>}
        </div>
        {badges && <div className="flex flex-wrap items-center gap-1.5">{badges}</div>}
        {children}
      </div>
      {footer && <div className="border-t border-fg/[0.07] bg-fg/[0.02] px-5 py-3">{footer}</div>}
    </article>
  );
}

/** Small stat boxes inside an EntityCard: label and value, two to four across. */
export function EntityCardStats({
  items,
  className,
}: {
  items: { label: string; value: React.ReactNode }[];
  className?: string;
}) {
  return (
    <dl className={cn("grid auto-cols-fr grid-flow-col gap-2", className)}>
      {items.map((item) => (
        <div key={item.label} className="flex min-w-0 flex-col-reverse gap-0.5 rounded-field bg-fg/[0.04] px-3 py-2">
          <dt className="truncate text-[11px] text-muted">{item.label}</dt>
          <dd className="truncate text-sm font-medium tabular-nums">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
