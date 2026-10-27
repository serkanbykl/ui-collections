"use client";

import { PageHero, SectionTitle, tints, type HeadingLevel } from "@/registry/kit/lib/page-kit";
import { Avatar } from "@/registry/kit/ui/avatar";
import { ButtonShine, buttonVariants } from "@/registry/kit/ui/button";
import { NumberTicker } from "@/registry/kit/ui/number-ticker";
import { Reveal } from "@/registry/kit/ui/reveal";
import { SpotlightCard } from "@/registry/kit/ui/spotlight-card";

export interface AboutStat {
  value: number;
  decimals?: number;
  suffix?: string;
  label: string;
}

export interface AboutValue {
  title: string;
  body: string;
}

export interface AboutMember {
  name: string;
  role: string;
  avatar?: string;
}

export interface AboutMilestone {
  year: string;
  text: string;
}

export interface AboutProps {
  eyebrow?: string;
  title?: string;
  lead?: string;
  /** h1 when the block opens the page, h2 when it sits under another header. */
  headingLevel?: HeadingLevel;
  stats?: AboutStat[];
  story?: string[];
  milestones?: AboutMilestone[];
  values?: AboutValue[];
  team?: AboutMember[];
  careersHref?: string;
  contactHref?: string;
  /** Line under "Work with us", e.g. how many roles are open. */
  hiringNote?: string;
}

const defaultStats: AboutStat[] = [
  { value: 4183, label: "teams ship with Lumen" },
  { value: 61, label: "countries" },
  { value: 99.97, decimals: 2, suffix: "%", label: "uptime over 12 months" },
  { value: 38, label: "people, fully remote" },
];

const defaultStory = [
  "Lumen started in 2019 as an internal tool at a twelve-person agency. Every Friday release meant a night of clicking through checklists, and we wanted our evenings back.",
  "We rebuilt it for other teams in 2021. Today it runs reviews, previews and releases for product teams from three-person studios to public companies, and it is still built by a small group that answers its own support tickets.",
];

const defaultMilestones: AboutMilestone[] = [
  { year: "2019", text: "First version ships inside Northwind Studio." },
  { year: "2021", text: "Public launch. 212 teams in the first month." },
  { year: "2023", text: "Series A, led by Fieldstone. Offices stay optional." },
  { year: "2026", text: "SOC 2 Type II and the EU data region." },
];

const defaultValues: AboutValue[] = [
  { title: "Calm over clever", body: "Software should lower the temperature in the room. We cut features that add noise, even popular ones." },
  { title: "Show the work", body: "Roadmap, incidents and pricing changes are public. If we got something wrong, the post-mortem says so." },
  { title: "Small, senior teams", body: "Groups of four own a problem end to end, from the first sketch to the support reply." },
  { title: "Sustainable pace", body: "No launch is worth a burnt-out team. We plan in six-week cycles with two weeks to breathe." },
];

const defaultTeam: AboutMember[] = [
  { name: "Ada Kowalski", role: "Co-founder, CEO" },
  { name: "Mateo Ruiz", role: "Co-founder, Design" },
  { name: "Jun Lee", role: "Head of Infrastructure" },
  { name: "Sara Okafor", role: "Developer Experience" },
  { name: "Liam Novak", role: "Security Lead" },
  { name: "Priya Shah", role: "Head of Support" },
  { name: "Tomás Herrera", role: "Product Engineer" },
  { name: "Hana Sato", role: "Product Designer" },
];

export function About({
  eyebrow = "About Lumen",
  title = "We build calm tools for teams that ship.",
  lead = "Lumen takes the busywork out of reviews and releases, so your team spends Friday afternoons on the work, not the checklist.",
  headingLevel = "h1",
  stats = defaultStats,
  story = defaultStory,
  milestones = defaultMilestones,
  values = defaultValues,
  team = defaultTeam,
  careersHref = "/careers",
  contactHref = "/contact",
  hiringNote = "7 open roles across engineering, design and support. Remote within UTC−5 to UTC+3.",
}: AboutProps) {
  return (
    <section aria-label={headingLevel === "h1" ? undefined : title} className="bg-bg text-fg">
      <PageHero eyebrow={eyebrow} title={title} lead={lead} headingLevel={headingLevel} />

      <div className="border-y border-line bg-bg">
        <dl className="mx-auto grid max-w-6xl grid-cols-2 gap-px px-5 sm:px-8 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col-reverse py-10 pr-4">
              <dt className="mt-2 text-sm text-muted">{stat.label}</dt>
              <dd className="font-display text-4xl tabular-nums md:text-5xl">
                <NumberTicker value={stat.value} decimals={stat.decimals} suffix={stat.suffix} />
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-24 sm:px-8 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:gap-20">
        <div>
          <SectionTitle title="How it started" />
          <div className="mt-6 grid gap-5 text-lg leading-relaxed text-muted">
            {story.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
        </div>
        <ol className="relative grid content-start gap-8 border-l border-line pl-6 md:mt-20">
          {milestones.map((m, i) => (
            <Reveal as="li" key={m.year} delay={i * 80} className="relative">
              <span className="absolute top-1.5 -left-[1.71rem] size-2.5 rounded-full bg-accent ring-4 ring-bg" aria-hidden />
              <p className="font-display text-2xl text-accent tabular-nums">{m.year}</p>
              <p className="mt-1 text-fg/85">{m.text}</p>
            </Reveal>
          ))}
        </ol>
      </div>

      <div className="bg-bg-deep py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <SectionTitle title="What we value" lead="Four rules we hire for, plan by and hold each other to." />
          <ul className="mt-12 grid gap-4 sm:grid-cols-2">
            {values.map((v, i) => (
              <Reveal as="li" key={v.title} delay={(i % 2) * 80} className="h-full">
                <SpotlightCard className="h-full p-7">
                  <span className="font-display text-xl text-accent tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="mt-4 text-lg font-medium">{v.title}</h3>
                  <p className="mt-2 leading-relaxed text-muted">{v.body}</p>
                </SpotlightCard>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
        <SectionTitle title="The team" lead={`${team.length} of the 38 people who build, support and sell Lumen.`} />
        <ul className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
          {team.map((m, i) => (
            <Reveal as="li" key={m.name} delay={(i % 4) * 60}>
              <Avatar
                src={m.avatar}
                alt={m.name}
                className="size-20 font-display text-2xl"
                fallbackClassName={`bg-linear-to-br ${tints[i % tints.length]} text-accent-fg`}
              />
              <p className="mt-4 font-medium">{m.name}</p>
              <p className="text-sm text-muted">{m.role}</p>
            </Reveal>
          ))}
        </ul>

        <div className="surface mt-20 flex flex-col items-start justify-between gap-6 rounded-card p-8 md:flex-row md:items-center md:p-10">
          <div>
            <h2 className="font-display text-3xl md:text-4xl">Work with us</h2>
            <p className="mt-2 text-muted">{hiringNote}</p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <a href={careersHref} className={buttonVariants({ variant: "solid", size: "lg" })}>
              <ButtonShine />
              See open roles
            </a>
            <a href={contactHref} className={buttonVariants({ variant: "ghost", size: "lg" })}>
              Contact us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
