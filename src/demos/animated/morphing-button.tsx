"use client";

import { useEffect, useState } from "react";

import { MorphingButton } from "@/registry/kit/ui/morphing-button";

const check = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);

const copy = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="11" height="11" rx="2.5" />
    <path d="M15 9V6.5A2.5 2.5 0 0 0 12.5 4h-6A2.5 2.5 0 0 0 4 6.5v6A2.5 2.5 0 0 0 6.5 15H9" />
  </svg>
);

const spinner = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="animate-spin">
    <path d="M12 3a9 9 0 1 0 9 9" />
  </svg>
);

/** Returns to `idle` a moment after reaching `done`. */
function useSettle<T extends string>(state: T, done: T, idle: T, set: (s: T) => void) {
  useEffect(() => {
    if (state !== done) return;
    const timer = setTimeout(() => set(idle), 1800);
    return () => clearTimeout(timer);
  }, [state, done, idle, set]);
}

export default function MorphingButtonDemo() {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");
  const [deploy, setDeploy] = useState<"idle" | "running" | "live">("idle");
  useSettle(copyState, "copied", "idle", setCopyState);
  useSettle(copyState, "failed", "idle", setCopyState);
  useSettle(deploy, "live", "idle", setDeploy);

  useEffect(() => {
    if (deploy !== "running") return;
    const timer = setTimeout(() => setDeploy("live"), 1600);
    return () => clearTimeout(timer);
  }, [deploy]);

  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <MorphingButton
        state={copyState}
        onClick={() =>
          navigator.clipboard.writeText("npm i surface").then(
            () => setCopyState("copied"),
            () => setCopyState("failed"),
          )
        }
        states={{
          idle: { label: "Copy command", icon: copy },
          copied: { label: "Copied", icon: check },
          failed: { label: "Copy blocked", icon: copy },
        }}
      />
      <MorphingButton
        variant="solid"
        state={deploy}
        disabled={deploy === "running"}
        onClick={() => setDeploy("running")}
        states={{
          idle: { label: "Deploy to production" },
          running: { label: "Deploying…", icon: spinner },
          live: { label: "Live", icon: check },
        }}
      />
    </div>
  );
}
