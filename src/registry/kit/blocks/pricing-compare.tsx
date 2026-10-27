import { cn } from "@/registry/kit/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/registry/kit/ui/table";

type Cell = boolean | string;

export interface CompareRow {
  feature: string;
  values: Cell[];
}

export interface CompareGroup {
  title: string;
  rows: CompareRow[];
}

const defaultPlans = ["Hobby", "Pro", "Scale"];

const defaultGroups: CompareGroup[] = [
  {
    title: "Deploys",
    rows: [
      { feature: "Projects", values: ["3", "Unlimited", "Unlimited"] },
      { feature: "Preview deploys", values: [true, true, true] },
      { feature: "Build minutes / month", values: ["300", "6,000", "Custom"] },
      { feature: "Instant rollback", values: [false, true, true] },
    ],
  },
  {
    title: "Team",
    rows: [
      { feature: "Seats", values: ["1", "Up to 20", "Unlimited"] },
      { feature: "Roles and permissions", values: [false, true, true] },
      { feature: "SSO and SCIM", values: [false, false, true] },
      { feature: "Audit log", values: [false, false, true] },
    ],
  },
  {
    title: "Support",
    rows: [
      { feature: "Community forum", values: [true, true, true] },
      { feature: "Email support", values: [false, true, true] },
      { feature: "Uptime SLA", values: [false, "99.9%", "99.99%"] },
    ],
  },
];

function Value({ value }: { value: Cell }) {
  if (value === true)
    return (
      <svg viewBox="0 0 24 24" className="mx-auto size-4 text-accent" fill="none" stroke="currentColor" strokeWidth="2" role="img" aria-label="Included">
        <path d="M5 12.5l4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  if (value === false)
    return (
      <span className="text-fg/25" role="img" aria-label="Not included">
        —
      </span>
    );
  return <span className="text-fg/85">{value}</span>;
}

export function PricingCompare({
  title = "Compare plans",
  plans = defaultPlans,
  groups = defaultGroups,
  highlight = 1,
}: {
  title?: string;
  plans?: string[];
  groups?: CompareGroup[];
  /** Index of the plan column to emphasise. */
  highlight?: number;
}) {
  return (
    <section className="bg-bg px-6 py-24 text-fg md:px-8">
      <div className="mx-auto max-w-5xl">
        <h2 className="font-display text-4xl md:text-5xl">{title}</h2>
        <div className="mt-10">
          <Table className="min-w-[36rem]">
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-2/5 px-5">
                  <span className="sr-only">Feature</span>
                </TableHead>
                {plans.map((plan, i) => (
                  <TableHead
                    key={plan}
                    className={cn(
                      "h-14 px-5 text-center text-base font-medium tracking-normal text-fg normal-case",
                      i === highlight && "bg-fg/[0.04] text-accent",
                    )}
                  >
                    {plan}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            {groups.map((group) => (
              <TableBody key={group.title}>
                <TableRow className="hover:bg-transparent">
                  <TableHead colSpan={plans.length + 1} scope="colgroup" className="h-auto px-5 pt-7 pb-3 tracking-[0.2em]">
                    {group.title}
                  </TableHead>
                </TableRow>
                {group.rows.map((row) => (
                  <TableRow key={row.feature}>
                    <TableHead scope="row" className="h-auto px-5 py-3.5 text-sm font-normal tracking-normal whitespace-normal text-fg/80 normal-case">
                      {row.feature}
                    </TableHead>
                    {row.values.map((value, i) => (
                      <TableCell key={i} className={cn("px-5 text-center", i === highlight && "bg-fg/[0.04]")}>
                        <Value value={value} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            ))}
          </Table>
        </div>
      </div>
    </section>
  );
}
