"use client";

import { useSyncExternalStore } from "react";

import { ThemeDock } from "./theme-settings";

const subscribe = () => () => {};

/**
 * The theme dock for standalone /view pages. Hidden inside the docs preview
 * iframe, where the docs page already has a dock and settings sync through
 * the storage event. False on the server, so hydration always matches.
 */
export function StandaloneDock({ collection }: { collection: string }) {
  const standalone = useSyncExternalStore(
    subscribe,
    () => window.self === window.top,
    () => false,
  );
  return standalone ? <ThemeDock collection={collection} /> : null;
}
