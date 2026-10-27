"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { Button } from "@/registry/kit/ui/button";
import { DynamicIsland, type IslandActivity } from "@/registry/kit/ui/dynamic-island";
import { Progress } from "@/registry/kit/ui/progress";
import { SegmentedControl } from "@/registry/kit/ui/segmented-control";

type Kind = "none" | "deploy" | "focus" | "upload";

const rocket = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="text-accent">
    <path d="M12 15l-3-3c1.2-4.4 4.2-7.4 9-8 0 4.8-3.6 7.8-6 11zM9 12H5l2.5-3.5H11M12 15v4l3.5-2.5V13M5.5 18.5c.7-1.7 1.8-2.3 3-2" />
  </svg>
);

const timer = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden className="text-warning">
    <circle cx="12" cy="13" r="8" />
    <path d="M12 9v4l2.5 2M9.5 2.5h5" />
  </svg>
);

const cloud = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="text-info">
    <path d="M7 18a4.5 4.5 0 0 1-.6-8.96A6 6 0 0 1 18 9.5a4 4 0 0 1-.5 8.5H7zM12 15v-5M9.5 12.5L12 10l2.5 2.5" />
  </svg>
);

const clock = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

/** Steps from `start` while `running` and returns the current value. */
function useTicker(running: boolean, start: number, step: number, interval: number) {
  const [ticks, setTicks] = useState(0);
  const [wasRunning, setWasRunning] = useState(running);
  if (running !== wasRunning) {
    setWasRunning(running);
    setTicks(0);
  }
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setTicks((t) => t + 1), interval);
    return () => clearInterval(id);
  }, [running, interval]);
  return start + ticks * step;
}

export default function DynamicIslandDemo() {
  const [kind, setKind] = useState<Kind>("deploy");
  const [expanded, setExpanded] = useState(false);
  // Set only from a click, so `document` exists whenever it is true.
  const [onPage, setOnPage] = useState(false);

  const deploy = Math.min(100, useTicker(kind === "deploy", 38, 3, 700));
  const focusLeft = Math.max(0, useTicker(kind === "focus", 1453, -1, 1000));
  const uploaded = Math.min(14, useTicker(kind === "upload", 5, 1, 1400));

  function choose(next: Kind) {
    setKind(next);
    setExpanded(false);
  }

  const activities: Record<Exclude<Kind, "none">, IslandActivity> = {
    deploy: {
      id: "deploy",
      label: "Deploying atlas-web to production",
      leading: rocket,
      caption: "atlas-web",
      trailing: `${deploy}%`,
      progress: deploy / 100,
      tone: deploy === 100 ? "success" : "accent",
      expanded: (
        <div className="grid gap-4">
          <div className="flex items-start gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-accent/15 [&>svg]:size-5">{rocket}</span>
            <div className="min-w-0">
              <p className="font-medium">{deploy === 100 ? "atlas-web is live" : "Deploying atlas-web"}</p>
              <p className="text-xs text-muted">Production · commit 7f3c2e1 by Ines Duarte</p>
            </div>
            <span className="ms-auto text-lg font-medium tabular-nums text-accent">{deploy}%</span>
          </div>
          <Progress value={deploy} tone={deploy === 100 ? "success" : "accent"} aria-label="Deploy progress" />
          <div className="flex justify-end gap-2">
            <Button size="sm" onClick={() => choose("none")}>
              {deploy === 100 ? "Dismiss" : "Cancel deploy"}
            </Button>
          </div>
        </div>
      ),
    },
    focus: {
      id: "focus",
      label: "Focus session running",
      leading: timer,
      caption: "Roadmap review",
      trailing: clock(focusLeft),
      progress: 1 - focusLeft / 1500,
      tone: "warning",
      expanded: (
        <div className="flex items-center gap-4">
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-warning/15 [&>svg]:size-5">{timer}</span>
          <div className="min-w-0">
            <p className="text-xs text-muted">Focus · Q4 roadmap review</p>
            <p className="font-display text-3xl tabular-nums tracking-tight text-warning">{clock(focusLeft)}</p>
          </div>
          <Button size="sm" className="ms-auto" onClick={() => choose("none")}>
            End session
          </Button>
        </div>
      ),
    },
    upload: {
      id: "upload",
      label: "Uploading files to Brand assets",
      leading: cloud,
      caption: "Brand assets",
      trailing: `${uploaded}/14`,
      progress: uploaded / 14,
      tone: "info",
      // No expanded view: the pill stays compact and doesn't open.
    },
  };

  const island = (
    <DynamicIsland activity={kind === "none" ? null : activities[kind]} expanded={expanded} onExpandedChange={setExpanded} />
  );

  return (
    <div className="flex w-full flex-col items-center gap-8">
      <div className="surface relative flex h-72 w-full max-w-sm justify-center overflow-hidden rounded-card pt-3">
        {!onPage && island}
        <p className="absolute inset-x-0 bottom-5 px-6 text-center text-xs text-muted text-pretty">
          {onPage
            ? "The island is pinned to the top of the page."
            : kind === "upload"
              ? "Uploads have no detail view, so the pill stays compact."
              : "Tap the island to open it. Escape or a tap outside closes it."}
        </p>
      </div>
      {/* Portalled to <body>: a surface's backdrop-filter would otherwise trap `position: fixed`. */}
      {onPage && createPortal(<div className="fixed inset-x-0 top-3 z-[60]">{island}</div>, document.body)}
      <Button size="sm" aria-pressed={onPage} onClick={() => setOnPage((v) => !v)}>
        {onPage ? "Put it back in the box" : "Show on top of the page"}
      </Button>
      <SegmentedControl<Kind>
        aria-label="Live activity"
        value={kind}
        onValueChange={choose}
        options={[
          { value: "none", label: "Idle" },
          { value: "deploy", label: "Deploy" },
          { value: "focus", label: "Focus" },
          { value: "upload", label: "Upload" },
        ]}
      />
    </div>
  );
}
