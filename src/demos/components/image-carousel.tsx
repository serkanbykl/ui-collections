"use client";

import { useState } from "react";

import type { ControlVisibility } from "@/registry/kit/ui/carousel";
import { ImageCarousel, type ImageCarouselProps } from "@/registry/kit/ui/image-carousel";

import { ChoiceOption, OptionsPanel, RangeOption, SwitchOption } from "./carousel-options";

// Our own CC0 illustrations, shipped in public/media/gallery.
const images = [
  { src: "/media/gallery/northern-lights.webp", alt: "Green and violet northern lights over a dark pine forest", caption: "Aurora · 3200 × 2000", width: 1600, height: 1000 },
  { src: "/media/gallery/golden-coast.webp", alt: "A lighthouse on a green cliff above the sea at golden hour", caption: "Golden coast · 3200 × 2000", width: 1600, height: 1000 },
  { src: "/media/gallery/lake-dusk.webp", alt: "Snow-capped peaks mirrored in a still lake at dusk", caption: "Mirror lake · 3200 × 2000", width: 1600, height: 1000 },
  { src: "/media/gallery/desert-dunes.webp", alt: "Orange sand dunes under a bright midday sun", caption: "Midday dunes · 3200 × 2000", width: 1600, height: 1000 },
  { src: "/media/gallery/city-night.webp", alt: "A city skyline at night with lit windows reflected in the river", caption: "Night shift · 3200 × 2000", width: 1600, height: 1000 },
];

type Opt<K extends keyof ImageCarouselProps> = NonNullable<ImageCarouselProps[K]>;

const visibility = [
  { value: "always", label: "Always" },
  { value: "hover", label: "On hover" },
  { value: "never", label: "Hidden" },
] as const satisfies { value: ControlVisibility; label: string }[];

export default function ImageCarouselDemo() {
  const [thumbnails, setThumbnails] = useState(true);
  const [thumbPosition, setThumbPosition] = useState<Opt<"thumbnailPosition">>("bottom");
  const [thumbSize, setThumbSize] = useState<Opt<"thumbnailSize">>("md");
  const [autoplay, setAutoplay] = useState(false);
  const [seconds, setSeconds] = useState(5);
  const [pauseOnHover, setPauseOnHover] = useState(true);
  const [loop, setLoop] = useState(true);
  const [arrows, setArrows] = useState<ControlVisibility>("always");
  const [placement, setPlacement] = useState<"overlay" | "outside" | "bottom">("overlay");
  const [dots, setDots] = useState<ControlVisibility>("never");
  const [indicator, setIndicator] = useState<Opt<"indicator">>("dots");
  const [captions, setCaptions] = useState(true);
  const [captionPosition, setCaptionPosition] = useState<Opt<"captionPosition">>("overlay-bottom");
  const [aspectRatio, setAspectRatio] = useState("16 / 10");
  const [fit, setFit] = useState<Opt<"fit">>("cover");
  const [transition, setTransition] = useState<Opt<"transition">>("slide");
  const [draggable, setDraggable] = useState(true);
  const [wheel, setWheel] = useState(true);
  const [keyboard, setKeyboard] = useState(true);

  return (
    <div className="grid w-full max-w-4xl gap-8">
      <ImageCarousel
        key={transition}
        label="Wallpaper previews"
        images={images}
        thumbnails={thumbnails}
        thumbnailPosition={thumbPosition}
        thumbnailSize={thumbSize}
        autoplay={autoplay ? seconds * 1000 : undefined}
        pauseOnHover={pauseOnHover}
        loop={loop}
        arrows={arrows}
        arrowPlacement={placement}
        dots={dots}
        indicator={indicator}
        captions={captions}
        captionPosition={captionPosition}
        aspectRatio={aspectRatio}
        fit={fit}
        transition={transition}
        draggable={draggable}
        wheel={wheel}
        keyboard={keyboard}
      />

      <OptionsPanel title="Image carousel options">
        <SwitchOption label="Thumbnails" checked={thumbnails} onChange={setThumbnails} />
        <ChoiceOption label="Thumbnail position" value={thumbPosition} onChange={setThumbPosition} options={[{ value: "bottom", label: "Bottom" }, { value: "top", label: "Top" }, { value: "left", label: "Left" }, { value: "right", label: "Right" }]} />
        <ChoiceOption label="Thumbnail size" value={thumbSize} onChange={setThumbSize} options={[{ value: "sm", label: "Small" }, { value: "md", label: "Medium" }, { value: "lg", label: "Large" }]} />
        <SwitchOption label="Autoplay" checked={autoplay} onChange={setAutoplay} />
        <RangeOption label="Interval" value={seconds} min={2} max={10} disabled={!autoplay} format={(v) => `${v} s`} onChange={setSeconds} />
        <SwitchOption label="Pause on hover" checked={pauseOnHover} onChange={setPauseOnHover} />
        <SwitchOption label="Loop" checked={loop} onChange={setLoop} />
        <ChoiceOption label="Arrows" value={arrows} onChange={setArrows} options={visibility} />
        <ChoiceOption label="Arrow placement" value={placement} onChange={setPlacement} options={[{ value: "overlay", label: "Overlay" }, { value: "outside", label: "Outside" }, { value: "bottom", label: "Bottom" }]} />
        <ChoiceOption label="Indicator" value={dots} onChange={setDots} options={visibility} />
        <ChoiceOption label="Indicator style" value={indicator} onChange={setIndicator} options={[{ value: "dots", label: "Dots" }, { value: "bars", label: "Bars" }, { value: "fraction", label: "2 / 5" }]} />
        <SwitchOption label="Captions" checked={captions} onChange={setCaptions} />
        <ChoiceOption label="Caption position" value={captionPosition} onChange={setCaptionPosition} options={[{ value: "overlay-bottom", label: "On image" }, { value: "below", label: "Below" }]} />
        <ChoiceOption label="Aspect ratio" value={aspectRatio} onChange={setAspectRatio} options={[{ value: "16 / 10", label: "16:10" }, { value: "16 / 9", label: "16:9" }, { value: "4 / 3", label: "4:3" }, { value: "3 / 2", label: "3:2" }, { value: "1 / 1", label: "1:1" }]} />
        <ChoiceOption label="Image fit" value={fit} onChange={setFit} options={[{ value: "cover", label: "Fill (crop)" }, { value: "contain", label: "Fit (whole)" }]} />
        <ChoiceOption label="Transition" value={transition} onChange={setTransition} options={[{ value: "slide", label: "Slide" }, { value: "fade", label: "Fade" }]} />
        <SwitchOption label="Swipe and drag" checked={draggable} onChange={setDraggable} />
        <SwitchOption label="Wheel scrolling" checked={wheel} onChange={setWheel} />
        <SwitchOption label="Arrow keys" checked={keyboard} onChange={setKeyboard} />
      </OptionsPanel>
    </div>
  );
}
