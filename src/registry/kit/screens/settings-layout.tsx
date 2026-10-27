import { cn } from "@/registry/kit/lib/utils";
import { PageHeader } from "@/registry/kit/ui/page-header";

export type SettingsPage = "general" | "security" | "notifications" | "billing" | "api" | "connections";

export interface SettingsLink {
  id: SettingsPage | (string & {});
  label: string;
  href: string;
}

export const defaultSettingsLinks: SettingsLink[] = [
  { id: "general", label: "General", href: "#/app/settings" },
  { id: "security", label: "Security", href: "#/app/settings/security" },
  { id: "notifications", label: "Notifications", href: "#/app/settings/notifications" },
  { id: "billing", label: "Billing", href: "#/app/settings/billing" },
  { id: "api", label: "API & webhooks", href: "#/app/settings/api" },
  { id: "connections", label: "Connections", href: "#/app/settings/connections" },
];

export interface SettingsLayoutProps {
  /** Id of the current page in `links`. */
  active: string;
  title: string;
  /** One line under the title: what's set up, counts or status. */
  description?: React.ReactNode;
  links?: SettingsLink[];
  /** Buttons beside the title. */
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

/**
 * Frame shared by every settings page: a title, the section menu (a scrolling
 * row on small screens, a sticky column from `lg`) and the page's sections.
 */
export function SettingsLayout({
  active,
  title,
  description,
  links = defaultSettingsLinks,
  actions,
  children,
  className,
}: SettingsLayoutProps) {
  return (
    <div className={cn("grid min-w-0 grid-cols-1 gap-6", className)}>
      <PageHeader title={title} description={description} actions={actions} />

      <div className="grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-[12.5rem_minmax(0,1fr)] lg:gap-8">
        <nav aria-label="Settings" className="min-w-0 lg:sticky lg:top-24 lg:self-start">
          <ul className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0">
            {links.map((link) => {
              const current = link.id === active;
              return (
                <li key={link.id} className="shrink-0">
                  <a
                    href={link.href}
                    aria-current={current ? "page" : undefined}
                    className={cn(
                      "block rounded-control px-3.5 py-2 text-sm whitespace-nowrap outline-none transition-colors duration-200",
                      "focus-visible:outline-2 focus-visible:outline-accent",
                      current ? "bg-surface-selected font-medium text-fg" : "text-muted hover:bg-surface-hover hover:text-fg",
                    )}
                  >
                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="grid min-w-0 grid-cols-1 content-start gap-6">{children}</div>
      </div>
    </div>
  );
}

export interface SettingsSectionProps {
  title: string;
  description?: React.ReactNode;
  /** Controls in the section's header row, e.g. a status badge or a button. */
  aside?: React.ReactNode;
  /** Bottom row, usually the save button. */
  footer?: React.ReactNode;
  /** `danger` outlines the section for destructive actions. */
  tone?: "default" | "danger";
  children?: React.ReactNode;
  className?: string;
}

/** One card of settings: a header, its fields and an optional footer row. */
export function SettingsSection({ title, description, aside, footer, tone = "default", children, className }: SettingsSectionProps) {
  return (
    <section
      className={cn(
        "surface min-w-0 rounded-card",
        tone === "danger" && "outline-[1.5px] -outline-offset-[1.5px] outline-danger/45",
        className,
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3 p-5 md:p-6">
        <div className="min-w-0 flex-1 basis-60">
          <h3 className={cn("text-base font-semibold", tone === "danger" && "text-danger")}>{title}</h3>
          {description && <p className="mt-1 text-sm text-muted">{description}</p>}
        </div>
        {aside && <div className="flex shrink-0 flex-wrap items-center gap-2">{aside}</div>}
      </div>
      {children && <div className="min-w-0 px-5 pb-5 md:px-6 md:pb-6">{children}</div>}
      {footer && (
        <div className="flex flex-wrap items-center justify-end gap-3 border-t border-line px-5 py-4 md:px-6">{footer}</div>
      )}
    </section>
  );
}
