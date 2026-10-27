"use client";

import { BarList } from "@/registry/kit/ui/bar-list";

export default function BarListDemo() {
  return (
    <div className="grid w-full max-w-3xl gap-4 md:grid-cols-2">
      <section className="surface rounded-card p-5">
        <h3 className="mb-3 text-sm font-medium">Top sources</h3>
        <BarList
          label="Top sources, last 30 days"
          header={{ label: "Source", value: "Visitors" }}
          items={[
            { label: "Google", value: 18342 },
            { label: "Direct", value: 9417 },
            { label: "news.ycombinator.com", value: 4106 },
            { label: "Newsletter", value: 2251 },
            { label: "LinkedIn", value: 1189 },
          ]}
        />
      </section>
      <section className="surface rounded-card p-5">
        <h3 className="mb-3 text-sm font-medium">Countries</h3>
        <BarList
          label="Visitors by country, last 30 days"
          header={{ label: "Country", value: "Share" }}
          formatValue={(v) => `${v}%`}
          items={[
            { label: "Germany", value: 31, leading: <span className="font-mono text-[10px] text-muted">DE</span> },
            { label: "Türkiye", value: 22, leading: <span className="font-mono text-[10px] text-muted">TR</span> },
            { label: "United States", value: 17, leading: <span className="font-mono text-[10px] text-muted">US</span> },
            { label: "Netherlands", value: 9, leading: <span className="font-mono text-[10px] text-muted">NL</span> },
          ]}
        />
      </section>
    </div>
  );
}
