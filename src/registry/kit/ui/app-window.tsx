import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/registry/kit/lib/utils";

export interface AppWindowProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** Text in the address pill, e.g. "app.lumen.example/polaris". Omit for a plain title bar. */
  url?: string;
  /** Shown instead of the address pill, e.g. a file name. */
  title?: ReactNode;
  /** Controls on the right of the title bar. */
  actions?: ReactNode;
  /** Classes for the content area under the title bar. */
  bodyClassName?: string;
}

/**
 * A desktop-app frame for product previews: traffic-light dots, an address
 * pill or title, optional actions and your content. It is a frame, not a
 * scroller: put long content in an inner element that scrolls.
 */
export function AppWindow({ url, title, actions, bodyClassName, className, children, ...props }: AppWindowProps) {
  return (
    <div
      className={cn("surface relative isolate flex min-w-0 flex-col overflow-hidden rounded-card text-left text-fg", className)}
      {...props}
    >
      <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border-b border-line px-3.5 py-2.5">
        <span aria-hidden className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-danger/70" />
          <span className="size-2.5 rounded-full bg-warning/70" />
          <span className="size-2.5 rounded-full bg-success/70" />
        </span>
        <div className="flex min-w-0 justify-center">
          {url ? (
            <span className="surface-field flex h-7 max-w-full min-w-0 items-center gap-1.5 rounded-control px-3 text-xs text-muted sm:min-w-56">
              <svg aria-hidden viewBox="0 0 24 24" className="size-3 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.2">
                <rect x="5" y="11" width="14" height="10" rx="2" />
                <path d="M8 11V8a4 4 0 0 1 8 0v3" />
              </svg>
              <span className="truncate">{url}</span>
            </span>
          ) : (
            title && <span className="truncate text-xs font-medium text-muted">{title}</span>
          )}
        </div>
        <div className="flex min-w-[2.75rem] items-center justify-end gap-2">{actions}</div>
      </div>
      <div className={cn("min-w-0 flex-1", bodyClassName)}>{children}</div>
    </div>
  );
}
