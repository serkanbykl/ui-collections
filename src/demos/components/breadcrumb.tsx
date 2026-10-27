"use client";

import { useState } from "react";

import { Breadcrumb } from "@/registry/kit/ui/breadcrumb";

const trail = ["acme", "marketing-site", "Deployments", "4f2a91c"];

export default function BreadcrumbDemo() {
  // Click a crumb to walk back up the trail; a real app would route here.
  const [depth, setDepth] = useState(trail.length);

  return (
    <div className="grid justify-items-center gap-4">
      <div className="surface rounded-control px-5 py-3">
        <Breadcrumb items={trail.slice(0, depth).map((label) => ({ label }))} onSelect={(i) => setDepth(i + 1)} />
      </div>
      {depth < trail.length && (
        <button
          type="button"
          onClick={() => setDepth(trail.length)}
          className="cursor-pointer rounded-control text-xs text-muted underline-offset-4 hover:text-fg hover:underline focus-visible:outline-2 focus-visible:outline-accent"
        >
          Restore full trail
        </button>
      )}
    </div>
  );
}
