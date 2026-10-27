import { ImageCarousel, type CarouselImage, type ImageCarouselProps } from "@/registry/kit/ui/image-carousel";
import { TextReveal } from "@/registry/kit/ui/reveal";

// Our own illustrations (drawn as SVG, rendered to WebP), CC0. Served from /public/media/gallery.
const defaultImages: CarouselImage[] = [
  { src: "/media/gallery/dawn-hills.webp", alt: "Layered violet hills under a rising sun and a pink sky, with a few birds in flight", caption: "Dawn hills · warm tones that suit light mode", width: 1600, height: 1000 },
  { src: "/media/gallery/lake-dusk.webp", alt: "Snow-capped peaks mirrored in a still lake under a starry dusk sky and a crescent moon", caption: "Mirror lake · calm blues for long evenings", width: 1600, height: 1000 },
  { src: "/media/gallery/city-night.webp", alt: "A city skyline at night with lit windows reflected in the river below a full moon", caption: "Night shift · lit windows over the river", width: 1600, height: 1000 },
  { src: "/media/gallery/desert-dunes.webp", alt: "Rolling orange sand dunes under a pale blue sky and a bright midday sun", caption: "Midday dunes · the brightest of the set", width: 1600, height: 1000 },
  { src: "/media/gallery/northern-lights.webp", alt: "Green and violet northern lights over a dark pine forest", caption: "Aurora · made for dark mode and OLED screens", width: 1600, height: 1000 },
  { src: "/media/gallery/golden-coast.webp", alt: "A red and white lighthouse on a green cliff above the sea at golden hour", caption: "Golden coast · a lighthouse at the end of the day", width: 1600, height: 1000 },
];

/** Every Image Carousel option (thumbnails, arrows, indicator, autoplay, fade…) passes through. */
export interface ImageGalleryProps extends Omit<ImageCarouselProps, "label" | "images" | "className"> {
  eyebrow?: string;
  title?: string;
  description?: string;
  /** Defaults to six illustrations shipped in /public/media/gallery. */
  images?: CarouselImage[];
  headingLevel?: "h1" | "h2";
}

/** A section with a heading over an image carousel with captions and a thumbnail strip. */
export function ImageGallery({
  eyebrow = "Wallpapers",
  title = "Six new wallpapers for the autumn release.",
  description = "Drawn in-house and sized 3200 × 2000. Pick one in Settings → Appearance; the dark ones save a little battery on OLED screens.",
  images = defaultImages,
  headingLevel = "h2",
  loop = true,
  ...carousel
}: ImageGalleryProps) {
  return (
    <section className="overflow-x-clip bg-bg px-5 py-24 text-fg sm:px-8 md:py-32">
      <div className="mx-auto max-w-5xl">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-accent">{eyebrow}</p>
          <TextReveal as={headingLevel} trigger="view" className="mt-3 font-display text-4xl leading-[1.05] md:text-5xl">
            {title}
          </TextReveal>
          <p className="mt-4 text-muted md:text-lg">{description}</p>
        </div>
        <ImageCarousel label={eyebrow} images={images} loop={loop} className="mt-12" {...carousel} />
      </div>
    </section>
  );
}
