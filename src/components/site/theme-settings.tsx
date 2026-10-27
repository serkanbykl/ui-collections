"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

import { getCollection } from "@/collections";
import { appliedKey, valuesKey } from "@/lib/theme-storage";
import { cn } from "@/registry/kit/lib/utils";
import {
  applyTuner,
  defaultValues,
  ThemeTuner,
  tunerProps,
  tunerSnippet,
  type TunerValues,
} from "@/registry/kit/ui/theme-tuner";

import { CopyButton } from "./copy-button";

/*
 * Per-visitor theme dials, one stored set per collection. Every document on
 * the origin (the page and its preview iframes) follows changes live through
 * the `storage` event. The resolved attributes are stored too, so the boot
 * script in <head> can apply them before first paint.
 */
const listeners = new Set<() => void>();
const cache = new Map<string, TunerValues>();

const controlsOf = (collection: string) => getCollection(collection).tuner.controls;

function read(collection: string) {
  const hit = cache.get(collection);
  if (hit) return hit;
  let stored = defaultValues(controlsOf(collection));
  try {
    const raw = localStorage.getItem(valuesKey(collection));
    if (raw) stored = { ...stored, ...JSON.parse(raw) };
  } catch {
    // Storage blocked or corrupt: keep defaults.
  }
  cache.set(collection, stored);
  return stored;
}

function write(collection: string, values: TunerValues) {
  cache.set(collection, values);
  try {
    localStorage.setItem(valuesKey(collection), JSON.stringify(values));
    localStorage.setItem(appliedKey(collection), JSON.stringify(tunerProps(controlsOf(collection), values)));
  } catch {
    // Storage blocked: settings last for this page view only.
  }
  listeners.forEach((notify) => notify());
}

function subscribe(notify: () => void) {
  listeners.add(notify);
  const onStorage = (e: StorageEvent) => {
    if (!e.key?.startsWith("theme:")) return;
    cache.clear();
    notify();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(notify);
    window.removeEventListener("storage", onStorage);
  };
}

export function useThemeValues(collection: string) {
  const defaults = useRef(defaultValues(controlsOf(collection))).current;
  const values = useSyncExternalStore(subscribe, () => read(collection), () => defaults);
  return [values, (next: TunerValues) => write(collection, next)] as const;
}

/** Mirrors the stored dials onto <html>. Mount once per document. */
export function ThemeRoot({ collection }: { collection: string }) {
  const [values] = useThemeValues(collection);
  useEffect(() => applyTuner(document.documentElement, controlsOf(collection), values), [collection, values]);
  return null;
}

/** Inline tuner with a live, copyable snippet. */
export function ThemePanel({ collection, className }: { collection: string; className?: string }) {
  const [values, setValues] = useThemeValues(collection);
  const controls = controlsOf(collection);
  const snippet = tunerSnippet(controls, values);
  return (
    <div className={cn("grid min-w-0 gap-6", className)}>
      <ThemeTuner controls={controls} value={values} onChange={setValues} />
      <div className="min-w-0 rounded-field border border-line bg-bg-deep/60">
        <div className="flex items-center justify-between border-b border-line py-1 pr-1.5 pl-4">
          <span className="font-mono text-xs text-muted">theme</span>
          <CopyButton value={snippet} />
        </div>
        <pre className="overflow-x-auto px-4 py-3 font-mono text-xs leading-relaxed text-fg/80">{snippet}</pre>
      </div>
    </div>
  );
}

/** Floating button that opens the tuner from any page. */
const openEvent = "theme-dock:open";

/** Opens the floating tuner from anywhere on the page, e.g. a "Make it yours" card. */
export function openThemeDock() {
  window.dispatchEvent(new Event(openEvent));
}

export function ThemeDock({ collection }: { collection: string }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const title = getCollection(collection).tuner.title;

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener(openEvent, onOpen);
    return () => window.removeEventListener(openEvent, onOpen);
  }, []);

  useEffect(() => {
    if (!open) return;
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
  }, [open]);

  return (
    // The wrapper keeps the closed panel's height, so it must not take clicks itself.
    <div
      ref={rootRef}
      className="pointer-events-none fixed right-4 bottom-4 z-50 flex flex-col items-end gap-3 md:right-6 md:bottom-6"
    >
      {/* The surface must not scroll: glass draws its rim with ::before. */}
      <div
        id="theme-dock-panel"
        role="dialog"
        aria-label={`${title} settings`}
        inert={!open}
        className={cn(
          "surface-raised flex max-h-[calc(100dvh-7rem)] w-[min(20rem,calc(100vw-2rem))] origin-bottom-right flex-col overflow-hidden rounded-card",
          "transition-[opacity,scale,translate] duration-300 ease-theme",
          open ? "pointer-events-auto scale-100 opacity-100" : "translate-y-2 scale-95 opacity-0",
        )}
      >
        <div className="flex items-baseline justify-between px-5 pt-5 pb-4">
          <h2 className="font-display text-2xl">{title}</h2>
          <span className="text-xs text-muted">Applies site-wide</span>
        </div>
        <div className="min-h-0 overflow-y-auto overscroll-contain px-5 pb-5 [scrollbar-width:thin]">
          <ThemePanel collection={collection} />
        </div>
      </div>
      <button
        type="button"
        aria-expanded={open}
        aria-controls="theme-dock-panel"
        onClick={() => setOpen((v) => !v)}
        className="surface-raised pointer-events-auto flex h-12 cursor-pointer items-center gap-2 rounded-control pr-5 pl-4 text-sm transition-[scale] duration-300 ease-theme hover:scale-(--hover-scale) active:scale-(--press-scale)"
      >
        <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden>
          <path d="M4 7h10M18 7h2M4 17h4M12 17h8" />
          <circle cx="16" cy="7" r="2" />
          <circle cx="10" cy="17" r="2" />
        </svg>
        Tune {title.toLowerCase()}
      </button>
    </div>
  );
}
