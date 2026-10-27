import { collection } from "next/root-params";

import { SiteLink as Link } from "@/components/site/site-link";
import { getCollection } from "@/collections";
import { buttonVariants } from "@/registry/kit/ui/button";

import { SiteFooter, Wordmark } from "./chrome";
import { DocsSearch, SearchTrigger } from "./docs-search";
import { DocsMobileNav, DocsQuickLinks, DocsSidebar } from "./docs-sidebar";

/** App-style docs layout: a full-height sidebar on desktop, a drawer on mobile. */
export async function DocsShell({ children }: { children: React.ReactNode }) {
  const c = getCollection(await collection());

  return (
    <div className="lg:grid lg:grid-cols-[17rem_minmax(0,1fr)]">
      <aside className="sticky top-0 hidden h-dvh border-r border-dashed border-line bg-bg-deep/40 lg:block">
        <DocsSidebar name={c.name} />
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-40 border-b border-line bg-bg/75 backdrop-blur-xl">
          <div className="flex h-16 items-center gap-3 px-4 md:px-8">
            <DocsMobileNav name={c.name} className="lg:hidden" />
            <Wordmark className="lg:hidden" />
            <SearchTrigger className="hidden max-w-xs md:flex lg:hidden" />
            <nav aria-label="Sections" className="ml-auto flex items-center gap-1">
              <DocsQuickLinks />
              <Link href="/" className={buttonVariants({ size: "sm" })}>
                Home
              </Link>
            </nav>
          </div>
        </header>
        <main id="main" className="mx-auto w-full max-w-5xl px-5 py-10 md:px-10 md:py-14">{children}</main>
        <SiteFooter />
      </div>
      <DocsSearch />

    </div>
  );
}
