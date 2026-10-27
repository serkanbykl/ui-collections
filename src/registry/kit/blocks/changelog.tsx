import { Reveal } from "@/registry/kit/ui/reveal";
import { Badge } from "@/registry/kit/ui/badge";

export interface Release {
  version: string;
  date: string;
  title: string;
  notes: string[];
}

const defaultReleases: Release[] = [
  {
    version: "4.2",
    date: "October 20, 2026",
    title: "Instant rollback for every plan",
    notes: ["Roll back any deploy from the timeline in one click.", "Rollbacks keep their environment variables.", "New audit entry for each rollback."],
  },
  {
    version: "4.1",
    date: "October 2, 2026",
    title: "Affected-project builds",
    notes: ["Monorepos rebuild only what changed.", "Build cache shared across branches.", "Faster cold installs with a warmed registry mirror."],
  },
  {
    version: "4.0",
    date: "September 14, 2026",
    title: "A calmer dashboard",
    notes: ["Redesigned navigation with keyboard-first command menu.", "Reduced-motion and high-contrast modes.", "Usage alerts at 80% and 100%."],
  },
];

export function Changelog({
  title = "Changelog",
  releases = defaultReleases,
  headingLevel: Heading = "h2",
}: {
  title?: string;
  releases?: Release[];
  /** `h1` when the block opens its own page. */
  headingLevel?: "h1" | "h2";
}) {
  return (
    <section className="bg-bg px-6 py-24 text-fg md:px-8">
      <div className="mx-auto max-w-4xl">
        <Heading className="font-display text-5xl md:text-6xl">{title}</Heading>
        <ol className="relative mt-14 border-l border-fg/10">
          {releases.map((release, i) => (
            <Reveal as="li" key={release.version} delay={i * 80} className="relative pb-14 pl-8 last:pb-0 md:pl-12">
              <span aria-hidden className="absolute top-1.5 -left-[5px] size-[9px] rounded-full bg-accent shadow-[0_0_0_4px_color-mix(in_oklab,var(--color-accent)_20%,transparent)]" />
              <div className="flex flex-wrap items-baseline gap-3 text-sm">
                <Badge className="font-mono">v{release.version}</Badge>
                <time className="text-muted">{release.date}</time>
              </div>
              <h3 className="mt-4 font-display text-3xl">{release.title}</h3>
              <ul className="mt-4 grid gap-2 text-[15px] text-muted">
                {release.notes.map((note) => (
                  <li key={note} className="flex gap-3">
                    <span aria-hidden className="mt-2.5 size-1 shrink-0 rounded-full bg-fg/40" />
                    {note}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
