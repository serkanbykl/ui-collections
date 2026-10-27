import { Reveal, TextReveal } from "@/registry/kit/ui/reveal";
import { Badge } from "@/registry/kit/ui/badge";

export interface Post {
  title: string;
  excerpt: string;
  tag: string;
  date: string;
  readingTime: string;
  href: string;
}

const defaultPosts: Post[] = [
  { title: "How we made cold starts 4× faster", excerpt: "Snapshotting, lazy imports and one surprising cache that was doing nothing at all.", tag: "Engineering", date: "Oct 12, 2026", readingTime: "8 min", href: "/blog/cold-starts-4x-faster" },
  { title: "Designing for calm", excerpt: "Why our interface moves less than you'd expect, and how we decide when motion earns its place.", tag: "Design", date: "Sep 28, 2026", readingTime: "6 min", href: "/blog/designing-for-calm" },
  { title: "Preview deploys for monorepos", excerpt: "Only rebuild what changed. A walkthrough of the new affected-projects graph.", tag: "Product", date: "Sep 9, 2026", readingTime: "5 min", href: "/blog/preview-deploys-for-monorepos" },
];

const covers = [
  "from-accent/50 via-info/30 to-transparent",
  "from-info/40 via-accent/30 to-transparent",
  "from-success/40 via-info/30 to-transparent",
];

export function BlogCards({
  title = "From the journal",
  posts = defaultPosts,
  allHref = "/blog",
  headingLevel = "h2",
}: {
  title?: string;
  posts?: Post[];
  /** Link to the full list of posts. Pass null to hide it, e.g. on the blog index itself. */
  allHref?: string | null;
  /** h1 when the cards open the page, such as a blog index. */
  headingLevel?: "h1" | "h2";
}) {
  return (
    <section className="bg-bg px-6 py-24 text-fg md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-end justify-between gap-6">
          <TextReveal as={headingLevel} trigger="view" className="font-display text-4xl md:text-6xl">
            {title}
          </TextReveal>
          {allHref && (
            <a href={allHref} className="shrink-0 text-sm text-muted transition-colors hover:text-fg">
              Read all posts →
            </a>
          )}
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {posts.map((post, i) => (
            <Reveal as="article" key={post.title} delay={i * 80} className="group relative h-full">
              <div className="surface flex h-full flex-col overflow-hidden rounded-card transition-transform duration-500 ease-theme group-hover:-translate-y-1 group-has-[a:focus-visible]:outline-2 group-has-[a:focus-visible]:outline-offset-2 group-has-[a:focus-visible]:outline-accent">
                <div aria-hidden className={`relative h-44 bg-linear-to-br ${covers[i % covers.length]}`}>
                  <div className="absolute inset-0 bg-[linear-gradient(color-mix(in_oklab,var(--c-fg)_6%,transparent)_1px,transparent_1px),linear-gradient(90deg,color-mix(in_oklab,var(--c-fg)_6%,transparent)_1px,transparent_1px)] bg-size-[28px_28px]" />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center gap-2 text-xs text-muted">
                    <Badge variant="outline">{post.tag}</Badge>
                    <time>{post.date}</time>
                    <span aria-hidden>·</span>
                    <span>{post.readingTime}</span>
                  </div>
                  <h3 className="mt-4 text-xl leading-snug font-medium">
                    <a href={post.href} className="outline-none after:absolute after:inset-0">
                      {post.title}
                    </a>
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{post.excerpt}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
