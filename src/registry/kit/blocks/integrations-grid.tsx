"use client";

import { useState } from "react";

import { Reveal, TextReveal } from "@/registry/kit/ui/reveal";
import { SpotlightCard } from "@/registry/kit/ui/spotlight-card";
import { Badge } from "@/registry/kit/ui/badge";
import { Button } from "@/registry/kit/ui/button";

export interface Integration {
  name: string;
  category: string;
  description: string;
  /** Short monogram shown in place of a logo. */
  mark: string;
  connected?: boolean;
}

const defaultIntegrations: Integration[] = [
  { name: "Relay", category: "Chat", description: "Deploy notifications and approvals in your channels.", mark: "Re", connected: true },
  { name: "Ledgerly", category: "Billing", description: "Usage-based invoices synced every hour.", mark: "Le" },
  { name: "Tracewise", category: "Monitoring", description: "Traces and errors linked to the deploy that caused them.", mark: "Tw", connected: true },
  { name: "Inkpad", category: "Docs", description: "Release notes drafted from merged pull requests.", mark: "In" },
  { name: "Vaultkey", category: "Secrets", description: "Rotate credentials without redeploying.", mark: "Vk" },
  { name: "Pagebell", category: "On-call", description: "Page the right person when a deploy fails.", mark: "Pb" },
];

export function IntegrationsGrid({
  title = "Plays well with your stack.",
  integrations = defaultIntegrations,
  onConnect,
}: {
  title?: string;
  integrations?: Integration[];
  /**
   * Connects an integration, e.g. by starting its OAuth flow. Throw to show an
   * inline error. Without it the button simulates a short connection.
   */
  onConnect?: (name: string) => void | Promise<void>;
}) {
  const [connected, setConnected] = useState(() => new Set(integrations.filter((i) => i.connected).map((i) => i.name)));
  const [pending, setPending] = useState<string>();
  const [failed, setFailed] = useState<string>();

  async function connect(name: string) {
    setPending(name);
    setFailed(undefined);
    try {
      await (onConnect ? onConnect(name) : new Promise((resolve) => setTimeout(resolve, 900)));
      setConnected((prev) => new Set(prev).add(name));
    } catch {
      setFailed(name);
    } finally {
      setPending(undefined);
    }
  }

  return (
    <section className="bg-bg px-6 py-24 text-fg md:px-8">
      <div className="mx-auto max-w-7xl">
        <TextReveal as="h2" trigger="view" className="max-w-2xl font-display text-4xl md:text-6xl">
          {title}
        </TextReveal>
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {integrations.map((item, i) => (
            <Reveal as="li" key={item.name} delay={(i % 3) * 70} className="h-full">
              <SpotlightCard className="h-full p-6">
                <div className="flex items-start justify-between">
                  <span aria-hidden className="surface-raised grid size-12 place-items-center rounded-field font-display text-lg">
                    {item.mark}
                  </span>
                  {connected.has(item.name) ? (
                    <Badge variant="accent" dot>
                      Connected
                    </Badge>
                  ) : (
                    <Button
                      variant="surface"
                      size="sm"
                      loading={pending === item.name}
                      onClick={() => connect(item.name)}
                      className="h-8 px-3 text-xs"
                    >
                      {pending === item.name ? "Connecting…" : "Connect"}
                      <span className="sr-only"> {item.name}</span>
                    </Button>
                  )}
                </div>
                <h3 className="mt-6 text-lg font-medium">{item.name}</h3>
                <p className="text-xs tracking-[0.15em] text-muted uppercase">{item.category}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted">{item.description}</p>
                {failed === item.name && (
                  <p role="alert" className="mt-3 text-xs text-danger">
                    {item.name} didn&apos;t respond. Try again in a minute.
                  </p>
                )}
              </SpotlightCard>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
