import { basePath, routing } from "@/lib/routing";
import { glassControls, tideControls, type TunerControl } from "@/registry/kit/lib/theme-presets";

/**
 * Each collection is the same components and site, dressed in its own theme
 * (src/themes/<id>.css), served under its own path or subdomain
 * (src/lib/routing.ts). Everything that differs
 * between collections lives here; see AGENTS.md before adding anything else.
 */
export interface Collection {
  id: string;
  name: string;
  tagline: string;
  description: string;
  themeColor: string;
  /** Static attributes on <html>, besides data-theme. */
  htmlAttributes?: Record<string, string>;
  tuner: { title: string; controls: TunerControl[] };
  home: {
    badge: string;
    title: string;
    lede: string;
    playgroundTitle: string;
    playgroundLede: string;
    principlesTitle: string;
    /** Mid-page statement shown with ScrollTextReveal. */
    statement: string;
    sibling: string;
  };
}

export const collections = {
  glass: {
    id: "glass",
    name: "glass",
    tagline: "Liquid glass components for React",
    description:
      "An open collection of React components with a frosted finish and calm motion, by Serkan Baykal. CSS first, Motion where physics matter, and code you own.",
    themeColor: "#060f15",
    htmlAttributes: { "data-mode": "dark" },
    tuner: { title: "Glass", controls: glassControls },
    home: {
      badge: "pieces",
      title: "Liquid glass, poured into React.",
      lede: "Frosted surfaces, calm motion and a set of dials to tune them. CSS first, Motion where physics matter, and every line of it yours to copy.",
      playgroundTitle: "Six dials, every surface.",
      playgroundLede:
        "Each slider moves one CSS variable that all glass reads. The change applies across the whole site and stays when you browse the docs. Copy the result into your own stylesheet when it feels right.",
      principlesTitle: "Fast because it is quiet.",
      statement: "Every surface on this page is a file you can own in one command, tuned by six dials and fast on a three-year-old phone.",
      sibling: "Prefer something calmer for dashboards? The same components in clean green on cool slate, light and dark.",
    },
  },
  tide: {
    id: "tide",
    name: "tide",
    tagline: "Clean, warm components for React apps",
    description:
      "An open collection of React components for dashboards and admin tools, in fresh green on cool slate, by Serkan Baykal. Light and dark, five accents, and code you own.",
    themeColor: "#f8f9fb",
    htmlAttributes: { "data-mode": "light", "data-accent": "green", "data-radius": "balanced", "data-surface": "bordered" },
    tuner: { title: "Theme", controls: tideControls },
    home: {
      badge: "pieces",
      title: "Calm interfaces for busy products.",
      lede: "Crisp components for dashboards and admin tools: fresh green on cool slate, light and dark, five accents, and every line of it yours to copy.",
      playgroundTitle: "Four dials, every screen.",
      playgroundLede:
        "Switch mode, accent, corners and surfaces. The whole site follows and remembers your choice while you browse the docs. Copy the attributes into your own <html> when it feels right.",
      principlesTitle: "Quiet by design.",
      statement: "Clear numbers, calm screens and components your team can reshape in an afternoon, not a quarter.",
      sibling: "Want something more cinematic? The same components as liquid glass on deep teal.",
    },
  },
} satisfies Record<string, Collection>;

export type CollectionId = keyof typeof collections;

export const author = { name: "Serkan Baykal", role: "Software developer" };

export const collectionIds = Object.keys(collections) as CollectionId[];

export const defaultCollection: CollectionId = "glass";

export function isCollection(value: string | undefined): value is CollectionId {
  return value !== undefined && value in collections;
}

/**
 * The collection for a route's `collection` param. The param is typed as
 * possibly missing because the home page (src/app/main) is a second root
 * layout without it; inside [collection] it is always set.
 */
export function getCollection(id: string | undefined): Collection {
  return isCollection(id) ? collections[id] : collections[defaultCollection];
}

/**
 * The site's public origin. SITE_URL when set; on Vercel, the production
 * address it provides; otherwise the local dev server.
 */
export function homeOrigin() {
  const url =
    process.env.SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3001");
  return url.replace(/\/$/, "");
}

/**
 * Public origin of a collection: example.com/glass in path mode, or
 * COLLECTION_ORIGIN (a template such as `https://{id}.example.com`) on
 * subdomains.
 */
export function collectionOrigin(id: string) {
  if (routing === "path") return `${homeOrigin()}${basePath(id)}`;
  return (process.env.COLLECTION_ORIGIN ?? `https://{id}.${new URL(homeOrigin()).host}`).replace("{id}", id).replace(/\/$/, "");
}

/** How a collection's address reads in copy: its origin without the protocol. */
export const collectionAddress = (id: string) => collectionOrigin(id).replace(/^https?:\/\//, "");

/**
 * Base URL of a collection's registry JSON files: example.com/r/glass in
 * path mode, glass.example.com/r on subdomains. REGISTRY_BASE (a template
 * with {id}) overrides it; in development Node on Windows can't resolve
 * *.localhost, so the CLI needs a plain localhost URL.
 */
export function registryBase(id: string) {
  const fallback = routing === "path" ? `${homeOrigin()}/r/${id}` : `${collectionOrigin(id)}/r`;
  return (process.env.REGISTRY_BASE ?? fallback).replace("{id}", id).replace(/\/$/, "");
}
