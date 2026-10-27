import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { SiteLink as Link } from "@/components/site/site-link";
import { categories, entriesIn, isCategory, listedCategories } from "@/catalog";
import { ComponentGrid } from "@/components/site/component-grid";
import { buttonVariants } from "@/registry/kit/ui/button";
import { Skeleton } from "@/registry/kit/ui/skeleton";
import { EmptyState } from "@/registry/kit/ui/states";

export function generateStaticParams() {
  return listedCategories.map((category) => ({ category }));
}

export async function generateMetadata({ params }: PageProps<"/[collection]/[category]">): Promise<Metadata> {
  const { category } = await params;
  return isCategory(category) ? { title: categories[category].title, description: categories[category].description } : {};
}

export default function CategoryPage({ params }: PageProps<"/[collection]/[category]">) {
  return (
    <Suspense fallback={<ListingSkeleton />}>
      <CategoryListing params={params} />
    </Suspense>
  );
}

function ListingSkeleton() {
  return (
    <div role="status" aria-label="Loading">
      <Skeleton className="h-14 w-1/2 rounded-field" />
      <Skeleton className="mt-5 h-6 w-full max-w-xl rounded-field" />
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <Skeleton key={i} className="h-56 rounded-card" />
        ))}
      </div>
    </div>
  );
}

async function CategoryListing({ params }: { params: PageProps<"/[collection]/[category]">["params"] }) {
  const { category } = await params;
  if (!isCategory(category) || !categories[category].listed) notFound();
  const meta = categories[category];
  const entries = entriesIn(category);

  return (
    <article>
      <header className="max-w-2xl">
        <h1 className="font-display text-5xl leading-none md:text-6xl">{meta.title}</h1>
        <p className="mt-5 text-lg leading-relaxed text-muted">{meta.description}</p>
      </header>
      {entries.length > 0 ? (
        <ComponentGrid entries={entries} className="mt-12" />
      ) : (
        <EmptyState
          className="surface mt-12 rounded-card"
          title={`No ${meta.title.toLowerCase()} yet`}
          description="The first ones are being built. Until then, the components are ready to install."
          action={
            <Link href="/components" className={buttonVariants({ size: "sm" })}>
              Browse components
            </Link>
          }
        />
      )}
    </article>
  );
}
