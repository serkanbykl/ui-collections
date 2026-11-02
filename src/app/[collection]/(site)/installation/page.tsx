import type { Metadata } from "next";
import { collection } from "next/root-params";

import { listedCatalog } from "@/catalog";
import { getCollection } from "@/collections";
import { CodeBlock, CommandLine } from "@/components/site/code-block";
import { ComponentGrid } from "@/components/site/component-grid";
import { fontSetup, installCommand, registryConfig, themeImports } from "@/lib/site";

export const metadata: Metadata = {
  title: "Installation",
  description: "Add components to a React project with the shadcn CLI.",
};

export default async function InstallationPage() {
  const c = getCollection(await collection());

  const steps = [
    {
      title: "Start from a Tailwind CSS v4 project",
      body: "Any React framework works. If shadcn isn't set up yet, initialise it once.",
      code: <CommandLine command="npx shadcn@latest init" />,
    },
    {
      title: "Register the collection",
      body: `Add the ${c.name} registry to components.json once, so every piece is one short name away.`,
      code: <CodeBlock code={registryConfig(c.id)} lang="json" title="components.json" />,
    },
    {
      title: "Add a component",
      body: "The theme, the cn() helper, hooks and npm packages it needs come along automatically. The full URL works too, without step 2.",
      code: (
        <div className="grid gap-3">
          <CommandLine command={`npx shadcn@latest add @${c.id}/button`} />
          <CommandLine command={installCommand(c.id, "button")} />
        </div>
      ),
    },
    {
      title: "Import the theme once",
      body: `Right after Tailwind in your global stylesheet: the shared base, then the ${c.name} theme.`,
      code: <CodeBlock code={themeImports(c.id)} lang="css" title="globals.css" />,
    },
    {
      title: "Set the theme and its fonts",
      body: `Put data-theme="${c.id}" on <html> and load the faces the theme expects.`,
      code: <CodeBlock code={fontSetup[c.id] ?? ""} lang="tsx" title="app/layout.tsx" />,
    },
  ];

  return (
    <article>
      <header className="max-w-2xl">
        <h1 className="font-display text-5xl leading-none md:text-6xl">Installation</h1>
        <p className="mt-5 text-lg leading-relaxed text-muted">
          {c.name} isn&apos;t a package. Each component is copied into your project as source, so you can change
          anything.
        </p>
      </header>

      <ol className="mt-12 grid gap-10">
        {steps.map((step, i) => (
          <li key={step.title} className="grid gap-4 md:grid-cols-[3rem_minmax(0,1fr)]">
            <span className="font-display text-3xl text-accent tabular-nums">{String(i + 1).padStart(2, "0")}</span>
            <div className="min-w-0">
              <h2 className="font-display text-3xl">{step.title}</h2>
              <p className="mt-2 mb-5 text-muted">{step.body}</p>
              {step.code}
            </div>
          </li>
        ))}
      </ol>

      <section className="mt-20 max-w-2xl">
        <h2 className="font-display text-4xl">Find pieces from your project</h2>
        <p className="mt-3 mb-6 text-muted">
          With the collection registered, search and preview the registry without leaving the terminal. Pieces you add
          later share the theme and the components already installed.
        </p>
        <div className="grid gap-3">
          <CommandLine command={`npx shadcn@latest search @${c.id} -q chart`} />
          <CommandLine command={`npx shadcn@latest view @${c.id}/date-range-picker`} />
        </div>
        <p className="mt-6 mb-4 text-muted">
          Working with an AI coding agent? The shadcn MCP server lets it browse the {c.name} registry and install what a
          screen needs, instead of writing its own version.
        </p>
        <CommandLine command="npx shadcn@latest mcp init --client claude" />
      </section>

      <h2 className="mt-20 mb-6 font-display text-4xl">Browse everything</h2>
      <ComponentGrid entries={listedCatalog} />
    </article>
  );
}
