import { animated } from "./animated.ts";
import { blocks } from "./blocks.ts";
import { charts } from "./charts.ts";
import { patterns } from "./patterns.ts";
import { components } from "./components.ts";
import { dashboards } from "./dashboards.ts";
import { screens } from "./screens.ts";
import { templates } from "./templates.ts";
import type { Category, CatalogEntry } from "./types.ts";

export type { Category, CatalogEntry, Engine, PropDoc } from "./types.ts";
export { supportItems } from "./support.ts";

/**
 * `listed: false` keeps a category's entries in the registry (templates may
 * depend on them) but out of the docs: no sidebar, search, home card or page.
 */
export const categories: Record<Category, { title: string; description: string; framed: boolean; listed: boolean }> = {
  components: {
    title: "Components",
    description: "Glass primitives: buttons, fields, overlays, menus and navigation. Accessible, keyboard-ready and themeable with the glass dials.",
    framed: false,
    listed: true,
  },
  animated: {
    title: "Animated",
    description: "Motion-led pieces: reveals, pointer effects, backdrops and counters. CSS where possible, springs where they earn their place.",
    framed: false,
    listed: true,
  },
  patterns: {
    title: "Patterns",
    description: "Application building blocks: data tables, filters, pickers, stat cards and empty, error and loading states.",
    framed: false,
    listed: true,
  },
  charts: {
    title: "Charts",
    description: "Hand-drawn SVG charts with no charting library: sparklines, areas, bars, donuts and meters that sit on glass.",
    framed: false,
    listed: true,
  },
  blocks: {
    title: "Blocks",
    description: "Full-width page sections, from heroes to footers. Drop one in and replace the copy.",
    framed: true,
    listed: true,
  },
  screens: {
    title: "Screens",
    description: "Content-only application pages that templates place inside an app shell.",
    framed: true,
    listed: false,
  },
  dashboards: {
    title: "Dashboards",
    description: "Complete application screens with navigation, charts and tables, built from the same parts.",
    framed: true,
    // Shown as Lumen's app screens instead of on their own.
    listed: false,
  },
  templates: {
    title: "Templates",
    description: "Whole pages assembled from blocks, ready to fork.",
    framed: true,
    listed: true,
  },
};

export const categoryOrder: Category[] = ["components", "animated", "patterns", "charts", "blocks", "screens", "dashboards", "templates"];

export const catalog: CatalogEntry[] = [
  ...components,
  ...animated,
  ...patterns,
  ...charts,
  ...blocks,
  ...screens,
  ...dashboards,
  ...templates,
];

/** Categories and entries the docs show. */
export const listedCategories = categoryOrder.filter((c) => categories[c].listed);

export const listedCatalog = catalog.filter((e) => categories[e.category].listed);

export function isCategory(value: string): value is Category {
  return value in categories;
}

export function getEntry(category: string, slug: string) {
  return catalog.find((e) => e.category === category && e.slug === slug);
}

export function entriesIn(category: Category) {
  return catalog.filter((e) => e.category === category);
}

export const entryHref = (e: Pick<CatalogEntry, "category" | "slug">) => `/${e.category}/${e.slug}`;
