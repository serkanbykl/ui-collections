"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/registry/kit/lib/utils";
import { SettingsLayout, SettingsSection, type SettingsLink } from "@/registry/kit/screens/settings-layout";
import { Alert } from "@/registry/kit/ui/alert";
import { Badge } from "@/registry/kit/ui/badge";
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
import { Input } from "@/registry/kit/ui/field";
import { InputOTP } from "@/registry/kit/ui/input-otp";
import { toast } from "@/registry/kit/ui/toast";

export interface SecuritySession {
  id: string;
  device: string;
  browser: string;
  location: string;
  ip: string;
  lastSeen: string;
  kind: "desktop" | "phone" | "tablet";
  current?: boolean;
}

export const sampleSessions: SecuritySession[] = [
  { id: "s1", device: "MacBook Pro", browser: "Edge 131", location: "Lisbon, Portugal", ip: "85.243.17.92", lastSeen: "Active now", kind: "desktop", current: true },
  { id: "s2", device: "iPhone 15", browser: "Lumen for iOS 4.12", location: "Lisbon, Portugal", ip: "85.243.17.92", lastSeen: "2 h ago", kind: "phone" },
  { id: "s3", device: "Windows 11 desktop", browser: "Chrome 130", location: "Porto, Portugal", ip: "188.81.52.140", lastSeen: "3 days ago", kind: "desktop" },
  { id: "s4", device: "iPad Air", browser: "Safari 18", location: "Madrid, Spain", ip: "31.4.207.18", lastSeen: "Oct 9", kind: "tablet" },
];

export const sampleRecoveryCodes = [
  "7KQ2-M9XA", "P4TD-81LW", "Z6HC-3RVN", "B2YE-Q75K", "N8FJ-6WUM",
  "R3LS-T9DP", "H5VQ-2KXE", "C9MW-4ZBA", "U1GN-8PRT", "E7XK-5JHD",
];

/** Rough strength from length and character variety: 0 (empty) to 4 (strong). */
export function passwordStrength(value: string) {
  if (!value) return 0;
  let score = 0;
  if (value.length >= 8) score++;
  if (value.length >= 12) score++;
  if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score++;
  if (/\d/.test(value) && /[^A-Za-z0-9]/.test(value)) score++;
  return Math.max(1, Math.min(score, 4));
}

const strengthMeta = [
  { label: "", bar: "" },
  { label: "Weak", bar: "bg-danger" },
  { label: "Fair", bar: "bg-warning" },
  { label: "Good", bar: "bg-info" },
  { label: "Strong", bar: "bg-success" },
];

const deviceIcon = {
  desktop: "M4 5h16a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1ZM9 20h6M12 16v4",
  phone: "M8 3h8a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1ZM11 18h2",
  tablet: "M6 3h12a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1ZM11 18h2",
};

export interface SettingsSecurityScreenProps {
  sessions?: SecuritySession[];
  /** Whether two-factor sign-in starts out on. */
  twoFactorEnabled?: boolean;
  recoveryCodes?: string[];
  /** Shown in the authenticator app during setup. */
  accountLabel?: string;
  links?: SettingsLink[];
  className?: string;
}

/** Password change with a strength meter, two-factor setup with a one-time code and recovery codes, and active sessions. */
export function SettingsSecurityScreen({
  sessions = sampleSessions,
  twoFactorEnabled = false,
  recoveryCodes = sampleRecoveryCodes,
  accountLabel = "priya@northwind.io",
  links,
  className,
}: SettingsSecurityScreenProps) {
  const [twoFactor, setTwoFactor] = useState(twoFactorEnabled);
  const [setupOpen, setSetupOpen] = useState(false);
  const [codesOpen, setCodesOpen] = useState(false);
  const [list, setList] = useState(sessions);

  const others = list.filter((s) => !s.current);

  return (
    <SettingsLayout active="security" title="Security" description={`Two-factor ${twoFactor ? "on" : "off"} · signed in on ${list.length} ${list.length === 1 ? "device" : "devices"}`} links={links} className={className}>
      <PasswordSection />

      <SettingsSection
        title="Two-factor authentication"
        description="Ask for a code from your authenticator app whenever you sign in on a new device."
        aside={twoFactor ? <Badge dot variant="success">On</Badge> : <Badge dot variant="warning">Off</Badge>}
        footer={
          twoFactor ? (
            <>
              <Button variant="ghost" onClick={() => setCodesOpen(true)}>
                View recovery codes
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  setTwoFactor(false);
                  toast.warning("Two-factor authentication is off. Your recovery codes no longer work.");
                }}
              >
                Turn off
              </Button>
            </>
          ) : (
            <Button variant="accent" onClick={() => setSetupOpen(true)}>
              Set up two-factor
            </Button>
          )
        }
      >
        {!twoFactor ? (
          <Alert variant="warning" title="Your account relies on a password alone">
            Workspace admins at Northwind require two-factor for anyone with billing access from November 15.
          </Alert>
        ) : (
          <p className="text-sm text-muted">Authenticator app linked on Oct 26, 2026. 10 recovery codes left.</p>
        )}
      </SettingsSection>

      <SettingsSection
        title="Where you're signed in"
        description={`${list.length} active ${list.length === 1 ? "session" : "sessions"}. Sign out of any you don't recognise, then change your password.`}
        aside={
          others.length > 0 && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setList((l) => l.filter((s) => s.current));
              }}
            >
              Sign out of other sessions
            </Button>
          )
        }
      >
        <ul className="divide-y divide-line">
          {list.map((s) => (
            <li key={s.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 py-3.5 first:pt-0 last:pb-0">
              <span aria-hidden className="grid size-10 shrink-0 place-items-center rounded-field bg-fg/[0.06] text-muted">
                <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d={deviceIcon[s.kind]} />
                </svg>
              </span>
              <div className="min-w-0 flex-1 basis-48">
                <p className="flex flex-wrap items-center gap-2 font-medium">
                  {s.device}
                  {s.current && <Badge variant="accent">This device</Badge>}
                </p>
                <p className="text-xs text-muted">
                  {s.browser} · {s.location} · <span className="font-mono">{s.ip}</span>
                </p>
              </div>
              <span className={cn("text-sm", s.lastSeen === "Active now" ? "text-success" : "text-muted")}>{s.lastSeen}</span>
              {!s.current && (
                <Button size="sm" variant="ghost" aria-label={`Sign out of ${s.device}`} onClick={() => setList((l) => l.filter((x) => x.id !== s.id))}>
                  Sign out
                </Button>
              )}
            </li>
          ))}
        </ul>
      </SettingsSection>

      <TwoFactorSetup
        open={setupOpen}
        onOpenChange={setSetupOpen}
        accountLabel={accountLabel}
        recoveryCodes={recoveryCodes}
        onEnabled={() => {
          setTwoFactor(true);
          toast.success("Two-factor authentication is on. We'll ask for a code on new devices.");
        }}
      />

      <Dialog open={codesOpen} onOpenChange={setCodesOpen}>
        <DialogContent size="sm">
          <DialogHeader tone="info">
            <DialogTitle>Recovery codes</DialogTitle>
            <DialogDescription>Each code works once. Keep them somewhere other than this device.</DialogDescription>
          </DialogHeader>
          <DialogBody>
            <RecoveryCodes codes={recoveryCodes} />
          </DialogBody>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="accent">Done</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SettingsLayout>
  );
}

function PasswordSection() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [touched, setTouched] = useState(false);
  const [saving, setSaving] = useState(false);

  const strength = passwordStrength(next);
  const errors = {
    current: current ? undefined : "Enter your current password.",
    next: next.length < 10 ? "Use at least 10 characters." : next === current ? "Pick a password you haven't used here before." : undefined,
    confirm: confirm === next ? undefined : "The passwords don't match.",
  };
  const valid = !errors.current && !errors.next && !errors.confirm;

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        setTouched(true);
        if (!valid) return;
        setSaving(true);
        setTimeout(() => {
          setSaving(false);
          setCurrent("");
          setNext("");
          setConfirm("");
          setTouched(false);
          toast.success("Password changed. Other sessions stay signed in until they next refresh.");
        }, 800);
      }}
    >
      <SettingsSection
        title="Password"
        description="Last changed 143 days ago."
        footer={
          <>
            <Button type="submit" variant="accent" loading={saving}>
              Change password
            </Button>
          </>
        }
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Current password"
            type="password"
            autoComplete="current-password"
            value={current}
            onChange={(e) => {
              setCurrent(e.target.value);
            }}
            error={touched ? errors.current : undefined}
            className="md:col-span-2"
          />
          <div className="grid content-start gap-2">
            <Input
              label="New password"
              type="password"
              autoComplete="new-password"
              value={next}
              onChange={(e) => setNext(e.target.value)}
              error={touched ? errors.next : undefined}
            />
            <div className="grid gap-1.5 px-1" aria-live="polite">
              <div className="grid grid-cols-4 gap-1.5" aria-hidden>
                {[1, 2, 3, 4].map((step) => (
                  <span
                    key={step}
                    className={cn("h-1.5 rounded-full bg-fg/10 transition-colors duration-300", step <= strength && strengthMeta[strength]!.bar)}
                  />
                ))}
              </div>
              <p className="text-xs text-muted">
                {strength ? (
                  <>
                    Strength: <span className="text-fg">{strengthMeta[strength]!.label}</span>
                    {strength < 4 && " · mix cases, numbers and a symbol, or make it longer"}
                  </>
                ) : (
                  "At least 10 characters. A short sentence is easier to remember."
                )}
              </p>
            </div>
          </div>
          <Input
            label="Confirm new password"
            type="password"
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            error={touched || (confirm.length >= next.length && confirm) ? errors.confirm : undefined}
          />
        </div>
      </SettingsSection>
    </form>
  );
}

function RecoveryCodes({ codes }: { codes: string[] }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="grid gap-3">
      <ol className="surface-field grid grid-cols-2 gap-x-6 gap-y-2 rounded-field p-4 font-mono text-sm">
        {codes.map((c) => (
          <li key={c} className="tabular-nums">
            {c}
          </li>
        ))}
      </ol>
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          onClick={() => {
            navigator.clipboard?.writeText(codes.join("\n")).catch(() => {});
            setCopied(true);
          }}
        >
          {copied ? "Copied" : "Copy codes"}
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            const url = URL.createObjectURL(new Blob([codes.join("\n")], { type: "text/plain" }));
            const a = document.createElement("a");
            a.href = url;
            a.download = "lumen-recovery-codes.txt";
            a.click();
            URL.revokeObjectURL(url);
          }}
        >
          Download as text
        </Button>
      </div>
      <span role="status" className="sr-only">
        {copied ? "Recovery codes copied" : ""}
      </span>
    </div>
  );
}

/** A deterministic QR-like grid; a real app renders the otpauth URI instead. */
function FakeQr({ seed }: { seed: string }) {
  const size = 21;
  let h = 0;
  for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const cells: [number, number][] = [];
  for (let y = 0; y < size; y++)
    for (let x = 0; x < size; x++) {
      const finder = (x < 7 && y < 7) || (x >= size - 7 && y < 7) || (x < 7 && y >= size - 7);
      if (finder) {
        const fx = x >= size - 7 ? x - (size - 7) : x;
        const fy = y >= size - 7 ? y - (size - 7) : y;
        const ring = fx === 0 || fy === 0 || fx === 6 || fy === 6 || (fx >= 2 && fx <= 4 && fy >= 2 && fy <= 4);
        if (ring) cells.push([x, y]);
        continue;
      }
      h = (h * 1103515245 + 12345) >>> 0;
      if ((h >>> 16) % 2) cells.push([x, y]);
    }
  return (
    <svg viewBox={`-1 -1 ${size + 2} ${size + 2}`} className="size-40 rounded-field bg-white p-1 text-black" role="img" aria-label="QR code for your authenticator app">
      {cells.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="1.02" height="1.02" fill="currentColor" />
      ))}
    </svg>
  );
}

function TwoFactorSetup({
  open,
  onOpenChange,
  accountLabel,
  recoveryCodes,
  onEnabled,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accountLabel: string;
  recoveryCodes: string[];
  onEnabled: () => void;
}) {
  const [step, setStep] = useState<"scan" | "verify" | "codes">("scan");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string>();
  const [checking, setChecking] = useState(false);
  const secret = "JBSW Y3DP EHPK 3PXP";
  const otpRef = useRef<HTMLFormElement>(null);

  // Put the caret in the first box as soon as the code step shows.
  useEffect(() => {
    if (step !== "verify") return;
    const frame = requestAnimationFrame(() => otpRef.current?.querySelector<HTMLInputElement>("input:not([type=hidden])")?.focus());
    return () => cancelAnimationFrame(frame);
  }, [step]);

  function close(next: boolean) {
    onOpenChange(next);
    if (!next) {
      if (step === "codes") onEnabled();
      setTimeout(() => {
        setStep("scan");
        setCode("");
        setError(undefined);
      }, 200);
    }
  }

  function verify(value = code) {
    if (value.length < 6) return setError("Enter all 6 digits.");
    setChecking(true);
    setTimeout(() => {
      setChecking(false);
      // Demo rule: any code works except all zeros, so the error state can be tried.
      if (value === "000000") {
        setError("That code didn't match. Codes change every 30 seconds, so try the newest one.");
        setCode("");
        return;
      }
      setStep("codes");
    }, 700);
  }

  const stepNumber = { scan: 1, verify: 2, codes: 3 }[step];

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent>
        <DialogHeader
          tone={step === "codes" ? "success" : "accent"}
          icon={
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <rect x="5" y="10" width="14" height="10" rx="2" />
              <path d="M8 10V7a4 4 0 0 1 8 0v3" />
            </svg>
          }
        >
          <p className="text-xs text-muted">Step {stepNumber} of 3</p>
          <DialogTitle>
            {step === "scan" ? "Scan with your authenticator app" : step === "verify" ? "Enter the 6-digit code" : "Save your recovery codes"}
          </DialogTitle>
          <DialogDescription>
            {step === "scan"
              ? "Use 1Password, Authy, Google Authenticator or any app that supports time-based codes."
              : step === "verify"
                ? `Open the app and type the code it shows for ${accountLabel}.`
                : "If you lose your phone, each of these codes signs you in once. This is the only time we show them."}
          </DialogDescription>
        </DialogHeader>
        <DialogBody>
          {step === "scan" && (
            <div className="flex flex-col items-center gap-4 py-2 sm:flex-row sm:items-start">
              <FakeQr seed={accountLabel} />
              <div className="grid min-w-0 grid-cols-1 gap-2 text-sm">
                <p className="text-muted">Can&apos;t scan? Enter this key in the app instead:</p>
                <code className="surface-field rounded-field px-3 py-2 font-mono text-[13px] tracking-wider break-all">{secret}</code>
                <p className="text-xs text-muted">Account: {accountLabel}</p>
              </div>
            </div>
          )}
          {step === "verify" && (
            <form
              ref={otpRef}
              className="grid justify-items-center gap-3 py-3"
              onSubmit={(e) => {
                e.preventDefault();
                verify();
              }}
            >
              <InputOTP
                aria-label="One-time code"
                value={code}
                onValueChange={(v) => {
                  setCode(v);
                  setError(undefined);
                  if (v.length === 6) verify(v);
                }}
                disabled={checking}
              />
              <p className={cn("min-h-5 text-center text-sm", error ? "text-danger" : "text-muted")} aria-live="polite">
                {checking ? "Checking the code…" : (error ?? "It fills in automatically when you paste.")}
              </p>
            </form>
          )}
          {step === "codes" && <RecoveryCodes codes={recoveryCodes} />}
        </DialogBody>
        <DialogFooter>
          {step === "scan" && (
            <>
              <DialogClose asChild>
                <Button variant="ghost">Cancel</Button>
              </DialogClose>
              <Button variant="accent" onClick={() => setStep("verify")}>
                I&apos;ve scanned it
              </Button>
            </>
          )}
          {step === "verify" && (
            <>
              <Button variant="ghost" onClick={() => setStep("scan")}>
                Back
              </Button>
              <Button variant="accent" loading={checking} onClick={() => verify()}>
                Verify code
              </Button>
            </>
          )}
          {step === "codes" && (
            <Button variant="accent" onClick={() => close(false)}>
              I&apos;ve saved them
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
