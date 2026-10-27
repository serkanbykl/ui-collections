"use client";

import { useMemo, useState, type FormEvent } from "react";

import { cn } from "@/registry/kit/lib/utils";
import { Avatar } from "@/registry/kit/ui/avatar";
import { Badge } from "@/registry/kit/ui/badge";
import { Button, buttonVariants } from "@/registry/kit/ui/button";
import { Input } from "@/registry/kit/ui/field";
import { SearchInput } from "@/registry/kit/ui/search-input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/registry/kit/ui/sheet";
import { EmptyState } from "@/registry/kit/ui/states";
import { toast } from "@/registry/kit/ui/toast";
import { PageHeader } from "@/registry/kit/ui/page-header";

export interface Contact {
  id: string;
  name: string;
  role: string;
  company: string;
  email: string;
  phone?: string;
  location?: string;
  tags?: string[];
  favorite?: boolean;
  activity?: { text: string; when: string }[];
}

export const defaultContacts: Contact[] = [
  {
    id: "p1",
    name: "Amara Okafor",
    role: "Customer success lead",
    company: "Lumen",
    email: "amara@lumen.app",
    phone: "+44 20 7946 0381",
    location: "London",
    tags: ["Internal"],
    favorite: true,
    activity: [
      { text: "Shared the Kitebase renewal notes", when: "Sat" },
      { text: "Joined #customer-asks", when: "14 Oct" },
    ],
  },
  {
    id: "p2",
    name: "Hana Sato",
    role: "Head of growth",
    company: "Orbitly",
    email: "hana@orbitly.app",
    phone: "+81 3 4578 1290",
    location: "Tokyo",
    tags: ["Customer", "Growth plan"],
    activity: [
      { text: "Replied to “Custom events for onboarding”", when: "Sun" },
      { text: "QBR booked for 29 Oct, 14:30", when: "21 Oct" },
    ],
  },
  {
    id: "p3",
    name: "Jonas Lindqvist",
    role: "Engineering lead",
    company: "Lumen",
    email: "jonas@lumen.app",
    location: "Stockholm",
    tags: ["Internal"],
    favorite: true,
  },
  {
    id: "p4",
    name: "Lucía Moreno",
    role: "Product designer",
    company: "Lumen",
    email: "lucia@lumen.app",
    location: "Valencia",
    tags: ["Internal"],
  },
  {
    id: "p5",
    name: "Marcus Ode",
    role: "VP data",
    company: "Polaris",
    email: "marcus@polaris.co",
    phone: "+1 415 555 0147",
    location: "San Francisco",
    tags: ["Customer", "Enterprise"],
    activity: [{ text: "Sent the Q3 review deck", when: "23 Oct" }],
  },
  {
    id: "p6",
    name: "Priya Raman",
    role: "Product analyst",
    company: "Northwind",
    email: "priya@northwind.io",
    phone: "+91 80 4718 2265",
    location: "Bengaluru",
    tags: ["Customer", "Beta"],
    favorite: true,
    activity: [
      { text: "Reported a funnel drop at /pricing", when: "Today, 09:42" },
      { text: "Exported 48,213 cohort rows", when: "Yesterday" },
    ],
  },
  {
    id: "p7",
    name: "Tomás Ferreira",
    role: "Finance manager",
    company: "Kitebase",
    email: "tomas@kitebase.dev",
    location: "Lisbon",
    tags: ["Billing contact"],
  },
  { id: "p8", name: "Bilal Haddad", role: "Data engineer", company: "Northwind", email: "bilal@northwind.io", location: "Dubai", tags: ["Customer"] },
  { id: "p9", name: "Elif Demir", role: "Founder", company: "Patika Labs", email: "elif@patikalabs.com", location: "İzmir", tags: ["Trial"] },
  { id: "p10", name: "Grace Whitfield", role: "Analytics manager", company: "Kitebase", email: "grace@kitebase.dev", location: "Dublin", tags: ["Customer"] },
];

export interface ContactsScreenProps {
  contacts?: Contact[];
}

const emptyForm = { name: "", email: "", company: "", role: "", phone: "" };

/** Searchable A–Z contact list with a detail pane, favourites and an add-contact sheet. One pane at a time on small screens. */
export function ContactsScreen({ contacts: initial = defaultContacts }: ContactsScreenProps) {
  const [contacts, setContacts] = useState(initial);
  const [activeId, setActiveId] = useState<string | null>(initial[0]?.id ?? null);
  const [showDetail, setShowDetail] = useState(false);
  const [query, setQuery] = useState("");
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof typeof emptyForm, string>>>({});

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = contacts
      .filter((c) => !onlyFavorites || c.favorite)
      .filter((c) => !q || `${c.name} ${c.company} ${c.role} ${c.email} ${(c.tags ?? []).join(" ")}`.toLowerCase().includes(q))
      .sort((a, b) => a.name.localeCompare(b.name));
    const map = new Map<string, Contact[]>();
    for (const c of list) {
      const letter = c.name[0].toUpperCase();
      map.set(letter, [...(map.get(letter) ?? []), c]);
    }
    return [...map.entries()];
  }, [contacts, query, onlyFavorites]);

  const active = contacts.find((c) => c.id === activeId) ?? null;
  const count = groups.reduce((n, [, list]) => n + list.length, 0);

  function toggleFavorite(c: Contact) {
    setContacts((all) => all.map((x) => (x.id === c.id ? { ...x, favorite: !x.favorite } : x)));
    toast.success(c.favorite ? `Removed ${c.name} from favourites.` : `Added ${c.name} to favourites.`);
  }

  function copy(value: string, what: string) {
    void navigator.clipboard?.writeText(value).catch(() => {});
    toast.success(`Copied ${what}.`);
  }

  function save(e: FormEvent) {
    e.preventDefault();
    const next: typeof errors = {};
    if (!form.name.trim()) next.name = "Enter a name.";
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) next.email = "Enter an address like name@company.com.";
    else if (contacts.some((c) => c.email.toLowerCase() === form.email.trim().toLowerCase())) next.email = "A contact with this email already exists.";
    setErrors(next);
    if (Object.keys(next).length) return;
    const contact: Contact = {
      id: `p${contacts.length + 1}-${form.email.length}`,
      name: form.name.trim(),
      email: form.email.trim(),
      company: form.company.trim() || "—",
      role: form.role.trim() || "No role yet",
      phone: form.phone.trim() || undefined,
      tags: ["New"],
    };
    setContacts((all) => [...all, contact]);
    setActiveId(contact.id);
    setShowDetail(true);
    setAdding(false);
    setQuery("");
    setOnlyFavorites(false);
    toast.success(`Added ${contact.name}.`);
  }

  const field = (key: keyof typeof emptyForm, label: string, type = "text", hint?: string) => (
    <Input
      label={label}
      type={type}
      hint={hint}
      value={form[key]}
      error={errors[key]}
      onChange={(e) => {
        setErrors((x) => ({ ...x, [key]: undefined }));
        setForm((f) => ({ ...f, [key]: e.target.value }));
      }}
    />
  );

  return (
    <div className="grid min-w-0 grid-cols-1 gap-6">
      <PageHeader
        title="Contacts"
        description={`${contacts.length} people at ${new Set(contacts.map((c) => c.company)).size} companies · ${contacts.filter((c) => c.favorite).length} favorites`}
      />
      <div className="grid gap-4 md:grid-cols-[19rem_minmax(0,1fr)]">
        <section aria-label="Contacts" className={cn("surface grid min-w-0 content-start gap-3 rounded-card p-3", showDetail && "hidden md:grid")}>
          <div className="flex gap-2">
            <SearchInput value={query} onValueChange={setQuery} label="Search contacts" placeholder="Search contacts…" className="min-w-0 flex-1" />
            <Button
              variant="accent"
              size="icon"
              aria-label="Add contact"
              onClick={() => {
                setForm(emptyForm);
                setErrors({});
                setAdding(true);
              }}
            >
              <svg viewBox="0 0 24 24" className="size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden>
                <path d="M12 5v14M5 12h14" />
              </svg>
            </Button>
          </div>
          <div className="flex items-center justify-between gap-2 px-1 text-xs text-muted">
            <span aria-live="polite">
              {count} {count === 1 ? "contact" : "contacts"}
            </span>
            <Button size="sm" variant="ghost" aria-pressed={onlyFavorites} onClick={() => setOnlyFavorites((v) => !v)} className={cn(onlyFavorites && "text-warning")}>
              <svg viewBox="0 0 24 24" className="size-4 shrink-0" fill={onlyFavorites ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" aria-hidden>
                <path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.5 2.9 1.1-6.1L3.2 9.5l6.1-.9z" />
              </svg>
              Favourites only
            </Button>
          </div>
          {groups.length === 0 ? (
            <EmptyState
              size="compact"
              title="No contacts match"
              description="Search by name, company, role or tag."
              action={
                <Button
                  size="sm"
                  onClick={() => {
                    setQuery("");
                    setOnlyFavorites(false);
                  }}
                >
                  Show everyone
                </Button>
              }
            />
          ) : (
            <div className="grid gap-3">
              {groups.map(([letter, list]) => (
                <section key={letter} aria-labelledby={`contacts-${letter}`}>
                  <h3 id={`contacts-${letter}`} className="px-3 pb-1 text-xs font-semibold text-subtle">
                    {letter}
                  </h3>
                  <ul className="grid gap-0.5">
                    {list.map((c) => (
                      <li key={c.id}>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveId(c.id);
                            setShowDetail(true);
                          }}
                          aria-current={c.id === activeId ? "true" : undefined}
                          className={cn(
                            "grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-field p-2 text-left transition-colors hover:bg-surface-hover",
                            "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent",
                            c.id === activeId && "bg-surface-selected hover:bg-surface-selected",
                          )}
                        >
                          <Avatar alt={c.name} size="sm" />
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-medium">{c.name}</span>
                            <span className="block truncate text-xs text-muted">
                              {c.role} · {c.company}
                            </span>
                          </span>
                          {c.favorite && (
                            <svg viewBox="0 0 24 24" className="size-3.5 text-warning" fill="currentColor" role="img" aria-label="Favourite">
                              <path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.5 2.9 1.1-6.1L3.2 9.5l6.1-.9z" />
                            </svg>
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          )}
        </section>

        <section aria-label="Contact details" className={cn("surface min-w-0 rounded-card p-5 md:p-7", !showDetail && "hidden md:block")}>
          {active ? (
            <div className="grid gap-6">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setShowDetail(false)}>
                  <svg viewBox="0 0 24 24" className="size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                  All contacts
                </Button>
              </div>
              <header className="flex flex-wrap items-center gap-4">
                <Avatar alt={active.name} size="lg" />
                <div className="min-w-0 flex-1">
                  <h2 className="text-3xl font-semibold tracking-tight leading-tight">{active.name}</h2>
                  <p className="text-muted">
                    {active.role} at {active.company}
                  </p>
                  {active.tags && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {active.tags.map((t) => (
                        <Badge key={t} variant={t === "Internal" ? "outline" : t === "Customer" ? "accent" : "surface"}>
                          {t}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <Button variant="ghost" aria-pressed={active.favorite ?? false} onClick={() => toggleFavorite(active)} className={cn(active.favorite && "text-warning")}>
                  <svg viewBox="0 0 24 24" className="size-4 shrink-0" fill={active.favorite ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" aria-hidden>
                    <path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.5 2.9 1.1-6.1L3.2 9.5l6.1-.9z" />
                  </svg>
                  {active.favorite ? "Favourite" : "Add to favourites"}
                </Button>
              </header>

              <div className="flex flex-wrap gap-2">
                <a href={`mailto:${active.email}`} className={buttonVariants({ variant: "accent", size: "sm" })}>
                  Email {active.name.split(" ")[0]}
                </a>
                {active.phone && (
                  <a href={`tel:${active.phone.replace(/\s/g, "")}`} className={buttonVariants({ size: "sm" })}>
                    Call
                  </a>
                )}
              </div>

              <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
                {[
                  { label: "Email", value: active.email, copy: true },
                  { label: "Phone", value: active.phone, copy: true },
                  { label: "Company", value: active.company },
                  { label: "Location", value: active.location },
                ].map((row) => (
                  <div key={row.label} className="min-w-0">
                    <dt className="text-xs text-muted">{row.label}</dt>
                    <dd className="flex items-center gap-1 text-sm">
                      <span className="truncate">{row.value ?? <span className="text-subtle">Not added</span>}</span>
                      {row.copy && row.value && (
                        <Button variant="ghost" size="icon-sm" aria-label={`Copy ${row.label.toLowerCase()}`} onClick={() => copy(row.value!, `${active.name}'s ${row.label.toLowerCase()}`)}>
                          <svg viewBox="0 0 24 24" className="size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                            <rect x="9" y="9" width="11" height="11" rx="2" />
                            <path d="M5 15V5a1 1 0 0 1 1-1h10" />
                          </svg>
                        </Button>
                      )}
                    </dd>
                  </div>
                ))}
              </dl>

              <section aria-labelledby="contact-activity" className="grid gap-3 border-t border-line pt-5">
                <h3 id="contact-activity" className="text-sm font-medium">
                  Recent activity
                </h3>
                {active.activity?.length ? (
                  <ol className="grid gap-3">
                    {active.activity.map((a) => (
                      <li key={a.text} className="flex gap-3 text-sm">
                        <span className="mt-1.5 size-2 shrink-0 rounded-full bg-accent" aria-hidden />
                        <span className="flex-1">{a.text}</span>
                        <span className="shrink-0 text-xs text-muted">{a.when}</span>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p className="text-sm text-muted">No activity in the last 30 days.</p>
                )}
              </section>
            </div>
          ) : (
            <EmptyState title="No contact selected" description="Choose someone from the list to see their details." />
          )}
        </section>

        <Sheet open={adding} onOpenChange={setAdding}>
          <SheetContent>
            <form onSubmit={save} noValidate className="grid gap-4">
              <SheetHeader>
                <SheetTitle>Add contact</SheetTitle>
                <SheetDescription>Name and email are required.</SheetDescription>
              </SheetHeader>
              {field("name", "Full name")}
              {field("email", "Email", "email")}
              {field("company", "Company")}
              {field("role", "Role")}
              {field("phone", "Phone", "tel", "Include the country code, e.g. +44.")}
              <SheetFooter>
                <Button type="button" variant="ghost" onClick={() => setAdding(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="accent">
                  Save contact
                </Button>
              </SheetFooter>
            </form>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
