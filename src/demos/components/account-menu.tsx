"use client";

import { useState } from "react";

import { AccountMenu } from "@/registry/kit/ui/account-menu";

const icon = (d: string) => (
  <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d={d} />
  </svg>
);

export default function AccountMenuDemo() {
  // In an app, pass `href` (and `linkAs` for your router) instead of onSelect.
  const [last, setLast] = useState<string | null>(null);
  const pick = (label: string) => () => setLast(label);

  return (
    <div className="flex flex-col items-center gap-6">
      <AccountMenu
        name="Ada Kaya"
        email="ada@lumen.example"
        items={[
          { label: "Your profile", icon: icon("M20 21a8 8 0 0 0-16 0M12 13a5 5 0 1 0 0-10 5 5 0 0 0 0 10"), onSelect: pick("Your profile") },
          { label: "Settings", icon: icon("M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19 12h2M3 12h2M12 3v2M12 19v2"), onSelect: pick("Settings") },
          { label: "Help center", icon: icon("M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6M12 17h.01"), onSelect: pick("Help center") },
          { label: "Sign out", icon: icon("M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 17l5-5-5-5M15 12H4"), separated: true, variant: "danger", onSelect: pick("Sign out") },
        ]}
      />
      <p className="text-sm text-muted" aria-live="polite">
        {last ? `Chose ${last}` : "Open the menu from the avatar."}
      </p>
    </div>
  );
}
