"use client";

import { useEffect, useImperativeHandle, useRef, useState, type ReactNode, type Ref } from "react";

import { cn } from "@/registry/kit/lib/utils";
import { Carousel, type CarouselApi, type CarouselProps } from "@/registry/kit/ui/carousel";

export interface CarouselImage {
  /** Image URL. Leave out when `art` draws the slide. */
  src?: string;
  /** Drawn artwork in place of a file, e.g. an inline SVG built from theme tokens. Fills the slide and its thumbnail. */
  art?: ReactNode;
  alt: string;
  caption?: string;
  /** Intrinsic size, so the browser reserves the space before the file arrives. */
  width: number;
  height: number;
}

type PassThrough = Pick<
  CarouselProps,
  "loop" | "autoplay" | "pauseOnHover" | "showPlayPause" | "arrows" | "arrowPlacement" | "dots" | "indicator" | "draggable" | "wheel" | "keyboard" | "transition" | "onPageChange"
>;

export interface ImageCarouselProps extends PassThrough {
  /** Accessible name of the carousel. */
  label: string;
  images: CarouselImage[];
  /** CSS aspect ratio of every slide and thumbnail. */
  aspectRatio?: string;
  /** "cover" crops to fill; "contain" shows the whole image on a deep backdrop. */
  fit?: "cover" | "contain";
  /** Strip of thumbnails that follows the active image. */
  thumbnails?: boolean;
  /** "left" and "right" are vertical strips from sm up and fall back to the bottom below. */
  thumbnailPosition?: "bottom" | "top" | "left" | "right";
  thumbnailSize?: "sm" | "md" | "lg";
  captions?: boolean;
  /** "overlay-bottom": a chip on the image; "below": a line of text under it. */
  captionPosition?: "overlay-bottom" | "below";
  /** Receives goTo / next / prev, e.g. to show the photo of a chosen colour. */
  apiRef?: Ref<CarouselApi>;
  className?: string;
}

const thumbWidth = { sm: "w-14 sm:w-16", md: "w-20 sm:w-24", lg: "w-24 sm:w-32" };
const sideWidth = { sm: "sm:w-[4.5rem]", md: "sm:w-[6.5rem]", lg: "sm:w-[8.5rem]" };

/**
 * Full-bleed images one at a time with captions and an optional thumbnail
 * strip, built on Carousel (swipe, drag, keys, autoplay, fade). Slides keep a
 * fixed aspect ratio and images after the first load lazily, so nothing shifts.
 */
export function ImageCarousel({
  label,
  images,
  aspectRatio = "16 / 10",
  fit = "cover",
  thumbnails = true,
  thumbnailPosition = "bottom",
  thumbnailSize = "md",
  captions = true,
  captionPosition = "overlay-bottom",
  arrowPlacement = "overlay",
  dots,
  onPageChange,
  apiRef,
  className,
  ...carousel
}: ImageCarouselProps) {
  const api = useRef<CarouselApi>(null);
  useImperativeHandle(apiRef, () => ({
    goTo: (page) => api.current?.goTo(page),
    next: () => api.current?.next(),
    prev: () => api.current?.prev(),
  }));
  const strip = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);
  const showStrip = thumbnails && images.length > 1;
  const side = thumbnailPosition === "left" || thumbnailPosition === "right";

  // Keep the active thumbnail in view by scrolling the strip only, never the page.
  useEffect(() => {
    const list = strip.current;
    const item = list?.children[active] as HTMLElement | undefined;
    if (!list || !item) return;
    const behavior = "smooth";
    const vertical = list.scrollHeight > list.clientHeight + 1 && list.scrollWidth <= list.clientWidth + 1;
    if (vertical) {
      const top = item.offsetTop - (list.clientHeight - item.offsetHeight) / 2;
      list.scrollTo({ top: Math.max(0, top), behavior });
    } else {
      const left = Math.min(Math.max(0, item.offsetLeft - (list.clientWidth - item.offsetWidth) / 2), list.scrollWidth - list.clientWidth);
      list.scrollTo({ left: getComputedStyle(list).direction === "rtl" ? -left : left, behavior });
    }
  }, [active]);

  const thumbs = showStrip && (
    <ul
      ref={strip}
      aria-label={`${label}: thumbnails`}
      className={cn(
        "relative flex gap-2 overflow-x-auto p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        side && "sm:absolute sm:inset-0 sm:flex-col sm:overflow-x-hidden sm:overflow-y-auto",
      )}
    >
      {images.map((image, i) => (
        <li key={image.src ?? i} className="shrink-0">
          <button
            type="button"
            aria-label={`Show image ${i + 1} of ${images.length}: ${image.alt}`}
            aria-current={i === active ? "true" : undefined}
            onClick={() => api.current?.goTo(i)}
            className={cn(
              "block cursor-pointer overflow-hidden rounded-[min(var(--radius-control),0.75rem)] bg-bg-deep outline-offset-2 transition-[opacity,scale] duration-300 ease-theme",
              "hover:scale-(--hover-scale) focus-visible:outline-2 focus-visible:outline-accent active:scale-(--press-scale)",
              thumbWidth[thumbnailSize],
              side && "sm:w-full",
              i === active ? "opacity-100 outline-2 outline-accent" : "opacity-55 hover:opacity-90",
            )}
            style={{ aspectRatio }}
          >
            {image.art ? (
              <span aria-hidden className="grid size-full [&>*]:size-full">
                {image.art}
              </span>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element -- registry items can't import next/image.
              <img src={image.src} alt="" width={image.width} height={image.height} loading="lazy" decoding="async" draggable={false} className={cn("size-full", fit === "cover" ? "object-cover" : "object-contain")} />
            )}
          </button>
        </li>
      ))}
    </ul>
  );

  return (
    <div
      className={cn(
        "flex min-w-0 flex-col gap-3",
        thumbnailPosition === "top" && "flex-col-reverse",
        thumbnailPosition === "right" && "sm:flex-row",
        thumbnailPosition === "left" && "sm:flex-row-reverse",
        className,
      )}
    >
      <Carousel
        label={label}
        arrowPlacement={arrowPlacement}
        dots={dots ?? (showStrip ? "never" : "always")}
        bleed="0px"
        apiRef={api}
        onPageChange={(p) => {
          setActive(p);
          onPageChange?.(p);
        }}
        className="min-w-0 flex-1"
        {...carousel}
      >
        {images.map((image, i) => (
          <figure key={image.src ?? i} className="m-0 flex min-w-0 flex-col">
            <div className="relative overflow-hidden rounded-card bg-bg-deep" style={{ aspectRatio }}>
              {image.art ? (
                <div role="img" aria-label={image.alt} className="absolute inset-0 grid [&>*]:size-full">
                  {image.art}
                </div>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element -- registry items can't import next/image.
                <img
                  src={image.src}
                  alt={image.alt}
                  width={image.width}
                  height={image.height}
                  loading={i === 0 ? "eager" : "lazy"}
                  decoding="async"
                  draggable={false}
                  className={cn("absolute inset-0 size-full select-none", fit === "cover" ? "object-cover" : "object-contain")}
                />
              )}
              {captions && image.caption && captionPosition === "overlay-bottom" && (
                <figcaption className="surface-raised absolute start-3 bottom-3 max-w-[calc(100%-1.5rem)] rounded-control px-3 py-2 text-sm text-fg sm:start-4 sm:bottom-4 sm:max-w-md sm:px-4">
                  {image.caption}
                </figcaption>
              )}
            </div>
            {captions && image.caption && captionPosition === "below" && <figcaption className="mt-3 text-sm text-muted">{image.caption}</figcaption>}
          </figure>
        ))}
      </Carousel>

      {thumbs && (side ? <div className={cn("relative min-w-0 shrink-0", sideWidth[thumbnailSize])}>{thumbs}</div> : thumbs)}
    </div>
  );
}
