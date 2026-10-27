import { AuroraBackdrop } from "@/registry/kit/ui/aurora-backdrop";
import { ButtonShine, buttonVariants } from "@/registry/kit/ui/button";
import { Magnetic } from "@/registry/kit/ui/magnetic";
import { Reveal, TextReveal } from "@/registry/kit/ui/reveal";
import { Badge } from "@/registry/kit/ui/badge";

export interface HeroAuroraProps {
  badge?: string;
  title?: string;
  description?: string;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
  /** One proof or risk-reducing line under the buttons, e.g. "Free plan · No credit card". */
  note?: string;
  /** Where the badge above the title links to. */
  badgeHref?: string;
}

export function HeroAurora({
  badge = "Lumen 2.0 is here",
  title = "Ship interfaces that feel weightless.",
  description = "Lumen gives product teams a calm, fast design system: clear surfaces, gentle motion and components you own outright.",
  primary = { label: "Start building free", href: "/signup" },
  secondary = { label: "Read the docs", href: "/docs" },
  badgeHref = "/changelog",
  note,
}: HeroAuroraProps) {
  return (
    <section className="relative isolate flex min-h-[44rem] flex-col items-center justify-center overflow-hidden bg-bg-deep px-6 py-28 text-center text-fg">
      <AuroraBackdrop />
      <Reveal trigger="load">
        <a href={badgeHref} className="surface inline-flex items-center gap-2 rounded-control py-1.5 pr-4 pl-1.5 text-xs text-fg/85">
          <Badge variant="accent-solid">New</Badge>
          {badge}
          <span aria-hidden>→</span>
        </a>
      </Reveal>
      <TextReveal
        as="h1"
        delay={80}
        className="mt-8 max-w-4xl font-display text-[clamp(2.75rem,8vw,6rem)] leading-[0.95]"
      >
        {title}
      </TextReveal>
      <Reveal as="p" trigger="load" delay={400} className="mt-7 max-w-xl leading-relaxed text-muted sm:text-lg">
        {description}
      </Reveal>
      <Reveal trigger="load" delay={550} className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <Magnetic>
          <a href={primary.href} className={buttonVariants({ variant: "solid", size: "lg" })}>
            <ButtonShine />
            {primary.label}
          </a>
        </Magnetic>
        <a href={secondary.href} className={buttonVariants({ size: "lg" })}>
          <ButtonShine />
          {secondary.label}
        </a>
      </Reveal>
      {note && (
        <Reveal as="p" trigger="load" delay={650} className="mt-6 text-sm text-muted">
          {note}
        </Reveal>
      )}
    </section>
  );
}
