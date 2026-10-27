"use client";

import { useState } from "react";

import { defaultRoles, type Role } from "@/registry/kit/blocks/careers";
import { Badge } from "@/registry/kit/ui/badge";
import { Breadcrumb } from "@/registry/kit/ui/breadcrumb";
import { Button, buttonVariants } from "@/registry/kit/ui/button";
import { Checkbox } from "@/registry/kit/ui/checkbox";
import { Input, Textarea } from "@/registry/kit/ui/field";
import { FileUpload } from "@/registry/kit/ui/file-upload";
import { AuroraBackdrop } from "@/registry/kit/ui/aurora-backdrop";

export interface RoleDetail {
  about: string;
  responsibilities: string[];
  requirements: string[];
  niceToHave?: string[];
  process?: string[];
}

export interface Application {
  name: string;
  email: string;
  link: string;
  resume?: File;
  note: string;
}

export interface CareersRoleProps {
  role?: Role;
  detail?: RoleDetail;
  careersHref?: string;
  privacyHref?: string;
  /** Sends the application. Return an error message to show it above the button. */
  onApply?: (application: Application) => string | void | Promise<string | void>;
}

const defaultDetail: RoleDetail = {
  about:
    "Reviews are where Lumen earns its keep. You'll join a team of four that owns the review flow end to end: the data model, the API, the interface and the support tickets that come with it. Last quarter the team cut median review time from 3.4 hours to 52 minutes, and there is plenty left to do.",
  responsibilities: [
    "Ship features across a TypeScript stack: Postgres, a Node API and a React front end.",
    "Write the short design docs that decide what we build, and the ones that decide what we don't.",
    "Pair with design on interaction details, from keyboard flows to empty states.",
    "Take a turn on support one week in six, and fix what you find.",
  ],
  requirements: [
    "6+ years building web products people pay for.",
    "Strong TypeScript and SQL, and comfort reading a query plan.",
    "Clear written English. Most of our decisions happen in documents.",
  ],
  niceToHave: ["Experience with real-time collaboration (CRDTs, presence, conflict handling).", "You've run a small open-source project."],
  process: ["30-minute intro call", "Take-home, paid at €400, or a past project walkthrough", "Two 60-minute conversations with the team", "Reference calls and an offer within 10 working days"],
};

const looksLikeEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="mt-4 grid gap-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3 leading-relaxed text-fg/85">
          <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
          {item}
        </li>
      ))}
    </ul>
  );
}

export function CareersRole({
  role = defaultRoles[0]!,
  detail = defaultDetail,
  careersHref = "/careers",
  privacyHref = "/privacy",
  onApply,
}: CareersRoleProps) {
  const [errors, setErrors] = useState<Partial<Record<keyof Application | "consent" | "form", string>>>({});
  const [file, setFile] = useState<File>();
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState<string>();

  return (
    <article className="bg-bg text-fg">
      <header className="relative isolate overflow-hidden bg-bg-deep pt-20 pb-14 md:pt-28">
        <AuroraBackdrop grid={false} className="opacity-60" />
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Breadcrumb items={[{ label: "Careers", href: careersHref }, { label: role.team, href: careersHref }, { label: role.title }]} />
          <h1 className="mt-6 max-w-3xl font-display text-5xl leading-[1.02] md:text-6xl">{role.title}</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted">{role.summary}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Badge variant="accent">{role.team}</Badge>
            <Badge variant="outline">{role.location}</Badge>
            <Badge variant="outline">{role.type}</Badge>
            {role.salary && <Badge variant="outline">{role.salary}</Badge>}
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-16">
        <div className="grid gap-12">
          <section aria-labelledby="role-about">
            <h2 id="role-about" className="font-display text-3xl">
              About the role
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-fg/85">{detail.about}</p>
          </section>
          <section aria-labelledby="role-do">
            <h2 id="role-do" className="font-display text-3xl">
              What you&apos;ll do
            </h2>
            <Bullets items={detail.responsibilities} />
          </section>
          <section aria-labelledby="role-bring">
            <h2 id="role-bring" className="font-display text-3xl">
              What you&apos;ll bring
            </h2>
            <Bullets items={detail.requirements} />
            {detail.niceToHave && (
              <>
                <h3 className="mt-8 font-medium">Nice to have</h3>
                <Bullets items={detail.niceToHave} />
              </>
            )}
          </section>
          {detail.process && (
            <section aria-labelledby="role-process">
              <h2 id="role-process" className="font-display text-3xl">
                How we hire
              </h2>
              <ol className="mt-6 grid gap-4 sm:grid-cols-2">
                {detail.process.map((step, i) => (
                  <li key={step} className="surface rounded-card p-5">
                    <span className="font-display text-xl text-accent tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                    <p className="mt-2 text-sm leading-relaxed">{step}</p>
                  </li>
                ))}
              </ol>
            </section>
          )}

          <section id="apply" aria-labelledby="role-apply" className="scroll-mt-20 border-t border-line pt-12">
            <h2 id="role-apply" className="font-display text-4xl">
              Apply for this role
            </h2>
            {sent ? (
              <div role="status" className="surface mt-6 rounded-card p-8">
                <p className="font-display text-3xl">Application received</p>
                <p className="mt-2 text-muted">
                  Thanks, {sent}. A person on the hiring team reads every application and replies within 5 working days.
                </p>
                <a href={careersHref} className={buttonVariants({ className: "mt-6" })}>
                  Browse other roles
                </a>
              </div>
            ) : (
              <form
                noValidate
                className="mt-6 grid gap-4"
                onSubmit={async (e) => {
                  e.preventDefault();
                  const data = new FormData(e.currentTarget);
                  const values: Application = {
                    name: String(data.get("name") ?? "").trim(),
                    email: String(data.get("email") ?? "").trim(),
                    link: String(data.get("link") ?? "").trim(),
                    note: String(data.get("note") ?? "").trim(),
                    resume: file,
                  };
                  const found = {
                    name: values.name ? undefined : "Add your full name.",
                    email: looksLikeEmail(values.email) ? undefined : "Enter an email like name@company.com.",
                    resume: file || values.link ? undefined : "Attach a CV or add a link to your work.",
                    consent: data.get("consent") === "on" ? undefined : "Tick the box so we can store your application.",
                  };
                  setErrors(found);
                  if (Object.values(found).some(Boolean)) return;
                  setPending(true);
                  const result = onApply ? await onApply(values) : await new Promise<void>((r) => setTimeout(r, 900));
                  setPending(false);
                  if (result) setErrors({ form: result });
                  else setSent(values.name.split(" ")[0]);
                }}
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input label="Full name" name="name" autoComplete="name" required error={errors.name} />
                  <Input label="Email" name="email" type="email" autoComplete="email" required error={errors.email} />
                </div>
                <Input label="LinkedIn, GitHub or portfolio" name="link" type="url" autoComplete="url" hint="Optional if you attach a CV." />

                <FileUpload
                  variant="compact"
                  multiple={false}
                  name="resume"
                  accept=".pdf,.doc,.docx"
                  maxSize={8 * 1024 * 1024}
                  label="Attach your CV"
                  hint="PDF or DOCX, up to 8 MB"
                  error={errors.resume}
                  onItemsChange={(items) => {
                    setFile(items[0]?.file);
                    if (items.length) setErrors((prev) => ({ ...prev, resume: undefined }));
                  }}
                />

                <Textarea label="Anything you'd like us to know" name="note" rows={4} hint="Optional. A few lines is plenty." />

                <div>
                  <label className="flex cursor-pointer items-start gap-3 text-sm text-muted">
                    <Checkbox name="consent" className="mt-0.5" aria-invalid={errors.consent ? true : undefined} />
                    <span>
                      Keep my application for 12 months in line with the{" "}
                      <a href={privacyHref} className="text-fg/85 underline-offset-4 hover:underline">
                        privacy policy
                      </a>
                      .
                    </span>
                  </label>
                  {errors.consent && <p className="mt-2 px-1 text-xs text-danger">{errors.consent}</p>}
                </div>

                {errors.form && (
                  <p role="alert" className="text-sm text-danger">
                    {errors.form}
                  </p>
                )}
                <Button type="submit" variant="solid" size="lg" loading={pending} className="mt-2 w-full sm:w-fit">
                  {pending ? "Sending application…" : "Submit application"}
                </Button>
              </form>
            )}
          </section>
        </div>

        <aside aria-label="Role summary" className="lg:sticky lg:top-24 lg:self-start">
          <div className="surface rounded-card p-6">
            <dl className="grid gap-4 text-sm">
              {[
                ["Team", role.team],
                ["Location", role.location],
                ["Type", role.type],
                ...(role.salary ? [["Salary", role.salary]] : []),
                ...(role.posted ? [["Posted", new Date(role.posted).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" })]] : []),
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4">
                  <dt className="text-muted">{label}</dt>
                  <dd className="text-right">{value}</dd>
                </div>
              ))}
            </dl>
            <a href="#apply" className={buttonVariants({ variant: "solid", className: "mt-6 w-full" })}>
              Apply now
            </a>
            <a href={careersHref} className="mt-3 block text-center text-sm text-muted underline-offset-4 hover:text-fg hover:underline">
              See all open roles
            </a>
          </div>
        </aside>
      </div>
    </article>
  );
}
