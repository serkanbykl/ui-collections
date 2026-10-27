"use client";

import { createContext, useContext, useState, type MouseEvent, type ReactNode } from "react";

import { SidebarBrand, SidebarNav, SidebarProfile, SidebarSearch } from "@/registry/kit/ui/sidebar-nav";

const icon = (path: ReactNode) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    {path}
  </svg>
);

// Two-tone icons: a faint fill under a solid accent shape.
const icons = {
  home: icon(
    <>
      <rect x="3" y="3" width="8" height="8" rx="2.5" />
      <rect x="13" y="3" width="8" height="8" rx="2.5" opacity="0.4" />
      <rect x="3" y="13" width="8" height="8" rx="2.5" opacity="0.4" />
      <rect x="13" y="13" width="8" height="8" rx="2.5" opacity="0.4" />
    </>,
  ),
  chart: icon(
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" opacity="0.4" />
      <rect x="7" y="11" width="2.5" height="6" rx="1.25" />
      <rect x="11" y="7" width="2.5" height="10" rx="1.25" />
      <rect x="15" y="13" width="2.5" height="4" rx="1.25" />
    </>,
  ),
  rocket: icon(
    <>
      <path opacity="0.4" d="M12 2c3.5 2.2 5 6 4.6 10.5L12 17l-4.6-4.5C7 8 8.5 4.2 12 2Z" />
      <circle cx="12" cy="9" r="2" />
      <path d="M8 15l-3 3.5 1 1.5 3.5-2.5L8 15Zm8 0 3 3.5-1 1.5-3.5-2.5L16 15Z" />
    </>,
  ),
  users: icon(
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path opacity="0.4" d="M2.5 19c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6v1h-13v-1Z" />
      <circle cx="17" cy="9" r="2.5" opacity="0.4" />
    </>,
  ),
  gear: icon(
    <>
      <circle cx="12" cy="12" r="9" opacity="0.4" />
      <circle cx="12" cy="12" r="3.5" />
    </>,
  ),
};

const groups = [
  {
    label: "General",
    items: [
      { label: "Overview", href: "#overview", icon: icons.home },
      { label: "Analytics", href: "#analytics", icon: icons.chart },
    ],
  },
  {
    label: "Delivery",
    items: [
      { label: "Deployments", href: "#deployments", icon: icons.rocket, badge: 3 },
      {
        label: "Settings",
        href: "#settings",
        icon: icons.gear,
        children: [
          { label: "General", href: "#settings/general" },
          { label: "Domains", href: "#settings/domains" },
          { label: "Billing", href: "#settings/billing" },
        ],
      },
    ],
  },
  { label: "Team", items: [{ label: "Members", href: "#members", icon: icons.users, badge: 12 }] },
];

// The demo keeps navigation in state; in an app pass your router's Link as `linkAs`.
const Navigate = createContext<(href: string) => void>(() => {});

function DemoLink({ href, children, ...props }: { href: string; children?: ReactNode; className?: string }) {
  const go = useContext(Navigate);
  return (
    <a
      href={href}
      onClick={(e: MouseEvent) => {
        e.preventDefault();
        go(href);
      }}
      {...props}
    >
      {children}
    </a>
  );
}

export default function SidebarNavDemo() {
  const [current, setCurrent] = useState("#overview");
  const [query, setQuery] = useState("");

  return (
    <Navigate value={setCurrent}>
      <aside className="surface flex w-72 flex-col gap-4 rounded-card p-3">
        <div className="px-1 pt-1">
          <SidebarBrand icon={icons.rocket} title="Northwind" subtitle="Workspace" linkAs={DemoLink} href="#overview" />
        </div>
        <SidebarProfile name="Mina Okafor" role="Admin" />
        <SidebarSearch value={query} onChange={setQuery} placeholder="Search menu…" />
        <SidebarNav groups={groups} currentHref={current} linkAs={DemoLink} filter={query} />
      </aside>
    </Navigate>
  );
}
