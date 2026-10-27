"use client";

import { useState } from "react";

import {
  AuthBrand,
  AuthDivider,
  AuthSplit,
  looksLikeEmail,
  PasswordStrength,
  pretend,
  ProviderButtons,
  type AuthQuote,
} from "@/registry/kit/lib/auth-kit";
import { Button } from "@/registry/kit/ui/button";
import { Input } from "@/registry/kit/ui/field";

export interface AuthSignUpSplitProps {
  brand?: string;
  logo?: React.ReactNode;
  homeHref?: string;
  signInHref?: string;
  termsHref?: string;
  privacyHref?: string;
  quote?: AuthQuote;
  proof?: string;
  formSide?: "left" | "right";
  defaultValues?: { name?: string; email?: string; password?: string };
  onProvider?: (provider: string) => void;
  /** Called instead of the built-in "Check your inbox" state. Return an error message to show it. */
  onSubmit?: (values: { name: string; email: string; password: string }) => string | void | Promise<string | void>;
}

const defaultQuote: AuthQuote = {
  quote: "Setup took 11 minutes. By Friday our support queue was down to a third of what it was.",
  name: "Daniel Reyes",
  role: "Founder, Tallyhost",
};

export function AuthSignUpSplit({
  brand = "lumen",
  logo,
  homeHref = "/",
  signInHref = "/signin",
  termsHref = "/terms",
  privacyHref = "/privacy",
  quote = defaultQuote,
  proof = "14-day trial. No card needed.",
  formSide = "left",
  defaultValues,
  onProvider,
  onSubmit,
}: AuthSignUpSplitProps) {
  const [password, setPassword] = useState(defaultValues?.password ?? "");
  const [errors, setErrors] = useState<Partial<Record<"name" | "email" | "password", string>>>({});
  const [pending, setPending] = useState(false);
  const [sentTo, setSentTo] = useState<string>();

  return (
    <AuthSplit quote={quote} proof={proof} side={formSide === "left" ? "right" : "left"}>
      <AuthBrand brand={brand} logo={logo} homeHref={homeHref} />
      {sentTo ? (
        <div role="status" className="mt-10">
          <h1 className="font-display text-4xl">Check your inbox</h1>
          <p className="mt-3 text-sm text-muted">
            We sent a confirmation link to <span className="text-fg">{sentTo}</span>. It expires in 24 hours.
          </p>
          <Button className="mt-8 w-full" onClick={() => setSentTo(undefined)}>
            Use a different email
          </Button>
        </div>
      ) : (
        <>
          <h1 className="mt-10 font-display text-4xl">Create your account</h1>
          <p className="mt-2 text-sm text-muted">Free for 14 days, then $19 per seat each month.</p>

          <div className="mt-8">
            <ProviderButtons onProvider={onProvider} verb="Sign up" />
          </div>
          <AuthDivider />

          <form
            noValidate
            className="grid gap-4"
            onSubmit={async (e) => {
              e.preventDefault();
              const data = new FormData(e.currentTarget);
              const name = String(data.get("name") ?? "").trim();
              const email = String(data.get("email") ?? "").trim();
              const found = {
                name: name ? undefined : "Add your full name.",
                email: looksLikeEmail(email) ? undefined : "Enter a work email like name@company.com.",
                password: password.length >= 8 ? undefined : "Use at least 8 characters.",
              };
              setErrors(found);
              if (Object.values(found).some(Boolean)) return;
              setPending(true);
              const result = onSubmit ? await onSubmit({ name, email, password }) : await pretend();
              setPending(false);
              if (result) setErrors({ email: result });
              else if (!onSubmit) setSentTo(email);
            }}
          >
            <Input label="Full name" name="name" autoComplete="name" required defaultValue={defaultValues?.name} error={errors.name} />
            <Input label="Work email" name="email" type="email" autoComplete="email" required defaultValue={defaultValues?.email} error={errors.email} />
            <div className="grid gap-3">
              <Input
                label="Password"
                name="password"
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
              />
              <PasswordStrength password={password} />
            </div>
            <Button type="submit" variant="solid" size="lg" loading={pending} className="mt-2 w-full">
              {pending ? "Creating account…" : "Create account"}
            </Button>
            <p className="text-center text-xs text-muted">
              By signing up you agree to the{" "}
              <a href={termsHref} className="text-fg/85 underline-offset-4 hover:underline">
                Terms
              </a>{" "}
              and{" "}
              <a href={privacyHref} className="text-fg/85 underline-offset-4 hover:underline">
                Privacy Policy
              </a>
              .
            </p>
          </form>
        </>
      )}

      <p className="mt-8 text-center text-sm text-muted">
        Already have an account?{" "}
        <a href={signInHref} className="text-fg underline-offset-4 hover:underline">
          Sign in
        </a>
      </p>
    </AuthSplit>
  );
}
