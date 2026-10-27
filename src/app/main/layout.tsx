import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { author, homeOrigin } from "@/collections";

import "../globals.css";
import "./pond.css";

// The look switch can dress the page as a collection, whose themes read these.
const glassSans = Geist({ subsets: ["latin", "latin-ext"], variable: "--font-glass-sans" });
const tideSans = Geist({ subsets: ["latin", "latin-ext"], variable: "--font-tide-sans" });
const mono = Geist_Mono({ subsets: ["latin", "latin-ext"], variable: "--font-geist-mono" });

const title = "Serkan Baykal — React component collections";
const description = "Two collections of React components by Serkan Baykal: glass, liquid glass on deep teal, and tide, clean admin screens in green on cool slate.";

export const metadata: Metadata = {
  metadataBase: new URL(homeOrigin()),
  title,
  description,
  authors: [{ name: author.name, url: homeOrigin() }],
  openGraph: { type: "website", siteName: author.name, title, description, url: homeOrigin() },
  twitter: { card: "summary", title, description },
};

export const viewport: Viewport = {
  themeColor: "#0e1b22",
};

// Dark by default (data-mode on <html>); applies the visitor's stored
// light/dark and look choices before first paint.
const modeBoot = `try{var h=document.documentElement,m=localStorage.getItem("home:mode"),l=localStorage.getItem("home:look");if(m==="light"||m==="dark")h.dataset.mode=m;if(l==="glass"||l==="tide"){h.dataset.theme=l;if(!h.dataset.mode)h.dataset.mode=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}}catch(e){}`;

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="dark" className={`home ${glassSans.variable} ${tideSans.variable} ${mono.variable} antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: modeBoot }} />
      </head>
      <body className="min-h-dvh overflow-x-clip">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-full focus:bg-(--ink) focus:px-4 focus:py-2 focus:text-sm focus:text-(--water)"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
