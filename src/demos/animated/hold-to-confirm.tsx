"use client";

import { useState } from "react";

import { HoldToConfirm } from "@/registry/kit/ui/hold-to-confirm";

export default function HoldToConfirmDemo() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex flex-col items-center gap-5 text-center">
      <HoldToConfirm onConfirm={() => setCount((n) => n + 1)} confirmedLabel="Project deleted">
        Hold to delete project
      </HoldToConfirm>
      <p className="text-sm text-muted">
        Press and hold, or hold Space. Confirmed {count} {count === 1 ? "time" : "times"}.
      </p>
    </div>
  );
}
