"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/registry/kit/lib/utils";

const scrims = {
  none: null,
  soft: "bg-[linear-gradient(180deg,rgb(0_0_0/0.25)_0%,rgb(0_0_0/0.15)_40%,rgb(0_0_0/0.35)_100%)]",
  strong: "bg-[linear-gradient(180deg,rgb(0_0_0/0.45)_0%,rgb(0_0_0/0.3)_45%,rgb(0_0_0/0.6)_100%)]",
};

export interface VideoBackdropProps {
  src: string;
  /** Still frame shown before the video can play, and instead of it for reduced-motion users. */
  poster?: string;
  /** Darkening gradient that keeps overlaid type legible. */
  scrim?: keyof typeof scrims;
  /** Start downloading immediately. Use for the first screen only. */
  priority?: boolean;
  className?: string;
}

/**
 * A muted, looping background video that fills its nearest positioned parent.
 * It downloads only when near the viewport, pauses when scrolled away and
 * stays on the poster when the user prefers reduced motion.
 * Place it inside a `relative isolate` container.
 */
export function VideoBackdrop({
  src,
  poster,
  scrim = "soft",
  priority = false,
  className,
}: VideoBackdropProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [armed, setArmed] = useState(priority);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting) setArmed(true);
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      // Arm a screen ahead so the first frames are buffered on arrival.
      { rootMargin: "100% 0px" },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 -z-10 overflow-hidden", className)}>
      {poster && (
        // eslint-disable-next-line @next/next/no-img-element -- decorative backdrop, sized by CSS
        <img
          src={poster}
          alt=""
          fetchPriority={priority ? "high" : "low"}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          className="absolute inset-0 size-full object-cover"
        />
      )}
      <video
        ref={videoRef}
        src={armed ? src : undefined}
        muted
        loop
        playsInline
        disablePictureInPicture
        disableRemotePlayback
        preload={priority ? "auto" : "metadata"}
        onCanPlay={() => setReady(true)}
        className={cn(
          "absolute inset-0 size-full object-cover transition-opacity duration-1000 ease-theme",
          ready ? "opacity-100" : "opacity-0",
        )}
      />
      {scrims[scrim] && <div className={cn("absolute inset-0", scrims[scrim])} />}
    </div>
  );
}
