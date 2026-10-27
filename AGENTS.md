<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Component collections

One Next.js app serves several design collections, plus a home page (the hamsi pond, `src/app/main`):

| Collection | Path | Look |
| --- | --- | --- |
| glass | /glass | Liquid glass on deep teal, Geist only, dark and light |
| tide | /tide | Clean admin style, green on cool slate, Geist, light and dark |

Collections live under a path by default, so the site needs no domain of its own (it deploys to a free `*.vercel.app` address). With a domain, `NEXT_PUBLIC_ROUTING=subdomain` serves them as `glass.example.com` instead; see `src/lib/routing.ts`. Inside the collection site, write links from the collection's root (`/components`) with `SiteLink` (`src/components/site/site-link.tsx`), which adds the prefix.

Locally: `localhost:3001`, `localhost:3001/glass`, `localhost:3001/tide` (`npm run dev`).

## Rule 1 — collections stay in lockstep

Every collection offers the **same** components, blocks, dashboards, templates, docs features and site sections, with the **same** slugs, props and behaviour. Only the theme and the marketing copy differ.

- There is one implementation of each component. Never fork a component per collection.
- Components style themselves only through the semantic theme contract (below). No collection-specific colours or classes in component code (`text-white`, hex values, `glass`-only utilities, etc.).
- A change to a component, block, docs feature, the tuner, the registry or a site section applies to every collection in the same change. If something cannot work in one theme, fix the contract, don't branch the component.
- When adding a token to the contract, define it in **every** theme file in the same change. `npm run check:themes` fails otherwise.
- New collection = new theme file + collection config + home page copy. Nothing else.
- **Use the library's own controls.** Blocks, dashboards, templates and patterns never hand-roll something the registry already has: checkbox, radio, switch, select, tabs, table, badge, avatar, kbd, progress, tooltip, dialog, sheet, button, field… Import `@/registry/kit/ui/<name>` so every improvement and theme reaches them. If the component can't do what you need, extend it.
- **Templates compose, never copy.** A template (src/registry/kit/templates/) is built only by importing registry components, blocks and dashboards. Never paste a block's markup into a template; if a template needs something a block can't do, add a prop to the block. So every component or block change reaches every template automatically — and when you change a component or block, re-check the templates that use it (see each template's `uses` in src/catalog/templates.ts).
- **A theme fix is never local.** When you change a theme file or fix a visual problem in one collection (contrast, overlay opacity, blur, shadows, radius, focus rings…), check the same case in **every** collection and in **both modes** (light and dark) of each, and make the equivalent change in the same change. Every theme supports `data-mode="light|dark"`, on `<html>` or on a subtree.
- Before calling a visual change done, look at it: screenshot the affected page in glass and tide, light and dark, at 390 / 820 / 1440 px (see "Verify" below).

## Rule 2 — the theme contract

Themes live in `src/themes/<collection>.css` and are applied with `data-theme="<collection>"` on `<html>`. Components may only use:

- colours: `bg`, `bg-deep`, `fg`, `muted`, `subtle`, `accent`, `accent-fg`, `line`, `line-strong`, `hover`, `field`, `field-focus`, `surface-hover`, `surface-selected`, plus tones `success|warning|info|danger` and their `-soft` backgrounds (Tailwind classes such as `text-fg`, `bg-hover`, `border-line`);
- surfaces: `surface` (cards), `surface-raised` (menus, popovers, dialogs, sheets), `surface-field` (inputs). Never give a surface a translucent background for a state (`hover:bg-fg/5`, `data-[state=checked]:bg-accent/10`): opaque themes (tide) then show the page through it. Use `hover:bg-surface-hover`, `bg-surface-selected` and `focus:bg-field-focus`; A whole clickable card (link tile, topic card, story card) uses the `lift` utility instead: it rises with a deeper shadow and keeps its fill.
- shape and type: `rounded-card`, `rounded-control`, `font-display`, `font-sans`;
- motion: `ease-theme` and the shared reveal/marquee/drift animations.

The authoritative list is `src/themes/contract.ts`.

## Rule 3 — engineering defaults

- CSS first; Motion only where springs or gestures matter, loaded through `MotionScope` (LazyMotion + domAnimation).
- Never re-render per frame: write pointer/scroll values to CSS variables or motion values.
- Reduced motion means calmer, not none. Under `prefers-reduced-motion: reduce`, reveals fade in place (no rise, no blur); every other animation still runs, since they are short, small or follow the user's own pointer. Don't add `motion-reduce:` kill switches or `prefers-reduced-motion` checks that freeze a component; tone down large travel instead. Animations use `backwards` fill so no transform/filter is left on text (it renders soft on Windows).
- A surface with `::before` decoration must not scroll itself; scroll an inner element.
- Write only the standard `backdrop-filter`; Tailwind adds prefixes. A `-webkit-backdrop-filter` line after it makes LightningCSS drop the standard one, and Chrome/Edge then show no blur at all.
- Custom properties used inside a `--animate-*` theme value resolve on :root; set per-element durations with an inline `animation-duration`.
- Verify layouts at 390, 820 and 1440 px (no horizontal overflow) in both collections and modes.
- Radix (`radix-ui`) for overlays and form primitives; keep their semantics, labels and focus-visible rings.
- Registry items import only from `@/registry/**` and npm packages — never `next/*`, `src/lib` or `src/components`.
- Demo copy is neutral software/product content.

**Media licensing.** No copyrighted images, video, audio or icons, in glass or tide, demos included. Use only our own work (SVG drawn in code, illustrations built from theme tokens, loops rendered with ffmpeg) or assets under CC0 / an open licence that allows commercial use. Third-party brand logos are out (brand names appear as text with an initials tile), except provider sign-in buttons such as Google and GitHub, which follow those providers' own logo guidelines. Put shipped media in `public/media/` and note its source and licence next to the reference (see `src/lib/site.ts`). Registry blocks default to these local files and expose a prop to swap them.

## Rule 4 — content, states and completeness

These rules cover content and completeness only. Visual style (fonts, colour, gradients, radius) is not set here — the collection theme owns it.

### 4a. Everywhere — components, patterns, charts, blocks, dashboards, templates, demos and the docs site

- **Copy.** Real draft copy in a product voice, sentence case for headings, labels and buttons. Specific, non-round numbers (4,183 users, €19/mo, 99.95%, 12 Mar), full realistic and varied names, invented brand names, varied dates. Never lorem ipsum or placeholder headlines.
- **Actions say what happens.** Button and link labels are verb + object ("Create project", "Start free trial", "Export CSV") — never "Learn more", "Click here" or "Submit".
- **Banned filler:** revolutionize, supercharge, cutting-edge, effortless, seamless, transform your workflow, take it to the next level, harness the power, world-class, streamline, optimize, unlock, game-changing.
- **System messages** (errors, empty states, toasts, confirmations) are calm and specific: what happened and what to do next. No exclamation marks.
- **Interactive states.** Every interactive element has hover, active (press), visible focus, and — where it applies — disabled, loading, empty and inline error states. Loading of content uses skeletons shaped like that content; spinners are for actions (a button saving), not page content.
- **No dead links.** Every link and button does something: navigates, toggles, or is visibly disabled. In demos, in-page actions use state instead of `href="#"`; the current nav item is marked.
- **Accessibility.** Semantic elements (`button` for actions, `a` for navigation, `nav`, `main`, `header`, `footer`, lists for lists, tables for tabular data); every control has an accessible name; meaningful images and icons have alt text or labels, decorative ones are `aria-hidden`; colour is never the only signal.

### 4b. Pages — landing pages, templates and full-page blocks (hero, pricing, auth, 404…)

The full workflow lives in the `template-design` skill (`.claude/skills/template-design/SKILL.md`).

- **One page, one job.** One audience, one offer, one primary action. Only one primary CTA above the fold; the final CTA repeats it word for word.
- **Section order** for a marketing page: hero (outcome-led headline, subhead, primary CTA, one proof signal) → 3–5 outcome-led benefits → how it works in 3 steps → proof (logos, numbers, quotes) next to the claims they support → a scroll text reveal statement mid-page (`ScrollTextReveal`) → 6–12 FAQ → risk reversal (free plan, no card, cancel anytime…) → final CTA → footer.
- **Ship checklist:** skip-to-content link, semantic landmarks, title + description + Open Graph tags, favicon, alt text, branded 404, privacy and terms links in the footer, client-side validation on email and required fields, a cookie notice only where the page actually sets non-essential cookies, a way back from every page.
- **Readable measure:** hero headline and subhead within about 680 px; headings use `text-balance`, body copy `text-pretty`, so no line ends on a single orphaned word.
- **Search and answer engines:** evergreen pages are indexed with a plain-language FAQ (`FAQPage` JSON-LD); ad-only and time-bound pages are noindex.

## Layout

- `src/registry/` — installable source (ui, blocks, dashboards, hooks, lib).
- `src/catalog/` — metadata per category; drives docs and `registry.json`.
- `src/demos/<category>/<slug>.tsx` — live preview and usage example.
- `src/themes/` — theme contract and one CSS file per collection.
- `src/collections/` — per-collection config (name, domain, fonts, tuner controls, home page).
- `scripts/build-registry.mts` — writes one registry per collection into `public/r/<collection>/`.

Verify with `npx tsc --noEmit`, `npx eslint src scripts`, `npm run check:themes`, and by loading the pages on both subdomains, in light and dark mode, at phone, tablet and desktop widths.
