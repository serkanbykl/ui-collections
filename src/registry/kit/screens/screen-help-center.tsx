"use client";

import { useState } from "react";

import { cn } from "@/registry/kit/lib/utils";
import { Badge } from "@/registry/kit/ui/badge";
import { buttonVariants } from "@/registry/kit/ui/button";
import { Chip, ChipGroup } from "@/registry/kit/ui/chip";
import { SearchInput } from "@/registry/kit/ui/search-input";
import { EmptyState } from "@/registry/kit/ui/states";
import { PageHeader } from "@/registry/kit/ui/page-header";

export interface HelpCategory {
  id: string;
  title: string;
  description: string;
  articles: number;
  /** SVG path drawn in the category tile. */
  icon: string;
  tone: "accent" | "info" | "success" | "warning";
}

export interface HelpArticleSummary {
  id: string;
  title: string;
  category: string;
  readTime: string;
  views: number;
}

export const sampleHelpCategories: HelpCategory[] = [
  { id: "start", title: "Getting started", description: "Set up a workspace, invite your team and import projects.", articles: 18, icon: "M5 12h14M12 5l7 7-7 7", tone: "accent" },
  { id: "projects", title: "Projects and tasks", description: "Boards, timelines, dependencies and recurring work.", articles: 34, icon: "M4 6h16M4 12h10M4 18h7", tone: "info" },
  { id: "billing", title: "Billing and plans", description: "Invoices, seats, tax IDs and changing your plan.", articles: 21, icon: "M3 7h18v10H3zM3 11h18", tone: "success" },
  { id: "security", title: "Security and SSO", description: "Two-factor, SAML, SCIM and audit logs.", articles: 15, icon: "M12 3 5 6v5c0 4.5 3 8.3 7 10 4-1.7 7-5.5 7-10V6z", tone: "warning" },
  { id: "integrations", title: "Integrations", description: "Slack, GitHub, Figma, Zapier and the API.", articles: 27, icon: "M9 7H7a5 5 0 0 0 0 10h2M15 7h2a5 5 0 0 1 0 10h-2M8 12h8", tone: "info" },
  { id: "account", title: "Your account", description: "Profile, notifications, language and data export.", articles: 12, icon: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 21c1-4 4.2-6 8-6s7 2 8 6", tone: "accent" },
];

export const sampleHelpArticles: HelpArticleSummary[] = [
  { id: "a1", title: "Set up single sign-on with Okta", category: "Security and SSO", readTime: "6 min", views: 4_812 },
  { id: "a2", title: "Add or remove seats mid-cycle", category: "Billing and plans", readTime: "3 min", views: 3_977 },
  { id: "a3", title: "Import projects from a CSV file", category: "Getting started", readTime: "5 min", views: 3_604 },
  { id: "a4", title: "Connect GitHub and link pull requests", category: "Integrations", readTime: "4 min", views: 2_941 },
  { id: "a5", title: "Turn on two-factor authentication", category: "Security and SSO", readTime: "2 min", views: 2_388 },
  { id: "a6", title: "Recurring tasks and how they repeat", category: "Projects and tasks", readTime: "4 min", views: 2_106 },
  { id: "a7", title: "Download invoices and add a tax ID", category: "Billing and plans", readTime: "2 min", views: 1_873 },
  { id: "a8", title: "Export all workspace data", category: "Your account", readTime: "3 min", views: 1_219 },
];

const toneClass = {
  accent: "bg-accent/15 text-accent",
  info: "bg-info/15 text-info",
  success: "bg-success/15 text-success",
  warning: "bg-warning/15 text-warning",
};

export interface HelpCenterScreenProps {
  categories?: HelpCategory[];
  articles?: HelpArticleSummary[];
  /** Builds the link for an article. */
  articleHref?: (id: string) => string;
  /** Builds the link for a category. */
  categoryHref?: (id: string) => string;
  contactHref?: string;
  className?: string;
}

/** Support home: a search hero that filters articles live, category cards, popular articles and a way to reach a person. */
export function HelpCenterScreen({
  categories = sampleHelpCategories,
  articles = sampleHelpArticles,
  articleHref = () => "#/app/help/article",
  categoryHref = () => "#/app/help/faq",
  contactHref = "#/app/help/contact",
  className,
}: HelpCenterScreenProps) {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState<string | null>(null);
  const topics = [...new Set(articles.map((a) => a.category))];
  const popular = topic ? articles.filter((a) => a.category === topic) : articles.slice(0, 6);
  const q = query.trim().toLowerCase();
  const results = q ? articles.filter((a) => `${a.title} ${a.category}`.toLowerCase().includes(q)) : [];

  return (
    <div className={cn("grid min-w-0 grid-cols-1 gap-8", className)}>
      <PageHeader
        title="Help center"
        description={`${categories.reduce((n, c) => n + c.articles, 0)} articles in ${categories.length} topics, and a person to write to when they don't cover it`}
      />
      <section className="surface relative overflow-hidden rounded-card px-5 py-10 text-center md:px-10 md:py-14">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_80%_at_50%_0%,color-mix(in_oklab,var(--color-accent)_22%,transparent),transparent_70%)]"
        />
        <div className="relative mx-auto grid max-w-xl gap-5">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">How can we help?</h2>
            <p className="mt-3 text-muted">Search 127 articles, or browse by topic below.</p>
          </div>
          <SearchInput label="Search help articles" value={query} onValueChange={setQuery} shortcut className="text-left" />
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs text-muted">Popular:</span>
            {["SSO", "invoices", "import"].map((term) => (
              <Chip key={term} size="sm" onClick={() => setQuery(term)}>
                {term}
              </Chip>
            ))}
          </div>
        </div>
      </section>

      {q ? (
        <section aria-live="polite" className="grid gap-3">
          <h3 className="text-lg font-semibold">
            {results.length} {results.length === 1 ? "result" : "results"} for “{query.trim()}”
          </h3>
          {results.length ? (
            <ArticleList articles={results} href={articleHref} />
          ) : (
            <EmptyState
              title="No articles match"
              description="Try fewer words, or ask the support team. Replies usually take under 2 hours on weekdays."
              action={
                <a href={contactHref} className="text-sm font-medium text-accent hover:underline">
                  Contact support
                </a>
              }
            />
          )}
        </section>
      ) : (
        <>
          <section className="grid gap-4">
            <h3 className="text-lg font-semibold">Browse by topic</h3>
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {categories.map((c) => (
                <li key={c.id}>
                  <a
                    href={categoryHref(c.id)}
                    className="group surface lift flex h-full flex-col gap-3 rounded-card p-5 outline-none focus-visible:outline-2 focus-visible:outline-accent"
                  >
                    <span aria-hidden className={cn("grid size-10 place-items-center rounded-field", toneClass[c.tone])}>
                      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                        <path d={c.icon} />
                      </svg>
                    </span>
                    <span className="font-semibold group-hover:text-accent">{c.title}</span>
                    <span className="text-sm text-muted">{c.description}</span>
                    <span className="mt-auto text-xs text-muted">{c.articles} articles</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>

          <div className="grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
            <section className="grid content-start gap-3">
              <h3 className="text-lg font-semibold">Popular articles</h3>
              <ChipGroup
                label="Filter popular articles by topic"
                size="sm"
                scroll
                deselectable
                value={topic}
                onValueChange={setTopic}
                options={topics.map((t) => ({ value: t, label: t }))}
              />
              <ArticleList articles={popular} href={articleHref} ranked={!topic} />
            </section>
            <aside className="surface grid content-start gap-3 rounded-card p-5">
              <h3 className="font-semibold">Still stuck?</h3>
              <p className="text-sm text-muted">Our support team answers in English, Spanish and German, Monday to Friday 08:00–20:00 CET.</p>
              <dl className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-xs text-muted">Median first reply</dt>
                  <dd className="font-semibold">1 h 47 min</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted">Status</dt>
                  <dd>
                    <Badge dot variant="success">
                      All systems normal
                    </Badge>
                  </dd>
                </div>
              </dl>
              <a href={contactHref} className={buttonVariants({ variant: "accent", className: "mt-1" })}>
                Contact support
              </a>
            </aside>
          </div>
        </>
      )}
    </div>
  );
}

function ArticleList({ articles, href, ranked = false }: { articles: HelpArticleSummary[]; href: (id: string) => string; ranked?: boolean }) {
  return (
    <ol className="surface divide-y divide-line rounded-card">
      {articles.map((a, i) => (
        <li key={a.id}>
          <a
            href={href(a.id)}
            className="group flex items-center gap-4 px-5 py-4 outline-none transition-colors first:rounded-t-card last:rounded-b-card hover:bg-surface-hover focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent"
          >
            {ranked && <span className="w-5 shrink-0 font-mono text-xs text-muted tabular-nums">{String(i + 1).padStart(2, "0")}</span>}
            <span className="min-w-0 flex-1">
              <span className="block font-medium group-hover:text-accent">{a.title}</span>
              <span className="text-xs text-muted">
                {a.category} · {a.readTime} read · {a.views.toLocaleString("en-US")} views
              </span>
            </span>
            <svg viewBox="0 0 24 24" className="size-4 shrink-0 text-muted" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden>
              <path d="m9 6 6 6-6 6" />
            </svg>
          </a>
        </li>
      ))}
    </ol>
  );
}
