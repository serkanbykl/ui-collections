"use client";

import { useState, type ReactNode } from "react";

import { cn } from "@/registry/kit/lib/utils";
import { Badge } from "@/registry/kit/ui/badge";
import { Button, buttonVariants } from "@/registry/kit/ui/button";
import { ChartSparkline } from "@/registry/kit/ui/chart-sparkline";
import { Progress } from "@/registry/kit/ui/progress";
import { TrendChip } from "@/registry/kit/ui/stat-card";
import { PageHeader } from "@/registry/kit/ui/page-header";

export interface ProductVariant {
  id: string;
  color: string;
  size: string;
  sku: string;
  stock: number;
  price: number;
}

export interface ProductLocation {
  id: string;
  name: string;
  onHand: number;
  /** Shelf capacity, used for the fill bar. */
  capacity: number;
}

export interface ProductDetail {
  name: string;
  sku: string;
  status: "active" | "draft" | "archived";
  category: string;
  description: string;
  /** Labels for the gallery tiles; one per photo. */
  gallery: string[];
  variants: ProductVariant[];
  locations: ProductLocation[];
  /** Units sold per day, oldest first. */
  sales: number[];
  /** Revenue change against the previous period, as a ratio. */
  salesChange: number;
}

const colors = ["Bone", "Slate", "Olive"];
const sizes = ["S", "M", "L", "XL"];
const stockGrid = [
  [14, 31, 22, 6],
  [0, 18, 27, 9],
  [11, 4, 0, 3],
];

export const sampleProductDetail: ProductDetail = {
  name: "Linen overshirt",
  sku: "NW-01043",
  status: "active",
  category: "Apparel",
  description:
    "Garment-dyed European linen with corozo buttons and a boxy, dropped-shoulder cut. Softens with every wash; cut 4 cm longer than our standard shirt so it layers over a tee.",
  gallery: ["Front", "Back", "Detail", "On model"],
  variants: colors.flatMap((color, c) =>
    sizes.map((size, s) => ({
      id: `${color}-${size}`,
      color,
      size,
      sku: `NW-01043-${color.slice(0, 2).toUpperCase()}${size}`,
      stock: stockGrid[c]![s]!,
      price: size === "XL" ? 68 : 64,
    })),
  ),
  locations: [
    { id: "lis", name: "Lisbon warehouse", onHand: 96, capacity: 160 },
    { id: "rtd", name: "Rotterdam 3PL", onHand: 41, capacity: 120 },
    { id: "shop", name: "Príncipe Real store", onHand: 8, capacity: 24 },
  ],
  sales: [9, 12, 7, 14, 11, 16, 13, 10, 18, 15, 21, 17, 14, 19, 23, 20, 16, 24, 22, 27, 19, 25, 28, 23, 31, 26, 29, 33, 27, 34],
  salesChange: 0.183,
};

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

const tileTones = ["bg-accent/15 text-accent", "bg-info/15 text-info", "bg-warning/15 text-warning", "bg-success/15 text-success"];

/** A stand-in for a product photo: a tinted tile with a garment outline. */
function GalleryTile({ index, label, className }: { index: number; label: string; className?: string }) {
  return (
    <div role="img" aria-label={label} className={cn("grid place-items-center rounded-card", tileTones[index % tileTones.length], className)}>
      <svg viewBox="0 0 64 64" className="w-1/3 max-w-32" fill="currentColor" aria-hidden>
        <path opacity="0.35" d="M22 8h20l14 10-6 10-6-4v32H20V24l-6 4-6-10Z" />
        <path d="M26 8h12c0 3.3-2.7 6-6 6s-6-2.7-6-6Z" />
      </svg>
    </div>
  );
}

function Panel({ title, action, children, className }: { title: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={cn("surface rounded-card p-5 md:p-6", className)}>
      <div className="mb-5 flex items-center justify-between gap-3">
        <h3 className="text-sm font-medium text-fg/85">{title}</h3>
        {action}
      </div>
      {children}
    </section>
  );
}

export interface ProductDetailScreenProps {
  product?: ProductDetail;
  /** Where "Edit product" goes. */
  editHref?: string;
  className?: string;
}

/** One product: photo gallery, variant picker with per-variant stock, inventory by location and 30-day sales. */
export function ProductDetailScreen({ product = sampleProductDetail, editHref = "#/app/products/edit", className }: ProductDetailScreenProps) {
  const [photo, setPhoto] = useState(0);
  const productColors = [...new Set(product.variants.map((v) => v.color))];
  const productSizes = [...new Set(product.variants.map((v) => v.size))];
  const [color, setColor] = useState(productColors[0] ?? "");
  const [size, setSize] = useState(productSizes[1] ?? productSizes[0] ?? "");
  const [locations, setLocations] = useState(product.locations);

  const variant = product.variants.find((v) => v.color === color && v.size === size);
  const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);
  const sold = product.sales.reduce((sum, n) => sum + n, 0);
  const revenue = product.variants[0] ? sold * product.variants[0].price : 0;
  const onHand = locations.reduce((sum, l) => sum + l.onHand, 0);

  function adjust(id: string, delta: number) {
    setLocations((current) =>
      current.map((l) => (l.id === id ? { ...l, onHand: Math.min(Math.max(l.onHand + delta, 0), l.capacity) } : l)),
    );
  }

  return (
    <div className={cn("grid grid-cols-1 gap-6", className)}>
      <PageHeader
        eyebrow={<span className="font-mono text-xs">{product.sku}</span>}
        title={product.name}
        description={`${product.category} · ${totalStock} units across ${product.variants.length} variants`}
        actions={
          <a href={editHref} className={buttonVariants({ variant: "surface" })}>
            Edit product
          </a>
        }
      >
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge variant={product.status === "active" ? "success" : product.status === "draft" ? "warning" : "outline"} dot>
              {product.status === "active" ? "Active" : product.status === "draft" ? "Draft" : "Archived"}
            </Badge>
          </div>
      </PageHeader>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <div className="grid grid-cols-1 gap-3">
          <GalleryTile index={photo} label={`${product.name}, ${product.gallery[photo]} view`} className="aspect-[4/3]" />
          <div className="grid grid-cols-4 gap-3" role="group" aria-label="Photos">
            {product.gallery.map((label, i) => (
              <button
                key={label}
                type="button"
                onClick={() => setPhoto(i)}
                aria-pressed={photo === i}
                aria-label={`Show ${label.toLowerCase()} photo`}
                className={cn(
                  "cursor-pointer rounded-card ring-offset-2 ring-offset-bg transition-shadow",
                  photo === i ? "ring-2 ring-accent" : "hover:ring-2 hover:ring-line-strong",
                )}
              >
                <GalleryTile index={i} label={label} className="aspect-square" />
              </button>
            ))}
          </div>
        </div>

        <Panel title="Variants">
          <p className="text-sm leading-relaxed text-muted">{product.description}</p>

          <fieldset className="mt-6">
            <legend className="mb-2 text-sm text-muted">Colour · {color}</legend>
            <div className="flex flex-wrap gap-2">
              {productColors.map((c) => (
                <Button key={c} size="sm" variant={c === color ? "solid" : "surface"} aria-pressed={c === color} onClick={() => setColor(c)}>
                  {c}
                </Button>
              ))}
            </div>
          </fieldset>
          <fieldset className="mt-5">
            <legend className="mb-2 text-sm text-muted">Size · {size}</legend>
            <div className="flex flex-wrap gap-2">
              {productSizes.map((s) => {
                const stock = product.variants.find((v) => v.color === color && v.size === s)?.stock ?? 0;
                return (
                  <Button
                    key={s}
                    size="sm"
                    variant={s === size ? "solid" : "surface"}
                    aria-pressed={s === size}
                    onClick={() => setSize(s)}
                    className={cn("min-w-12", stock === 0 && s !== size && "text-subtle line-through")}
                  >
                    {s}
                  </Button>
                );
              })}
            </div>
          </fieldset>

          {variant && (
            <dl className="mt-6 grid grid-cols-3 gap-4 border-t border-line pt-5 text-sm">
              <div>
                <dt className="text-muted">SKU</dt>
                <dd className="mt-1 truncate font-mono text-xs">{variant.sku}</dd>
              </div>
              <div>
                <dt className="text-muted">Price</dt>
                <dd className="mt-1 tabular-nums">{usd.format(variant.price)}</dd>
              </div>
              <div>
                <dt className="text-muted">In stock</dt>
                <dd className={cn("mt-1 tabular-nums", variant.stock === 0 ? "text-danger" : variant.stock < 10 ? "text-warning" : "")}>
                  {variant.stock === 0 ? "Sold out" : `${variant.stock} units`}
                </dd>
              </div>
            </dl>
          )}
        </Panel>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Panel title="Inventory by location" action={<span className="text-sm tabular-nums text-muted">{onHand} on hand</span>}>
          <ul className="grid grid-cols-1 gap-5">
            {locations.map((l) => (
              <li key={l.id} className="grid grid-cols-1 gap-2">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{l.name}</p>
                    <p className="text-xs tabular-nums text-muted">
                      {l.onHand} of {l.capacity} shelf slots
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <Button size="icon-sm" variant="ghost" aria-label={`Remove one unit at ${l.name}`} onClick={() => adjust(l.id, -1)} disabled={l.onHand === 0}>
                      −
                    </Button>
                    <span className="w-8 text-center text-sm tabular-nums">{l.onHand}</span>
                    <Button size="icon-sm" variant="ghost" aria-label={`Add one unit at ${l.name}`} onClick={() => adjust(l.id, 1)} disabled={l.onHand === l.capacity}>
                      +
                    </Button>
                  </div>
                </div>
                <Progress
                  value={l.onHand}
                  max={l.capacity}
                  aria-label={`${l.name} fill`}
                  tone={l.onHand / l.capacity < 0.4 ? "warning" : "accent"}
                />
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Sales, last 30 days" action={<TrendChip change={product.salesChange} />}>
          <div className="flex flex-wrap gap-x-8 gap-y-3">
            <div>
              <p className="text-sm text-muted">Units sold</p>
              <p className="mt-1 text-3xl font-semibold tracking-tight tabular-nums">{sold.toLocaleString("en-US")}</p>
            </div>
            <div>
              <p className="text-sm text-muted">Revenue</p>
              <p className="mt-1 text-3xl font-semibold tracking-tight tabular-nums">{usd.format(revenue)}</p>
            </div>
          </div>
          <ChartSparkline data={product.sales} label={`Daily units sold for ${product.name}`} className="mt-6 h-24 w-full" />
          <p className="mt-3 text-xs text-muted">Best day: {Math.max(...product.sales)} units. Restock alerts trigger below 10 per variant.</p>
        </Panel>
      </div>
    </div>
  );
}
