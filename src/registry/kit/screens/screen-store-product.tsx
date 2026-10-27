"use client";

import { useRef, useState } from "react";

import { cn } from "@/registry/kit/lib/utils";
import { Accordion } from "@/registry/kit/ui/accordion";
import { Badge } from "@/registry/kit/ui/badge";
import { Breadcrumb } from "@/registry/kit/ui/breadcrumb";
import { Button, buttonVariants } from "@/registry/kit/ui/button";
import { Progress } from "@/registry/kit/ui/progress";
import type { CarouselApi } from "@/registry/kit/ui/carousel";
import { ImageCarousel, type CarouselImage } from "@/registry/kit/ui/image-carousel";
import { EmptyState } from "@/registry/kit/ui/states";
import {
  sampleStoreProducts,
  sampleStoreSwatches,
  storeBadge,
  storeLine,
  storeLineOptions,
  StorePrice,
  StoreProductArt,
  StoreProductCard,
  StoreRating,
  STORE_FREE_SHIPPING_FROM,
  STORE_MAX_QUANTITY,
  type StoreCartLine,
  type StoreProduct,
} from "@/registry/kit/screens/screen-store";

const views = [
  { id: "front", label: "Front" },
  { id: "back", label: "Back" },
  { id: "detail", label: "Fabric detail" },
  { id: "styled", label: "Styled" },
] as const;

export interface StoreProductScreenProps {
  product?: StoreProduct;
  /** CSS colour per colour name, so each colour gets its own photo. */
  swatches?: Record<string, string>;
  /** Products for "You might also like"; the same category comes first. */
  related?: StoreProduct[];
  onAddToCart?: (line: StoreCartLine) => void;
  storeHref?: string;
  cartHref?: string;
  productHref?: (slug: string) => string;
  className?: string;
}

/** Product page: a swipeable gallery with a photo per colour, colour and size pickers with sold-out sizes, quantity, add to cart, details, reviews and related products. */
export function StoreProductScreen({
  product = sampleStoreProducts[0]!,
  swatches = sampleStoreSwatches,
  related = sampleStoreProducts,
  onAddToCart,
  storeHref = "#/store",
  cartHref = "#/store/cart",
  productHref = (slug) => `#/store/p/${slug}`,
  className,
}: StoreProductScreenProps) {
  const [color, setColor] = useState(product.colors[0]);
  const gallery = useRef<CarouselApi>(null);
  const [size, setSize] = useState<string | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);
  const [sizeError, setSizeError] = useState(false);
  const [added, setAdded] = useState<string | null>(null);
  const reviewsRef = useRef<HTMLElement>(null);
  const sizesRef = useRef<HTMLDivElement>(null);

  const soldOut = product.stock === 0;
  const badge = storeBadge(product);
  const maxQuantity = Math.min(STORE_MAX_QUANTITY, Math.max(product.stock, 1));
  const others = related.filter((p) => p.slug !== product.slug);
  const relatedList = [...others.filter((p) => p.category === product.category), ...others.filter((p) => p.category !== product.category)].slice(0, 4);
  // One front photo per colour, then the other angles in the first colour; picking a colour shows its photo.
  const photos: CarouselImage[] = [
    ...(product.colors.length ? product.colors : [undefined]).map((c) => ({
      alt: `${product.name}${c ? ` in ${c.toLowerCase()}` : ""}, front view`,
      art: <StoreProductArt kind={product.kind} tone={product.tone} color={c && swatches[c]} />,
      width: 1200,
      height: 1200,
    })),
    ...views.slice(1).map((v) => ({
      alt: `${product.name}, ${v.label.toLowerCase()} view`,
      art: <StoreProductArt kind={product.kind} tone={product.tone} view={v.id} color={product.colors[0] && swatches[product.colors[0]]} />,
      width: 1200,
      height: 1200,
    })),
  ];
  function pickColor(c: string) {
    setColor(c);
    gallery.current?.goTo(Math.max(0, product.colors.indexOf(c)));
  }
  const histogram = [5, 4, 3, 2, 1].map((stars) => ({ stars, count: product.reviews.filter((r) => r.rating === stars).length }));

  function add() {
    if (product.sizes.length && !size) {
      setSizeError(true);
      sizesRef.current?.querySelector<HTMLButtonElement>("button:not(:disabled)")?.focus();
      return;
    }
    const line = storeLine(product, { color, size, quantity });
    onAddToCart?.(line);
    const options = storeLineOptions(line);
    setAdded(`Added ${quantity} × ${product.name}${options ? ` (${options})` : ""} to your cart.`);
  }

  return (
    <div className={cn("grid grid-cols-1 gap-8", className)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Breadcrumb
          items={[
            { label: "Store", href: storeHref },
            { label: product.category, href: storeHref },
            { label: product.name },
          ]}
        />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <div className="relative min-w-0 content-start">
          <ImageCarousel
            label={`${product.name} photos`}
            apiRef={gallery}
            images={photos}
            aspectRatio="1 / 1"
            fit="contain"
            thumbnailPosition="left"
            thumbnailSize="md"
            captions={false}
            arrows="hover"
            loop
            className={cn(soldOut && "grayscale")}
          />
          {badge && (
            <Badge variant={badge.variant} className="pointer-events-none absolute top-4 right-4">
              {badge.label}
            </Badge>
          )}
        </div>

        <div className="min-w-0">
          <p className="text-sm text-muted">{product.category}</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight md:text-4xl">{product.name}</h1>
          <p className="mt-2 text-muted">{product.summary}</p>
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
            <StorePrice price={product.price} compareAt={product.compareAt} className="text-xl" />
            {product.reviewCount > 0 ? (
              <button
                type="button"
                onClick={() => reviewsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
                className="cursor-pointer rounded-sm outline-none hover:text-fg focus-visible:outline-2 focus-visible:outline-accent"
              >
                <StoreRating rating={product.rating} count={product.reviewCount} />
                <span className="sr-only">, read reviews</span>
              </button>
            ) : (
              <span className="text-sm text-muted">No reviews yet</span>
            )}
          </div>

          {product.colors.length > 0 && (
            <fieldset className="mt-7">
              <legend className="mb-2 text-sm text-muted">
                Colour · <span className="text-fg">{color}</span>
              </legend>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <Button key={c} size="sm" variant={c === color ? "solid" : "surface"} aria-pressed={c === color} onClick={() => pickColor(c)}>
                    {c}
                  </Button>
                ))}
              </div>
            </fieldset>
          )}

          {product.sizes.length > 0 && (
            <fieldset className="mt-5" aria-describedby={sizeError ? "store-size-error" : undefined}>
              <legend className="mb-2 text-sm text-muted">
                Size · <span className="text-fg">{size ?? "choose one"}</span>
              </legend>
              <div ref={sizesRef} className="flex flex-wrap gap-2">
                {product.sizes.map((s) => {
                  const out = soldOut || !!product.soldOutSizes?.includes(s);
                  return (
                    <Button
                      key={s}
                      size="sm"
                      variant={s === size ? "solid" : "surface"}
                      aria-pressed={s === size}
                      disabled={out}
                      aria-label={out ? `${s}, sold out` : s}
                      onClick={() => {
                        setSize(s);
                        setSizeError(false);
                      }}
                      className={cn("min-w-12", out && "line-through")}
                    >
                      {s}
                    </Button>
                  );
                })}
              </div>
              {sizeError && (
                <p id="store-size-error" className="mt-2 text-sm text-danger">
                  Choose a size to add this to your cart.
                </p>
              )}
            </fieldset>
          )}

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <div role="group" aria-label="Quantity" className="surface flex h-11 items-center gap-1 rounded-control px-1">
              <Button size="icon-sm" variant="ghost" aria-label="Decrease quantity" disabled={quantity <= 1 || soldOut} onClick={() => setQuantity((q) => q - 1)}>
                −
              </Button>
              <output aria-live="polite" aria-label="Quantity" className="w-8 text-center text-sm tabular-nums">
                {quantity}
              </output>
              <Button size="icon-sm" variant="ghost" aria-label="Increase quantity" disabled={quantity >= maxQuantity || soldOut} onClick={() => setQuantity((q) => q + 1)}>
                +
              </Button>
            </div>
            <Button variant="accent" className="min-w-0 flex-1 basis-40" disabled={soldOut} onClick={add}>
              {soldOut ? "Sold out" : "Add to cart"}
            </Button>
          </div>

          <div role="status" className="mt-3 min-h-5 text-sm">
            {soldOut ? (
              <span className="text-muted">Sold out for now. {product.description.split(". ").slice(-1)[0]}</span>
            ) : added ? (
              <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="text-success">{added}</span>
                <a href={cartHref} className="font-medium text-accent underline-offset-4 hover:underline">
                  View cart
                </a>
              </span>
            ) : product.stock < 10 ? (
              <span className="text-warning">Only {product.stock} left in stock.</span>
            ) : (
              <span className="text-muted">In stock · ships within 1 business day.</span>
            )}
          </div>

          <ul className="mt-5 grid gap-2 border-t border-line pt-5 text-sm text-muted">
            <li>Free standard shipping on orders over ${STORE_FREE_SHIPPING_FROM}.</li>
            <li>Free returns within 30 days, and repairs for life.</li>
          </ul>

          <Accordion
            className="mt-6 [&_h3_button]:py-4 [&_h3_span]:text-base [&_h3_span]:font-sans [&_h3_span]:font-medium [&_h3_span]:tracking-normal"
            defaultOpen={["description"]}
            items={[
              { id: "description", title: "Description", content: <p className="pb-4 text-sm leading-relaxed text-muted">{product.description}</p> },
              {
                id: "details",
                title: "Materials and fit",
                content: (
                  <ul className="grid list-disc gap-1 pb-4 pl-5 text-sm text-muted">
                    {product.details.map((d) => (
                      <li key={d}>{d}</li>
                    ))}
                  </ul>
                ),
              },
              { id: "care", title: "Care", content: <p className="pb-4 text-sm leading-relaxed text-muted">{product.care}</p> },
            ]}
          />
        </div>
      </div>

      <section ref={reviewsRef} aria-labelledby="store-reviews" className="surface scroll-mt-24 rounded-card p-5 md:p-6">
        <h2 id="store-reviews" className="text-lg font-semibold tracking-tight">
          Reviews
        </h2>
        {product.reviews.length === 0 ? (
          <EmptyState
            size="compact"
            title="No reviews yet"
            description={`${product.name} is new this season. Reviews open to buyers 14 days after delivery.`}
          />
        ) : (
          <div className="mt-5 grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,15rem)_minmax(0,1fr)]">
            <div>
              <p className="text-3xl font-semibold tracking-tight tabular-nums">{product.rating.toFixed(1)}</p>
              <StoreRating rating={product.rating} size="md" className="mt-1" />
              <p className="mt-1 text-sm text-muted">Based on {product.reviewCount.toLocaleString("en-US")} reviews</p>
              <ul className="mt-4 grid gap-2" aria-label="Ratings in the reviews shown">
                {histogram.map((h) => (
                  <li key={h.stars} className="grid grid-cols-[3.5rem_minmax(0,1fr)_1.5rem] items-center gap-2 text-xs text-muted">
                    <span>{h.stars} stars</span>
                    <Progress value={h.count} max={product.reviews.length} aria-label={`${h.stars} star reviews`} className="h-1.5" />
                    <span className="text-right tabular-nums">{h.count}</span>
                  </li>
                ))}
              </ul>
            </div>
            <ul className="grid gap-6">
              {product.reviews.map((r) => (
                <li key={r.id} className="border-line not-first:border-t not-first:pt-6">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <StoreRating rating={r.rating} />
                    <span className="text-xs text-muted">{r.date}</span>
                  </div>
                  <p className="mt-2 font-medium">{r.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{r.body}</p>
                  <p className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted">
                    <span className="text-fg/85">{r.author}</span>
                    <Badge variant="success">Verified buyer</Badge>
                    {r.bought && <span>Bought {r.bought}</span>}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {relatedList.length > 0 && (
        <section aria-labelledby="store-related" className="grid gap-4">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2 id="store-related" className="text-lg font-semibold tracking-tight">
              You might also like
            </h2>
            <a href={storeHref} className={buttonVariants({ variant: "ghost", size: "sm" })}>
              Browse all products
            </a>
          </div>
          <ul className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
            {relatedList.map((p) => (
              <li key={p.slug} className="flex min-w-0">
                <StoreProductCard product={p} href={productHref(p.slug)} headingLevel="h3" />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
