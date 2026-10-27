"use client";

import { useRef, useState } from "react";

import { useSitePath } from "@/components/site/site-link";
import { SegmentedControl } from "@/registry/kit/ui/segmented-control";

const widths = { desktop: "100%", tablet: "768px", mobile: "390px" } as const;
type Viewport = keyof typeof widths;

/**
 * Renders a block in an iframe so its media queries respond to the chosen
 * width, not the docs layout.
 */
export function PreviewFrame({ src: path, height = 640, title }: { src: string; height?: number; title: string }) {
  const src = useSitePath()(path);
  const [viewport, setViewport] = useState<Viewport>("desktop");
  const frameRef = useRef<HTMLIFrameElement>(null);

  return (
    <div className="overflow-hidden rounded-card border border-line bg-bg-deep">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-3 py-2.5">
        <SegmentedControl
          aria-label="Preview width"
          value={viewport}
          onValueChange={setViewport}
          options={[
            { value: "desktop", label: "Desktop" },
            { value: "tablet", label: "Tablet" },
            { value: "mobile", label: "Mobile" },
          ]}
          className="hidden sm:inline-flex"
        />
        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={() => frameRef.current?.contentWindow?.location.reload()}
            className="rounded-control px-3 py-1.5 text-xs text-muted transition-colors hover:bg-fg/5 hover:text-fg"
          >
            Reload
          </button>
          <a
            href={src}
            target="_blank"
            rel="noreferrer"
            aria-label={`Open ${title} in a new tab`}
            className="rounded-control px-3 py-1.5 text-xs text-muted transition-colors hover:bg-fg/5 hover:text-fg"
          >
            Open <span aria-hidden>↗</span>
          </a>
        </div>
      </div>
      <div className="flex justify-center bg-[radial-gradient(color-mix(in_oklab,var(--c-fg)_8%,transparent)_1px,transparent_1px)] bg-size-[16px_16px]">
        <iframe
          ref={frameRef}
          src={src}
          title={title}
          loading="lazy"
          style={{ width: widths[viewport], height }}
          className="max-w-full border-x border-line bg-bg transition-[width] duration-500 ease-theme"
        />
      </div>
    </div>
  );
}
