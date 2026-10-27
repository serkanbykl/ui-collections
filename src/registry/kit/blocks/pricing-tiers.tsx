"use client";

import { useState } from "react";

import { cn } from "@/registry/kit/lib/utils";
import { AuroraBackdrop } from "@/registry/kit/ui/aurora-backdrop";
import { ButtonShine, buttonVariants } from "@/registry/kit/ui/button";
import { SegmentedControl } from "@/registry/kit/ui/segmented-control";
import { Badge } from "@/registry/kit/ui/badge";

type Period = "monthly" | "yearly";

export interface Tier {
  name: string;
  description: string;
  monthly: number;
  yearly: number;
  features: string[];
  cta: string;
  /** Link for this tier's button; falls back to the block's ctaHref. */
  href?: string;
  featured?: boolean;
}

const defaultTiers: Tier[] = [
  {
    name: "Hobby",
    description: "For side projects and experiments.",
    monthly: 0,
    yearly: 0,
    features: ["3 projects", "Preview deploys", "Community support"],
    cta: "Start free",
  },
  {
    name: "Pro",
    description: "For small teams shipping every week.",
    monthly: 24,
    yearly: 19,
    features: ["Unlimited projects", "Team roles", "Usage alerts", "Email support"],
    cta: "Start 14-day trial",
    featured: true,
  },
  {
    name: "Scale",
    description: "For companies with serious traffic.",
    monthly: 96,
    yearly: 79,
    features: ["Everything in Pro", "SSO and audit logs", "99.99% SLA", "Dedicated engineer"],
    cta: "Talk to sales",
  },
];

export function PricingTiers({
  title = "Simple pricing that scales with you.",
  tiers = defaultTiers,
  ctaHref = "/signup",
  unit = "/ seat / month",
  note = "14-day trial on paid plans. No credit card, cancel anytime.",
  headingLevel: Heading = "h2",
}: {
  title?: string;
  tiers?: Tier[];
  /** Default link for every tier button. */
  ctaHref?: string;
  /** Text after a paid price. */
  unit?: string;
  /** Risk-reducing line under the plans. Pass an empty string to hide it. */
  note?: string;
  /** `h1` when the block opens its own page. */
  headingLevel?: "h1" | "h2";
}) {
  const [period, setPeriod] = useState<Period>("yearly");
  // Yearly saving per paid plan; "up to" when plans differ, so the label never overstates.
  const savings = tiers.filter((t) => t.monthly > 0).map((t) => Math.round((1 - t.yearly / t.monthly) * 100));
  const saving = Math.max(0, ...savings);
  const savingLabel = new Set(savings).size > 1 ? `save up to ${saving}%` : `save ${saving}%`;

  return (
    <section className="relative isolate overflow-hidden bg-bg-deep px-6 py-24 text-fg md:px-8 md:py-32">
      <AuroraBackdrop grid={false} className="opacity-60" />
      <div className="mx-auto max-w-6xl text-center">
        <Heading className="mx-auto max-w-2xl font-display text-4xl leading-[1.02] md:text-6xl">{title}</Heading>
        <SegmentedControl
          aria-label="Billing period"
          value={period}
          onValueChange={setPeriod}
          className="mt-8"
          options={[
            { value: "monthly", label: "Monthly" },
            { value: "yearly", label: saving > 0 ? `Yearly · ${savingLabel}` : "Yearly" },
          ]}
        />

        <div className="mt-14 grid gap-4 text-left md:grid-cols-3">
          {tiers.map((tier) => {
            const price = tier[period];
            return (
              <div
                key={tier.name}
                className={cn(
                  "surface flex flex-col rounded-card p-7",
                  // An outline, not a ring: rings replace the surface box-shadow.
                  tier.featured && "surface-raised outline outline-accent/40 md:-my-3 md:py-10",
                )}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">{tier.name}</h3>
                  {tier.featured && (
                    <Badge variant="accent-solid">Popular</Badge>
                  )}
                </div>
                <p className="mt-2 text-sm text-muted">{tier.description}</p>
                <p className="mt-8 flex items-baseline gap-1">
                  <span className="font-display text-6xl">${price}</span>
                  <span className="text-sm text-muted">{price === 0 ? "forever" : unit}</span>
                </p>
                <ul className="mt-8 mb-10 grid gap-3 text-sm">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-fg/85">
                      <svg viewBox="0 0 24 24" className="size-4 shrink-0 text-accent" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                        <path d="M5 12.5l4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href={tier.href ?? ctaHref}
                  className={buttonVariants({ variant: tier.featured ? "solid" : "surface", className: "mt-auto w-full" })}
                >
                  <ButtonShine />
                  {tier.cta}
                </a>
              </div>
            );
          })}
        </div>
        {note && <p className="mt-10 text-sm text-muted">{note}</p>}
      </div>
    </section>
  );
}
