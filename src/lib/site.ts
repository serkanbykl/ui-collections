import { registryBase } from "@/collections";

/** The shadcn command that installs `slug` from a collection's registry. */
export const installCommand = (collection: string, slug: string) =>
  `npx shadcn@latest add ${registryBase(collection)}/${slug}.json`;

/** components.json entry that lets `npx shadcn add @<collection>/<slug>` resolve against a collection's registry. */
export const registryConfig = (collection: string) =>
  JSON.stringify({ registries: { [`@${collection}`]: `${registryBase(collection)}/{name}.json` } }, null, 2);

/** The lines a project's global stylesheet needs, right after Tailwind. */
export const themeImports = (collection: string) =>
  `@import "tailwindcss";\n@import "../styles/base.css";\n@import "../styles/${collection}.css";`;

/** Theme attribute and font setup on <html>, per collection. */
export const fontSetup: Record<string, string> = {
  glass: `import { Geist } from "next/font/google";

const sans = Geist({ subsets: ["latin", "latin-ext"], variable: "--font-glass-sans" });

// <html data-theme="glass" className={sans.variable}>`,
  tide: `import { Geist } from "next/font/google";

const sans = Geist({ subsets: ["latin", "latin-ext"], variable: "--font-tide-sans" });

// <html data-theme="tide" data-mode="light" className={sans.variable}>`,
};

/**
 * Media the site ships with. Everything here is our own work, released under
 * CC0: no stock footage or third-party images. The loop is an abstract
 * gradient rendered with ffmpeg (1280×720, 14 s, ~170 KB). The gallery images
 * (public/media/gallery/*.webp, 1600×1000, 15–42 KB each) are landscapes we
 * drew as SVG shapes and gradients, rendered in Edge and encoded with ffmpeg;
 * the Image Gallery block and the Image Carousel demo use them.
 */
export const media = {
  aurora: { src: "/media/aurora-loop.mp4", poster: "/media/aurora-loop.jpg" },
  gallery: ["dawn-hills", "lake-dusk", "city-night", "desert-dunes", "northern-lights", "golden-coast"].map((name) => `/media/gallery/${name}.webp`),
};
