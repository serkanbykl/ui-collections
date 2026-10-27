"use client";

import { useState } from "react";

import { PageHero, type HeadingLevel } from "@/registry/kit/lib/page-kit";
import { cn } from "@/registry/kit/lib/utils";
import { Button } from "@/registry/kit/ui/button";
import { Input, Textarea } from "@/registry/kit/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/registry/kit/ui/select";

export interface Office {
  city: string;
  address: string[];
  hours: string;
  /** Position on the decorative map, in % of its width and height. */
  pin: { x: number; y: number };
  mapHref?: string;
}

export interface Channel {
  title: string;
  body: string;
  action: string;
  href: string;
}

export interface ContactMessage {
  name: string;
  email: string;
  topic: string;
  message: string;
}

export interface ContactPageProps {
  eyebrow?: string;
  title?: string;
  lead?: string;
  headingLevel?: HeadingLevel;
  channels?: Channel[];
  offices?: Office[];
  topics?: string[];
  privacyHref?: string;
  /** Sends the message. Return an error message to show it above the button. */
  onSubmit?: (message: ContactMessage) => string | void | Promise<string | void>;
}

const defaultChannels: Channel[] = [
  { title: "Sales", body: "Plans for 50+ seats, security reviews and invoicing.", action: "Email sales", href: "mailto:sales@lumen.dev" },
  { title: "Support", body: "Stuck on something? Median first reply is 2 hours 14 minutes.", action: "Open the help center", href: "/help" },
  { title: "Press", body: "Logos, screenshots and founder bios in one download.", action: "Get the press kit", href: "/press" },
];

const defaultOffices: Office[] = [
  { city: "Berlin", address: ["Linienstraße 214", "10119 Berlin, Germany"], hours: "Mon–Fri, 09:00–18:00 CET", pin: { x: 52.5, y: 33 }, mapHref: "https://maps.google.com/?q=Linienstra%C3%9Fe+214+Berlin" },
  { city: "Lisbon", address: ["Rua da Boavista 71", "1200-066 Lisboa, Portugal"], hours: "Mon–Fri, 09:00–18:00 WET", pin: { x: 46, y: 41 }, mapHref: "https://maps.google.com/?q=Rua+da+Boavista+71+Lisboa" },
  { city: "Toronto", address: ["317 Adelaide St W, Suite 500", "Toronto, ON M5V 1P9, Canada"], hours: "Mon–Fri, 09:00–17:00 ET", pin: { x: 27, y: 36 }, mapHref: "https://maps.google.com/?q=317+Adelaide+St+W+Toronto" },
];

const defaultTopics = ["Sales and pricing", "Product support", "Partnerships", "Press", "Something else"];

const looksLikeEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

/** Dotted world-ish backdrop with office pins. Decorative; the office cards carry the information. */
function MapIllustration({ offices, active }: { offices: Office[]; active?: string }) {
  // A coarse dot grid shaped by a few overlapping ellipses roughly where continents sit.
  const blobs = [
    [24, 34, 13, 12],
    [31, 64, 7, 15],
    [50, 34, 7, 8],
    [53, 58, 8, 15],
    [70, 36, 17, 13],
    [83, 68, 6, 5],
  ];
  const dots: [number, number][] = [];
  for (let x = 2; x < 100; x += 2.2) {
    for (let y = 8; y < 92; y += 4) {
      if (blobs.some(([cx, cy, rx, ry]) => ((x - cx!) / rx!) ** 2 + ((y - cy!) / ry!) ** 2 < 1)) dots.push([x, y]);
    }
  }
  return (
    <div aria-hidden className="surface relative aspect-[2/1] w-full overflow-hidden rounded-card">
      <svg viewBox="0 0 100 50" preserveAspectRatio="none" className="absolute inset-0 size-full text-fg/20">
        {dots.map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y / 2} r="0.42" fill="currentColor" />
        ))}
      </svg>
      {offices.map((office) => (
        <span
          key={office.city}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${office.pin.x}%`, top: `${office.pin.y}%` }}
        >
          <span className={cn("absolute inset-0 rounded-full bg-accent/40 motion-safe:animate-ping", active !== office.city && "hidden")} />
          <span className={cn("relative block size-3 rounded-full bg-accent ring-4 ring-accent/20 transition-[scale] duration-300 ease-theme", active === office.city && "scale-125")} />
          <span className="absolute top-4 left-1/2 -translate-x-1/2 rounded-control bg-bg/80 px-1.5 py-0.5 text-[11px] whitespace-nowrap text-fg">{office.city}</span>
        </span>
      ))}
    </div>
  );
}

export function ContactPage({
  eyebrow = "Contact",
  title = "Talk to a person, not a queue.",
  lead = "Pick the team that fits, or write to us below. Every message is read by someone who can actually help.",
  headingLevel = "h1",
  channels = defaultChannels,
  offices = defaultOffices,
  topics = defaultTopics,
  privacyHref = "/privacy",
  onSubmit,
}: ContactPageProps) {
  const [topic, setTopic] = useState(topics[0] ?? "");
  const [errors, setErrors] = useState<Partial<Record<keyof ContactMessage | "form", string>>>({});
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState<string>();
  const [activeOffice, setActiveOffice] = useState(offices[0]?.city);

  return (
    <section aria-label={headingLevel === "h1" ? undefined : title} className="bg-bg text-fg">
      <PageHero eyebrow={eyebrow} title={title} lead={lead} headingLevel={headingLevel}>
        <ul className="grid gap-3 md:grid-cols-3">
          {channels.map((c) => (
            <li key={c.title} className="surface flex flex-col rounded-card p-6">
              <h2 className="text-lg font-medium">{c.title}</h2>
              <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted">{c.body}</p>
              <a href={c.href} className="mt-5 inline-flex w-fit items-center gap-1.5 text-sm text-accent underline-offset-4 hover:underline">
                {c.action}
                <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </a>
            </li>
          ))}
        </ul>
      </PageHero>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16">
        <div>
          <h2 className="font-display text-4xl">Send us a message</h2>
          <p className="mt-3 text-muted">We reply within one working day, usually much sooner.</p>
          {sent ? (
            <div role="status" className="surface mt-8 rounded-card p-8">
              <p className="font-display text-3xl">Message sent</p>
              <p className="mt-2 text-muted">Thanks. We&apos;ll reply to {sent} within one working day.</p>
              <Button className="mt-6" onClick={() => setSent(undefined)}>
                Send another message
              </Button>
            </div>
          ) : (
            <form
              noValidate
              className="mt-8 grid gap-4"
              onSubmit={async (e) => {
                e.preventDefault();
                const data = new FormData(e.currentTarget);
                const values: ContactMessage = {
                  name: String(data.get("name") ?? "").trim(),
                  email: String(data.get("email") ?? "").trim(),
                  topic,
                  message: String(data.get("message") ?? "").trim(),
                };
                const found = {
                  name: values.name ? undefined : "Add your name so we know who to reply to.",
                  email: looksLikeEmail(values.email) ? undefined : "Enter an email like name@company.com.",
                  message: values.message.length >= 10 ? undefined : "Tell us a little more, at least a sentence.",
                };
                setErrors(found);
                if (Object.values(found).some(Boolean)) return;
                setPending(true);
                const result = onSubmit ? await onSubmit(values) : await new Promise<void>((r) => setTimeout(r, 800));
                setPending(false);
                if (result) setErrors({ form: result });
                else setSent(values.email);
              }}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="Name" name="name" autoComplete="name" required error={errors.name} />
                <Input label="Work email" name="email" type="email" autoComplete="email" required error={errors.email} />
              </div>
              <Select value={topic} onValueChange={setTopic}>
                <SelectTrigger aria-label="Topic" className="h-[3.25rem]">
                  <span className="flex gap-2">
                    <span className="text-muted">Topic</span>
                    <SelectValue />
                  </span>
                </SelectTrigger>
                <SelectContent>
                  {topics.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Textarea label="How can we help?" name="message" rows={6} required error={errors.message} />
              {errors.form && (
                <p role="alert" className="text-sm text-danger">
                  {errors.form}
                </p>
              )}
              <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-muted">
                  We only use your details to reply. See the{" "}
                  <a href={privacyHref} className="text-fg/85 underline-offset-4 hover:underline">
                    privacy policy
                  </a>
                  .
                </p>
                <Button type="submit" variant="solid" size="lg" loading={pending} className="shrink-0">
                  {pending ? "Sending…" : "Send message"}
                </Button>
              </div>
            </form>
          )}
        </div>

        <div>
          <MapIllustration offices={offices} active={activeOffice} />
          <h2 className="mt-10 font-display text-3xl">Offices</h2>
          <p className="mt-2 text-sm text-muted">Most of us work remotely. These are open for visits by appointment.</p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {offices.map((office) => (
              <li
                key={office.city}
                onPointerEnter={() => setActiveOffice(office.city)}
                onFocus={() => setActiveOffice(office.city)}
                className={cn("surface rounded-card p-5 transition-colors duration-300", activeOffice === office.city && "bg-surface-selected")}
              >
                <h3 className="font-medium">{office.city}</h3>
                <address className="mt-2 text-sm leading-relaxed text-muted not-italic">
                  {office.address.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </address>
                <p className="mt-2 text-xs text-muted">{office.hours}</p>
                {office.mapHref && (
                  <a href={office.mapHref} target="_blank" rel="noreferrer" className="mt-3 inline-block text-sm text-accent underline-offset-4 hover:underline">
                    Get directions<span className="sr-only"> to the {office.city} office (opens in a new tab)</span>
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
