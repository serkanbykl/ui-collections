"use client";

import { Button } from "@/registry/kit/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/registry/kit/ui/sheet";
import { Switch } from "@/registry/kit/ui/switch";

const settings = [
  { id: "previews", label: "Preview deployments", on: true },
  { id: "comments", label: "Comments on previews", on: true },
  { id: "analytics", label: "Web analytics", on: false },
];

export default function SheetDemo() {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {(["right", "bottom"] as const).map((side) => (
        <Sheet key={side}>
          <SheetTrigger asChild>
            <Button>Open {side} sheet</Button>
          </SheetTrigger>
          <SheetContent side={side}>
            <SheetHeader>
              <SheetTitle>Project settings</SheetTitle>
              <SheetDescription>Changes apply to the next deploy.</SheetDescription>
            </SheetHeader>
            <ul className="grid gap-1">
              {settings.map((s) => (
                <li key={s.id} className="flex items-center justify-between rounded-field px-1 py-3">
                  <label htmlFor={`${side}-${s.id}`} className="text-sm">
                    {s.label}
                  </label>
                  <Switch id={`${side}-${s.id}`} defaultChecked={s.on} />
                </li>
              ))}
            </ul>
            <SheetFooter>
              <SheetClose asChild>
                <Button variant="solid">Done</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      ))}
    </div>
  );
}
