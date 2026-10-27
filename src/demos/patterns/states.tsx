"use client";

import { useState } from "react";

import { Button } from "@/registry/kit/ui/button";
import { EmptyState, ErrorState, LoadingState } from "@/registry/kit/ui/states";

export default function StatesDemo() {
  const [connect, setConnect] = useState<"idle" | "busy" | "done">("idle");
  const [usage, setUsage] = useState<"error" | "loading" | "ready">("error");

  function connectRepo() {
    setConnect("busy");
    setTimeout(() => setConnect("done"), 1400);
  }

  function retry() {
    setUsage("loading");
    setTimeout(() => setUsage("ready"), 1300);
  }

  return (
    <div className="grid w-full max-w-4xl gap-4 md:grid-cols-3">
      <div className="surface rounded-card">
        <EmptyState
          size="compact"
          title={connect === "done" ? "Waiting for the first push" : "No deployments yet"}
          description={
            connect === "done"
              ? "acme/web is connected. Push to main and the build appears here."
              : "Connect a repository and your first build shows up here."
          }
          action={
            connect !== "done" && (
              <Button size="sm" loading={connect === "busy"} onClick={connectRepo}>
                Connect a repository
              </Button>
            )
          }
        />
      </div>
      <div className="surface rounded-card">
        {usage === "error" && (
          <ErrorState
            size="compact"
            title="Couldn’t load usage"
            description="The metrics service timed out. Your data is safe."
            action={
              <Button size="sm" onClick={retry}>
                Try again
              </Button>
            }
          />
        )}
        {usage === "loading" && (
          <div className="p-6">
            <LoadingState variant="stat" label="Loading usage" />
          </div>
        )}
        {usage === "ready" && (
          <div className="grid gap-1 p-6">
            <p className="text-xs text-muted">Bandwidth this month</p>
            <p className="font-display text-3xl tabular-nums">18.4 GB</p>
            <button
              type="button"
              onClick={() => setUsage("error")}
              className="mt-2 justify-self-start rounded-control text-xs text-muted underline-offset-4 hover:text-fg hover:underline focus-visible:outline-2 focus-visible:outline-accent"
            >
              Show the error state again
            </button>
          </div>
        )}
      </div>
      <div className="surface rounded-card p-6">
        <LoadingState variant="list" rows={3} label="Loading members" />
      </div>
    </div>
  );
}
