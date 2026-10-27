"use client";

import { useSyncExternalStore, type ComponentProps } from "react";
import { createPortal } from "react-dom";
import { Toaster as Sonner, toast } from "sonner";

import { cn } from "@/registry/kit/lib/utils";
import { Spinner } from "@/registry/kit/ui/spinner";

export { toast };

export type ToastPosition = "top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right";

// Never wrap or shrink: the message gives way instead.
const button = "shrink-0 cursor-pointer whitespace-nowrap rounded-control px-3 py-1 text-xs font-medium transition-colors";

/**
 * Sonner's stacking and gestures with surface toasts. Mount once near the root,
 * then call `toast("…")`, `toast.success(…)`, `toast.promise(…)` anywhere.
 */
const subscribe = () => () => {};

export function Toaster({ toastOptions, className, ...props }: ComponentProps<typeof Sonner>) {
  // Rendered into <body>: mounted inside a demo frame, sticky header or any
  // `isolate` container, top toasts would otherwise slide under the page's nav.
  const client = useSyncExternalStore(subscribe, () => true, () => false);
  if (!client) return null;
  return createPortal(
    <Sonner
      position="bottom-center"
      // Our spinner, in the same slot and size as the other toast icons.
      icons={{ loading: <Spinner size="sm" label={null} />, ...props.icons }}
      // While a SelectionBar shows, toasts rise above it instead of covering it.
      className={cn("[html[data-selection-bar]_&[data-y-position=bottom]]:bottom-(--selection-bar-space)!", className)}
      gap={10}
      toastOptions={{
        unstyled: true,
        ...toastOptions,
        classNames: {
          toast: cn(
            "surface-raised flex w-(--width) items-center gap-3 rounded-card px-4 py-3.5 text-sm text-fg",
          ),
          content: "min-w-0 flex-1",
          title: "font-medium",
          description: "mt-0.5 text-[13px] text-muted",
          icon: "shrink-0 text-accent [&_svg]:size-4",
          // Sonner centres its loader absolutely inside the toast; keep it in the icon slot.
          loader: "static! transform-none! grid place-items-center",
          success: "[&_[data-icon]]:text-success",
          error: "[&_[data-icon]]:text-danger",
          warning: "[&_[data-icon]]:text-warning",
          actionButton: cn(button, "ml-auto bg-fg text-bg hover:bg-fg/90"),
          cancelButton: cn(button, "bg-fg/10 text-fg hover:bg-fg/15"),
          ...toastOptions?.classNames,
        },
      }}
      {...props}
    />,
    document.body,
  );
}
