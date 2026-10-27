"use client";

import { useState, type ReactNode } from "react";

import { cn } from "@/registry/kit/lib/utils";
import { Button } from "@/registry/kit/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/registry/kit/ui/popover";

export type NotificationTone = "accent" | "success" | "warning" | "danger" | "info";

export interface NotificationItem {
  id: string;
  title: string;
  detail?: string;
  /** Relative time, e.g. "12 min ago". */
  time?: string;
  tone?: NotificationTone;
  read?: boolean;
  /** Where the notification leads; it is marked read on click. */
  href?: string;
}

export interface NotificationBellProps {
  items: NotificationItem[];
  /** Called with the next list whenever items are read. */
  onItemsChange?: (items: NotificationItem[]) => void;
  /** `icon` for top bars; `chip` shows "3 new" beside the bell for navbars with room. */
  variant?: "icon" | "chip";
  /** Footer link to a full notifications page. */
  viewAllHref?: string;
  align?: "start" | "center" | "end";
  className?: string;
}

const toneDot: Record<NotificationTone, string> = {
  accent: "bg-accent",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  info: "bg-info",
};

const bell = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M18 9a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0" />
  </svg>
);

/**
 * Bell with an unread count and a popover list: unread rows carry a tone dot,
 * opening a row marks it read, "Mark all as read" clears the count, and an
 * empty inbox says so. Works uncontrolled from `items`, or controlled through
 * `onItemsChange`.
 */
export function NotificationBell({ items: initial, onItemsChange, variant = "icon", viewAllHref, align = "end", className }: NotificationBellProps) {
  const [items, setItems] = useState(initial);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [open, setOpen] = useState(false);
  const unread = items.filter((n) => !n.read).length;
  const shown = filter === "unread" ? items.filter((n) => !n.read) : items;
  const count = unread > 9 ? "9+" : String(unread);

  function update(next: NotificationItem[]) {
    setItems(next);
    onItemsChange?.(next);
  }

  const label = unread ? `Notifications, ${unread} unread` : "Notifications";
  let trigger: ReactNode;
  if (variant === "chip") {
    trigger = (
      <button
        type="button"
        aria-label={label}
        className={cn(
          "surface inline-flex h-9 cursor-pointer items-center gap-2 rounded-control px-3 text-[13px] font-medium transition-[scale,color] duration-200 ease-theme",
          "hover:text-fg active:scale-(--press-scale) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent [&_svg]:size-4",
          unread ? "text-fg" : "text-muted",
          className,
        )}
      >
        <span className={cn("relative", unread && "motion-safe:[&_svg]:origin-top motion-safe:[&_svg]:animate-[bell-ring_0.9s_var(--e-theme)_1]")}>{bell}</span>
        {unread ? (
          <>
            <span className="tabular-nums">{count} new</span>
            <span aria-hidden className="size-1.5 rounded-full bg-accent" />
          </>
        ) : (
          <span>All caught up</span>
        )}
      </button>
    );
  } else {
    trigger = (
      <Button variant="ghost" size="icon" aria-label={label} className={cn("relative size-10 [&_svg]:size-5", className)}>
        {bell}
        {unread > 0 && (
          <span
            aria-hidden
            className="absolute top-1 right-1 grid h-4 min-w-4 animate-pop-in place-items-center rounded-full bg-accent px-1 text-[10px] leading-none font-semibold text-accent-fg tabular-nums ring-2 ring-bg"
          >
            {count}
          </span>
        )}
      </Button>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent align={align} className="w-[22rem] max-w-[calc(100vw-2rem)] p-0">
        <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
          <p className="font-medium">
            Notifications
            {unread > 0 && <span className="ml-1.5 text-sm font-normal text-muted tabular-nums">· {unread} unread</span>}
          </p>
          <button
            type="button"
            disabled={!unread}
            onClick={() => update(items.map((n) => ({ ...n, read: true })))}
            className="cursor-pointer rounded-control text-xs text-accent underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-accent disabled:cursor-default disabled:text-subtle disabled:no-underline"
          >
            Mark all as read
          </button>
        </div>
        <div role="group" aria-label="Show" className="flex gap-1 px-3 pt-2">
          {(["all", "unread"] as const).map((f) => (
            <button
              key={f}
              type="button"
              aria-pressed={filter === f}
              onClick={() => setFilter(f)}
              className={cn(
                "cursor-pointer rounded-control px-2.5 py-1 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-accent",
                filter === f ? "bg-surface-selected text-fg" : "text-muted hover:bg-surface-hover hover:text-fg",
              )}
            >
              {f === "all" ? "All" : `Unread${unread ? ` (${unread})` : ""}`}
            </button>
          ))}
        </div>
        {shown.length ? (
          <ul className="grid max-h-[min(24rem,60dvh)] gap-0.5 overflow-y-auto overscroll-contain p-2">
            {shown.map((n) => {
              const body = (
                <>
                  <span aria-hidden className={cn("mt-1.5 size-2 shrink-0 rounded-full", n.read ? "bg-transparent" : toneDot[n.tone ?? "accent"])} />
                  <span className="min-w-0 flex-1">
                    <span className={cn("block text-sm", !n.read && "font-medium")}>{n.title}</span>
                    {n.detail && <span className="mt-0.5 block text-xs text-muted">{n.detail}</span>}
                    {n.time && <span className="mt-1 block text-[11px] text-subtle">{n.time}</span>}
                  </span>
                  {!n.read && <span className="sr-only">Unread</span>}
                </>
              );
              const markRead = () => update(items.map((x) => (x.id === n.id ? { ...x, read: true } : x)));
              const rowClass =
                "flex w-full gap-3 rounded-field px-2 py-2.5 text-left transition-colors hover:bg-surface-hover focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent";
              return (
                <li key={n.id}>
                  {n.href ? (
                    <a
                      href={n.href}
                      onClick={() => {
                        markRead();
                        // Hash and client-side routes keep the bell mounted, so close it on the way out.
                        setOpen(false);
                      }}
                      className={rowClass}
                    >
                      {body}
                    </a>
                  ) : (
                    <button type="button" onClick={markRead} className={cn(rowClass, "cursor-pointer")}>
                      {body}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="grid place-items-center gap-1 px-6 py-10 text-center">
            <span aria-hidden className="mb-2 grid size-10 place-items-center rounded-full bg-fg/[0.06] text-muted [&_svg]:size-5">
              {bell}
            </span>
            <p className="text-sm font-medium">{filter === "unread" ? "You're all caught up" : "No notifications yet"}</p>
            <p className="text-xs text-muted">{filter === "unread" ? "New activity shows up here as it happens." : "Mentions, invites and alerts will land here."}</p>
          </div>
        )}
        {viewAllHref && (
          <div className="border-t border-line p-2">
            <a
              href={viewAllHref}
              onClick={() => setOpen(false)}
              className="block rounded-field px-2 py-2 text-center text-sm text-accent transition-colors hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-accent"
            >
              View all notifications
            </a>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
