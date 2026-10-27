import { Reveal, TextReveal } from "@/registry/kit/ui/reveal";
import { SpotlightCard } from "@/registry/kit/ui/spotlight-card";

export interface Feature {
  title: string;
  body: string;
  /** SVG path data drawn in a 24×24 box. */
  icon: string;
}

const defaultFeatures: Feature[] = [
  { title: "Instant previews", body: "Every pull request gets its own URL, ready before the review starts.", icon: "M4 6h16v12H4zM4 10h16" },
  { title: "Edge caching", body: "Static shells are served close to every visitor and refreshed on demand.", icon: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm-9 9h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18" },
  { title: "One-click rollback", body: "Every deploy is immutable. Go back to any version in a second.", icon: "M9 14 4 9l5-5M4 9h11a5 5 0 0 1 0 10h-3" },
  { title: "Readable logs", body: "Structured, searchable logs streamed live from every function.", icon: "M5 7h14M5 12h10M5 17h6" },
  { title: "Secrets vault", body: "Environment variables encrypted at rest and scoped per branch.", icon: "M7 11V8a5 5 0 0 1 10 0v3M6 11h12v9H6z" },
  { title: "Usage alerts", body: "Know before a bill surprises you, with limits you control.", icon: "M12 4v9M12 17v.5M4.5 20h15L12 4z" },
];

export interface FeatureGridProps {
  eyebrow?: string;
  title?: string;
  description?: string;
  features?: Feature[];
}

export function FeatureGrid({
  eyebrow = "Platform",
  title = "Everything a deploy needs, nothing it doesn't.",
  description = "Six building blocks that cover the path from commit to customer.",
  features = defaultFeatures,
}: FeatureGridProps) {
  return (
    <section className="bg-bg px-6 py-24 text-fg md:px-8 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <div className="text-xs tracking-[0.2em] text-muted uppercase">{eyebrow}</div>
          <TextReveal as="h2" trigger="view" className="mt-5 font-display text-4xl leading-[1.02] md:text-6xl">
            {title}
          </TextReveal>
          <Reveal as="p" delay={150} className="mt-5 text-lg leading-relaxed text-muted">
            {description}
          </Reveal>
        </div>
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={i * 70} className="h-full">
              <SpotlightCard className="h-full p-7">
                <span className="surface grid size-11 place-items-center rounded-field">
                  <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d={f.icon} />
                  </svg>
                </span>
                <h3 className="mt-6 text-lg font-medium">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{f.body}</p>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
