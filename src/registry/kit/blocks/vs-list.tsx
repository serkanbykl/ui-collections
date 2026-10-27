import { cn } from "@/registry/kit/lib/utils";
import { TextReveal } from "@/registry/kit/ui/reveal";

export interface VsRow {
  /** What is being compared, e.g. "Cookie banner". */
  topic: string;
  /** How the alternative handles it. */
  them: string;
  /** How you handle it. */
  us: string;
}

export interface VsListProps {
  eyebrow?: string;
  title?: string;
  description?: string;
  /** Column heading for your product. */
  us?: string;
  /** Column heading for the alternative. Name a category, not a competitor. */
  them?: string;
  rows?: VsRow[];
  /** Small print under the table, e.g. a risk reducer. */
  note?: string;
}

const defaultRows: VsRow[] = [
  { topic: "Setup", them: "An agent per server, a config file per service", us: "One package, live on the next deploy" },
  { topic: "Alerts", them: "A graph went red somewhere", us: "The release, the endpoint and its owner" },
  { topic: "Pricing", them: "Per host, per seat and per feature", us: "Per million requests, everything included" },
  { topic: "Data retention", them: "15 days unless you pay more", us: "13 months on every plan" },
  { topic: "Support", them: "A ticket number", us: "An engineer, within four working hours" },
];

const cross = (
  <svg aria-hidden viewBox="0 0 24 24" className="mt-0.5 size-4 shrink-0 text-subtle" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <path d="M7 7l10 10M17 7 7 17" />
  </svg>
);

const check = (
  <svg aria-hidden viewBox="0 0 24 24" className="mt-0.5 size-4 shrink-0 text-accent" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="m5 12.5 4.5 4.5L19 7" />
  </svg>
);

/**
 * "Us vs the usual" as a real table: topic, the alternative, and you, with
 * your column picked out. On phones each row stacks under its topic.
 */
export function VsList({
  eyebrow = "Compared",
  title = "What changes when you switch.",
  description = "The same jobs, done with fewer moving parts.",
  us = "Brightline",
  them = "The usual monitoring stack",
  rows = defaultRows,
  note,
}: VsListProps) {
  return (
    <section className="bg-bg px-4 py-16 text-fg sm:px-6 md:px-8 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          {eyebrow && <p className="text-sm font-medium text-accent">{eyebrow}</p>}
          <TextReveal as="h2" trigger="view" className="mt-3 font-display text-3xl leading-[1.08] md:text-5xl">
            {title}
          </TextReveal>
          {description && <p className="mt-4 text-muted md:text-lg">{description}</p>}
        </div>

        <div className="surface mt-10 overflow-hidden rounded-card md:mt-12">
          <table className="w-full border-collapse text-left text-sm">
            <caption className="sr-only">
              {us} compared with {them}
            </caption>
            <thead className="hidden sm:table-header-group">
              <tr className="border-b border-line">
                <th scope="col" className="w-[22%] px-5 py-4 font-medium text-muted">
                  <span className="sr-only">Topic</span>
                </th>
                <th scope="col" className="px-5 py-4 font-medium text-muted">
                  {them}
                </th>
                <th scope="col" className="bg-accent/8 px-5 py-4 font-semibold text-accent">
                  {us}
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={row.topic}
                  className={cn("grid grid-cols-2 sm:table-row", i > 0 && "border-t border-line")}
                >
                  <th scope="row" className="col-span-2 px-5 pt-4 pb-1 font-medium sm:py-4 sm:align-top">
                    {row.topic}
                  </th>
                  <td className="px-5 py-3 text-muted sm:py-4 sm:align-top">
                    <span aria-hidden className="mb-1 block text-xs text-subtle sm:hidden">{them}</span>
                    <span className="flex gap-2">
                      {cross}
                      <span>
                        <span className="sr-only">{them}: </span>
                        {row.them}
                      </span>
                    </span>
                  </td>
                  <td className="bg-accent/8 px-5 py-3 sm:py-4 sm:align-top">
                    <span aria-hidden className="mb-1 block text-xs font-medium text-accent sm:hidden">{us}</span>
                    <span className="flex gap-2">
                      {check}
                      <span>
                        <span className="sr-only">{us}: </span>
                        {row.us}
                      </span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {note && <p className="mt-4 text-sm text-muted">{note}</p>}
      </div>
    </section>
  );
}
