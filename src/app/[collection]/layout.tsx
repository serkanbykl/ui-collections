import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { collection } from "next/root-params";

import { ThemeRoot } from "@/components/site/theme-settings";
import { SiteBase } from "@/components/site/site-link";
import { author, collectionIds, collectionOrigin, getCollection, homeOrigin } from "@/collections";
import { basePath } from "@/lib/routing";
import { themeBootScript } from "@/lib/theme-storage";

import "../globals.css";

// Each theme picks its faces through --font-<theme>-* in src/themes/<id>.css.
const glassSans = Geist({ subsets: ["latin", "latin-ext"], variable: "--font-glass-sans" });
const tideSans = Geist({ subsets: ["latin", "latin-ext"], variable: "--font-tide-sans" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

const fonts = {
  glass: glassSans.variable,
  tide: tideSans.variable,
} as Record<string, string>;

export function generateStaticParams() {
  return collectionIds.map((id) => ({ collection: id }));
}

export async function generateMetadata(): Promise<Metadata> {
  const c = getCollection(await collection());
  return {
    metadataBase: new URL(collectionOrigin(c.id)),
    title: { default: `${c.name} — ${c.tagline}`, template: `%s · ${c.name}` },
    description: c.description,
    authors: [{ name: author.name, url: homeOrigin() }],
    creator: author.name,
    openGraph: {
      type: "website",
      siteName: c.name,
      title: `${c.name} — ${c.tagline}`,
      description: c.description,
      url: collectionOrigin(c.id),
    },
    twitter: { card: "summary_large_image", title: `${c.name} — ${c.tagline}`, description: c.description },
  };
}

export async function generateViewport(): Promise<Viewport> {
  const c = getCollection(await collection());
  return { themeColor: c.themeColor };
}

export default async function RootLayout({ children }: LayoutProps<"/[collection]">) {
  const c = getCollection(await collection());

  return (
    <html
      lang="en"
      data-theme={c.id}
      {...c.htmlAttributes}
      // Smooth in-page anchors, instant jumps on route changes.
      data-scroll-behavior="smooth"
      className={`${fonts[c.id]} ${mono.variable} antialiased`}
      // The boot script may set the visitor's dials before hydration.
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript(c.id) }} />
      </head>
      <body className="min-h-dvh bg-bg font-sans text-fg">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-control focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-accent-fg"
        >
          Skip to content
        </a>
        <SiteBase base={basePath(c.id)}>{children}</SiteBase>
        <ThemeRoot collection={c.id} />
      </body>
    </html>
  );
}
