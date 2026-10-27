"use client";

import { createContext, useContext, useId, useState, type ElementType, type MouseEvent, type ReactNode } from "react";

import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/registry/kit/ui/sheet";
import {
  SidebarBrand,
  SidebarNav,
  SidebarProfile,
  SidebarSearch,
  type SidebarGroup,
} from "@/registry/kit/ui/sidebar-nav";
import { Breadcrumb, type BreadcrumbItem } from "@/registry/kit/ui/breadcrumb";
import { navLinks, navTrail } from "@/registry/kit/lib/nav-trail";
import { Skeleton, SkeletonText } from "@/registry/kit/ui/skeleton";
import { Toaster, type ToastPosition } from "@/registry/kit/ui/toast";
import { AuroraBackdrop } from "@/registry/kit/ui/aurora-backdrop";
import { AccountMenu, type AccountMenuItem } from "@/registry/kit/ui/account-menu";
import { Avatar } from "@/registry/kit/ui/avatar";
import { Button } from "@/registry/kit/ui/button";
import { NotificationBell, type NotificationItem } from "@/registry/kit/ui/notification-bell";

/* ---------------------------------------------------------------- icons */

const duo = (children: ReactNode) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    {children}
  </svg>
);

// Two-tone icons: a faint fill under a solid shape.
const icons = {
  logo: duo(<path d="M12 4c.6 4.6 2.4 6.9 7 8-4.6 1.1-6.4 3.4-7 8-.6-4.6-2.4-6.9-7-8 4.6-1.1 6.4-3.4 7-8Z" />),
  overview: duo(
    <>
      <rect x="3" y="3" width="8" height="8" rx="2.5" />
      <rect x="13" y="3" width="8" height="8" rx="2.5" opacity="0.4" />
      <rect x="3" y="13" width="8" height="8" rx="2.5" opacity="0.4" />
      <rect x="13" y="13" width="8" height="8" rx="4" />
    </>,
  ),
  analytics: duo(
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" opacity="0.4" />
      <rect x="7" y="11" width="2.5" height="6" rx="1.25" />
      <rect x="11" y="7" width="2.5" height="10" rx="1.25" />
      <rect x="15" y="13" width="2.5" height="4" rx="1.25" />
    </>,
  ),
  projects: duo(
    <>
      <path opacity="0.4" d="M3 7a3 3 0 0 1 3-3h4l2 2h6a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V7Z" />
      <rect x="7" y="11" width="10" height="2" rx="1" />
    </>,
  ),
  inbox: duo(
    <>
      <rect x="3" y="4" width="18" height="16" rx="4" opacity="0.4" />
      <path d="M3 13h5l1.5 2.5h5L16 13h5v3a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-3Z" />
    </>,
  ),
  team: duo(
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path opacity="0.4" d="M2.5 19c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6v1h-13v-1Z" />
      <circle cx="17" cy="9" r="2.5" opacity="0.4" />
    </>,
  ),
  settings: duo(
    <>
      <circle cx="12" cy="12" r="9" opacity="0.4" />
      <circle cx="12" cy="12" r="3.5" />
    </>,
  ),
};

const line = (d: string, className = "size-5") => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d={d} />
  </svg>
);

const groups: SidebarGroup[] = [
  {
    label: "General",
    items: [
      { label: "Overview", href: "#overview", icon: icons.overview },
      { label: "Analytics", href: "#analytics", icon: icons.analytics },
      { label: "Inbox", href: "#inbox", icon: icons.inbox, badge: 4 },
    ],
  },
  {
    label: "Workspace",
    items: [
      { label: "Projects", href: "#projects", icon: icons.projects, badge: 12 },
      { label: "Team", href: "#team", icon: icons.team },
    ],
  },
  {
    label: "System",
    items: [
      {
        label: "Settings",
        href: "#settings",
        icon: icons.settings,
        children: [
          { label: "General", href: "#settings/general" },
          { label: "Members", href: "#settings/members" },
          { label: "Billing", href: "#settings/billing" },
        ],
      },
    ],
  },
];

/* ----------------------------------------------------------- navigation */

// Without a `nav` prop the demo keeps navigation in state; with one, links are
// real anchors (or your router's Link via `linkAs`) and `currentHref` marks the page.
type LinkComponent = ElementType<{ href: string; className?: string; onClick?: () => void; "aria-current"?: "page"; children?: ReactNode }>;

const ShellNav = createContext<{ current: string; go: ((href: string) => void) | null; Link: LinkComponent }>({
  current: "",
  go: null,
  Link: "a",
});

function ShellLink({
  href,
  onClick,
  children,
  ...props
}: {
  href: string;
  onClick?: () => void;
  className?: string;
  "aria-current"?: "page";
  children?: ReactNode;
}) {
  const { go, Link } = useContext(ShellNav);
  if (!go)
    return (
      <Link href={href} onClick={onClick} {...props}>
        {children}
      </Link>
    );
  return (
    <a
      href={href}
      onClick={(e: MouseEvent) => {
        e.preventDefault();
        go(href);
        onClick?.();
      }}
      {...props}
    >
      {children}
    </a>
  );
}

const defaultBrand = { title: "Northwind", subtitle: "Workspace", href: "#overview" };
const defaultUser: AppShellUser = { name: "Mina Okafor", role: "Admin", settingsHref: "#settings/general" };

const defaultFooter = (
  <ShellLink
    href="#settings/billing"
    className="group relative isolate block overflow-hidden rounded-card bg-accent p-4 text-accent-fg outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
  >
    <span aria-hidden className="absolute -top-8 -right-8 -z-10 size-24 rounded-full border-[14px] border-accent-fg/10" />
    <span className="block text-sm font-semibold">Upgrade to Pro</span>
    <span className="mt-0.5 flex items-center gap-1 text-xs opacity-80">
      Unlimited projects and seats
      <span aria-hidden className="transition-[translate] duration-200 group-hover:translate-x-0.5">
        →
      </span>
    </span>
  </ShellLink>
);

interface SidebarChrome {
  nav: SidebarGroup[];
  brand: NonNullable<AppShellProps["brand"]>;
  user: AppShellUser;
  footer: ReactNode;
}

function ShellSidebar({
  searchId,
  logo,
  chrome,
  onNavigate,
}: {
  searchId: string;
  logo: ReactNode;
  chrome: SidebarChrome;
  onNavigate?: () => void;
}) {
  const { current, Link, go } = useContext(ShellNav);
  const [query, setQuery] = useState("");
  const { brand, user, nav, footer } = chrome;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex h-16 shrink-0 items-center px-4">
        <SidebarBrand icon={logo} title={brand.title} subtitle={brand.subtitle} href={brand.href ?? "#"} linkAs={ShellLink} />
      </div>
      <div className="shrink-0 px-3 pt-2 pb-3">
        <SidebarProfile
          name={user.name}
          role={user.role}
          avatar={user.avatar}
          action={
            user.settingsHref ? (
              <ShellLink
                href={user.settingsHref}
                onClick={onNavigate}
                aria-label="Account settings"
                className="inline-flex size-8 items-center justify-center rounded-control text-muted transition-colors outline-none hover:bg-hover hover:text-fg focus-visible:outline-2 focus-visible:outline-accent"
              >
                {line("M4 7h10M18 7h2M4 17h4M12 17h8M16 5v4M10 15v4", "size-4")}
              </ShellLink>
            ) : undefined
          }
        />
      </div>
      <div id={searchId} className="shrink-0 px-3 pb-3">
        <SidebarSearch value={query} onChange={setQuery} placeholder="Search menu…" />
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pb-3 [scrollbar-width:thin]">
        <SidebarNav groups={nav} currentHref={current} linkAs={go ? ShellLink : Link} onNavigate={onNavigate} filter={query} />
      </div>
      {footer && (
        // Closes the drawer when a link in the footer card is chosen.
        <div className="shrink-0 p-3" onClickCapture={onNavigate}>
          {footer}
        </div>
      )}
    </div>
  );
}

/* --------------------------------------------------------- notifications */

const initialNotices: AppShellNotice[] = [
  { id: "deploy", title: "Deploy to production finished", detail: "web-app · 2m 41s", time: "4 minutes ago", tone: "success" },
  { id: "invite", title: "Dario Reyes accepted your invite", detail: "Joined Northwind as Editor", time: "1 hour ago" },
];

/* --------------------------------------------------------------- content */

function DemoContent({ title }: { title: string }) {
  const stats = [
    { label: "Active projects", value: "12", note: "+2 this week" },
    { label: "Open issues", value: "38", note: "6 due today" },
    { label: "Deploys", value: "214", note: "99.2% successful" },
  ];
  return (
    <div className="grid gap-6">
      <div>
        <h2 className="font-display text-3xl md:text-4xl">{title}</h2>
        <p className="mt-2 text-muted">Here&apos;s what changed in your workspace since yesterday.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="surface rounded-card p-5">
            <p className="text-sm text-muted">{s.label}</p>
            <p className="mt-2 font-display text-3xl tabular-nums">{s.value}</p>
            <p className="mt-1 text-xs text-subtle">{s.note}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="surface rounded-card p-5">
          <p className="text-sm font-medium">Activity</p>
          <Skeleton className="mt-4 h-40" />
        </div>
        <div className="surface grid content-start gap-4 rounded-card p-5">
          <p className="text-sm font-medium">Recent</p>
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton shape="circle" className="size-9 shrink-0" />
              <SkeletonText lines={2} className="flex-1" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------- shell */

/** A top-bar notification; same shape as the NotificationBell's items. */
export type AppShellNotice = NotificationItem;

/** An entry in the top-bar account menu; see AccountMenu. */
export type AppShellMenuItem = AccountMenuItem;

export interface AppShellUser {
  name: string;
  role?: string;
  email?: string;
  /** Image URL; initials otherwise. */
  avatar?: string;
  /** Where the sidebar profile's settings button goes. Omit to hide it. */
  settingsHref?: string;
  /** Turns the top-bar avatar into an account menu. */
  menu?: AppShellMenuItem[];
}

export interface AppShellProps {
  /** Page title in the top bar; defaults to the current link's label. */
  title?: string;
  /** Page content; a placeholder dashboard is shown when omitted. */
  children?: ReactNode;
  /** Glyph inside the brand tile. Defaults to a spark. */
  logo?: ReactNode;
  /**
   * Your app's navigation. With it, links are real anchors (or `linkAs`) and
   * `currentHref` marks the page; without it the demo menu keeps its own state.
   */
  nav?: SidebarGroup[];
  /** The `nav` href of the current page. */
  currentHref?: string;
  /** Router link component for `nav`, e.g. Next's Link. Defaults to `a`. */
  linkAs?: LinkComponent;
  /** Sidebar brand row. */
  brand?: { title: string; subtitle?: string; href?: string };
  /** The signed-in person: sidebar profile, top-bar avatar and its menu. */
  user?: AppShellUser;
  /** Replaces the plan card at the foot of the sidebar; `null` removes it. */
  sidebarFooter?: ReactNode;
  /** Items in the top-bar bell; `[]` shows its empty state. */
  notifications?: AppShellNotice[];
  /** Called when notifications are read, e.g. to sync your store. */
  onNotificationsChange?: (items: AppShellNotice[]) => void;
  /** "View all notifications" link at the foot of the bell. */
  notificationsHref?: string;
  /** Where toasts from the screens appear. */
  toastPosition?: ToastPosition;
  /** Trail above the page. Derived from `nav` and `title` when omitted; `false` hides it. */
  breadcrumb?: BreadcrumbItem[] | false;
}

function UserButton({ user }: { user: AppShellUser }) {
  const { Link } = useContext(ShellNav);
  if (!user.menu?.length)
    return (
      <Avatar
        src={user.avatar}
        alt={user.name}
        role="img"
        aria-label={`Signed in as ${user.name}`}
        fallbackClassName="bg-accent/15 font-semibold text-accent"
      />
    );
  return <AccountMenu name={user.name} email={user.email} avatar={user.avatar} items={user.menu} linkAs={Link} />;
}

/**
 * Application layout: a full-height sidebar (brand, profile, menu search,
 * grouped navigation, plan card) on desktop that becomes a drawer on mobile,
 * a sticky top bar and a content area. Pass `nav` and `currentHref` to drive
 * it from your router. The chrome is left out when printing.
 */
export function AppShell({
  title,
  children,
  logo = icons.logo,
  nav,
  currentHref,
  linkAs = "a",
  brand = defaultBrand,
  user = defaultUser,
  sidebarFooter,
  notifications = initialNotices,
  onNotificationsChange,
  notificationsHref,
  toastPosition = "bottom-center",
  breadcrumb,
}: AppShellProps) {
  const [demoCurrent, setDemoCurrent] = useState("#overview");
  const [menuOpen, setMenuOpen] = useState(false);
  const id = useId();
  const desktopSearch = `${id}-search-desktop`;
  const mobileSearch = `${id}-search-mobile`;
  const controlled = nav !== undefined;
  const current = controlled ? (currentHref ?? "") : demoCurrent;
  const navGroups = nav ?? groups;
  const heading = title ?? navLinks(navGroups).find((l) => l.href === current)?.label ?? "Overview";
  const crumbs = breadcrumb === false ? [] : (breadcrumb ?? navTrail(navGroups, current, title));
  const chrome: SidebarChrome = {
    nav: navGroups,
    brand,
    user,
    footer: sidebarFooter === undefined ? (controlled ? null : defaultFooter) : sidebarFooter,
  };

  // The top-bar search jumps to the menu's search field (in the drawer on small screens).
  function focusSearch() {
    if (window.matchMedia("(min-width: 1024px)").matches) {
      document.getElementById(desktopSearch)?.querySelector("input")?.focus();
      return;
    }
    setMenuOpen(true);
    setTimeout(() => document.getElementById(mobileSearch)?.querySelector("input")?.focus(), 80);
  }

  return (
    <ShellNav value={{ current, go: controlled ? null : setDemoCurrent, Link: linkAs }}>
      <div className="relative isolate flex min-h-dvh bg-bg text-fg print:block print:min-h-0">
        {/* One shared page backdrop for every app screen; its strength is the theme's --aurora-strength. */}
        <AuroraBackdrop grid={false} className="fixed print:hidden" />
        <aside className="sticky top-0 hidden h-dvh w-72 shrink-0 border-r border-dashed border-line bg-bg-deep/40 lg:block print:hidden">
          <ShellSidebar searchId={desktopSearch} logo={logo} chrome={chrome} />
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 border-b border-line bg-bg/75 backdrop-blur-xl print:hidden">
            <div className="flex h-16 items-center gap-3 px-4 md:px-8">
              <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="Open navigation" className="size-10 lg:hidden">
                    {line("M4 7h16M4 12h16M4 17h10")}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" bodyClassName="p-0">
                  <SheetTitle className="sr-only">Navigation</SheetTitle>
                  <ShellSidebar searchId={mobileSearch} logo={logo} chrome={chrome} onNavigate={() => setMenuOpen(false)} />
                </SheetContent>
              </Sheet>

              <h1 className="truncate text-base font-semibold">{heading}</h1>

              <div className="ml-auto flex items-center gap-2">
                <button
                  type="button"
                  onClick={focusSearch}
                  className="surface-field hidden h-10 w-56 cursor-pointer items-center gap-2.5 rounded-control px-3 text-sm text-subtle transition-colors hover:text-muted sm:flex"
                >
                  {line("M11 17.5a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13M20 20l-4-4", "size-4 shrink-0")}
                  <span className="flex-1 text-left">Search…</span>
                </button>
                <Button variant="ghost" size="icon" onClick={focusSearch} aria-label="Search" className="size-10 sm:hidden">
                  {line("M11 17.5a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13M20 20l-4-4")}
                </Button>
                <NotificationBell items={notifications} onItemsChange={onNotificationsChange} viewAllHref={notificationsHref} />
                <UserButton user={user} />
              </div>
            </div>
          </header>

          <main id="main" className="w-full px-4 py-6 md:px-8 md:py-8 print:p-0">
            {crumbs.length > 1 && (
              <Breadcrumb
                items={crumbs}
                // The demo menu lives in state, so its crumbs navigate the same way.
                onSelect={controlled ? undefined : (i) => crumbs[i]?.href && setDemoCurrent(crumbs[i].href)}
                className="mb-5 print:hidden"
              />
            )}
            {children ?? <DemoContent title={heading} />}
          </main>
        </div>
      </div>
      <Toaster position={toastPosition} />
    </ShellNav>
  );
}
