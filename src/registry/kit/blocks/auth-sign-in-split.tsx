"use client";

import { useState } from "react";

import { AuthBrand, AuthDivider, AuthSplit, looksLikeEmail, pretend, ProviderButtons, type AuthQuote } from "@/registry/kit/lib/auth-kit";
import { Button } from "@/registry/kit/ui/button";
import { Checkbox } from "@/registry/kit/ui/checkbox";
import { Input } from "@/registry/kit/ui/field";

export interface AuthSignInSplitProps {
  brand?: string;
  logo?: React.ReactNode;
  homeHref?: string;
  /** Pass null when the product has no reset page. */
  forgotHref?: string | null;
  signUpHref?: string;
  /** Customer quote in the brand panel (wide screens only). */
  quote?: AuthQuote;
  proof?: string;
  /** Which side the form sits on at desktop widths. */
  formSide?: "left" | "right";
  defaultValues?: { email?: string; password?: string };
  onProvider?: (provider: string) => void;
  /** Return an error message to show it under the password. */
  onSubmit?: (values: { email: string; password: string; remember: boolean }) => string | void | Promise<string | void>;
}

const defaultQuote: AuthQuote = {
  quote: "We moved 38 client projects over in a week. Reviews that took two days now close before lunch.",
  name: "Mira Okafor",
  role: "Head of Delivery, Northwind Studio",
};

export function AuthSignInSplit({
  brand = "lumen",
  logo,
  homeHref = "/",
  forgotHref = "/forgot-password",
  signUpHref = "/signup",
  quote = defaultQuote,
  proof = "Used by 4,183 teams across 61 countries.",
  formSide = "left",
  defaultValues,
  onProvider,
  onSubmit,
}: AuthSignInSplitProps) {
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [pending, setPending] = useState(false);
  const [notice, setNotice] = useState<string>();

  return (
    <AuthSplit quote={quote} proof={proof} side={formSide === "left" ? "right" : "left"}>
      <AuthBrand brand={brand} logo={logo} homeHref={homeHref} />
      <h1 className="mt-10 font-display text-4xl">Welcome back</h1>
      <p className="mt-2 text-sm text-muted">Sign in to pick up where your team left off.</p>

      <div className="mt-8">
        <ProviderButtons onProvider={onProvider} />
      </div>
      <AuthDivider />

      <form
        noValidate
        className="grid gap-4"
        onSubmit={async (e) => {
          e.preventDefault();
          const data = new FormData(e.currentTarget);
          const email = String(data.get("email") ?? "").trim();
          const password = String(data.get("password") ?? "");
          const found = {
            email: looksLikeEmail(email) ? undefined : "Enter the email you signed up with.",
            password: password ? undefined : "Enter your password.",
          };
          setErrors(found);
          if (found.email || found.password) return;
          setPending(true);
          setNotice(undefined);
          const result = onSubmit ? await onSubmit({ email, password, remember: data.get("remember") === "on" }) : await pretend();
          setPending(false);
          if (result) setErrors({ password: result });
          else if (!onSubmit) setNotice(`Signed in as ${email}.`);
        }}
      >
        <Input label="Email" name="email" type="email" autoComplete="email" required defaultValue={defaultValues?.email} error={errors.email} />
        <Input label="Password" name="password" type="password" autoComplete="current-password" required defaultValue={defaultValues?.password} error={errors.password} />
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
          <label className="flex cursor-pointer items-center gap-2 text-muted">
            <Checkbox name="remember" />
            Keep me signed in
          </label>
          {forgotHref && (
            <a href={forgotHref} className="text-accent underline-offset-4 hover:underline">
              Forgot password?
            </a>
          )}
        </div>
        <Button type="submit" variant="solid" size="lg" loading={pending} className="mt-2 w-full">
          {pending ? "Signing in…" : "Sign in"}
        </Button>
        {notice && (
          <p role="status" className="text-center text-sm text-success">
            {notice}
          </p>
        )}
      </form>

      <p className="mt-8 text-center text-sm text-muted">
        New to {brand}?{" "}
        <a href={signUpHref} className="text-fg underline-offset-4 hover:underline">
          Create an account
        </a>
      </p>
    </AuthSplit>
  );
}
