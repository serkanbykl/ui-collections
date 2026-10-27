import type { HTMLAttributes } from "react";

import { cn } from "@/registry/kit/lib/utils";

const tones = {
  info: { text: "text-info", glow: "var(--color-info)", path: "M12 16v-5M12 8h.01" },
  success: { text: "text-success", glow: "var(--color-success)", path: "M8 12.5l2.5 2.5L16 9.5" },
  warning: { text: "text-warning", glow: "var(--color-warning)", path: "M12 8v4.5M12 16h.01" },
  danger: { text: "text-danger", glow: "var(--color-danger)", path: "M9.5 9.5l5 5M14.5 9.5l-5 5" },
};

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  variant?: keyof typeof tones;
  title: React.ReactNode;
  /** Optional trailing control, such as a link or button. */
  action?: React.ReactNode;
}

/**
 * Inline message on a surface, tinted by a soft glow in its tone colour.
 * Danger alerts are announced immediately (role="alert"); the rest politely.
 */
export function Alert({ variant = "info", title, action, className, children, ...props }: AlertProps) {
  const tone = tones[variant];
  return (
    <div
      role={variant === "danger" ? "alert" : "status"}
      className={cn("surface flex items-start gap-3 overflow-hidden rounded-card p-4", className)}
      {...props}
    >
      {/* Tone glow over whatever fill the theme gives the surface. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit]"
        style={{
          background: `radial-gradient(120% 140% at 0% 0%, color-mix(in oklab, ${tone.glow} 14%, transparent), transparent 60%)`,
        }}
      />
      <svg viewBox="0 0 24 24" className={cn("relative mt-px size-5 shrink-0", tone.text)} fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <circle cx="12" cy="12" r="9" />
        <path d={tone.path} />
      </svg>
      <div className="relative min-w-0 flex-1">
        <div className="text-sm font-medium text-fg">{title}</div>
        {children && <div className="mt-1 text-sm leading-relaxed text-muted">{children}</div>}
      </div>
      {action && <div className="relative shrink-0 self-center">{action}</div>}
    </div>
  );
}
