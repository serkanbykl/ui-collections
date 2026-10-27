"use client";

import { useSyncExternalStore } from "react";

export type Look = "deep" | "glass" | "tide";

const looks: Look[] = ["deep", "glass", "tide"];
export const lookKey = "home:look";

/**
 * Re-dresses the home page in a collection's theme without leaving it: sets
 * data-theme on <html>, which pond.css maps onto the page's own tokens. The
 * "Open" cards still lead to the collections themselves.
 */
function apply(look: Look) {
  const root = document.documentElement;
  if (look === "deep") delete root.dataset.theme;
  else root.dataset.theme = look;
  // Themes read data-mode; pin it to what the page shows now so the swap keeps light or dark.
  if (!root.dataset.mode) root.dataset.mode = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  try {
    localStorage.setItem(lookKey, look);
  } catch {}
  listeners.forEach((l) => l());
}

const listeners = new Set<() => void>();
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
const current = (): Look => (document.documentElement.dataset.theme as Look | undefined) ?? "deep";

export function LookSwitch() {
  const look = useSyncExternalStore(subscribe, current, () => "deep" as Look);

  return (
    <div role="group" aria-label="Page look" className="flex items-center gap-7">
      {looks.map((l) => (
        <button
          key={l}
          type="button"
          aria-pressed={look === l}
          onClick={() => apply(l)}
          className="cursor-pointer lowercase opacity-55 transition-opacity duration-150 outline-none hover:opacity-100 focus-visible:underline focus-visible:opacity-100 aria-pressed:opacity-100 aria-pressed:underline aria-pressed:decoration-(--rule) aria-pressed:underline-offset-[6px]"
        >
          {l}
        </button>
      ))}
    </div>
  );
}
