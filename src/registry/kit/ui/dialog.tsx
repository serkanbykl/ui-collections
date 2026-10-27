"use client";

import { Dialog as DialogPrimitive } from "radix-ui";
import type { ComponentProps, HTMLAttributes } from "react";

import { cn } from "@/registry/kit/lib/utils";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;
export const DialogPortal = DialogPrimitive.Portal;

export function DialogOverlay({ className, ...props }: ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      className={cn(
        "fixed inset-0 z-50 bg-bg-deep/45 backdrop-blur-[2px]",
        "transition-opacity duration-200 ease-theme starting:opacity-0 data-[state=closed]:animate-fade-out",
        className,
      )}
      {...props}
    />
  );
}

export function DialogCloseButton({ className }: { className?: string }) {
  return (
    <DialogPrimitive.Close
      aria-label="Close"
      className={cn(
        "absolute top-4 right-4 grid size-8 cursor-pointer place-items-center rounded-full text-muted transition-colors",
        "hover:bg-fg/10 hover:text-fg focus-visible:outline-2 focus-visible:outline-accent",
        className,
      )}
    >
      <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden>
        <path d="M6 6l12 12M18 6L6 18" />
      </svg>
    </DialogPrimitive.Close>
  );
}

const sizes = { sm: "max-w-sm", md: "max-w-lg", lg: "max-w-2xl", xl: "max-w-4xl" };

export interface DialogContentProps extends ComponentProps<typeof DialogPrimitive.Content> {
  /** sm 24rem · md 32rem · lg 42rem · xl 56rem. */
  size?: keyof typeof sizes;
  /** Show the round close button in the corner. */
  showClose?: boolean;
}

/**
 * Centred raised panel: DialogHeader > DialogBody > DialogFooter. Header and
 * footer stay put; only the body scrolls. The surface shell itself never
 * scrolls (glass draws its rim with ::before).
 */
export function DialogContent({ className, size = "md", showClose = true, children, ...props }: DialogContentProps) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        className={cn(
          "surface-raised fixed top-1/2 left-1/2 z-50 flex max-h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] -translate-1/2 flex-col overflow-hidden rounded-card text-fg outline-none",
          "transition-[opacity,scale] duration-200 ease-theme starting:scale-[0.96] starting:opacity-0 data-[state=closed]:animate-pop-out",
          sizes[size],
          className,
        )}
        {...props}
      >
        {children}
        {showClose && <DialogCloseButton />}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

const tones = {
  accent: "var(--color-accent)",
  success: "var(--color-success)",
  warning: "var(--color-warning)",
  info: "var(--color-info)",
  danger: "var(--color-danger)",
};

export type DialogTone = keyof typeof tones;

export interface DialogHeaderProps extends HTMLAttributes<HTMLDivElement> {
  /** Shows a tone-tinted tile beside the title and washes the corner in the same tone. */
  icon?: React.ReactNode;
  /** The dialog's intent: create → accent, details → info, risk → warning or danger. */
  tone?: DialogTone;
}

export function DialogHeader({ icon, tone = "accent", className, style, children, ...props }: DialogHeaderProps) {
  if (!icon) {
    return (
      <div className={cn("grid shrink-0 gap-2 px-6 pt-6 pb-4 pr-14 md:px-7 md:pt-7", className)} style={style} {...props}>
        {children}
      </div>
    );
  }
  return (
    <div
      className={cn(
        "flex shrink-0 items-start gap-4 px-6 pt-6 pb-4 pr-14 md:px-7 md:pt-7",
        "bg-[radial-gradient(120%_140%_at_0%_0%,color-mix(in_oklab,var(--dialog-tone)_16%,transparent),transparent_62%)]",
        className,
      )}
      style={{ "--dialog-tone": tones[tone], ...style } as React.CSSProperties}
      {...props}
    >
      <span
        aria-hidden
        className="flex size-11 shrink-0 items-center justify-center rounded-control bg-[color-mix(in_oklab,var(--dialog-tone)_16%,transparent)] text-(--dialog-tone) ring-1 ring-[color-mix(in_oklab,var(--dialog-tone)_24%,transparent)] [&_svg]:size-5"
      >
        {icon}
      </span>
      <div className="grid min-w-0 gap-1.5 pt-0.5">{children}</div>
    </div>
  );
}

/** The scrolling middle of a dialog. */
export function DialogBody({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-2 md:px-7 [scrollbar-width:thin]", className)}
      {...props}
    />
  );
}

export function DialogFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex shrink-0 flex-col-reverse gap-2 px-6 pt-4 pb-6 sm:flex-row sm:flex-wrap sm:justify-end md:px-7 md:pb-7", className)}
      {...props}
    />
  );
}

export function DialogTitle({ className, ...props }: ComponentProps<typeof DialogPrimitive.Title>) {
  return <DialogPrimitive.Title className={cn("font-display text-2xl leading-tight", className)} {...props} />;
}

export function DialogDescription({ className, ...props }: ComponentProps<typeof DialogPrimitive.Description>) {
  return <DialogPrimitive.Description className={cn("text-sm leading-relaxed text-muted", className)} {...props} />;
}
