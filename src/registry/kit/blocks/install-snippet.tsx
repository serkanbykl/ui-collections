"use client";

import { AppWindow } from "@/registry/kit/ui/app-window";
import { CopyButton } from "@/registry/kit/ui/copy-button";
import { TextReveal } from "@/registry/kit/ui/reveal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/kit/ui/tabs";

export interface InstallStep {
  title: string;
  body: string;
}

export interface InstallSnippetTab {
  /** Tab label, e.g. "HTML" or "Next.js". */
  label: string;
  /** File name shown in the window title bar. */
  file?: string;
  code: string;
}

export interface InstallSnippetProps {
  eyebrow?: string;
  title?: string;
  description?: string;
  /** Two to four short steps; three reads best. */
  steps?: InstallStep[];
  /** One tab per install method. */
  snippets?: InstallSnippetTab[];
  /** Small print under the code, e.g. script size. */
  note?: string;
  /** Link under the steps, e.g. to the docs. */
  action?: { label: string; href: string };
}

const defaultSteps: InstallStep[] = [
  { title: "Install the package", body: "One dependency, 3.1 kB gzipped, no peer dependencies." },
  { title: "Wrap your app", body: "Add the provider once at the root. It reads your key from the environment." },
  { title: "Ship and watch", body: "Events show up on your dashboard within seconds of the next deploy." },
];

const defaultSnippets: InstallSnippetTab[] = [
  { label: "npm", file: "terminal", code: "npm install @brightline/trace" },
  {
    label: "React",
    file: "app/layout.tsx",
    code: `import { Trace } from "@brightline/trace/react";

export default function Layout({ children }) {
  return <Trace project="web-shop">{children}</Trace>;
}`,
  },
  { label: "Script tag", file: "index.html", code: `<script defer src="https://cdn.brightline.example/t.js"\n  data-project="web-shop"></script>` },
];

/**
 * How it works as numbered steps beside a tabbed code window with a copy
 * button: the shortest path from reading to installing.
 */
export function InstallSnippet({
  eyebrow = "How it works",
  title = "Live before your coffee cools.",
  description = "Three steps, no config files and nobody from IT.",
  steps = defaultSteps,
  snippets = defaultSnippets,
  note,
  action,
}: InstallSnippetProps) {
  return (
    <section className="bg-bg px-4 py-16 text-fg sm:px-6 md:px-8 md:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-16">
        <div>
          {eyebrow && <p className="text-sm font-medium text-accent">{eyebrow}</p>}
          <TextReveal as="h2" trigger="view" className="mt-3 font-display text-3xl leading-[1.08] md:text-5xl">
            {title}
          </TextReveal>
          {description && <p className="mt-4 text-muted md:text-lg">{description}</p>}
          <ol className="mt-8 grid gap-5">
            {steps.map((step, i) => (
              <li key={step.title} className="grid grid-cols-[2rem_minmax(0,1fr)] gap-x-4">
                <span
                  aria-hidden
                  className="grid size-8 place-items-center rounded-full border border-line-strong text-sm font-medium text-accent tabular-nums"
                >
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-medium">
                    <span className="sr-only">Step {i + 1}: </span>
                    {step.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
          {action && (
            <a href={action.href} className="mt-8 inline-block text-sm font-medium text-accent underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-accent">
              {action.label} →
            </a>
          )}
        </div>

        <div className="min-w-0">
          <Tabs defaultValue={snippets[0]?.label}>
            <TabsList aria-label="Install method" className="max-w-full overflow-x-auto">
              {snippets.map((s) => (
                <TabsTrigger key={s.label} value={s.label}>
                  {s.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {snippets.map((s) => (
              <TabsContent key={s.label} value={s.label} className="mt-3">
                <AppWindow title={s.file} actions={<CopyButton value={s.code} label="Copy" variant="ghost" />}>
                  <pre className="overflow-x-auto p-5 font-mono text-[13px] leading-relaxed text-fg/90">
                    <code>
                      {s.code.split("\n").map((line, i) => (
                        <span key={i} className="grid grid-cols-[1.5rem_auto]">
                          <span aria-hidden className="select-none text-subtle tabular-nums">
                            {i + 1}
                          </span>
                          <span>{line || " "}</span>
                        </span>
                      ))}
                    </code>
                  </pre>
                </AppWindow>
              </TabsContent>
            ))}
          </Tabs>
          {note && <p className="mt-3 text-sm text-muted">{note}</p>}
        </div>
      </div>
    </section>
  );
}
