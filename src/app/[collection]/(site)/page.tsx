import { collection } from "next/root-params";

import { SiteLink as Link } from "@/components/site/site-link";
import { categories, entriesIn, entryHref, listedCatalog, listedCategories } from "@/catalog";
import { author, collectionIds, collectionOrigin, collections, getCollection, homeOrigin } from "@/collections";
import { Eyebrow, SiteFooter, Wordmark } from "@/components/site/chrome";
import { CommandLine } from "@/components/site/code-block";
import { ThemePanel } from "@/components/site/theme-settings";
import { installCommand } from "@/lib/site";
import { Accordion } from "@/registry/kit/ui/accordion";
import { AuroraBackdrop } from "@/registry/kit/ui/aurora-backdrop";
import { ButtonShine, buttonVariants } from "@/registry/kit/ui/button";
import { Input } from "@/registry/kit/ui/field";
import { Magnetic } from "@/registry/kit/ui/magnetic";
import { Marquee } from "@/registry/kit/ui/marquee";
import { NumberTicker } from "@/registry/kit/ui/number-ticker";
import { Reveal, TextReveal } from "@/registry/kit/ui/reveal";
import { ScrollTextReveal } from "@/registry/kit/ui/scroll-text-reveal";
import { SegmentedControl } from "@/registry/kit/ui/segmented-control";
import { SiteNav } from "@/registry/kit/ui/site-nav";
import { SpotlightCard } from "@/registry/kit/ui/spotlight-card";

/*
 * One home page for every collection (AGENTS.md, rule 1): structure and
 * sections are shared, copy comes from src/collections.
 */

const navItems = [
  { label: "Playground", href: "#playground" },
  { label: "Library", href: "#library" },
  { label: "Principles", href: "#principles" },
  { label: "About", href: "#about" },
];

const principles = [
  {
    title: "One codebase, many looks",
    content:
      "Every collection ships the same components. They style themselves through a small theme contract, so a fix or a new feature lands everywhere at once.",
  },
  {
    title: "CSS first",
    content:
      "Reveals, marquees, accordions, spotlights and backdrops run on plain CSS. They play before hydration and keep the main thread free.",
  },
  {
    title: "Motion where physics matter",
    content:
      "Springs drive the magnetic pull, the mobile menu and the counters. They load through LazyMotion's domAnimation set, about 15 kB, instead of the full library.",
  },
  {
    title: "Never re-render to animate",
    content:
      "Pointer light, sliding indicators and counters write to CSS variables or the DOM directly. React renders once; the browser does the rest.",
  },
  {
    title: "Yours to change",
    content:
      "The shadcn CLI copies the source into your project. There is no package to upgrade and no API to fight. Edit the file.",
  },
];

function Playground({ id, title }: { id: string; title: string }) {
  return (
    <div className="grid gap-5 lg:grid-cols-[22rem_minmax(0,1fr)] [&>*]:min-w-0">
      <div className="surface-raised self-start rounded-card p-6 md:p-7">
        <div className="mb-6 flex items-baseline justify-between">
          <h3 className="font-display text-3xl">{title}</h3>
          <span className="text-xs text-muted">Saved in this browser</span>
        </div>
        <ThemePanel collection={id} />
      </div>

      <div className="relative isolate grid gap-5 overflow-hidden rounded-card border border-line bg-bg-deep p-5 sm:grid-cols-2 md:p-8">
        <AuroraBackdrop />

        <SpotlightCard className="p-7 sm:col-span-2">
          <div className="text-xs tracking-[0.18em] text-muted uppercase">Spotlight card</div>
          <p className="mt-4 max-w-md font-display text-3xl leading-tight md:text-4xl">
            Move the pointer across this card, then change a dial.
          </p>
        </SpotlightCard>

        <div className="surface grid content-between gap-6 rounded-card p-6">
          <div className="text-xs tracking-[0.18em] text-muted uppercase">Buttons</div>
          <div className="flex flex-wrap items-center gap-3">
            <Magnetic>
              <Link href="/blocks" className={buttonVariants()}>
                See blocks
              </Link>
            </Magnetic>
            <Link href="/templates" className={buttonVariants({ variant: "accent" })}>
              Open templates
            </Link>
            <Link href="/installation" className={buttonVariants({ variant: "ghost" })}>
              Read the setup
            </Link>
          </div>
        </div>

        <div className="surface grid content-between gap-6 rounded-card p-6">
          <div className="text-xs tracking-[0.18em] text-muted uppercase">Segmented</div>
          <SegmentedControl
            aria-label="View"
            defaultValue="week"
            className="justify-self-start"
            options={[
              { value: "day", label: "Day" },
              { value: "week", label: "Week" },
              { value: "month", label: "Month" },
            ]}
          />
        </div>

        <div className="surface grid gap-4 rounded-card p-6">
          <div className="text-xs tracking-[0.18em] text-muted uppercase">Field</div>
          <Input label="Type something" name="playground" autoComplete="off" />
        </div>

        <div className="surface grid content-between gap-4 rounded-card p-6">
          <div className="text-xs tracking-[0.18em] text-muted uppercase">Ticker</div>
          <div className="font-display text-6xl">
            <NumberTicker value={listedCatalog.length} />
            <span className="ml-2 font-sans text-sm font-normal tracking-normal text-muted">pieces</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function Home() {
  const c = getCollection(await collection());
  const siblings = collectionIds.filter((id) => id !== c.id).map((id) => collections[id]);

  return (
    <>
      <SiteNav
        brand={<Wordmark />}
        items={navItems}
        action={
          <Link href="/installation" className={buttonVariants({ size: "sm" })}>
            <ButtonShine />
            Documentation
          </Link>
        }
      />

      <main id="main">
        <section className="relative isolate flex min-h-svh flex-col items-center justify-center overflow-hidden px-6 pt-32 pb-24 text-center">
          <AuroraBackdrop />

          <Reveal trigger="load">
            <a
              href="#about"
              className="surface inline-flex items-center gap-2 rounded-control py-1.5 pr-4 pl-1.5 text-xs text-fg/85 transition-colors hover:text-fg"
            >
              <span className="rounded-control bg-accent px-2 py-0.5 font-medium text-accent-fg">
                {listedCatalog.length} {c.home.badge}
              </span>
              by {author.name}
            </a>
          </Reveal>

          <TextReveal
            as="h1"
            delay={100}
            className="mt-8 max-w-5xl font-display text-[clamp(3rem,8.5vw,7rem)] leading-[0.95]"
          >
            {c.home.title}
          </TextReveal>

          <Reveal as="p" trigger="load" delay={500} className="mt-8 max-w-xl leading-relaxed text-muted sm:text-lg">
            {c.home.lede}
          </Reveal>

          <Reveal trigger="load" delay={650} className="mt-12 flex flex-wrap items-center justify-center gap-3">
            <Magnetic>
              <Link href="/components" className={buttonVariants({ variant: "solid", size: "lg" })}>
                <ButtonShine />
                Browse components
              </Link>
            </Magnetic>
            <a href="#playground" className={buttonVariants({ size: "lg" })}>
              <ButtonShine />
              Tune the theme
            </a>
          </Reveal>

          <Reveal trigger="load" delay={800} className="mt-14 w-full max-w-xl">
            <CommandLine command={installCommand(c.id, "button")} />
          </Reveal>
        </section>

        <div className="border-y border-line py-8">
          {/* ~7s per item keeps the pace calm however large the catalog grows. */}
          <Marquee duration={listedCatalog.length * 7}>
            {listedCatalog.map((entry) => (
              <Link
                key={entry.slug}
                href={entryHref(entry)}
                className="flex items-center gap-12 font-display text-3xl whitespace-nowrap text-fg/75 transition-colors hover:text-fg"
              >
                {entry.name}
                <span aria-hidden className="text-sm text-accent">
                  ✦
                </span>
              </Link>
            ))}
          </Marquee>
        </div>

        <section id="playground" className="mx-auto max-w-7xl px-6 py-28 md:px-8 md:py-36">
          <Eyebrow>Playground</Eyebrow>
          <TextReveal
            as="h2"
            trigger="view"
            className="mt-5 max-w-3xl font-display text-5xl leading-[1.02] md:text-6xl"
          >
            {c.home.playgroundTitle}
          </TextReveal>
          <Reveal as="p" delay={200} className="mt-6 mb-14 max-w-2xl text-lg leading-relaxed text-muted">
            {c.home.playgroundLede}
          </Reveal>
          <Playground id={c.id} title={c.tuner.title} />
        </section>

        <section id="library" className="mx-auto max-w-7xl px-6 pb-28 md:px-8 md:pb-36">
          <Eyebrow>Library</Eyebrow>
          <TextReveal
            as="h2"
            trigger="view"
            className="mt-5 max-w-3xl font-display text-5xl leading-[1.02] md:text-6xl"
          >
            Small pieces, one quiet language.
          </TextReveal>
          <Reveal as="p" delay={200} className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
            Each one is a single file you own. Install it with one command and its dependencies come along.
          </Reveal>
          <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {listedCategories.map((category) => {
              const count = entriesIn(category).length;
              return (
                <li key={category}>
                  <SpotlightCard className="h-full">
                    <Link
                      href={`/${category}`}
                      className="flex h-full flex-col p-7 outline-none focus-visible:bg-hover"
                    >
                      <span className="text-xs tracking-[0.18em] text-muted uppercase tabular-nums">
                        {count > 0 ? `${count} ${count === 1 ? "item" : "items"}` : "Coming soon"}
                      </span>
                      <h3 className="mt-8 font-display text-4xl">{categories[category].title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted">{categories[category].description}</p>
                    </Link>
                  </SpotlightCard>
                </li>
              );
            })}
          </ul>
        </section>

        <section aria-label="In one sentence" className="mx-auto max-w-5xl px-6 pb-28 md:px-8 md:pb-36">
          <ScrollTextReveal
            as="p"
            className="mx-auto max-w-4xl text-center font-display text-4xl leading-tight md:text-6xl"
          >
            {c.home.statement}
          </ScrollTextReveal>
        </section>

        <section id="principles" className="mx-auto max-w-7xl px-6 pb-28 md:px-8 md:pb-36">
          <div className="grid gap-12 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:gap-20">
            <div>
              <Eyebrow>Principles</Eyebrow>
              <TextReveal as="h2" trigger="view" className="mt-5 font-display text-5xl leading-[1.02] md:text-6xl">
                {c.home.principlesTitle}
              </TextReveal>
            </div>
            <Accordion
              defaultOpen={["p0"]}
              items={principles.map((p, i) => ({
                id: `p${i}`,
                marker: String(i + 1).padStart(2, "0"),
                title: p.title,
                content: p.content,
              }))}
            />
          </div>
        </section>

        {siblings.map((s) => (
          <section
            key={s.id}
            aria-labelledby={`sibling-${s.id}`}
            className="mx-auto max-w-7xl px-6 pb-28 md:px-8 md:pb-36"
          >
            <SpotlightCard>
              {/* The card wraps its children in a flex column, so the grid lives on this child. */}
              <div className="grid gap-8 p-8 md:grid-cols-[minmax(0,3fr)_auto] md:items-end md:p-12">
                <div>
                  <Eyebrow>The other collection</Eyebrow>
                  <h2 id={`sibling-${s.id}`} className="mt-5 font-display text-5xl md:text-6xl">
                    {s.name}
                  </h2>
                  <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">{c.home.sibling}</p>
                </div>
                <a href={collectionOrigin(s.id)} className={buttonVariants({ variant: "accent", size: "lg" })}>
                  Visit {s.name}
                </a>
              </div>
            </SpotlightCard>
          </section>
        ))}

        <section id="about" className="relative isolate overflow-hidden border-t border-line">
          <AuroraBackdrop grid={false} className="opacity-70" />
          <div className="mx-auto grid max-w-7xl gap-12 px-6 py-28 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] md:items-end md:px-8 md:py-36">
            <div>
              <Eyebrow>About</Eyebrow>
              <TextReveal as="h2" trigger="view" className="mt-5 font-display text-5xl leading-[1.02] md:text-7xl">
                {`Hi, I'm ${author.name}.`}
              </TextReveal>
              <Reveal delay={200} className="mt-8 max-w-xl space-y-4 text-lg leading-relaxed text-muted">
                <p>
                  I&apos;m a software developer. These collections hold the interface pieces I reach for again and
                  again, refined until they are fast, accessible and consistent.
                </p>
                <p>
                  Each collection is its own design language over the same components. {c.name} is one of them.
                </p>
              </Reveal>
            </div>
            <Reveal delay={350}>
              <SpotlightCard className="p-8">
                <div className="text-xs tracking-[0.18em] text-muted uppercase">{author.role}</div>
                <p className="mt-4 font-display text-4xl">{author.name}</p>
                <a
                  href={homeOrigin()}
                  className={buttonVariants({
                    variant: "solid",
                    className: "mt-8",
                  })}
                >
                  <ButtonShine />
                  See all collections
                </a>
              </SpotlightCard>
            </Reveal>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
