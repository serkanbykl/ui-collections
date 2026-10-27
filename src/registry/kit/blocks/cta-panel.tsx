import { cn } from "@/registry/kit/lib/utils";
import { AuroraBackdrop } from "@/registry/kit/ui/aurora-backdrop";
import { ButtonShine, buttonVariants } from "@/registry/kit/ui/button";
import { Magnetic } from "@/registry/kit/ui/magnetic";
import { TextReveal } from "@/registry/kit/ui/reveal";

export function CtaPanel({
  title = "Your next release could be your calmest.",
  description = "Set up in five minutes. Free plan, no credit card, cancel anytime.",
  primary = { label: "Create your first project", href: "/signup" },
  secondary = { label: "Talk to sales", href: "/contact" },
  note,
  compact = false,
}: {
  title?: string;
  description?: string;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
  /** Risk reducer under the buttons, e.g. "No card required". */
  note?: string;
  /** Tighter spacing and a smaller title, for dense landing pages. */
  compact?: boolean;
}) {
  return (
    <section className={cn("bg-bg text-fg", compact ? "px-4 pt-4 pb-16 sm:px-6 md:px-8 md:pb-24" : "px-6 py-20 md:px-8")}>
      <div className="relative isolate mx-auto max-w-6xl overflow-hidden rounded-card bg-bg-deep">
        <AuroraBackdrop />
        <div className={cn("surface flex flex-col items-center rounded-card px-6 text-center", compact ? "py-14 md:py-20" : "py-20 md:py-24")}>
          <TextReveal
            as="h2"
            trigger="view"
            className={cn("max-w-3xl font-display", compact ? "text-3xl leading-[1.08] md:text-5xl" : "text-4xl leading-[1.02] md:text-6xl")}
          >
            {title}
          </TextReveal>
          <p className="mt-5 max-w-md text-muted">{description}</p>
          <div className={cn("flex flex-wrap justify-center gap-3", compact ? "mt-8" : "mt-10")}>
            <Magnetic>
              <a href={primary.href} className={buttonVariants({ variant: "solid", size: compact ? "md" : "lg" })}>
                <ButtonShine />
                {primary.label}
              </a>
            </Magnetic>
            <a href={secondary.href} className={buttonVariants({ variant: "ghost", size: compact ? "md" : "lg" })}>
              {secondary.label}
            </a>
          </div>
          {note && <p className="mt-5 text-sm text-muted">{note}</p>}
        </div>
      </div>
    </section>
  );
}
