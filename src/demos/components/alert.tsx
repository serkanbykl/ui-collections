"use client";

import { useState } from "react";

import { Alert } from "@/registry/kit/ui/alert";
import { Button } from "@/registry/kit/ui/button";

export default function AlertDemo() {
  const [logs, setLogs] = useState(false);

  return (
    <div className="grid w-full max-w-lg gap-3">
      <Alert title="A new runtime is available">Node 24 is now the default for new projects.</Alert>
      <Alert variant="success" title="Domain verified">app.acme.dev is pointing at this project.</Alert>
      <Alert variant="warning" title="Build cache almost full">You have used 4.6 GB of 5 GB.</Alert>
      <Alert
        variant="danger"
        title="Deploy failed"
        action={
          <Button size="sm" variant="ghost" aria-expanded={logs} onClick={() => setLogs((v) => !v)}>
            {logs ? "Hide logs" : "View logs"}
          </Button>
        }
      >
        Type error in src/app/page.tsx.
        {logs && (
          <pre className="mt-2 overflow-x-auto rounded-field bg-bg-deep/60 px-3 py-2 font-mono text-xs text-fg/80">
            {"src/app/page.tsx:42:7\nType 'string' is not assignable to type 'number'."}
          </pre>
        )}
      </Alert>
    </div>
  );
}
