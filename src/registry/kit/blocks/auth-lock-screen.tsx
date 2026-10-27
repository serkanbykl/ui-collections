"use client";

import { useState } from "react";

import { AuthCenter, pretend } from "@/registry/kit/lib/auth-kit";
import { Avatar } from "@/registry/kit/ui/avatar";
import { Button } from "@/registry/kit/ui/button";
import { Input } from "@/registry/kit/ui/field";

export interface AuthLockScreenProps {
  user?: { name: string; email: string; avatar?: string };
  /** Why the session locked, shown under the name. */
  reason?: string;
  /** Where "Sign in as someone else" goes. */
  switchAccountHref?: string;
  forgotHref?: string | null;
  /** Checks the password. Return an error message when it's wrong. */
  onUnlock?: (password: string) => string | void | Promise<string | void>;
}

const defaultUser = { name: "Ada Lindqvist", email: "ada@northwind.dev" };

export function AuthLockScreen({
  user = defaultUser,
  reason = "Locked after 15 minutes of inactivity.",
  switchAccountHref = "/signin",
  forgotHref = "/forgot-password",
  onUnlock,
}: AuthLockScreenProps) {
  const [error, setError] = useState<string>();
  const [pending, setPending] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  return (
    <AuthCenter>
      <div className="text-center">
        <Avatar src={user.avatar} alt={user.name} size="lg" className="mx-auto size-20 text-xl" fallbackClassName="bg-linear-to-br from-accent/70 to-accent text-accent-fg" />
        <h1 className="mt-5 font-display text-3xl">{user.name}</h1>
        <p className="mt-1 text-sm break-all text-muted">{user.email}</p>
        <p className="mt-4 inline-flex items-center gap-1.5 rounded-control bg-fg/5 px-3 py-1 text-xs text-muted">
          <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
            <rect x="5" y="10.5" width="14" height="10" rx="2.5" />
            <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" />
          </svg>
          {unlocked ? "Unlocked" : reason}
        </p>
      </div>

      {unlocked ? (
        <p role="status" className="mt-8 rounded-control bg-success-soft px-4 py-3 text-center text-sm text-success">
          Welcome back, {user.name.split(" ")[0]}. Your session is open again.
        </p>
      ) : (
        <form
          noValidate
          className="mt-8 grid gap-4"
          onSubmit={async (e) => {
            e.preventDefault();
            const password = String(new FormData(e.currentTarget).get("password") ?? "");
            if (!password) return setError("Enter your password to unlock.");
            setError(undefined);
            setPending(true);
            const result = onUnlock ? await onUnlock(password) : await pretend();
            setPending(false);
            if (result) setError(result);
            else if (!onUnlock) setUnlocked(true);
          }}
        >
          <input type="email" name="username" autoComplete="username" value={user.email} readOnly hidden />
          <Input label="Password" name="password" type="password" autoComplete="current-password" required error={error} />
          <Button type="submit" variant="solid" size="lg" loading={pending} className="w-full">
            {pending ? "Unlocking…" : "Unlock"}
          </Button>
          {forgotHref && (
            <a href={forgotHref} className="text-center text-sm text-accent underline-offset-4 hover:underline">
              Forgot password?
            </a>
          )}
        </form>
      )}

      <p className="mt-8 border-t border-line pt-6 text-center text-sm text-muted">
        Not {user.name.split(" ")[0]}?{" "}
        <a href={switchAccountHref} className="text-fg underline-offset-4 hover:underline">
          Sign in as someone else
        </a>
      </p>
    </AuthCenter>
  );
}
