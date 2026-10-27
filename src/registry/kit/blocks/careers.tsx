"use client";

import { useMemo, useState } from "react";

import { PageHero, SectionTitle, type HeadingLevel } from "@/registry/kit/lib/page-kit";
import { Badge } from "@/registry/kit/ui/badge";
import { Button } from "@/registry/kit/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/registry/kit/ui/select";
import { EmptyState } from "@/registry/kit/ui/states";

export interface Role {
  slug: string;
  title: string;
  team: string;
  location: string;
  type: "Full-time" | "Part-time" | "Contract";
  /** Short line under the title. */
  summary: string;
  salary?: string;
  /** ISO date the role was posted. */
  posted?: string;
}

export const defaultRoles: Role[] = [
  { slug: "senior-product-engineer", title: "Senior Product Engineer", team: "Engineering", location: "Remote, Europe", type: "Full-time", summary: "Own the review flow from the database to the pixel.", salary: "€92k – €118k", posted: "2026-10-14" },
  { slug: "infrastructure-engineer", title: "Infrastructure Engineer", team: "Engineering", location: "Remote, Americas", type: "Full-time", summary: "Keep 41 edge regions fast, cheap and boring.", salary: "$148k – $176k", posted: "2026-10-02" },
  { slug: "staff-security-engineer", title: "Staff Security Engineer", team: "Engineering", location: "Berlin or remote", type: "Full-time", summary: "Lead threat modelling and our next SOC 2 audit.", salary: "€128k – €152k", posted: "2026-09-21" },
  { slug: "product-designer", title: "Product Designer", team: "Design", location: "Remote, Europe", type: "Full-time", summary: "Shape how 4,000 teams review and ship work.", salary: "€78k – €96k", posted: "2026-10-09" },
  { slug: "brand-designer", title: "Brand Designer", team: "Design", location: "Lisbon", type: "Contract", summary: "Six-month contract for the 2027 brand refresh.", posted: "2026-09-30" },
  { slug: "support-engineer", title: "Support Engineer", team: "Support", location: "Remote, Americas", type: "Full-time", summary: "Answer with code, not ticket numbers.", salary: "$84k – $102k", posted: "2026-10-18" },
  { slug: "technical-writer", title: "Technical Writer", team: "Support", location: "Remote, Europe", type: "Part-time", summary: "Write the docs our users wish they had.", salary: "€38k – €46k (0.6 FTE)", posted: "2026-08-27" },
];

const perks = [
  { title: "Remote within UTC−5 to UTC+3", body: "Work from anywhere in that band, with four hours of overlap a day." },
  { title: "30 days off, plus local holidays", body: "And a company-wide week off between Christmas and New Year." },
  { title: "€2,400 setup budget", body: "For your desk, chair and screen, renewed every three years." },
  { title: "16 weeks paid parental leave", body: "For every parent, however your family grows." },
];

const ALL = "all";

export interface CareersProps {
  eyebrow?: string;
  title?: string;
  lead?: string;
  headingLevel?: HeadingLevel;
  roles?: Role[];
  /** Link for a role. Defaults to `/careers/<slug>`. */
  roleHref?: (role: Role) => string;
  /** Where people send an open application. */
  openApplicationHref?: string;
}

export function Careers({
  eyebrow = "Careers",
  title = "Help teams ship with less noise.",
  lead = "We're 38 people across 14 countries. Small teams, real ownership and a pace you can keep for years.",
  headingLevel = "h1",
  roles = defaultRoles,
  roleHref = (role) => `/careers/${role.slug}`,
  openApplicationHref = "mailto:jobs@lumen.dev",
}: CareersProps) {
  const [team, setTeam] = useState(ALL);
  const [location, setLocation] = useState(ALL);

  const teams = useMemo(() => [...new Set(roles.map((r) => r.team))], [roles]);
  const locations = useMemo(() => [...new Set(roles.map((r) => r.location))], [roles]);
  const shown = roles.filter((r) => (team === ALL || r.team === team) && (location === ALL || r.location === location));
  const grouped = teams.map((t) => ({ team: t, roles: shown.filter((r) => r.team === t) })).filter((g) => g.roles.length);

  return (
    <section aria-label={headingLevel === "h1" ? undefined : title} className="bg-bg text-fg">
      <PageHero eyebrow={eyebrow} title={title} lead={lead} headingLevel={headingLevel}>
        <a href="#open-roles" className="inline-flex items-center gap-2 text-accent underline-offset-4 hover:underline">
          See {roles.length} open roles
          <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
            <path d="M12 5v14M6 13l6 6 6-6" />
          </svg>
        </a>
      </PageHero>

      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <ul className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {perks.map((perk) => (
            <li key={perk.title}>
              <p className="font-medium">{perk.title}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{perk.body}</p>
            </li>
          ))}
        </ul>
      </div>

      <div id="open-roles" className="mx-auto max-w-6xl scroll-mt-20 px-5 pb-24 sm:px-8">
        <div className="flex flex-col gap-6 border-t border-line pt-16 md:flex-row md:items-end md:justify-between">
          <SectionTitle title="Open roles" />
          <div className="grid gap-3 sm:grid-cols-2 md:w-[28rem]">
            <Select value={team} onValueChange={setTeam}>
              <SelectTrigger aria-label="Filter by team">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>All teams</SelectItem>
                {teams.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger aria-label="Filter by location">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>All locations</SelectItem>
                {locations.map((l) => (
                  <SelectItem key={l} value={l}>
                    {l}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <p role="status" className="mt-6 text-sm text-muted">
          {shown.length === roles.length ? `${roles.length} roles` : `${shown.length} of ${roles.length} roles`}
        </p>

        {grouped.length === 0 ? (
          <EmptyState
            className="surface mt-6 rounded-card"
            title="No roles match those filters"
            description="Try another team or location, or send an open application."
            action={
              <Button
                onClick={() => {
                  setTeam(ALL);
                  setLocation(ALL);
                }}
              >
                Clear filters
              </Button>
            }
          />
        ) : (
          <div className="mt-6 grid gap-10">
            {grouped.map((group) => (
              <div key={group.team}>
                <h3 className="text-xs font-medium tracking-[0.2em] text-muted uppercase">
                  {group.team} <span className="tabular-nums">· {group.roles.length}</span>
                </h3>
                <ul className="mt-3 grid gap-2">
                  {group.roles.map((role) => (
                    <li key={role.slug}>
                      <a
                        href={roleHref(role)}
                        className="surface lift group flex flex-col gap-3 rounded-card p-5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:flex-row sm:items-center sm:gap-6"
                      >
                        <span className="min-w-0 flex-1">
                          <span className="block font-medium">{role.title}</span>
                          <span className="mt-1 block text-sm text-muted">{role.summary}</span>
                        </span>
                        <span className="flex flex-wrap items-center gap-2 text-sm text-muted">
                          <Badge variant="outline">{role.location}</Badge>
                          <Badge variant={role.type === "Full-time" ? "surface" : "info"}>{role.type}</Badge>
                        </span>
                        <svg viewBox="0 0 24 24" className="hidden size-5 shrink-0 text-muted transition-[translate,color] duration-300 ease-theme group-hover:translate-x-1 group-hover:text-fg sm:block" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
                          <path d="M9 6l6 6-6 6" />
                        </svg>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        <p className="mt-12 text-muted">
          Don&apos;t see your role?{" "}
          <a href={openApplicationHref} className="text-fg underline-offset-4 hover:underline">
            Send an open application
          </a>
          . We read every one.
        </p>
      </div>
    </section>
  );
}
