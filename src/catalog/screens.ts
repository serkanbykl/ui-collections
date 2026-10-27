import { screensAccount } from "./screens-account.ts";
import { screensApps } from "./screens-apps.ts";
import { screensCommerce } from "./screens-commerce.ts";
import type { CatalogEntry } from "./types.ts";

/** App screens: content-only pages (no chrome) that templates place inside an app shell. */
export const screens: CatalogEntry[] = [...screensApps, ...screensCommerce, ...screensAccount];
