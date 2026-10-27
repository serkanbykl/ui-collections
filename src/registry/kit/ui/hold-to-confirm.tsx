"use client";

import { useEffect, useState, type CSSProperties, type KeyboardEvent, type TransitionEvent } from "react";

import { cn } from "@/registry/kit/lib/utils";

export interface HoldToConfirmProps {
  /** Called once the hold completes. */
  onConfirm: () => void;
  /** Milliseconds the button must be held. */
  duration?: number;
  children: React.ReactNode;
  /** Shown briefly after confirming. */
  confirmedLabel?: React.ReactNode;
  tone?: "danger" | "neutral";
  className?: string;
}

/**
 * A destructive action that needs a deliberate press: hold with pointer,
 * Space or Enter while a fill sweeps across. Letting go early drains it.
 * The fill is a CSS transition; completion is its `transitionend`.
 */
export function HoldToConfirm({
  onConfirm,
  duration = 1200,
  children,
  confirmedLabel = "Done",
  tone = "danger",
  className,
}: HoldToConfirmProps) {
  const [phase, setPhase] = useState<"idle" | "holding" | "done">("idle");

  useEffect(() => {
    if (phase !== "done") return;
    const timer = setTimeout(() => setPhase("idle"), 1600);
    return () => clearTimeout(timer);
  }, [phase]);

  const start = () => phase === "idle" && setPhase("holding");
  const release = () => phase === "holding" && setPhase("idle");

  function onTransitionEnd(event: TransitionEvent<HTMLSpanElement>) {
    if (event.propertyName !== "transform" || phase !== "holding") return;
    setPhase("done");
    onConfirm();
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if ((event.key === " " || event.key === "Enter") && !event.repeat) {
      event.preventDefault();
      start();
    }
  }

  function onKeyUp(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === " " || event.key === "Enter") release();
  }

  return (
    <button
      type="button"
      data-phase={phase}
      onPointerDown={(e) => e.button === 0 && start()}
      onPointerUp={release}
      onPointerLeave={release}
      onPointerCancel={release}
      onKeyDown={onKeyDown}
      onKeyUp={onKeyUp}
      onContextMenu={(e) => e.preventDefault()}
      style={{ "--hold": `${duration}ms` } as CSSProperties}
      className={cn(
        "surface group/hold relative inline-flex h-12 cursor-pointer items-center justify-center overflow-hidden rounded-control px-7 text-sm font-medium select-none [touch-action:manipulation]",
        "transition-transform duration-300 ease-theme active:scale-(--press-scale)",
        "outline-none focus-visible:ring-2 focus-visible:ring-accent/60",
        className,
      )}
    >
      <span
        aria-hidden
        onTransitionEnd={onTransitionEnd}
        className={cn(
          "absolute inset-0 origin-left scale-x-0",
          tone === "danger" ? "bg-danger/35" : "bg-accent/30",
          // Fill slowly and linearly while held; drain quickly on release.
          "transition-transform duration-300 ease-out",
          "group-data-[phase=holding]/hold:scale-x-100 group-data-[phase=holding]/hold:duration-(--hold) group-data-[phase=holding]/hold:ease-linear",
          "group-data-[phase=done]/hold:scale-x-100",
        )}
      />
      <span className="relative grid">
        <span className="col-start-1 row-start-1 transition-opacity duration-300 group-data-[phase=done]/hold:opacity-0">
          {children}
        </span>
        <span
          aria-hidden={phase !== "done"}
          className="col-start-1 row-start-1 text-center opacity-0 transition-opacity duration-300 group-data-[phase=done]/hold:opacity-100"
        >
          {confirmedLabel}
        </span>
      </span>
      <span role="status" className="sr-only">
        {phase === "done" ? "Confirmed" : ""}
      </span>
    </button>
  );
}
