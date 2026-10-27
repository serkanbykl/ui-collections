import { NextResponse, type NextRequest } from "next/server";

// Kept literal: proxy must not import app modules. Mirror src/collections and
// src/lib/routing.
const collections = ["glass", "tide"];
const routing = process.env.NEXT_PUBLIC_ROUTING === "subdomain" ? "subdomain" : "path";

/**
 * Picks what a request shows.
 *
 * Path mode (the default, no domain needed): /glass/… and /tide/… are the
 * collections as routed, /r/<id>/<slug>.json their registry files, / the
 * hamsi pond home in src/app/main, and anything else that home's 404.
 *
 * Subdomain mode: tide.example.com/components is rendered by
 * /tide/components and /r/button.json by public/r/tide/button.json; the bare
 * domain is the pond home, and every other path there its 404.
 */
export function proxy(request: NextRequest) {
  const url = request.nextUrl;
  const [first = "", second = ""] = url.pathname.split("/").slice(1);
  // Registry files addressed by collection (example.com/r/tide/button.json).
  const registryFile = first === "r" && collections.includes(second);

  if (routing === "path") {
    if (collections.includes(first) || registryFile) return NextResponse.next();
    return toHome(url);
  }

  const sub = (request.headers.get("host") ?? "").split(".")[0] ?? "";
  if (!collections.includes(sub)) return registryFile ? NextResponse.next() : toHome(url);
  // Already prefixed, such as the collection's own internal requests.
  if (first === sub) return NextResponse.next();
  url.pathname = url.pathname.startsWith("/r/")
    ? `/r/${sub}${url.pathname.slice(2)}`
    : `/${sub}${url.pathname === "/" ? "" : url.pathname}`;
  return NextResponse.rewrite(url);
}

/** The pond home at /, and its 404 for any other path. */
function toHome(url: NextRequest["nextUrl"]) {
  url.pathname = `/main${url.pathname === "/" ? "" : url.pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // Everything except Next internals, shared media and root files with an extension (favicon.ico, robots.txt).
  matcher: ["/((?!_next/|media/|[^/]+\\.[a-z0-9]+$).*)"],
};
