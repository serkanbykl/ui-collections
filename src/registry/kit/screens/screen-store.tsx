"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";

import { cn } from "@/registry/kit/lib/utils";
import { Badge } from "@/registry/kit/ui/badge";
import { Button, buttonVariants } from "@/registry/kit/ui/button";
import { SearchInput } from "@/registry/kit/ui/search-input";
import { ChipGroup } from "@/registry/kit/ui/chip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/registry/kit/ui/select";
import { Skeleton } from "@/registry/kit/ui/skeleton";
import { EmptyState, ErrorState } from "@/registry/kit/ui/states";

/* ------------------------------------------------------------------ data */

/** The outline drawn on a product's placeholder tile. */
export type StoreArtKind = "shirt" | "tee" | "jacket" | "trousers" | "sock" | "tote" | "beanie" | "cap" | "shoe" | "wallet" | "scarf" | "mug";

/** Theme tone of a product's tile. */
export type StoreTone = "accent" | "info" | "warning" | "success";

export interface StoreReview {
  id: string;
  author: string;
  /** 1 to 5. */
  rating: number;
  title: string;
  body: string;
  date: string;
  /** Size and colour the reviewer bought, e.g. "Bone · M". */
  bought?: string;
}

export type StoreAudience = "men" | "women";

export interface StoreProduct {
  slug: string;
  name: string;
  category: string;
  price: number;
  /** Original price when the product is on sale. */
  compareAt?: number;
  /** Average rating out of 5. */
  rating: number;
  reviewCount: number;
  /** Units available across variants; 0 means sold out. */
  stock: number;
  /** Shown as a badge on the card, e.g. "New". */
  label?: string;
  /** Lower ranks come first in "Featured". */
  rank: number;
  kind: StoreArtKind;
  tone: StoreTone;
  colors: string[];
  /** Empty for one-size products. */
  sizes: string[];
  /** Sizes with no stock left. */
  soldOutSizes?: string[];
  /** One line under the name on the product page. */
  summary: string;
  description: string;
  details: string[];
  care: string;
  reviews: StoreReview[];
  /** Who it is cut for; both when left out. */
  audience?: StoreAudience[];
  /** Part of the New in collection. */
  isNew?: boolean;
}

export interface StoreCartLine {
  /** `${slug}:${color}:${size}` — one line per variant. */
  id: string;
  slug: string;
  name: string;
  price: number;
  quantity: number;
  color?: string;
  size?: string;
  kind: StoreArtKind;
  tone: StoreTone;
}

export interface StorePromo {
  code: string;
  /** Shown in the summary, e.g. "15% off your order". */
  label: string;
  percentOff?: number;
  freeShipping?: boolean;
}

export const STORE_FREE_SHIPPING_FROM = 150;
export const STORE_STANDARD_SHIPPING = 8.5;
export const STORE_MAX_QUANTITY = 10;

export const sampleStorePromos: StorePromo[] = [
  { code: "AUTUMN15", label: "15% off your order", percentOff: 15 },
  { code: "FREESHIP", label: "Free standard shipping", freeShipping: true },
];

const apparelSizes = ["XS", "S", "M", "L", "XL"];

const catalogue: StoreProduct[] = [
  {
    slug: "linen-overshirt",
    name: "Linen overshirt",
    category: "Apparel",
    price: 64,
    rating: 4.7,
    reviewCount: 128,
    stock: 143,
    label: "Bestseller",
    rank: 1,
    kind: "shirt",
    tone: "accent",
    colors: ["Bone", "Slate", "Olive"],
    sizes: apparelSizes,
    soldOutSizes: ["XS"],
    summary: "Garment-dyed European linen with corozo buttons.",
    description:
      "A boxy, dropped-shoulder overshirt in 210 g linen from a family mill in Guimarães. Cut 4 cm longer than our standard shirt so it layers over a tee, and garment-dyed so it arrives already soft.",
    details: ["100% European linen, 210 g/m²", "Corozo nut buttons", "Two chest pockets with flaps", "Relaxed fit — size down for a closer cut"],
    care: "Machine wash at 30 °C, hang to dry. Iron while damp if you want it crisp; most people don't.",
    reviews: [
      { id: "r1", author: "Mira Castellanos", rating: 5, title: "Wore it every day in September", body: "Heavier than I expected in a good way. It doesn't go see-through in sun and the colour hasn't faded after eight washes.", date: "Oct 19, 2026", bought: "Olive · M" },
      { id: "r2", author: "Jonah Whitfield", rating: 4, title: "Runs a little big", body: "I'm usually an L and the M fits like a relaxed L. Sleeves are long enough to roll twice.", date: "Oct 2, 2026", bought: "Slate · M" },
      { id: "r3", author: "Priya Raman", rating: 5, title: "Better than the one I paid twice for", body: "Buttons feel solid and the pockets sit flat. Ordered the bone one as well.", date: "Sep 14, 2026", bought: "Bone · S" },
    ],
  },
  {
    slug: "merino-crew-sock",
    name: "Merino crew sock",
    category: "Accessories",
    price: 14.5,
    rating: 4.8,
    reviewCount: 412,
    stock: 1183,
    rank: 4,
    kind: "sock",
    tone: "info",
    colors: ["Charcoal", "Oat", "Rust"],
    sizes: ["36–39", "40–43", "44–47"],
    summary: "Cushioned sole, reinforced heel, no slipping.",
    description: "Mid-weight 18.5-micron merino with a terry-loop sole and a ribbed cuff that stays up all day. Knitted in Biella and sold in single pairs, because socks wear out at different speeds.",
    details: ["78% merino wool, 20% nylon, 2% elastane", "Terry-loop cushioned sole", "Reinforced heel and toe", "Sold as one pair"],
    care: "Machine wash at 30 °C inside out. Skip the dryer.",
    reviews: [
      { id: "r1", author: "Tomás Herrera", rating: 5, title: "Survived a 9-day hike", body: "Two pairs, washed in a sink every other night. No holes and no smell.", date: "Oct 11, 2026", bought: "Charcoal · 44–47" },
      { id: "r2", author: "Lena Brandt", rating: 5, title: "Finally socks that stay up", body: "The cuff doesn't dig in and they don't slide into my boots.", date: "Sep 28, 2026", bought: "Oat · 36–39" },
    ],
  },
  {
    slug: "canvas-tote-olive",
    name: "Canvas tote, olive",
    category: "Accessories",
    price: 32,
    rating: 4.5,
    reviewCount: 61,
    stock: 0,
    rank: 9,
    kind: "tote",
    tone: "success",
    colors: ["Olive"],
    sizes: [],
    summary: "16 oz waxed canvas with an inside zip pocket.",
    description: "A flat-bottomed tote in 16 oz waxed canvas that fits a 15-inch laptop and a week of groceries. The next batch is being sewn in Porto and lands in mid-November.",
    details: ["16 oz waxed cotton canvas", "Inside zip pocket", "Holds a 15-inch laptop", "38 × 42 × 12 cm"],
    care: "Spot clean with cold water. Re-wax once a year to keep it water resistant.",
    reviews: [{ id: "r1", author: "Grace Okafor", rating: 4, title: "Sturdy, slightly stiff at first", body: "Took two weeks to soften. Now it's the only bag I use.", date: "Aug 30, 2026" }],
  },
  {
    slug: "waxed-field-jacket",
    name: "Waxed field jacket",
    category: "Apparel",
    price: 189,
    rating: 4.6,
    reviewCount: 37,
    stock: 7,
    label: "Low stock",
    rank: 2,
    kind: "jacket",
    tone: "warning",
    colors: ["Tobacco", "Navy"],
    sizes: ["S", "M", "L", "XL"],
    soldOutSizes: ["S"],
    summary: "Waxed Scottish cotton with a corduroy collar.",
    description: "A four-pocket field jacket in British Millerain waxed cotton, lined with brushed check flannel. Waxed fabric creases and darkens where you move, so it ages to fit you.",
    details: ["Waxed cotton from British Millerain", "Brushed cotton flannel lining", "Corduroy collar, two-way brass zip", "Four bellows pockets"],
    care: "Wipe with a damp cloth. Never machine wash. We re-wax it for free once a year.",
    reviews: [
      { id: "r1", author: "Callum Reid", rating: 5, title: "Proper rain jacket", body: "Stood in Glasgow drizzle for an hour at a bus stop and stayed dry. Smells faintly of wax for the first week.", date: "Oct 21, 2026", bought: "Tobacco · L" },
      { id: "r2", author: "Ines Duarte", rating: 4, title: "Beautiful, but size up for jumpers", body: "Fits perfectly over a shirt. Over a thick knit it gets tight in the shoulders.", date: "Oct 6, 2026", bought: "Navy · M" },
    ],
  },
  {
    slug: "cotton-rib-beanie",
    name: "Cotton rib beanie",
    category: "Accessories",
    price: 22,
    rating: 4.4,
    reviewCount: 88,
    stock: 418,
    rank: 7,
    kind: "beanie",
    tone: "warning",
    colors: ["Rust", "Charcoal", "Oat"],
    sizes: [],
    summary: "Organic cotton rib with a deep turn-up.",
    description: "A soft, close-fitting beanie in organic cotton rib — warm enough for October, not itchy like wool. The deep turn-up means it fits small and large heads.",
    details: ["100% organic cotton", "2×2 rib knit", "One size, stretches to 61 cm", "Knitted in Portugal"],
    care: "Hand wash cold and dry flat.",
    reviews: [{ id: "r1", author: "Sana Mirza", rating: 4, title: "Good colour", body: "The rust is darker than the photos, more brick. I like it more.", date: "Oct 15, 2026", bought: "Rust" }],
  },
  {
    slug: "selvedge-denim-straight",
    name: "Selvedge denim, straight",
    category: "Apparel",
    price: 118,
    rating: 4.6,
    reviewCount: 54,
    stock: 96,
    rank: 5,
    kind: "trousers",
    tone: "info",
    colors: ["Indigo", "Rinse"],
    sizes: ["28", "30", "32", "34", "36"],
    soldOutSizes: ["36"],
    summary: "13.5 oz Japanese selvedge, straight from hip to hem.",
    description: "Unsanforized 13.5 oz denim from Okayama, cut straight with a mid rise. Expect about 3% shrink on the first wash; the size guide accounts for it.",
    details: ["13.5 oz Japanese selvedge denim", "Button fly, copper rivets", "Mid rise, straight leg", "34-inch inseam, free hemming"],
    care: "Wash rarely, inside out and cold. Hang to dry.",
    reviews: [{ id: "r1", author: "Aiko Tanaka", rating: 5, title: "Fades beautifully", body: "Six months in and the honeycombs behind the knee are showing. Exactly as described.", date: "Sep 3, 2026", bought: "Indigo · 30" }],
  },
  {
    slug: "organic-tee-bone",
    name: "Organic tee, bone",
    category: "Apparel",
    price: 29,
    compareAt: 36,
    rating: 4.3,
    reviewCount: 203,
    stock: 742,
    label: "Sale",
    rank: 3,
    kind: "tee",
    tone: "accent",
    colors: ["Bone", "Black", "Sage"],
    sizes: apparelSizes,
    summary: "Heavyweight organic cotton that holds its shape.",
    description: "A 220 g organic cotton tee with a tight collar that doesn't ripple after washing. Slightly boxy body, sleeves that hit mid-bicep.",
    details: ["100% organic cotton, 220 g/m²", "Pre-shrunk", "Taped neck seam", "Made in Portugal"],
    care: "Machine wash at 30 °C. Tumble dry low.",
    reviews: [
      { id: "r1", author: "Daniel Kowalski", rating: 4, title: "Great weight", body: "Thicker than most tees at this price. Bone is slightly see-through under bright light.", date: "Oct 9, 2026", bought: "Bone · L" },
      { id: "r2", author: "Hana Sato", rating: 4, title: "Collar stays flat", body: "After ten washes the neck is still tight. Bought three more on sale.", date: "Sep 22, 2026", bought: "Sage · S" },
    ],
  },
  {
    slug: "leather-card-holder",
    name: "Leather card holder",
    category: "Accessories",
    price: 41,
    rating: 4.9,
    reviewCount: 76,
    stock: 155,
    rank: 8,
    kind: "wallet",
    tone: "warning",
    colors: ["Tan", "Black"],
    sizes: [],
    summary: "Vegetable-tanned leather, four card slots.",
    description: "Cut from a single piece of vegetable-tanned Italian leather and saddle-stitched by hand. Holds four cards and folded notes without bulging.",
    details: ["Vegetable-tanned leather from Tuscany", "Four card slots and a centre pocket", "Hand saddle-stitched", "10 × 7.5 cm"],
    care: "Rub in a little leather balm twice a year.",
    reviews: [{ id: "r1", author: "Oliver Brennan", rating: 5, title: "Ages like a baseball glove", body: "Two months and the tan has gone a warm honey colour. Stitching is perfect.", date: "Oct 1, 2026", bought: "Tan" }],
  },
  {
    slug: "trail-runner-slate",
    name: "Trail runner, slate",
    category: "Footwear",
    price: 136,
    rating: 4.2,
    reviewCount: 19,
    stock: 12,
    label: "New",
    rank: 6,
    kind: "shoe",
    tone: "info",
    colors: ["Slate"],
    sizes: ["40", "41", "42", "43", "44", "45"],
    soldOutSizes: ["42"],
    summary: "A grippy trail shoe you can wear to the office.",
    description: "A low-profile trail runner with a 4 mm lug outsole and a recycled mesh upper. Firm enough for gravel, quiet enough for pavement.",
    details: ["Recycled polyester mesh upper", "4 mm lug rubber outsole", "6 mm drop", "Weighs 290 g in size 42"],
    care: "Brush off mud once dry. Remove the insole to air out.",
    reviews: [{ id: "r1", author: "Elif Demir", rating: 4, title: "Comfortable from day one", body: "No break-in needed. The toe box is narrower than my old pair.", date: "Oct 18, 2026", bought: "Slate · 39" }],
  },
  {
    slug: "wool-scarf-rust",
    name: "Wool scarf, rust",
    category: "Accessories",
    price: 54,
    compareAt: 68,
    rating: 4.7,
    reviewCount: 42,
    stock: 281,
    label: "Sale",
    rank: 10,
    kind: "scarf",
    tone: "warning",
    colors: ["Rust"],
    sizes: [],
    summary: "Lambswool, woven in the Scottish Borders.",
    description: "A generous 190 × 35 cm scarf in brushed lambswool, woven and finished in Hawick. Warm without bulk, with short hand-twisted fringes.",
    details: ["100% lambswool", "190 × 35 cm", "Hand-twisted fringe", "Woven in Hawick, Scotland"],
    care: "Dry clean, or hand wash cold with wool detergent.",
    reviews: [],
  },
  {
    slug: "recycled-rain-shell",
    name: "Recycled rain shell",
    category: "Apparel",
    price: 149,
    rating: 0,
    reviewCount: 0,
    stock: 64,
    label: "New",
    rank: 11,
    kind: "jacket",
    tone: "success",
    colors: ["Moss", "Black"],
    sizes: ["S", "M", "L", "XL"],
    summary: "Three-layer shell from recycled fishing nets.",
    description: "A packable three-layer shell with taped seams and a 20,000 mm waterproof rating. The face fabric is made from recycled nylon fishing nets.",
    details: ["3-layer recycled nylon, PFC-free coating", "20,000 mm waterproof, fully taped", "Packs into its chest pocket", "Weighs 340 g"],
    care: "Machine wash at 30 °C with tech wash. Tumble dry low to refresh the coating.",
    reviews: [],
  },
  {
    slug: "ceramic-mug-340",
    name: "Ceramic mug, 340 ml",
    category: "Home",
    price: 18,
    rating: 4.8,
    reviewCount: 131,
    stock: 503,
    rank: 12,
    kind: "mug",
    tone: "success",
    colors: ["Speckled oat", "Charcoal"],
    sizes: [],
    summary: "Stoneware thrown in Alcobaça, glazed by hand.",
    description: "A wide, low mug in speckled stoneware, glazed by hand so no two are quite the same. Holds a flat white with room for the foam.",
    details: ["Stoneware, 340 ml", "Dishwasher and microwave safe", "Hand-glazed in Alcobaça, Portugal"],
    care: "Dishwasher safe. Avoid sudden temperature changes.",
    reviews: [{ id: "r1", author: "Ruth Abebe", rating: 5, title: "The right size", body: "Fits my hand and my espresso machine. Bought four.", date: "Sep 12, 2026", bought: "Speckled oat" }],
  },
  {
    slug: "hemp-cap-natural",
    name: "Hemp cap, natural",
    category: "Accessories",
    price: 26,
    rating: 4.1,
    reviewCount: 23,
    stock: 0,
    rank: 13,
    kind: "cap",
    tone: "accent",
    colors: ["Natural"],
    sizes: [],
    summary: "Unstructured six-panel cap in hemp twill.",
    description: "A soft, unstructured cap in hemp and organic cotton twill with a brass slider. Restocking in early December.",
    details: ["55% hemp, 45% organic cotton", "Brass slider strap", "Unstructured six-panel"],
    care: "Hand wash cold and reshape while damp.",
    reviews: [{ id: "r1", author: "Marco Bellini", rating: 4, title: "Light and breathable", body: "Perfect for summer. Brim is short, which I like.", date: "Jul 27, 2026" }],
  },
];

const cutFor: Record<string, StoreAudience[]> = {
  "selvedge-denim-straight": ["men"],
  "hemp-cap-natural": ["men"],
  "wool-scarf-rust": ["women"],
  "organic-tee-bone": ["women", "men"],
};
const newIn = ["recycled-rain-shell", "trail-runner-slate", "waxed-field-jacket", "cotton-rib-beanie"];

export const sampleStoreProducts: StoreProduct[] = catalogue.map((p) => ({
  ...p,
  audience: p.audience ?? cutFor[p.slug] ?? ["men", "women"],
  isNew: p.isNew ?? newIn.includes(p.slug),
}));

/* --------------------------------------------------------------- helpers */

export const formatUsd = (value: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

export const storeLineId = (slug: string, color?: string, size?: string) => `${slug}:${color ?? ""}:${size ?? ""}`;

/** A cart line for a product variant. */
export function storeLine(product: StoreProduct, options: { color?: string; size?: string; quantity?: number } = {}): StoreCartLine {
  const color = options.color ?? product.colors[0];
  const size = options.size ?? product.sizes.find((s) => !product.soldOutSizes?.includes(s));
  return {
    id: storeLineId(product.slug, color, size),
    slug: product.slug,
    name: product.name,
    price: product.price,
    quantity: options.quantity ?? 1,
    color,
    size,
    kind: product.kind,
    tone: product.tone,
  };
}

/** Adds a line, merging with the same variant and capping the quantity. */
export function addStoreLine(lines: StoreCartLine[], line: StoreCartLine): StoreCartLine[] {
  const existing = lines.find((l) => l.id === line.id);
  if (!existing) return [...lines, { ...line, quantity: Math.min(line.quantity, STORE_MAX_QUANTITY) }];
  return lines.map((l) => (l.id === line.id ? { ...l, quantity: Math.min(l.quantity + line.quantity, STORE_MAX_QUANTITY) } : l));
}

export const storeLineOptions = (line: Pick<StoreCartLine, "color" | "size">) => [line.color, line.size].filter(Boolean).join(" · ");

export const storeItemCount = (lines: StoreCartLine[]) => lines.reduce((sum, l) => sum + l.quantity, 0);

export interface StoreTotals {
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  /** How much more to spend for free standard shipping; 0 once reached. */
  toFreeShipping: number;
}

/**
 * Order totals. `shippingRate` is the chosen method's price; standard shipping
 * is free from $150 after discounts or with a free-shipping code.
 */
export function storeTotals(lines: StoreCartLine[], promo?: StorePromo | null, shippingRate = STORE_STANDARD_SHIPPING, standard = true): StoreTotals {
  const subtotal = lines.reduce((sum, l) => sum + l.price * l.quantity, 0);
  const discount = promo?.percentOff ? Math.round(subtotal * promo.percentOff) / 100 : 0;
  const afterDiscount = subtotal - discount;
  const toFreeShipping = Math.max(STORE_FREE_SHIPPING_FROM - afterDiscount, 0);
  const freeStandard = toFreeShipping === 0 || !!promo?.freeShipping;
  const shipping = lines.length === 0 ? 0 : standard && freeStandard ? 0 : shippingRate;
  return { subtotal, discount, shipping, total: afterDiscount + shipping, toFreeShipping };
}

/* ------------------------------------------------------------ visuals */

const toneClass: Record<StoreTone, string> = {
  accent: "from-accent/22 to-accent/6 text-accent",
  info: "from-info/22 to-info/6 text-info",
  warning: "from-warning/22 to-warning/6 text-warning",
  success: "from-success/22 to-success/6 text-success",
};

const art: Record<StoreArtKind, ReactNode> = {
  shirt: (
    <>
      <path opacity="0.35" d="M22 8h20l14 10-6 10-6-4v32H20V24l-6 4-6-10Z" />
      <path d="M26 8h12c0 3.3-2.7 6-6 6s-6-2.7-6-6ZM31 14h2v42h-2zM23 26h7v5h-7z" />
    </>
  ),
  tee: (
    <>
      <path opacity="0.35" d="M23 11h18l13 8-5 9-6-3v29H21V25l-6 3-5-9Z" />
      <path d="M26 11h12c0 3-2.7 5.5-6 5.5S26 14 26 11Z" />
    </>
  ),
  jacket: (
    <>
      <path opacity="0.35" d="M21 8h22l13 11v22l-7 1V25l-3-2v35H18V23l-3 2v17l-7-1V19Z" />
      <path d="M25 6h14l-7 8ZM31 14h2v44h-2zM21 38h7v7h-7zM36 38h7v7h-7z" />
    </>
  ),
  trousers: (
    <>
      <path opacity="0.35" d="M19 8h26l4 48H37l-5-32-5 32H15Z" />
      <path d="M19 8h26v5H19zM31 13h2v8h-2z" />
    </>
  ),
  sock: (
    <>
      <path opacity="0.35" d="M24 12h16v22l11 11a7 7 0 0 1-10 10L24 38Z" />
      <path d="M24 6h16v8H24z" />
    </>
  ),
  tote: (
    <>
      <path opacity="0.35" d="M13 24h38l-4 32H17Z" />
      <path d="M22 24v-6a10 10 0 0 1 20 0v6h-4v-6a6 6 0 0 0-12 0v6Z" />
    </>
  ),
  beanie: (
    <>
      <path opacity="0.35" d="M14 40a18 18 0 0 1 36 0Z" />
      <path d="M12 39h40v10H12zM28 18a4 4 0 1 1 8 0 4 4 0 0 1-8 0Z" />
    </>
  ),
  cap: (
    <>
      <path opacity="0.35" d="M12 40a18 16 0 0 1 36 0Z" />
      <path d="M28 40h26a4 4 0 0 1 0 6H28ZM28 22a2 2 0 1 1 4 0 2 2 0 0 1-4 0Z" />
    </>
  ),
  shoe: (
    <>
      <path opacity="0.35" d="M8 42c0-7 3-16 9-16 5 0 7 5 13 7l15 4c8 2 11 5 11 9v2H8Z" />
      <path d="M8 46h48v5a3 3 0 0 1-3 3H11a3 3 0 0 1-3-3ZM26 33l3-4M31 35l3-4" />
    </>
  ),
  wallet: (
    <>
      <path opacity="0.35" d="M13 18h38a4 4 0 0 1 4 4v22a4 4 0 0 1-4 4H13a4 4 0 0 1-4-4V22a4 4 0 0 1 4-4Z" />
      <path d="M9 26h46v3H9zM15 36h14v3H15z" />
    </>
  ),
  scarf: (
    <>
      <path opacity="0.35" d="M18 8h28v14H32v26H18Z" />
      <path d="M18 48h14l-2 6h-2l-1-4-1 4h-2l-1-4-1 4h-2ZM32 22h14v4H32z" />
    </>
  ),
  mug: (
    <>
      <path opacity="0.35" d="M12 18h32v28a8 8 0 0 1-8 8H20a8 8 0 0 1-8-8Z" />
      <path d="M44 24h4a7 7 0 0 1 0 14h-4v-4h4a3 3 0 0 0 0-6h-4ZM12 18h32v4H12z" />
    </>
  ),
};

/**
 * Fabric colours of the sample catalogue, for drawing a variant in its own
 * colour. These are product data, like a photo, so they stay the same in every theme.
 */
export const sampleStoreSwatches: Record<string, string> = {
  Bone: "oklch(0.93 0.02 85)",
  Slate: "oklch(0.55 0.03 250)",
  Olive: "oklch(0.55 0.08 120)",
  Charcoal: "oklch(0.36 0.01 260)",
  Oat: "oklch(0.85 0.04 80)",
  Rust: "oklch(0.56 0.14 45)",
  Tobacco: "oklch(0.5 0.08 60)",
  Navy: "oklch(0.36 0.08 260)",
  Indigo: "oklch(0.4 0.1 270)",
  Rinse: "oklch(0.3 0.06 265)",
  Black: "oklch(0.24 0.005 260)",
  Sage: "oklch(0.74 0.05 145)",
  Tan: "oklch(0.7 0.08 65)",
  Moss: "oklch(0.5 0.07 130)",
  "Speckled oat": "oklch(0.82 0.035 80)",
  Natural: "oklch(0.88 0.03 90)",
};

/** A stand-in for a product photo: a tinted gradient tile with the item's outline, drawn from theme tones. */
export function StoreProductArt({
  kind,
  tone,
  label,
  view = "front",
  color,
  className,
}: {
  kind: StoreArtKind;
  tone: StoreTone;
  /** Alt text; leave out for a decorative tile. */
  label?: string;
  view?: "front" | "back" | "detail" | "styled";
  /** Draws the item in this CSS colour (a variant), outlined in the tile's tone. */
  color?: string;
  className?: string;
}) {
  return (
    <div
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn("relative grid place-items-center overflow-hidden rounded-card bg-linear-to-br", toneClass[tone], className)}
    >
      <span aria-hidden className="absolute -right-[12%] -bottom-[18%] aspect-square w-3/4 rounded-full bg-current opacity-[0.07]" />
      <svg
        viewBox="0 0 64 64"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="0"
        aria-hidden
        className={cn(
          "relative w-[46%] max-w-48",
          view === "back" && "-scale-x-100 opacity-80",
          view === "detail" && "w-[86%] max-w-none translate-x-[12%] translate-y-[10%]",
          view === "styled" && "w-[36%] -rotate-6",
        )}
      >
        {color ? (
          <>
            <g fill={color} stroke="none" className="[&_path]:opacity-100">
              {art[kind]}
            </g>
            <g fill="none" strokeWidth="1" strokeLinejoin="round" className="[&_path]:opacity-100">
              {art[kind]}
            </g>
          </>
        ) : (
          art[kind]
        )}
      </svg>
    </div>
  );
}

/** Five stars filled to the rating; the number and count are spoken. */
export function StoreRating({ rating, count, className, size = "sm" }: { rating: number; count?: number; className?: string; size?: "sm" | "md" }) {
  const star = "M12 3.2l2.6 5.6 6.1.7-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6-4.5-4.2 6.1-.7Z";
  const row = (filled: boolean) => (
    <span className="flex">
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} viewBox="0 0 24 24" className={cn("shrink-0", size === "md" ? "size-5" : "size-3.5")} fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden>
          <path d={star} />
        </svg>
      ))}
    </span>
  );
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-xs text-muted", className)}>
      <span className="relative inline-flex text-warning" aria-hidden>
        <span className="opacity-35">{row(false)}</span>
        <span className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${(rating / 5) * 100}%` }}>
          {row(true)}
        </span>
      </span>
      <span className="sr-only">
        Rated {rating.toFixed(1)} out of 5{count !== undefined ? `, ${count} reviews` : ""}
      </span>
      {count !== undefined && (
        <span aria-hidden className="tabular-nums">
          {rating.toFixed(1)} ({count.toLocaleString("en-US")})
        </span>
      )}
    </span>
  );
}

export function StorePrice({ price, compareAt, className }: { price: number; compareAt?: number; className?: string }) {
  return (
    <span className={cn("inline-flex flex-wrap items-baseline gap-x-2 tabular-nums", className)}>
      <span className={cn("font-medium", compareAt && "text-danger")}>{formatUsd(price)}</span>
      {compareAt && (
        <s className="text-sm text-subtle">
          <span className="sr-only">was </span>
          {formatUsd(compareAt)}
        </s>
      )}
    </span>
  );
}

const check = (
  <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);

export function storeBadge(product: StoreProduct): { label: string; variant: "danger" | "warning" | "accent-solid" | "surface" } | null {
  if (product.stock === 0) return { label: "Sold out", variant: "surface" };
  if (product.label === "Sale") return { label: "Sale", variant: "danger" };
  if (product.label === "Low stock" || product.stock < 10) return { label: `Only ${product.stock} left`, variant: "warning" };
  if (product.label) return { label: product.label, variant: "accent-solid" };
  return null;
}

/** A product tile: art, badge, name, rating, price and a quick "Add to cart". */
export function StoreProductCard({
  product,
  href,
  onAdd,
  headingLevel = "h3",
  addVariant = "accent",
}: {
  product: StoreProduct;
  href: string;
  /** Leave out to hide the button (e.g. related products on a product page). */
  onAdd?: (product: StoreProduct) => void;
  headingLevel?: "h3" | "h4";
  /** Finish of "Add to cart": the theme accent by default, so it follows the Accent setting. */
  addVariant?: "accent" | "solid" | "surface";
}) {
  const [added, setAdded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const badge = storeBadge(product);
  const soldOut = product.stock === 0;
  const Heading = headingLevel;
  const quickOptions = storeLineOptions(storeLine(product));

  return (
    <article className="group/card surface relative flex w-full min-w-0 flex-col overflow-hidden rounded-card">
      <a href={href} tabIndex={-1} aria-hidden className="block p-2 pb-0">
        <StoreProductArt
          kind={product.kind}
          tone={product.tone}
          className={cn("aspect-square transition-[scale] duration-500 ease-theme group-hover/card:scale-[1.02]", soldOut && "opacity-60 grayscale")}
        />
      </a>
      {badge && (
        <Badge variant={badge.variant} className="absolute top-4 left-4">
          {badge.label}
        </Badge>
      )}
      <div className="flex flex-1 flex-col gap-2 p-4 pt-3">
        <Heading className="text-sm leading-snug font-medium">
          <a href={href} className="rounded-sm outline-none hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
            {product.name}
          </a>
        </Heading>
        <p className="truncate text-xs text-muted">
          {product.colors.length > 1 ? `${product.colors.length} colours` : product.colors[0]}
          {product.sizes.length ? ` · ${product.sizes[0]}–${product.sizes[product.sizes.length - 1]}` : " · One size"}
        </p>
        {product.reviewCount > 0 ? <StoreRating rating={product.rating} count={product.reviewCount} /> : <p className="text-xs text-muted">No reviews yet</p>}
        <StorePrice price={product.price} compareAt={product.compareAt} className="mt-auto pt-1 text-sm" />
        {onAdd &&
          (soldOut ? (
            <Button size="sm" disabled className="mt-1 w-full">
              Sold out
            </Button>
          ) : (
            <Button
              size="sm"
              variant={added ? "surface" : addVariant}
              className="mt-1 w-full"
              aria-label={added ? `Added ${product.name} to cart` : `Add ${product.name}${quickOptions ? `, ${quickOptions},` : ""} to cart`}
              onClick={() => {
                onAdd(product);
                setAdded(true);
                clearTimeout(timer.current);
                timer.current = setTimeout(() => setAdded(false), 1800);
              }}
            >
              {added ? (
                <>
                  {check}
                  Added
                </>
              ) : (
                "Add to cart"
              )}
            </Button>
          ))}
      </div>
    </article>
  );
}

/* ---------------------------------------------------------- collections */

export interface StoreCollection {
  slug: string;
  label: string;
  description: string;
  match: (product: StoreProduct) => boolean;
  /** Shown in the danger tone, e.g. Sale. */
  highlight?: boolean;
}

export const sampleStoreCollections: StoreCollection[] = [
  { slug: "new", label: "New in", description: "Fresh from the mills this season, in small first runs.", match: (p) => !!p.isNew },
  { slug: "men", label: "Men", description: "Overshirts, outerwear, denim and the socks that outlast them.", match: (p) => (p.audience ?? ["men", "women"]).includes("men") },
  { slug: "women", label: "Women", description: "Linen, merino and waxed cotton cut for real weather.", match: (p) => (p.audience ?? ["men", "women"]).includes("women") },
  { slug: "accessories", label: "Accessories", description: "Bags, knits, leather goods and things for the kitchen shelf.", match: (p) => p.category !== "Apparel" },
  { slug: "sale", label: "Sale", description: "Last sizes of the summer run, up to 21% off while they last.", match: (p) => p.compareAt !== undefined, highlight: true },
];

/* --------------------------------------------------------------- screen */

export type StoreSort = "featured" | "price-asc" | "price-desc" | "rating";

const sortLabels: Record<StoreSort, string> = {
  featured: "Featured",
  "price-asc": "Price: low to high",
  "price-desc": "Price: high to low",
  rating: "Top rated",
};

const perks = [
  { title: "Free shipping over $150", detail: "Standard delivery in 3–5 business days", d: "M3 7h11v9H3zM14 10h4l3 3v3h-7M7 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM17 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" },
  { title: "30-day free returns", detail: "Print a label from your order email", d: "M4 12a8 8 0 1 0 3-6.2M4 4v5h5" },
  { title: "Repairs for life", detail: "Send it back worn out, we mend it free", d: "M16.1 4.9a4 4 0 0 0-5.4 5.4L4.4 16.6l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.6-.6-2.4Z" },
];

export interface StoreScreenProps {
  products?: StoreProduct[];
  /** Finish of each card's "Add to cart" button; defaults to the theme accent. */
  addVariant?: "accent" | "solid" | "surface";
  /** Called with a cart line for the product's first available variant. */
  onAddToCart?: (line: StoreCartLine) => void;
  productHref?: (slug: string) => string;
  /**
   * Show one collection: its title and description replace the banner and
   * only its products are listed.
   */
  collection?: StoreCollection;
  /** Collections shown as tiles under the banner on the home page. */
  collections?: StoreCollection[];
  collectionHref?: (slug: string) => string;
  /** Heading for a page that is neither home nor a collection, e.g. search results. */
  title?: string;
  /** Starting search, e.g. from the header search. */
  initialQuery?: string;
  /** Product promoted in the banner. */
  featuredSlug?: string;
  /** `loading` shows card skeletons, `error` a retry state. */
  status?: "ready" | "loading" | "error";
  onRetry?: () => void;
  className?: string;
}

/**
 * Storefront home or collection page: a seasonal banner and collection tiles
 * (home) or a collection heading, then search, a type filter, sort and a
 * product grid with quick add.
 */
export function StoreScreen({
  products: allProducts = sampleStoreProducts,
  addVariant = "accent",
  onAddToCart,
  productHref = (slug) => `#/store/p/${slug}`,
  collection,
  collections = [],
  collectionHref = (slug) => `#/store/c/${slug}`,
  title,
  initialQuery = "",
  featuredSlug = "waxed-field-jacket",
  status = "ready",
  onRetry,
  className,
}: StoreScreenProps) {
  const products = useMemo(() => (collection ? allProducts.filter(collection.match) : allProducts), [allProducts, collection]);
  const [query, setQuery] = useState(initialQuery);
  const [type, setType] = useState("All");
  const [sizes, setSizes] = useState<string[]>([]);
  const [sort, setSort] = useState<StoreSort>("featured");
  const [notice, setNotice] = useState("");
  const home = !collection && !title;

  const types = useMemo(() => ["All", ...new Set(products.map((p) => p.category))], [products]);
  const featured = allProducts.find((p) => p.slug === featuredSlug) ?? allProducts[0];
  // Letter sizes are shared across apparel, so they make a useful filter; numeric ones don't.
  const sizeOptions = useMemo(() => apparelSizes.filter((size) => products.some((p) => p.sizes.includes(size))), [products]);
  const inSize = (p: StoreProduct) => !sizes.length || sizes.some((size) => p.sizes.includes(size) && !p.soldOutSizes?.includes(size));

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = products.filter(
      (p) => (type === "All" || p.category === type) && inSize(p) && (!q || `${p.name} ${p.category} ${p.colors.join(" ")} ${p.summary}`.toLowerCase().includes(q)),
    );
    const order: Record<StoreSort, (a: StoreProduct, b: StoreProduct) => number> = {
      featured: (a, b) => Number(a.stock === 0) - Number(b.stock === 0) || a.rank - b.rank,
      "price-asc": (a, b) => a.price - b.price,
      "price-desc": (a, b) => b.price - a.price,
      rating: (a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount,
    };
    return [...list].sort(order[sort]);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- inSize reads `sizes`
  }, [products, query, type, sizes, sort]);

  function add(product: StoreProduct) {
    const line = storeLine(product);
    onAddToCart?.(line);
    const options = storeLineOptions(line);
    setNotice(`Added ${product.name}${options ? ` (${options})` : ""} to your cart.`);
  }

  function reset() {
    setQuery("");
    setType("All");
    setSizes([]);
  }

  return (
    <div className={cn("grid grid-cols-1 gap-8", className)}>
      {home && featured ? (
        <section aria-labelledby="store-banner" className="surface relative overflow-hidden rounded-card">
          <div className="grid items-center gap-6 p-6 md:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] md:p-12">
            <div className="min-w-0">
              <Badge variant="accent">Autumn edit · 14 new pieces</Badge>
              <h1 id="store-banner" className="mt-4 text-3xl leading-tight font-semibold tracking-tight md:text-5xl">
                Layers for wet October mornings
              </h1>
              <p className="mt-4 max-w-md leading-relaxed text-muted">
                Waxed cotton, merino and garment-dyed linen from mills in Portugal, Scotland and Japan. Use <span className="font-mono text-fg">AUTUMN15</span> for 15% off until Nov 9.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
                <a href={productHref(featured.slug)} className={buttonVariants({ variant: "accent", size: "lg", className: "px-8" })}>
                  Shop the {featured.name.toLowerCase()}
                </a>
                {featured.reviewCount > 0 && <StoreRating rating={featured.rating} count={featured.reviewCount} />}
              </div>
            </div>
            <StoreProductArt kind={featured.kind} tone={featured.tone} view="styled" className="hidden aspect-[5/4] md:grid" />
          </div>
        </section>
      ) : (
        <div className="min-w-0">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">{collection?.label ?? title}</h1>
          {collection && <p className="mt-2 max-w-2xl text-muted">{collection.description}</p>}
        </div>
      )}

      {home && (
        <ul className="grid gap-3 sm:grid-cols-3" aria-label="Why shop with us">
          {perks.map((perk) => (
            <li key={perk.title} className="flex items-start gap-3 rounded-card border border-line p-4">
              <svg viewBox="0 0 24 24" className="mt-0.5 size-5 shrink-0 text-accent" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d={perk.d} />
              </svg>
              <div className="min-w-0">
                <p className="text-sm font-medium">{perk.title}</p>
                <p className="mt-0.5 text-xs text-muted">{perk.detail}</p>
              </div>
            </li>
          ))}
        </ul>
      )}

      {home && collections.length > 0 && (
        <section aria-labelledby="store-collections" className="grid gap-4">
          <h2 id="store-collections" className="text-xl font-semibold tracking-tight">
            Shop by collection
          </h2>
          <ul className="grid grid-cols-2 gap-3 md:grid-cols-5 md:gap-4">
            {collections.map((c) => {
              const pick = allProducts.filter(c.match).sort((a, b) => a.rank - b.rank)[0];
              const count = allProducts.filter(c.match).length;
              return (
                <li key={c.slug} className="min-w-0">
                  <a
                    href={collectionHref(c.slug)}
                    className="group/tile surface flex h-full flex-col gap-3 rounded-card p-2 pb-4 outline-none lift focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  >
                    {pick && <StoreProductArt kind={pick.kind} tone={pick.tone} className="aspect-[4/3] transition-[scale] duration-500 ease-theme group-hover/tile:scale-[1.02]" />}
                    <span className="px-2">
                      <span className={cn("block font-medium", c.highlight && "text-danger")}>{c.label}</span>
                      <span className="block text-xs text-muted">
                        {count} {count === 1 ? "product" : "products"}
                      </span>
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <section aria-labelledby="store-catalog" className="grid grid-cols-1 gap-5">
        <h2 id="store-catalog" className={home ? "text-xl font-semibold tracking-tight" : "sr-only"}>
          {home ? "All products" : "Products"}
        </h2>
        <div className="flex flex-wrap items-center gap-3">
          <SearchInput label={collection ? `Search ${collection.label.toLowerCase()}` : "Search the store"} value={query} onValueChange={setQuery} className="min-w-0 flex-1 basis-56" />
          <Select value={sort} onValueChange={(v) => setSort(v as StoreSort)}>
            <SelectTrigger aria-label="Sort products" className="w-full sm:w-52">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(sortLabels) as StoreSort[]).map((s) => (
                <SelectItem key={s} value={s}>
                  {sortLabels[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {(types.length > 2 || sizeOptions.length > 1) && (
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            {types.length > 2 && (
              <ChipGroup
                label="Product type"
                value={type}
                onValueChange={(v) => setType(v ?? "All")}
                options={types.map((c) => ({ value: c, label: c, count: c === "All" ? products.length : products.filter((p) => p.category === c).length }))}
              />
            )}
            {sizeOptions.length > 1 && (
              <div className="flex items-center gap-2">
                <span aria-hidden className="text-sm text-muted">
                  Size
                </span>
                <ChipGroup label="Size in stock" multiple value={sizes} onValueChange={setSizes} options={sizeOptions.map((size) => ({ value: size, label: size }))} />
              </div>
            )}
          </div>
        )}

        <p role="status" className="min-h-5 text-sm text-muted">
          {notice || (status === "ready" ? `${visible.length} ${visible.length === 1 ? "product" : "products"}` : "")}
        </p>

        {status === "loading" ? (
          <div role="status" aria-label="Loading products" className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 xl:grid-cols-4">
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className="surface grid gap-3 rounded-card p-2 pb-4">
                <Skeleton className="aspect-square w-full rounded-card" />
                <div className="grid gap-2 px-2">
                  <Skeleton className="h-3.5 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-9 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : status === "error" ? (
          <ErrorState
            title="The catalogue didn't load"
            description="We couldn't reach the store just now. Your cart is safe; try again in a moment."
            action={onRetry && <Button onClick={onRetry}>Try again</Button>}
          />
        ) : visible.length === 0 ? (
          <EmptyState
            title={query.trim() ? `Nothing matches "${query.trim()}"` : "Nothing here yet"}
            description="Check the spelling, or clear the search and filters to see every product."
            action={<Button onClick={reset}>Clear search and filters</Button>}
          />
        ) : (
          <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 xl:grid-cols-4">
            {visible.map((p) => (
              <li key={p.slug} className="flex min-w-0">
                <StoreProductCard product={p} href={productHref(p.slug)} onAdd={add} headingLevel="h3" addVariant={addVariant} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
