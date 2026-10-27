/**
 * The catalog is the single source of truth: the docs site renders from it and
 * scripts/build-registry.mts turns it into registry.json. Node runs that
 * script directly, so catalog files may only import each other, with `.ts`
 * extensions. File paths are relative to src/registry/kit.
 */

export type Engine = "CSS" | "Motion";

export type Category = "components" | "animated" | "patterns" | "charts" | "blocks" | "screens" | "dashboards" | "templates";

export interface PropDoc {
  name: string;
  type: string;
  default?: string;
  description: string;
}

export interface CatalogEntry {
  slug: string;
  name: string;
  description: string;
  category: Category;
  engine: Engine;
  files: string[];
  /** npm packages beyond clsx and tailwind-merge. */
  dependencies?: string[];
  /** Other items in this registry, by slug. */
  uses?: string[];
  props?: PropDoc[];
  /** Height of the iframe preview for blocks, dashboards and templates. */
  previewHeight?: number;
}
