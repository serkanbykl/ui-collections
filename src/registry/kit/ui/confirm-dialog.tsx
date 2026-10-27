"use client";

import { useState, type ReactNode } from "react";

import { Button } from "@/registry/kit/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  type DialogTone,
} from "@/registry/kit/ui/dialog";

const toneIcons: Partial<Record<DialogTone, string>> = {
  danger: "M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3",
  warning: "M12 4 2.8 19.5h18.4L12 4Zm0 6v4.5m0 2.5h.01",
  info: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-10v5m0-8h.01",
  success: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm-4-9 3 3 5-6",
  accent: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-10v5m0-8h.01",
};

export interface ConfirmDialogProps {
  /** The question, phrased as the outcome: "Move “Q3 report.pdf” to Trash?" */
  title: ReactNode;
  /** What happens and whether it can be undone. */
  description?: ReactNode;
  /** Verb + object: "Move to Trash". */
  confirmLabel: string;
  cancelLabel?: string;
  /** danger for destructive steps, warning for risky ones. */
  tone?: DialogTone;
  /** Runs on confirm. Return a promise to show a loading state; throw to keep the dialog open. */
  onConfirm: () => void | Promise<void>;
  /** Element that opens the dialog. Omit and pass `open` to control it instead. */
  trigger?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Extra content between the header and the buttons, e.g. a summary of what is affected. */
  children?: ReactNode;
}

/**
 * Asks before an action that is hard to undo. Focus starts on Cancel so a
 * stray Enter never confirms; the confirm button shows a spinner while the
 * action runs and the dialog closes once it succeeds.
 */
export function ConfirmDialog({
  title,
  description,
  confirmLabel,
  cancelLabel = "Cancel",
  tone = "danger",
  onConfirm,
  trigger,
  open: openProp,
  onOpenChange,
  children,
}: ConfirmDialogProps) {
  const [openState, setOpenState] = useState(false);
  const [busy, setBusy] = useState(false);
  const open = openProp ?? openState;

  function setOpen(next: boolean) {
    if (busy) return;
    setOpenState(next);
    onOpenChange?.(next);
  }

  async function confirm() {
    setBusy(true);
    try {
      await onConfirm();
      setBusy(false);
      setOpen(false);
    } catch {
      setBusy(false);
    }
  }

  const iconPath = toneIcons[tone];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent size="sm" showClose={false} onOpenAutoFocus={(e) => {
        e.preventDefault();
        (e.currentTarget as HTMLElement).querySelector<HTMLElement>("[data-confirm-cancel]")?.focus();
      }}>
        <DialogHeader
          tone={tone}
          className="pr-6 md:pr-7"
          icon={
            iconPath && (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d={iconPath} />
              </svg>
            )
          }
        >
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {children && <div className="px-6 pb-2 md:px-7">{children}</div>}
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost" data-confirm-cancel disabled={busy}>
              {cancelLabel}
            </Button>
          </DialogClose>
          <Button variant={tone === "danger" ? "danger" : "accent"} loading={busy} onClick={confirm}>
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
