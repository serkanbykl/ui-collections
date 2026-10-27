"use client";

import { useEffect, useId, useRef, useState, type ElementType, type ReactNode } from "react";

import { cn } from "@/registry/kit/lib/utils";

export interface SidebarLink {
  label: string;
  href: string;
  /** Variants grouped under this link; it then toggles a nested list (third level). */
  children?: SidebarLink[];
}

export interface SidebarItem extends SidebarLink {
  icon?: ReactNode;
  /** Count or short label shown on the right, e.g. unread items. */
  badge?: ReactNode;
  /** Sub-links; the row then toggles a nested list instead of navigating. */
  children?: SidebarLink[];
  /** Label of the first sub-link, which goes to this item's own `href`. Defaults to "Overview". */
  overviewLabel?: string;
}

export interface SidebarGroup {
  label?: string;
  items: SidebarItem[];
}

/** Anything that renders an anchor from `href`, such as Next's Link. Defaults to `a`. */
type LinkComponent = ElementType<{
  href: string;
  className?: string;
  onClick?: () => void;
  "aria-current"?: "page";
  children?: ReactNode;
}>;

export interface SidebarNavProps {
  groups: SidebarGroup[];
  /** The current path; marks the matching link and opens its section. */
  currentHref?: string;
  linkAs?: LinkComponent;
  /** Called after a link is chosen, e.g. to close a mobile drawer. */
  onNavigate?: () => void;
  /** Shows only links whose label contains this text; matching sections open. Pair with <SidebarSearch>. */
  filter?: string;
  className?: string;
}

/** Narrows a link tree to links whose label (or a descendant's) contains `q`. */
function filterLinks<T extends SidebarLink>(links: T[], q: string): T[] {
  return links.flatMap((link) => {
    if (link.label.toLowerCase().includes(q)) return [link];
    const children = link.children && filterLinks(link.children, q);
    return children?.length ? [{ ...link, children }] : [];
  });
}

function filterGroups(groups: SidebarGroup[], query: string): SidebarGroup[] {
  const q = query.trim().toLowerCase();
  if (!q) return groups;
  return groups
    .map((group) => ({ ...group, items: filterLinks(group.items, q) }))
    .filter((group) => group.items.length > 0);
}

/** True when `href` or any link below `link` is the current page. */
function containsCurrent(link: SidebarLink, current?: string): boolean {
  return link.href === current || !!link.children?.some((child) => containsCurrent(child, current));
}

const rowClass = cn(
  "group/nav relative flex h-10 w-full items-center gap-3 rounded-control px-3 text-left text-sm text-muted outline-none",
  "transition-[background-color,color] duration-200 ease-theme",
  "hover:bg-hover hover:text-fg focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent",
);

const activeRow = "bg-accent/12 font-medium text-accent hover:bg-accent/12 hover:text-accent";

function Icon({ children, active }: { children: ReactNode; active: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex size-5 shrink-0 items-center justify-center transition-[scale] duration-200 group-hover/nav:scale-105 [&_svg]:size-5",
        !active && "text-subtle group-hover/nav:text-fg",
      )}
    >
      {children}
    </span>
  );
}

function isWithin(current: string | undefined, href: string) {
  return !!current && (current === href || current.startsWith(`${href}/`));
}

/**
 * Grouped app navigation: overline section labels, icon rows with a soft
 * accent for the current page, count badges, and rows that expand into
 * sub-links. Works with any router through `linkAs`.
 */
/** Nearest ancestor that scrolls vertically. */
function scrollParent(el: HTMLElement | null) {
  for (let node = el?.parentElement; node; node = node.parentElement) {
    if (/(auto|scroll)/.test(getComputedStyle(node).overflowY) && node.scrollHeight > node.clientHeight) return node;
  }
  return null;
}

/**
 * Brings the current link into view after navigation. Waits for its section to
 * finish expanding, and scrolls only the sidebar's own scroller (scrollIntoView
 * would move the page too).
 */
function useRevealCurrent(nav: React.RefObject<HTMLElement | null>, currentHref?: string) {
  useEffect(() => {
    const timer = setTimeout(() => {
      const link = nav.current?.querySelector<HTMLElement>('[aria-current="page"]');
      const scroller = scrollParent(link ?? null);
      if (!link || !scroller) return;
      const linkBox = link.getBoundingClientRect();
      const box = scroller.getBoundingClientRect();
      if (linkBox.top >= box.top + 8 && linkBox.bottom <= box.bottom - 8) return;
      scroller.scrollTo({
        top: scroller.scrollTop + linkBox.top - box.top - box.height / 2 + linkBox.height / 2,
        behavior: "smooth",
      });
    }, 340);
    return () => clearTimeout(timer);
  }, [nav, currentHref]);
}

export function SidebarNav({ groups, currentHref, linkAs: Link = "a", onNavigate, filter = "", className }: SidebarNavProps) {
  const filtering = filter.trim().length > 0;
  const visible = filterGroups(groups, filter);
  const navRef = useRef<HTMLElement>(null);
  useRevealCurrent(navRef, currentHref);

  return (
    <nav ref={navRef} className={cn("flex flex-col", className)}>
      {filtering && visible.length === 0 && <p className="px-3 py-6 text-center text-sm text-muted">No matches.</p>}
      {visible.map((group, i) => (
        <div key={group.label ?? i} className={cn(i > 0 && "mt-5")}>
          {group.label && (
            <div className="px-3 pb-2 text-[11px] font-medium tracking-[0.16em] text-subtle uppercase">{group.label}</div>
          )}
          <ul className="flex flex-col gap-0.5">
            {group.items.map((item) => (
              <li key={item.href}>
                {item.children?.length ? (
                  <ExpandableRow
                    // Remount while filtering so matching sections show open.
                    key={filtering ? "filtering" : "browsing"}
                    item={item}
                    currentHref={currentHref}
                    Link={Link}
                    onNavigate={onNavigate}
                    forceOpen={filtering}
                  />
                ) : (
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    aria-current={currentHref === item.href ? "page" : undefined}
                    className={cn(rowClass, currentHref === item.href && activeRow)}
                  >
                    {item.icon && <Icon active={currentHref === item.href}>{item.icon}</Icon>}
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.badge !== undefined && <Badge>{item.badge}</Badge>}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1.5 text-[11px] font-semibold text-accent-fg tabular-nums">
      {children}
    </span>
  );
}

const subRowClass = cn(
  "group/sub flex h-9 w-full items-center gap-2.5 rounded-control px-2 text-left text-[13px] text-muted outline-none transition-colors duration-200",
  "hover:bg-hover hover:text-fg focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent",
);

function Dot({ current }: { current: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "size-1.5 shrink-0 rounded-full transition-[scale,background-color] duration-200",
        current ? "scale-125 bg-current" : "bg-subtle/60 group-hover/sub:bg-current",
      )}
    />
  );
}

/** A link inside a section; with `children` it becomes a family of variants that toggles. */
function SubItem({
  link,
  currentHref,
  Link,
  onNavigate,
  forceOpen,
}: {
  link: SidebarLink;
  currentHref?: string;
  Link: LinkComponent;
  onNavigate?: () => void;
  forceOpen: boolean;
}) {
  const panelId = useId();
  const active = containsCurrent(link, currentHref);
  const [open, setOpen] = useState(active || forceOpen);
  const [wasActive, setWasActive] = useState(active);
  if (active !== wasActive) {
    setWasActive(active);
    if (active) setOpen(true);
  }

  if (!link.children?.length) {
    const current = currentHref === link.href;
    return (
      <Link
        href={link.href}
        onClick={onNavigate}
        aria-current={current ? "page" : undefined}
        className={cn(subRowClass, current && activeRow)}
      >
        <Dot current={current} />
        <span className="truncate">{link.label}</span>
      </Link>
    );
  }

  return (
    <div>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className={cn(subRowClass, active && "text-accent")}
      >
        <Dot current={false} />
        <span className="flex-1 truncate">{link.label}</span>
        <span className="text-[11px] text-subtle tabular-nums">{link.children.length}</span>
        <svg
          viewBox="0 0 24 24"
          aria-hidden
          className={cn("size-3.5 shrink-0 opacity-60 transition-[rotate] duration-300 ease-theme", open && "rotate-180")}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      <div
        id={panelId}
        inert={!open}
        className={cn(
          "grid transition-[grid-template-rows,opacity] duration-300 ease-theme",
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <ul className="ml-[0.6rem] flex min-h-0 flex-col gap-0.5 overflow-hidden border-l border-line py-0.5 pl-2.5">
          {link.children.map((child) => (
            <li key={child.href}>
              <SubItem link={child} currentHref={currentHref} Link={Link} onNavigate={onNavigate} forceOpen={forceOpen} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function ExpandableRow({
  item,
  currentHref,
  Link,
  onNavigate,
  forceOpen = false,
}: {
  item: SidebarItem;
  currentHref?: string;
  Link: LinkComponent;
  onNavigate?: () => void;
  forceOpen?: boolean;
}) {
  const panelId = useId();
  const active = isWithin(currentHref, item.href);
  const [open, setOpen] = useState(active || forceOpen);
  // Re-open when navigation lands inside this section (render-time sync, no effect).
  const [wasActive, setWasActive] = useState(active);
  if (active !== wasActive) {
    setWasActive(active);
    if (active) setOpen(true);
  }

  return (
    <div>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className={cn(rowClass, active && "font-medium text-accent")}
      >
        {item.icon && <Icon active={active}>{item.icon}</Icon>}
        <span className="flex-1 truncate">{item.label}</span>
        {item.badge !== undefined && <Badge>{item.badge}</Badge>}
        <svg
          viewBox="0 0 24 24"
          aria-hidden
          className={cn("size-4 shrink-0 opacity-60 transition-[rotate] duration-300 ease-theme", open && "rotate-180")}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      <div
        id={panelId}
        inert={!open}
        className={cn(
          "grid transition-[grid-template-rows,opacity] duration-300 ease-theme",
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <ul className="ml-[1.4rem] flex min-h-0 flex-col gap-0.5 overflow-hidden border-l border-line py-1 pl-3">
          {[{ label: item.overviewLabel ?? "Overview", href: item.href }, ...(item.children ?? [])].map((child) => {
            return (
              <li key={child.href}>
                <SubItem link={child} currentHref={currentHref} Link={Link} onNavigate={onNavigate} forceOpen={forceOpen} />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

/** Search field for the top of a sidebar; feed its value to `<SidebarNav filter>`. */
export function SidebarSearch({
  value,
  onChange,
  placeholder = "Search…",
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <label className={cn("surface-field flex h-10 items-center gap-2.5 rounded-control px-3 text-sm", className)}>
      <svg viewBox="0 0 24 24" className="size-4 shrink-0 text-subtle" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden>
        <circle cx="11" cy="11" r="6.5" />
        <path d="m20 20-4-4" />
      </svg>
      <span className="sr-only">Search navigation</span>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Escape" && onChange("")}
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent text-fg outline-none placeholder:text-subtle [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={(e) => {
            onChange("");
            // Keep typing where you were: focus the field inside this label.
            e.currentTarget.parentElement?.querySelector("input")?.focus();
          }}
          className="-mr-1 grid size-7 shrink-0 animate-pop-in cursor-pointer place-items-center rounded-full text-muted transition-colors hover:bg-fg/8 hover:text-fg focus-visible:outline-2 focus-visible:outline-accent"
        >
          <svg viewBox="0 0 24 24" aria-hidden className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>
      )}
    </label>
  );
}

/** Brand row for the top of a sidebar: icon tile, name and a quiet subtitle. */
export function SidebarBrand({
  icon,
  title,
  subtitle,
  href = "/",
  linkAs: Link = "a",
}: {
  icon: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  href?: string;
  linkAs?: LinkComponent;
}) {
  return (
    <Link href={href} className="group flex items-center gap-3 rounded-control outline-none focus-visible:outline-2 focus-visible:outline-accent">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-control bg-accent text-accent-fg shadow-[0_8px_20px_-8px_var(--color-accent)] [&_svg]:size-5">
        {icon}
      </span>
      <span className="min-w-0 leading-tight">
        <span className="block truncate font-display text-lg">{title}</span>
        {subtitle && <span className="block truncate text-xs text-muted">{subtitle}</span>}
      </span>
    </Link>
  );
}

/** Profile card: avatar image (or initials), name, role and an optional action button. */
export function SidebarProfile({
  name,
  role,
  initials,
  avatar,
  action,
}: {
  name: string;
  role?: string;
  initials?: string;
  /** Image URL. Line-art avatars stay visible in dark mode: the circle is always a light accent tint. */
  avatar?: string;
  action?: ReactNode;
}) {
  const letters = initials ?? name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div className="surface flex items-center gap-3 rounded-card p-3">
      {avatar ? (
        // eslint-disable-next-line @next/next/no-img-element -- registry code stays framework-free
        <img
          src={avatar}
          alt=""
          className="size-11 shrink-0 rounded-full bg-[color-mix(in_oklab,var(--color-accent)_22%,white)] object-cover ring-2 ring-bg"
        />
      ) : (
        <span
          aria-hidden
          className="flex size-11 shrink-0 items-center justify-center rounded-full bg-accent/15 text-sm font-semibold text-accent ring-2 ring-bg"
        >
          {letters}
        </span>
      )}
      <div className="min-w-0 flex-1 leading-tight">
        <p className="truncate text-sm font-semibold">{name}</p>
        {role && <p className="truncate text-xs text-muted">{role}</p>}
      </div>
      {action}
    </div>
  );
}
