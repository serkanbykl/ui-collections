"use client";

import { useState } from "react";

import { Button } from "@/registry/kit/ui/button";
import { FolderPickerDialog, type FolderNode } from "@/registry/kit/ui/folder-picker-dialog";

const folders: FolderNode[] = [
  { id: "reports", name: "Reports", parent: null },
  { id: "q3", name: "Q3", parent: "reports" },
  { id: "q4", name: "Q4 planning", parent: "reports" },
  { id: "brand", name: "Brand assets", parent: null },
  { id: "campaigns", name: "Campaigns", parent: "brand" },
  { id: "spring", name: "Spring launch", parent: "campaigns" },
  { id: "exports", name: "Exports", parent: null },
];

export default function FolderPickerDialogDemo() {
  const [open, setOpen] = useState(false);
  const [location, setLocation] = useState<string | null>("q3");
  const path = (id: string | null): string => {
    const f = folders.find((x) => x.id === id);
    return f ? `${path(f.parent)} / ${f.name}` : "All files";
  };

  return (
    <div className="grid w-full max-w-sm gap-3">
      <div className="surface rounded-card px-4 py-3 text-sm">
        <p className="font-medium">Retention review Q3.pdf</p>
        <p className="text-xs text-muted">{path(location)}</p>
      </div>
      <Button size="sm" variant="accent" className="justify-self-start" onClick={() => setOpen(true)}>
        Move to folder
      </Button>
      <FolderPickerDialog
        open={open}
        onOpenChange={setOpen}
        folders={folders}
        currentFolder={location}
        title="Move “Retention review Q3.pdf”"
        onSelect={setLocation}
      />
    </div>
  );
}
