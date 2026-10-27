"use client";

import { AnimatePresence, m } from "motion/react";
import { useEffect, useId, useRef, useState } from "react";

import { useSlidingIndicator } from "@/registry/kit/hooks/use-sliding-indicator";
import { MotionScope } from "@/registry/kit/lib/motion";
import { cn } from "@/registry/kit/lib/utils";

export interface NavItem {
  label: string;
  href: string;
}

export interface SiteNavProps {
  brand: React.ReactNode;
  items: NavItem[];
  /** Call to action shown on the right; repeated at the bottom of the mobile menu. */
  action?: React.ReactNode;
  /** Stays in the bar at every width, before the action, e.g. a notification bell. */
  utility?: React.ReactNode;
  /** Pin to the top of the viewport and turn solid once the page scrolls. */
  fixed?: boolean;
  /** Overrides scroll-spy, e.g. with the current pathname for route links. */
  activeHref?: string;
  className?: string;
}

/** Highlights the in-page section (`#id` links) crossing a line 35% down the viewport. */
function useScrollSpy(hrefs: string[]) {
  const key = hrefs.filter((h) => h.startsWith("#")).join(" ");
  const [active, setActive] = useState<string>();

  useEffect(() => {
    const ids = key ? key.split(" ").map((h) => h.slice(1)) : [];
    const sections = ids.map((id) => document.getElementById(id)).filter((el) => el !== null);
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries.find((e) => e.isIntersecting);
        if (hit) setActive(`#${hit.target.id}`);
      },
      { rootMargin: "-35% 0px -64% 0px" },
    );
    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [key]);

  return active;
}

/** True once `sentinel` has scrolled out of view. */
function useScrolledPast(sentinel: React.RefObject<HTMLElement | null>, enabled: boolean) {
  const [past, setPast] = useState(false);
  useEffect(() => {
    const el = sentinel.current;
    if (!enabled || !el) return;
    const observer = new IntersectionObserver(([entry]) => setPast(!entry?.isIntersecting));
    observer.observe(el);
    return () => observer.disconnect();
  }, [sentinel, enabled]);
  return past;
}

export function SiteNav({ brand, items, action, utility, fixed = true, activeHref, className }: SiteNavProps) {
  const [open, setOpen] = useState(false);
  const spied = useScrollSpy(activeHref === undefined ? items.map((i) => i.href) : []);
  const active = activeHref ?? spied;
  const sentinelRef = useRef<HTMLDivElement>(null);
  const scrolled = useScrolledPast(sentinelRef, fixed);
  const listRef = useRef<HTMLUListElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);
  const menuId = useId();
  useSlidingIndicator(listRef, pillRef, active);

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const desktop = window.matchMedia("(min-width: 768px)");
    const onDesktop = () => desktop.matches && setOpen(false);
    window.addEventListener("keydown", onKey);
    desktop.addEventListener("change", onDesktop);
    return () => {
      root.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onDesktop);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <MotionScope>
      <div ref={sentinelRef} aria-hidden className="pointer-events-none absolute top-0 h-px w-px" />
      <header
        className={cn(
          "z-50 w-full transition-[background-color,backdrop-filter,box-shadow] duration-500 ease-theme",
          fixed ? "fixed inset-x-0 top-0" : "relative",
          fixed && (scrolled || open)
            ? "bg-bg/75 shadow-[0_1px_0_var(--c-line)] backdrop-blur-xl"
            : "bg-transparent",
          className,
        )}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-5 md:px-8">
          <div className="shrink-0">{brand}</div>

          <ul ref={listRef} className="relative hidden items-center md:flex">
            <span
              ref={pillRef}
              aria-hidden
              className="absolute inset-y-0 left-0 rounded-control bg-fg/[0.07] opacity-0 data-[ready=true]:transition-[transform,width,opacity] data-[ready=true]:duration-500 data-[ready=true]:ease-theme"
            />
            {items.map((item) => {
              const isActive = item.href === active;
              return (
                <li key={item.href}>
                  <a
                    href={item.href}
                    aria-current={isActive ? (item.href.startsWith("#") ? "location" : "page") : undefined}
                    data-indicator-target={isActive}
                    className={cn(
                      "relative block rounded-control px-4 py-2 text-sm transition-colors duration-300",
                      "outline-none focus-visible:outline-2 focus-visible:outline-accent",
                      isActive ? "text-fg" : "text-muted hover:text-fg",
                    )}
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-3">
            {utility}
            {action && <div className="hidden sm:block">{action}</div>}
            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls={menuId}
              onClick={() => setOpen((v) => !v)}
              className="surface flex size-11 cursor-pointer items-center justify-center rounded-control transition-[background-color,scale] duration-200 hover:bg-surface-hover active:scale-(--press-scale) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent md:hidden"
            >
              <span className="flex flex-col gap-[5px]" aria-hidden>
                <span className={cn("block h-[1.5px] w-5 bg-fg transition-transform duration-300", open && "translate-y-[6.5px] rotate-45")} />
                <span className={cn("block h-[1.5px] w-5 bg-fg transition-opacity duration-300", open && "opacity-0")} />
                <span className={cn("block h-[1.5px] w-5 bg-fg transition-transform duration-300", open && "-translate-y-[6.5px] -rotate-45")} />
              </span>
            </button>
          </div>
        </nav>

        <AnimatePresence>
          {open && (
            <m.div
              id={menuId}
              key="menu"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ type: "spring", stiffness: 380, damping: 32 }}
              className="px-4 pb-4 md:hidden"
            >
              <m.ul
                className="surface-raised flex flex-col rounded-card p-2"
                initial="hidden"
                animate="shown"
                variants={{ shown: { transition: { staggerChildren: 0.04, delayChildren: 0.05 } } }}
              >
                {items.map((item) => (
                  <m.li
                    key={item.href}
                    variants={{ hidden: { opacity: 0, x: -8 }, shown: { opacity: 1, x: 0 } }}
                  >
                    <a
                      href={item.href}
                      onClick={close}
                      aria-current={item.href === active ? (item.href.startsWith("#") ? "location" : "page") : undefined}
                      className="block rounded-[max(0.25rem,calc(var(--r-card)-0.5rem))] px-5 py-3.5 text-base text-fg/85 outline-none transition-colors hover:bg-fg/5 hover:text-fg focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent aria-[current]:text-fg"
                    >
                      {item.label}
                    </a>
                  </m.li>
                ))}
                {action && (
                  <m.li
                    className="p-2 sm:hidden [&_a]:w-full [&_button]:w-full"
                    onClick={close}
                    variants={{ hidden: { opacity: 0 }, shown: { opacity: 1 } }}
                  >
                    {action}
                  </m.li>
                )}
              </m.ul>
            </m.div>
          )}
        </AnimatePresence>
      </header>
    </MotionScope>
  );
}
