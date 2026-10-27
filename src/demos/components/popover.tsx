"use client";

import { Button } from "@/registry/kit/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/registry/kit/ui/popover";
import { Slider } from "@/registry/kit/ui/slider";

export default function PopoverDemo() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button>Resources</Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="font-medium">Function resources</div>
        <p className="mt-1 text-muted">Applies to every serverless function.</p>
        <div className="mt-5 grid gap-5">
          <label className="grid gap-3">
            <span className="flex justify-between text-xs text-muted">
              Memory <span className="text-fg">1024 MB</span>
            </span>
            <Slider defaultValue={[40]} aria-label="Memory" />
          </label>
          <label className="grid gap-3">
            <span className="flex justify-between text-xs text-muted">
              Timeout <span className="text-fg">30 s</span>
            </span>
            <Slider defaultValue={[25]} aria-label="Timeout" />
          </label>
        </div>
      </PopoverContent>
    </Popover>
  );
}
