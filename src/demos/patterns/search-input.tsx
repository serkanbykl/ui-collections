"use client";

import { useState } from "react";

import { SearchInput } from "@/registry/kit/ui/search-input";

const team = ["Ada Park", "Iris Chen", "Leo Varga", "Mina Okafor", "Noah Becker", "Sam Ruiz", "Yuki Tanaka"];

export default function SearchInputDemo() {
  const [query, setQuery] = useState("");
  const matches = team.filter((name) => name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="w-full max-w-sm">
      <SearchInput label="Search the team" value={query} onValueChange={setQuery} shortcut />
      <ul className="surface mt-4 divide-y divide-line overflow-hidden rounded-card">
        {matches.length ? (
          matches.map((name) => (
            <li key={name} className="px-5 py-3 text-sm text-fg/85">
              {name}
            </li>
          ))
        ) : (
          <li className="px-5 py-6 text-center text-sm text-muted">Nobody called “{query}”. Check the spelling or invite them.</li>
        )}
      </ul>
    </div>
  );
}
