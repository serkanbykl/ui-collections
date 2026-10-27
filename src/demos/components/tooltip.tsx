"use client";

import { Button } from "@/registry/kit/ui/button";
import { SimpleTooltip, TooltipProvider } from "@/registry/kit/ui/tooltip";

const actions = [
  { label: "Redeploy", path: "M4 12a8 8 0 0 1 13.7-5.6M20 12a8 8 0 0 1-13.7 5.6M18 3v4h-4M6 21v-4h4" },
  { label: "Copy link", path: "M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" },
  { label: "Delete", path: "M5 7h14M10 7V5h4v2M7 7l1 12h8l1-12" },
];

export default function TooltipDemo() {
  return (
    <TooltipProvider>
      <div className="surface flex gap-1 rounded-control p-1.5">
        {actions.map((a) => (
          <SimpleTooltip key={a.label} content={a.label}>
            <Button variant="ghost" size="icon" aria-label={a.label}>
              <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d={a.path} />
              </svg>
            </Button>
          </SimpleTooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}
