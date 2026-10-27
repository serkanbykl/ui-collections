"use client";

import { useId, useState } from "react";

import { cn } from "@/registry/kit/lib/utils";
import { SettingsLayout, SettingsSection, type SettingsLink } from "@/registry/kit/screens/settings-layout";
import { Button } from "@/registry/kit/ui/button";
import { SegmentedControl } from "@/registry/kit/ui/segmented-control";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/registry/kit/ui/select";
import { Switch } from "@/registry/kit/ui/switch";
import { toast } from "@/registry/kit/ui/toast";

export type NotificationChannel = "email" | "push" | "inApp";

export interface NotificationEvent {
  id: string;
  label: string;
  description: string;
  group: string;
  /** Channels that can't be turned off, e.g. security email. */
  required?: NotificationChannel[];
}

export type NotificationPrefs = Record<string, Record<NotificationChannel, boolean>>;

const channels: { id: NotificationChannel; label: string }[] = [
  { id: "email", label: "Email" },
  { id: "push", label: "Push" },
  { id: "inApp", label: "In-app" },
];

export const sampleNotificationEvents: NotificationEvent[] = [
  { id: "mentions", label: "Mentions", description: "Someone @mentions you in a comment or doc.", group: "Activity" },
  { id: "replies", label: "Replies", description: "Replies in threads you started or follow.", group: "Activity" },
  { id: "assigned", label: "Assigned to you", description: "A task or review lands on your plate.", group: "Activity" },
  { id: "status", label: "Status changes", description: "Projects you follow change status.", group: "Activity" },
  { id: "security", label: "Security alerts", description: "New sign-ins and password changes.", group: "Account", required: ["email"] },
  { id: "billing", label: "Receipts and invoices", description: "Sent when a payment goes through.", group: "Account" },
  { id: "digest", label: "Weekly digest", description: "Monday summary of what moved last week.", group: "Product" },
  { id: "updates", label: "Product updates", description: "New features, about twice a month.", group: "Product" },
];

export const sampleNotificationPrefs: NotificationPrefs = {
  mentions: { email: true, push: true, inApp: true },
  replies: { email: false, push: true, inApp: true },
  assigned: { email: true, push: true, inApp: true },
  status: { email: false, push: false, inApp: true },
  security: { email: true, push: true, inApp: true },
  billing: { email: true, push: false, inApp: false },
  digest: { email: true, push: false, inApp: false },
  updates: { email: false, push: false, inApp: true },
};

const hours = Array.from({ length: 24 }, (_, h) => `${String(h).padStart(2, "0")}:00`);

export interface SettingsNotificationsScreenProps {
  events?: NotificationEvent[];
  prefs?: NotificationPrefs;
  links?: SettingsLink[];
  onSave?: (prefs: NotificationPrefs) => void;
  className?: string;
}

/** A switch per event and channel (email, push, in-app), channel-wide toggles, quiet hours and email cadence. */
export function SettingsNotificationsScreen({
  events = sampleNotificationEvents,
  prefs = sampleNotificationPrefs,
  links,
  onSave,
  className,
}: SettingsNotificationsScreenProps) {
  const [saved, setSaved] = useState(prefs);
  const [draft, setDraft] = useState(prefs);
  const [quiet, setQuiet] = useState(true);
  const [from, setFrom] = useState("21:00");
  const [to, setTo] = useState("08:00");
  const [cadence, setCadence] = useState<"instant" | "hourly" | "daily">("instant");
  const fromLabel = useId();
  const toLabel = useId();

  const groups = [...new Set(events.map((e) => e.group))];
  const dirty = JSON.stringify(saved) !== JSON.stringify(draft);

  const isRequired = (event: NotificationEvent, channel: NotificationChannel) => event.required?.includes(channel) ?? false;
  const value = (event: NotificationEvent, channel: NotificationChannel) => isRequired(event, channel) || (draft[event.id]?.[channel] ?? false);

  function setOne(eventId: string, channel: NotificationChannel, on: boolean) {
    setDraft((d) => ({ ...d, [eventId]: { ...(d[eventId] ?? { email: false, push: false, inApp: false }), [channel]: on } }));
  }

  function setChannel(channel: NotificationChannel, on: boolean) {
    setDraft((d) => {
      const next = { ...d };
      for (const e of events) next[e.id] = { ...(next[e.id] ?? { email: false, push: false, inApp: false }), [channel]: on };
      return next;
    });
  }

  const channelState = (channel: NotificationChannel) => {
    const on = events.filter((e) => value(e, channel)).length;
    return on === events.length ? true : on === 0 ? false : "mixed";
  };

  return (
    <SettingsLayout
      active="notifications"
      title="Notifications"
      description={`${events.length} kinds of update across email, push and in-app${quiet ? ` · quiet hours ${from}–${to}` : ""}`}
      links={links}
      className={className}
    >
      <SettingsSection
        title="What to send where"
        description="Security alerts always go to your email."
        footer={
          <>
            <Button variant="ghost" disabled={!dirty} onClick={() => setDraft(saved)}>
              Discard changes
            </Button>
            <Button
              variant="accent"
              disabled={!dirty}
              onClick={() => {
                setSaved(draft);
                toast.success("Notification preferences saved.");
                onSave?.(draft);
              }}
            >
              Save preferences
            </Button>
          </>
        }
      >
        <div role="table" aria-label="Notification preferences" className="grid min-w-0">
          <div role="rowgroup">
            <div role="row" className="grid grid-cols-[minmax(0,1fr)_repeat(3,3.25rem)] items-end gap-x-2 border-b border-line pb-3 sm:grid-cols-[minmax(0,1fr)_repeat(3,5rem)]">
              <span role="columnheader" className="text-xs text-muted">
                Event
              </span>
              {channels.map((c) => {
                const state = channelState(c.id);
                return (
                  <span role="columnheader" key={c.id} className="grid justify-items-center gap-1.5">
                    <span className="text-xs font-medium">{c.label}</span>
                    <button
                      type="button"
                      onClick={() => setChannel(c.id, state !== true)}
                      className="cursor-pointer rounded-sm text-[11px] text-accent outline-none hover:underline focus-visible:outline-2 focus-visible:outline-accent"
                      aria-label={`${state === true ? "Turn off" : "Turn on"} all ${c.label.toLowerCase()} notifications`}
                    >
                      {state === true ? "None" : "All"}
                    </button>
                  </span>
                );
              })}
            </div>
          </div>
          {groups.map((group) => (
            <div role="rowgroup" key={group}>
              <div role="row" className="pt-5 pb-1">
                <span role="rowheader" className="text-xs font-medium tracking-wide text-muted uppercase">
                  {group}
                </span>
              </div>
              {events
                .filter((e) => e.group === group)
                .map((event) => (
                  <div
                    role="row"
                    key={event.id}
                    className="grid grid-cols-[minmax(0,1fr)_repeat(3,3.25rem)] items-center gap-x-2 border-b border-line py-3 last:border-b-0 sm:grid-cols-[minmax(0,1fr)_repeat(3,5rem)]"
                  >
                    <div role="rowheader" className="min-w-0">
                      <p className="text-sm font-medium">{event.label}</p>
                      <p className="text-xs text-muted">{event.description}</p>
                    </div>
                    {channels.map((c) => (
                      <div role="cell" key={c.id} className="flex justify-center">
                        <Switch
                          aria-label={`${event.label} by ${c.label.toLowerCase()}`}
                          checked={value(event, c.id)}
                          disabled={isRequired(event, c.id)}
                          onCheckedChange={(on) => setOne(event.id, c.id, on)}
                          className="scale-90 sm:scale-100"
                        />
                      </div>
                    ))}
                  </div>
                ))}
            </div>
          ))}
        </div>
      </SettingsSection>

      <SettingsSection
        title="Quiet hours"
        description={quiet ? `Push notifications pause from ${from} to ${to}. Security alerts still come through.` : "Push notifications can arrive at any time."}
        aside={<Switch aria-label="Quiet hours" checked={quiet} onCheckedChange={setQuiet} />}
      >
        <div className={cn("grid gap-4 sm:grid-cols-2", !quiet && "pointer-events-none opacity-50")} aria-disabled={!quiet}>
          <div className="grid gap-1.5">
            <span id={fromLabel} className="px-1 text-xs text-muted">
              From
            </span>
            <Select value={from} onValueChange={setFrom} disabled={!quiet}>
              <SelectTrigger aria-labelledby={fromLabel}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {hours.map((h) => (
                  <SelectItem key={h} value={h}>
                    {h}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-1.5">
            <span id={toLabel} className="px-1 text-xs text-muted">
              Until
            </span>
            <Select value={to} onValueChange={setTo} disabled={!quiet}>
              <SelectTrigger aria-labelledby={toLabel}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {hours.map((h) => (
                  <SelectItem key={h} value={h}>
                    {h}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </SettingsSection>

      <SettingsSection
        title="Email cadence"
        description={
          cadence === "instant"
            ? "Each email goes out as it happens."
            : cadence === "hourly"
              ? "Emails are bundled into one message per hour."
              : "One email a day at 08:30 with everything since the last one."
        }
      >
        <div className="-mx-1 max-w-full overflow-x-auto px-1 py-0.5">
          <SegmentedControl
            aria-label="Email cadence"
            value={cadence}
            onValueChange={setCadence}
            options={[
              { value: "instant", label: "As it happens" },
              { value: "hourly", label: "Hourly" },
              { value: "daily", label: "Daily" },
            ]}
          />
        </div>
      </SettingsSection>
    </SettingsLayout>
  );
}
