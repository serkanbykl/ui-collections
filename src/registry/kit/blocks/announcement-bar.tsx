"use client";

import { useState } from "react";

import { cn } from "@/registry/kit/lib/utils";
import { Badge } from "@/registry/kit/ui/badge";
import { Button } from "@/registry/kit/ui/button";

export interface AnnouncementBarProps {
  label?: string;
  message?: string;
  link?: { label: string; href: string };
  dismissible?: boolean;
  className?: string;
}

export function AnnouncementBar({
  label = "New",
  message = "Instant rollback is now available on every plan.",
  link = { label: "Read the release notes", href: "/changelog" },
  dismissible = true,
  className,
}: AnnouncementBarProps) {
  const [open, setOpen] = useState(true);

  return (
    <div
      className={cn(
        "grid bg-bg-deep text-fg transition-[grid-template-rows,opacity] duration-500 ease-theme",
        open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        className,
      )}
      inert={!open}
    >
      <div className="overflow-hidden">
        <div className="p-3">
          <div role="region" aria-label="Announcement" className="surface mx-auto flex max-w-5xl items-center gap-3 rounded-control py-2 pr-2 pl-2 text-sm">
            <Badge variant="accent-solid" className="shrink-0">
              {label}
            </Badge>
            <p className="min-w-0 flex-1 truncate text-fg/85">
              {message}{" "}
              <a href={link.href} className="hidden text-accent underline-offset-4 hover:underline sm:inline">
                {link.label} →
              </a>
            </p>
            {dismissible && (
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Dismiss announcement"
                onClick={() => setOpen(false)}
                className="shrink-0 rounded-full"
              >
                <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
                </svg>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
