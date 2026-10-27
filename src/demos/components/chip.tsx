"use client";

import { useState } from "react";

import { Avatar } from "@/registry/kit/ui/avatar";
import { Chip, ChipGroup, ChipInput } from "@/registry/kit/ui/chip";

const statuses = [
  { value: "open", label: "Open", count: 12 },
  { value: "review", label: "In review", count: 4 },
  { value: "blocked", label: "Blocked", count: 2 },
  { value: "done", label: "Done", count: 31 },
];

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ChipDemo() {
  const [status, setStatus] = useState<string[]>(["open", "review"]);
  const [range, setRange] = useState<string | null>("30d");
  const [tags, setTags] = useState(["pricing", "onboarding"]);
  const [people, setPeople] = useState(["ada@lumen.example"]);

  return (
    <div className="grid w-full max-w-xl gap-7">
      <section className="grid gap-2.5">
        <p className="text-sm font-medium">Filter chips</p>
        <ChipGroup multiple label="Filter by status" options={statuses} value={status} onValueChange={setStatus} />
        <ChipGroup
          size="sm"
          label="Date range"
          options={[
            { value: "7d", label: "7 days" },
            { value: "30d", label: "30 days" },
            { value: "90d", label: "90 days" },
            { value: "12m", label: "12 months" },
          ]}
          value={range}
          onValueChange={setRange}
        />
      </section>

      <section className="grid gap-2.5">
        <p className="text-sm font-medium">Removable chips</p>
        <div className="flex flex-wrap gap-2">
          {tags.map((t) => (
            <Chip key={t} onRemove={() => setTags((all) => all.filter((x) => x !== t))}>
              {t}
            </Chip>
          ))}
          <Chip
            icon={<Avatar alt="" fallback="MO" size="sm" className="-ml-1.5 size-6 text-[10px]" fallbackClassName="bg-accent/15 text-accent" />}
            onClick={() => setTags((all) => (all.includes("assigned") ? all : [...all, "assigned"]))}
          >
            Assign to Mina
          </Chip>
        </div>
      </section>

      <ChipInput
        label="Invite by email"
        value={people}
        onValueChange={setPeople}
        placeholder="name@company.com, then Enter"
        validate={(entry) => (emailPattern.test(entry) ? null : `“${entry}” isn't an email address.`)}
        max={5}
      />
    </div>
  );
}
