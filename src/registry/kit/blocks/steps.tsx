import { Reveal, TextReveal } from "@/registry/kit/ui/reveal";

export interface Step {
  title: string;
  body: string;
  /** Optional one-line snippet shown under the step, e.g. an install command. */
  code?: string;
}

const defaultSteps: Step[] = [
  {
    title: "Connect your repository",
    body: "Pick a repo and branch. We detect the framework and fill in the build settings.",
    code: "git push origin main",
  },
  {
    title: "Review the preview",
    body: "Every pull request gets its own URL, so reviewers click through the change instead of reading a diff.",
  },
  {
    title: "Merge to ship",
    body: "Merging promotes the exact preview build. If something looks off, roll back in one click.",
  },
];

export interface StepsProps {
  eyebrow?: string;
  title?: string;
  description?: string;
  /** Three steps read best; two to four also lay out well. */
  steps?: Step[];
}

/** How it works, in a few numbered steps joined by a hairline on wide screens. */
export function Steps({
  eyebrow = "How it works",
  title = "From commit to customer in three steps.",
  description = "No new workflow to learn. It fits around the way your team already ships.",
  steps = defaultSteps,
}: StepsProps) {
  return (
    <section className="bg-bg px-6 py-24 text-fg md:px-8 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <div className="text-xs tracking-[0.2em] text-muted uppercase">{eyebrow}</div>
          <TextReveal as="h2" trigger="view" className="mt-5 font-display text-4xl leading-[1.02] md:text-6xl">
            {title}
          </TextReveal>
          {description && (
            <Reveal as="p" delay={150} className="mt-5 text-lg leading-relaxed text-muted">
              {description}
            </Reveal>
          )}
        </div>

        <ol className="relative mt-14 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
          {/* Joins the step numbers on wide screens. */}
          <span aria-hidden className="absolute top-7 right-[16%] left-[16%] hidden h-px bg-line md:block" />
          {steps.map((step, i) => (
            <Reveal as="li" key={step.title} delay={i * 90} className="relative min-w-0">
              <div className="surface h-full rounded-card p-7">
                <span className="relative grid size-14 place-items-center rounded-full border border-accent/40 bg-card font-display text-2xl text-accent tabular-nums">
                  {i + 1}
                </span>
                <h3 className="mt-6 text-lg font-medium">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{step.body}</p>
                {step.code && (
                  <code className="surface-field mt-5 block overflow-x-auto rounded-field px-3 py-2 font-mono text-xs whitespace-nowrap text-fg/85">
                    {step.code}
                  </code>
                )}
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
