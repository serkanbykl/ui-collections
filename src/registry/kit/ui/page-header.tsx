import type { ReactNode } from "react";

import { cn } from "@/registry/kit/lib/utils";

export interface PageHeaderProps {
  title: ReactNode;
  /** One line under the title: counts, scope or status. */
  description?: ReactNode;
  /** Buttons and controls on the right; they wrap under the title on small screens. */
  actions?: ReactNode;
  /** Small line above the title, e.g. a SKU or the section name. */
  eyebrow?: ReactNode;
  /** Leading visual beside the title, e.g. an avatar on a person's page. */
  media?: ReactNode;
  /**
   * Heading element. Defaults to h2 because an app shell's top bar usually
   * holds the page's h1; use h1 when the header is the page's main heading.
   */
  headingLevel?: "h1" | "h2" | "h3";
  /** Extra classes on the title, e.g. `tabular-nums`. */
  titleClassName?: string;
  className?: string;
  /** Rendered after the description, inside the title column (badges, meta rows). */
  children?: ReactNode;
}

/**
 * Title row at the top of an app page: a large title, a muted one-line
 * description and the page's actions on the right.
 */
export function PageHeader({
  title,
  description,
  actions,
  eyebrow,
  media,
  headingLevel: Heading = "h2",
  titleClassName,
  className,
  children,
}: PageHeaderProps) {
  return (
    <header className={cn("flex min-w-0 flex-wrap items-end justify-between gap-x-6 gap-y-4", className)}>
      <div className="flex min-w-0 max-w-full items-center gap-4">
        {media && <div className="shrink-0">{media}</div>}
        <div className="min-w-0">
          {eyebrow && <p className="mb-1 text-sm text-muted">{eyebrow}</p>}
          <Heading className={cn("text-2xl font-semibold tracking-tight text-balance break-words md:text-3xl", titleClassName)}>{title}</Heading>
          {description && <p className="mt-2 max-w-3xl text-muted">{description}</p>}
          {children}
        </div>
      </div>
      {actions && <div className="flex max-w-full flex-wrap items-center gap-2">{actions}</div>}
    </header>
  );
}
