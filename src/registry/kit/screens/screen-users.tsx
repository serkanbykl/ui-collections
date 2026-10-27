"use client";

import { useMemo, useState } from "react";

import { cn } from "@/registry/kit/lib/utils";
import { Avatar } from "@/registry/kit/ui/avatar";
import { Badge } from "@/registry/kit/ui/badge";
import { SelectionBar } from "@/registry/kit/ui/selection-bar";
import { Button } from "@/registry/kit/ui/button";
import {
  createDataTableColumnHelper,
  DataTable,
  DataTableColumnToggle,
  DataTablePagination,
  selectionColumn,
  useDataTable,
  type DataTableColumn,
} from "@/registry/kit/ui/data-table";
import { Dialog, DialogBody, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/registry/kit/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/registry/kit/ui/dropdown-menu";
import { ChipGroup, ChipInput } from "@/registry/kit/ui/chip";
import { FilterBar } from "@/registry/kit/ui/filter-bar";
import { MultiSelect } from "@/registry/kit/ui/multi-select";
import { SearchInput } from "@/registry/kit/ui/search-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/registry/kit/ui/select";
import { StatCard } from "@/registry/kit/ui/stat-card";
import { toast } from "@/registry/kit/ui/toast";
import { PageHeader } from "@/registry/kit/ui/page-header";

export type UserRole = "owner" | "admin" | "editor" | "viewer";
export type UserStatus = "active" | "invited" | "suspended";

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  team: string;
  /** Minutes since the user was last seen; `null` for invites never accepted. */
  lastActive: number | null;
  avatar?: string;
}

const roleMeta: Record<UserRole, { label: string; variant: "accent" | "info" | "surface" | "outline" }> = {
  owner: { label: "Owner", variant: "accent" },
  admin: { label: "Admin", variant: "info" },
  editor: { label: "Editor", variant: "surface" },
  viewer: { label: "Viewer", variant: "outline" },
};

const statusMeta: Record<UserStatus, { label: string; variant: "success" | "warning" | "danger" }> = {
  active: { label: "Active", variant: "success" },
  invited: { label: "Invited", variant: "warning" },
  suspended: { label: "Suspended", variant: "danger" },
};

const teams = ["Product", "Design", "Engineering", "Support", "Finance"];

export const sampleUsers: AppUser[] = [
  {
    id: "usr_01",
    name: "Amara Okafor",
    email: "amara@northwind.io",
    role: "owner",
    status: "active",
    team: "Product",
    lastActive: 3,
  },
  {
    id: "usr_02",
    name: "Lukas Brandt",
    email: "lukas.brandt@northwind.io",
    role: "admin",
    status: "active",
    team: "Engineering",
    lastActive: 17,
  },
  {
    id: "usr_03",
    name: "Priya Raman",
    email: "priya@northwind.io",
    role: "editor",
    status: "active",
    team: "Design",
    lastActive: 64,
  },
  {
    id: "usr_04",
    name: "Mateo Alvarez",
    email: "mateo.a@northwind.io",
    role: "editor",
    status: "active",
    team: "Engineering",
    lastActive: 212,
  },
  {
    id: "usr_05",
    name: "Hana Sato",
    email: "hana.sato@northwind.io",
    role: "viewer",
    status: "invited",
    team: "Finance",
    lastActive: null,
  },
  {
    id: "usr_06",
    name: "Tomasz Wiśniewski",
    email: "tomasz@northwind.io",
    role: "editor",
    status: "active",
    team: "Support",
    lastActive: 1_380,
  },
  {
    id: "usr_07",
    name: "Leila Haddad",
    email: "leila.haddad@northwind.io",
    role: "admin",
    status: "active",
    team: "Support",
    lastActive: 41,
  },
  {
    id: "usr_08",
    name: "Jonah Whitfield",
    email: "jonah@northwind.io",
    role: "viewer",
    status: "suspended",
    team: "Finance",
    lastActive: 23_040,
  },
  {
    id: "usr_09",
    name: "Sofía Herrera",
    email: "sofia.h@northwind.io",
    role: "editor",
    status: "active",
    team: "Design",
    lastActive: 9,
  },
  {
    id: "usr_10",
    name: "Kwame Mensah",
    email: "kwame@northwind.io",
    role: "editor",
    status: "active",
    team: "Engineering",
    lastActive: 2_910,
  },
  {
    id: "usr_11",
    name: "Ines Duarte",
    email: "ines.duarte@northwind.io",
    role: "viewer",
    status: "active",
    team: "Product",
    lastActive: 5_620,
  },
  {
    id: "usr_12",
    name: "Rohan Mehta",
    email: "rohan@northwind.io",
    role: "editor",
    status: "invited",
    team: "Engineering",
    lastActive: null,
  },
  {
    id: "usr_13",
    name: "Elif Demir",
    email: "elif.demir@northwind.io",
    role: "viewer",
    status: "active",
    team: "Design",
    lastActive: 486,
  },
  {
    id: "usr_14",
    name: "Noah Lindqvist",
    email: "noah@northwind.io",
    role: "editor",
    status: "active",
    team: "Product",
    lastActive: 11_250,
  },
];

/** "4 min ago", "3 h ago", "Yesterday", "12 days ago". */
export function formatLastActive(minutes: number | null) {
  if (minutes === null) return "Never signed in";
  if (minutes < 2) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  if (minutes < 1_440) return `${Math.floor(minutes / 60)} h ago`;
  const days = Math.floor(minutes / 1_440);
  return days === 1 ? "Yesterday" : `${days} days ago`;
}

const avatarTones = ["bg-accent/15 text-accent", "bg-info/15 text-info", "bg-warning/15 text-warning", "bg-success/15 text-success"];

const col = createDataTableColumnHelper<AppUser>();

interface RowActions {
  profileHref?: string;
  setRole: (ids: string[], role: UserRole) => void;
  setStatus: (ids: string[], status: UserStatus) => void;
  remove: (ids: string[]) => void;
}

function buildColumns({ profileHref, setRole, setStatus, remove }: RowActions): DataTableColumn<AppUser>[] {
  return [
    selectionColumn<AppUser>(),
    col.accessor("name", {
      header: "Name",
      meta: { label: "Name" },
      cell: ({ row }) => (
        <div className="flex min-w-52 items-center gap-3">
          <Avatar src={row.original.avatar} alt={row.original.name} fallbackClassName={cn("font-semibold", avatarTones[row.index % avatarTones.length])} />
          <div className="min-w-0">
            {profileHref ? (
              <a href={`${profileHref}/${row.original.id}`} className="block truncate font-medium text-fg hover:text-accent">
                {row.original.name}
              </a>
            ) : (
              <div className="truncate font-medium text-fg">{row.original.name}</div>
            )}
            <div className="truncate text-xs text-muted">{row.original.email}</div>
          </div>
        </div>
      ),
    }),
    col.accessor("role", {
      header: "Role",
      filterFn: "inArray",
      meta: { label: "Role" },
      cell: ({ row }) => <Badge variant={roleMeta[row.original.role].variant}>{roleMeta[row.original.role].label}</Badge>,
    }),
    col.accessor("team", { header: "Team", meta: { label: "Team" } }),
    col.accessor("status", {
      header: "Status",
      filterFn: "inArray",
      meta: { label: "Status" },
      cell: ({ row }) => (
        <Badge dot variant={statusMeta[row.original.status].variant}>
          {statusMeta[row.original.status].label}
        </Badge>
      ),
    }),
    col.accessor((u) => u.lastActive ?? Number.MAX_SAFE_INTEGER, {
      id: "lastActive",
      header: "Last active",
      sortFn: "basic",
      meta: { label: "Last active" },
      cell: ({ row }) => <span className="whitespace-nowrap text-muted">{formatLastActive(row.original.lastActive)}</span>,
    }),
    col.display({
      id: "actions",
      enableHiding: false,
      meta: { align: "right", className: "w-12" },
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => {
        const user = row.original;
        const isOwner = user.role === "owner";
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon-sm" variant="ghost" aria-label={`Actions for ${user.name}`}>
                <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden>
                  <circle cx="5" cy="12" r="1.6" />
                  <circle cx="12" cy="12" r="1.6" />
                  <circle cx="19" cy="12" r="1.6" />
                </svg>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Change role</DropdownMenuLabel>
              {(["admin", "editor", "viewer"] as const).map((role) => (
                <DropdownMenuItem key={role} disabled={isOwner || user.role === role} onSelect={() => setRole([user.id], role)}>
                  {roleMeta[role].label}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              {user.status === "suspended" ? (
                <DropdownMenuItem onSelect={() => setStatus([user.id], "active")}>Reactivate account</DropdownMenuItem>
              ) : (
                <DropdownMenuItem disabled={isOwner} onSelect={() => setStatus([user.id], "suspended")}>
                  Suspend account
                </DropdownMenuItem>
              )}
              <DropdownMenuItem disabled={isOwner} className="text-danger" onSelect={() => remove([user.id])}>
                Remove from workspace
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    }),
  ];
}

export interface UsersScreenProps {
  users?: AppUser[];
  /** Seats on the current plan, shown beside the count. */
  seats?: number;
  /** Called with each new invite. */
  onInvite?: (invite: { email: string; role: UserRole; team: string }) => void;
  /** When set, names link to `${profileHref}/${id}`. */
  profileHref?: string;
  className?: string;
}

const statIcon = (d: string) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d={d} />
  </svg>
);

/** Workspace members: search, role and status filters, row actions, bulk changes and an invite dialog. */
export function UsersScreen({ users = sampleUsers, seats = 25, onInvite, profileHref, className }: UsersScreenProps) {
  const [rows, setRows] = useState(users);
  const [pendingRemoval, setPendingRemoval] = useState<string[]>([]);

  const columns = useMemo(
    () =>
      buildColumns({
        profileHref,
        setRole: (ids, role) => {
          setRows((current) => current.map((u) => (ids.includes(u.id) && u.role !== "owner" ? { ...u, role } : u)));
          toast.success(`${ids.length === 1 ? "Role" : `${ids.length} roles`} changed to ${roleMeta[role].label}.`);
        },
        setStatus: (ids, status) => {
          setRows((current) => current.map((u) => (ids.includes(u.id) && u.role !== "owner" ? { ...u, status } : u)));
          toast.success(
            status === "suspended"
              ? `Suspended ${ids.length === 1 ? "1 account" : `${ids.length} accounts`}. They keep their data but can't sign in.`
              : "Account reactivated. They can sign in again.",
          );
        },
        remove: (ids) => setPendingRemoval(ids),
      }),
    [profileHref],
  );

  const table = useDataTable({
    data: rows,
    columns,
    getRowId: (u) => u.id,
    pageSize: 8,
    initialSorting: [{ id: "lastActive", desc: false }],
  });

  const search = table.state.globalFilter as string;
  const roleFilter = (table.getColumn("role")?.getFilterValue() as UserRole[] | undefined) ?? [];
  const statusFilter = (table.getColumn("status")?.getFilterValue() as UserStatus[] | undefined) ?? [];
  const selectedIds = Object.keys(table.state.rowSelection).filter((id) => table.state.rowSelection[id]);
  const selectedEditable = rows.filter((u) => selectedIds.includes(u.id) && u.role !== "owner").map((u) => u.id);

  const counts = {
    active: rows.filter((u) => u.status === "active").length,
    invited: rows.filter((u) => u.status === "invited").length,
    used: rows.filter((u) => u.status !== "suspended").length,
    admins: rows.filter((u) => u.role === "owner" || u.role === "admin").length,
  };

  function confirmRemoval() {
    const ids = pendingRemoval.filter((id) => rows.find((u) => u.id === id)?.role !== "owner");
    setRows((current) => current.filter((u) => !ids.includes(u.id)));
    table.setRowSelection({});
    setPendingRemoval([]);
    toast.success(`Removed ${ids.length === 1 ? "1 person" : `${ids.length} people`}. Their seats are free again.`);
  }

  function resendInvites() {
    const invited = rows.filter((u) => selectedIds.includes(u.id) && u.status === "invited").length;
    if (invited) toast.success(`Resent ${invited} ${invited === 1 ? "invite" : "invites"}.`);
    else toast("None of the selected people have a pending invite.");
  }

  const removalNames = rows.filter((u) => pendingRemoval.includes(u.id)).map((u) => u.name);

  return (
    <div className={cn("grid min-w-0 grid-cols-1 gap-6", className)}>
      <PageHeader
        title="Users"
        description={`${counts.active} active · ${counts.invited} invited · ${counts.used} of ${seats} seats in use`}
        actions={
        <InviteUserDialog
          seatsLeft={seats - counts.used}
          existing={rows.map((u) => u.email)}
          onInvite={(invites) => {
            setRows((current) => [
              ...invites.map((invite) => ({
                id: `usr_${invite.email.replace(/[^a-z0-9]/g, "")}`,
                name: invite.email
                  .split("@")[0]!
                  .replace(/[._-]+/g, " ")
                  .replace(/\b\w/g, (c) => c.toUpperCase()),
                email: invite.email,
                role: invite.role,
                team: invite.team,
                status: "invited" as const,
                lastActive: null,
              })),
              ...current,
            ]);
            toast.success(
              invites.length === 1 ? `Invite sent to ${invites[0]!.email}. It expires in 7 days.` : `${invites.length} invites sent. They expire in 7 days.`,
            );
            invites.forEach((invite) => onInvite?.(invite));
          }}
        />
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard solid label="Total users" value={rows.length} comparison="Every role and status" icon={statIcon("M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 9a7 7 0 0 1 14 0M16 3.1a4 4 0 0 1 0 7.8M22 20a7 7 0 0 0-4-6.3")} />
        <StatCard
          label="Active"
          tone="success"
          value={counts.active}
          comparison={`${Math.round((counts.active / Math.max(rows.length, 1)) * 100)}% of everyone`}
          icon={statIcon("M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 9a7 7 0 0 1 11-5.7M15 19l2 2 4-4")}
        />
        <StatCard label="Pending invites" tone="warning" value={counts.invited} comparison="Haven't signed in yet" icon={statIcon("M4 6h16v12H4zM4 7l8 6 8-6")} />
        <StatCard label="Admins" tone="info" value={counts.admins} comparison="Owner and admins" icon={statIcon("M12 3 4 6v6c0 5 3.4 8.4 8 9 4.6-.6 8-4 8-9V6l-8-3Zm-3 9 2 2 4-4")} />
      </div>

      <SelectionBar count={selectedIds.length} onClear={() => table.setRowSelection({})}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" disabled={!selectedEditable.length}>
              Change role
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {(["admin", "editor", "viewer"] as const).map((role) => (
              <DropdownMenuItem
                key={role}
                onSelect={() => {
                  setRows((current) => current.map((u) => (selectedEditable.includes(u.id) ? { ...u, role } : u)));
                  toast.success(
                    `${selectedEditable.length} ${selectedEditable.length === 1 ? "person is" : "people are"} now ${roleMeta[role].label.toLowerCase()}s.`,
                  );
                }}
              >
                Make {roleMeta[role].label.toLowerCase()}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <Button size="sm" onClick={resendInvites}>
          Resend invites
        </Button>
        <Button size="sm" variant="danger" disabled={!selectedEditable.length} onClick={() => setPendingRemoval(selectedEditable)}>
          Remove
        </Button>
      </SelectionBar>

      <DataTable
        table={table}
        caption="Workspace users"
        emptyTitle="Nobody matches these filters"
        emptyDescription="Clear a filter or search by email instead."
        toolbar={
          <FilterBar
            search={<SearchInput label="Search users" value={search} onValueChange={(v) => table.setGlobalFilter(v)} />}
            filters={
              <>
                <ChipGroup
                  label="Filter by status"
                  multiple
                  value={statusFilter}
                  onValueChange={(v) => table.getColumn("status")?.setFilterValue(v)}
                  options={(Object.keys(statusMeta) as UserStatus[]).map((s) => ({
                    value: s,
                    label: statusMeta[s].label,
                    count: rows.filter((u) => u.status === s).length,
                  }))}
                />
                <MultiSelect
                  label="Role"
                  value={roleFilter}
                  onValueChange={(v) => table.getColumn("role")?.setFilterValue(v)}
                  options={(Object.keys(roleMeta) as UserRole[]).map((r) => ({
                    value: r,
                    label: roleMeta[r].label,
                    count: rows.filter((u) => u.role === r).length,
                  }))}
                />
              </>
            }
            activeCount={roleFilter.length + statusFilter.length + (search ? 1 : 0)}
            onReset={() => {
              table.setGlobalFilter("");
              table.getColumn("role")?.setFilterValue([]);
              table.getColumn("status")?.setFilterValue([]);
            }}
            end={<DataTableColumnToggle table={table} />}
          />
        }
        footer={<DataTablePagination table={table} pageSizes={[8, 16]} />}
      />

      <Dialog open={pendingRemoval.length > 0} onOpenChange={(open) => !open && setPendingRemoval([])}>
        <DialogContent size="sm">
          <DialogHeader tone="danger">
            <DialogTitle>Remove {removalNames.length === 1 ? removalNames[0] : `${removalNames.length} people`}?</DialogTitle>
            <DialogDescription>They lose access right away. Projects and comments they created stay in the workspace.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost">Keep them</Button>
            </DialogClose>
            <Button variant="danger" onClick={confirmRemoval}>
              Remove {removalNames.length === 1 ? "person" : "people"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function InviteUserDialog({
  seatsLeft,
  existing,
  onInvite,
}: {
  seatsLeft: number;
  existing: string[];
  onInvite: (invites: { email: string; role: UserRole; team: string }[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [emails, setEmails] = useState<string[]>([]);
  const [role, setRole] = useState<UserRole>("editor");
  const [team, setTeam] = useState(teams[0]!);
  const [touched, setTouched] = useState(false);
  const error = emails.length ? undefined : "Add at least one email address.";

  function check(entry: string) {
    const email = entry.toLowerCase();
    if (!emailPattern.test(email)) return `“${entry}” doesn't look like an email address.`;
    if (existing.includes(email)) return `${email} is already in the workspace.`;
    return null;
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    setTouched(true);
    if (error || seatsLeft <= 0) return;
    onInvite(emails.map((email) => ({ email: email.toLowerCase(), role, team })));
    setOpen(false);
    setEmails([]);
    setTouched(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setTouched(false);
      }}
    >
      <Button variant="accent" onClick={() => setOpen(true)}>
        Invite user
      </Button>
      <DialogContent>
        <form onSubmit={submit} noValidate className="contents">
          <DialogHeader
            icon={
              <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden>
                <circle cx="10" cy="8" r="3.5" />
                <path d="M3.5 19.5c.8-3.4 3.4-5.5 6.5-5.5s5.7 2.1 6.5 5.5M18.5 8v6M15.5 11h6" />
              </svg>
            }
          >
            <DialogTitle>Invite a user</DialogTitle>
            <DialogDescription>
              {seatsLeft > 0
                ? `They get an email with a link to join. ${seatsLeft} ${seatsLeft === 1 ? "seat" : "seats"} left on your plan.`
                : "Every seat is taken. Add seats in billing before inviting anyone else."}
            </DialogDescription>
          </DialogHeader>
          <DialogBody className="grid gap-4">
            <div>
              <ChipInput
                label="Work emails"
                placeholder="name@company.com, then Enter"
                value={emails}
                onValueChange={setEmails}
                validate={check}
                max={Math.max(seatsLeft, 1)}
              />
              <p className={cn("mt-1.5 px-0.5 text-xs", touched && error ? "text-danger" : "text-muted")}>
                {touched && error ? error : "Paste several addresses at once, separated by commas."}
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-1.5">
                <span id="invite-role" className="px-1 text-xs text-muted">
                  Role
                </span>
                <Select value={role} onValueChange={(v) => setRole(v as UserRole)}>
                  <SelectTrigger aria-labelledby="invite-role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin: manage people and billing</SelectItem>
                    <SelectItem value="editor">Editor: create and edit projects</SelectItem>
                    <SelectItem value="viewer">Viewer: read and comment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-1.5">
                <span id="invite-team" className="px-1 text-xs text-muted">
                  Team
                </span>
                <Select value={team} onValueChange={setTeam}>
                  <SelectTrigger aria-labelledby="invite-team">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {teams.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </DialogBody>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="ghost">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" variant="accent" disabled={seatsLeft <= 0}>
              {emails.length > 1 ? `Send ${emails.length} invites` : "Send invite"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
