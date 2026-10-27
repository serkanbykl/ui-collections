"use client";

import { useState } from "react";

import { Dock } from "@/registry/kit/ui/dock";

const icon = (d: string) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const apps = [
  { label: "Home", icon: icon("M4 11l8-7 8 7v8a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z") },
  { label: "Search", icon: icon("M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-4-4") },
  { label: "Projects", icon: icon("M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z") },
  { label: "Inbox", icon: icon("M4 6h16v12H4zM4 7l8 6 8-6") },
  { label: "Analytics", icon: icon("M5 19V11M12 19V5M19 19v-6") },
  { label: "Settings", icon: icon("M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19 12h2M3 12h2M12 3v2M12 19v2M17 7l1.5-1.5M5.5 18.5L7 17M17 17l1.5 1.5M5.5 5.5L7 7") },
];

export default function DockDemo() {
  // In an app, pass `href` instead and mark the current route `active`.
  const [current, setCurrent] = useState("Home");

  return (
    <div className="flex min-h-48 flex-col items-center justify-end gap-6">
      <p className="text-sm text-muted" aria-live="polite">
        Opened {current}
      </p>
      <Dock items={apps.map((app) => ({ ...app, active: app.label === current, onClick: () => setCurrent(app.label) }))} />
    </div>
  );
}
