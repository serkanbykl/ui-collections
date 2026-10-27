"use client";

import { useState } from "react";

import { cn } from "@/registry/kit/lib/utils";
import { ActivityList, type ActivityItem } from "@/registry/kit/ui/activity-list";
import { Avatar, AvatarGroup } from "@/registry/kit/ui/avatar";
import { Badge } from "@/registry/kit/ui/badge";
import { Button } from "@/registry/kit/ui/button";
import { EntityCard } from "@/registry/kit/ui/entity-card";
import { Progress } from "@/registry/kit/ui/progress";
import { ProgressList } from "@/registry/kit/ui/progress-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/kit/ui/tabs";
import { toast } from "@/registry/kit/ui/toast";
import { PageHeader } from "@/registry/kit/ui/page-header";

export interface ProfilePerson {
  name: string;
  title: string;
  team: string;
  location: string;
  /** Local time shown beside the location, e.g. "14:32". */
  localTime: string;
  email: string;
  joined: string;
  bio: string;
  avatar?: string;
  skills: string[];
  stats: { label: string; value: string }[];
}

export interface ProfileProject {
  id: string;
  name: string;
  client: string;
  progress: number;
  status: "on-track" | "at-risk" | "done";
  due: string;
  members: string[];
}

export interface ProfileConnection {
  id: string;
  name: string;
  title: string;
  mutual: number;
  connected: boolean;
}

export const sampleProfile: ProfilePerson = {
  name: "Priya Raman",
  title: "Lead product designer",
  team: "Design",
  location: "Lisbon, Portugal",
  localTime: "14:32",
  email: "priya@northwind.io",
  joined: "Joined March 2023",
  bio: "Designs the onboarding and billing flows. Before Northwind she spent six years on payments at a mid-sized bank, which explains the strong opinions about invoice tables.",
  skills: ["Interaction design", "Design systems", "Prototyping", "User research", "Accessibility audits"],
  stats: [
    { label: "Projects", value: "14" },
    { label: "Reviews given", value: "312" },
    { label: "Followers", value: "1,284" },
  ],
};

export const sampleProfileActivity: ActivityItem[] = [
  { id: "a1", actor: "Priya Raman", action: "published", target: "Checkout v3 handoff", time: "26 min ago", tone: "success" },
  { id: "a2", actor: "Priya Raman", action: "commented on", target: "Invoice PDF layout", time: "2 h ago", tone: "info" },
  { id: "a3", actor: "Priya Raman", action: "reviewed", target: "Settings navigation", time: "Yesterday", tone: "accent" },
  { id: "a4", actor: "Priya Raman", action: "uploaded 9 files to", target: "Brand refresh", time: "Yesterday", tone: "neutral" },
  { id: "a5", actor: "Priya Raman", action: "flagged a contrast issue in", target: "Dark mode tokens", time: "Oct 22", tone: "warning" },
  { id: "a6", actor: "Priya Raman", action: "closed", target: "Onboarding checklist", time: "Oct 21", tone: "success" },
  { id: "a7", actor: "Priya Raman", action: "joined", target: "Mobile web squad", time: "Oct 19", tone: "info" },
];

export const sampleProfileProjects: ProfileProject[] = [
  { id: "p1", name: "Checkout v3", client: "Growth", progress: 0.82, status: "on-track", due: "Nov 7", members: ["Priya Raman", "Mateo Alvarez", "Leila Haddad", "Noah Lindqvist"] },
  { id: "p2", name: "Invoice PDF layout", client: "Finance", progress: 0.46, status: "at-risk", due: "Nov 2", members: ["Priya Raman", "Hana Sato"] },
  { id: "p3", name: "Dark mode tokens", client: "Platform", progress: 0.67, status: "on-track", due: "Nov 19", members: ["Priya Raman", "Kwame Mensah", "Elif Demir"] },
  { id: "p4", name: "Onboarding checklist", client: "Growth", progress: 1, status: "done", due: "Oct 21", members: ["Priya Raman", "Sofía Herrera", "Amara Okafor", "Lukas Brandt", "Ines Duarte"] },
  { id: "p5", name: "Brand refresh", client: "Marketing", progress: 0.29, status: "on-track", due: "Dec 12", members: ["Priya Raman", "Sofía Herrera"] },
  { id: "p6", name: "Settings navigation", client: "Platform", progress: 0.91, status: "on-track", due: "Oct 30", members: ["Priya Raman", "Lukas Brandt", "Rohan Mehta"] },
];

export const sampleConnections: ProfileConnection[] = [
  { id: "c1", name: "Sofía Herrera", title: "Product designer", mutual: 23, connected: true },
  { id: "c2", name: "Kwame Mensah", title: "Frontend engineer", mutual: 17, connected: true },
  { id: "c3", name: "Leila Haddad", title: "Support lead", mutual: 9, connected: false },
  { id: "c4", name: "Noah Lindqvist", title: "Product manager", mutual: 31, connected: true },
  { id: "c5", name: "Elif Demir", title: "Design engineer", mutual: 12, connected: false },
  { id: "c6", name: "Tomasz Wiśniewski", title: "Support engineer", mutual: 4, connected: false },
];

const projectStatus: Record<ProfileProject["status"], { label: string; variant: "success" | "warning" | "outline" }> = {
  "on-track": { label: "On track", variant: "success" },
  "at-risk": { label: "At risk", variant: "warning" },
  done: { label: "Done", variant: "outline" },
};

// Opaque fills, so overlapping avatars in a group don't show through each other.
const solidTints = ["bg-accent text-accent-fg", "bg-info text-bg", "bg-warning text-black/75", "bg-success text-bg"];
const tints = ["bg-accent/15 text-accent", "bg-info/15 text-info", "bg-warning/15 text-warning", "bg-success/15 text-success"];

function Icon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" className="size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={d} />
    </svg>
  );
}

export interface UserProfileScreenProps {
  person?: ProfilePerson;
  activity?: ActivityItem[];
  projects?: ProfileProject[];
  connections?: ProfileConnection[];
  /** Tab shown first. */
  defaultTab?: "overview" | "activity" | "projects" | "connections";
  className?: string;
}

/** A person's page: cover and avatar header, follow and message actions, and tabs for overview, activity, projects and connections. */
export function UserProfileScreen({
  person = sampleProfile,
  activity = sampleProfileActivity,
  projects = sampleProfileProjects,
  connections = sampleConnections,
  defaultTab = "overview",
  className,
}: UserProfileScreenProps) {
  const [following, setFollowing] = useState(false);
  const [people, setPeople] = useState(connections);
  const first = person.name.split(" ")[0];

  return (
    <div className={cn("grid min-w-0 grid-cols-1 gap-6", className)}>
      <PageHeader
        title="Profile"
        description={`${activity.length} updates since ${activity.at(-1)?.time ?? "last week"} · ${people.length} ${people.length === 1 ? "connection" : "connections"}`}
      />
      <section aria-label={person.name} className="surface overflow-hidden rounded-card">
        <div
          aria-hidden
          className="h-28 bg-[radial-gradient(120%_140%_at_10%_0%,color-mix(in_oklab,var(--color-accent)_55%,transparent),transparent_60%),radial-gradient(90%_120%_at_95%_100%,color-mix(in_oklab,var(--color-info)_45%,transparent),transparent_65%)] md:h-40"
        />
        <div className="flex flex-wrap items-end gap-x-5 gap-y-4 px-5 pb-5 md:px-7 md:pb-6">
          <Avatar
            src={person.avatar}
            alt={person.name}
            className="-mt-12 size-24 shrink-0 text-2xl ring-4 ring-bg md:-mt-14 md:size-28"
            fallbackClassName="bg-linear-to-br from-accent to-info font-semibold text-accent-fg"
          />
          <div className="min-w-0 flex-1 basis-56">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-2xl font-semibold tracking-tight md:text-3xl">{person.name}</h3>
              <Badge variant="accent">{person.team}</Badge>
            </div>
            <p className="mt-1 text-muted">{person.title}</p>
            <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-muted">
              <li className="flex items-center gap-1.5">
                <Icon d="M12 21s-6.5-5.4-6.5-11a6.5 6.5 0 0 1 13 0c0 5.6-6.5 11-6.5 11Z M12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
                {person.location} · {person.localTime} local time
              </li>
              <li className="flex items-center gap-1.5">
                <Icon d="M7 3v3M17 3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" />
                {person.joined}
              </li>
            </ul>
          </div>
          <div className="flex w-full flex-wrap gap-2 sm:w-auto">
            <Button
              variant={following ? "surface" : "accent"}
              aria-pressed={following}
              className="flex-1 sm:flex-none"
              onClick={() => {
                setFollowing((v) => !v);
                toast.success(following ? `You unfollowed ${first}.` : `You'll see ${first}'s updates in your feed.`);
              }}
            >
              {following ? "Following" : "Follow"}
            </Button>
            <Button className="flex-1 sm:flex-none" onClick={() => toast.success(`Opened a conversation with ${first}.`)}>
              Send message
            </Button>
          </div>
        </div>
        <dl className="grid grid-cols-3 border-t border-line">
          {person.stats.map((stat, i) => (
            <div key={stat.label} className={cn("px-4 py-3 text-center md:py-4", i > 0 && "border-l border-line")}>
              <dt className="text-xs text-muted">{stat.label}</dt>
              <dd className="mt-0.5 text-lg font-semibold tabular-nums">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </section>


      <Tabs defaultValue={defaultTab} className="grid min-w-0 grid-cols-1 gap-5">
        <div className="-mx-1 overflow-x-auto px-1 pb-1">
          <TabsList aria-label="Profile sections">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="connections">People</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="grid min-w-0 grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="grid min-w-0 grid-cols-1 content-start gap-5">
            <section className="surface rounded-card p-5 md:p-6">
              <h3 className="font-semibold">About</h3>
              <p className="mt-2 leading-relaxed text-muted">{person.bio}</p>
              <h4 className="mt-5 text-sm font-medium">Focus areas</h4>
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {person.skills.map((skill) => (
                  <li key={skill}>
                    <Badge variant="surface">{skill}</Badge>
                  </li>
                ))}
              </ul>
            </section>
            <section className="surface rounded-card p-5 md:p-6">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-semibold">Recent activity</h3>
                <span className="text-xs text-muted">Last 7 days</span>
              </div>
              <ActivityList items={activity.slice(0, 4)} className="mt-4" />
            </section>
          </div>
          <div className="grid min-w-0 grid-cols-1 content-start gap-5">
            <section className="surface rounded-card p-5">
              <h3 className="font-semibold">Contact</h3>
              <dl className="mt-3 grid gap-3 text-sm">
                <div>
                  <dt className="text-xs text-muted">Email</dt>
                  <dd className="truncate">{person.email}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted">Team</dt>
                  <dd>{person.team}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted">Working hours</dt>
                  <dd>09:00–17:30, Monday to Friday</dd>
                </div>
              </dl>
            </section>
            <section className="surface rounded-card p-5">
              <h3 className="font-semibold">Where the time went</h3>
              <p className="mt-1 text-xs text-muted">Share of tracked hours this quarter</p>
              <ProgressList
                className="mt-4"
                items={[
                  { id: "design", label: "Design work", value: 0.54 },
                  { id: "reviews", label: "Reviews and critique", value: 0.23, tone: "info" },
                  { id: "research", label: "Research sessions", value: 0.14, tone: "success" },
                  { id: "meetings", label: "Planning", value: 0.09, tone: "warning" },
                ]}
              />
            </section>
          </div>
        </TabsContent>

        <TabsContent value="activity">
          <section className="surface rounded-card p-5 md:p-6">
            <h3 className="font-semibold">All activity</h3>
            <ActivityList items={activity} className="mt-4" />
          </section>
        </TabsContent>

        <TabsContent value="projects">
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {projects.map((project, i) => (
              <li key={project.id}>
                <EntityCard
                  media={
                    <span aria-hidden className={cn("grid size-10 shrink-0 place-items-center rounded-field text-xs font-semibold", tints[i % tints.length])}>
                      {project.name
                        .split(" ")
                        .slice(0, 2)
                        .map((w) => w[0])
                        .join("")
                        .toUpperCase()}
                    </span>
                  }
                  title={project.name}
                  subtitle={`${project.client} · due ${project.due}`}
                  badges={<Badge variant={projectStatus[project.status].variant}>{projectStatus[project.status].label}</Badge>}
                  footer={
                    <div className="flex items-center justify-between gap-3">
                      <AvatarGroup size="sm" max={3}>
                        {project.members.map((m, j) => (
                          <Avatar key={m} size="sm" alt={m} fallbackClassName={cn("font-semibold", solidTints[j % solidTints.length])} />
                        ))}
                      </AvatarGroup>
                      <span className="text-xs text-muted">{project.members.length} people</span>
                    </div>
                  }
                >
                  <div className="grid gap-1.5">
                    <div className="flex justify-between text-xs text-muted">
                      <span>Progress</span>
                      <span className="tabular-nums">{Math.round(project.progress * 100)}%</span>
                    </div>
                    <Progress value={project.progress * 100} aria-label={`${project.name} progress`} />
                  </div>
                </EntityCard>
              </li>
            ))}
          </ul>
        </TabsContent>

        <TabsContent value="connections">
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {people.map((c, i) => (
              <li key={c.id} className="surface flex items-center gap-3 rounded-card p-4">
                <Avatar alt={c.name} fallbackClassName={cn("font-semibold", tints[i % tints.length])} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{c.name}</p>
                  <p className="truncate text-xs text-muted">
                    {c.title} · {c.mutual} mutual
                  </p>
                </div>
                <Button
                  size="sm"
                  variant={c.connected ? "surface" : "accent"}
                  aria-pressed={c.connected}
                  aria-label={`${c.connected ? "Disconnect from" : "Connect with"} ${c.name}`}
                  onClick={() => setPeople((list) => list.map((p) => (p.id === c.id ? { ...p, connected: !p.connected } : p)))}
                >
                  {c.connected ? "Connected" : "Connect"}
                </Button>
              </li>
            ))}
          </ul>
        </TabsContent>
      </Tabs>
    </div>
  );
}
