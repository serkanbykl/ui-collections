import type { Category } from "@/catalog";

import { animatedDemos } from "./animated";
import { blockDemos } from "./blocks";
import { chartDemos } from "./charts";
import { patternDemos } from "./patterns";
import { componentDemos } from "./components";
import { dashboardDemos } from "./dashboards";
import { screenDemos } from "./screens";
import { templateDemos } from "./templates";
import type { DemoMap } from "./types";

export const demos: Record<Category, DemoMap> = {
  components: componentDemos,
  animated: animatedDemos,
  patterns: patternDemos,
  charts: chartDemos,
  blocks: blockDemos,
  screens: screenDemos,
  dashboards: dashboardDemos,
  templates: templateDemos,
};

export const demoFile = (category: Category, slug: string) => `demos/${category}/${slug}.tsx`;
