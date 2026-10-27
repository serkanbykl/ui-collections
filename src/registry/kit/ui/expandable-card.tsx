"use client";

import { AnimatePresence, LazyMotion, MotionConfig, domMax, m } from "motion/react";
import { useEffect, useId, useRef, useState } from "react";

import { cn } from "@/registry/kit/lib/utils";

export interface ExpandableItem {
  id: string;
  title: string;
  /** Short line under the title, shown in both states. */
  meta?: string;
  /** Teaser shown on the closed card. */
  summary: React.ReactNode;
  /** Full detail shown once expanded. */
  content: React.ReactNode;
}

export interface ExpandableCardsProps {
  items: ExpandableItem[];
  className?: string;
}

const spring = { type: "spring", stiffness: 320, damping: 34 } as const;

/**
 * The theme's card radius in px. Motion corrects layout-animated corners only
 * from numeric radii, so read --r-card and follow the Corners dial live.
 */
function useCardRadius(ref: React.RefObject<HTMLElement | null>) {
  const [radius, setRadius] = useState(24);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const raw = getComputedStyle(el).getPropertyValue("--r-card").trim();
      const value = parseFloat(raw);
      if (Number.isNaN(value)) return;
      const px = raw.endsWith("rem") ? value * parseFloat(getComputedStyle(document.documentElement).fontSize) : value;
      setRadius((prev) => (prev === px ? prev : px));
    };
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, { attributes: true, subtree: true, attributeFilter: ["data-radius", "data-theme", "style"] });
    return () => observer.disconnect();
  }, [ref]);
  return radius;
}

/**
 * Cards that grow into a centred surface sheet with a shared-layout animation,
 * then fold back to where they came from. Uses Motion's layout features
 * (`domMax`, about 10 kB more than the other Motion components), lazily
 * loaded per instance. Escape or the backdrop closes it and focus returns to
 * the card.
 */
export function ExpandableCards({ items, className }: ExpandableCardsProps) {
  const [openId, setOpenId] = useState<string | null>(null);
  const baseId = useId();
  const triggers = useRef(new Map<string, HTMLButtonElement>());
  const lastOpened = useRef<string | null>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const radius = useCardRadius(listRef);
  const open = items.find((i) => i.id === openId);

  useEffect(() => {
    if (!openId) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenId(null);
    window.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [openId]);

  const layout = (id: string, part: string) => `${baseId}-${id}-${part}`;

  return (
    <LazyMotion features={domMax} strict>
      <MotionConfig reducedMotion="never" transition={spring}>
        <ul ref={listRef} className={cn("grid gap-4 sm:grid-cols-2", className)}>
          {items.map((item) =>
            item.id === openId ? (
              // Keeps the grid in shape while the card is lifted out.
              <li key={item.id} aria-hidden className="invisible rounded-card p-6">
                <CardFace item={item} />
              </li>
            ) : (
              <li key={item.id}>
                <m.button
                  ref={(el: HTMLButtonElement | null) => {
                    if (el) triggers.current.set(item.id, el);
                  }}
                  layoutId={layout(item.id, "card")}
                  type="button"
                  aria-haspopup="dialog"
                  onClick={() => {
                    lastOpened.current = item.id;
                    setOpenId(item.id);
                  }}
                  className="surface block w-full cursor-pointer rounded-card p-6 text-left outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
                  style={{ borderRadius: radius }}
                >
                  <CardFace item={item} titleLayoutId={layout(item.id, "title")} />
                </m.button>
              </li>
            ),
          )}
        </ul>

        <AnimatePresence
          onExitComplete={() => {
            const id = lastOpened.current;
            if (id) triggers.current.get(id)?.focus();
          }}
        >
          {open && (
            <div key="sheet" className="fixed inset-0 z-50 grid place-items-center p-4">
              <m.div
                aria-hidden
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                onClick={() => setOpenId(null)}
                className="absolute inset-0 bg-bg-deep/55 backdrop-blur-sm"
              />
              <m.div
                layoutId={layout(open.id, "card")}
                role="dialog"
                aria-modal="true"
                aria-labelledby={layout(open.id, "heading")}
                className="surface-raised relative flex max-h-[85dvh] w-full max-w-lg flex-col overflow-hidden"
                style={{ borderRadius: radius }}
              >
                <div className="flex items-start justify-between gap-4 p-7 pb-4">
                  <div>
                    <m.h3
                      id={layout(open.id, "heading")}
                      layoutId={layout(open.id, "title")}
                      className="font-display text-3xl leading-tight tracking-[-0.02em]"
                    >
                      {open.title}
                    </m.h3>
                    {open.meta && <p className="mt-1 text-sm text-muted">{open.meta}</p>}
                  </div>
                  <button
                    type="button"
                    autoFocus
                    onClick={() => setOpenId(null)}
                    aria-label="Close"
                    className="surface grid size-9 shrink-0 cursor-pointer place-items-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
                  >
                    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden>
                      <path d="M6 6l12 12M18 6L6 18" />
                    </svg>
                  </button>
                </div>
                <m.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: 0.12, duration: 0.3 } }}
                  exit={{ opacity: 0, transition: { duration: 0.1 } }}
                  className="min-h-0 overflow-y-auto px-7 pb-7 text-[15px] leading-relaxed text-muted"
                >
                  {open.content}
                </m.div>
              </m.div>
            </div>
          )}
        </AnimatePresence>
      </MotionConfig>
    </LazyMotion>
  );
}

function CardFace({ item, titleLayoutId }: { item: ExpandableItem; titleLayoutId?: string }) {
  return (
    <>
      <m.h3 layoutId={titleLayoutId} className="font-display text-2xl leading-tight tracking-[-0.02em]">
        {item.title}
      </m.h3>
      {item.meta && <p className="mt-1 text-sm text-muted">{item.meta}</p>}
      <div className="mt-4 text-sm leading-relaxed text-muted">{item.summary}</div>
    </>
  );
}
