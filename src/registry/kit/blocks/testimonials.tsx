import { Reveal, TextReveal } from "@/registry/kit/ui/reveal";
import { Avatar } from "@/registry/kit/ui/avatar";

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

const defaultItems: Testimonial[] = [
  { quote: "We cut our release checklist from forty steps to four. The team stopped dreading Fridays.", name: "Ada Kowalski", role: "Engineering lead, Polaris" },
  { quote: "It's the first tool our designers and engineers both open without being asked.", name: "Mateo Ruiz", role: "Head of product, Kitebase" },
  { quote: "Previews on every branch changed how we review. Feedback arrives while the code is still warm.", name: "Jun Lee", role: "Staff engineer, Orbitly" },
  { quote: "Calm is underrated. Nothing flashes at you, everything is where you expect it.", name: "Sara Okafor", role: "Founder, Fernhill" },
  { quote: "We moved three services over in an afternoon and haven't looked back.", name: "Liam Novak", role: "CTO, Quarry" },
  { quote: "Support answered with a code snippet, not a ticket number.", name: "Priya Shah", role: "Developer, Lattice" },
];

export function Testimonials({
  title = "Loved by people who ship.",
  items = defaultItems,
}: {
  title?: string;
  items?: Testimonial[];
}) {
  return (
    <section className="bg-bg px-6 py-24 text-fg md:px-8 md:py-32">
      <div className="mx-auto max-w-7xl">
        <TextReveal as="h2" trigger="view" className="max-w-2xl font-display text-4xl leading-[1.02] md:text-6xl">
          {title}
        </TextReveal>
        {/* Cards in a row share its height; the author row sits on the bottom edge. */}
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <Reveal key={item.name} delay={(i % 3) * 80} className="h-full">
              <figure className="surface flex h-full flex-col rounded-card p-7">
                <blockquote className="flex-1 text-[15px] leading-relaxed text-fg/85">“{item.quote}”</blockquote>
                <figcaption className="mt-auto flex items-center gap-3 pt-6">
                  <Avatar aria-hidden alt={item.name} fallbackClassName="bg-linear-to-br from-accent/60 to-info/40 text-accent-fg" />
                  <span>
                    <span className="block text-sm font-medium">{item.name}</span>
                    <span className="block text-xs text-muted">{item.role}</span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
