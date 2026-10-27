"use client";

import { useState } from "react";

import { Breadcrumb } from "@/registry/kit/ui/breadcrumb";
import { Button } from "@/registry/kit/ui/button";
import { PageHeader } from "@/registry/kit/ui/page-header";

export default function PageHeaderDemo() {
  const [active, setActive] = useState(14);
  const [archived, setArchived] = useState(3);

  return (
    <div className="surface w-full max-w-3xl rounded-card p-5 md:p-6">
      <Breadcrumb items={[{ label: "Home", href: "#home" }, { label: "Workspace" }, { label: "Projects" }]} className="mb-5" />
      <PageHeader
        title="Projects"
        description={`${active} active · ${archived} archived · 4 due this week`}
        actions={
          <>
            <Button
              variant="surface"
              disabled={active === 0}
              onClick={() => {
                setActive((n) => n - 1);
                setArchived((n) => n + 1);
              }}
            >
              Archive oldest
            </Button>
            <Button variant="accent" onClick={() => setActive((n) => n + 1)}>
              Create project
            </Button>
          </>
        }
      />
    </div>
  );
}
