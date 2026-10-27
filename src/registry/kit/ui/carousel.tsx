"use client";

import {
  Children,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
  type HTMLAttributes,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
  type Ref,
} from "react";

import { cn } from "@/registry/kit/lib/utils";
import { Button } from "@/registry/kit/ui/button";

type Breakpoint = "base" | "sm" | "md" | "lg" | "xl";
const breakpoints: Breakpoint[] = ["base", "sm", "md", "lg", "xl"];

export type SlidesPerView = number | Partial<Record<Breakpoint, number>>;
/** "hover" fades the control in on hover or keyboard focus on pointer devices; touch screens always show it. */
export type ControlVisibility = "always" | "hover" | "never";

/** Imperative controls, e.g. for a thumbnail strip. Pages are 0-based. */
export interface CarouselApi {
  goTo: (page: number) => void;
  next: () => void;
  prev: () => void;
}

export interface CarouselProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  /** Accessible name of the carousel, e.g. "Customer stories". */
  label: string;
  /** Each child is one slide. Slides share the tallest slide's height. */
  children: ReactNode;
  /** Slides visible at once (1–4 is typical). A number, or per viewport breakpoint: `{ base: 1, sm: 2, lg: 3 }`. */
  slidesPerView?: SlidesPerView;
  /** Any CSS length between slides. */
  gap?: string;
  /** Any CSS length of the next slide left visible at the edge, hinting there is more. */
  peek?: string;
  /** Centre the active slide, with neighbours peeking on both sides. Pages step one slide at a time. */
  center?: boolean;
  /** "snap" settles on slide edges; "free" scrolls freely and buttons still step by page. */
  scrollMode?: "snap" | "free";
  /** "slide" scrolls the track; "fade" cross-fades one slide at a time (slidesPerView is ignored). */
  transition?: "slide" | "fade";
  /** Prev on the first page goes to the last and next on the last goes to the first. */
  loop?: boolean;
  /** Milliseconds per page. Always pauses on focus and hidden tabs; off by default under reduced motion. */
  autoplay?: number;
  /** Pause autoplay while the pointer is over the carousel. */
  pauseOnHover?: boolean;
  /** Visible pause/play button while autoplay is on (WCAG 2.2.2). */
  showPlayPause?: boolean;
  /** Previous and next buttons. */
  arrows?: ControlVisibility;
  /** "bottom": in the row under the track; "overlay": on the track's edges; "outside": beside it from sm up, bottom below. */
  arrowPlacement?: "bottom" | "overlay" | "outside" | "controls";
  /** Page indicator. */
  dots?: ControlVisibility;
  /** "dots" and "bars" are buttons for each page; "fraction" reads "2 / 6". */
  indicator?: "dots" | "bars" | "fraction";
  /** Shorthand for arrows="never". */
  showArrows?: boolean;
  /** Shorthand for dots="never". */
  showDots?: boolean;
  /** Touch swipe, trackpad scroll and mouse drag. Off: only buttons, dots and keys move it. */
  draggable?: boolean;
  /** Horizontal mouse wheel and trackpad scrolling. */
  wheel?: boolean;
  /** Arrow keys, Home and End while focus is inside. */
  keyboard?: boolean;
  /** Room under the slides for card shadows and hover lift, inside the scroller. */
  bleed?: string;
  /** Called with the 0-based page whenever it changes (arrows, dots, keys, swipe or autoplay). */
  onPageChange?: (page: number) => void;
  /** Receives goTo / next / prev. */
  apiRef?: Ref<CarouselApi>;
  /** Classes for the scrolling track. */
  trackClassName?: string;
}

/** Breakpoint values become CSS variables, so the layout is right before hydration. */
function perViewVars(perView: SlidesPerView) {
  const map = typeof perView === "number" ? { base: perView } : perView;
  const vars: Record<string, number> = {};
  let last = 1;
  for (const bp of breakpoints) {
    last = Math.max(1, Math.floor(map[bp] ?? last));
    vars[`--carousel-per-${bp}`] = last;
  }
  return vars;
}

// Symmetric about x = 12, so the chevron sits in the optical centre of a round button.
const Chevron = ({ dir }: { dir: "prev" | "next" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="size-5 rtl:-scale-x-100">
    <path d={dir === "prev" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"} />
  </svg>
);

const hoverReveal =
  "transition-opacity duration-300 ease-theme [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover/carousel:opacity-100 [@media(hover:hover)]:group-focus-within/carousel:opacity-100";

const DRAG_THRESHOLD = 6;
const SWIPE_DISTANCE = 40;

/**
 * Scroll-snap carousel: native swipe and trackpad scrolling, mouse drag,
 * arrows, a page indicator, arrow keys while focus is inside and optional
 * autoplay with a pause button. Scroll position is read once per animation
 * frame and only a page change re-renders.
 */
export function Carousel({
  label,
  children,
  slidesPerView = 1,
  gap = "1rem",
  peek,
  center = false,
  scrollMode = "snap",
  transition = "slide",
  loop = false,
  autoplay,
  pauseOnHover = true,
  showPlayPause = true,
  arrows: arrowsProp = "always",
  arrowPlacement: placementProp = "bottom",
  dots: dotsProp = "always",
  indicator: indicatorProp = "dots",
  showArrows = true,
  showDots = true,
  draggable = true,
  wheel = true,
  keyboard = true,
  bleed = "2.75rem",
  onPageChange,
  apiRef,
  className,
  trackClassName,
  style,
  onKeyDown,
  ...props
}: CarouselProps) {
  const slides = Children.toArray(children);
  const total = slides.length;
  const fade = transition === "fade";
  const placement = placementProp === "controls" ? "bottom" : placementProp;
  const arrows: ControlVisibility = showArrows ? arrowsProp : "never";
  let dots: ControlVisibility = showDots ? dotsProp : "never";
  let indicator = indicatorProp;

  // Never leave a carousel without a way to move it: fall back to page dots.
  const pageButtons = dots !== "never" && indicator !== "fraction";
  const forcedDots = arrows === "never" && !pageButtons && (!draggable || !keyboard);
  if (forcedDots) {
    dots = "always";
    indicator = "dots";
  }
  useEffect(() => {
    if (forcedDots && process.env.NODE_ENV !== "production") {
      console.warn(`Carousel "${label}": arrows and page buttons are hidden, which needs both draggable and keyboard on. Showing page dots instead.`);
    }
  }, [forcedDots, label]);

  const basePer = fade ? 1 : typeof slidesPerView === "number" ? slidesPerView : (slidesPerView.base ?? 1);
  const trackRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<"user" | "auto" | null>(null);
  const pageRef = useRef(0);
  const onPageChangeRef = useRef(onPageChange);
  useEffect(() => {
    onPageChangeRef.current = onPageChange;
  });

  const [perView, setPerView] = useState(Math.max(1, basePer));
  const [page, setPage] = useState(0);
  const [scrollEdges, setEdges] = useState({ start: true, end: total <= basePer });
  const [announcement, setAnnouncement] = useState("");

  const [playChoice, setPlayChoice] = useState<boolean | null>(null);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [tabHidden, setTabHidden] = useState(false);
  const playing = autoplay != null && (playChoice ?? true);
  const running = playing && !(pauseOnHover && hovered) && !focused && !tabHidden;

  // Measured after layout (pages whose scroll positions coincide are merged); estimated before.
  const [measuredCount, setMeasuredCount] = useState<number | null>(null);
  const pageCount = fade ? Math.max(1, total) : (measuredCount ?? (center ? Math.max(1, total) : Math.max(1, Math.ceil(total / perView))));
  const hasPages = pageCount > 1;
  // Fade mode has no scroll position: edges follow the page.
  const edges = fade ? { start: page === 0, end: page >= total - 1 } : scrollEdges;

  const commit = useCallback(
    (next: number, firstSlide: number, per: number) => {
      if (next === pageRef.current) return;
      pageRef.current = next;
      setPage(next);
      onPageChangeRef.current?.(next);
      // Only navigation the user asked for is announced, never autoplay.
      if (navRef.current === "user") {
        const first = firstSlide + 1;
        const last = fade || center ? first : Math.min(first + per - 1, total);
        setAnnouncement(first === last ? `Slide ${first} of ${total}` : `Slides ${first} to ${last} of ${total}`);
      }
    },
    [fade, center, total],
  );

  /** Reads layout: slides per view, scroll range and where each page starts. */
  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track || !track.children.length) return null;
    const cs = getComputedStyle(track);
    const per = Math.max(1, Math.round(Number(cs.getPropertyValue("--carousel-per")) || 1));
    const rtl = cs.direction === "rtl";
    const max = Math.max(0, track.scrollWidth - track.clientWidth);
    const pos = Math.abs(track.scrollLeft);
    const padStart = parseFloat(rtl ? cs.paddingRight : cs.paddingLeft) || 0;
    const items = Array.from(track.children) as HTMLElement[];
    const startOf = (el: HTMLElement) => (rtl ? track.clientWidth - el.offsetLeft - el.offsetWidth : el.offsetLeft);
    const count = center ? items.length : Math.max(1, Math.ceil(items.length / per));
    const targets: number[] = [];
    const firsts: number[] = [];
    for (let p = 0; p < count; p++) {
      const index = center ? p : Math.min(p * per, Math.max(0, items.length - per));
      const el = items[index]!;
      const raw = center ? startOf(el) + el.offsetWidth / 2 - track.clientWidth / 2 : startOf(el) - padStart;
      const t = Math.min(Math.max(0, raw), max);
      // Slides that can't scroll any further share a page.
      if (targets.length && Math.abs(t - targets[targets.length - 1]!) < 2) continue;
      targets.push(t);
      firsts.push(index);
    }
    return { track, per, rtl, max, pos, targets, firsts };
  }, [center]);

  const sync = useCallback(() => {
    if (fade) return;
    const m = measure();
    if (!m) return;
    const atStart = m.pos <= 2;
    const atEnd = m.pos >= m.max - 2;
    let next = 0;
    m.targets.forEach((t, i) => {
      if (Math.abs(t - m.pos) < Math.abs(m.targets[next]! - m.pos)) next = i;
    });
    if (atEnd) next = m.targets.length - 1;
    setPerView(m.per);
    setMeasuredCount(m.targets.length);
    setEdges((e) => (e.start === atStart && e.end === atEnd ? e : { start: atStart, end: atEnd }));
    commit(next, m.firsts[next]!, m.per);
  }, [fade, measure, commit]);

  // Scroll is throttled to one read per frame; resizes re-measure.
  useEffect(() => {
    const track = trackRef.current;
    if (!track || fade) return;
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        sync();
      });
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    const ro = new ResizeObserver(onScroll);
    ro.observe(track);
    sync();
    return () => {
      track.removeEventListener("scroll", onScroll);
      ro.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [sync, fade]);


  // Wheel off: swallow horizontal wheel and trackpad gestures, let vertical page scroll through.
  useEffect(() => {
    const track = trackRef.current;
    if (!track || wheel || fade) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) || e.shiftKey) e.preventDefault();
    };
    track.addEventListener("wheel", onWheel, { passive: false });
    return () => track.removeEventListener("wheel", onWheel);
  }, [wheel, fade]);

  const goTo = useCallback(
    (target: number, source: "user" | "auto" = "user") => {
      navRef.current = source;
      if (fade) {
        const p = ((target % total) + total) % total;
        commit(p, p, 1);
        return;
      }
      const m = measure();
      if (!m) return;
      const count = m.targets.length;
      const p = ((target % count) + count) % count;
      m.track.scrollTo({ left: m.targets[p]! * (m.rtl ? -1 : 1), behavior: "smooth" });
    },
    [fade, total, commit, measure],
  );

  const prev = useCallback(() => {
    if (edges.start) {
      if (loop) goTo(pageCount - 1);
    } else goTo(pageRef.current - 1);
  }, [edges.start, loop, goTo, pageCount]);
  const next = useCallback(() => {
    if (edges.end) {
      if (loop) goTo(0);
    } else goTo(pageRef.current + 1);
  }, [edges.end, loop, goTo]);
  useImperativeHandle(apiRef, () => ({ goTo: (p: number) => goTo(p), next, prev }), [goTo, next, prev]);

  // Autoplay: one timer per page, restarted after any navigation.
  useEffect(() => {
    if (!running || !hasPages || autoplay == null) return;
    const id = window.setTimeout(() => goTo(edges.end ? 0 : pageRef.current + 1, "auto"), Math.max(1000, autoplay));
    return () => window.clearTimeout(id);
  }, [running, page, edges.end, hasPages, autoplay, goTo]);

  useEffect(() => {
    if (autoplay == null) return;
    const onVisibility = () => setTabHidden(document.hidden);
    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [autoplay]);

  // Pointer: mouse drag-to-scroll in slide mode, swipe for any pointer in fade mode.
  const drag = useRef<{ x: number; scroll: number; page: number; active: boolean; id: number } | null>(null);
  const suppressClick = useRef(false);

  const onTrackPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    navRef.current = "user";
    if (!draggable || e.button !== 0) return;
    if (!fade && e.pointerType !== "mouse") return; // touch and pen scroll natively
    drag.current = { x: e.clientX, scroll: e.currentTarget.scrollLeft, page: pageRef.current, active: false, id: e.pointerId };
  };
  const onTrackPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    const dx = e.clientX - d.x;
    if (!d.active && Math.abs(dx) > DRAG_THRESHOLD) {
      d.active = true;
      e.currentTarget.setPointerCapture(e.pointerId);
      e.currentTarget.dataset.dragging = "";
      // Snap would fight every programmatic scroll during the drag.
      e.currentTarget.style.scrollSnapType = "none";
    }
    if (d.active && !fade) e.currentTarget.scrollLeft = d.scroll - dx;
  };
  const onTrackPointerEnd = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    drag.current = null;
    if (!d.active) return;
    delete e.currentTarget.dataset.dragging;
    e.currentTarget.style.scrollSnapType = "";
    suppressClick.current = true;
    const dx = e.clientX - d.x;
    const rtl = getComputedStyle(e.currentTarget).direction === "rtl";
    const forward = rtl ? dx > 0 : dx < 0;
    if (fade) {
      if (Math.abs(dx) > SWIPE_DISTANCE) (forward ? next : prev)();
      return;
    }
    if (scrollMode === "free") return;
    // Settle on the page the drag was heading for.
    if (Math.abs(dx) > SWIPE_DISTANCE) goTo(forward ? Math.min(d.page + 1, pageCount - 1) : Math.max(d.page - 1, 0));
    else goTo(pageRef.current);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    onKeyDown?.(e);
    if (!keyboard || e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
    const el = e.target as HTMLElement;
    if (el.closest("input, textarea, select, [contenteditable='true'], [role='slider'], [role='radiogroup'], [role='listbox']")) return;
    const rtl = trackRef.current ? getComputedStyle(trackRef.current).direction === "rtl" : false;
    const keys: Record<string, () => void> = {
      ArrowLeft: rtl ? next : prev,
      ArrowRight: rtl ? prev : next,
      Home: () => goTo(0),
      End: () => goTo(pageCount - 1),
    };
    const action = keys[e.key];
    if (!action) return;
    e.preventDefault();
    navRef.current = "user";
    action();
  };

  const onBlur = (e: FocusEvent<HTMLElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false);
  };

  const showArrowButtons = arrows !== "never";
  const reveal = (v: ControlVisibility) => (v === "hover" ? hoverReveal : "");
  const bottomArrows = showArrowButtons && placement === "bottom";
  const outsideArrows = showArrowButtons && placement === "outside";
  const playButton = autoplay != null && showPlayPause;
  const hasRow = bottomArrows || outsideArrows || dots !== "never" || playButton;

  const arrowButton = (dir: "prev" | "next", size: "icon" | "icon-sm", extra?: string) => (
    <Button
      size={size}
      variant="surface"
      shine={false}
      aria-label={dir === "prev" ? "Previous slides" : "Next slides"}
      disabled={!hasPages || (!loop && (dir === "prev" ? edges.start : edges.end))}
      onClick={dir === "prev" ? prev : next}
      className={cn("grid place-items-center p-0", size === "icon-sm" && "[&_svg]:size-[18px]", extra)}
    >
      <Chevron dir={dir} />
    </Button>
  );

  const vars = {
    "--carousel-gap": gap,
    "--carousel-peek": peek ?? "0px",
    "--carousel-bleed": fade ? "0px" : bleed,
    // Width the slides give up: a peek after the last visible slide, or room on both sides when centred.
    "--carousel-reserve": center ? "0px" : peek ? `calc(${peek} + ${gap})` : "0px",
    ...perViewVars(fade ? 1 : slidesPerView),
    ...style,
  } as CSSProperties;

  return (
    <section
      aria-roledescription="carousel"
      aria-label={label}
      className={cn("group/carousel relative min-w-0", className)}
      style={vars}
      onKeyDown={handleKeyDown}
      onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={onBlur}
      {...props}
    >
      <div className={cn("relative", outsideArrows && "sm:flex sm:items-center sm:gap-3")}>
        {outsideArrows && hasPages && arrowButton("prev", "icon", cn("hidden -translate-y-[calc(var(--carousel-bleed)/2)] sm:grid", reveal(arrows)))}
        <div
          className={cn(
            "relative flow-root min-w-0 flex-1",
            // Focus ring around the slides only, not the shadow room under them.
            "after:pointer-events-none after:absolute after:inset-x-0 after:top-0 after:bottom-(--carousel-bleed) after:rounded-card after:outline-2 after:outline-offset-2 after:outline-accent after:content-[''] not-has-[>[data-carousel-track]:focus-visible]:after:hidden",
          )}
        >
          <div
            ref={trackRef}
            data-carousel-track=""
            role="group"
            aria-label="Slides"
            tabIndex={0}
            onPointerDown={onTrackPointerDown}
            onPointerMove={onTrackPointerMove}
            onPointerUp={onTrackPointerEnd}
            onPointerCancel={onTrackPointerEnd}
            onTouchStart={() => (navRef.current = "user")}
            onWheel={() => (navRef.current = "user")}
            onClickCapture={(e) => {
              if (!suppressClick.current) return;
              suppressClick.current = false;
              e.preventDefault();
              e.stopPropagation();
            }}
            onDragStart={(e) => draggable && e.preventDefault()}
            className={cn(
              "relative rounded-card outline-none",
              fade
                ? cn("grid", draggable && "touch-pan-y")
                : cn(
                    // Room for shadows and the hover lift lives inside the scroller; the controls row keeps its own space below.
                    "-mt-4 flex gap-(--carousel-gap) overscroll-x-contain pt-4 pb-(--carousel-bleed)",
                    "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
                    draggable ? "overflow-x-auto" : "overflow-x-hidden",
                    scrollMode === "snap" && "snap-x snap-mandatory",
                    center && "px-[calc(var(--carousel-peek)+var(--carousel-gap))] scroll-px-[calc(var(--carousel-peek)+var(--carousel-gap))]",
                  ),
              draggable && "data-dragging:cursor-grabbing data-dragging:select-none [@media(pointer:fine)]:cursor-grab",
              "[--carousel-per:var(--carousel-per-base)] sm:[--carousel-per:var(--carousel-per-sm)] md:[--carousel-per:var(--carousel-per-md)] lg:[--carousel-per:var(--carousel-per-lg)] xl:[--carousel-per:var(--carousel-per-xl)]",
              trackClassName,
            )}
          >
            {slides.map((slide, i) => {
              const hidden = fade && i !== page;
              return (
                <div
                  key={i}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${i + 1} of ${total}`}
                  aria-hidden={hidden || undefined}
                  inert={hidden}
                  className={cn(
                    "grid min-w-0",
                    fade
                      ? cn("[grid-area:1/1] transition-opacity duration-500 ease-theme", hidden ? "opacity-0" : "opacity-100")
                      : cn(
                          "shrink-0 grow-0 basis-[calc((100%-var(--carousel-reserve)-(var(--carousel-per)-1)*var(--carousel-gap))/var(--carousel-per))]",
                          scrollMode === "snap" && (center ? "snap-center" : "snap-start"),
                        ),
                  )}
                >
                  {slide}
                </div>
              );
            })}
          </div>
          {showArrowButtons && placement === "overlay" && hasPages && (
            <>
              {arrowButton("prev", "icon", cn("absolute start-3 top-[calc(50%-var(--carousel-bleed)/2)] z-10 -translate-y-1/2", reveal(arrows)))}
              {arrowButton("next", "icon", cn("absolute end-3 top-[calc(50%-var(--carousel-bleed)/2)] z-10 -translate-y-1/2", reveal(arrows)))}
            </>
          )}
        </div>
        {outsideArrows && hasPages && arrowButton("next", "icon", cn("hidden -translate-y-[calc(var(--carousel-bleed)/2)] sm:grid", reveal(arrows)))}
      </div>

      {hasRow && (
        <div
          className={cn("mt-1 flex h-8 items-center justify-between gap-4", !hasPages && "invisible", outsideArrows && !bottomArrows && dots === "never" && !playButton && "sm:hidden")}
          aria-hidden={!hasPages || undefined}
        >
          <div className="flex min-w-0 items-center gap-2">
            {playButton && (
              <Button
                size="icon-sm"
                variant="surface"
                shine={false}
                disabled={!hasPages}
                aria-label={playing ? "Pause slideshow" : "Play slideshow"}
                onClick={() => setPlayChoice(!playing)}
                className="grid place-items-center p-0"
              >
                {playing ? (
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <rect x="6.5" y="5" width="3.5" height="14" rx="1" />
                    <rect x="14" y="5" width="3.5" height="14" rx="1" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="rtl:-scale-x-100">
                    <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" />
                  </svg>
                )}
              </Button>
            )}
            {dots !== "never" && indicator === "fraction" && (
              <p className={cn("px-1 text-sm text-muted tabular-nums", reveal(dots))}>
                <span className="text-fg">{page + 1}</span> / {pageCount}
              </p>
            )}
            {dots !== "never" && indicator !== "fraction" && (
              <div className={cn("flex flex-wrap items-center", reveal(dots))}>
                {Array.from({ length: pageCount }, (_, i) => (
                  <button
                    key={i}
                    type="button"
                    aria-label={`Go to page ${i + 1} of ${pageCount}`}
                    aria-current={i === page ? "true" : undefined}
                    tabIndex={hasPages ? undefined : -1}
                    onClick={() => goTo(i)}
                    className={cn(
                      "group/dot grid h-6 cursor-pointer place-items-center rounded-full outline-none focus-visible:outline-2 focus-visible:outline-accent",
                      indicator === "bars" ? "px-0.5" : "w-6",
                    )}
                  >
                    <span
                      className={cn(
                        "block rounded-full transition-[width,background-color] duration-300 ease-theme",
                        indicator === "bars" ? "h-1 w-6" : cn("h-2", i === page ? "w-5" : "w-2"),
                        i === page ? "bg-accent" : "bg-fg/25 group-hover/dot:bg-fg/50",
                      )}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
          {(bottomArrows || outsideArrows) && (
            <div className={cn("flex shrink-0 items-center gap-2", outsideArrows && "sm:hidden", reveal(arrows))}>
              {arrowButton("prev", "icon-sm")}
              {arrowButton("next", "icon-sm")}
            </div>
          )}
        </div>
      )}

      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {announcement}
      </div>
    </section>
  );
}
