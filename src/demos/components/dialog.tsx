"use client";

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
import { Input } from "@/registry/kit/ui/field";

export default function DialogDemo() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="lg">Rename project</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename project</DialogTitle>
          <DialogDescription>The new name appears in URLs and on every deploy.</DialogDescription>
        </DialogHeader>
        <DialogBody>
          <Input label="Project name" defaultValue="marketing-site" />
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant="solid">Save</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
