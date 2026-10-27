"use client";

import { useState } from "react";

import { cn } from "@/registry/kit/lib/utils";
import { BrandMark } from "@/registry/kit/ui/brand-mark";
import { AuroraBackdrop } from "@/registry/kit/ui/aurora-backdrop";
import { Button } from "@/registry/kit/ui/button";
import { Input } from "@/registry/kit/ui/field";

const defaultPerks = ["Unlimited preview deploys", "Free custom domains", "No card required for 14 days"];

export interface AuthSignUpProps {
  brand?: string;
  /** Brand mark beside the name. Defaults to a generic accent mark. */
  logo?: React.ReactNode;
  title?: string;
  perks?: string[];
  /** Where the brand links to. */
  homeHref?: string;
  /** Shows an "Already have an account?" link when set. */
  signInHref?: string;
  termsHref?: string;
  privacyHref?: string;
  /** Prefilled values, e.g. demo details so the form submits straight away. */
  defaultValues?: { firstName?: string; lastName?: string; email?: string; password?: string };
  /** Called with the form values instead of showing the built-in "Check your inbox" state. */
  onSubmit?: (values: { name: string; email: string; password: string }) => void;
}

function strength(password: string) {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/\d/.test(password) || /[^A-Za-z0-9]/.test(password)) score++;
  return score;
}

const labels = ["Too short", "Weak", "Fair", "Good", "Strong"];

export function AuthSignUp({
  brand = "lumen",
  logo,
  title = "Start shipping in minutes.",
  perks = defaultPerks,
  homeHref = "/",
  signInHref = "/signin",
  termsHref = "/terms",
  privacyHref = "/privacy",
  defaultValues,
  onSubmit,
}: AuthSignUpProps) {
  const [password, setPassword] = useState(defaultValues?.password ?? "");
  const [done, setDone] = useState(false);
  const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<"firstName" | "lastName" | "email" | "password", string>>>({});
  const score = strength(password);

  return (
    <section className="relative isolate overflow-hidden bg-bg-deep text-fg">
      <AuroraBackdrop grid={false} />
      <div className="mx-auto grid min-h-[max(44rem,100dvh)] max-w-6xl items-center gap-12 px-6 py-16 md:grid-cols-2 md:px-8">
        <div>
          <a href={homeHref} className="flex items-center gap-2 font-display text-2xl tracking-tight">
            {logo ?? <BrandMark />}
            {brand}
          </a>
          <h1 className="mt-10 font-display text-5xl leading-[1.02] md:text-6xl">{title}</h1>
          <ul className="mt-8 grid gap-3">
            {perks.map((perk) => (
              <li key={perk} className="flex items-center gap-3 text-fg/85">
                <span className="surface grid size-7 place-items-center rounded-full text-accent">
                  <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
                    <path d="M5 12.5l4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                {perk}
              </li>
            ))}
          </ul>
        </div>

        <div className="surface rounded-card p-8">
          {done ? (
            <div role="status" className="py-16 text-center">
              <p className="font-display text-4xl">Check your inbox.</p>
              <p className="mt-3 text-sm text-muted">We sent a link to verify your email.</p>
            </div>
          ) : (
            <form
              noValidate
              className="grid gap-4"
              onSubmit={async (e) => {
                e.preventDefault();
                const data = new FormData(e.currentTarget);
                const firstName = String(data.get("given-name") ?? "").trim();
                const lastName = String(data.get("family-name") ?? "").trim();
                const email = String(data.get("email") ?? "").trim();
                const found = {
                  firstName: firstName ? undefined : "Add your first name.",
                  lastName: lastName ? undefined : "Add your last name.",
                  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? undefined : "Enter a work email like name@company.com.",
                  password: password.length >= 8 ? undefined : "Use at least 8 characters.",
                };
                setErrors(found);
                if (Object.values(found).some(Boolean)) return;
                setPending(true);
                if (onSubmit) {
                  await onSubmit({ name: `${firstName} ${lastName}`, email, password });
                  setPending(false);
                  return;
                }
                await new Promise((resolve) => setTimeout(resolve, 700));
                setPending(false);
                setDone(true);
              }}
            >
              <h2 className="font-display text-3xl">Create your account</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="First name" name="given-name" autoComplete="given-name" required defaultValue={defaultValues?.firstName} error={errors.firstName} />
                <Input label="Last name" name="family-name" autoComplete="family-name" required defaultValue={defaultValues?.lastName} error={errors.lastName} />
              </div>
              <Input label="Work email" name="email" type="email" autoComplete="email" required defaultValue={defaultValues?.email} error={errors.email} />
              <div>
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
                <div className="mt-3 flex items-center gap-3" aria-live="polite">
                  <div className="flex flex-1 gap-1" aria-hidden>
                    {[1, 2, 3, 4].map((step) => (
                      <span
                        key={step}
                        className={cn(
                          "h-1 flex-1 rounded-full transition-colors duration-300",
                          score >= step ? (score >= 3 ? "bg-accent" : "bg-warning") : "bg-fg/10",
                        )}
                      />
                    ))}
                  </div>
                  <span className="w-16 text-right text-xs text-muted">{password ? labels[score] : ""}</span>
                </div>
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
              {signInHref && (
                <p className="text-center text-sm text-muted">
                  Already have an account?{" "}
                  <a href={signInHref} className="text-fg underline-offset-4 hover:underline">
                    Sign in
                  </a>
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
