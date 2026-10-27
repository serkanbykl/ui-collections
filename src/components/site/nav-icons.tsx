import type { ReactNode } from "react";

import type { Category } from "@/catalog";

// Two-tone icons for the docs sidebar: a faint fill under a solid shape.
const icon = (children: ReactNode) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    {children}
  </svg>
);

export const categoryIcons: Record<Category, ReactNode> = {
  components: icon(
    <>
      <rect x="3" y="3" width="8" height="8" rx="2.5" />
      <rect x="13" y="3" width="8" height="8" rx="2.5" opacity="0.4" />
      <rect x="3" y="13" width="8" height="8" rx="2.5" opacity="0.4" />
      <rect x="13" y="13" width="8" height="8" rx="4" />
    </>,
  ),
  animated: icon(
    <>
      <circle cx="9" cy="12" r="7" opacity="0.4" />
      <circle cx="15" cy="12" r="5" />
    </>,
  ),
  patterns: icon(
    <>
      <rect x="3" y="4" width="18" height="16" rx="4" opacity="0.4" />
      <rect x="6" y="8" width="12" height="2" rx="1" />
      <rect x="6" y="12" width="8" height="2" rx="1" />
      <rect x="6" y="16" width="10" height="2" rx="1" opacity="0.7" />
    </>,
  ),
  charts: icon(
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" opacity="0.4" />
      <rect x="7" y="11" width="2.5" height="6" rx="1.25" />
      <rect x="11" y="7" width="2.5" height="10" rx="1.25" />
      <rect x="15" y="13" width="2.5" height="4" rx="1.25" />
    </>,
  ),
  blocks: icon(
    <>
      <rect x="3" y="3" width="18" height="7" rx="2.5" />
      <rect x="3" y="12" width="18" height="9" rx="2.5" opacity="0.4" />
    </>,
  ),
  screens: icon(
    <>
      <rect x="3" y="4" width="18" height="16" rx="3" opacity="0.4" />
      <rect x="6" y="7" width="5" height="10" rx="1.5" />
      <rect x="13" y="7" width="5" height="4" rx="1.5" />
    </>,
  ),
  dashboards: icon(
    <>
      <rect x="3" y="3" width="6" height="18" rx="2.5" />
      <rect x="11" y="3" width="10" height="8" rx="2.5" opacity="0.4" />
      <rect x="11" y="13" width="10" height="8" rx="2.5" opacity="0.4" />
    </>,
  ),
  templates: icon(
    <>
      <path opacity="0.4" d="M6 2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z" />
      <path d="M15 2v4a1 1 0 0 0 1 1h4L15 2Z" />
      <rect x="7" y="12" width="10" height="2" rx="1" />
      <rect x="7" y="16" width="6" height="2" rx="1" />
    </>,
  ),
};

export const installIcon = icon(
  <>
    <rect x="3" y="3" width="18" height="18" rx="5" opacity="0.4" />
    <path d="M11 7h2v6.2l2.3-2.3 1.4 1.4L12 17l-4.7-4.7 1.4-1.4 2.3 2.3V7Z" />
  </>,
);

export const sparkIcon = icon(<path d="M12 4c.6 4.6 2.4 6.9 7 8-4.6 1.1-6.4 3.4-7 8-.6-4.6-2.4-6.9-7-8 4.6-1.1 6.4-3.4 7-8Z" />);

export const slidersIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden>
    <path d="M4 7h10M18 7h2M4 17h4M12 17h8" />
    <circle cx="16" cy="7" r="2" />
    <circle cx="10" cy="17" r="2" />
  </svg>
);
