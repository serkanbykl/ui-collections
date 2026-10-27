"use client";

import { useEffect, useState, type ReactNode } from "react";

import { tints } from "@/registry/kit/lib/page-kit";
import { cn } from "@/registry/kit/lib/utils";
import { AuroraBackdrop } from "@/registry/kit/ui/aurora-backdrop";
import { Avatar } from "@/registry/kit/ui/avatar";
import { Badge } from "@/registry/kit/ui/badge";
import { Breadcrumb } from "@/registry/kit/ui/breadcrumb";
import { Button } from "@/registry/kit/ui/button";

export interface PostSection {
  id: string;
  title: string;
  /** Paragraphs, or any markup. */
  body: string[] | ReactNode;
}

export interface PostAuthor {
  name: string;
  role: string;
  bio?: string;
  avatar?: string;
  href?: string;
}

export interface RelatedPost {
  title: string;
  tag: string;
  readingTime: string;
  href: string;
}

export interface BlogPostProps {
  tag?: string;
  title?: string;
  excerpt?: string;
  author?: PostAuthor;
  /** ISO date. */
  date?: string;
  readingTime?: string;
  sections?: PostSection[];
  related?: RelatedPost[];
  /** Pull quote placed after the section at `after` (0-based). Pass null to hide. */
  pullQuote?: { text: string; cite: string; after: number } | null;
  blogHref?: string;
  /** Canonical URL used by the share links. Defaults to the current page. */
  url?: string;
  /** Called by the share buttons instead of opening share pages. */
  onShare?: (channel: "copy" | "x" | "linkedin" | "email") => void;
}

const defaultAuthor: PostAuthor = {
  name: "Sara Okafor",
  role: "Developer Experience",
  bio: "Sara leads developer experience at Lumen. Before that she ran docs at Kitebase for five years.",
  href: "/blog/authors/sara-okafor",
};

const defaultSections: PostSection[] = [
  {
    id: "the-problem",
    title: "Reviews were the slowest step",
    body: [
      "In March we looked at 11,482 pull requests across 316 teams. The median one waited 3.4 hours for its first review, longer than it took to write.",
      "Most of that time wasn't spent reviewing. It was spent noticing. Reviewers found out about requests from a stream of notifications that also carried deploy logs, comments and bot messages.",
    ],
  },
  {
    id: "what-we-changed",
    title: "What we changed",
    body: [
      "We split review requests out of the notification stream into a queue of their own, sorted by how long each request had been waiting rather than by when it arrived.",
      "Each request now carries a one-line summary of what changed and which files matter most, so a reviewer can decide in seconds whether it is theirs to take.",
    ],
  },
  {
    id: "results",
    title: "Results after 90 days",
    body: [
      "Median time to first review fell from 3.4 hours to 52 minutes. Requests left waiting overnight dropped by 71%.",
      "The number of comments per review stayed flat, which was the result we cared about most: faster didn't mean shallower.",
    ],
  },
  {
    id: "whats-next",
    title: "What's next",
    body: [
      "Next quarter we're testing suggested reviewers based on who last touched the code. If you'd like early access, turn on Labs in your workspace settings.",
    ],
  },
];

const defaultRelated: RelatedPost[] = [
  { title: "How we made cold starts 4× faster", tag: "Engineering", readingTime: "8 min", href: "/blog/cold-starts-4x-faster" },
  { title: "Designing for calm", tag: "Design", readingTime: "6 min", href: "/blog/designing-for-calm" },
  { title: "Preview deploys for monorepos", tag: "Product", readingTime: "5 min", href: "/blog/preview-deploys-for-monorepos" },
];

const shareIcons = {
  copy: "M9 15 15 9M10.5 6.5l1.8-1.8a4 4 0 0 1 5.7 5.7l-1.8 1.8M13.5 17.5l-1.8 1.8a4 4 0 0 1-5.7-5.7l1.8-1.8",
  x: "M5 4.5h3.6l10.4 15H15.4L5 4.5ZM18.5 4.5l-5.3 6.1M10.8 13.4 5.5 19.5",
  linkedin: "M7 10v7M7 7v.01M11 17v-4a2.5 2.5 0 0 1 5 0v4M11 10v7M4.5 3.5h15a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1h-15a1 1 0 0 1-1-1v-15a1 1 0 0 1 1-1Z",
  email: "M4 6.5h16v11H4zM4.5 7l7.5 6 7.5-6",
};

function ShareRow({ title, url, onShare }: { title: string; url?: string; onShare?: BlogPostProps["onShare"] }) {
  const [copied, setCopied] = useState(false);

  function share(channel: keyof typeof shareIcons) {
    if (onShare) return onShare(channel);
    const link = url ?? window.location.href;
    if (channel === "copy") {
      navigator.clipboard?.writeText(link).catch(() => undefined);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
      return;
    }
    const target = {
      x: `https://x.com/intent/post?text=${encodeURIComponent(title)}&url=${encodeURIComponent(link)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(link)}`,
      email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(link)}`,
    }[channel];
    window.open(target, "_blank", "noopener,noreferrer");
  }

  const labels = { copy: "Copy link", x: "Share on X", linkedin: "Share on LinkedIn", email: "Share by email" };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {(Object.keys(shareIcons) as (keyof typeof shareIcons)[]).map((channel) => (
        <Button key={channel} size="icon-sm" variant="ghost" aria-label={labels[channel]} title={labels[channel]} onClick={() => share(channel)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d={shareIcons[channel]} />
          </svg>
        </Button>
      ))}
      <span role="status" className="text-xs text-success">
        {copied ? "Link copied" : ""}
      </span>
    </div>
  );
}

export function BlogPost({
  tag = "Product",
  title = "How we cut review time from 3.4 hours to 52 minutes",
  excerpt = "A queue of its own, a one-line summary on every request, and what 90 days of data told us.",
  author = defaultAuthor,
  date = "2026-10-21",
  readingTime = "7 min read",
  sections = defaultSections,
  related = defaultRelated,
  pullQuote = {
    text: "We weren't slow at reviewing. We were slow at noticing there was something to review.",
    cite: "Jun Lee, Head of Infrastructure",
    after: 1,
  },
  blogHref = "/blog",
  url,
  onShare,
}: BlogPostProps) {
  const [active, setActive] = useState(sections[0]?.id);

  // Highlight the section currently near the top of the viewport.
  useEffect(() => {
    const targets = sections.map((s) => document.getElementById(s.id)).filter((el): el is HTMLElement => !!el);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-15% 0px -70% 0px" },
    );
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  const published = new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

  const toc = (
    <ol className="grid gap-1 text-sm">
      {sections.map((s) => (
        <li key={s.id}>
          <a
            href={`#${s.id}`}
            aria-current={active === s.id ? "location" : undefined}
            className={cn(
              "block border-l-2 py-1.5 pl-3 transition-colors duration-300",
              active === s.id ? "border-accent text-fg" : "border-transparent text-muted hover:text-fg",
            )}
          >
            {s.title}
          </a>
        </li>
      ))}
    </ol>
  );

  return (
    <article className="bg-bg text-fg">
      <header className="relative isolate overflow-hidden bg-bg-deep pt-20 pb-14 md:pt-28 md:pb-20">
        <AuroraBackdrop grid={false} className="opacity-70" />
        <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:pl-[calc(14rem+6rem)]">
          <Breadcrumb items={[{ label: "Blog", href: blogHref }, { label: tag, href: `${blogHref}?tag=${encodeURIComponent(tag.toLowerCase())}` }, { label: "This post" }]} />
          <h1 className="mt-6 max-w-3xl font-display text-4xl leading-[1.05] sm:text-5xl md:text-6xl">{title}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">{excerpt}</p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
            <div className="flex items-center gap-3">
              <Avatar src={author.avatar} alt={author.name} fallbackClassName={`bg-linear-to-br ${tints[0]} text-accent-fg`} />
              <div className="text-sm">
                {author.href ? (
                  <a href={author.href} className="font-medium underline-offset-4 hover:underline">
                    {author.name}
                  </a>
                ) : (
                  <p className="font-medium">{author.name}</p>
                )}
                <p className="text-muted">{author.role}</p>
              </div>
            </div>
            <p className="flex items-center gap-2 text-sm text-muted">
              <time dateTime={date}>{published}</time>
              <span aria-hidden>·</span>
              {readingTime}
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-16">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <details className="surface rounded-card p-4 lg:hidden">
            <summary className="cursor-pointer text-sm font-medium">On this page</summary>
            <nav aria-label="Table of contents" className="mt-3">
              {toc}
            </nav>
          </details>
          <nav aria-label="Table of contents" className="hidden lg:block">
            <p className="mb-3 text-xs font-medium tracking-[0.2em] text-muted uppercase">On this page</p>
            {toc}
          </nav>
          <div className="mt-8 hidden lg:block">
            <p className="mb-2 text-xs font-medium tracking-[0.2em] text-muted uppercase">Share</p>
            <ShareRow title={title} url={url} onShare={onShare} />
          </div>
        </aside>

        <div className="min-w-0 max-w-[68ch]">
          <div className="mb-10">
            <Badge variant="accent">{tag}</Badge>
          </div>
          {sections.map((s, i) => (
            <section key={s.id} aria-labelledby={s.id} className={i ? "mt-12" : undefined}>
              <h2 id={s.id} className="scroll-mt-24 font-display text-3xl">
                {s.title}
              </h2>
              <div className="mt-4 grid gap-5 text-lg leading-relaxed text-fg/85">
                {Array.isArray(s.body) ? s.body.map((p: string) => <p key={p.slice(0, 32)}>{p}</p>) : s.body}
              </div>
              {pullQuote && pullQuote.after === i && (
                <figure className="my-10 border-l-2 border-accent pl-6">
                  <blockquote className="font-display text-2xl leading-snug">“{pullQuote.text}”</blockquote>
                  <figcaption className="mt-3 text-sm text-muted">{pullQuote.cite}</figcaption>
                </figure>
              )}
            </section>
          ))}

          <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6 lg:hidden">
            <span className="text-sm text-muted">Share this post</span>
            <ShareRow title={title} url={url} onShare={onShare} />
          </div>

          {author.bio && (
            <div className="surface mt-14 flex flex-col gap-4 rounded-card p-6 sm:flex-row sm:items-start">
              <Avatar src={author.avatar} alt={author.name} size="lg" fallbackClassName={`bg-linear-to-br ${tints[0]} text-accent-fg`} />
              <div>
                <p className="text-xs tracking-[0.2em] text-muted uppercase">Written by</p>
                <p className="mt-1 font-medium">{author.name}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">{author.bio}</p>
                {author.href && (
                  <a href={author.href} className="mt-3 inline-block text-sm text-accent underline-offset-4 hover:underline">
                    More posts by {author.name.split(" ")[0]}
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section aria-labelledby="related-posts" className="border-t border-line bg-bg-deep py-16">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 id="related-posts" className="font-display text-3xl md:text-4xl">
                Keep reading
              </h2>
              <a href={blogHref} className="text-sm text-accent underline-offset-4 hover:underline">
                All posts
              </a>
            </div>
            <ul className="mt-8 grid gap-4 md:grid-cols-3">
              {related.map((post, i) => (
                <li key={post.href}>
                  <a
                    href={post.href}
                    className="surface lift group flex h-full flex-col rounded-card p-6 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  >
                    <span aria-hidden className={cn("mb-6 block h-24 rounded-field bg-linear-to-br", tints[(i + 1) % tints.length])} />
                    <span className="text-xs text-muted">
                      {post.tag} · {post.readingTime}
                    </span>
                    <span className="mt-2 text-lg font-medium underline-offset-4 group-hover:underline">{post.title}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </article>
  );
}
