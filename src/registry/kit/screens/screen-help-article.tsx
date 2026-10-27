"use client";

import { useEffect, useState } from "react";

import { cn } from "@/registry/kit/lib/utils";
import { Alert } from "@/registry/kit/ui/alert";
import { Avatar } from "@/registry/kit/ui/avatar";
import { Button } from "@/registry/kit/ui/button";
import { Textarea } from "@/registry/kit/ui/field";
import { Kbd } from "@/registry/kit/ui/kbd";
import { PageHeader } from "@/registry/kit/ui/page-header";

export interface ArticleSection {
  id: string;
  title: string;
  body: React.ReactNode;
}

export interface HelpArticle {
  title: string;
  summary: string;
  category: string;
  updated: string;
  readTime: string;
  author: string;
  sections: ArticleSection[];
}

const Step = ({ n, children }: { n: number; children: React.ReactNode }) => (
  <li className="flex gap-3">
    <span aria-hidden className="grid size-6 shrink-0 place-items-center rounded-full bg-accent/15 text-xs font-semibold text-accent">
      {n}
    </span>
    <span className="pt-0.5">{children}</span>
  </li>
);

export const sampleHelpArticle: HelpArticle = {
  title: "Set up single sign-on with Okta",
  summary: "Let people sign in with their Okta account, and stop managing separate passwords for the workspace.",
  category: "Security and SSO",
  updated: "Updated Oct 19, 2026",
  readTime: "6 min read",
  author: "Leila Haddad",
  sections: [
    {
      id: "before",
      title: "Before you start",
      body: (
        <>
          <p>SSO is on the Growth and Scale plans. You need to be a workspace admin here and an Okta administrator on your side.</p>
          <Alert variant="info" title="Keep one admin on password sign-in">
            Until you&apos;ve tested the connection, leave at least one admin able to sign in with a password, so a typo in the setup can&apos;t lock everyone out.
          </Alert>
        </>
      ),
    },
    {
      id: "create-app",
      title: "Create the app in Okta",
      body: (
        <ol className="grid gap-3">
          <Step n={1}>
            In the Okta admin console, open <strong>Applications</strong> and choose <strong>Create App Integration</strong>.
          </Step>
          <Step n={2}>
            Pick <strong>SAML 2.0</strong> and name the app <em>Lumen</em>.
          </Step>
          <Step n={3}>
            Paste the ACS URL and entity ID from <strong>Settings → Security → Single sign-on</strong> in Lumen.
          </Step>
          <Step n={4}>Set the name ID format to email address, then save.</Step>
        </ol>
      ),
    },
    {
      id: "connect",
      title: "Connect it to Lumen",
      body: (
        <>
          <p>Download the IdP metadata XML from the app&apos;s <strong>Sign On</strong> tab and upload it in Lumen. We read the certificate and sign-in URL from it.</p>
          <div className="surface-field rounded-field">
            <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed">
              {`Entity ID   https://app.lumen.dev/saml/northwind
ACS URL     https://app.lumen.dev/saml/northwind/acs
Name ID     user.email`}
            </pre>
          </div>
        </>
      ),
    },
    {
      id: "test",
      title: "Test, then enforce",
      body: (
        <>
          <p>
            Choose <strong>Test connection</strong>. A new window opens and signs you in through Okta. When it says the test passed, turn on{" "}
            <strong>Require SSO</strong>.
          </p>
          <p>
            People who are signed in stay signed in. Next time they sign in, they&apos;ll be sent to Okta. Press <Kbd>Esc</Kbd> on the sign-in page to use a
            recovery code instead.
          </p>
        </>
      ),
    },
    {
      id: "troubleshooting",
      title: "If something goes wrong",
      body: (
        <ul className="grid list-disc gap-2 pl-5">
          <li>
            <strong>“Audience mismatch”</strong> means the entity ID in Okta doesn&apos;t match the one in Lumen exactly, including the trailing slash.
          </li>
          <li>
            <strong>“User not assigned”</strong> means the person isn&apos;t assigned to the Lumen app in Okta yet.
          </li>
          <li>Clock skew over 3 minutes between Okta and your network rejects the response. Check the server time.</li>
        </ul>
      ),
    },
  ],
};

export interface HelpArticleScreenProps {
  article?: HelpArticle;
  related?: { id: string; title: string; href: string }[];
  helpHref?: string;
  onFeedback?: (helpful: boolean, comment?: string) => void;
  className?: string;
}

const defaultRelated = [
  { id: "r1", title: "Provision people automatically with SCIM", href: "#/app/help/article" },
  { id: "r2", title: "Turn on two-factor authentication", href: "#/app/help/article" },
  { id: "r3", title: "Read the audit log", href: "#/app/help/article" },
];

/** A help article with breadcrumbs, a table of contents that follows your scroll, related reading and a “Was this helpful?” prompt. */
export function HelpArticleScreen({
  article = sampleHelpArticle,
  related = defaultRelated,
  helpHref = "#/app/help",
  onFeedback,
  className,
}: HelpArticleScreenProps) {
  const [active, setActive] = useState(article.sections[0]?.id);

  useEffect(() => {
    const targets = article.sections.map((s) => document.getElementById(s.id)).filter((el): el is HTMLElement => el !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-15% 0px -65% 0px" },
    );
    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, [article.sections]);

  function jump(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setActive(id);
  }

  return (
    <div className={cn("grid min-w-0 grid-cols-1 gap-6", className)}>
      <div className="grid min-w-0 grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_15rem]">
        <article className="min-w-0">
          <PageHeader
            className="border-b border-line pb-6"
            eyebrow={
              <a href={helpHref} className="rounded-sm outline-none transition-colors hover:text-fg focus-visible:outline-2 focus-visible:outline-accent">
                Help center · {article.category}
              </a>
            }
            title={article.title}
            description={article.summary}
          >
            <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-muted">
              <Avatar size="sm" alt={article.author} fallbackClassName="bg-accent/15 font-semibold text-accent" />
              <span>
                <span className="text-fg">{article.author}</span> · {article.updated} · {article.readTime}
              </span>
            </div>
          </PageHeader>

          <nav aria-label="On this page" className="surface mt-6 rounded-card p-4 lg:hidden">
            <p className="text-xs font-medium text-muted">On this page</p>
            <ol className="mt-2 grid gap-1 text-sm">
              {article.sections.map((s) => (
                <li key={s.id}>
                  <button type="button" onClick={() => jump(s.id)} className="cursor-pointer rounded-sm text-left text-muted outline-none hover:text-fg focus-visible:outline-2 focus-visible:outline-accent">
                    {s.title}
                  </button>
                </li>
              ))}
            </ol>
          </nav>

          <div className="mt-8 grid grid-cols-1 gap-10">
            {article.sections.map((s) => (
              <section key={s.id} id={s.id} aria-labelledby={`${s.id}-title`} className="scroll-mt-24">
                <h3 id={`${s.id}-title`} className="text-xl font-semibold">
                  {s.title}
                </h3>
                <div className="mt-3 grid grid-cols-1 gap-4 leading-relaxed text-fg/85 [&_strong]:font-semibold [&_strong]:text-fg">{s.body}</div>
              </section>
            ))}
          </div>

          <Feedback onFeedback={onFeedback} />

          <section className="mt-10">
            <h3 className="font-semibold">Related articles</h3>
            <ul className="mt-3 grid gap-2">
              {related.map((r) => (
                <li key={r.id}>
                  <a href={r.href} className="rounded-sm text-accent outline-none hover:underline focus-visible:outline-2 focus-visible:outline-accent">
                    {r.title}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </article>

        <nav aria-label="Table of contents" className="hidden lg:sticky lg:top-24 lg:block lg:self-start">
          <p className="text-xs font-medium tracking-wide text-muted uppercase">On this page</p>
          <ol className="mt-3 grid gap-0.5 border-l border-line">
            {article.sections.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => jump(s.id)}
                  aria-current={active === s.id ? "location" : undefined}
                  className={cn(
                    "-ml-px block w-full cursor-pointer border-l-2 py-1.5 pl-4 text-left text-sm outline-none transition-colors focus-visible:outline-2 focus-visible:outline-accent",
                    active === s.id ? "border-accent text-fg" : "border-transparent text-muted hover:text-fg",
                  )}
                >
                  {s.title}
                </button>
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </div>
  );
}

function Feedback({ onFeedback }: { onFeedback?: (helpful: boolean, comment?: string) => void }) {
  const [answer, setAnswer] = useState<"yes" | "no" | null>(null);
  const [comment, setComment] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <section aria-labelledby="feedback-title" className="surface mt-12 rounded-card p-5 md:p-6">
      {sent ? (
        <p role="status" className="text-sm">
          Thanks. {answer === "yes" ? "Glad it helped." : "The docs team reads every note and usually updates the article within a week."}
        </p>
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 id="feedback-title" className="font-semibold">
              Was this helpful?
            </h3>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={answer === "yes" ? "accent" : "surface"}
                aria-pressed={answer === "yes"}
                onClick={() => {
                  setAnswer("yes");
                  setSent(true);
                  onFeedback?.(true);
                }}
              >
                Yes, it helped
              </Button>
              <Button size="sm" variant={answer === "no" ? "accent" : "surface"} aria-pressed={answer === "no"} onClick={() => setAnswer("no")}>
                Not really
              </Button>
            </div>
          </div>
          {answer === "no" && (
            <form
              className="mt-4 grid gap-3"
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
                onFeedback?.(false, comment.trim() || undefined);
              }}
            >
              <Textarea label="What was missing or unclear?" rows={3} value={comment} onChange={(e) => setComment(e.target.value)} hint="Optional. Don't include passwords or personal data." />
              <div className="flex justify-end">
                <Button type="submit" variant="accent" size="sm">
                  Send feedback
                </Button>
              </div>
            </form>
          )}
        </>
      )}
    </section>
  );
}
