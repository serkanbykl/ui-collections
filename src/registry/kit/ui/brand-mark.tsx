import type { ReactNode } from "react";

import { cn } from "@/registry/kit/lib/utils";

const sizes = { sm: "size-6 [&_svg]:size-3.5", md: "size-7 [&_svg]:size-4", lg: "size-9 [&_svg]:size-5" };

/** The default glyph: a neutral rising line. Usable on its own inside any accent tile. */
export function BrandGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 16.5 9 11l4 3.5 7-8" />
    </svg>
  );
}

/**
 * A small accent tile for a product logo. Pass your own glyph as children;
 * without one it shows the neutral rising-line mark.
 */
export function BrandMark({
  size = "md",
  className,
  children,
}: {
  size?: keyof typeof sizes;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "grid shrink-0 place-items-center rounded-[min(var(--r-field),32%)] bg-accent text-accent-fg shadow-[0_6px_16px_-8px_var(--color-accent)]",
        sizes[size],
        className,
      )}
    >
      {children ?? <BrandGlyph />}
    </span>
  );
}
