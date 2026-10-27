"use client";

import { useState } from "react";

import { Button } from "@/registry/kit/ui/button";
import { Magnetic } from "@/registry/kit/ui/magnetic";

export default function MagneticDemo() {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="flex flex-wrap items-center justify-center gap-10">
      <Magnetic>
        <Button size="lg" onClick={() => setPlaying((p) => !p)}>
          {playing ? "Pause the tour" : "Watch the 2-minute tour"}
        </Button>
      </Magnetic>
      <Magnetic strength={0.5}>
        <Button
          variant="solid"
          size="icon"
          aria-label="Play tour"
          aria-pressed={playing}
          onClick={() => setPlaying((p) => !p)}
          className="size-16"
        >
          <svg viewBox="0 0 24 24" className="size-5 translate-x-px" fill="currentColor" aria-hidden>
            {playing ? (
              <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" />
            ) : (
              <path d="M8 5.5v13a1 1 0 0 0 1.5.86l11-6.5a1 1 0 0 0 0-1.72l-11-6.5A1 1 0 0 0 8 5.5Z" />
            )}
          </svg>
        </Button>
      </Magnetic>
    </div>
  );
}
