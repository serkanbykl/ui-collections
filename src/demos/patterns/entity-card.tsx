"use client";

import { useState } from "react";

import { Badge } from "@/registry/kit/ui/badge";
import { EntityCard, EntityCardStats } from "@/registry/kit/ui/entity-card";

const projects = [
  { name: "acme/web", framework: "Next.js", status: "Ready", hue: "from-accent/40", deploys: 412, uptime: "99.99%", updated: "2 hours ago" },
  { name: "acme/api", framework: "Hono", status: "Building", hue: "from-info/40", deploys: 1183, uptime: "99.95%", updated: "6 minutes ago" },
  { name: "acme/docs", framework: "Astro", status: "Ready", hue: "from-warning/40", deploys: 96, uptime: "99.98%", updated: "Yesterday" },
];

export default function EntityCardDemo() {
  const [selected, setSelected] = useState(projects[0]!.name);

  return (
    <ul className="grid w-full max-w-4xl gap-4 sm:grid-cols-3">
      {projects.map((p) => (
        <li key={p.name}>
          <EntityCard
            selected={selected === p.name}
            onOpen={() => setSelected(p.name)}
            title={p.name}
            subtitle={p.framework}
            cover={<div className={`h-24 bg-gradient-to-br ${p.hue} to-transparent`} />}
            badges={
              <Badge variant={p.status === "Ready" ? "success" : "info"} dot>
                {p.status}
              </Badge>
            }
            footer={<span className="text-xs text-muted">Updated {p.updated}</span>}
          >
            <EntityCardStats
              items={[
                { label: "Deploys", value: p.deploys.toLocaleString("en-US") },
                { label: "Uptime", value: p.uptime },
              ]}
            />
          </EntityCard>
        </li>
      ))}
    </ul>
  );
}
