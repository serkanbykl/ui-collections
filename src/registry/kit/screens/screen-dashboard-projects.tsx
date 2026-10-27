"use client";

import { useState, type ReactNode } from "react";

import { cn } from "@/registry/kit/lib/utils";
import { Avatar, AvatarGroup } from "@/registry/kit/ui/avatar";
import { Badge } from "@/registry/kit/ui/badge";
import { ChartBar } from "@/registry/kit/ui/chart-bar";
import { Progress } from "@/registry/kit/ui/progress";
import { ProgressList } from "@/registry/kit/ui/progress-list";
import { SegmentedControl } from "@/registry/kit/ui/segmented-control";
import { StatCard } from "@/registry/kit/ui/stat-card";
import { EmptyState } from "@/registry/kit/ui/states";
import { PageHeader } from "@/registry/kit/ui/page-header";

export type ProjectHealth = "on-track" | "at-risk" | "blocked" | "done";

export interface Project {
  id: string;
  name: string;
  client: string;
  health: ProjectHealth;
  /** 0–1. */
  progress: number;
  tasksDone: number;
  tasksTotal: number;
  due: string;
  team: string[];
}

export interface ProjectsDashboardData {
  projects: Project[];
  hours: { labels: string[]; design: number[]; engineering: number[] };
  workload: { id: string; name: string; hours: number; capacity: number }[];
  deadlines: { id: string; title: string; project: string; date: string; day: string }[];
}

const healthMeta: Record<ProjectHealth, { label: string; variant: "success" | "warning" | "danger" | "outline" }> = {
  "on-track": { label: "On track", variant: "success" },
  "at-risk": { label: "At risk", variant: "warning" },
  blocked: { label: "Blocked", variant: "danger" },
  done: { label: "Done", variant: "outline" },
};

export const sampleProjectsData: ProjectsDashboardData = {
  projects: [
    { id: "p1", name: "Booking site redesign", client: "Coastal Kayak Co.", health: "on-track", progress: 0.64, tasksDone: 41, tasksTotal: 64, due: "Nov 20", team: ["Mira Solberg", "Dev Patel", "Lucía Ortega"] },
    { id: "p2", name: "Brand identity refresh", client: "Halden & Moss", health: "at-risk", progress: 0.38, tasksDone: 14, tasksTotal: 37, due: "Nov 4", team: ["Kwame Asante", "Mira Solberg"] },
    { id: "p3", name: "Wholesale portal", client: "Marino & Figli", health: "blocked", progress: 0.22, tasksDone: 11, tasksTotal: 49, due: "Dec 12", team: ["Dev Patel", "Theo Brandt", "Ana Lima", "Yusuf Kaya"] },
    { id: "p4", name: "iOS loyalty app", client: "Northwind Coffee", health: "on-track", progress: 0.81, tasksDone: 72, tasksTotal: 89, due: "Oct 30", team: ["Ana Lima", "Theo Brandt"] },
    { id: "p5", name: "Annual report microsite", client: "Brightline Physio", health: "done", progress: 1, tasksDone: 26, tasksTotal: 26, due: "Oct 17", team: ["Lucía Ortega"] },
    { id: "p6", name: "Checkout A/B tests", client: "Tidewater Books", health: "at-risk", progress: 0.47, tasksDone: 8, tasksTotal: 17, due: "Nov 9", team: ["Yusuf Kaya", "Dev Patel"] },
  ],
  hours: {
    labels: ["W38", "W39", "W40", "W41", "W42", "W43"],
    design: [112, 126, 98, 134, 121, 117],
    engineering: [187, 203, 214, 196, 228, 209],
  },
  workload: [
    { id: "w1", name: "Dev Patel", hours: 46, capacity: 40 },
    { id: "w2", name: "Mira Solberg", hours: 37, capacity: 40 },
    { id: "w3", name: "Ana Lima", hours: 33, capacity: 40 },
    { id: "w4", name: "Theo Brandt", hours: 29, capacity: 32 },
    { id: "w5", name: "Lucía Ortega", hours: 18, capacity: 32 },
  ],
  deadlines: [
    { id: "dl1", title: "App Store submission", project: "iOS loyalty app", date: "Oct 30", day: "Fri" },
    { id: "dl2", title: "Logo round two review", project: "Brand identity refresh", date: "Nov 4", day: "Wed" },
    { id: "dl3", title: "Variant B goes live", project: "Checkout A/B tests", date: "Nov 9", day: "Mon" },
    { id: "dl4", title: "Staging handover", project: "Booking site redesign", date: "Nov 20", day: "Fri" },
  ],
};

const initials = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2);

function Panel({ title, action, children, className }: { title: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={cn("surface min-w-0 rounded-card p-5 md:p-6", className)}>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-sm font-medium text-fg/85">{title}</h3>
        {action}
      </div>
      {children}
    </section>
  );
}

type Filter = "all" | "attention" | "on-track";

export interface ProjectsDashboardScreenProps {
  data?: ProjectsDashboardData;
  /** Project names link to `${projectHref}/${id}`. */
  projectHref?: string;
  className?: string;
}

/** Delivery overview: project health tiles, a filterable project list with progress and team, hours by discipline, team workload and upcoming deadlines. */
export function ProjectsDashboardScreen({ data = sampleProjectsData, projectHref = "#/app/projects", className }: ProjectsDashboardScreenProps) {
  const [filter, setFilter] = useState<Filter>("all");
  const active = data.projects.filter((p) => p.health !== "done");
  const attention = active.filter((p) => p.health === "at-risk" || p.health === "blocked");
  const visible =
    filter === "all" ? data.projects : filter === "attention" ? attention : data.projects.filter((p) => p.health === "on-track");
  const hoursThisWeek = (data.hours.design.at(-1) ?? 0) + (data.hours.engineering.at(-1) ?? 0);
  const openTasks = active.reduce((s, p) => s + p.tasksTotal - p.tasksDone, 0);

  return (
    <div className={cn("grid grid-cols-1 gap-6", className)}>
      <PageHeader title="Projects" description={`${active.length} in flight · ${attention.length} need attention this week`} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Active projects" value={active.length} tone="accent" change={0.25} comparison="vs last month" highlight />
        <StatCard label="On track" value={(active.filter((p) => p.health === "on-track").length / Math.max(active.length, 1)) * 100} suffix="%" tone="success" change={-0.1} comparison="vs last month" />
        <StatCard label="Hours logged this week" value={hoursThisWeek} tone="info" change={-0.064} comparison="vs last week" sparkline={data.hours.engineering.map((e, i) => e + data.hours.design[i]!)} />
        <StatCard label="Open tasks" value={openTasks} tone="warning" change={-0.087} positiveIsGood={false} comparison="vs last week" />
      </div>

      <Panel title="Projects" action={<SegmentedControl aria-label="Filter projects" value={filter} onValueChange={setFilter} options={[{ value: "all", label: "All" }, { value: "attention", label: "Needs attention" }, { value: "on-track", label: "On track" }]} />}>
        {visible.length === 0 ? (
          <EmptyState size="compact" title="Nothing here" description="Every project in this view is wrapped up." />
        ) : (
          <ul className="divide-y divide-line">
            {visible.map((p) => (
              <li key={p.id} className="grid grid-cols-1 gap-3 py-4 first:pt-0 last:pb-0 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_6.5rem] md:items-center md:gap-6">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <a href={`${projectHref}/${p.id}`} className="truncate font-medium hover:text-accent">
                      {p.name}
                    </a>
                    <Badge variant={healthMeta[p.health].variant} dot>
                      {healthMeta[p.health].label}
                    </Badge>
                  </div>
                  <p className="mt-0.5 text-sm text-muted">
                    {p.client} · due {p.due}
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-1.5">
                  <div className="flex justify-between text-xs text-muted">
                    <span className="tabular-nums">
                      {p.tasksDone}/{p.tasksTotal} tasks
                    </span>
                    <span className="tabular-nums">{Math.round(p.progress * 100)}%</span>
                  </div>
                  <Progress
                    value={Math.round(p.progress * 100)}
                    aria-label={`${p.name} progress`}
                    tone={p.health === "blocked" ? "danger" : p.health === "at-risk" ? "warning" : "accent"}
                  />
                </div>
                <AvatarGroup max={3} size="sm" className="md:justify-end">
                  {p.team.map((m) => (
                    <Avatar key={m} size="sm" fallback={initials(m)} alt={m} title={m} />
                  ))}
                </AvatarGroup>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <Panel title="Hours by discipline" className="lg:col-span-2 xl:col-span-1">
          <ChartBar
            labels={data.hours.labels}
            series={[
              { name: "Engineering", values: data.hours.engineering },
              { name: "Design", values: data.hours.design },
            ]}
            label="Hours logged per week by discipline"
            height={220}
            formatValue={(v) => `${v} h`}
          />
        </Panel>
        <Panel title="Workload this week">
          <ProgressList
            items={data.workload.map((w) => ({
              id: w.id,
              label: w.name,
              meta: `${w.hours} of ${w.capacity} h${w.hours > w.capacity ? " · over capacity" : ""}`,
              value: w.hours / w.capacity,
              tone: w.hours > w.capacity ? "danger" : w.hours / w.capacity > 0.85 ? "warning" : "accent",
            }))}
          />
        </Panel>
        <Panel title="Upcoming deadlines">
          <ul className="grid grid-cols-1 gap-3">
            {data.deadlines.map((d) => (
              <li key={d.id} className="flex items-center gap-3">
                <span className="grid w-12 shrink-0 place-items-center rounded-field border border-line py-1.5 text-center">
                  <span className="text-[11px] text-muted uppercase">{d.date.split(" ")[0]}</span>
                  <span className="text-sm font-medium tabular-nums">{d.date.split(" ")[1]}</span>
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{d.title}</p>
                  <p className="truncate text-xs text-muted">
                    {d.project} · {d.day}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
