"use client";

import { useEffect, useState } from "react";

import { AuthBrand, AuthCenter, AuthIcon, pretend } from "@/registry/kit/lib/auth-kit";
import { Button, ButtonShine, buttonVariants } from "@/registry/kit/ui/button";
import { Spinner } from "@/registry/kit/ui/spinner";

export type VerifyStatus = "verifying" | "verified" | "expired";

export interface AuthVerifyEmailProps {
  brand?: string;
  logo?: React.ReactNode;
  homeHref?: string;
  /** Controlled status. Leave unset to show a short check, then the verified state. */
  status?: VerifyStatus;
  email?: string;
  continueHref?: string;
  supportHref?: string;
  /** Sends a fresh link from the expired state. */
  onResend?: () => void | Promise<void>;
}

export function AuthVerifyEmail({
  brand = "lumen",
  logo,
  homeHref = "/",
  status,
  email = "ada@northwind.dev",
  continueHref = "/onboarding",
  supportHref = "/contact",
  onResend,
}: AuthVerifyEmailProps) {
  const [internal, setInternal] = useState<VerifyStatus>("verifying");
  const [pending, setPending] = useState(false);
  const [resent, setResent] = useState(false);
  const current = status ?? internal;

  useEffect(() => {
    if (status) return;
    const id = setTimeout(() => setInternal("verified"), 1400);
    return () => clearTimeout(id);
  }, [status]);

  return (
    <AuthCenter>
      <AuthBrand brand={brand} logo={logo} homeHref={homeHref} />
      <div role="status" aria-live="polite" className="mt-8">
        {current === "verifying" && (
          <>
            <span className="grid size-12 place-items-center rounded-control bg-accent/12 text-accent">
              <Spinner label="Checking your link" />
            </span>
            <h1 className="mt-5 font-display text-4xl">Confirming your email</h1>
            <p className="mt-3 text-sm text-muted">This takes a second. Keep this tab open.</p>
          </>
        )}

        {current === "verified" && (
          <>
            <AuthIcon tone="success">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12.5l4.5 4.5L19 7.5" />
              </svg>
            </AuthIcon>
            <h1 className="mt-5 font-display text-4xl">Email confirmed</h1>
            <p className="mt-3 text-sm text-muted">
              <span className="break-all text-fg">{email}</span> is verified. Next, name your workspace and invite your team.
            </p>
            <a href={continueHref} className={buttonVariants({ variant: "solid", size: "lg", className: "mt-8 w-full" })}>
              <ButtonShine />
              Set up workspace
            </a>
          </>
        )}

        {current === "expired" && (
          <>
            <AuthIcon tone="warning">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="8.5" />
                <path d="M12 7.5V12l3 2" />
              </svg>
            </AuthIcon>
            <h1 className="mt-5 font-display text-4xl">This link expired</h1>
            <p className="mt-3 text-sm text-muted">Links work for 24 hours. We can send a fresh one to {email}.</p>
            {resent ? (
              <p className="mt-8 rounded-control bg-success-soft px-4 py-3 text-sm text-success">New link sent. It arrives within a minute.</p>
            ) : (
              <Button
                variant="solid"
                size="lg"
                className="mt-8 w-full"
                loading={pending}
                onClick={async () => {
                  setPending(true);
                  await (onResend ? onResend() : pretend());
                  setPending(false);
                  setResent(true);
                }}
              >
                {pending ? "Sending…" : "Send a new link"}
              </Button>
            )}
          </>
        )}
      </div>
      <p className="mt-8 text-center text-sm text-muted">
        Having trouble?{" "}
        <a href={supportHref} className="text-fg underline-offset-4 hover:underline">
          Contact support
        </a>
      </p>
    </AuthCenter>
  );
}
