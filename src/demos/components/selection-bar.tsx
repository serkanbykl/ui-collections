"use client";

import { useState } from "react";

import { Button } from "@/registry/kit/ui/button";
import { Checkbox } from "@/registry/kit/ui/checkbox";
import { SelectionBar } from "@/registry/kit/ui/selection-bar";

const invoices = ["INV-2041 · Polaris", "INV-2042 · Orbitly", "INV-2043 · Marlow & Finch", "INV-2044 · Northwind"];

export default function SelectionBarDemo() {
  const [picked, setPicked] = useState<string[]>([invoices[0]!, invoices[2]!]);
  const [notice, setNotice] = useState("");
  return (
    <div className="grid w-full max-w-md gap-2">
      {invoices.map((name) => (
        <label key={name} className="surface flex cursor-pointer items-center gap-3 rounded-field px-4 py-3 text-sm">
          <Checkbox
            checked={picked.includes(name)}
            onCheckedChange={(on) => setPicked((all) => (on ? [...all, name] : all.filter((n) => n !== name)))}
          />
          {name}
        </label>
      ))}
      <p role="status" className="min-h-5 text-sm text-muted">{notice}</p>
      <SelectionBar count={picked.length} noun={["invoice", "invoices"]} onClear={() => setPicked([])}>
        <Button size="sm" onClick={() => setNotice(`Sent ${picked.length} reminder${picked.length === 1 ? "" : "s"}.`)}>
          Send reminders
        </Button>
        <Button size="sm" variant="danger" onClick={() => { setNotice(`Voided ${picked.length}.`); setPicked([]); }}>
          Void
        </Button>
      </SelectionBar>
    </div>
  );
}
