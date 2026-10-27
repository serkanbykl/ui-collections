/**
 * Builds one shadcn registry per collection from src/catalog:
 * registry/<id>.json → `shadcn build` → public/r/<id>/*.json, served at
 * example.com/r/<id>/<slug>.json in path mode or <id>.example.com/r/<slug>.json
 * on subdomains (see src/lib/routing.ts and src/proxy.ts). Component sources
 * are the same for every collection; only the theme item differs.
 * Addresses mirror src/collections: SITE_URL (or Vercel's production URL),
 * NEXT_PUBLIC_ROUTING, and the optional COLLECTION_ORIGIN / REGISTRY_BASE
 * templates with {id}.
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";

import { catalog, supportItems } from "../src/catalog/index.ts";

// Mirror src/collections (that module imports React code Node can't load).
const collections = ["glass", "tide"];
const home = (
  process.env.SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3001")
).replace(/\/$/, "");
const subdomains = process.env.NEXT_PUBLIC_ROUTING === "subdomain";
const template = process.env.COLLECTION_ORIGIN ?? `https://{id}.${new URL(home).host}`;
const root = "src/registry/kit";

mkdirSync("registry", { recursive: true });

for (const id of collections) {
  const origin = subdomains ? template.replace("{id}", id).replace(/\/$/, "") : `${home}/${id}`;
  const registry = (process.env.REGISTRY_BASE ?? (subdomains ? `${origin}/r` : `${home}/r/${id}`)).replace("{id}", id).replace(/\/$/, "");
  const itemUrl = (slug: string) => `${registry}/${slug}.json`;
  // Every component styles with cn() and the theme contract.
  const base = ["utils", itemUrl("theme")];

  const items = [
    ...supportItems.map((item) => ({
      name: item.slug,
      type: item.type,
      title: item.title,
      description: item.description,
      dependencies: item.dependencies,
      registryDependencies: item.uses.map(itemUrl),
      files:
        item.slug === "theme"
          ? [
              { path: "src/themes/base.css", type: "registry:file", target: "styles/base.css" },
              { path: `src/themes/${id}.css`, type: "registry:file", target: `styles/${id}.css` },
            ]
          : item.files.map((f) => ({
              path: `${root}/${f.path}`,
              type: item.type,
              ...("target" in f ? { target: f.target } : {}),
            })),
    })),
    ...catalog.map((c) => {
      // Primitives install into components/ui; sections and screens are blocks.
      const ui = ["components", "animated", "patterns", "charts"].includes(c.category);
      return {
        name: c.slug,
        type: ui ? "registry:ui" : "registry:block",
        title: c.name,
        description: c.description,
        categories: [c.category],
        dependencies: c.dependencies ?? [],
        registryDependencies: [...base, ...(c.uses ?? []).map(itemUrl)],
        files: c.files.map((path) =>
          ui
            ? { path: `${root}/${path}`, type: "registry:ui" }
            : // Blocks, dashboards and templates import each other as
              // @/registry/kit/<dir>/<file>, which shadcn rewrites to
              // <components alias>/<dir>/<file>; land the file exactly there.
              { path: `${root}/${path}`, type: "registry:component", target: `@components/${path}` },
        ),
      };
    }),
  ];

  const file = `registry/${id}.json`;
  writeFileSync(
    file,
    `${JSON.stringify({ $schema: "https://ui.shadcn.com/schema/registry.json", name: id, homepage: origin, items }, null, 2)}\n`,
  );
  execFileSync("npx", ["shadcn", "build", file, "-o", `public/r/${id}`], { stdio: "inherit", shell: true });
  console.log(`${id}: ${items.length} items → public/r/${id} (${origin})`);
}
