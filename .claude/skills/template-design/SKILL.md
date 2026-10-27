---
name: template-design
description: Design and build a page or multi-page site template (landing page, product site, pricing page, app shell) for the glass/tide collections. Use whenever a new template, landing page or marketing section is requested, or an existing template is revised.
---

# Template design

Workflow for templates in `src/registry/kit/templates/`. The collection
theme owns all visual style; this skill covers structure, copy and
completeness. Read `AGENTS.md` (rules 1–4) first.

## 1. Intake

Ask for missing facts in one batch, never one question at a time:

- **Purpose:** the primary action and what counts as a conversion.
- **Audience:** who it is for, the problem solved, their top three objections, where they arrive from.
- **Proof:** logos, numbers, testimonials, screenshots, guarantees.
- **Traffic:** where visitors arrive from (ad, search, email, referral) and the message they saw there; the hero must match it.
- **Constraints:** voice, must-have pages, mobile priority.

If something is unknown, state one assumption and continue.

## 2. Plan before code

Return, in this order, before writing components:

1. Page outline per route (for multi-page sites: the hash routes).
2. Hero copy: headline (outcome + audience), subheadline, primary CTA (verb + what they get), one proof line.
3. Three to five benefits: bold outcome, then the proof or detail.
4. How it works in three steps.
5. Six to twelve FAQ items, written plainly (they double as answer-engine content).
6. Layout choice and why: A classic hero + sections · B long-form story for sceptical buyers · C minimal conversion page · D comparison ("X vs Y").
7. Index or noindex, plus title and meta description. Ad-only and time-bound pages (campaigns, launches) are noindex; evergreen pages are indexed, with the FAQ marked up as `FAQPage` JSON-LD and written as plain question → direct answer.

Useful headline shapes: "{Outcome} without {pain}", "The {category} for {audience}", "Ship {result} in {time}".

## 3. Build

- **Compose, never copy:** import blocks, dashboards and ui components from `@/registry/kit/**`. If a block lacks a needed link or slot, add a backward-compatible prop to the block.
- **Section order:** follow AGENTS.md rule 4, and include a `ScrollTextReveal` statement mid-page: two or more lines, a benefit in the product's voice.
- **Build order:** build and check one section at a time (hero → benefits → how it works → proof → FAQ → final CTA). Don't regenerate the whole page per iteration.
- **Navigation:** every page reachable, a way back from every page, the current item marked. Mobile menu opens as a full-height panel; its links enter in a stagger of about 60 ms each, capped at 400 ms total.
- **Hero measure:** headline and subheadline stay within about 680 px (`max-w-2xl`), with line breaks that fall on meaning, not wherever the width runs out. Use `text-balance` on headings and `text-pretty` on body copy so no line ends on an orphaned word.
- **Tagline reveal:** at least two lines at `text-4xl`–`text-6xl`; words start muted (25–35% opacity — `ScrollTextReveal` uses 0.28) and brighten one by one in reading order as the reader scrolls.
- **Nested corners:** an element inset inside a rounded parent uses the parent's radius minus the gap (`calc(var(--r-card) - 0.5rem)`), only when the gap is under 32 px and the result stays above 2 px; otherwise use the token as is.
- **Motion:** animate `transform` and `opacity` only; about 500 ms for layout moves and 300 ms for colour changes on the theme's easing; reveals are driven by IntersectionObserver, never an unthrottled scroll listener; under `prefers-reduced-motion` large travel calms down (reveals fade in place) rather than stopping, per AGENTS.md rule 3.

## 4. Copy rules

- Sentence case, specific numbers that don't look invented-round (12,480 not 12,000), realistic full names, fitting invented brands.
- Proof sits next to the claim it supports, never only at the bottom.
- At least one risk reducer near the CTA (free plan, no card, cancel anytime, refund window).
- Never: lorem ipsum, "Learn more", "Submit", exclamation marks in system messages, or the banned filler words in AGENTS.md rule 4.

## 5. Anti-patterns

- More than one competing CTA above the fold.
- Vague value props ("streamline your workflow").
- Feature lists with no outcomes.
- Proof buried at the bottom.
- No clear next step at the end of a page.
- Mobile layouts that shrink type instead of reflowing.
- A hero that doesn't match the ad or link that brought the visitor.
- Objections left unanswered: each top objection gets an answer in the benefits, the FAQ or the risk reversal.

## 6. Verify

- `npx tsc --noEmit`, `npx eslint src scripts`, `npm run registry:dev`.
- Load `/view/templates/<slug>` (and every hash route) on glass.localhost:3002 and tide.localhost:3002, light and dark, at 390, 820 and 1440 px: status 200, no console errors, no horizontal overflow. Look at screenshots, not just numbers.
- Walk the ship checklist in AGENTS.md rule 4 and the interactive states (hover, press, focus, loading, empty, error).

## Visual style

This skill sets no visual rules of its own: fonts, spacing, colour, gradients and icons come from the collection theme. Both collections use Geist, one face per collection.
