import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { SiteLink as Link } from "@/components/site/site-link";
import { categories, entriesIn, entryHref, getEntry, listedCatalog } from "@/catalog";
import { getCollection } from "@/collections";
import { EngineBadge } from "@/components/site/chrome";
import { CodeBlock, CommandLine } from "@/components/site/code-block";
import { PreviewFrame } from "@/components/site/preview-frame";
import { PreviewStage } from "@/components/site/preview-stage";
import { demoFile, demos } from "@/demos";
import { installCommand } from "@/lib/site";
import { collection } from "next/root-params";
import { readSource } from "@/lib/source";

type Params = PageProps<"/[collection]/[category]/[slug]">["params"];

export function generateStaticParams() {
  return listedCatalog.map((e) => ({ category: e.category, slug: e.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[collection]/[category]/[slug]">): Promise<Metadata> {
  const { category, slug } = await params;
  const entry = getEntry(category, slug);
  return entry ? { title: entry.name, description: entry.description } : {};
}

export default function EntryPage({ params }: PageProps<"/[collection]/[category]/[slug]">) {
  return (
    <Suspense fallback={<DocSkeleton />}>
      <EntryDoc params={params} />
    </Suspense>
  );
}

function DocSkeleton() {
  return (
    <div aria-hidden className="animate-pulse">
      <div className="h-6 w-20 rounded-control bg-fg/[0.06]" />
      <div className="mt-5 h-14 w-2/3 rounded-field bg-fg/[0.06]" />
      <div className="mt-5 h-6 w-full max-w-xl rounded-field bg-fg/[0.04]" />
      <div className="mt-10 h-96 rounded-card bg-fg/[0.04]" />
    </div>
  );
}

function DocSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-14">
      <h2 className="mb-5 font-display text-3xl">{title}</h2>
      {children}
    </section>
  );
}

async function EntryDoc({ params }: { params: Params }) {
  const { category, slug } = await params;
  const entry = getEntry(category, slug);
  if (!entry || !categories[entry.category].listed) notFound();
  const Demo = demos[entry.category]?.[slug];
  if (!Demo) notFound();

  const [usage, ...sources] = await Promise.all([
    readSource(demoFile(entry.category, slug)),
    ...entry.files.map((file) => readSource(`registry/kit/${file}`)),
  ]);
  const siblings = entriesIn(entry.category);
  const index = siblings.indexOf(entry);
  const prev = siblings[index - 1];
  const next = siblings[index + 1];
  const packages = ["clsx", "tailwind-merge", ...(entry.dependencies ?? [])];
  const framed = categories[entry.category].framed;

  return (
    <article>
      <header className="max-w-2xl">
        <div className="flex items-center gap-3">
          <Link href={`/${entry.category}`} className="text-xs tracking-[0.2em] text-muted uppercase hover:text-fg">
            {categories[entry.category].title}
          </Link>
          <EngineBadge engine={entry.engine} />
        </div>
        <h1 className="mt-5 font-display text-5xl leading-none md:text-6xl">{entry.name}</h1>
        <p className="mt-5 text-lg leading-relaxed text-muted">{entry.description}</p>
      </header>

      <div className="mt-10">
        {framed ? (
          <PreviewFrame src={`/view/${entry.category}/${slug}`} height={entry.previewHeight} title={`${entry.name} preview`} />
        ) : (
          <PreviewStage>
            <Demo />
          </PreviewStage>
        )}
      </div>

      <DocSection title="Installation">
        <CommandLine command={installCommand(getCollection(await collection()).id, slug)} />
        <p className="mt-4 text-sm leading-relaxed text-muted">
          Also installs the theme, <code className="text-fg/85">cn()</code>
          {entry.uses?.length ? <> and {entry.uses.join(", ")}</> : null}. Packages:{" "}
          {packages.map((p, i) => (
            <span key={p}>
              <code className="text-fg/85">{p}</code>
              {i < packages.length - 1 && ", "}
            </span>
          ))}
          .
        </p>
      </DocSection>

      <DocSection title="Usage">
        <CodeBlock code={usage} lang="tsx" title={`${slug}-demo.tsx`} />
      </DocSection>

      {entry.props && entry.props.length > 0 && (
        <DocSection title="API">
          <div className="overflow-hidden rounded-card border border-line">
            {entry.props.map((prop) => (
              <div
                key={prop.name}
                className="grid gap-2 border-line px-5 py-4 not-first:border-t md:grid-cols-[11rem_minmax(0,1fr)] md:gap-6"
              >
                <div>
                  <code className="text-sm text-accent">{prop.name}</code>
                  {prop.default && <div className="mt-1 font-mono text-xs text-muted">= {prop.default}</div>}
                </div>
                <div>
                  <code className="font-mono text-xs break-words text-fg/70">{prop.type}</code>
                  <p className="mt-1 text-sm text-muted">{prop.description}</p>
                </div>
              </div>
            ))}
          </div>
        </DocSection>
      )}

      <DocSection title="Source">
        <div className="grid gap-4">
          {sources.map((code, i) => (
            <CodeBlock key={entry.files[i]} code={code} lang="tsx" title={`components/${entry.files[i]}`} />
          ))}
        </div>
      </DocSection>

      <nav aria-label="Pagination" className="mt-16 grid grid-cols-2 gap-4 border-t border-line pt-8">
        {prev ? (
          <Link href={entryHref(prev)} className="group text-sm">
            <span className="text-muted">Previous</span>
            <span className="mt-1 block font-display text-2xl transition-colors group-hover:text-accent">{prev.name}</span>
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link href={entryHref(next)} className="group text-right text-sm">
            <span className="text-muted">Next</span>
            <span className="mt-1 block font-display text-2xl transition-colors group-hover:text-accent">{next.name}</span>
          </Link>
        )}
      </nav>
    </article>
  );
}
