import { Avatar } from "@/registry/kit/ui/avatar";
import { Carousel } from "@/registry/kit/ui/carousel";
import { TextReveal } from "@/registry/kit/ui/reveal";

export interface ProofMetric {
  /** Formatted, e.g. "38,214" or "−11.4%". */
  value: string;
  label: string;
}

export interface ProofQuote {
  quote: string;
  name: string;
  role: string;
  /** The result in a few words, shown above the quote, e.g. "+18% trials". */
  result?: string;
}

export interface ProofBandProps {
  eyebrow?: string;
  title?: string;
  /** Two to four headline numbers. */
  metrics?: ProofMetric[];
  /** Short quotes; more than three become a swipeable carousel. */
  quotes?: ProofQuote[];
  /** Link beside the heading, e.g. to customer stories. */
  action?: { label: string; href: string };
}

const defaultMetrics: ProofMetric[] = [
  { value: "4,183", label: "Teams shipping with it" },
  { value: "21 min", label: "Median time to first trace" },
  { value: "99.98%", label: "Uptime, last 12 months" },
  { value: "4.8 / 5", label: "Support rating, 2,140 replies" },
];

const defaultQuotes: ProofQuote[] = [
  { result: "−38% p95 latency", quote: "The slow call was in a library we didn't even know we used. We found it on day one.", name: "Ada Kowalski", role: "Engineering lead, Polaris" },
  { result: "2 h saved per incident", quote: "Alerts name the release and the owner. Our on-call rotation finally sleeps.", name: "Mateo Ruiz", role: "Head of platform, Kitebase" },
  { result: "Set up in 9 minutes", quote: "One package and a provider. It was live before standup ended.", name: "Jun Lee", role: "Staff engineer, Orbitly" },
  { result: "−61% error budget burn", quote: "We stopped guessing which deploy broke checkout. Now we just roll it back.", name: "Sara Okafor", role: "CTO, Fernhill" },
];

/**
 * Proof in one band: headline numbers on a strip, then short quotes, each led
 * by the result it describes. Three quotes sit in a row; more scroll as a carousel.
 */
export function ProofBand({
  eyebrow = "Proof",
  title = "Teams measure the difference in days.",
  metrics = defaultMetrics,
  quotes = defaultQuotes,
  action,
}: ProofBandProps) {
  const cards = quotes.map((q) => (
    <figure key={q.name} className="surface flex h-full flex-col rounded-card p-5 md:p-6">
      {q.result && <p className="text-sm font-semibold text-accent">{q.result}</p>}
      <blockquote className="mt-3 flex-1 text-[15px] leading-relaxed text-fg/90">“{q.quote}”</blockquote>
      <figcaption className="mt-5 flex items-center gap-3">
        <Avatar aria-hidden alt={q.name} size="sm" fallbackClassName="bg-linear-to-br from-accent/60 to-info/40 text-accent-fg" />
        <span className="min-w-0">
          <span className="block truncate text-sm font-medium">{q.name}</span>
          <span className="block truncate text-xs text-muted">{q.role}</span>
        </span>
      </figcaption>
    </figure>
  ));

  return (
    <section className="bg-bg px-4 py-16 text-fg sm:px-6 md:px-8 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
          <div className="max-w-2xl">
            {eyebrow && <p className="text-sm font-medium text-accent">{eyebrow}</p>}
            <TextReveal as="h2" trigger="view" className="mt-3 font-display text-3xl leading-[1.08] md:text-5xl">
              {title}
            </TextReveal>
          </div>
          {action && (
            <a href={action.href} className="text-sm font-medium text-accent underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-accent">
              {action.label} →
            </a>
          )}
        </div>

        {metrics.length > 0 && (
          <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-line pt-8 md:mt-12 lg:grid-cols-4">
            {metrics.map((m) => (
              <div key={m.label} className="flex min-w-0 flex-col-reverse gap-1.5">
                <dt className="text-sm text-muted">{m.label}</dt>
                <dd className="font-display text-3xl leading-none tracking-tight tabular-nums md:text-4xl">{m.value}</dd>
              </div>
            ))}
          </dl>
        )}

        {quotes.length > 0 && (
          <div className="mt-10 md:mt-12">
            {quotes.length > 3 ? (
              <Carousel label="What customers say" slidesPerView={{ base: 1, md: 2, lg: 3 }}>
                {cards}
              </Carousel>
            ) : (
              <div className="grid gap-4 md:grid-cols-3">{cards}</div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
