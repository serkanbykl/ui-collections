"use client";

import { Command as CommandPrimitive } from "cmdk";
import { Dialog as DialogPrimitive } from "radix-ui";
import { useEffect, useRef, useState, type ComponentProps, type HTMLAttributes } from "react";

import { wordFilter } from "@/registry/kit/lib/search";
import { cn } from "@/registry/kit/lib/utils";
import { DialogOverlay } from "@/registry/kit/ui/dialog";

export function Command({ className, ...props }: ComponentProps<typeof CommandPrimitive>) {
  return <CommandPrimitive filter={wordFilter} className={cn("flex size-full flex-col text-fg", className)} {...props} />;
}

export function CommandInput({ className, value: valueProp, onValueChange, ...props }: ComponentProps<typeof CommandPrimitive.Input>) {
  // Controlled internally when the caller doesn't, so the clear button can reset it.
  const [inner, setInner] = useState("");
  const value = valueProp ?? inner;
  const inputRef = useRef<HTMLInputElement>(null);
  const change = (next: string) => {
    if (valueProp === undefined) setInner(next);
    onValueChange?.(next);
  };
  return (
    <div className="flex items-center gap-3 border-b border-line px-5">
      <svg viewBox="0 0 24 24" className="size-4 shrink-0 text-muted" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden>
        <circle cx="11" cy="11" r="6.5" />
        <path d="M16 16l4 4" />
      </svg>
      <CommandPrimitive.Input
        ref={inputRef}
        value={value}
        onValueChange={change}
        className={cn("h-14 w-full bg-transparent text-[15px] text-fg outline-none placeholder:text-muted", className)}
        {...props}
      />
      {value && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => {
            change("");
            inputRef.current?.focus();
          }}
          className="-mr-2 grid size-7 shrink-0 animate-pop-in cursor-pointer place-items-center rounded-full text-muted transition-colors hover:bg-fg/8 hover:text-fg focus-visible:outline-2 focus-visible:outline-accent"
        >
          <svg viewBox="0 0 24 24" aria-hidden className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>
      )}
    </div>
  );
}

/** The scrolling region; the surface dialog around it stays still. */
export function CommandList({ className, ...props }: ComponentProps<typeof CommandPrimitive.List>) {
  return (
    <CommandPrimitive.List
      className={cn("max-h-[min(22rem,60dvh)] overflow-y-auto overscroll-contain p-2 [scrollbar-width:thin]", className)}
      {...props}
    />
  );
}

export function CommandEmpty({ className, ...props }: ComponentProps<typeof CommandPrimitive.Empty>) {
  return <CommandPrimitive.Empty className={cn("py-10 text-center text-sm text-muted", className)} {...props} />;
}

export function CommandGroup({ className, ...props }: ComponentProps<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      className={cn(
        "[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:pb-1.5 [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:tracking-[0.16em] [&_[cmdk-group-heading]]:text-muted [&_[cmdk-group-heading]]:uppercase",
        className,
      )}
      {...props}
    />
  );
}

export function CommandItem({ className, ...props }: ComponentProps<typeof CommandPrimitive.Item>) {
  return (
    <CommandPrimitive.Item
      className={cn(
        "flex items-center gap-3 rounded-[max(0.25rem,calc(var(--r-field)-0.375rem))] px-3 py-2.5 text-sm text-fg/85 outline-none select-none",
        "transition-colors data-[selected=true]:bg-fg/10 data-[selected=true]:text-fg data-[disabled=true]:opacity-40",
        "[&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-muted data-[selected=true]:[&_svg]:text-accent",
        className,
      )}
      {...props}
    />
  );
}

export function CommandSeparator({ className, ...props }: ComponentProps<typeof CommandPrimitive.Separator>) {
  return <CommandPrimitive.Separator className={cn("mx-2 my-1.5 h-px bg-fg/10", className)} {...props} />;
}

export function CommandShortcut({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn("ml-auto font-mono text-[11px] text-muted", className)} {...props} />;
}

/** Opens the palette on ⌘K / Ctrl+K. */
export function useCommandShortcut(toggle: () => void, key = "k") {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === key && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggle();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [toggle, key]);
}

export interface CommandDialogProps extends ComponentProps<typeof DialogPrimitive.Root> {
  /** Accessible name for the palette. */
  title?: string;
  children: React.ReactNode;
  className?: string;
}

/** Command palette in a surface dialog, pinned near the top of the screen. */
export function CommandDialog({ title = "Command palette", children, className, ...props }: CommandDialogProps) {
  return (
    <DialogPrimitive.Root {...props}>
      <DialogPrimitive.Portal>
        <DialogOverlay />
        <DialogPrimitive.Content
          aria-describedby={undefined}
          className={cn(
            "surface-raised fixed top-[15dvh] left-1/2 z-50 w-[calc(100vw-2rem)] max-w-xl -translate-x-1/2 overflow-hidden rounded-card outline-none",
            "transition-[opacity,scale] duration-200 ease-theme starting:scale-[0.97] starting:opacity-0 data-[state=closed]:animate-pop-out",
            className,
          )}
        >
          <DialogPrimitive.Title className="sr-only">{title}</DialogPrimitive.Title>
          <Command>{children}</Command>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
