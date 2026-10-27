"use client";

import { useState, type FormEvent, type ReactNode } from "react";

import { Button } from "@/registry/kit/ui/button";
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  type DialogTone,
} from "@/registry/kit/ui/dialog";
import { Input } from "@/registry/kit/ui/field";

const ILLEGAL = /[\\/:*?"<>|]/;

export interface NameRules {
  /** Names already used next to this one (exclude the item being renamed). Compared case-insensitively. */
  takenNames?: string[];
  /** Longest allowed name. */
  maxLength?: number;
  /** What is being named, for the messages: "folder", "file". */
  noun?: string;
}

/**
 * Checks a file or folder name and returns a calm, specific message, or
 * undefined when it is fine. Exported so inline renames can share the rules.
 */
export function validateName(raw: string, { takenNames = [], maxLength = 80, noun = "item" }: NameRules = {}): string | undefined {
  const name = raw.trim();
  if (!name) return `Enter a name for the ${noun}.`;
  if (name.length > maxLength) return `Use ${maxLength} characters or fewer. This name has ${name.length}.`;
  const bad = name.match(ILLEGAL)?.[0];
  if (bad) return `Names can't contain “${bad}”. Leave out / \\ : * ? " < > |`;
  if (name === "." || name === "..") return "Choose a name other than a dot.";
  const lower = name.toLocaleLowerCase();
  if (takenNames.some((n) => n.toLocaleLowerCase() === lower)) return `There's already a ${noun} called “${name}” here. Choose another name.`;
  return undefined;
}

export interface NameDialogProps extends NameRules {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** "New folder", "Rename file". */
  title: ReactNode;
  description?: ReactNode;
  /** Field label. */
  label?: string;
  /** Starting value; it is selected when the dialog opens so typing replaces it. */
  initialValue?: string;
  /** Select only the part before the extension, as file managers do on rename. */
  selectStem?: boolean;
  /** Verb + object: "Create folder", "Rename file". */
  submitLabel: string;
  /** Receives the trimmed name. Return a promise to show a spinner; throw to keep the dialog open. */
  onSubmit: (name: string) => void | Promise<void>;
  icon?: ReactNode;
  tone?: DialogTone;
}

/**
 * One validated name field in a small dialog, for creating and renaming
 * folders, files, boards or anything else with a name. Rejects empty and
 * over-long names, characters file systems refuse, and names already taken
 * in the same place.
 */
export function NameDialog({ open, onOpenChange, ...props }: NameDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {open && <NameForm {...props} onClose={() => onOpenChange(false)} />}
    </Dialog>
  );
}

function NameForm({
  title,
  description,
  label = "Name",
  initialValue = "",
  selectStem = false,
  submitLabel,
  onSubmit,
  icon,
  tone = "accent",
  takenNames,
  maxLength = 80,
  noun,
  onClose,
}: Omit<NameDialogProps, "open" | "onOpenChange"> & { onClose: () => void }) {
  const [value, setValue] = useState(initialValue);
  const [touched, setTouched] = useState(false);
  const [busy, setBusy] = useState(false);
  const error = validateName(value, { takenNames, maxLength, noun });
  const unchanged = initialValue !== "" && value.trim() === initialValue;
  // Empty is only an error once they try to save; other problems show as they type.
  const shown = touched || (value.trim() !== "" && !unchanged) ? error : undefined;

  async function submit(event: FormEvent) {
    event.preventDefault();
    setTouched(true);
    if (unchanged) return onClose();
    if (error) return;
    setBusy(true);
    try {
      await onSubmit(value.trim());
      onClose();
    } catch {
      setBusy(false);
    }
  }

  return (
    <DialogContent
      size="sm"
      {...(description ? {} : { "aria-describedby": undefined })}
      onOpenAutoFocus={(event) => {
        event.preventDefault();
        const input = (event.currentTarget as HTMLElement).querySelector("input");
        if (!input) return;
        input.focus();
        const dot = input.value.lastIndexOf(".");
        input.setSelectionRange(0, selectStem && dot > 0 ? dot : input.value.length);
      }}
    >
      <DialogHeader tone={tone} icon={icon ?? <PencilIcon />}>
        <DialogTitle>{title}</DialogTitle>
        {description && <DialogDescription>{description}</DialogDescription>}
      </DialogHeader>
      <form noValidate onSubmit={submit} className="contents">
        <DialogBody>
          <Input
            label={label}
            value={value}
            autoComplete="off"
            spellCheck={false}
            error={shown}
            onChange={(e) => setValue(e.target.value)}
          />
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="ghost" disabled={busy}>
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" variant="accent" loading={busy}>
            {submitLabel}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}

function PencilIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 20h4L19 9l-4-4L4 16zM13.5 6.5l4 4" />
    </svg>
  );
}
