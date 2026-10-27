"use client";

import { Button } from "@/registry/kit/ui/button";
import { ConfirmDialog } from "@/registry/kit/ui/confirm-dialog";
import { toast, Toaster } from "@/registry/kit/ui/toast";

export default function ConfirmDialogDemo() {
  return (
    <div className="flex flex-wrap gap-3">
      <ConfirmDialog
        title="Move “Q3 board deck.pdf” to Trash?"
        description="You can restore it from Trash for 30 days. Shared links stop working right away."
        confirmLabel="Move to Trash"
        onConfirm={() => new Promise<void>((resolve) => setTimeout(resolve, 700)).then(() => void toast.success("Moved to Trash."))}
        trigger={<Button variant="danger">Move to Trash</Button>}
      />
      <ConfirmDialog
        tone="warning"
        title="Turn off two-factor authentication?"
        description="Your account will rely on a password alone, and your recovery codes stop working."
        confirmLabel="Turn off"
        onConfirm={() => void toast.warning("Two-factor authentication is off.")}
        trigger={<Button>Turn off 2FA</Button>}
      />
      <Toaster />
    </div>
  );
}
