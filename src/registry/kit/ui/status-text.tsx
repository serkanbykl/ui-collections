import type { HTMLAttributes } from "react";

import { cn } from "@/registry/kit/lib/utils";

export type StatusTone = "success" | "warning" | "danger" | "info" | "accent" | "muted";

export interface StatusTextProps extends HTMLAttributes<HTMLElement> {
  tone?: StatusTone;
  /** `true` for the tone's own icon, a node for your own, `false` for none. */
  icon?: boolean | React.ReactNode;
  as?: "span" | "p" | "div";
}

const tones: Record<StatusTone, string> = {
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
  info: "text-info",
  accent: "text-accent",
  muted: "text-muted",
};

const glyphs: Record<StatusTone, string> = {
  success: "M5 12.5l4.5 4.5L19 7.5",
  warning: "M12 4 2.5 20h19L12 4zM12 10v4M12 17h.01",
  danger: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM9 9l6 6M15 9l-6 6",
  info: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 11v5M12 8h.01",
  accent: "M12 3l2.4 5.6L20 9.3l-4.3 3.9 1.2 5.8L12 16l-4.9 3 1.2-5.8L4 9.3l5.6-.7z",
  muted: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2",
};

/**
 * Text in a status colour that flows inside a sentence: "Payment failed",
 * "3 days left", "Saved". Colours come from the theme's tones, so every
 * collection matches. With an icon, colour isn't the only signal.
 */
export function StatusText({ tone = "info", icon = false, as: Tag = "span", className, children, ...props }: StatusTextProps) {
  const glyph =
    icon === true ? (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d={glyphs[tone]} />
      </svg>
    ) : (
      icon || null
    );

  return (
    <Tag
      className={cn(
        tones[tone],
        glyph ? "inline-flex items-baseline gap-1.5 [&>svg]:size-[1em] [&>svg]:shrink-0 [&>svg]:translate-y-[0.125em]" : undefined,
        "font-medium",
        className,
      )}
      {...props}
    >
      {glyph}
      {children}
    </Tag>
  );
}
