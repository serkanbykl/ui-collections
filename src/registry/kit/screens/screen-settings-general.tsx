"use client";

import { useEffect, useId, useRef, useState } from "react";

import { cn } from "@/registry/kit/lib/utils";
import { SettingsLayout, SettingsSection, type SettingsLink } from "@/registry/kit/screens/settings-layout";
import { Avatar } from "@/registry/kit/ui/avatar";
import { Button } from "@/registry/kit/ui/button";
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
import { Input, Textarea } from "@/registry/kit/ui/field";
import { SegmentedControl } from "@/registry/kit/ui/segmented-control";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/registry/kit/ui/select";
import { toast } from "@/registry/kit/ui/toast";

export interface GeneralProfile {
  name: string;
  email: string;
  title: string;
  bio: string;
  avatar?: string;
  language: string;
  timezone: string;
  dateFormat: "dmy" | "mdy" | "iso";
}

export const sampleGeneralProfile: GeneralProfile = {
  name: "Priya Raman",
  email: "priya@northwind.io",
  title: "Lead product designer",
  bio: "Onboarding and billing flows. Ask me about invoice tables.",
  language: "en-GB",
  timezone: "Europe/Lisbon",
  dateFormat: "dmy",
};

const languages = [
  { value: "en-GB", label: "English (UK)" },
  { value: "en-US", label: "English (US)" },
  { value: "de-DE", label: "Deutsch" },
  { value: "es-ES", label: "Español" },
  { value: "fr-FR", label: "Français" },
  { value: "pt-PT", label: "Português" },
  { value: "tr-TR", label: "Türkçe" },
  { value: "ja-JP", label: "日本語" },
];

const timezones: { region: string; zones: [string, string][] }[] = [
  { region: "Americas", zones: [["America/Los_Angeles", "Los Angeles (UTC−7)"], ["America/New_York", "New York (UTC−4)"], ["America/Bogota", "Bogotá (UTC−5)"]] },
  { region: "Europe and Africa", zones: [["Europe/Lisbon", "Lisbon (UTC+1)"], ["Europe/Berlin", "Berlin (UTC+2)"], ["Europe/Istanbul", "Istanbul (UTC+3)"], ["Africa/Lagos", "Lagos (UTC+1)"]] },
  { region: "Asia and Pacific", zones: [["Asia/Kolkata", "Kolkata (UTC+5:30)"], ["Asia/Tokyo", "Tokyo (UTC+9)"], ["Australia/Sydney", "Sydney (UTC+11)"]] },
];

const sample = new Date(Date.UTC(2026, 9, 26));
const dateFormats = [
  { value: "dmy" as const, label: "26/10/2026" },
  { value: "mdy" as const, label: "10/26/2026" },
  { value: "iso" as const, label: "2026-10-26" },
];

export interface SettingsGeneralScreenProps {
  profile?: GeneralProfile;
  /** Name typed to confirm deleting the account. */
  workspaceName?: string;
  links?: SettingsLink[];
  onSave?: (profile: GeneralProfile) => void;
  onDeleteAccount?: () => void;
  className?: string;
}

/** Profile, avatar upload, language, time zone and date format, plus a danger zone that asks for confirmation. */
export function SettingsGeneralScreen({
  profile = sampleGeneralProfile,
  workspaceName = "Northwind",
  links,
  onSave,
  onDeleteAccount,
  className,
}: SettingsGeneralScreenProps) {
  const [saved, setSaved] = useState(profile);
  const [form, setForm] = useState(profile);
  const [saving, setSaving] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const objectUrl = useRef<string | null>(null);
  const languageLabel = useId();
  const timezoneLabel = useId();

  useEffect(() => () => {
    if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
  }, []);

  const dirty = JSON.stringify(saved) !== JSON.stringify(form);
  const nameError = form.name.trim() ? undefined : "Your name is shown on comments and invites, so it can't be empty.";
  const emailError = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim()) ? undefined : "Enter a full email address.";

  function set<K extends keyof GeneralProfile>(key: K, value: GeneralProfile[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function pickFile(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) return setAvatarError("Pick an image file: PNG, JPG or WebP.");
    if (file.size > 2 * 1024 * 1024) return setAvatarError(`That image is ${(file.size / 1024 / 1024).toFixed(1)} MB. The limit is 2 MB.`);
    if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
    objectUrl.current = URL.createObjectURL(file);
    setAvatarError(null);
    set("avatar", objectUrl.current);
  }

  function save(event: React.FormEvent) {
    event.preventDefault();
    if (nameError || emailError) return;
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(form);
      toast.success("Profile saved.");
      onSave?.(form);
    }, 700);
  }

  const zoneLabel = timezones.flatMap((g) => g.zones).find(([v]) => v === form.timezone)?.[1];

  return (
    <SettingsLayout active="general" title="General" description="How you appear to your team, and how dates and times are shown to you." links={links} className={className}>
      <form onSubmit={save} noValidate className="grid min-w-0 grid-cols-1 gap-6">
        <SettingsSection
          title="Profile"
          description="Visible to everyone in the workspace."
          footer={
            <>
              <Button type="button" variant="ghost" disabled={!dirty || saving} onClick={() => setForm(saved)}>
                Discard changes
              </Button>
              <Button type="submit" variant="accent" disabled={!dirty} loading={saving}>
                Save profile
              </Button>
            </>
          }
        >
          <div
            className="mb-6 flex flex-wrap items-center gap-4"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              pickFile(e.dataTransfer.files[0]);
            }}
          >
            <Avatar
              src={form.avatar}
              alt={form.name || "Your avatar"}
              className="size-20 text-xl"
              fallbackClassName="bg-linear-to-br from-accent to-info font-semibold text-accent-fg"
            />
            <div className="grid gap-2">
              <div className="flex flex-wrap gap-2">
                <Button type="button" size="sm" onClick={() => fileRef.current?.click()}>
                  Upload photo
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  disabled={!form.avatar}
                  onClick={() => {
                    set("avatar", undefined);
                    setAvatarError(null);
                  }}
                >
                  Remove photo
                </Button>
              </div>
              <p className={cn("text-xs", avatarError ? "text-danger" : "text-muted")} aria-live="polite">
                {avatarError ?? "Square images work best. PNG, JPG or WebP up to 2 MB, or drop one here."}
              </p>
              <input
                ref={fileRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="sr-only"
                tabIndex={-1}
                aria-hidden
                onChange={(e) => {
                  pickFile(e.target.files?.[0]);
                  e.target.value = "";
                }}
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Full name" autoComplete="name" value={form.name} onChange={(e) => set("name", e.target.value)} error={nameError} />
            <Input label="Email" type="email" autoComplete="email" value={form.email} onChange={(e) => set("email", e.target.value)} error={emailError} hint={emailError ? undefined : "We'll send a link to confirm a new address."} />
            <Input label="Job title" value={form.title} onChange={(e) => set("title", e.target.value)} className="md:col-span-2" />
            <Textarea
              label="Short bio"
              rows={3}
              maxLength={160}
              value={form.bio}
              onChange={(e) => set("bio", e.target.value)}
              hint={`${160 - form.bio.length} characters left`}
              className="md:col-span-2"
            />
          </div>
        </SettingsSection>

        <SettingsSection
          title="Language and region"
          description={`Times show in ${zoneLabel ?? form.timezone}. Today reads as ${formatSample(form.dateFormat)}.`}
        >
          <div className="grid gap-5 md:grid-cols-2">
            <div className="grid gap-1.5">
              <span id={languageLabel} className="px-1 text-xs text-muted">
                Interface language
              </span>
              <Select value={form.language} onValueChange={(v) => set("language", v)}>
                <SelectTrigger aria-labelledby={languageLabel}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((l) => (
                    <SelectItem key={l.value} value={l.value}>
                      {l.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <span id={timezoneLabel} className="px-1 text-xs text-muted">
                Time zone
              </span>
              <Select value={form.timezone} onValueChange={(v) => set("timezone", v)}>
                <SelectTrigger aria-labelledby={timezoneLabel}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timezones.map((group) => (
                    <SelectGroup key={group.region}>
                      <SelectLabel>{group.region}</SelectLabel>
                      {group.zones.map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5 md:col-span-2">
              <span className="px-1 text-xs text-muted">Date format</span>
              <div className="-mx-1 max-w-full overflow-x-auto px-1 py-0.5">
                <SegmentedControl aria-label="Date format" value={form.dateFormat} onValueChange={(v) => set("dateFormat", v)} options={dateFormats} />
              </div>
            </div>
          </div>
        </SettingsSection>
      </form>

      <SettingsSection
        tone="danger"
        title="Delete account"
        description={`Removes your profile and signs you out everywhere. Projects you own in ${workspaceName} move to the workspace owner.`}
        aside={<DeleteAccountDialog workspaceName={workspaceName} onConfirm={onDeleteAccount} />}
      />
    </SettingsLayout>
  );
}

function formatSample(format: GeneralProfile["dateFormat"]) {
  return dateFormats.find((f) => f.value === format)?.label ?? sample.toISOString().slice(0, 10);
}

function DeleteAccountDialog({ workspaceName, onConfirm }: { workspaceName: string; onConfirm?: () => void }) {
  const [open, setOpen] = useState(false);
  const [typed, setTyped] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const matches = typed.trim() === workspaceName;

  return (
    <>
      {done ? (
        <p role="status" className="text-sm text-muted">
          Deletion scheduled. You have 14 days to change your mind.
        </p>
      ) : (
        <Button variant="danger" onClick={() => setOpen(true)}>
          Delete account
        </Button>
      )}
      <Dialog
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) setTyped("");
        }}
      >
        <DialogContent size="sm">
          <form
            className="contents"
            onSubmit={(e) => {
              e.preventDefault();
              if (!matches) return;
              setBusy(true);
              setTimeout(() => {
                setBusy(false);
                setOpen(false);
                setDone(true);
                onConfirm?.();
              }, 800);
            }}
          >
            <DialogHeader
              tone="danger"
              icon={
                <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3" />
                </svg>
              }
            >
              <DialogTitle>Delete your account?</DialogTitle>
              <DialogDescription>
                You&apos;ll be signed out on every device. After 14 days the account and its personal files are gone for good.
              </DialogDescription>
            </DialogHeader>
            <DialogBody>
              <Input
                label={`Type ${workspaceName} to confirm`}
                value={typed}
                onChange={(e) => setTyped(e.target.value)}
                autoComplete="off"
                spellCheck={false}
              />
            </DialogBody>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="ghost">
                  Keep my account
                </Button>
              </DialogClose>
              <Button type="submit" variant="danger" disabled={!matches} loading={busy}>
                Delete account
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
