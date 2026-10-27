"use client";

import { useState } from "react";

import { cn } from "@/registry/kit/lib/utils";
import { Avatar, AvatarGroup } from "@/registry/kit/ui/avatar";
import { Badge } from "@/registry/kit/ui/badge";
import { Button } from "@/registry/kit/ui/button";
import { Checkbox } from "@/registry/kit/ui/checkbox";
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/registry/kit/ui/dialog";
import { Input, Textarea } from "@/registry/kit/ui/field";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/registry/kit/ui/table";
import { toast } from "@/registry/kit/ui/toast";
import { PageHeader } from "@/registry/kit/ui/page-header";

export interface Permission {
  id: string;
  label: string;
  group: string;
  description?: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  members: string[];
  /** Permission ids this role grants. */
  permissions: string[];
  /** Built-in roles can't be renamed and the owner can't lose permissions. */
  locked?: boolean;
}

export const samplePermissions: Permission[] = [
  { id: "projects.view", label: "View projects", group: "Projects" },
  { id: "projects.edit", label: "Create and edit projects", group: "Projects" },
  { id: "projects.delete", label: "Delete projects", group: "Projects", description: "Deleted projects stay in trash for 30 days." },
  { id: "members.invite", label: "Invite people", group: "People" },
  { id: "members.roles", label: "Change roles", group: "People" },
  { id: "billing.view", label: "View invoices", group: "Billing" },
  { id: "billing.manage", label: "Change plan and payment", group: "Billing" },
  { id: "api.keys", label: "Create API keys", group: "Developers" },
  { id: "reports.export", label: "Export reports", group: "Developers" },
  { id: "workspace.delete", label: "Delete workspace", group: "Workspace" },
];

const all = samplePermissions.map((p) => p.id);

export const sampleRoles: Role[] = [
  {
    id: "owner",
    name: "Owner",
    description: "Full control, including deleting the workspace. Only one per workspace.",
    members: ["Amara Okafor"],
    permissions: all,
    locked: true,
  },
  {
    id: "admin",
    name: "Admin",
    description: "Manages people, billing and integrations.",
    members: ["Lukas Brandt", "Leila Haddad", "Noah Lindqvist"],
    permissions: all.filter((p) => p !== "workspace.delete"),
  },
  {
    id: "editor",
    name: "Editor",
    description: "Creates and edits projects, can invite collaborators.",
    members: ["Priya Raman", "Mateo Alvarez", "Sofía Herrera", "Kwame Mensah", "Tomasz Wiśniewski", "Rohan Mehta", "Elif Demir"],
    permissions: ["projects.view", "projects.edit", "members.invite", "reports.export"],
  },
  {
    id: "finance",
    name: "Finance",
    description: "Sees invoices and manages payment details. Read-only on projects.",
    members: ["Hana Sato", "Jonah Whitfield"],
    permissions: ["projects.view", "billing.view", "billing.manage", "reports.export"],
  },
  {
    id: "viewer",
    name: "Viewer",
    description: "Reads and comments. Can't change anything.",
    members: ["Ines Duarte", "Grace O'Neill", "Dmitri Volkov", "Camille Laurent"],
    permissions: ["projects.view"],
  },
];

// Opaque fills, so overlapping avatars in a group don't show through each other.
const solidTints = ["bg-accent text-accent-fg", "bg-info text-bg", "bg-warning text-black/75", "bg-success text-bg"];

export interface RolesScreenProps {
  roles?: Role[];
  permissions?: Permission[];
  /** Called when the matrix or a role is saved. */
  onSave?: (roles: Role[]) => void;
  className?: string;
}

/** Role cards with their members, an editable permissions matrix and a dialog to create or edit a role. */
export function RolesScreen({ roles = sampleRoles, permissions = samplePermissions, onSave, className }: RolesScreenProps) {
  const [saved, setSaved] = useState(roles);
  const [draft, setDraft] = useState(roles);
  const [editing, setEditing] = useState<Role | "new" | null>(null);

  const dirty = JSON.stringify(saved) !== JSON.stringify(draft);
  const groups = [...new Set(permissions.map((p) => p.group))];

  function toggle(roleId: string, permissionId: string, on: boolean) {
    setDraft((current) =>
      current.map((r) =>
        r.id === roleId
          ? { ...r, permissions: on ? [...r.permissions, permissionId] : r.permissions.filter((p) => p !== permissionId) }
          : r,
      ),
    );
  }

  function commit(next: Role[], message: string) {
    setSaved(next);
    setDraft(next);
    toast.success(message);
    onSave?.(next);
  }

  return (
    <div className={cn("grid min-w-0 grid-cols-1 gap-6", className)}>
      <PageHeader
        title="Roles and permissions"
        description={`${draft.length} roles across ${draft.reduce((n, r) => n + r.members.length, 0)} people. Changes apply the next time someone loads a page.`}
        actions={
          <Button variant="accent" onClick={() => setEditing("new")}>
            Create role
          </Button>
        }
      />


      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {draft.map((role) => (
          <li key={role.id} className="surface flex flex-col gap-4 rounded-card p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="flex items-center gap-2 font-semibold">
                  {role.name}
                  {role.locked && <Badge variant="outline">Built in</Badge>}
                </h3>
                <p className="mt-1 text-sm text-muted">{role.description}</p>
              </div>
            </div>
            <div className="mt-auto flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <AvatarGroup size="sm" max={4}>
                  {role.members.map((m, i) => (
                    <Avatar key={m} size="sm" alt={m} fallbackClassName={cn("font-semibold", solidTints[i % solidTints.length])} />
                  ))}
                </AvatarGroup>
                <span className="text-xs text-muted">
                  {role.members.length} {role.members.length === 1 ? "person" : "people"} · {role.permissions.length} of {permissions.length}
                </span>
              </div>
              <Button size="sm" variant="ghost" disabled={role.locked} onClick={() => setEditing(role)} aria-label={`Edit ${role.name} role`}>
                Edit
              </Button>
            </div>
          </li>
        ))}
      </ul>

      <section className="grid min-w-0 grid-cols-1 gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold">Permissions matrix</h3>
            <p className="text-sm text-muted">Tick what each role can do. The owner always has everything.</p>
          </div>
          {dirty && (
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" onClick={() => setDraft(saved)}>
                Discard changes
              </Button>
              <Button size="sm" variant="accent" onClick={() => commit(draft, "Permissions saved.")}>
                Save permissions
              </Button>
            </div>
          )}
        </div>
        <Table>
          <TableCaption className="sr-only">Permissions by role</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-52">Permission</TableHead>
              {draft.map((role) => (
                <TableHead key={role.id} className="text-center whitespace-nowrap">
                  {role.name}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {groups.map((group) => (
              <PermissionGroup key={group} group={group} permissions={permissions.filter((p) => p.group === group)} roles={draft} onToggle={toggle} />
            ))}
          </TableBody>
        </Table>
      </section>

      <RoleDialog
        role={editing}
        permissions={permissions}
        takenNames={draft.filter((r) => editing === "new" || r.id !== editing?.id).map((r) => r.name.toLowerCase())}
        onClose={() => setEditing(null)}
        onSave={(role) => {
          const exists = draft.some((r) => r.id === role.id);
          const next = exists ? draft.map((r) => (r.id === role.id ? role : r)) : [...draft, role];
          commit(next, exists ? `Updated the ${role.name} role.` : `Created the ${role.name} role. Assign it from the users page.`);
          setEditing(null);
        }}
      />
    </div>
  );
}

function PermissionGroup({
  group,
  permissions,
  roles,
  onToggle,
}: {
  group: string;
  permissions: Permission[];
  roles: Role[];
  onToggle: (roleId: string, permissionId: string, on: boolean) => void;
}) {
  return (
    <>
      <TableRow className="hover:bg-transparent">
        <TableCell colSpan={roles.length + 1} className="pt-5 pb-2 text-xs font-medium tracking-wide text-muted uppercase">
          {group}
        </TableCell>
      </TableRow>
      {permissions.map((permission) => (
        <TableRow key={permission.id}>
          <TableCell>
            <div className="font-medium">{permission.label}</div>
            {permission.description && <div className="text-xs text-muted">{permission.description}</div>}
          </TableCell>
          {roles.map((role) => (
            <TableCell key={role.id} className="text-center">
              <span className="inline-flex">
                <Checkbox
                  aria-label={`${role.name}: ${permission.label}`}
                  checked={role.permissions.includes(permission.id)}
                  disabled={role.locked}
                  onCheckedChange={(v) => onToggle(role.id, permission.id, v === true)}
                />
              </span>
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

function RoleDialog({
  role,
  permissions,
  takenNames,
  onClose,
  onSave,
}: {
  role: Role | "new" | null;
  permissions: Permission[];
  takenNames: string[];
  onClose: () => void;
  onSave: (role: Role) => void;
}) {
  const isNew = role === "new";
  const source = role && role !== "new" ? role : null;
  const key = isNew ? "new" : (source?.id ?? "closed");
  return (
    <Dialog open={role !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent size="lg">
        {role !== null && <RoleForm key={key} source={source} permissions={permissions} takenNames={takenNames} onSave={onSave} />}
      </DialogContent>
    </Dialog>
  );
}

function RoleForm({
  source,
  permissions,
  takenNames,
  onSave,
}: {
  source: Role | null;
  permissions: Permission[];
  takenNames: string[];
  onSave: (role: Role) => void;
}) {
  const [name, setName] = useState(source?.name ?? "");
  const [description, setDescription] = useState(source?.description ?? "");
  const [picked, setPicked] = useState<string[]>(source?.permissions ?? ["projects.view"]);
  const [touched, setTouched] = useState(false);
  const groups = [...new Set(permissions.map((p) => p.group))];

  const error = !name.trim()
    ? "Give the role a name."
    : takenNames.includes(name.trim().toLowerCase())
      ? "Another role already has this name."
      : undefined;

  function submit(event: React.FormEvent) {
    event.preventDefault();
    setTouched(true);
    if (error) return;
    onSave({
      id: source?.id ?? name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      name: name.trim(),
      description: description.trim() || "Custom role.",
      members: source?.members ?? [],
      permissions: picked,
    });
  }

  return (
    <form onSubmit={submit} noValidate className="contents">
      <DialogHeader
        icon={
          <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M12 3 5 6v5c0 4.5 3 8.3 7 10 4-1.7 7-5.5 7-10V6l-7-3Z" />
            <path d="m9 12 2 2 4-4" />
          </svg>
        }
      >
        <DialogTitle>{source ? `Edit ${source.name}` : "Create a role"}</DialogTitle>
        <DialogDescription>
          {source
            ? `${source.members.length} ${source.members.length === 1 ? "person has" : "people have"} this role. They get the new permissions right away.`
            : "Start from the permissions below. You can assign the role once it exists."}
        </DialogDescription>
      </DialogHeader>
      <DialogBody className="grid gap-5">
        <Input label="Role name" value={name} onChange={(e) => setName(e.target.value)} error={touched ? error : undefined} maxLength={32} />
        <Textarea label="What is this role for?" rows={2} value={description} onChange={(e) => setDescription(e.target.value)} />
        <fieldset className="grid gap-4">
          <legend className="mb-3 text-sm font-medium">
            Permissions <span className="font-normal text-muted">· {picked.length} selected</span>
          </legend>
          <div className="grid gap-4 sm:grid-cols-2">
            {groups.map((group) => (
              <div key={group} className="grid content-start gap-2">
                <p className="text-xs font-medium tracking-wide text-muted uppercase">{group}</p>
                {permissions
                  .filter((p) => p.group === group)
                  .map((p) => (
                    <label key={p.id} className="flex cursor-pointer items-center gap-2.5 text-sm">
                      <Checkbox
                        checked={picked.includes(p.id)}
                        onCheckedChange={(v) => setPicked((cur) => (v === true ? [...cur, p.id] : cur.filter((x) => x !== p.id)))}
                      />
                      {p.label}
                    </label>
                  ))}
              </div>
            ))}
          </div>
        </fieldset>
      </DialogBody>
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="ghost">
            Cancel
          </Button>
        </DialogClose>
        <Button type="submit" variant="accent">
          {source ? "Save role" : "Create role"}
        </Button>
      </DialogFooter>
    </form>
  );
}
