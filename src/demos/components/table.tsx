"use client";

import { useState } from "react";

import { Badge } from "@/registry/kit/ui/badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  type SortDirection,
} from "@/registry/kit/ui/table";

const deployments = [
  { id: "4f2a91c", branch: "main", status: "Ready", duration: 41, age: 3 },
  { id: "b81e07d", branch: "feat/pricing", status: "Building", duration: 0, age: 1 },
  { id: "9c3d552", branch: "fix/nav-focus", status: "Ready", duration: 38, age: 26 },
  { id: "e07a1f4", branch: "main", status: "Failed", duration: 12, age: 54 },
  { id: "21bc9e0", branch: "chore/deps", status: "Ready", duration: 47, age: 120 },
];

type Key = "duration" | "age";
const tone = { Ready: "success", Building: "warning", Failed: "danger" } as const;

export default function TableDemo() {
  const [sort, setSort] = useState<{ key: Key; dir: Exclude<SortDirection, false> }>({ key: "age", dir: "ascending" });

  const rows = [...deployments].sort((a, b) => (sort.dir === "ascending" ? 1 : -1) * (a[sort.key] - b[sort.key]));
  const toggle = (key: Key) =>
    setSort((s) => ({ key, dir: s.key === key && s.dir === "ascending" ? "descending" : "ascending" }));
  const dir = (key: Key) => (sort.key === key ? sort.dir : false);

  return (
    <div className="w-full max-w-2xl">
      <Table>
        <TableCaption>Recent deployments of marketing-site</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Commit</TableHead>
            <TableHead>Branch</TableHead>
            <TableHead>Status</TableHead>
            <TableHead sort={dir("duration")} onSort={() => toggle("duration")} className="text-right">
              Build
            </TableHead>
            <TableHead sort={dir("age")} onSort={() => toggle("age")} className="text-right">
              Age
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((d) => (
            <TableRow key={d.id}>
              <TableCell className="font-mono text-xs">{d.id}</TableCell>
              <TableCell>{d.branch}</TableCell>
              <TableCell>
                <Badge variant={tone[d.status as keyof typeof tone]} dot>
                  {d.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right tabular-nums">{d.duration ? `${d.duration}s` : "—"}</TableCell>
              <TableCell className="text-right text-muted tabular-nums">
                {d.age < 60 ? `${d.age}m` : `${Math.round(d.age / 60)}h`}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
