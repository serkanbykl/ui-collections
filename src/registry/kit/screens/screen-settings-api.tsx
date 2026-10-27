"use client";

import { useId, useState } from "react";

import { cn } from "@/registry/kit/lib/utils";
import { SettingsLayout, SettingsSection, type SettingsLink } from "@/registry/kit/screens/settings-layout";
import { Alert } from "@/registry/kit/ui/alert";
import { Badge } from "@/registry/kit/ui/badge";
import { Button } from "@/registry/kit/ui/button";
import { Checkbox } from "@/registry/kit/ui/checkbox";
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/registry/kit/ui/dialog";
import { Input } from "@/registry/kit/ui/field";
import { SegmentedControl } from "@/registry/kit/ui/segmented-control";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/registry/kit/ui/select";
import { EmptyState } from "@/registry/kit/ui/states";
import { Switch } from "@/registry/kit/ui/switch";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/registry/kit/ui/table";
import { toast } from "@/registry/kit/ui/toast";

export interface ApiKey {
  id: string;
  name: string;
  /** First characters of the key; the rest is never shown again. */
  prefix: string;
  env: "live" | "test";
  scopes: string[];
  created: string;
  lastUsed: string;
}

export interface Webhook {
  id: string;
  url: string;
  events: string[];
  enabled: boolean;
  /** Share of deliveries that succeeded in the last 7 days. */
  successRate: number;
}

const scopes = [
  { id: "read", label: "Read", description: "Projects, people and reports" },
  { id: "write", label: "Write", description: "Create and update records" },
  { id: "billing", label: "Billing", description: "Invoices and usage" },
  { id: "admin", label: "Admin", description: "Members and roles" },
];

const webhookEvents = ["project.created", "project.updated", "member.invited", "member.removed", "invoice.paid", "invoice.failed"];

export const sampleApiKeys: ApiKey[] = [
  { id: "k1", name: "Production sync", prefix: "lum_live_4f9a", env: "live", scopes: ["read", "write"], created: "Mar 3, 2026", lastUsed: "4 min ago" },
  { id: "k2", name: "Looker dashboards", prefix: "lum_live_b21e", env: "live", scopes: ["read", "billing"], created: "Jun 18, 2026", lastUsed: "Yesterday" },
  { id: "k3", name: "Staging CI", prefix: "lum_test_7c0d", env: "test", scopes: ["read", "write", "admin"], created: "Sep 29, 2026", lastUsed: "Never" },
];

export const sampleWebhooks: Webhook[] = [
  { id: "w1", url: "https://hooks.northwind.io/lumen/projects", events: ["project.created", "project.updated"], enabled: true, successRate: 0.998 },
  { id: "w2", url: "https://billing.northwind.io/api/v2/events", events: ["invoice.paid", "invoice.failed"], enabled: true, successRate: 0.914 },
  { id: "w3", url: "https://staging-hooks.northwind.io/members", events: ["member.invited", "member.removed"], enabled: false, successRate: 1 },
];

function randomKey(env: "live" | "test") {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return `lum_${env}_${Array.from(bytes, (b) => chars[b % chars.length]).join("")}`;
}

export interface SettingsApiScreenProps {
  apiKeys?: ApiKey[];
  webhooks?: Webhook[];
  links?: SettingsLink[];
  className?: string;
}

/** API keys with a create dialog that shows the secret once, revoke with confirmation, and webhook endpoints. */
export function SettingsApiScreen({ apiKeys = sampleApiKeys, webhooks = sampleWebhooks, links, className }: SettingsApiScreenProps) {
  const [keys, setKeys] = useState(apiKeys);
  const [hooks, setHooks] = useState(webhooks);
  const [revoking, setRevoking] = useState<ApiKey | null>(null);

  return (
    <SettingsLayout
      active="api"
      title="API & webhooks"
      description={`${keys.length} API ${keys.length === 1 ? "key" : "keys"} for scripts and services · ${hooks.length} webhook ${hooks.length === 1 ? "endpoint" : "endpoints"} we call when things change`}
      links={links}
      className={className}
    >

      <SettingsSection
        title="API keys"
        description="Keys act as the workspace, not as you. Give each one only the scopes it needs."
        aside={
          <CreateKeyDialog
            onCreate={(key) => {
              setKeys((k) => [key, ...k]);
            }}
          />
        }
      >
        {keys.length ? (
          <Table frame={false}>
            <TableCaption className="sr-only">API keys</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Key</TableHead>
                <TableHead>Scopes</TableHead>
                <TableHead>Last used</TableHead>
                <TableHead className="relative w-24">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {keys.map((k) => (
                <TableRow key={k.id}>
                  <TableCell>
                    <div className="font-medium whitespace-nowrap">{k.name}</div>
                    <div className="text-xs whitespace-nowrap text-muted">Created {k.created}</div>
                  </TableCell>
                  <TableCell>
                    <span className="flex items-center gap-2 whitespace-nowrap">
                      <code className="font-mono text-xs">{k.prefix}••••</code>
                      <Badge variant={k.env === "live" ? "success" : "warning"}>{k.env === "live" ? "Live" : "Test"}</Badge>
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="flex flex-wrap gap-1">
                      {k.scopes.map((s) => (
                        <Badge key={s} variant="surface">
                          {scopes.find((x) => x.id === s)?.label ?? s}
                        </Badge>
                      ))}
                    </span>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-muted">{k.lastUsed}</TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="ghost" className="text-danger" onClick={() => setRevoking(k)} aria-label={`Revoke ${k.name}`}>
                      Revoke
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <EmptyState size="compact" title="No API keys" description="Create a key to call the API from scripts or other services." />
        )}
      </SettingsSection>

      <SettingsSection
        title="Webhooks"
        description="We send a signed POST to each endpoint and retry failures for 24 hours."
        aside={
          <AddWebhookDialog
            onAdd={(hook) => {
              setHooks((h) => [...h, hook]);
              toast.success(`Added ${hook.url}. Send a test event to check it.`);
            }}
          />
        }
      >
        <ul className="grid grid-cols-1 gap-3">
          {hooks.map((h) => (
            <li key={h.id} className="surface-field flex flex-wrap items-center gap-x-4 gap-y-3 rounded-field p-4">
              <div className="min-w-0 flex-1 basis-64">
                <p className="truncate font-mono text-sm">{h.url}</p>
                <p className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-muted">
                  {h.events.map((e) => (
                    <code key={e} className="rounded-[calc(var(--r-field)*0.4)] bg-fg/[0.06] px-1.5 py-0.5">
                      {e}
                    </code>
                  ))}
                  <span className={cn("ml-1", h.successRate < 0.95 && h.enabled ? "text-warning" : "")}>
                    {(h.successRate * 100).toFixed(1)}% delivered
                  </span>
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button size="sm" variant="ghost" disabled={!h.enabled} onClick={() => toast.success(`Sent a test event to ${h.url}. It answered 200 in 182 ms.`)}>
                  Send test
                </Button>
                <Switch
                  aria-label={`${h.enabled ? "Pause" : "Resume"} ${h.url}`}
                  checked={h.enabled}
                  onCheckedChange={(on) => setHooks((list) => list.map((x) => (x.id === h.id ? { ...x, enabled: on } : x)))}
                />
              </div>
            </li>
          ))}
        </ul>
      </SettingsSection>

      <Dialog open={revoking !== null} onOpenChange={(open) => !open && setRevoking(null)}>
        <DialogContent size="sm">
          <DialogHeader tone="danger">
            <DialogTitle>Revoke {revoking?.name}?</DialogTitle>
            <DialogDescription>
              Requests using <code className="font-mono">{revoking?.prefix}••••</code> fail straight away. This can&apos;t be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost">Keep key</Button>
            </DialogClose>
            <Button
              variant="danger"
              onClick={() => {
                setKeys((k) => k.filter((x) => x.id !== revoking?.id));
                toast.success(`Revoked ${revoking?.name}.`);
                setRevoking(null);
              }}
            >
              Revoke key
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SettingsLayout>
  );
}

function CreateKeyDialog({ onCreate }: { onCreate: (key: ApiKey) => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [env, setEnv] = useState<"live" | "test">("test");
  const [picked, setPicked] = useState<string[]>(["read"]);
  const [expiry, setExpiry] = useState("90");
  const [secret, setSecret] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [touched, setTouched] = useState(false);
  const expiryLabel = useId();

  const error = name.trim() ? (picked.length ? undefined : "Pick at least one scope.") : "Name the key after what uses it.";

  function reset() {
    setName("");
    setEnv("test");
    setPicked(["read"]);
    setExpiry("90");
    setSecret(null);
    setCopied(false);
    setTouched(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setTimeout(reset, 200);
      }}
    >
      <Button size="sm" variant="accent" onClick={() => setOpen(true)}>
        Create key
      </Button>
      <DialogContent>
        {secret ? (
          <>
            <DialogHeader tone="success">
              <DialogTitle>Copy your new key</DialogTitle>
              <DialogDescription>{name.trim()} is ready. Store it in your secrets manager.</DialogDescription>
            </DialogHeader>
            <DialogBody className="grid gap-4">
              <Alert variant="warning" title="You won't see this key again">
                If you lose it, revoke it and create a new one.
              </Alert>
              <div className="flex items-stretch gap-2">
                <code className="surface-field min-w-0 flex-1 rounded-field px-3 py-2.5 font-mono text-xs break-all select-all">{secret}</code>
                <Button
                  className="h-auto shrink-0"
                  onClick={() => {
                    navigator.clipboard?.writeText(secret).catch(() => {});
                    setCopied(true);
                    toast.success("API key copied");
                  }}
                >
                  {copied ? "Copied" : "Copy key"}
                </Button>
              </div>
              <span role="status" className="sr-only">
                {copied ? "Key copied to clipboard" : ""}
              </span>
            </DialogBody>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="accent">{copied ? "Done" : "I've stored it"}</Button>
              </DialogClose>
            </DialogFooter>
          </>
        ) : (
          <form
            noValidate
            className="contents"
            onSubmit={(e) => {
              e.preventDefault();
              setTouched(true);
              if (error) return;
              const value = randomKey(env);
              setSecret(value);
              onCreate({
                id: `k${Date.now()}`,
                name: name.trim(),
                prefix: value.slice(0, 13),
                env,
                scopes: picked,
                created: "Today",
                lastUsed: "Never",
              });
            }}
          >
            <DialogHeader>
              <DialogTitle>Create an API key</DialogTitle>
              <DialogDescription>Test keys only see sample data, so start there.</DialogDescription>
            </DialogHeader>
            <DialogBody className="grid gap-5">
              <Input
                label="Key name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={touched && !name.trim() ? error : undefined}
                hint="For example: Zapier, nightly export"
              />
              <div className="grid gap-1.5">
                <span className="px-1 text-xs text-muted">Environment</span>
                <SegmentedControl
                  aria-label="Environment"
                  className="justify-self-start"
                  value={env}
                  onValueChange={setEnv}
                  options={[
                    { value: "test", label: "Test" },
                    { value: "live", label: "Live" },
                  ]}
                />
              </div>
              <fieldset className="grid gap-2">
                <legend className="mb-2 px-1 text-xs text-muted">Scopes</legend>
                <div className="grid gap-2 sm:grid-cols-2">
                  {scopes.map((s) => (
                    <label key={s.id} className="flex cursor-pointer items-start gap-2.5 rounded-field p-2 text-sm hover:bg-surface-hover">
                      <Checkbox
                        className="mt-0.5"
                        checked={picked.includes(s.id)}
                        onCheckedChange={(v) => setPicked((cur) => (v === true ? [...cur, s.id] : cur.filter((x) => x !== s.id)))}
                      />
                      <span>
                        <span className="block font-medium">{s.label}</span>
                        <span className="text-xs text-muted">{s.description}</span>
                      </span>
                    </label>
                  ))}
                </div>
                {touched && name.trim() && !picked.length && <p className="px-1 text-xs text-danger">{error}</p>}
              </fieldset>
              <div className="grid gap-1.5">
                <span id={expiryLabel} className="px-1 text-xs text-muted">
                  Expires
                </span>
                <Select value={expiry} onValueChange={setExpiry}>
                  <SelectTrigger aria-labelledby={expiryLabel}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">In 30 days</SelectItem>
                    <SelectItem value="90">In 90 days</SelectItem>
                    <SelectItem value="365">In a year</SelectItem>
                    <SelectItem value="never">Never</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </DialogBody>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="ghost">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" variant="accent">
                Create key
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

function AddWebhookDialog({ onAdd }: { onAdd: (hook: Webhook) => void }) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [events, setEvents] = useState<string[]>([]);
  const [touched, setTouched] = useState(false);

  let urlError: string | undefined;
  try {
    const parsed = new URL(url.trim());
    if (parsed.protocol !== "https:") urlError = "Endpoints must use https.";
  } catch {
    urlError = "Enter a full URL, starting with https://";
  }
  const eventsError = events.length ? undefined : "Pick at least one event.";

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) {
          setUrl("");
          setEvents([]);
          setTouched(false);
        }
      }}
    >
      <Button size="sm" onClick={() => setOpen(true)}>
        Add endpoint
      </Button>
      <DialogContent>
        <form
          noValidate
          className="contents"
          onSubmit={(e) => {
            e.preventDefault();
            setTouched(true);
            if (urlError || eventsError) return;
            onAdd({ id: `w${Date.now()}`, url: url.trim(), events, enabled: true, successRate: 1 });
            setOpen(false);
            setUrl("");
            setEvents([]);
            setTouched(false);
          }}
        >
          <DialogHeader>
            <DialogTitle>Add a webhook endpoint</DialogTitle>
            <DialogDescription>We sign each request with a secret you can verify on your side.</DialogDescription>
          </DialogHeader>
          <DialogBody className="grid gap-5">
            <Input label="Endpoint URL" type="url" value={url} onChange={(e) => setUrl(e.target.value)} error={touched ? urlError : undefined} />
            <fieldset>
              <legend className="mb-2 px-1 text-xs text-muted">Events to send</legend>
              <div className="grid gap-2 sm:grid-cols-2">
                {webhookEvents.map((ev) => (
                  <label key={ev} className="flex cursor-pointer items-center gap-2.5 rounded-field p-2 text-sm hover:bg-surface-hover">
                    <Checkbox checked={events.includes(ev)} onCheckedChange={(v) => setEvents((cur) => (v === true ? [...cur, ev] : cur.filter((x) => x !== ev)))} />
                    <code className="font-mono text-xs">{ev}</code>
                  </label>
                ))}
              </div>
              {touched && eventsError && <p className="mt-2 px-1 text-xs text-danger">{eventsError}</p>}
            </fieldset>
          </DialogBody>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="ghost">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" variant="accent">
              Add endpoint
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
