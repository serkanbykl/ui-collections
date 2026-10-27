"use client";

import { useState } from "react";

import { cn } from "@/registry/kit/lib/utils";
import { Avatar } from "@/registry/kit/ui/avatar";
import { Badge } from "@/registry/kit/ui/badge";
import { Button } from "@/registry/kit/ui/button";
import { SearchInput } from "@/registry/kit/ui/search-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/registry/kit/ui/select";
import { EmptyState } from "@/registry/kit/ui/states";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/kit/ui/tabs";
import { PageHeader } from "@/registry/kit/ui/page-header";

export type SearchResultType = "people" | "projects" | "files" | "messages";

export interface SearchResult {
  id: string;
  type: SearchResultType;
  title: string;
  /** Line of context under the title; matches are highlighted. */
  snippet: string;
  meta: string;
  /** Days since last change, for sorting by recency. */
  age: number;
  href: string;
}

export const sampleSearchResults: SearchResult[] = [
  { id: "r1", type: "projects", title: "Invoice PDF layout", snippet: "Redesign the invoice template so totals, tax and payment terms fit on one page.", meta: "Finance · 46% done", age: 1, href: "#/app/projects" },
  { id: "r2", type: "files", title: "invoice-template-v4.fig", snippet: "Figma file · last edited by Priya Raman", meta: "Design / Billing · 18.4 MB", age: 2, href: "#/app/files" },
  { id: "r3", type: "messages", title: "#billing-squad", snippet: "Hana: the October invoice for Halden Freight still shows the old VAT number, can someone regenerate it?", meta: "Hana Sato · Oct 23", age: 3, href: "#/app/chat" },
  { id: "r4", type: "people", title: "Hana Sato", snippet: "Finance operations · owns invoice runs and collections", meta: "Finance · Tokyo", age: 0, href: "#/app/profile" },
  { id: "r5", type: "files", title: "Q3 invoice export.csv", snippet: "1,284 rows · invoice number, client, amount, status", meta: "Finance / Reports · 212 KB", age: 26, href: "#/app/files" },
  { id: "r6", type: "projects", title: "Automated invoice reminders", snippet: "Send reminders 3, 7 and 14 days after an invoice is due, then flag for follow-up.", meta: "Growth · 12% done", age: 9, href: "#/app/projects" },
  { id: "r7", type: "messages", title: "Direct message with Lukas Brandt", snippet: "Lukas: the invoice webhook retries were caused by a 30 s timeout on our side, fixed in 2.41.", meta: "Lukas Brandt · Oct 19", age: 7, href: "#/app/chat" },
  { id: "r8", type: "people", title: "Jonah Whitfield", snippet: "Accounts receivable · invoice disputes and refunds", meta: "Finance · Dublin", age: 14, href: "#/app/profile" },
  { id: "r9", type: "files", title: "Invoice terms 2026.pdf", snippet: "Standard payment terms: net 30, 1.5% monthly late fee", meta: "Legal · 96 KB", age: 61, href: "#/app/files" },
];

const typeMeta: Record<SearchResultType, { label: string; icon: string; tint: string }> = {
  people: { label: "People", icon: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 21c1-4 4.2-6 8-6s7 2 8 6", tint: "bg-accent/15 text-accent" },
  projects: { label: "Projects", icon: "M4 6h16M4 12h10M4 18h7", tint: "bg-info/15 text-info" },
  files: { label: "Files", icon: "M7 3h7l5 5v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1ZM14 3v5h5", tint: "bg-warning/15 text-warning" },
  messages: { label: "Messages", icon: "M4 5h16v11H8l-4 4V5Z", tint: "bg-success/15 text-success" },
};

export interface SearchResultsScreenProps {
  results?: SearchResult[];
  /** Query the page opens with. */
  initialQuery?: string;
  className?: string;
}

/** Results across people, projects, files and messages: tabs with counts, highlighted matches, sorting and an empty state. */
export function SearchResultsScreen({ results = sampleSearchResults, initialQuery = "invoice", className }: SearchResultsScreenProps) {
  const [query, setQuery] = useState(initialQuery);
  const [sort, setSort] = useState<"relevance" | "recent">("relevance");
  const q = query.trim().toLowerCase();

  const matches = (q ? results.filter((r) => `${r.title} ${r.snippet} ${r.meta}`.toLowerCase().includes(q)) : [])
    .map((r) => ({ r, score: (r.title.toLowerCase().includes(q) ? 2 : 0) + (r.snippet.toLowerCase().includes(q) ? 1 : 0) }))
    .sort((a, b) => (sort === "recent" ? a.r.age - b.r.age : b.score - a.score || a.r.age - b.r.age))
    .map((x) => x.r);

  const tabs: ("all" | SearchResultType)[] = ["all", "people", "projects", "files", "messages"];
  const count = (t: "all" | SearchResultType) => (t === "all" ? matches.length : matches.filter((r) => r.type === t).length);

  return (
    <div className={cn("grid min-w-0 grid-cols-1 gap-6", className)}>
      <div className="grid gap-4">
        <PageHeader
          title="Search"
          description={
            q
              ? `${matches.length} ${matches.length === 1 ? "result" : "results"} for “${query.trim()}” across people, projects, files and messages`
              : "People, projects, files and messages across the workspace"
          }
        />
        <SearchInput label="Search everything" value={query} onValueChange={setQuery} shortcut className="max-w-2xl" />
      </div>

      {!q ? (
        <EmptyState title="Search the whole workspace" description="People, projects, files and messages. Press Ctrl K from anywhere to jump here." />
      ) : (
        <Tabs defaultValue="all" className="grid min-w-0 grid-cols-1 gap-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="-mx-1 max-w-full overflow-x-auto px-1 pb-1">
              <TabsList aria-label="Result type">
                {tabs.map((t) => (
                  <TabsTrigger key={t} value={t}>
                    {t === "all" ? "All" : typeMeta[t].label}
                    <span className="ml-1.5 text-xs text-muted tabular-nums">{count(t)}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            <div className="flex items-center gap-2">
              <span id="search-sort" className="text-sm text-muted">
                Sort
              </span>
              <Select value={sort} onValueChange={(v) => setSort(v as typeof sort)}>
                <SelectTrigger aria-labelledby="search-sort" className="h-9 w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Best match</SelectItem>
                  <SelectItem value="recent">Most recent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {tabs.map((t) => {
            const list = t === "all" ? matches : matches.filter((r) => r.type === t);
            return (
              <TabsContent key={t} value={t} className="min-w-0">
                {list.length ? (
                  <ul className="surface divide-y divide-line rounded-card">
                    {list.map((r) => (
                      <li key={r.id}>
                        <a
                          href={r.href}
                          className="group flex gap-4 px-5 py-4 outline-none transition-colors first:rounded-t-card last:rounded-b-card hover:bg-surface-hover focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent"
                        >
                          {r.type === "people" ? (
                            <Avatar alt={r.title} fallbackClassName={typeMeta.people.tint} className="mt-0.5" />
                          ) : (
                            <span aria-hidden className={cn("mt-0.5 grid size-10 shrink-0 place-items-center rounded-field", typeMeta[r.type].tint)}>
                              <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                                <path d={typeMeta[r.type].icon} />
                              </svg>
                            </span>
                          )}
                          <span className="min-w-0 flex-1">
                            <span className="flex flex-wrap items-center gap-2">
                              <span className="font-medium group-hover:text-accent">
                                <Mark text={r.title} query={q} />
                              </span>
                              {t === "all" && <Badge variant="surface">{typeMeta[r.type].label}</Badge>}
                            </span>
                            <span className="mt-1 line-clamp-2 block text-sm text-muted">
                              <Mark text={r.snippet} query={q} />
                            </span>
                            <span className="mt-1 block text-xs text-subtle">{r.meta}</span>
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <EmptyState
                    title={`No ${t === "all" ? "results" : typeMeta[t].label.toLowerCase()} for “${query.trim()}”`}
                    description="Check the spelling, try a shorter word, or search a different type."
                    action={
                      <Button size="sm" onClick={() => setQuery("")}>
                        Clear search
                      </Button>
                    }
                  />
                )}
              </TabsContent>
            );
          })}
        </Tabs>
      )}
    </div>
  );
}

function Mark({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>;
  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query ? (
          <mark key={i} className="rounded-sm bg-accent/25 px-0.5 text-fg">
            {part}
          </mark>
        ) : (
          part
        ),
      )}
    </>
  );
}
