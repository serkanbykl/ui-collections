/**
 * How collections are addressed. Kept free of app imports: src/proxy.ts and
 * scripts/build-registry.mts mirror it.
 *
 * - `path` (default): one site, collections under a path. example.com is the
 *   pond home, example.com/glass and example.com/tide the collections. Needs
 *   no domain of your own, so it suits a free *.vercel.app address.
 * - `subdomain`: glass.example.com and tide.example.com, with example.com as
 *   the home. Needs a domain with wildcard DNS; COLLECTION_ORIGIN gives the
 *   template, such as `https://{id}.example.com`.
 *
 * NEXT_PUBLIC_ so client components (links, the search palette) agree with
 * the server.
 */
export const routing: "path" | "subdomain" = process.env.NEXT_PUBLIC_ROUTING === "subdomain" ? "subdomain" : "path";

/** Path prefix of a collection's pages: `/glass` in path mode, nothing on a subdomain. */
export const basePath = (collection: string) => (routing === "path" ? `/${collection}` : "");
