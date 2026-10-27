import { AuroraBackdrop } from "@/registry/kit/ui/aurora-backdrop";
import { ButtonShine, buttonVariants } from "@/registry/kit/ui/button";
import { Reveal, TextReveal } from "@/registry/kit/ui/reveal";
import { Badge } from "@/registry/kit/ui/badge";

export interface HeroSplitProps {
  eyebrow?: string;
  title?: string;
  description?: string;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
  /** One proof or risk-reducing line under the buttons, e.g. "Free plan · No credit card". */
  note?: string;
}

const tasks = [
  { name: "Migrate billing webhooks", state: "Done", tone: "accent" as const },
  { name: "Edge cache for /pricing", state: "Review", tone: "info" as const },
  { name: "Audit dashboard a11y", state: "In progress", tone: "warning" as const },
];

export function HeroSplit({
  eyebrow = "Project tracking, minus the noise",
  title = "Plan less. Ship more.",
  description = "Cascade turns issues, reviews and releases into one quiet timeline, so your team can see what matters at a glance.",
  primary = { label: "Start free trial", href: "/signup" },
  secondary = { label: "Book a demo", href: "/demo" },
  note,
}: HeroSplitProps) {
  return (
    <section className="relative isolate overflow-hidden bg-bg-deep text-fg">
      <AuroraBackdrop grid={false} />
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 py-24 md:px-8 lg:grid-cols-2 lg:py-32">
        <div>
          <Reveal trigger="load" className="text-xs tracking-[0.2em] text-muted uppercase">
            {eyebrow}
          </Reveal>
          <TextReveal
            as="h1"
            className="mt-5 font-display text-[clamp(2.75rem,7vw,5.5rem)] leading-[0.95]"
          >
            {title}
          </TextReveal>
          <Reveal as="p" trigger="load" delay={300} className="mt-6 max-w-lg text-lg leading-relaxed text-muted">
            {description}
          </Reveal>
          <Reveal trigger="load" delay={450} className="mt-10 flex flex-wrap gap-3">
            <a href={primary.href} className={buttonVariants({ variant: "solid", size: "lg" })}>
              <ButtonShine />
              {primary.label}
            </a>
            <a href={secondary.href} className={buttonVariants({ size: "lg" })}>
              <ButtonShine />
              {secondary.label}
            </a>
          </Reveal>
          {note && (
            <Reveal as="p" trigger="load" delay={550} className="mt-5 text-sm text-muted">
              {note}
            </Reveal>
          )}
        </div>

        <Reveal trigger="load" delay={350} distance={24} aria-hidden className="relative">
          <div className="surface rounded-card p-5 md:p-6">
            <div className="flex items-center gap-1.5 pb-5">
              <span className="size-2.5 rounded-full bg-fg/25" />
              <span className="size-2.5 rounded-full bg-fg/25" />
              <span className="size-2.5 rounded-full bg-fg/25" />
              <span className="ml-3 text-xs text-muted">Sprint 24 · Week 2</span>
            </div>
            <div className="grid gap-3">
              {tasks.map((task) => (
                <div key={task.name} className="surface flex items-center justify-between gap-4 rounded-field px-4 py-3.5">
                  <span className="truncate text-sm">{task.name}</span>
                  <Badge variant={task.tone} dot className="shrink-0">
                    {task.state}
                  </Badge>
                </div>
              ))}
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3">
              {[
                ["38", "Shipped"],
                ["6", "In review"],
                ["2.4d", "Cycle time"],
              ].map(([value, label]) => (
                <div key={label} className="rounded-field bg-fg/[0.04] p-4">
                  <div className="font-display text-3xl">{value}</div>
                  <div className="mt-1 text-xs text-muted">{label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="surface-raised absolute -bottom-6 -left-4 hidden rounded-field px-4 py-3 text-sm sm:block">
            <span className="text-accent">●</span> Release 4.2 deployed
          </div>
        </Reveal>
      </div>
    </section>
  );
}
