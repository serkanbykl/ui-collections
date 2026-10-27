"use client";

import { useState } from "react";

import { Badge } from "@/registry/kit/ui/badge";
import { Carousel, type CarouselProps, type ControlVisibility } from "@/registry/kit/ui/carousel";

import { ChoiceOption, OptionsPanel, RangeOption, SwitchOption } from "./carousel-options";

const releases = [
  { version: "4.12", date: "21 Oct 2026", tag: "Deploys", title: "Rollbacks in one click", body: "Every deploy keeps its build for 30 days. Pick one from the list and it is live again in about 9 seconds." },
  { version: "4.11", date: "7 Oct 2026", tag: "Previews", title: "Comments on previews", body: "Reviewers pin a note to any element of a preview. Threads close themselves when the branch merges." },
  { version: "4.10", date: "23 Sep 2026", tag: "Billing", title: "Spend limits per project", body: "Set a monthly cap from €5. We email the owner at 80% and pause builds, never traffic, at 100%." },
  { version: "4.9", date: "9 Sep 2026", tag: "Logs", title: "Saved log searches", body: "Name a query, share its link with the team and get a digest when it matches more than 50 lines an hour." },
  { version: "4.8", date: "26 Aug 2026", tag: "Security", title: "Passkeys for every seat", body: "Sign in with Touch ID, Windows Hello or a hardware key. Admins can require them for the whole workspace." },
  { version: "4.7", date: "12 Aug 2026", tag: "Domains", title: "Wildcard certificates", body: "One certificate now covers every preview subdomain, issued in under a minute and renewed 30 days early." },
];

const visibility = [
  { value: "always", label: "Always" },
  { value: "hover", label: "On hover" },
  { value: "never", label: "Hidden" },
] as const satisfies { value: ControlVisibility; label: string }[];

type PerView = "responsive" | "1" | "2" | "3" | "4";

export default function CarouselDemo() {
  const [perView, setPerView] = useState<PerView>("responsive");
  const [gap, setGap] = useState(16);
  const [peek, setPeek] = useState(0);
  const [center, setCenter] = useState(false);
  const [scrollMode, setScrollMode] = useState<NonNullable<CarouselProps["scrollMode"]>>("snap");
  const [transition, setTransition] = useState<NonNullable<CarouselProps["transition"]>>("slide");
  const [loop, setLoop] = useState(true);
  const [autoplay, setAutoplay] = useState(true);
  const [seconds, setSeconds] = useState(6);
  const [pauseOnHover, setPauseOnHover] = useState(true);
  const [arrows, setArrows] = useState<ControlVisibility>("always");
  const [placement, setPlacement] = useState<"bottom" | "overlay" | "outside">("bottom");
  const [dots, setDots] = useState<ControlVisibility>("always");
  const [indicator, setIndicator] = useState<NonNullable<CarouselProps["indicator"]>>("dots");
  const [draggable, setDraggable] = useState(true);
  const [wheel, setWheel] = useState(true);
  const [keyboard, setKeyboard] = useState(true);

  return (
    <div className="grid w-full max-w-5xl gap-8">
      <Carousel
        // Layout modes change what a page is; start them fresh.
        key={`${transition}-${center}-${perView}`}
        label="Release highlights"
        slidesPerView={perView === "responsive" ? { base: 1, sm: 2, lg: 3 } : Number(perView)}
        gap={`${gap}px`}
        peek={peek ? `${peek}px` : undefined}
        center={center}
        scrollMode={scrollMode}
        transition={transition}
        loop={loop}
        autoplay={autoplay ? seconds * 1000 : undefined}
        pauseOnHover={pauseOnHover}
        arrows={arrows}
        arrowPlacement={placement}
        dots={dots}
        indicator={indicator}
        draggable={draggable}
        wheel={wheel}
        keyboard={keyboard}
      >
        {releases.map((r) => (
          <article key={r.version} className="surface flex h-full flex-col rounded-card p-6">
            <div className="flex items-center justify-between gap-3 text-xs text-muted">
              <Badge variant="accent">{r.tag}</Badge>
              <time>{r.date}</time>
            </div>
            <h3 className="mt-5 text-lg font-medium">{r.title}</h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{r.body}</p>
            <p className="mt-6 text-xs text-subtle tabular-nums">Version {r.version}</p>
          </article>
        ))}
      </Carousel>

      <OptionsPanel title="Carousel options">
        <ChoiceOption
          label="Slides per view"
          value={perView}
          onChange={setPerView}
          options={[
            { value: "responsive", label: "1 · 2 · 3" },
            { value: "1", label: "1" },
            { value: "2", label: "2" },
            { value: "3", label: "3" },
            { value: "4", label: "4" },
          ]}
        />
        <RangeOption label="Gap" value={gap} min={0} max={32} step={4} format={(v) => `${v}px`} onChange={setGap} />
        <RangeOption label="Peek" value={peek} min={0} max={80} step={8} format={(v) => `${v}px`} onChange={setPeek} />
        <SwitchOption label="Center mode" checked={center} onChange={setCenter} />
        <ChoiceOption label="Scrolling" value={scrollMode} onChange={setScrollMode} options={[{ value: "snap", label: "Snap" }, { value: "free", label: "Free" }]} />
        <ChoiceOption label="Transition" value={transition} onChange={setTransition} options={[{ value: "slide", label: "Slide" }, { value: "fade", label: "Fade" }]} />
        <SwitchOption label="Loop" checked={loop} onChange={setLoop} />
        <SwitchOption label="Autoplay" checked={autoplay} onChange={setAutoplay} />
        <RangeOption label="Interval" value={seconds} min={2} max={10} disabled={!autoplay} format={(v) => `${v} s`} onChange={setSeconds} />
        <SwitchOption label="Pause on hover" checked={pauseOnHover} onChange={setPauseOnHover} />
        <ChoiceOption label="Arrows" value={arrows} onChange={setArrows} options={visibility} />
        <ChoiceOption label="Arrow placement" value={placement} onChange={setPlacement} options={[{ value: "bottom", label: "Bottom" }, { value: "overlay", label: "Overlay" }, { value: "outside", label: "Outside" }]} />
        <ChoiceOption label="Indicator" value={dots} onChange={setDots} options={visibility} />
        <ChoiceOption label="Indicator style" value={indicator} onChange={setIndicator} options={[{ value: "dots", label: "Dots" }, { value: "bars", label: "Bars" }, { value: "fraction", label: "2 / 6" }]} />
        <SwitchOption label="Swipe and drag" checked={draggable} onChange={setDraggable} />
        <SwitchOption label="Wheel scrolling" checked={wheel} onChange={setWheel} />
        <SwitchOption label="Arrow keys" checked={keyboard} onChange={setKeyboard} />
      </OptionsPanel>
    </div>
  );
}
