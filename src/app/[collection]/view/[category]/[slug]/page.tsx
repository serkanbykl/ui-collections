import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { collection } from "next/root-params";
import { Suspense } from "react";

import { catalog, getEntry } from "@/catalog";
import { getCollection } from "@/collections";
import { StandaloneDock } from "@/components/site/standalone-dock";
import { demos } from "@/demos";

/** Bare render of one entry, for docs iframes and "Open in new tab". */

export const metadata: Metadata = { robots: { index: false } };

/** Full pages get the theme dock when opened on their own. */
const docked = new Set(["templates", "dashboards"]);

export function generateStaticParams() {
  return catalog.map((e) => ({ category: e.category, slug: e.slug }));
}

export default function ViewPage({ params }: PageProps<"/[collection]/view/[category]/[slug]">) {
  return (
    <Suspense>
      <View params={params} />
    </Suspense>
  );
}

async function View({ params }: { params: PageProps<"/[collection]/view/[category]/[slug]">["params"] }) {
  const { category, slug } = await params;
  const entry = getEntry(category, slug);
  if (!entry) notFound();
  const Demo = demos[entry.category]?.[slug];
  if (!Demo) notFound();
  return (
    <>
      <Demo />
      {docked.has(entry.category) && <StandaloneDock collection={getCollection(await collection()).id} />}
    </>
  );
}
