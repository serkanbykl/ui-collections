import { Reveal, TextReveal } from "@/registry/kit/ui/reveal";
import { SpotlightCard } from "@/registry/kit/ui/spotlight-card";
import { Avatar } from "@/registry/kit/ui/avatar";

export interface Member {
  name: string;
  role: string;
  bio: string;
}

const defaultMembers: Member[] = [
  { name: "Ada Kowalski", role: "Co-founder, engineering", bio: "Built deploy pipelines for a decade before deciding they could be calmer." },
  { name: "Mateo Ruiz", role: "Co-founder, design", bio: "Believes every interface should feel like it was in no hurry." },
  { name: "Jun Lee", role: "Infrastructure", bio: "Keeps the edge network fast and the pager quiet." },
  { name: "Sara Okafor", role: "Developer experience", bio: "Writes the docs she wished she had." },
  { name: "Liam Novak", role: "Security", bio: "Reads audit logs so you don't have to." },
  { name: "Priya Shah", role: "Support", bio: "Answers with code, not ticket numbers." },
];

const hues = ["from-accent/70 to-info/40", "from-info/70 to-accent/40", "from-success/70 to-info/40"];

export function TeamGrid({ title = "The people behind it.", members = defaultMembers }: { title?: string; members?: Member[] }) {
  return (
    <section className="bg-bg px-6 py-24 text-fg md:px-8 md:py-32">
      <div className="mx-auto max-w-7xl">
        <TextReveal as="h2" trigger="view" className="font-display text-4xl md:text-6xl">
          {title}
        </TextReveal>
        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((m, i) => (
            <Reveal as="li" key={m.name} delay={(i % 3) * 80} className="h-full">
              <SpotlightCard className="h-full p-7">
                <Avatar
                  aria-hidden
                  alt={m.name}
                  className="size-16 font-display text-2xl"
                  fallbackClassName={`bg-linear-to-br ${hues[i % hues.length]} text-accent-fg`}
                />
                <h3 className="mt-6 text-lg font-medium">{m.name}</h3>
                <p className="text-sm text-accent">{m.role}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted">{m.bio}</p>
              </SpotlightCard>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
