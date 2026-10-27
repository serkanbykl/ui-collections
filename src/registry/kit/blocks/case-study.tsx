"use client";

import { tints } from "@/registry/kit/lib/page-kit";
import { AuroraBackdrop } from "@/registry/kit/ui/aurora-backdrop";
import { Avatar } from "@/registry/kit/ui/avatar";
import { Badge } from "@/registry/kit/ui/badge";
import { Breadcrumb } from "@/registry/kit/ui/breadcrumb";
import { ButtonShine, buttonVariants } from "@/registry/kit/ui/button";
import { NumberTicker } from "@/registry/kit/ui/number-ticker";
import { Reveal } from "@/registry/kit/ui/reveal";

export interface CaseMetric {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  label: string;
}

export interface CaseChapter {
  title: string;
  paragraphs: string[];
}

export interface CaseStudyProps {
  company?: string;
  industry?: string;
  title?: string;
  summary?: string;
  metrics?: CaseMetric[];
  facts?: { label: string; value: string }[];
  chapters?: CaseChapter[];
  quote?: { text: string; name: string; role: string; avatar?: string };
  /** Index of the chapter the quote follows. */
  quoteAfter?: number;
  customersHref?: string;
  signUpHref?: string;
  salesHref?: string;
  next?: { company: string; title: string; href: string } | null;
}

const defaultMetrics: CaseMetric[] = [
  { value: 71, suffix: "%", label: "fewer releases rolled back" },
  { value: 52, suffix: " min", label: "median time to first review, down from 3.4 hours" },
  { value: 2.6, decimals: 1, suffix: "×", label: "more releases each week" },
];

const defaultFacts = [
  { label: "Industry", value: "Fintech, payments" },
  { label: "Team size", value: "214 engineers" },
  { label: "Headquarters", value: "Amsterdam" },
  { label: "Using Lumen since", value: "March 2025" },
  { label: "Products", value: "Reviews, Releases, Audit log" },
];

const defaultChapters: CaseChapter[] = [
  {
    title: "The challenge",
    paragraphs: [
      "Halcyon processes card payments for 9,400 merchants across Europe. Every release needed sign-off from two engineers and a compliance lead, tracked in a spreadsheet that took a day to reconcile before each audit.",
      "Releases had drifted to once a week. Each one bundled around 60 changes, and when something broke it took hours to find which change was responsible.",
    ],
  },
  {
    title: "The approach",
    paragraphs: [
      "The platform team rolled Lumen out to one squad first. Review requests moved into a dedicated queue, and every approval was written to the audit log with the reviewer, the diff and the time.",
      "After six weeks the rest of engineering followed. Compliance got read-only access to the audit log and stopped asking for the spreadsheet.",
    ],
  },
  {
    title: "The results",
    paragraphs: [
      "Smaller, more frequent releases made rollbacks rarer and easier. When one is needed, the release page shows exactly which change to revert.",
      "The last two audits closed without a single follow-up request about change management.",
    ],
  },
];

const defaultQuote = {
  text: "Our auditors now ask for the Lumen export instead of a spreadsheet. That alone gave us back a week every quarter.",
  name: "Noor Haddad",
  role: "VP Engineering, Halcyon",
};

export function CaseStudy({
  company = "Halcyon",
  industry = "Fintech",
  title = "How Halcyon ships 2.6× more often, with 71% fewer rollbacks.",
  summary = "A payments company with strict change control replaced its release spreadsheet with a review queue and an audit log its compliance team trusts.",
  metrics = defaultMetrics,
  facts = defaultFacts,
  chapters = defaultChapters,
  quote = defaultQuote,
  quoteAfter = 0,
  customersHref = "/customers",
  signUpHref = "/signup",
  salesHref = "/contact",
  next = { company: "Northwind Studio", title: "38 client projects moved in a week", href: "/customers/northwind" },
}: CaseStudyProps) {
  return (
    <article className="bg-bg text-fg">
      <header className="relative isolate overflow-hidden bg-bg-deep pt-20 pb-16 md:pt-28">
        <AuroraBackdrop grid={false} className="opacity-70" />
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Breadcrumb items={[{ label: "Customers", href: customersHref }, { label: company }]} />
          <div className="mt-6 flex flex-wrap gap-2">
            <Badge variant="accent">{company}</Badge>
            <Badge variant="outline">{industry}</Badge>
          </div>
          <h1 className="mt-5 max-w-4xl font-display text-4xl leading-[1.05] sm:text-5xl md:text-6xl">{title}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">{summary}</p>

          <dl className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {metrics.map((m, i) => (
              <Reveal key={m.label} trigger="load" delay={200 + i * 100} className="surface flex flex-col-reverse justify-end rounded-card p-6">
                <dt className="mt-2 text-sm leading-snug text-muted">{m.label}</dt>
                <dd className="font-display text-5xl leading-none text-accent tabular-nums">
                  <NumberTicker value={m.value} decimals={m.decimals} prefix={m.prefix} suffix={m.suffix} />
                </dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-16">
        <aside aria-label={`About ${company}`} className="lg:sticky lg:top-24 lg:self-start">
          <dl className="surface grid gap-4 rounded-card p-6 text-sm">
            {facts.map((f) => (
              <div key={f.label}>
                <dt className="text-xs tracking-[0.15em] text-muted uppercase">{f.label}</dt>
                <dd className="mt-1">{f.value}</dd>
              </div>
            ))}
          </dl>
        </aside>

        <div className="max-w-[68ch] min-w-0">
          {chapters.map((chapter, i) => (
            <section key={chapter.title} aria-labelledby={`chapter-${i}`} className={i ? "mt-14" : undefined}>
              <h2 id={`chapter-${i}`} className="font-display text-3xl md:text-4xl">
                {chapter.title}
              </h2>
              <div className="mt-4 grid gap-5 text-lg leading-relaxed text-fg/85">
                {chapter.paragraphs.map((p) => (
                  <p key={p.slice(0, 32)}>{p}</p>
                ))}
              </div>
              {quote && i === quoteAfter && (
                <Reveal as="div" className="my-14">
                  <figure className="surface rounded-card p-8 md:p-10">
                    <svg viewBox="0 0 32 24" className="h-6 w-8 text-accent" fill="currentColor" aria-hidden>
                      <path d="M0 24V14C0 6 4.5 1.3 12 0l1.4 3.4C9 4.8 7 7.5 6.8 11H12v13H0Zm19 0V14c0-8 4.5-12.7 12-14l1 3.4c-4.4 1.4-6.4 4.1-6.6 7.6H31v13H19Z" />
                    </svg>
                    <blockquote className="mt-6 font-display text-2xl leading-snug md:text-3xl">{quote.text}</blockquote>
                    <figcaption className="mt-8 flex items-center gap-3">
                      <Avatar src={quote.avatar} alt={quote.name} fallbackClassName={`bg-linear-to-br ${tints[0]} text-accent-fg`} />
                      <span className="text-sm">
                        <span className="block font-medium">{quote.name}</span>
                        <span className="block text-muted">{quote.role}</span>
                      </span>
                    </figcaption>
                  </figure>
                </Reveal>
              )}
            </section>
          ))}

          <div className="mt-16 flex flex-col gap-6 border-t border-line pt-10 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="font-display text-3xl">See it on your own releases</h2>
              <p className="mt-2 text-muted">Free for 14 days, with the audit log included.</p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-3">
              <a href={signUpHref} className={buttonVariants({ variant: "solid" })}>
                <ButtonShine />
                Start a free trial
              </a>
              <a href={salesHref} className={buttonVariants({ variant: "ghost" })}>
                Talk to sales
              </a>
            </div>
          </div>
        </div>
      </div>

      {next && (
        <a
          href={next.href}
          className="group block border-t border-line bg-bg-deep py-14 transition-colors duration-300 hover:bg-surface-hover focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent"
        >
          <span className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 sm:px-8">
            <span>
              <span className="block text-xs tracking-[0.2em] text-muted uppercase">Next story · {next.company}</span>
              <span className="mt-2 block font-display text-3xl md:text-4xl">{next.title}</span>
            </span>
            <svg viewBox="0 0 24 24" className="size-8 shrink-0 text-muted transition-[translate,color] duration-300 ease-theme group-hover:translate-x-1 group-hover:text-fg" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </span>
        </a>
      )}
    </article>
  );
}
