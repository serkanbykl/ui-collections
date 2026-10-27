import { AuroraBackdrop } from "@/registry/kit/ui/aurora-backdrop";
import { ButtonShine, buttonVariants } from "@/registry/kit/ui/button";
import { Reveal, TextReveal } from "@/registry/kit/ui/reveal";

export function Error404({
  title = "This page drifted away.",
  description = "The link may be broken, or the page may have moved. Let's get you somewhere useful.",
  homeHref = "/",
  supportHref = "/contact",
}: {
  title?: string;
  description?: string;
  homeHref?: string;
  supportHref?: string;
}) {
  return (
    <section className="relative isolate grid min-h-[40rem] place-items-center overflow-hidden bg-bg-deep px-6 py-20 text-center text-fg">
      <AuroraBackdrop />
      <div>
        <Reveal trigger="load" aria-hidden className="surface mx-auto inline-block rounded-card px-10 py-4 font-display text-[clamp(5rem,18vw,10rem)] leading-none tracking-[-0.05em]">
          404
        </Reveal>
        <TextReveal as="h1" delay={200} className="mx-auto mt-10 max-w-2xl font-display text-4xl md:text-5xl">
          {title}
        </TextReveal>
        <Reveal as="p" trigger="load" delay={450} className="mx-auto mt-4 max-w-md text-muted">
          {description}
        </Reveal>
        <Reveal trigger="load" delay={600} className="mt-10 flex flex-wrap justify-center gap-3">
          <a href={homeHref} className={buttonVariants({ variant: "solid", size: "lg" })}>
            <ButtonShine />
            Back to home
          </a>
          <a href={supportHref} className={buttonVariants({ size: "lg" })}>
            <ButtonShine />
            Contact support
          </a>
        </Reveal>
      </div>
    </section>
  );
}
