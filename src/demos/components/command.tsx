"use client";

import { useCallback, useState } from "react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
  useCommandShortcut,
} from "@/registry/kit/ui/command";
import { Button } from "@/registry/kit/ui/button";
import { KbdGroup } from "@/registry/kit/ui/kbd";

const icon = (d: string) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d={d} />
  </svg>
);

const groups = [
  {
    heading: "Projects",
    items: [
      { label: "marketing-site", icon: "M4 6h16v12H4zM4 10h16" },
      { label: "dashboard", icon: "M4 4h7v7H4zM13 4h7v4h-7zM13 10h7v10h-7zM4 13h7v7H4z" },
      { label: "docs", icon: "M6 4h9l3 3v13H6zM9 12h6M9 16h6" },
    ],
  },
  {
    heading: "Actions",
    items: [
      { label: "New deployment", icon: "M12 5v14M5 12h14", shortcut: "⌘N" },
      { label: "Invite teammate", icon: "M16 19a4 4 0 0 0-8 0M12 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6M19 8v6M22 11h-6", shortcut: "⌘I" },
      { label: "Open settings", icon: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6M4 12h2M18 12h2M12 4v2M12 18v2", shortcut: "⌘," },
    ],
  },
];

export default function CommandDemo() {
  const [open, setOpen] = useState(false);
  const toggle = useCallback(() => setOpen((v) => !v), []);
  useCommandShortcut(toggle);

  return (
    <>
      <Button onClick={toggle} className="gap-3 pr-2.5">
        Search or jump to…
        <KbdGroup keys={["⌘", "K"]} />
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search projects and actions…" />
        <CommandList>
          <CommandEmpty>Nothing matches that.</CommandEmpty>
          {groups.map((group, i) => (
            <div key={group.heading}>
              {i > 0 && <CommandSeparator />}
              <CommandGroup heading={group.heading}>
                {group.items.map((item) => (
                  <CommandItem key={item.label} onSelect={() => setOpen(false)}>
                    {icon(item.icon)}
                    {item.label}
                    {"shortcut" in item && <CommandShortcut>{item.shortcut}</CommandShortcut>}
                  </CommandItem>
                ))}
              </CommandGroup>
            </div>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
}
