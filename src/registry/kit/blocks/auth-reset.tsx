"use client";

import { useState } from "react";

import { AuthBrand, AuthCenter, AuthIcon, PasswordStrength, passwordStrength, pretend } from "@/registry/kit/lib/auth-kit";
import { Button, ButtonShine, buttonVariants } from "@/registry/kit/ui/button";
import { Input } from "@/registry/kit/ui/field";

export interface AuthResetProps {
  brand?: string;
  logo?: React.ReactNode;
  homeHref?: string;
  /** Where "Continue to sign in" goes after a successful reset. */
  signInHref?: string;
  /** Account shown above the form, so people know which password they're changing. */
  email?: string;
  /** Saves the password. Return an error message, e.g. for an expired link. */
  onSubmit?: (password: string) => string | void | Promise<string | void>;
}

export function AuthReset({ brand = "lumen", logo, homeHref = "/", signInHref = "/signin", email = "ada@northwind.dev", onSubmit }: AuthResetProps) {
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ password?: string; confirm?: string }>({});
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);

  return (
    <AuthCenter>
      <AuthBrand brand={brand} logo={logo} homeHref={homeHref} />
      {done ? (
        <div role="status" className="mt-8">
          <AuthIcon tone="success">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12.5l4.5 4.5L19 7.5" />
            </svg>
          </AuthIcon>
          <h1 className="mt-5 font-display text-4xl">Password updated</h1>
          <p className="mt-3 text-sm text-muted">Other devices were signed out. Use your new password from now on.</p>
          <a href={signInHref} className={buttonVariants({ variant: "solid", size: "lg", className: "mt-8 w-full" })}>
            <ButtonShine />
            Continue to sign in
          </a>
        </div>
      ) : (
        <>
          <h1 className="mt-8 font-display text-4xl">Choose a new password</h1>
          <p className="mt-2 text-sm text-muted">
            For <span className="text-fg">{email}</span>. Use 12 or more characters with a mix of letters and numbers.
          </p>
          <form
            noValidate
            className="mt-8 grid gap-4"
            onSubmit={async (e) => {
              e.preventDefault();
              const confirm = String(new FormData(e.currentTarget).get("confirm") ?? "");
              const found = {
                password: passwordStrength(password) >= 2 ? undefined : "Make it longer, or mix in capitals and numbers.",
                confirm: confirm === password ? undefined : "The passwords don't match.",
              };
              setErrors(found);
              if (found.password || found.confirm) return;
              setPending(true);
              const result = onSubmit ? await onSubmit(password) : await pretend();
              setPending(false);
              if (result) setErrors({ password: result });
              else setDone(true);
            }}
          >
            <input type="email" name="username" autoComplete="username" value={email} readOnly hidden />
            <div className="grid gap-3">
              <Input
                label="New password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
              />
              <PasswordStrength password={password} />
            </div>
            <Input label="Confirm password" name="confirm" type="password" autoComplete="new-password" required error={errors.confirm} />
            <Button type="submit" variant="solid" size="lg" loading={pending} className="mt-2 w-full">
              {pending ? "Saving…" : "Update password"}
            </Button>
          </form>
        </>
      )}
    </AuthCenter>
  );
}
