"use client";

import { useState } from "react";

import { AuroraBackdrop } from "@/registry/kit/ui/aurora-backdrop";
import { Button } from "@/registry/kit/ui/button";
import { Input, Textarea } from "@/registry/kit/ui/field";
import { Reveal } from "@/registry/kit/ui/reveal";

export interface ContactValues {
  name: string;
  email: string;
  company: string;
  message: string;
}

type Errors = Partial<Record<keyof ContactValues, string>>;

const looksLikeEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

function validate(v: ContactValues): Errors {
  const errors: Errors = {};
  if (!v.name) errors.name = "Add your name so we know who to reply to.";
  if (!looksLikeEmail(v.email)) errors.email = "Enter a work email like name@company.com.";
  if (v.message.length < 10) errors.message = "Tell us a little more, at least a sentence.";
  return errors;
}

export function ContactSplit({
  title = "Let's talk.",
  description = "Questions about plans, migrations or security reviews? A person replies within one working day.",
  email = "hello@lumen.dev",
  onSubmit,
}: {
  title?: string;
  description?: string;
  /** Shown as a mailto link beside the form. */
  email?: string;
  /** Sends the message. Throw to show an inline error. Without it the block simulates a send. */
  onSubmit?: (values: ContactValues) => void | Promise<void>;
}) {
  const [sent, setSent] = useState(false);
  const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [failure, setFailure] = useState<string>();

  const details = [
    { label: "Email", value: <a href={`mailto:${email}`} className="underline-offset-4 hover:underline">{email}</a> },
    { label: "Support hours", value: "Mon – Fri · 09:00 – 18:00 CET" },
    { label: "Office", value: "Remote-first, three time zones" },
  ];

  return (
    <section className="relative isolate overflow-hidden bg-bg-deep px-6 py-24 text-fg md:px-8 md:py-32">
      <AuroraBackdrop grid={false} className="opacity-50" />
      <div className="mx-auto grid max-w-6xl items-start gap-12 md:grid-cols-5 md:gap-16">
        <div className="md:col-span-2">
          <h2 className="font-display text-5xl leading-[1.02] md:text-6xl">{title}</h2>
          <p className="mt-5 text-lg leading-relaxed text-muted">{description}</p>
          <dl className="mt-10 grid gap-5">
            {details.map((d) => (
              <div key={d.label}>
                <dt className="text-xs tracking-[0.2em] text-muted uppercase">{d.label}</dt>
                <dd className="mt-1">{d.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="md:col-span-3">
          {sent ? (
            <Reveal trigger="load" role="status" className="surface rounded-card px-6 py-16 text-center">
              <p className="font-display text-4xl">Message sent.</p>
              <p className="mt-3 text-sm text-muted">We&apos;ll reply to you within one working day.</p>
            </Reveal>
          ) : (
            <form
              noValidate
              onSubmit={async (e) => {
                e.preventDefault();
                const data = new FormData(e.currentTarget);
                const values: ContactValues = {
                  name: String(data.get("name") ?? "").trim(),
                  email: String(data.get("email") ?? "").trim(),
                  company: String(data.get("company") ?? "").trim(),
                  message: String(data.get("message") ?? "").trim(),
                };
                const found = validate(values);
                setErrors(found);
                setFailure(undefined);
                if (Object.keys(found).length) return;
                setPending(true);
                try {
                  await (onSubmit ? onSubmit(values) : new Promise((resolve) => setTimeout(resolve, 800)));
                  setSent(true);
                } catch {
                  setFailure(`We couldn't send your message. Try again, or write to ${email}.`);
                } finally {
                  setPending(false);
                }
              }}
              className="surface grid gap-4 rounded-card p-6 md:p-8"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="Name" name="name" autoComplete="name" required error={errors.name} />
                <Input label="Work email" name="email" type="email" autoComplete="email" required error={errors.email} />
              </div>
              <Input label="Company" name="company" autoComplete="organization" hint="Optional" />
              <Textarea label="How can we help?" name="message" required error={errors.message} />
              {failure && (
                <p role="alert" className="text-sm text-danger">
                  {failure}
                </p>
              )}
              <Button type="submit" variant="solid" size="lg" loading={pending} className="justify-self-start">
                {pending ? "Sending…" : "Send message"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
