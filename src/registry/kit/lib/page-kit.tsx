"use client";

import type { ReactNode } from "react";

import { cn } from "@/registry/kit/lib/utils";
import { AuroraBackdrop } from "@/registry/kit/ui/aurora-backdrop";
import { Reveal, TextReveal } from "@/registry/kit/ui/reveal";

/*
 * Shared pieces for the marketing page blocks (about, careers, blog post,
 * contact, customers, case study): the page header and small text styles.
 */

export type HeadingLevel = "h1" | "h2";

/** Tinted gradients for initials avatars and cover art, cycled by index. */
export const tints = ["from-accent/70 to-info/40", "from-info/70 to-accent/40", "from-success/70 to-info/40", "from-warning/60 to-accent/40"];

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn("text-xs font-medium tracking-[0.2em] text-accent uppercase", className)}>{children}</p>;
}

/** Page header on the aurora. Renders the page's h1 unless `headingLevel` says otherwise. */
export function PageHero({
  eyebrow,
  title,
  lead,
  headingLevel: Heading = "h1",
  align = "left",
  children,
}: {
  eyebrow?: ReactNode;
  title: string;
  lead?: ReactNode;
  headingLevel?: HeadingLevel;
  align?: "left" | "center";
  /** Extra content under the lead: actions, filters, meta. */
  children?: ReactNode;
}) {
  return (
    <header className="relative isolate overflow-hidden bg-bg-deep pt-24 pb-16 text-fg md:pt-32 md:pb-20">
      <AuroraBackdrop grid={false} className="opacity-60" />
      <div className={cn("mx-auto max-w-6xl px-5 sm:px-8", align === "center" && "text-center")}>
        {eyebrow && (
          <Reveal trigger="load">
            <Eyebrow>{eyebrow}</Eyebrow>
          </Reveal>
        )}
        <TextReveal
          as={Heading}
          trigger="load"
          delay={100}
          className={cn("mt-4 max-w-3xl font-display text-5xl leading-[1.02] md:text-7xl", align === "center" && "mx-auto")}
        >
          {title}
        </TextReveal>
        {lead && (
          <Reveal as="p" trigger="load" delay={300} className={cn("mt-6 max-w-2xl text-lg leading-relaxed text-muted", align === "center" && "mx-auto")}>
            {lead}
          </Reveal>
        )}
        {children && (
          <Reveal trigger="load" delay={450} className="mt-10">
            {children}
          </Reveal>
        )}
      </div>
    </header>
  );
}

/** h2 + optional lead for a page section. */
export function SectionTitle({ title, lead, id, className }: { title: string; lead?: ReactNode; id?: string; className?: string }) {
  return (
    <div className={cn("max-w-2xl", className)}>
      <TextReveal as="h2" id={id} trigger="view" className="font-display text-4xl md:text-5xl">
        {title}
      </TextReveal>
      {lead && <p className="mt-4 text-lg leading-relaxed text-muted">{lead}</p>}
    </div>
  );
}

export const linkClass = "rounded-sm text-accent underline-offset-4 hover:underline";
