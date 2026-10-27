"use client";

import { AnimatePresence, m } from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";

import { MotionScope } from "@/registry/kit/lib/motion";
import { cn } from "@/registry/kit/lib/utils";

export type IslandTone = "accent" | "success" | "warning" | "info" | "danger";

export interface IslandActivity {
  /** Changing it morphs the island to the new activity. */
  id: string;
  /** Read to screen readers when the activity starts, and names the island button. */
  label: string;
  /** Start of the compact pill, usually an icon. */
  leading?: React.ReactNode;
  /** A few words between the slots, such as the project name. Hidden on narrow screens. */
  caption?: React.ReactNode;
  /** End of the compact pill, usually a short value. Coloured in the tone. */
  trailing?: React.ReactNode;
  /** 0–1. Traces a rim around the island, clockwise from the top. */
  progress?: number;
  /** Colour of the rim, the glow under the island and the trailing value. */
  tone?: IslandTone;
  /** Detail shown when the island is opened. Without it the pill does not open. */
  expanded?: React.ReactNode;
}

export interface DynamicIslandProps {
  /** The live activity to show. `null` rests as the empty pill. */
  activity?: IslandActivity | null;
  /** Controlled open state. */
  expanded?: boolean;
  defaultExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  className?: string;
}

type View = "idle" | "compact" | "expanded";

const spring = { type: "spring", stiffness: 420, damping: 32, mass: 0.9 } as const;
const radius: Record<View, number> = { idle: 18, compact: 18, expanded: 34 };

/**
 * A pill that grows around live activity, after the iPhone's Dynamic Island:
 * empty at rest, a compact status line while something runs, and a rounded
 * sheet with detail when tapped. The box springs to the measured size of
 * whatever is inside it. Unlike the phone it has no camera to dodge, so the
 * middle carries a caption; progress traces a rim around the edge and the
 * activity's tone glows underneath. It sits in a `data-mode="dark"` subtree on
 * the theme's deepest background, so it is dark in every theme. Escape or a
 * tap outside folds it back.
 */
export function DynamicIsland({
  activity = null,
  expanded: expandedProp,
  defaultExpanded = false,
  onExpandedChange,
  className,
}: DynamicIslandProps) {
  const [internal, setInternal] = useState(defaultExpanded);
  const open = expandedProp ?? internal;
  const view: View = !activity ? "idle" : open && activity.expanded ? "expanded" : "compact";

  const rootRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);

  function setOpen(next: boolean) {
    setInternal(next);
    onExpandedChange?.(next);
  }

  // Follow the content's own size, so the box springs to whatever is inside.
  const contentKey = `${view}-${activity?.id ?? "none"}`;
  useLayoutEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const measure = () => setSize({ width: el.offsetWidth, height: el.offsetHeight });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [contentKey]);

  useEffect(() => {
    if (view !== "expanded") return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointer);
    };
    // setOpen only reads the latest props; re-binding per render is not needed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view]);

  return (
    <MotionScope>
      {/* Only the pill takes pointer events, so a full-width fixed wrapper never blocks the page. */}
      <div ref={rootRef} className={cn("pointer-events-none flex justify-center", className)}>
        <m.div
          data-mode="dark"
          initial={false}
          animate={size ? { ...size, borderRadius: radius[view] } : { borderRadius: radius[view] }}
          transition={spring}
          style={{ "--tone": `var(--color-${activity?.tone ?? "accent"})` } as CSSProperties}
          className={cn(
            // Opaque on purpose: a translucent raised surface turns grey over a light page.
            "pointer-events-auto relative overflow-hidden border border-line bg-bg-deep text-fg transition-shadow duration-500",
            activity
              ? "shadow-[0_12px_30px_-14px_color-mix(in_oklab,var(--tone)_40%,transparent)]"
              : "shadow-[0_10px_30px_-14px_rgb(0_0_0/0.6)]",
          )}
        >
          {activity?.progress !== undefined && (
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] p-[1.5px] [mask:linear-gradient(#000_0_0)_content-box_exclude,linear-gradient(#000_0_0)]"
              style={{
                background: `conic-gradient(var(--tone) ${Math.min(1, Math.max(0, activity.progress)) * 360}deg, color-mix(in oklab, var(--tone) 14%, transparent) 0)`,
              }}
            />
          )}
          <AnimatePresence mode="popLayout" initial={false}>
            <m.div
              key={contentKey}
              ref={contentRef}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1, transition: { delay: 0.06, duration: 0.25 } }}
              exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.12 } }}
              className="w-max origin-top"
            >
              {view === "idle" && <div aria-hidden className="h-9 w-30" />}

              {view === "compact" && activity && (
                <button
                  type="button"
                  aria-label={activity.label}
                  aria-expanded={activity.expanded ? false : undefined}
                  disabled={!activity.expanded}
                  onClick={() => setOpen(true)}
                  className="flex h-9 min-w-30 cursor-pointer items-center gap-3 rounded-full px-2.5 text-xs font-medium tabular-nums outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-inset disabled:cursor-default"
                >
                  <span className="flex min-w-5 items-center [&>svg]:size-5">{activity.leading}</span>
                  <span className="max-w-40 flex-1 truncate text-center text-muted max-sm:hidden">{activity.caption}</span>
                  <span className="ms-auto flex min-w-5 items-center justify-end text-(--tone) [&>svg]:size-5">{activity.trailing}</span>
                </button>
              )}

              {view === "expanded" && activity && (
                <div
                  role="region"
                  aria-label={activity.label}
                  className="w-[min(22rem,calc(100vw-2rem))] p-5 text-sm"
                >
                  {activity.expanded}
                </div>
              )}
            </m.div>
          </AnimatePresence>
        </m.div>
        <span className="sr-only" aria-live="polite">
          {activity?.label}
        </span>
      </div>
    </MotionScope>
  );
}
