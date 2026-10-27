"use client";

import { useState } from "react";

import { AuthBrand, AuthCenter, AuthIcon, pretend, useResendTimer } from "@/registry/kit/lib/auth-kit";
import { Button, buttonVariants } from "@/registry/kit/ui/button";

export interface AuthCheckEmailProps {
  /** Heading. Defaults to confirming a new account; reword it for a reset link. */
  title?: string;
  /** Line under the heading; `email` is shown in it by default. */
  description?: React.ReactNode;
  brand?: string;
  logo?: React.ReactNode;
  homeHref?: string;
  /** The address the link went to. */
  email?: string;
  /** Inbox shortcuts. Pass an empty array to hide them. */
  inboxes?: { label: string; href: string }[];
  /** Where "Use a different email" goes, usually back to sign-up. */
  changeEmailHref?: string;
  /** Seconds before the link can be resent. */
  resendAfter?: number;
  /** Resends the link. Return an error message to show it. */
  onResend?: () => string | void | Promise<string | void>;
}

const defaultInboxes = [
  { label: "Open Gmail", href: "https://mail.google.com" },
  { label: "Open Outlook", href: "https://outlook.live.com/mail" },
];

export function AuthCheckEmail({
  title = "Confirm your email",
  description,
  brand = "lumen",
  logo,
  homeHref = "/",
  email = "ada@northwind.dev",
  inboxes = defaultInboxes,
  changeEmailHref = "/signup",
  resendAfter = 45,
  onResend,
}: AuthCheckEmailProps) {
  const { left, restart } = useResendTimer(resendAfter);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<{ tone: "ok" | "error"; text: string }>();

  return (
    <AuthCenter>
      <AuthBrand brand={brand} logo={logo} homeHref={homeHref} />
      <div className="mt-8">
        <AuthIcon>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="5" width="18" height="14" rx="3" />
            <path d="m4 7 8 6 8-6" />
          </svg>
        </AuthIcon>
      </div>
      <h1 className="mt-5 font-display text-4xl">{title}</h1>
      <p className="mt-3 text-sm text-muted">
        {description ?? (
          <>
            We sent a confirmation link to <span className="break-all text-fg">{email}</span>. Open it on this device to finish setting up your account.
          </>
        )}
      </p>

      {inboxes.length > 0 && (
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {inboxes.map((inbox) => (
            <a key={inbox.href} href={inbox.href} target="_blank" rel="noreferrer" className={buttonVariants({ className: "w-full" })}>
              {inbox.label}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          ))}
        </div>
      )}

      <div className="mt-8 border-t border-line pt-6 text-sm text-muted">
        <p>Didn&apos;t get it? Check spam, or resend the link.</p>
        <Button
          variant="ghost"
          size="sm"
          className="mt-3 -ml-4"
          loading={pending}
          disabled={left > 0}
          onClick={async () => {
            setPending(true);
            setMessage(undefined);
            const result = onResend ? await onResend() : await pretend();
            setPending(false);
            if (result) return setMessage({ tone: "error", text: result });
            setMessage({ tone: "ok", text: `Sent a new link to ${email}.` });
            restart();
          }}
        >
          {left > 0 ? `Resend in 0:${String(left).padStart(2, "0")}` : pending ? "Sending…" : "Resend the link"}
        </Button>
        <p role="status" className={message?.tone === "error" ? "mt-2 text-danger" : "mt-2 text-success"}>
          {message?.text}
        </p>
        <a href={changeEmailHref} className="mt-4 inline-block text-fg underline-offset-4 hover:underline">
          Use a different email
        </a>
      </div>
    </AuthCenter>
  );
}
