"use client";

import { useState } from "react";

import { cn } from "@/registry/kit/lib/utils";
import { SettingsLayout, type SettingsLink } from "@/registry/kit/screens/settings-layout";
import { Badge } from "@/registry/kit/ui/badge";
import { Button } from "@/registry/kit/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/registry/kit/ui/dialog";
import { SearchInput } from "@/registry/kit/ui/search-input";
import { SegmentedControl } from "@/registry/kit/ui/segmented-control";
import { EmptyState } from "@/registry/kit/ui/states";
import { toast } from "@/registry/kit/ui/toast";

export interface Integration {
  id: string;
  name: string;
  category: "Communication" | "Development" | "Files" | "Automation" | "Sales";
  description: string;
  /** Tile colour behind the initials. */
  tint: string;
  /** Account it's connected as; `null` when not connected. */
  account: string | null;
  connectedOn?: string;
}

export const sampleIntegrations: Integration[] = [
  { id: "slack", name: "Slack", category: "Communication", description: "Post project updates and approvals to channels.", tint: "bg-[#4a154b] text-white", account: "#northwind-product", connectedOn: "Feb 11, 2026" },
  { id: "github", name: "GitHub", category: "Development", description: "Link pull requests to tasks and close them on merge.", tint: "bg-[#24292f] text-white", account: "northwind-io", connectedOn: "Mar 2, 2026" },
  { id: "gdrive", name: "Google Drive", category: "Files", description: "Attach Docs and Sheets with live previews.", tint: "bg-[#1a73e8] text-white", account: null },
  { id: "figma", name: "Figma", category: "Files", description: "Embed frames that stay in sync with the file.", tint: "bg-[#a259ff] text-white", account: "Priya Raman", connectedOn: "Aug 30, 2026" },
  { id: "linear", name: "Linear", category: "Development", description: "Mirror issues and their status both ways.", tint: "bg-[#5e6ad2] text-white", account: null },
  { id: "notion", name: "Notion", category: "Files", description: "Import pages as project briefs.", tint: "bg-[#191919] text-white", account: null },
  { id: "zapier", name: "Zapier", category: "Automation", description: "Trigger 6,000 apps from Lumen events.", tint: "bg-[#ff4f00] text-white", account: null },
  { id: "hubspot", name: "HubSpot", category: "Sales", description: "Create projects when a deal reaches closed won.", tint: "bg-[#ff7a59] text-white", account: null },
  { id: "teams", name: "Microsoft Teams", category: "Communication", description: "Get mentions and reminders in Teams chats.", tint: "bg-[#4b53bc] text-white", account: null },
];

export interface SettingsConnectionsScreenProps {
  integrations?: Integration[];
  links?: SettingsLink[];
  onConnect?: (id: string) => void;
  onDisconnect?: (id: string) => void;
  className?: string;
}

/** Integration cards with connect (with a pending state) and disconnect (with confirmation), filtered by status and search. */
export function SettingsConnectionsScreen({
  integrations = sampleIntegrations,
  links,
  onConnect,
  onDisconnect,
  className,
}: SettingsConnectionsScreenProps) {
  const [items, setItems] = useState(integrations);
  const [filter, setFilter] = useState<"all" | "connected" | "available">("all");
  const [query, setQuery] = useState("");
  const [connecting, setConnecting] = useState<string | null>(null);
  const [disconnecting, setDisconnecting] = useState<Integration | null>(null);

  const connectedCount = items.filter((i) => i.account).length;
  const visible = items.filter(
    (i) =>
      (filter === "all" || (filter === "connected" ? i.account : !i.account)) &&
      `${i.name} ${i.category} ${i.description}`.toLowerCase().includes(query.trim().toLowerCase()),
  );

  function connect(item: Integration) {
    setConnecting(item.id);
    setTimeout(() => {
      setItems((list) => list.map((i) => (i.id === item.id ? { ...i, account: "Northwind workspace", connectedOn: "Today" } : i)));
      setConnecting(null);
      toast.success(`${item.name} is connected.`);
      onConnect?.(item.id);
    }, 900);
  }

  return (
    <SettingsLayout
      active="connections"
      title="Connections"
      description={`${connectedCount} of ${items.length} apps connected · each can read from or post to this workspace`}
      links={links}
      className={className}
    >
      <div className="flex flex-wrap items-center gap-3">
        <div className="-mx-1 max-w-full overflow-x-auto px-1 py-0.5">
          <SegmentedControl
            aria-label="Show"
            value={filter}
            onValueChange={setFilter}
            options={[
              { value: "all", label: `All ${items.length}` },
              { value: "connected", label: `Connected ${connectedCount}` },
              { value: "available", label: "Available" },
            ]}
          />
        </div>
        <SearchInput label="Search integrations" value={query} onValueChange={setQuery} className="min-w-0 flex-1 basis-56 sm:ml-auto sm:max-w-64" />
      </div>


      {visible.length ? (
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {visible.map((item) => (
            <li key={item.id} className="surface flex flex-col gap-4 rounded-card p-5">
              <div className="flex items-start gap-3">
                <span aria-hidden className={cn("grid size-11 shrink-0 place-items-center rounded-field text-sm font-bold", item.tint)}>
                  {item.name
                    .split(" ")
                    .map((w) => w[0])
                    .join("")
                    .slice(0, 2)}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="flex flex-wrap items-center gap-2 font-semibold">
                    {item.name}
                    {item.account && (
                      <Badge dot variant="success">
                        Connected
                      </Badge>
                    )}
                  </h3>
                  <p className="text-xs text-muted">{item.category}</p>
                </div>
              </div>
              <p className="text-sm text-muted">{item.description}</p>
              <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
                <p className="min-w-0 truncate text-xs text-muted">
                  {item.account ? (
                    <>
                      As <span className="text-fg">{item.account}</span> · since {item.connectedOn}
                    </>
                  ) : (
                    "Not connected"
                  )}
                </p>
                {item.account ? (
                  <Button size="sm" variant="ghost" onClick={() => setDisconnecting(item)} aria-label={`Disconnect ${item.name}`}>
                    Disconnect
                  </Button>
                ) : (
                  <Button size="sm" variant="accent" loading={connecting === item.id} disabled={connecting !== null && connecting !== item.id} onClick={() => connect(item)} aria-label={`Connect ${item.name}`}>
                    Connect
                  </Button>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          title="No integrations match"
          description={filter === "connected" ? "Nothing connected matches that search." : "Try the app's name or what it does, like “issues”."}
          action={
            <Button
              size="sm"
              onClick={() => {
                setQuery("");
                setFilter("all");
              }}
            >
              Show all integrations
            </Button>
          }
        />
      )}

      <Dialog open={disconnecting !== null} onOpenChange={(open) => !open && setDisconnecting(null)}>
        <DialogContent size="sm">
          <DialogHeader tone="warning">
            <DialogTitle>Disconnect {disconnecting?.name}?</DialogTitle>
            <DialogDescription>
              Lumen stops syncing with {disconnecting?.account}. Links already posted stay where they are, and you can reconnect any time.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost">Stay connected</Button>
            </DialogClose>
            <Button
              variant="danger"
              onClick={() => {
                const target = disconnecting;
                if (!target) return;
                setItems((list) => list.map((i) => (i.id === target.id ? { ...i, account: null, connectedOn: undefined } : i)));
                toast.success(`${target.name} is disconnected.`);
                setDisconnecting(null);
                onDisconnect?.(target.id);
              }}
            >
              Disconnect
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SettingsLayout>
  );
}
