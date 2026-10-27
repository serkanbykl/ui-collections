"use client";

import { useState } from "react";

import { Button } from "@/registry/kit/ui/button";
import { Spinner } from "@/registry/kit/ui/spinner";

export default function SpinnerDemo() {
  const [saving, setSaving] = useState(false);

  function save() {
    setSaving(true);
    setTimeout(() => setSaving(false), 1800);
  }

  return (
    <div className="flex flex-col items-center gap-10">
      <div className="flex items-center gap-6 text-muted">
        <Spinner size="sm" />
        <Spinner />
        <Spinner size="lg" className="text-accent" />
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button variant="accent" loading={saving} onClick={save}>
          {saving ? "Saving…" : "Save changes"}
        </Button>
        <Button loading>Deploying</Button>
      </div>
    </div>
  );
}
