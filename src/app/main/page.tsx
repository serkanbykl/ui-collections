import type { CSSProperties } from "react";

import { author, collectionAddress, collectionOrigin, collections } from "@/collections";
import { HamsiPond } from "@/components/pond/hamsi-pond";
import { LookSwitch } from "@/components/pond/look-switch";
import { ModeToggle } from "@/components/pond/mode-toggle";

const choices = [
  {
    id: "glass",
    // Rim and glow colour of the card.
    glow: "#2bd4c4",
    blurb: "Liquid glass on deep teal. Frosted surfaces and calm motion, dark and light.",
    // A frosted pane over teal water.
    swatch: (
      <span aria-hidden className="relative block size-12 shrink-0 overflow-hidden rounded-xl bg-[linear-gradient(140deg,#0b3a44,#06141b)]">
        <span className="absolute inset-x-2 top-3 h-5 rounded-md border border-white/25 bg-white/15" />
        <span className="absolute -right-2 -bottom-3 size-8 rounded-full bg-[#2bd4c4]/40" />
      </span>
    ),
  },
  {
    id: "tide",
    glow: "#1fb27a",
    blurb: "Clean admin screens in fresh green on cool slate, light and dark.",
    // A slate card with a green bar chart.
    swatch: (
      <span aria-hidden className="flex size-12 shrink-0 items-end gap-1 rounded-xl border border-[#d9dde5] bg-[#f6f7f9] p-2.5">
        <span className="h-3 flex-1 rounded-sm bg-[#1f9d6b]/45" />
        <span className="h-5 flex-1 rounded-sm bg-[#1f9d6b]/70" />
        <span className="h-7 flex-1 rounded-sm bg-[#1f9d6b]" />
      </span>
    ),
  },
] as const;

export default function HomePage() {
  return (
    <div className="relative min-h-dvh">
      <HamsiPond />

      <nav data-hamsi-avoid aria-label="Main" className="fixed inset-x-0 top-0 z-30 flex items-center justify-center gap-7 pt-7 text-[13px] lowercase">
        <LookSwitch />
        <ModeToggle />
      </nav>

      <main id="main" className="pointer-events-none relative z-20 flex min-h-dvh flex-col justify-end gap-9 px-6 pt-28 pb-12 lg:px-[16vw] lg:pb-24">
        <blockquote data-hamsi-avoid className="pointer-events-auto w-fit text-[13px] leading-relaxed tracking-[0.02em] lowercase">
          two collections, one codebase.
          <br />
          pick the water you like
          <span aria-hidden className="caret ml-1 inline-block h-[1em] w-[0.55em] translate-y-[0.15em] bg-(--ink)" />
        </blockquote>

        <div data-hamsi-avoid className="pointer-events-auto flex max-w-2xl flex-col gap-3 text-[15px] leading-[1.7]">
          <h1 className="text-balance">
            {author.name}
            <span className="text-(--ink-soft)"> · {author.role}</span>
          </h1>
          <p className="text-pretty text-(--ink-soft)">
            Two collections of React components you copy into your project and own. The same components, props and behaviour in two
            finishes. Choose one to browse its components, blocks and templates.
          </p>
        </div>

        <ul className="pointer-events-auto grid max-w-2xl gap-3 sm:grid-cols-2">
          {choices.map((c) => {
            const collection = collections[c.id];
            return (
              <li key={c.id}>
                <a
                  href={collectionOrigin(c.id)}
                  style={{ "--glow": c.glow } as CSSProperties}
                  className="choice surface group relative isolate flex h-full gap-4 overflow-hidden rounded-2xl p-4 outline-none"
                >
                  {/* A light that circles the rim, and a sheen that sweeps across on hover. */}
                  <span aria-hidden className="choice-rim" />
                  <span aria-hidden className="choice-sheen" />
                  {c.swatch}
                  <span className="flex flex-col gap-1">
                    <span className="flex items-center gap-2 text-[15px] font-medium">
                      Open {collection.name}
                      <span aria-hidden className="choice-arrow">
                        ↗
                      </span>
                    </span>
                    <span className="text-[13px] leading-relaxed text-pretty text-(--ink-soft)">{c.blurb}</span>
                    <span className="choice-domain text-[12px]">{collectionAddress(c.id)}</span>
                  </span>
                </a>
              </li>
            );
          })}
        </ul>

        <p className="flex flex-wrap justify-between gap-2 text-[12px] text-(--ink-soft)">
          <span>© 2026 {author.name}</span>
          <span aria-hidden>tap the water to feed the hamsi</span>
        </p>
      </main>
    </div>
  );
}
