"use client";

import { useMemo, useState, type ReactNode } from "react";

import { cn } from "@/registry/kit/lib/utils";
import { Button } from "@/registry/kit/ui/button";
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@/registry/kit/ui/command";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/registry/kit/ui/dialog";

export interface FolderNode {
  id: string;
  name: string;
  /** Parent folder id; null at the root. */
  parent: string | null;
}

export interface FolderPickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Every folder that could be a destination. */
  folders: FolderNode[];
  /** Name of the root, offered as a destination unless it is the current parent. */
  rootLabel?: string;
  /** Folders being moved: left out together with everything inside them. */
  exclude?: string[];
  /** Where the items are now (null for the root); left out, since moving there changes nothing. */
  currentFolder?: string | null;
  /** "Move 3 items". */
  title?: ReactNode;
  description?: ReactNode;
  /** Button label for the chosen folder: "Move to “Q3”". */
  confirmLabel?: (folderName: string) => string;
  /** Receives the chosen folder id, or null for the root. */
  onSelect: (folderId: string | null) => void;
}

const ROOT = "__root__";

/**
 * Pick a destination folder by searching its full path ("All files / Reports / Q3").
 * Arrow keys move through the list, Enter picks, and a second Enter or the
 * button confirms. The folders being moved, everything inside them and their
 * current location are never offered.
 */
export function FolderPickerDialog({ open, onOpenChange, ...props }: FolderPickerDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {open && <Picker {...props} onClose={() => onOpenChange(false)} />}
    </Dialog>
  );
}

function Picker({
  folders,
  rootLabel = "All files",
  exclude = [],
  currentFolder,
  title = "Move to folder",
  description = "Search by folder name or path, then pick where it goes.",
  confirmLabel = (name) => `Move to “${name}”`,
  onSelect,
  onClose,
}: Omit<FolderPickerDialogProps, "open" | "onOpenChange"> & { onClose: () => void }) {
  const [picked, setPicked] = useState<string | null>(null);

  const options = useMemo(() => {
    const byId = new Map(folders.map((f) => [f.id, f]));
    const blocked = new Set(exclude);
    const inside = (f: FolderNode) => {
      for (let id: string | null = f.id; id; id = byId.get(id)?.parent ?? null) if (blocked.has(id)) return true;
      return false;
    };
    const pathOf = (f: FolderNode) => {
      const names: string[] = [];
      for (let id: string | null = f.id; id; id = byId.get(id)?.parent ?? null) names.unshift(byId.get(id)?.name ?? "");
      return [rootLabel, ...names];
    };
    const list = folders
      .filter((f) => !inside(f) && f.id !== currentFolder)
      .map((f) => ({ id: f.id, name: f.name, path: pathOf(f) }))
      .sort((a, b) => a.path.join("/").localeCompare(b.path.join("/")));
    return currentFolder === null ? list : [{ id: ROOT, name: rootLabel, path: [rootLabel] }, ...list];
  }, [folders, exclude, currentFolder, rootLabel]);

  const chosen = options.find((o) => o.id === picked);
  const confirm = (id = picked) => {
    if (id === null) return;
    onSelect(id === ROOT ? null : id);
    onClose();
  };

  return (
    <DialogContent size="md">
      <DialogHeader
        tone="accent"
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM12 10v6M9 13l3 3 3-3" />
          </svg>
        }
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <div className="min-h-0 px-6 md:px-7">
        <Command loop className="surface-field overflow-hidden rounded-field">
          <CommandInput placeholder="Search folders…" aria-label="Search folders" className="h-12 text-sm" />
          <CommandList className="max-h-[min(18rem,42dvh)] p-1.5">
            <CommandEmpty className="py-8">No folders match. Try part of the name.</CommandEmpty>
            {options.map((o) => {
              const selected = o.id === picked;
              return (
                <CommandItem
                  key={o.id}
                  value={`${o.path.join(" / ")} ${o.id}`}
                  onSelect={() => (selected ? confirm(o.id) : setPicked(o.id))}
                  onDoubleClick={() => confirm(o.id)}
                  className={cn("cursor-pointer", selected && "bg-surface-selected text-fg")}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden className={cn(selected && "text-accent!")}>
                    <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  </svg>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium">
                      {o.name}
                      {selected && <span className="sr-only"> (chosen)</span>}
                    </span>
                    {o.path.length > 1 && <span className="block truncate text-xs text-muted">{o.path.slice(0, -1).join(" / ")}</span>}
                  </span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden className={cn("text-accent!", !selected && "invisible")}>
                    <path d="M5 12.5l4.5 4.5L19 7.5" />
                  </svg>
                </CommandItem>
              );
            })}
          </CommandList>
        </Command>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="ghost">Cancel</Button>
        </DialogClose>
        <Button variant="accent" disabled={!chosen} onClick={() => confirm()} className="max-w-full">
          <span className="truncate">{chosen ? confirmLabel(chosen.name) : "Choose a folder"}</span>
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
