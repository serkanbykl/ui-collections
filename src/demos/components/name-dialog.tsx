"use client";

import { useState } from "react";

import { Button } from "@/registry/kit/ui/button";
import { NameDialog } from "@/registry/kit/ui/name-dialog";

export default function NameDialogDemo() {
  const [folders, setFolders] = useState(["Reports", "Brand assets", "Exports"]);
  const [mode, setMode] = useState<"create" | "rename" | null>(null);
  const renaming = folders[0]!;

  return (
    <div className="grid w-full max-w-sm gap-3">
      <ul className="surface divide-y divide-line rounded-card text-sm">
        {folders.map((f) => (
          <li key={f} className="px-4 py-2.5">
            {f}
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="accent" onClick={() => setMode("create")}>
          New folder
        </Button>
        <Button size="sm" onClick={() => setMode("rename")}>
          Rename “{renaming}”
        </Button>
      </div>
      <NameDialog
        open={mode !== null}
        onOpenChange={(open) => !open && setMode(null)}
        title={mode === "create" ? "New folder" : "Rename folder"}
        description={mode === "create" ? "Creates a folder in All files." : "In All files."}
        label="Folder name"
        noun="folder"
        initialValue={mode === "create" ? "Untitled folder" : renaming}
        takenNames={mode === "create" ? folders : folders.filter((f) => f !== renaming)}
        submitLabel={mode === "create" ? "Create folder" : "Rename folder"}
        onSubmit={(name) => setFolders((all) => (mode === "create" ? [...all, name] : all.map((f) => (f === renaming ? name : f))))}
      />
    </div>
  );
}
