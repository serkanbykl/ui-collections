"use client";

import { useState } from "react";

import { cn } from "@/registry/kit/lib/utils";
import { Button } from "@/registry/kit/ui/button";
import { toast, Toaster, type ToastPosition } from "@/registry/kit/ui/toast";

const deploy = () => new Promise((resolve) => setTimeout(resolve, 1800));

const positions: ToastPosition[][] = [
  ["top-left", "top-center", "top-right"],
  ["bottom-left", "bottom-center", "bottom-right"],
];

export default function ToastDemo() {
  const [position, setPosition] = useState<ToastPosition>("bottom-center");
  return (
    <div className="grid justify-items-center gap-6">
      <Toaster position={position} />
      <div className="flex flex-wrap justify-center gap-3">
        <Button onClick={() => toast("Link copied", { description: "Anyone with the link can view this preview." })}>Copy preview link</Button>
        <Button onClick={() => toast.success("Environment variable saved")}>Save variable</Button>
        <Button
          onClick={() =>
            toast("Deployment deleted", {
              action: { label: "Undo", onClick: () => toast.success("Deployment restored") },
            })
          }
        >
          Delete deployment
        </Button>
        <Button
          variant="solid"
          onClick={() => toast.promise(deploy, { loading: "Deploying…", success: "Live on production", error: "Deploy failed" })}
        >
          Deploy to production
        </Button>
      </div>
      <div className="grid gap-2 text-center">
        <p id="toast-position" className="text-xs text-muted">
          Position
        </p>
        <div role="radiogroup" aria-labelledby="toast-position" className="surface grid grid-cols-3 gap-1 rounded-field p-1">
          {positions.flat().map((p) => (
            <button
              key={p}
              type="button"
              role="radio"
              aria-checked={position === p}
              onClick={() => {
                setPosition(p);
                toast(`Toasts now appear ${p.replace("-", " ")}`);
              }}
              className={cn(
                "h-8 cursor-pointer rounded-[max(0.125rem,calc(var(--r-field)-0.25rem))] px-3 text-xs capitalize transition-colors focus-visible:outline-2 focus-visible:outline-accent",
                position === p ? "bg-fg/10 font-medium text-fg" : "text-muted hover:text-fg",
              )}
            >
              {p.replace("-", " ")}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
