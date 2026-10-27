"use client";

import { useState, type ReactNode } from "react";

import { cn } from "@/registry/kit/lib/utils";
import { ActivityList, type ActivityItem } from "@/registry/kit/ui/activity-list";
import { Avatar } from "@/registry/kit/ui/avatar";
import { Badge } from "@/registry/kit/ui/badge";
import { ChartBar } from "@/registry/kit/ui/chart-bar";
import { Checkbox } from "@/registry/kit/ui/checkbox";
import { SegmentedControl } from "@/registry/kit/ui/segmented-control";
import { StatCard } from "@/registry/kit/ui/stat-card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/registry/kit/ui/table";
import { PageHeader } from "@/registry/kit/ui/page-header";

export type DealStage = "lead" | "qualified" | "proposal" | "negotiation" | "won";

export interface Deal {
  id: string;
  company: string;
  contact: string;
  owner: string;
  value: number;
  stage: DealStage;
  /** Close probability, 0–1. */
  probability: number;
  closeDate: string;
}

export interface CrmTask {
  id: string;
  title: string;
  due: string;
  done: boolean;
  overdue?: boolean;
}

export interface CrmDashboardData {
  deals: Deal[];
  tasks: CrmTask[];
  activity: ActivityItem[];
  /** Won revenue per month, oldest first. */
  wonByMonth: { labels: string[]; won: number[]; target: number[] };
}

const stageMeta: Record<DealStage, { label: string; variant: "outline" | "info" | "accent" | "warning" | "success" }> = {
  lead: { label: "Lead", variant: "outline" },
  qualified: { label: "Qualified", variant: "info" },
  proposal: { label: "Proposal", variant: "accent" },
  negotiation: { label: "Negotiation", variant: "warning" },
  won: { label: "Won", variant: "success" },
};

export const sampleCrmData: CrmDashboardData = {
  deals: [
    { id: "d1", company: "Halden & Moss Architects", contact: "Rasmus Halden", owner: "Mira Solberg", value: 48500, stage: "negotiation", probability: 0.75, closeDate: "Nov 7" },
    { id: "d2", company: "Northwind Coffee", contact: "Grace Liu", owner: "Dev Patel", value: 18200, stage: "proposal", probability: 0.5, closeDate: "Nov 14" },
    { id: "d3", company: "Brightline Physio", contact: "Omar Said", owner: "Mira Solberg", value: 9600, stage: "qualified", probability: 0.3, closeDate: "Dec 2" },
    { id: "d4", company: "Tidewater Books", contact: "Elena Popescu", owner: "Kwame Asante", value: 6250, stage: "won", probability: 1, closeDate: "Oct 21" },
    { id: "d5", company: "Coastal Kayak Co.", contact: "Ben Whitaker", owner: "Dev Patel", value: 27400, stage: "proposal", probability: 0.45, closeDate: "Nov 20" },
    { id: "d6", company: "Marino & Figli", contact: "Sofia Marino", owner: "Kwame Asante", value: 73900, stage: "negotiation", probability: 0.65, closeDate: "Nov 28" },
    { id: "d7", company: "Okafor Studio", contact: "Amara Okafor", owner: "Mira Solberg", value: 12800, stage: "lead", probability: 0.1, closeDate: "Dec 15" },
    { id: "d8", company: "Lindqvist Design AB", contact: "Jonas Lindqvist", owner: "Dev Patel", value: 21350, stage: "won", probability: 1, closeDate: "Oct 9" },
    { id: "d9", company: "Fernhill Dental", contact: "Ruth Adeyemi", owner: "Kwame Asante", value: 15700, stage: "qualified", probability: 0.35, closeDate: "Dec 9" },
  ],
  tasks: [
    { id: "t1", title: "Send revised SOW to Halden & Moss", due: "Today", done: false },
    { id: "t2", title: "Follow up on Northwind proposal", due: "Yesterday", done: false, overdue: true },
    { id: "t3", title: "Book discovery call with Fernhill Dental", due: "Tomorrow", done: false },
    { id: "t4", title: "Prep pricing for Marino & Figli", due: "Thu", done: true },
  ],
  activity: [
    { id: "a1", actor: "Kwame Asante", action: "closed", target: "Tidewater Books · $6,250", time: "3 d ago", tone: "success" },
    { id: "a2", actor: "Mira Solberg", action: "moved to negotiation", target: "Halden & Moss Architects", time: "4 d ago", tone: "warning" },
    { id: "a3", actor: "Dev Patel", action: "sent proposal to", target: "Coastal Kayak Co.", time: "5 d ago", tone: "accent" },
    { id: "a4", actor: "Grace Liu", action: "opened the proposal", target: "3 times", time: "6 d ago", tone: "info" },
  ],
  wonByMonth: {
    labels: ["May", "Jun", "Jul", "Aug", "Sep", "Oct"],
    won: [41200, 38750, 52900, 47300, 61450, 27600],
    target: [45000, 45000, 50000, 50000, 55000, 55000],
  },
};

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const usdShort = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", notation: "compact", maximumFractionDigits: 1 });
const initials = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2);

function Panel({ title, action, children, className }: { title: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={cn("surface min-w-0 rounded-card p-5 md:p-6", className)}>
      <div className="mb-5 flex items-center justify-between gap-3">
        <h3 className="text-sm font-medium text-fg/85">{title}</h3>
        {action}
      </div>
      {children}
    </section>
  );
}

const openStages: DealStage[] = ["lead", "qualified", "proposal", "negotiation"];

export interface CrmDashboardScreenProps {
  data?: CrmDashboardData;
  className?: string;
}

/** Sales pipeline: pipeline and win-rate tiles, value by stage, won against target, open deals by owner, tasks and recent activity. */
export function CrmDashboardScreen({ data = sampleCrmData, className }: CrmDashboardScreenProps) {
  const [tasks, setTasks] = useState(data.tasks);
  const [owner, setOwner] = useState("all");

  const owners = [...new Set(data.deals.map((d) => d.owner))];
  const open = data.deals.filter((d) => d.stage !== "won");
  const pipeline = open.reduce((s, d) => s + d.value, 0);
  const weighted = open.reduce((s, d) => s + d.value * d.probability, 0);
  const won = data.deals.filter((d) => d.stage === "won");
  const wonValue = won.reduce((s, d) => s + d.value, 0);
  const visible = (owner === "all" ? open : open.filter((d) => d.owner === owner)).sort((a, b) => b.value * b.probability - a.value * a.probability);
  const byStage = openStages.map((s) => open.filter((d) => d.stage === s).reduce((t, d) => t + d.value, 0));
  const remaining = tasks.filter((t) => !t.done).length;

  return (
    <div className={cn("grid grid-cols-1 gap-6", className)}>
      <PageHeader title="Pipeline" description={`${open.length} open deals · ${usd.format(weighted)} weighted forecast for Q4`} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Open pipeline" value={pipeline} prefix="$" change={0.128} comparison="vs last month" highlight sparkline={[142, 158, 151, 167, 179, 174, 188, 201, 196, 214]} />
        <StatCard label="Won this month" value={wonValue} prefix="$" tone="success" change={-0.073} comparison="vs September" />
        <StatCard label="Win rate" value={31.4} suffix="%" decimals={1} tone="info" change={0.042} comparison="last 90 days" />
        <StatCard label="Average sales cycle" value={38} suffix=" days" tone="warning" change={-0.11} positiveIsGood={false} comparison="vs last quarter" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Panel title="Pipeline by stage">
          <ChartBar
            labels={openStages.map((s) => stageMeta[s].label)}
            series={[{ name: "Value", values: byStage }]}
            label="Open pipeline value by stage"
            height={220}
            formatValue={(v) => usdShort.format(v)}
          />
        </Panel>
        <Panel title="Won against target">
          <ChartBar
            labels={data.wonByMonth.labels}
            series={[
              { name: "Won", values: data.wonByMonth.won },
              { name: "Target", values: data.wonByMonth.target },
            ]}
            label="Won revenue against target by month"
            height={220}
            formatValue={(v) => usdShort.format(v)}
          />
        </Panel>
      </div>

      <Panel
        title="Open deals"
        action={
          <span className="text-sm tabular-nums text-muted">
            {visible.length} of {open.length}
          </span>
        }
      >
        <div className="-mx-1 mb-4 overflow-x-auto px-1 pb-1">
          <SegmentedControl
            aria-label="Deal owner"
            value={owner}
            onValueChange={setOwner}
            options={[{ value: "all", label: "Everyone" }, ...owners.map((o) => ({ value: o, label: o.split(" ")[0] }))]}
          />
        </div>
        <Table frame={false}>
          <TableHeader>
            <TableRow>
              <TableHead>Company</TableHead>
              <TableHead>Stage</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Close</TableHead>
              <TableHead className="text-right">Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visible.map((d) => (
              <TableRow key={d.id}>
                <TableCell className="min-w-48">
                  <p className="font-medium">{d.company}</p>
                  <p className="text-xs text-muted">{d.contact}</p>
                </TableCell>
                <TableCell>
                  <Badge variant={stageMeta[d.stage].variant}>{stageMeta[d.stage].label}</Badge>
                  <span className="ml-2 text-xs tabular-nums text-muted">{Math.round(d.probability * 100)}%</span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <Avatar size="sm" fallback={initials(d.owner)} alt="" />
                    <span className="text-sm">{d.owner.split(" ")[0]}</span>
                  </div>
                </TableCell>
                <TableCell className="whitespace-nowrap text-muted">{d.closeDate}</TableCell>
                <TableCell className="text-right tabular-nums">{usd.format(d.value)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Panel>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Panel title="Your tasks" action={<span className="text-sm text-muted">{remaining ? `${remaining} to do` : "All done"}</span>}>
          <ul className="grid grid-cols-1 gap-1">
            {tasks.map((t) => (
              <li key={t.id}>
                <label className="flex cursor-pointer items-start gap-3 rounded-field px-2 py-2.5 transition-colors hover:bg-surface-hover">
                  <Checkbox
                    className="mt-0.5"
                    checked={t.done}
                    onCheckedChange={(v) => setTasks((all) => all.map((x) => (x.id === t.id ? { ...x, done: v === true } : x)))}
                  />
                  <span className="min-w-0 flex-1">
                    <span className={cn("block text-sm", t.done && "text-muted line-through")}>{t.title}</span>
                    <span className={cn("text-xs", t.overdue && !t.done ? "text-danger" : "text-muted")}>
                      {t.overdue && !t.done ? `Overdue · ${t.due}` : t.due}
                    </span>
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="Recent activity">
          <ActivityList items={data.activity} />
        </Panel>
      </div>
    </div>
  );
}
