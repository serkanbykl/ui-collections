---
name: design-review
description: Review and polish a screen in this repo (component, block, dashboard, template or the docs site) so it reads as designed rather than generated. Use when asked to polish, clean up, tighten or "make it look less AI", or before shipping a new block or template. Applies AGENTS.md rule 5 inside the glass and tide theme contract.
---

# Design review

A screen passes when every size, colour, word and motion on it was chosen. The theme already decides fonts, palette, radius and easing; this review checks how a piece *uses* them. Keep features, content and section order; change how they are drawn and worded.

## 1. Look first

Open the piece on both collections (`/glass/...` and `/tide/...` on localhost:3001), light and dark, at 390 and 1440 px. Take screenshots with the Playwright setup in the scratchpad and write down what you see before touching code. Name the one thing on the screen that should catch the eye; everything else supports it.

## 2. Find the tells

Grep the files you are reviewing, then confirm each hit on screen:

| Look for | Usually means | Change to |
| --- | --- | --- |
| `uppercase`, `tracking-[0.1em+]`, `tracking-wide*` on labels | shouting labels | sentence case, normal tracking, `text-xs text-muted` |
| `font-bold`, `font-extrabold`, display weight above 500 | weight doing hierarchy's job | size and colour; 500 at most |
| `bg-clip-text`, `from-* via-* to-*` on text or bars | gradient decoration | solid `text-fg` or `bg-accent` |
| `shadow-[0_0_Npx_…]`, `blur-2xl/3xl` colour blobs | glow | remove; surface step + hairline |
| `animate-ping`, `animate-pulse` on static things | fake liveness | static; keep only for live data |
| `hover:scale-*` on cards or buttons, `transition-all` | jumpy hover | colour/surface hover, named transitions |
| `"…."` in `title`/`h1`/`h2` strings | sentence-style headline | drop the final period |
| "New" pills, "Trusted by", "Loved by", hype words | unprovable filler | quiet link, specific number, or nothing |
| arbitrary `[13px]`-style spacing | off-grid | nearest 4 px step |

Exceptions: components whose purpose is the effect (shimmer, aurora, glass surfaces, live indicator) and imitation brand wordmarks.

## 3. Fix in this order

1. **Spacing and alignment.** 4 px scale; equal rows, equal gaps; tighter inside a group than between groups; icons in one column at one size.
2. **Colour.** Neutral surfaces from the theme; accent on the primary action, the selection and one key figure only.
3. **Type and copy.** Sentence case, two weights, tabular figures, no trailing periods on short strings, changes that say what they compare to, headlines with this product's own nouns.
4. **Details.** Nested radius, quiet counts and meta, keycaps for shortcuts, charts with one highlighted series on a muted grid, stat cards without decoration.
5. **Motion.** One entrance per view, short hovers, nothing looping without a reason.

## 4. Verify

- `npx tsc --noEmit`, `npx eslint src scripts`, `npm run check:themes`.
- Re-take the same screenshots and compare side by side. Check no horizontal overflow at 390 px.
- Ask: if the brand name were swapped for another product's, would the screen still fit? If yes, push the copy and the key visual further.
- Report what changed, grouped by the five steps, plus anything left for the user to decide (unverifiable claims, missing real data).
