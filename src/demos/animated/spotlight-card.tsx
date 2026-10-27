import { SpotlightCard } from "@/registry/kit/ui/spotlight-card";

const cards = [
  { n: "01", title: "Instant deploys", body: "Push to main and watch it go live before the coffee cools." },
  { n: "02", title: "Edge caching", body: "Static shells served close to every visitor, refreshed on demand." },
];

export default function SpotlightCardDemo() {
  return (
    <div className="grid w-full max-w-3xl gap-5 md:grid-cols-2">
      {cards.map((card) => (
        <SpotlightCard key={card.n} className="p-8">
          <div className="text-xs tracking-[0.18em] text-muted">{card.n}</div>
          <h3 className="mt-6 font-display text-3xl leading-tight tracking-[-0.02em]">{card.title}</h3>
          <p className="mt-3 text-sm leading-relaxed text-muted">{card.body}</p>
        </SpotlightCard>
      ))}
    </div>
  );
}
