"use client";

import { useState, type ReactNode } from "react";

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
  DialogTrigger,
} from "@/registry/kit/ui/dialog";
import { Input, Textarea } from "@/registry/kit/ui/field";

// Two-tone icons: a faint fill under a solid shape, tinted by the header tone.
const icon = (children: ReactNode) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    {children}
  </svg>
);

const icons = {
  folder: icon(
    <>
      <path opacity="0.4" d="M3 7a2 2 0 0 1 2-2h4.6l2 2H19a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />
      <path d="M11 11h2v2h2v2h-2v2h-2v-2H9v-2h2v-2Z" />
    </>,
  ),
  info: icon(
    <>
      <circle cx="12" cy="12" r="9.5" opacity="0.4" />
      <rect x="11" y="10.5" width="2" height="6.5" rx="1" />
      <circle cx="12" cy="7.75" r="1.25" />
    </>,
  ),
  warning: icon(
    <>
      <path opacity="0.4" d="M10.3 3.6a2 2 0 0 1 3.4 0l8 13.6A2 2 0 0 1 20 20.2H4a2 2 0 0 1-1.7-3l8-13.6Z" />
      <rect x="11" y="8.5" width="2" height="6" rx="1" />
      <circle cx="12" cy="17.2" r="1.2" />
    </>,
  ),
  trash: icon(
    <>
      <path opacity="0.4" d="M5.5 7h13l-1 12.2a2 2 0 0 1-2 1.8h-7a2 2 0 0 1-2-1.8L5.5 7Z" />
      <path d="M9 3.5h6l.8 1.5H20v2H4V5h4.2L9 3.5Z" />
    </>,
  ),
};

const timeline = [
  ["Queued", "12:04:11"],
  ["Installing dependencies", "12:04:13"],
  ["Building (Next.js 16, Turbopack)", "12:04:39"],
  ["Uploading 214 static files", "12:05:02"],
  ["Assigning domains", "12:05:06"],
  ["Ready on marketing-site.app", "12:05:07"],
];

export default function DialogTonesDemo() {
  const [confirm, setConfirm] = useState("");

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="accent">New project</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader icon={icons.folder} tone="accent">
            <DialogTitle>New project</DialogTitle>
            <DialogDescription>Import a repository or start from a template.</DialogDescription>
          </DialogHeader>
          <DialogBody className="grid gap-4">
            <Input label="Project name" defaultValue="marketing-site" />
            <Textarea label="Description" rows={3} hint="Optional, shown on the project card." />
          </DialogBody>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost">Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button variant="accent">Create project</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button>Deployment details</Button>
        </DialogTrigger>
        <DialogContent size="lg">
          <DialogHeader icon={icons.info} tone="info">
            <DialogTitle>Deployment #1284</DialogTitle>
            <DialogDescription>Production · main · 3f9c2e1, 56 seconds end to end.</DialogDescription>
          </DialogHeader>
          <DialogBody>
            <ol className="grid gap-1">
              {timeline.map(([step, time], i) => (
                <li key={step} className="flex items-center gap-3 rounded-field px-3 py-2.5 odd:bg-hover">
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-success/15 text-[11px] font-semibold text-success">
                    {i + 1}
                  </span>
                  <span className="flex-1 text-sm">{step}</span>
                  <span className="font-mono text-xs text-muted">{time}</span>
                </li>
              ))}
            </ol>
          </DialogBody>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost">Close</Button>
            </DialogClose>
            <Button>View logs</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost">Leave editor</Button>
        </DialogTrigger>
        <DialogContent size="sm">
          <DialogHeader icon={icons.warning} tone="warning">
            <DialogTitle>Unsaved changes</DialogTitle>
            <DialogDescription>You edited three fields. Leave without saving?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost">Keep editing</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button variant="solid">Leave</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog onOpenChange={() => setConfirm("")}>
        <DialogTrigger asChild>
          <Button variant="danger">Delete project</Button>
        </DialogTrigger>
        <DialogContent size="sm">
          <DialogHeader icon={icons.trash} tone="danger">
            <DialogTitle>Delete project?</DialogTitle>
            <DialogDescription>This removes marketing-site, its deployments and domains. It can&apos;t be undone.</DialogDescription>
          </DialogHeader>
          <DialogBody>
            <Input label="Type the project name" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
          </DialogBody>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost">Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button variant="danger" disabled={confirm !== "marketing-site"}>
                Delete
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
