"use client";

import { Dialog as DialogPrimitive } from "radix-ui";
import type { ComponentProps, HTMLAttributes } from "react";

import { cn } from "@/registry/kit/lib/utils";
import { DialogCloseButton, DialogOverlay } from "@/registry/kit/ui/dialog";

export {
  Dialog as Sheet,
  DialogClose as SheetClose,
  DialogDescription as SheetDescription,
  DialogTitle as SheetTitle,
  DialogTrigger as SheetTrigger,
} from "@/registry/kit/ui/dialog";

const sides = {
  right: "inset-y-3 right-3 w-[min(24rem,calc(100vw-1.5rem))] starting:translate-x-[105%]",
  left: "inset-y-3 left-3 w-[min(24rem,calc(100vw-1.5rem))] starting:-translate-x-[105%]",
  bottom: "inset-x-3 bottom-3 max-h-[85dvh] starting:translate-y-[105%]",
};

export interface SheetContentProps extends ComponentProps<typeof DialogPrimitive.Content> {
  side?: keyof typeof sides;
  bodyClassName?: string;
}

/** A floating surface drawer that slides in from an edge, inset from the viewport like an iOS sheet. */
export function SheetContent({ side = "right", className, bodyClassName, children, ...props }: SheetContentProps) {
  return (
    <DialogPrimitive.Portal>
      <DialogOverlay />
      <DialogPrimitive.Content
        className={cn(
          "surface-raised fixed z-50 flex flex-col overflow-hidden rounded-card text-fg outline-none",
          "transition-[translate,opacity] duration-300 ease-theme starting:opacity-0 data-[state=closed]:animate-pop-out",
          sides[side],
          className,
        )}
        {...props}
      >
        <div className={cn("min-h-0 flex-1 overflow-y-auto overscroll-contain p-6 md:p-7", bodyClassName)}>{children}</div>
        <DialogCloseButton />
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

export function SheetHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mb-5 grid gap-2 pr-8", className)} {...props} />;
}

export function SheetFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:flex-wrap sm:justify-end", className)} {...props} />;
}
