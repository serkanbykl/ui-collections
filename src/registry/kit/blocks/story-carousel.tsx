import { Avatar } from "@/registry/kit/ui/avatar";
import { Badge } from "@/registry/kit/ui/badge";
import { Carousel, type SlidesPerView } from "@/registry/kit/ui/carousel";
import { TextReveal } from "@/registry/kit/ui/reveal";

export type StoryArt = "bars" | "line" | "ring" | "funnel" | "dots" | "steps";

export interface Story {
  company: string;
  industry: string;
  metric: string;
  metricLabel: string;
  quote: string;
  person: string;
  role: string;
  href: string;
  /** Cover drawing, built from theme colours. Defaults to cycling through all of them. */
  art?: StoryArt;
}

export interface StoryCarouselProps {
  eyebrow?: string;
  title?: string;
  description?: string;
  stories?: Story[];
  /** Link to every story. Pass null to hide it. */
  allHref?: string | null;
  slidesPerView?: SlidesPerView;
  /** Milliseconds per page; omit for no autoplay. */
  autoplay?: number;
  headingLevel?: "h1" | "h2";
}

const defaultStories: Story[] = [
  { company: "Halcyon", industry: "Fintech", metric: "71%", metricLabel: "fewer releases rolled back", quote: "Our auditors now ask for the export instead of a spreadsheet.", person: "Noor Haddad", role: "VP Engineering", href: "/customers/halcyon", art: "line" },
  { company: "Northwind Studio", industry: "Agencies", metric: "38", metricLabel: "client sites moved in one week", quote: "We onboarded a client during the kickoff call, not after it.", person: "Tomás Herrera", role: "Managing director", href: "/customers/northwind", art: "bars" },
  { company: "Kitebase", industry: "SaaS", metric: "2.4×", metricLabel: "more deploys per engineer", quote: "We stopped batching releases because there was no longer a reason to.", person: "Elias Brandt", role: "CTO", href: "/customers/kitebase", art: "steps" },
  { company: "Fernhill", industry: "Fintech", metric: "€41k", metricLabel: "saved on tooling in year one", quote: "Three dashboards and a spreadsheet became one page the whole board reads.", person: "Sara Okafor", role: "Founder", href: "/customers/fernhill", art: "ring" },
  { company: "Orbitly", industry: "SaaS", metric: "18%", metricLabel: "more trials after one onboarding fix", quote: "The funnel showed one confusing step. We fixed it the same afternoon.", person: "Jun Lee", role: "Product manager", href: "/customers/orbitly", art: "funnel" },
  { company: "Quarry", industry: "Agencies", metric: "6 h", metricLabel: "back every week on client reports", quote: "Clients get a live link instead of a monthly PDF, and they actually open it.", person: "Liam Novak", role: "Operations lead", href: "/customers/quarry", art: "dots" },
  { company: "Monolith", industry: "SaaS", metric: "99.98%", metricLabel: "uptime across 212 services", quote: "On-call got quiet enough that people volunteer for it now.", person: "Ingrid Solberg", role: "Head of platform", href: "/customers/monolith", art: "line" },
];

// Kept here rather than imported from page-kit: that module is a client one, so a Server Component can't read its values.
const tints = ["from-accent/70 to-info/40", "from-info/70 to-accent/40", "from-success/70 to-info/40", "from-warning/60 to-accent/40"];

const artOrder: StoryArt[] = ["line", "bars", "steps", "ring", "funnel", "dots"];

/** Small abstract charts drawn with theme colours, so every collection gets its own cover. */
function StoryCover({ art, index }: { art: StoryArt; index: number }) {
  const tone = ["text-accent", "text-info", "text-success"][index % 3];
  return (
    <div aria-hidden className={`relative h-36 overflow-hidden bg-linear-to-br ${tints[index % tints.length]} ${tone}`}>
      <div className="absolute inset-0 bg-[linear-gradient(color-mix(in_oklab,var(--c-fg)_7%,transparent)_1px,transparent_1px),linear-gradient(90deg,color-mix(in_oklab,var(--c-fg)_7%,transparent)_1px,transparent_1px)] bg-size-[24px_24px]" />
      <svg viewBox="0 0 320 144" preserveAspectRatio="xMidYMid meet" className="absolute inset-0 size-full text-fg" fill="none">
        {art === "bars" &&
          [46, 70, 58, 92, 80, 112, 104].map((h, i) => (
            <rect key={i} x={40 + i * 36} y={128 - h} width="20" height={h} rx="5" className={i === 5 ? "fill-bg" : "fill-fg/25"} />
          ))}
        {art === "line" && (
          <>
            <path d="M0 116 C70 104 90 70 132 78 S196 40 236 46 S290 22 320 16 V144 H0Z" className="fill-bg/30" />
            <path d="M0 116 C70 104 90 70 132 78 S196 40 236 46 S290 22 320 16" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            <circle cx="236" cy="46" r="6" className="fill-bg" stroke="currentColor" strokeWidth="3" />
          </>
        )}
        {art === "ring" && (
          <>
            <circle cx="160" cy="72" r="44" strokeWidth="16" className="stroke-fg/20" />
            <circle cx="160" cy="72" r="44" strokeWidth="16" strokeLinecap="round" strokeDasharray="190 277" transform="rotate(-90 160 72)" className="stroke-bg" />
            <circle cx="160" cy="72" r="18" className="fill-fg/20" />
          </>
        )}
        {art === "funnel" &&
          [220, 168, 120, 84].map((w, i) => (
            <rect key={i} x={160 - w / 2} y={18 + i * 28} width={w} height="20" rx="10" className={i === 2 ? "fill-bg" : "fill-fg/25"} />
          ))}
        {art === "dots" &&
          Array.from({ length: 36 }, (_, i) => {
            const col = i % 9;
            const row = Math.floor(i / 9);
            const on = (col * 3 + row * 5) % 7 < 3;
            return <circle key={i} cx={48 + col * 28} cy={30 + row * 28} r={on ? 8 : 5} className={on ? "fill-bg" : "fill-fg/25"} />;
          })}
        {art === "steps" && (
          <>
            <path d="M28 124 H88 V96 H148 V68 H208 V40 H292" strokeWidth="3" strokeLinejoin="round" className="stroke-bg" />
            {[88, 148, 208].map((x, i) => (
              <circle key={x} cx={x} cy={96 - i * 28} r="6" className="fill-fg/30" />
            ))}
            <circle cx="292" cy="40" r="8" className="fill-bg" />
          </>
        )}
      </svg>
    </div>
  );
}

function StoryCard({ story, index }: { story: Story; index: number }) {
  return (
    <article className="group surface lift relative flex h-full flex-col overflow-hidden rounded-card has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-accent">
      <StoryCover art={story.art ?? artOrder[index % artOrder.length]!} index={index} />
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center justify-between gap-3">
          <span className="truncate text-sm font-medium">{story.company}</span>
          <Badge variant="outline">{story.industry}</Badge>
        </div>
        <p className="mt-5 font-display text-5xl leading-none text-accent tabular-nums">{story.metric}</p>
        <p className="mt-2 text-sm text-muted">{story.metricLabel}</p>
        <blockquote className="mt-5 flex-1 text-[15px] leading-relaxed text-fg/85">“{story.quote}”</blockquote>
        <div className="mt-6 flex items-center gap-3">
          <Avatar aria-hidden alt={story.person} size="sm" fallbackClassName={`bg-linear-to-br ${tints[index % tints.length]} text-accent-fg`} />
          <span className="min-w-0 text-sm">
            <span className="block truncate font-medium">{story.person}</span>
            <span className="block truncate text-muted">{story.role}</span>
          </span>
        </div>
        <a href={story.href} className="mt-6 inline-flex items-center gap-1.5 text-sm text-accent outline-none after:absolute after:inset-0">
          Read the {story.company} story
          <svg viewBox="0 0 24 24" className="size-4 transition-[translate] duration-300 ease-theme group-hover:translate-x-1 rtl:-scale-x-100" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </a>
      </div>
    </article>
  );
}

/** Customer stories as a swipeable row of equal-height cards with drawn covers, metric and quote. */
export function StoryCarousel({
  eyebrow = "Customer stories",
  title = "Teams that measured the difference.",
  description = "Numbers from their own dashboards, checked with each team before we published them.",
  stories = defaultStories,
  allHref = "/customers",
  slidesPerView = { base: 1, sm: 2, lg: 3 },
  autoplay,
  headingLevel = "h2",
}: StoryCarouselProps) {
  return (
    <section className="overflow-x-clip bg-bg px-5 py-24 text-fg sm:px-8 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-accent">{eyebrow}</p>
            <TextReveal as={headingLevel} trigger="view" className="mt-3 font-display text-4xl leading-[1.05] md:text-5xl">
              {title}
            </TextReveal>
            <p className="mt-4 text-muted md:text-lg">{description}</p>
          </div>
          {allHref && (
            <a href={allHref} className="shrink-0 rounded-sm text-sm text-muted underline-offset-4 transition-colors hover:text-fg hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
              Browse all {stories.length} stories →
            </a>
          )}
        </div>
        <Carousel label={eyebrow} slidesPerView={slidesPerView} autoplay={autoplay} className="mt-12">
          {stories.map((story, i) => (
            <StoryCard key={story.href} story={story} index={i} />
          ))}
        </Carousel>
      </div>
    </section>
  );
}
