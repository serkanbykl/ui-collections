"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/registry/kit/lib/utils";
import { buttonVariants } from "@/registry/kit/ui/button";

export interface CopyButtonProps {
  /** Text written to the clipboard. */
  value: string;
  /** Visible label before copying. */
  label?: string;
  /** Visible label for two seconds after copying. */
  copiedLabel?: string;
  /** Hide the text and show only the icon; the label stays the accessible name. */
  iconOnly?: boolean;
  variant?: "surface" | "ghost";
  className?: string;
  /** Called after a successful copy. */
  onCopy?: (value: string) => void;
}

const copyIcon = (
  <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="12" height="12" rx="2" />
    <path d="M5 15V5a2 2 0 0 1 2-2h10" />
  </svg>
);

const checkIcon = (
  <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="m5 12.5 4.5 4.5L19 7" />
  </svg>
);

/**
 * Copies a value and confirms in place ("Copied") for two seconds, announced
 * to screen readers. If the clipboard is blocked it says so instead.
 */
export function CopyButton({
  value,
  label = "Copy",
  copiedLabel = "Copied",
  iconOnly = false,
  variant = "surface",
  className,
  onCopy,
}: CopyButtonProps) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setState("copied");
      onCopy?.(value);
    } catch {
      setState("failed");
    }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setState("idle"), 2000);
  }

  const text = state === "copied" ? copiedLabel : state === "failed" ? "Select and copy" : label;

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={iconOnly ? text : undefined}
      className={cn(
        buttonVariants({ variant, size: iconOnly ? "icon-sm" : "sm" }),
        !iconOnly && "h-8 gap-1.5 px-3 text-xs",
        "[&_svg]:size-3.5",
        state === "copied" && "text-success hover:text-success",
        className,
      )}
    >
      {state === "copied" ? checkIcon : copyIcon}
      {!iconOnly && <span>{text}</span>}
      <span aria-live="polite" className="sr-only">
        {state === "copied" ? "Copied to clipboard" : state === "failed" ? "Copy failed. Select the text and copy it manually." : ""}
      </span>
    </button>
  );
}
