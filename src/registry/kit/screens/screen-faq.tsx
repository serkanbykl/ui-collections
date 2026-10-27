"use client";

import { useState } from "react";

import { cn } from "@/registry/kit/lib/utils";
import { Accordion } from "@/registry/kit/ui/accordion";
import { buttonVariants } from "@/registry/kit/ui/button";
import { SearchInput } from "@/registry/kit/ui/search-input";
import { SegmentedControl } from "@/registry/kit/ui/segmented-control";
import { EmptyState } from "@/registry/kit/ui/states";
import { PageHeader } from "@/registry/kit/ui/page-header";

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface FaqGroup {
  id: string;
  title: string;
  items: FaqItem[];
}

export const sampleFaqGroups: FaqGroup[] = [
  {
    id: "account",
    title: "Account",
    items: [
      { id: "q1", question: "How do I change the email I sign in with?", answer: "Go to Settings → General and edit your email. We send a confirmation link to the new address, and the old one keeps working until you click it." },
      { id: "q2", question: "Can I have more than one workspace?", answer: "Yes. Use the workspace switcher at the top of the sidebar to create or join another. Each workspace is billed separately." },
      { id: "q3", question: "What happens to my data if I delete my account?", answer: "Your profile and personal files are removed after 14 days. Projects you own move to the workspace owner, so your team doesn't lose work." },
    ],
  },
  {
    id: "billing",
    title: "Billing",
    items: [
      { id: "q4", question: "Do you charge for invited people who haven't joined?", answer: "A pending invite holds a seat but isn't charged until it's accepted. Invites expire after 7 days." },
      { id: "q5", question: "How are seats prorated?", answer: "Seats added mid-cycle are charged for the days left in the cycle. Seats you remove are credited on the next invoice, never refunded to the card." },
      { id: "q6", question: "Can I pay by invoice instead of card?", answer: "On the Scale plan, yes. Payment terms are 30 days, in USD or EUR. Contact support to switch." },
      { id: "q7", question: "Where do I add a VAT or tax ID?", answer: "In Settings → Billing, under the payment method. It appears on every invoice from the next one onwards." },
    ],
  },
  {
    id: "security",
    title: "Security",
    items: [
      { id: "q8", question: "Where is my data stored?", answer: "In AWS eu-central-1 (Frankfurt) for EU workspaces and us-east-2 (Ohio) for everyone else. Backups stay in the same region." },
      { id: "q9", question: "Do you support SAML single sign-on?", answer: "Yes, on Growth and Scale. Okta, Microsoft Entra ID, Google Workspace and OneLogin all work, and any SAML 2.0 provider should." },
      { id: "q10", question: "Can admins see my private notes?", answer: "No. Private notes are visible only to you. Admins can see projects, comments and the audit log, but not private notes or drafts." },
    ],
  },
  {
    id: "integrations",
    title: "Integrations",
    items: [
      { id: "q11", question: "Is there a rate limit on the API?", answer: "600 requests per minute per key, with bursts up to 100 per second. Responses include headers showing what's left." },
      { id: "q12", question: "Why didn't my webhook fire?", answer: "Check the endpoint is enabled and returns a 2xx within 10 seconds. We retry failures with backoff for 24 hours, and the delivery log shows each attempt." },
    ],
  },
];

export interface FaqScreenProps {
  groups?: FaqGroup[];
  contactHref?: string;
  className?: string;
}

/** Frequently asked questions in grouped accordions, filtered by topic and a search that matches questions and answers. */
export function FaqScreen({ groups = sampleFaqGroups, contactHref = "#/app/help/contact", className }: FaqScreenProps) {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState("all");
  const q = query.trim().toLowerCase();

  const filtered = groups
    .filter((g) => topic === "all" || g.id === topic)
    .map((g) => ({ ...g, items: g.items.filter((i) => !q || `${i.question} ${i.answer}`.toLowerCase().includes(q)) }))
    .filter((g) => g.items.length > 0);
  const total = filtered.reduce((n, g) => n + g.items.length, 0);

  return (
    <div className={cn("grid min-w-0 grid-cols-1 gap-6", className)}>
      <PageHeader
        title="Frequently asked questions"
        description={`${groups.reduce((n, g) => n + g.items.length, 0)} answers in ${groups.length} topics, each linked to more detail in the help center.`}
      />

      <div className="flex flex-wrap items-center gap-3">
        <SearchInput label="Search questions" value={query} onValueChange={setQuery} className="min-w-0 flex-1 basis-60 md:max-w-sm" />
        <div className="-mx-1 max-w-full overflow-x-auto px-1 py-0.5">
          <SegmentedControl
            aria-label="Topic"
            value={topic}
            onValueChange={setTopic}
            options={[{ value: "all", label: "All" }, ...groups.map((g) => ({ value: g.id, label: g.title }))]}
          />
        </div>
      </div>

      <p className="text-sm text-muted" aria-live="polite">
        {q || topic !== "all" ? `${total} ${total === 1 ? "question" : "questions"} found` : `${total} questions in ${groups.length} topics`}
      </p>

      {filtered.length ? (
        <div className="grid gap-8">
          {filtered.map((g) => (
            <section key={g.id} aria-labelledby={`faq-${g.id}`} className="grid gap-3 lg:grid-cols-[12rem_minmax(0,1fr)] lg:gap-8">
              <h3 id={`faq-${g.id}`} className="text-lg font-semibold lg:pt-4">
                {g.title}
                <span className="ml-2 text-sm font-normal text-muted">{g.items.length}</span>
              </h3>
              <Accordion
                key={`${g.id}-${q}`}
                type="multiple"
                defaultOpen={q ? g.items.map((i) => i.id) : []}
                items={g.items.map((i) => ({
                  id: i.id,
                  title: <Highlight text={i.question} query={q} />,
                  content: (
                    <p className="leading-relaxed text-muted">
                      <Highlight text={i.answer} query={q} />
                    </p>
                  ),
                }))}
              />
            </section>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No questions match"
          description="Try a different word, or ask us directly."
          action={
            <a href={contactHref} className={buttonVariants({ size: "sm" })}>
              Ask support
            </a>
          }
        />
      )}

      <section className="surface flex flex-wrap items-center justify-between gap-4 rounded-card p-5 md:p-6">
        <div>
          <h3 className="font-semibold">Didn&apos;t find your answer?</h3>
          <p className="mt-1 text-sm text-muted">Write to us and a person replies, usually within 2 hours on weekdays.</p>
        </div>
        <a href={contactHref} className={buttonVariants({ variant: "accent" })}>
          Contact support
        </a>
      </section>
    </div>
  );
}

function Highlight({ text, query }: { text: string; query: string }) {
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
