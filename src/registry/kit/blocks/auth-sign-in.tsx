"use client";

import { BrandMark } from "@/registry/kit/ui/brand-mark";
import { Checkbox } from "@/registry/kit/ui/checkbox";
import { useState } from "react";

import { AuroraBackdrop } from "@/registry/kit/ui/aurora-backdrop";
import { Button } from "@/registry/kit/ui/button";
import { Input } from "@/registry/kit/ui/field";

export interface AuthSignInProps {
  brand?: string;
  /** Brand mark beside the name. Defaults to a generic accent mark. */
  logo?: React.ReactNode;
  /** Where the brand links to. */
  homeHref?: string;
  /** Pass null when the product has no reset page. */
  forgotHref?: string | null;
  signUpHref?: string;
  /** Prefilled values, e.g. demo credentials so the form submits straight away. */
  defaultValues?: { email?: string; password?: string };
  /** Called when a social provider button is pressed. */
  onProvider?: (provider: string) => void;
  /** Called with the form values. Return an error message to show it under the password. */
  onSubmit?: (values: { email: string; password: string }) => string | void | Promise<string | void>;
}

const providers = [
  { name: "GitHub", path: "M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.3-3.4-1.3-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.6 2.4 1.1 3 .9.1-.7.4-1.1.6-1.4-2.2-.2-4.6-1.1-4.6-5a3.9 3.9 0 0 1 1-2.7 3.6 3.6 0 0 1 .1-2.7s.8-.3 2.8 1a9.6 9.6 0 0 1 5 0c1.9-1.3 2.8-1 2.8-1 .5 1.4.2 2.4.1 2.7a3.9 3.9 0 0 1 1 2.7c0 3.9-2.3 4.7-4.6 5 .4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5A10 10 0 0 0 12 2Z" },
  { name: "Google", path: "M21 12.2c0-.7-.1-1.3-.2-1.9H12v3.6h5a4.3 4.3 0 0 1-1.9 2.8v2.3h3A9 9 0 0 0 21 12.2ZM12 21a8.9 8.9 0 0 0 6.1-2.2l-3-2.3a5.5 5.5 0 0 1-8.2-2.9H3.8v2.4A9 9 0 0 0 12 21Zm-5.1-7.4a5.4 5.4 0 0 1 0-3.5V7.7H3.8a9 9 0 0 0 0 8.1l3.1-2.2ZM12 6.6a4.9 4.9 0 0 1 3.4 1.3l2.6-2.6A8.7 8.7 0 0 0 12 3a9 9 0 0 0-8.2 4.7l3.1 2.4A5.4 5.4 0 0 1 12 6.6Z" },
];

const looksLikeEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export function AuthSignIn({
  brand = "lumen",
  logo,
  homeHref = "/",
  forgotHref = "/forgot-password",
  signUpHref = "/signup",
  defaultValues,
  onProvider,
  onSubmit,
}: AuthSignInProps) {
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [pending, setPending] = useState(false);
  const [provider, setProvider] = useState<string>();
  const [notice, setNotice] = useState<string>();

  async function signInWith(name: string) {
    setNotice(undefined);
    if (onProvider) return onProvider(name);
    // No handler wired up: say so instead of doing nothing.
    setProvider(name);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setProvider(undefined);
    setNotice(`${name} sign-in isn't connected yet. Use your email and password for now.`);
  }

  return (
    <section className="relative isolate grid min-h-[max(44rem,100dvh)] place-items-center overflow-hidden bg-bg-deep px-6 py-16 text-fg">
      <AuroraBackdrop />
      <div className="surface w-full max-w-sm rounded-card p-8">
        <a href={homeHref} className="flex items-center gap-2 font-display text-2xl tracking-tight">
          {logo ?? <BrandMark />}
          {brand}
        </a>
        <h1 className="mt-8 font-display text-4xl">Welcome back</h1>
        <p className="mt-2 text-sm text-muted">Sign in to continue to your workspace.</p>

        <div className="mt-8 grid grid-cols-2 gap-3">
          {providers.map((p) => (
            <Button key={p.name} size="md" className="w-full" loading={provider === p.name} onClick={() => signInWith(p.name)}>
              <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden>
                <path d={p.path} />
              </svg>
              {p.name}
            </Button>
          ))}
        </div>
        {notice && (
          <p role="status" className="mt-3 text-center text-xs text-muted">
            {notice}
          </p>
        )}

        <div className="my-6 flex items-center gap-3 text-xs text-muted">
          <span className="h-px flex-1 bg-fg/10" />
          or with email
          <span className="h-px flex-1 bg-fg/10" />
        </div>

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
            // Without a handler the block still answers, so the button never feels dead.
            const result = onSubmit ? await onSubmit({ email, password }) : await new Promise<void>((resolve) => setTimeout(resolve, 700));
            setPending(false);
            if (result) setErrors({ password: result });
            else if (!onSubmit) setNotice(`Signed in as ${email}.`);
          }}
        >
          <Input label="Email" name="email" type="email" autoComplete="email" required defaultValue={defaultValues?.email} error={errors.email} />
          <Input label="Password" name="password" type="password" autoComplete="current-password" required defaultValue={defaultValues?.password} error={errors.password} />
          <div className="flex items-center justify-between text-sm">
            <label className="flex cursor-pointer items-center gap-2 text-muted">
              <Checkbox name="remember" />
              Remember me
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
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          New here?{" "}
          <a href={signUpHref} className="text-fg underline-offset-4 hover:underline">
            Create an account
          </a>
        </p>
      </div>
    </section>
  );
}
