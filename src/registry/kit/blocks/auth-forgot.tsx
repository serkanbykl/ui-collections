"use client";

import { useState } from "react";

import { AuthBrand, AuthCenter, AuthIcon, looksLikeEmail, pretend } from "@/registry/kit/lib/auth-kit";
import { Button } from "@/registry/kit/ui/button";
import { Input } from "@/registry/kit/ui/field";

export interface AuthForgotProps {
  brand?: string;
  logo?: React.ReactNode;
  homeHref?: string;
  signInHref?: string;
  defaultEmail?: string;
  /** Sends the reset link. Return an error message to show it under the field. */
  onSubmit?: (email: string) => string | void | Promise<string | void>;
}

export function AuthForgot({
  brand = "lumen",
  logo,
  homeHref = "/",
  signInHref = "/signin",
  defaultEmail,
  onSubmit,
}: AuthForgotProps) {
  const [error, setError] = useState<string>();
  const [pending, setPending] = useState(false);
  const [sentTo, setSentTo] = useState<string>();
  const [resent, setResent] = useState(false);

  async function send(email: string) {
    setPending(true);
    const result = onSubmit ? await onSubmit(email) : await pretend(900);
    setPending(false);
    if (result) return setError(result);
    setSentTo(email);
  }

  return (
    <AuthCenter>
      <AuthBrand brand={brand} logo={logo} homeHref={homeHref} />
      {sentTo ? (
        <div role="status" className="mt-8">
          <AuthIcon tone="success">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="5" width="18" height="14" rx="3" />
              <path d="m4 7 8 6 8-6" />
            </svg>
          </AuthIcon>
          <h1 className="mt-5 font-display text-4xl">Check your inbox</h1>
          <p className="mt-3 text-sm text-muted">
            If <span className="text-fg">{sentTo}</span> has an account, a reset link is on its way. It works for 30 minutes.
          </p>
          <Button
            className="mt-8 w-full"
            loading={pending}
            onClick={async () => {
              await send(sentTo);
              setResent(true);
            }}
          >
            {pending ? "Sending…" : "Resend the link"}
          </Button>
          {resent && !pending && <p className="mt-3 text-center text-xs text-muted">Sent again. Check spam if it still isn&apos;t there.</p>}
          <p className="mt-6 text-center text-sm text-muted">
            Wrong address?{" "}
            <button
              type="button"
              className="cursor-pointer text-fg underline-offset-4 hover:underline"
              onClick={() => {
                setSentTo(undefined);
                setResent(false);
              }}
            >
              Try another email
            </button>
          </p>
        </div>
      ) : (
        <>
          <h1 className="mt-8 font-display text-4xl">Reset your password</h1>
          <p className="mt-2 text-sm text-muted">Enter the email you sign in with and we&apos;ll send a reset link.</p>
          <form
            noValidate
            className="mt-8 grid gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              const email = String(new FormData(e.currentTarget).get("email") ?? "").trim();
              const found = looksLikeEmail(email) ? undefined : "Enter an email like name@company.com.";
              setError(found);
              if (!found) send(email);
            }}
          >
            <Input label="Email" name="email" type="email" autoComplete="email" required defaultValue={defaultEmail} error={error} />
            <Button type="submit" variant="solid" size="lg" loading={pending} className="w-full">
              {pending ? "Sending link…" : "Send reset link"}
            </Button>
          </form>
        </>
      )}
      <a href={signInHref} className="mt-8 flex items-center justify-center gap-1.5 text-sm text-muted underline-offset-4 hover:text-fg hover:underline">
        <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
          <path d="M15 6l-6 6 6 6" />
        </svg>
        Back to sign in
      </a>
    </AuthCenter>
  );
}
