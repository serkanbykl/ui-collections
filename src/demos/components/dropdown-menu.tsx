"use client";

import { useState } from "react";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/registry/kit/ui/dropdown-menu";
import { Button } from "@/registry/kit/ui/button";

const icon = (d: string) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d={d} />
  </svg>
);

export default function DropdownMenuDemo() {
  const [logs, setLogs] = useState(true);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>Deployment actions</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Production</DropdownMenuLabel>
        <DropdownMenuItem>
          {icon("M5 12h14M13 6l6 6-6 6")}
          Visit
          <DropdownMenuShortcut>⌘O</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          {icon("M4 12a8 8 0 0 1 13.7-5.6M18 3v4h-4")}
          Redeploy
          <DropdownMenuShortcut>⌘R</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          {icon("M12 5v14M5 12h14")}
          Promote to production
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem checked={logs} onCheckedChange={setLogs}>
          Stream logs
        </DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="danger">
          {icon("M5 7h14M10 7V5h4v2M7 7l1 12h8l1-12")}
          Delete deployment
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
