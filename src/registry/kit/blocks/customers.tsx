"use client";

import { useState } from "react";

import { PageHero, SectionTitle, tints, type HeadingLevel } from "@/registry/kit/lib/page-kit";
import { cn } from "@/registry/kit/lib/utils";
import { Avatar } from "@/registry/kit/ui/avatar";
import { ButtonShine, buttonVariants } from "@/registry/kit/ui/button";
import { Reveal } from "@/registry/kit/ui/reveal";
import { SegmentedControl } from "@/registry/kit/ui/segmented-control";

export interface CustomerLogo {
  name: string;
  industry: string;
}

export interface CaseStudyCard {
  company: string;
  industry: string;
  metric: string;
  metricLabel: string;
  quote: string;
  person: string;
  role: string;
  href: string;
}

export interface CustomersProps {
  eyebrow?: string;
  title?: string;
  lead?: string;
  headingLevel?: HeadingLevel;
  logos?: CustomerLogo[];
  stories?: CaseStudyCard[];
  signUpHref?: string;
  salesHref?: string;
}

const defaultLogos: CustomerLogo[] = [
  { name: "Northwind", industry: "Agencies" },
  { name: "Polaris", industry: "SaaS" },
  { name: "Kitebase", industry: "SaaS" },
  { name: "Halcyon", industry: "Fintech" },
  { name: "Orbitly", industry: "SaaS" },
  { name: "Quarry", industry: "Agencies" },
  { name: "Fernhill", industry: "Fintech" },
  { name: "Lattice & Co", industry: "Agencies" },
  { name: "Monolith", industry: "SaaS" },
  { name: "Tallyhost", industry: "SaaS" },
  { name: "Brightledger", industry: "Fintech" },
  { name: "Studio Vale", industry: "Agencies" },
];

const defaultStories: CaseStudyCard[] = [
  {
    company: "Halcyon",
    industry: "Fintech",
    metric: "71%",
    metricLabel: "fewer releases rolled back",
    quote: "Our auditors now ask for the Lumen export instead of a spreadsheet.",
    person: "Noor Haddad",
    role: "VP Engineering",
    href: "/customers/halcyon",
  },
  {
    company: "Northwind Studio",
    industry: "Agencies",
    metric: "38",
    metricLabel: "client projects moved in a week",
    quote: "Reviews that took two days now close before lunch.",
    person: "Mira Okafor",
    role: "Head of Delivery",
    href: "/customers/northwind",
  },
  {
    company: "Kitebase",
    industry: "SaaS",
    metric: "4.2×",
    metricLabel: "more deploys per engineer",
    quote: "We stopped batching releases because there was no longer a reason to.",
    person: "Elias Brandt",
    role: "CTO",
    href: "/customers/kitebase",
  },
];

const wordmarkStyles = [
  "font-display text-2xl",
  "text-lg font-semibold tracking-tight",
  "font-mono text-sm tracking-widest uppercase",
  "text-lg font-medium italic",
];

export function Customers({
  eyebrow = "Customers",
  title = "4,183 teams ship with Lumen.",
  lead = "From three-person studios to listed fintechs. Here's what changed for a few of them.",
  headingLevel = "h1",
  logos = defaultLogos,
  stories = defaultStories,
  signUpHref = "/signup",
  salesHref = "/contact",
}: CustomersProps) {
  const industries = ["All", ...new Set(logos.map((l) => l.industry))];
  const [industry, setIndustry] = useState("All");
  const shownStories = stories.filter((s) => industry === "All" || s.industry === industry);

  return (
    <section aria-label={headingLevel === "h1" ? undefined : title} className="bg-bg text-fg">
      <PageHero eyebrow={eyebrow} title={title} lead={lead} headingLevel={headingLevel} align="center" />

      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <div className="flex flex-col items-center gap-4">
          <SegmentedControl
            aria-label="Filter customers by industry"
            options={industries.map((value) => ({ value, label: value }))}
            value={industry}
            onValueChange={setIndustry}
          />
          <p role="status" className="text-sm text-muted">
            {industry === "All" ? `Showing all ${logos.length} featured customers` : `${logos.filter((l) => l.industry === industry).length} ${industry.toLowerCase()} customers highlighted`}
          </p>
        </div>

        <ul className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-3 lg:grid-cols-4">
          {logos.map((logo, i) => {
            const on = industry === "All" || logo.industry === industry;
            return (
              <li
                key={logo.name}
                className={cn(
                  "grid h-28 place-items-center bg-bg px-4 text-center transition-[opacity,color] duration-500 ease-theme",
                  on ? "text-fg/80" : "text-fg/80 opacity-25",
                )}
              >
                <span className={wordmarkStyles[i % wordmarkStyles.length]}>{logo.name}</span>
                <span className="sr-only">, {logo.industry}</span>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="bg-bg-deep py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <SectionTitle title="Customer stories" lead="Numbers from their own dashboards, checked with each team before publishing." />
          {shownStories.length === 0 ? (
            <p className="mt-10 text-muted">
              No published stories for {industry.toLowerCase()} yet.{" "}
              <button type="button" className="cursor-pointer text-accent underline-offset-4 hover:underline" onClick={() => setIndustry("All")}>
                Show all stories
              </button>
            </p>
          ) : (
            <ul className="mt-12 grid gap-4 md:grid-cols-3">
              {shownStories.map((story, i) => (
                <Reveal as="li" key={story.href} delay={i * 80} className="h-full">
                  <a
                    href={story.href}
                    className="surface lift group flex h-full flex-col rounded-card p-7 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  >
                    <span className="text-sm text-muted">
                      {story.company} · {story.industry}
                    </span>
                    <span className="mt-6 font-display text-6xl leading-none text-accent tabular-nums">{story.metric}</span>
                    <span className="mt-2 text-sm text-muted">{story.metricLabel}</span>
                    <span className="mt-6 flex-1 text-lg leading-snug">“{story.quote}”</span>
                    <span className="mt-6 flex items-center gap-3">
                      <Avatar alt={story.person} size="sm" fallbackClassName={`bg-linear-to-br ${tints[i % tints.length]} text-accent-fg`} />
                      <span className="text-sm">
                        <span className="block font-medium">{story.person}</span>
                        <span className="block text-muted">{story.role}</span>
                      </span>
                    </span>
                    <span className="mt-6 inline-flex items-center gap-1.5 text-sm text-accent">
                      Read the story
                      <svg viewBox="0 0 24 24" className="size-4 transition-[translate] duration-300 ease-theme group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    </span>
                  </a>
                </Reveal>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5 py-20 text-center sm:px-8">
        <h2 className="mx-auto max-w-2xl font-display text-4xl md:text-5xl">Your team could be the next story.</h2>
        <p className="mx-auto mt-4 max-w-lg text-muted">Free for 14 days. Most teams run their first review within the hour.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a href={signUpHref} className={buttonVariants({ variant: "solid", size: "lg" })}>
            <ButtonShine />
            Start a free trial
          </a>
          <a href={salesHref} className={buttonVariants({ variant: "ghost", size: "lg" })}>
            Talk to sales
          </a>
        </div>
      </div>
    </section>
  );
}
