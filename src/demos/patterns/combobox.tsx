"use client";

import { useState } from "react";

import { Combobox } from "@/registry/kit/ui/combobox";

const repositories = [
  { value: "web", label: "acme/web", description: "Next.js storefront" },
  { value: "api", label: "acme/api", description: "Public REST and GraphQL API" },
  { value: "worker", label: "acme/worker", description: "Background jobs and queues" },
  { value: "design", label: "acme/design-system", description: "Tokens and components" },
  { value: "infra", label: "acme/infra", description: "Terraform modules" },
  { value: "mobile", label: "acme/mobile", description: "iOS and Android app" },
  { value: "docs", label: "acme/docs", description: "Developer documentation" },
];

export default function ComboboxDemo() {
  const [repo, setRepo] = useState<string | undefined>("api");

  return (
    <div className="w-full max-w-xs">
      <p className="mb-2 px-1 text-xs text-muted">Repository</p>
      <Combobox
        label="Repository"
        options={repositories}
        value={repo}
        onValueChange={setRepo}
        placeholder="Choose a repository"
        searchPlaceholder="Search repositories"
      />
    </div>
  );
}
