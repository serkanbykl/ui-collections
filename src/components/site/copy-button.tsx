"use client";

import { useEffect, useState } from "react";

import { cn } from "@/registry/kit/lib/utils";

export function CopyButton({ value, className }: { value: string; className?: string }) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");
  const copied = status === "copied";

  useEffect(() => {
    if (status === "idle") return;
    const timer = setTimeout(() => setStatus("idle"), 1600);
    return () => clearTimeout(timer);
  }, [status]);

  return (
    <button
      type="button"
      aria-label="Copy to clipboard"
      title={status === "failed" ? "Couldn't copy. Select the text and copy it instead." : "Copy to clipboard"}
      onClick={() =>
        navigator.clipboard.writeText(value).then(
          () => setStatus("copied"),
          () => setStatus("failed"),
        )
      }
      className={cn(
        "grid size-8 shrink-0 cursor-pointer place-items-center rounded-control text-muted transition-colors hover:bg-fg/5 hover:text-fg",
        className,
      )}
    >
      <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        {copied ? (
          <path d="M5 12.5l4.5 4.5L19 7.5" stroke="var(--color-accent)" />
        ) : (
          <>
            <rect x="9" y="9" width="11" height="11" rx="2.5" />
            <path d="M15 9V6.5A2.5 2.5 0 0 0 12.5 4h-6A2.5 2.5 0 0 0 4 6.5v6A2.5 2.5 0 0 0 6.5 15H9" />
          </>
        )}
      </svg>
      <span role="status" className="sr-only">
        {copied ? "Copied" : status === "failed" ? "Couldn't copy. Select the text and copy it instead." : ""}
      </span>
    </button>
  );
}
