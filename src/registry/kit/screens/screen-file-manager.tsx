"use client";

import { useEffect, useMemo, useRef, useState, type DragEvent, type KeyboardEvent, type ReactNode } from "react";

import { cn } from "@/registry/kit/lib/utils";
import { Badge } from "@/registry/kit/ui/badge";
import { Breadcrumb } from "@/registry/kit/ui/breadcrumb";
import { Button } from "@/registry/kit/ui/button";
import { Checkbox } from "@/registry/kit/ui/checkbox";
import { ConfirmDialog } from "@/registry/kit/ui/confirm-dialog";
import { FileUpload, simulateUpload } from "@/registry/kit/ui/file-upload";
import { FolderPickerDialog } from "@/registry/kit/ui/folder-picker-dialog";
import { KbdGroup } from "@/registry/kit/ui/kbd";
import { MultiSelect } from "@/registry/kit/ui/multi-select";
import { NameDialog } from "@/registry/kit/ui/name-dialog";
import { PageHeader } from "@/registry/kit/ui/page-header";
import { Progress } from "@/registry/kit/ui/progress";
import { RowActions, type RowAction } from "@/registry/kit/ui/row-actions";
import { SearchInput } from "@/registry/kit/ui/search-input";
import { SegmentedControl } from "@/registry/kit/ui/segmented-control";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/registry/kit/ui/select";
import { SelectionBar } from "@/registry/kit/ui/selection-bar";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/registry/kit/ui/sheet";
import { EmptyState } from "@/registry/kit/ui/states";
import { Switch } from "@/registry/kit/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/registry/kit/ui/table";
import { toast } from "@/registry/kit/ui/toast";

export type FileKind = "folder" | "image" | "pdf" | "sheet" | "doc" | "video" | "archive";

export interface FileItem {
  id: string;
  name: string;
  kind: FileKind;
  /** Parent folder id; null for the root. */
  parent: string | null;
  /** Bytes; ignored for folders. */
  size?: number;
  /** ISO date-time of the last change. */
  modified: string;
  /** ISO date-time it was added; falls back to `modified`. */
  created?: string;
  owner: string;
  /** Pinned to the Starred section (files only). */
  starred?: boolean;
  /** Anyone with the link can view it. */
  shared?: boolean;
  /** Length in seconds, for videos. */
  duration?: number;
  /** ISO date-time it was moved to Trash; trashed items leave the folders but still count toward storage. */
  trashedAt?: string;
  /** Set on the contents of a trashed folder: the folder they went with. */
  trashedWith?: string;
}

export const defaultFiles: FileItem[] = [
  { id: "f-reports", name: "Reports", kind: "folder", parent: null, modified: "2026-10-24T16:20:00", created: "2026-03-02T09:00:00", owner: "Ada Kaya" },
  { id: "f-brand", name: "Brand assets", kind: "folder", parent: null, modified: "2026-10-12T11:05:00", created: "2025-11-18T10:30:00", owner: "Lucía Moreno" },
  { id: "f-exports", name: "Exports", kind: "folder", parent: null, modified: "2026-10-26T08:40:00", created: "2026-01-09T14:12:00", owner: "Ada Kaya" },
  { id: "f-q3", name: "Q3", kind: "folder", parent: "f-reports", modified: "2026-10-02T17:45:00", created: "2026-07-01T09:15:00", owner: "Marcus Ode" },
  { id: "f-campaigns", name: "Campaigns", kind: "folder", parent: "f-brand", modified: "2026-09-18T13:10:00", created: "2026-04-22T15:00:00", owner: "Hana Sato" },
  { id: "1", name: "Retention review Q3.pdf", kind: "pdf", parent: "f-q3", size: 2_418_331, modified: "2026-10-02T17:45:00", created: "2026-09-29T10:02:00", owner: "Marcus Ode", starred: true, shared: true },
  { id: "2", name: "Board metrics.xlsx", kind: "sheet", parent: "f-q3", size: 384_112, modified: "2026-10-01T09:30:00", created: "2026-07-03T08:20:00", owner: "Marcus Ode", shared: true },
  { id: "3", name: "Weekly funnel report.pdf", kind: "pdf", parent: "f-reports", size: 1_204_890, modified: "2026-10-24T16:20:00", created: "2026-08-14T07:55:00", owner: "Priya Raman", starred: true },
  { id: "4", name: "Churn interviews.docx", kind: "doc", parent: "f-reports", size: 96_420, modified: "2026-10-19T15:12:00", created: "2026-10-05T11:40:00", owner: "Amara Okafor" },
  { id: "5", name: "Logo lockups.zip", kind: "archive", parent: "f-brand", size: 18_772_004, modified: "2026-10-12T11:05:00", created: "2026-10-12T11:05:00", owner: "Lucía Moreno", shared: true },
  { id: "6", name: "Dashboard hero.png", kind: "image", parent: "f-brand", size: 1_839_552, modified: "2026-10-09T10:48:00", created: "2026-10-09T10:48:00", owner: "Lucía Moreno", starred: true },
  { id: "7", name: "Product tour.mp4", kind: "video", parent: "f-brand", size: 64_310_221, modified: "2026-10-06T18:03:00", created: "2026-10-06T18:03:00", owner: "Hana Sato", shared: true, duration: 134 },
  { id: "8", name: "cohorts-2026-10-25.csv", kind: "sheet", parent: "f-exports", size: 7_340_118, modified: "2026-10-26T08:40:00", created: "2026-10-26T08:40:00", owner: "Ada Kaya" },
  { id: "9", name: "events-sample.csv", kind: "sheet", parent: "f-exports", size: 512_903, modified: "2026-10-21T12:26:00", created: "2026-10-21T12:26:00", owner: "Jonas Lindqvist" },
  { id: "10", name: "Onboarding flow.png", kind: "image", parent: null, size: 902_114, modified: "2026-10-25T14:37:00", created: "2026-10-20T09:11:00", owner: "Lucía Moreno" },
  { id: "11", name: "Pricing experiment brief.docx", kind: "doc", parent: null, size: 48_330, modified: "2026-10-22T10:05:00", created: "2026-10-17T16:44:00", owner: "Priya Raman", starred: true },
  { id: "14", name: "Release notes 4.2.pdf", kind: "pdf", parent: null, size: 318_207, modified: "2026-10-16T09:58:00", created: "2026-10-16T09:58:00", owner: "Jonas Lindqvist", shared: true },
  { id: "15", name: "Spring launch banner.png", kind: "image", parent: "f-campaigns", size: 3_106_440, modified: "2026-09-18T13:10:00", created: "2026-04-22T15:00:00", owner: "Hana Sato" },
  { id: "16", name: "Webinar recap.mp4", kind: "video", parent: "f-campaigns", size: 148_902_336, modified: "2026-09-11T16:30:00", created: "2026-09-11T16:30:00", owner: "Hana Sato", duration: 1_847 },
  { id: "12", name: "Old landing hero.png", kind: "image", parent: "f-brand", size: 2_204_871, modified: "2026-09-03T12:00:00", owner: "Lucía Moreno", trashedAt: "2026-10-20T11:30:00" },
  { id: "13", name: "events-backfill-draft.csv", kind: "sheet", parent: "f-exports", size: 11_093_442, modified: "2026-10-14T09:12:00", owner: "Jonas Lindqvist", trashedAt: "2026-10-25T17:02:00" },
];

const kindMeta: Record<FileKind, { label: string; plural: string; className: string; path: string }> = {
  folder: { label: "Folder", plural: "Folders", className: "text-accent bg-accent/12", path: "M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" },
  image: { label: "Image", plural: "Images", className: "text-info bg-info/12", path: "M4 5h16v14H4zM4 16l5-5 4 4 3-3 4 4M15 9h.01" },
  pdf: { label: "PDF", plural: "PDFs", className: "text-danger bg-danger/12", path: "M7 3h7l5 5v13H7zM14 3v5h5M10 13h4M10 17h4" },
  sheet: { label: "Spreadsheet", plural: "Spreadsheets", className: "text-success bg-success/12", path: "M5 3h14v18H5zM5 9h14M5 15h14M11 3v18" },
  doc: { label: "Document", plural: "Documents", className: "text-info bg-info/12", path: "M7 3h7l5 5v13H7zM14 3v5h5M10 12h6M10 16h6" },
  video: { label: "Video", plural: "Videos", className: "text-warning bg-warning/12", path: "M4 6h12v12H4zM16 10l4-2v8l-4-2" },
  archive: { label: "Archive", plural: "Archives", className: "text-muted bg-fg/8", path: "M4 4h16v4H4zM5 8v12h14V8M12 8v6" },
};

const fileKinds: Exclude<FileKind, "folder">[] = ["image", "pdf", "doc", "sheet", "video", "archive"];

const icons = {
  open: "M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v1M3 7v10a2 2 0 0 0 2 2h12l4-8H7l-4 8",
  details: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-10v5m0-8h.01",
  star: "m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z",
  link: "M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1",
  rename: "M4 20h4L19 9l-4-4L4 16zM13.5 6.5l4 4",
  move: "M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM10 13h6M13 10l3 3-3 3",
  trash: "M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3",
  restore: "M4 12a8 8 0 1 0 2.3-5.7M4 4v4h4",
  deleteForever: "M6 6l12 12M18 6 6 18",
  download: "M12 4v12M7 11l5 5 5-5M4 20h16",
  folderPlus: "M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM12 10v6M9 13h6",
  upload: "M12 16V4M7 9l5-5 5 5M4 20h16",
  shared: "M16 19v-1a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v1M9 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6M22 19v-1a4 4 0 0 0-3-3.9M16 4.1a3 3 0 0 1 0 5.8",
  recent: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-13v4l3 2",
  all: "M4 5h6v6H4zM14 5h6v6h-6zM4 15h6v4H4zM14 15h6v4h-6z",
};

const Icon = ({ d, className, filled }: { d: string; className?: string; filled?: boolean }) => (
  <svg viewBox="0 0 24 24" className={cn("size-4 shrink-0", className)} fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d={d} />
  </svg>
);

const KindIcon = ({ kind, className }: { kind: FileKind; className?: string }) => (
  <span className={cn("grid shrink-0 place-items-center rounded-field", kindMeta[kind].className, className)} aria-hidden>
    <svg viewBox="0 0 24 24" className="size-[45%] max-h-12 max-w-12" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d={kindMeta[kind].path} />
    </svg>
  </span>
);

const bytes = (n: number) => {
  if (n < 1024) return `${n} B`;
  const units = ["KB", "MB", "GB"];
  let v = n / 1024;
  let i = 0;
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024;
    i += 1;
  }
  return `${v.toFixed(v < 10 ? 1 : 0)} ${units[i]}`;
};

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const dayMs = 86_400_000;
const parse = (iso: string) => new Date(iso.length <= 10 ? `${iso}T12:00:00` : iso);
const shortDate = (iso: string, today: string) => {
  const d = parse(iso);
  return `${d.getDate()} ${months[d.getMonth()]}${d.getFullYear() === parse(today).getFullYear() ? "" : ` ${d.getFullYear()}`}`;
};
const daysAgo = (iso: string, today: string) => Math.floor((parse(today.slice(0, 10)).getTime() - parse(iso.slice(0, 10)).getTime()) / dayMs);
/** "Today", "Yesterday", "4 days ago", "2 weeks ago", then the date. */
const relative = (iso: string, today: string) => {
  const d = daysAgo(iso, today);
  if (d <= 0) return "Today";
  if (d === 1) return "Yesterday";
  if (d < 7) return `${d} days ago`;
  if (d < 28) return `${Math.floor(d / 7)} ${d < 14 ? "week" : "weeks"} ago`;
  return shortDate(iso, today);
};
const fullDate = (iso: string, today: string) => {
  const d = parse(iso);
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}, ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")} · ${relative(iso, today).toLowerCase()}`;
};
const duration = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
const extensionOf = (name: string) => (name.includes(".") ? name.split(".").pop()!.toUpperCase() : "—");
const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

const breakdownOrder: FileKind[] = ["video", "archive", "sheet", "pdf", "image", "doc"];
const barTone: Partial<Record<FileKind, string>> = {
  video: "bg-warning",
  archive: "bg-muted",
  sheet: "bg-success",
  pdf: "bg-danger",
  image: "bg-info",
  doc: "bg-accent",
};

type Section = "all" | "recent" | "starred" | "shared" | "trash";
const sections: { id: Section; label: string; icon: string }[] = [
  { id: "all", label: "All files", icon: icons.all },
  { id: "recent", label: "Recent", icon: icons.recent },
  { id: "starred", label: "Starred", icon: icons.star },
  { id: "shared", label: "Shared", icon: icons.shared },
  { id: "trash", label: "Trash", icon: icons.trash },
];

/** Days a file counts as recent. */
const RECENT_DAYS = 14;

export interface FileManagerScreenProps {
  files?: FileItem[];
  /** Storage quota in bytes. */
  quota?: number;
  /** Name shown as the root of the breadcrumb. */
  rootName?: string;
  /** Name stamped on uploads and new folders. */
  me?: string;
  /** "Now" for relative dates and the Recent section, as an ISO date. */
  today?: string;
}

type Sort = "name" | "modified" | "size";
type NameTarget = { mode: "create" } | { mode: "rename"; id: string };
type Confirm = { kind: "trash" | "delete"; ids: string[] };

/**
 * Folder browser with sections (all, recent, starred, shared, trash), grid and
 * list views, selection with bulk actions, rename, move by dialog or drag and
 * drop, kind filters, keyboard shortcuts, storage usage, uploads and a
 * details sheet with a generated preview.
 */
export function FileManagerScreen({
  files: initial = defaultFiles,
  quota = 2 * 1024 ** 3,
  rootName = "All files",
  me = "Ada Kaya",
  today = "2026-10-27",
}: FileManagerScreenProps) {
  const now = `${today.slice(0, 10)}T12:00:00`;
  const [files, setFiles] = useState(initial);
  const [section, setSection] = useState<Section>("all");
  const [folder, setFolder] = useState<string | null>(null);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sort, setSort] = useState<Sort>("name");
  const [query, setQuery] = useState("");
  const [kinds, setKinds] = useState<FileKind[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadedCount, setUploadedCount] = useState(0);
  const [nameTarget, setNameTarget] = useState<NameTarget | null>(null);
  const [moveIds, setMoveIds] = useState<string[] | null>(null);
  const [confirm, setConfirm] = useState<Confirm | null>(null);
  const [dropTarget, setDropTarget] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const dragging = useRef<string[] | null>(null);
  const areaRef = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const byId = useMemo(() => new Map(files.map((f) => [f.id, f])), [files]);
  const live = useMemo(() => files.filter((f) => !f.trashedAt), [files]);
  // Top-level trashed items; a trashed folder's contents travel with it.
  const trashed = useMemo(() => files.filter((f) => f.trashedAt && !f.trashedWith), [files]);
  const liveFiles = useMemo(() => live.filter((f) => f.kind !== "folder"), [live]);
  const inTrash = section === "trash";
  const filtering = kinds.length > 0;
  const searching = query.trim() !== "" || filtering;

  const pools = useMemo<Record<Section, FileItem[]>>(
    () => ({
      all: live,
      recent: liveFiles.filter((f) => daysAgo(f.modified, today) <= RECENT_DAYS),
      starred: liveFiles.filter((f) => f.starred),
      shared: liveFiles.filter((f) => f.shared),
      trash: trashed,
    }),
    [live, liveFiles, trashed, today],
  );
  const counts: Record<Section, number> = {
    all: liveFiles.length,
    recent: pools.recent.length,
    starred: pools.starred.length,
    shared: pools.shared.length,
    trash: trashed.length,
  };

  const trail = useMemo(() => {
    const path: FileItem[] = [];
    for (let id = folder; id; ) {
      const f = byId.get(id);
      if (!f || f.trashedAt) break;
      path.unshift(f);
      id = f.parent;
    }
    return path;
  }, [byId, folder]);
  const here = section === "all" && !searching ? folder : null;
  const hereName = (section === "all" && trail.at(-1)?.name) || rootName;

  const children = (id: string) => live.filter((f) => f.parent === id);
  const descendants = (id: string): FileItem[] => children(id).flatMap((c) => [c, ...descendants(c.id)]);
  const sizeOf = (item: FileItem): number =>
    item.kind === "folder" ? files.filter((f) => f.parent === item.id || f.trashedWith === item.id).reduce((sum, f) => sum + sizeOf(f), 0) : (item.size ?? 0);
  const pathOf = (item: FileItem) => {
    const names: string[] = [];
    for (let id = item.parent; id; id = byId.get(id)?.parent ?? null) names.unshift(byId.get(id)?.name ?? "");
    return [rootName, ...names].join(" / ");
  };

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = pools[section];
    if (section === "all" && !searching) list = list.filter((f) => f.parent === folder);
    if (q) list = list.filter((f) => f.name.toLowerCase().includes(q));
    if (filtering) list = list.filter((f) => kinds.includes(f.kind));
    return [...list].sort((a, b) => {
      if ((a.kind === "folder") !== (b.kind === "folder")) return a.kind === "folder" ? -1 : 1;
      if (sort === "size") return sizeOf(b) - sizeOf(a);
      if (sort === "modified") return parse(b.trashedAt ?? b.modified).getTime() - parse(a.trashedAt ?? a.modified).getTime();
      return a.name.localeCompare(b.name);
    });
    // sizeOf only reads `files`, which `pools` derives from.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pools, section, searching, folder, query, filtering, kinds, sort]);

  const visibleIds = new Set(visible.map((f) => f.id));
  const picked = selected.filter((id) => visibleIds.has(id));
  const pickedItems = picked.map((id) => byId.get(id)!).filter(Boolean);
  const allPicked = visible.length > 0 && picked.length === visible.length;

  const kindCounts = fileKinds.map((kind) => ({
    value: kind,
    label: kindMeta[kind].plural,
    count: (section === "all" ? liveFiles : pools[section]).filter((f) => f.kind === kind).length,
  }));

  const used = files.reduce((sum, f) => sum + (f.kind === "folder" ? 0 : (f.size ?? 0)), 0);
  const byKind = breakdownOrder.map((kind) => ({ kind, size: liveFiles.filter((f) => f.kind === kind).reduce((sum, f) => sum + (f.size ?? 0), 0) }));
  const trashSize = files.filter((f) => f.trashedAt).reduce((sum, f) => sum + (f.kind === "folder" ? 0 : (f.size ?? 0)), 0);
  const preview = previewId ? (byId.get(previewId) ?? null) : null;

  function announce(message: string) {
    setAnnouncement(message);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setAnnouncement(""), 4000);
  }

  function go(next: Section, nextFolder: string | null = null) {
    setSection(next);
    setFolder(nextFolder);
    setQuery("");
    setKinds([]);
    setSelected([]);
  }

  function openFolder(id: string | null) {
    go("all", id);
  }

  function openItem(item: FileItem) {
    if (item.trashedAt) return;
    if (item.kind === "folder") openFolder(item.id);
    else setPreviewId(item.id);
  }

  /** Drops ids whose ancestor is also in the list; the ancestor carries them. */
  function topLevel(ids: string[]) {
    const set = new Set(ids);
    return ids.filter((id) => {
      for (let p = byId.get(id)?.parent ?? null; p; p = byId.get(p)?.parent ?? null) if (set.has(p)) return false;
      return true;
    });
  }

  const label = (ids: string[]) => (ids.length === 1 ? `“${byId.get(ids[0]!)?.name}”` : plural(ids.length, "item"));

  // Each finished upload lands in the open folder straight away.
  async function uploadFile(file: File, onProgress: (percent: number) => void) {
    await simulateUpload(file, onProgress);
    setFiles((all) => [
      { id: `u${all.length}-${file.name}`, name: file.name, kind: kindFromName(file.name), parent: here, size: file.size || 1, modified: now, created: now, owner: me },
      ...all,
    ]);
    toast.success(`Uploaded “${file.name}” to ${hereName}.`);
  }

  function trash(ids: string[]) {
    const tops = topLevel(ids);
    if (!tops.length) return;
    const owner = new Map<string, string>();
    for (const id of tops) {
      owner.set(id, id);
      for (const d of descendants(id)) owner.set(d.id, id);
    }
    setFiles((all) =>
      all.map((f) => {
        const top = owner.get(f.id);
        return top ? { ...f, trashedAt: now, trashedWith: f.id === top ? undefined : top } : f;
      }),
    );
    setSelected([]);
    if (previewId && owner.has(previewId)) setPreviewId(null);
    toast.success(`Moved ${label(tops)} to Trash.`, { action: { label: "Undo", onClick: () => restore(tops, true) } });
  }

  /** Asks first when a folder holds anything or the request came from the keyboard. */
  function requestTrash(ids: string[], ask = false) {
    const hasContents = ids.some((id) => byId.get(id)?.kind === "folder" && children(id).length > 0);
    if (ask || hasContents) setConfirm({ kind: "trash", ids });
    else trash(ids);
  }

  /** Brings items (and anything that went with them) back; to the root if their folder is gone. */
  function restore(ids: string[], quiet = false) {
    const set = new Set(ids);
    setFiles((all) =>
      all.map((f) => {
        if (set.has(f.id)) {
          const parentGone = f.parent !== null && !all.some((p) => p.id === f.parent && (!p.trashedAt || set.has(p.id)));
          return { ...f, trashedAt: undefined, trashedWith: undefined, parent: parentGone ? null : f.parent };
        }
        return f.trashedWith && set.has(f.trashedWith) ? { ...f, trashedAt: undefined, trashedWith: undefined } : f;
      }),
    );
    setSelected([]);
    if (!quiet) toast.success(`Restored ${label(ids)}.`);
  }

  function deleteForever(ids: string[], emptying = false) {
    const set = new Set(ids);
    setFiles((all) => all.filter((f) => !set.has(f.id) && !(f.trashedWith && set.has(f.trashedWith))));
    setSelected([]);
    toast.success(emptying ? `Emptied Trash. ${plural(ids.length, "item")} deleted for good.` : `Deleted ${label(ids)} for good.`);
  }

  /** Whether `ids` can go into `target` (null = root): not into themselves or their own subfolders. */
  function canMove(ids: string[], target: string | null) {
    if (target && ids.includes(target)) return false;
    for (let p = target; p; p = byId.get(p)?.parent ?? null) if (ids.includes(p)) return false;
    return ids.some((id) => byId.get(id)?.parent !== target);
  }

  function move(ids: string[], target: string | null) {
    const tops = topLevel(ids).filter((id) => byId.get(id)?.parent !== target);
    const targetName = target ? (byId.get(target)?.name ?? rootName) : rootName;
    if (!tops.length) return void toast(`Already in “${targetName}”.`);
    if (!canMove(tops, target)) return void toast.error("A folder can't go inside itself. Choose another folder.");
    const taken = new Set(live.filter((f) => f.parent === target).map((f) => f.name.toLocaleLowerCase()));
    const clash = tops.map((id) => byId.get(id)!).find((f) => taken.has(f.name.toLocaleLowerCase()));
    if (clash) return void toast.error(`“${targetName}” already has an item called “${clash.name}”. Rename one of them, then move again.`);
    const before = new Map(tops.map((id) => [id, byId.get(id)!.parent]));
    setFiles((all) => all.map((f) => (before.has(f.id) ? { ...f, parent: target } : f)));
    setSelected([]);
    toast.success(`Moved ${label(tops)} to “${targetName}”.`, {
      action: {
        label: "Undo",
        onClick: () => setFiles((all) => all.map((f) => (before.has(f.id) ? { ...f, parent: before.get(f.id)! } : f))),
      },
    });
  }

  function toggleStar(ids: string[]) {
    const items = ids.map((id) => byId.get(id)!).filter((f) => f && f.kind !== "folder");
    if (!items.length) return;
    const star = !items.every((f) => f.starred);
    const set = new Set(items.map((f) => f.id));
    setFiles((all) => all.map((f) => (set.has(f.id) ? { ...f, starred: star } : f)));
    const what = items.length === 1 ? `“${items[0]!.name}”` : plural(items.length, "file");
    toast.success(star ? `Starred ${what}.` : `Removed ${what} from Starred.`);
  }

  function toggleShare(item: FileItem) {
    setFiles((all) => all.map((f) => (f.id === item.id ? { ...f, shared: !f.shared } : f)));
    toast.success(item.shared ? `Link sharing is off for “${item.name}”. Old links stop working.` : `Anyone with the link can now view “${item.name}”.`);
  }

  function copyLink(item: FileItem) {
    void navigator.clipboard?.writeText(`https://files.lumen.app/s/${item.id}`).catch(() => {});
    toast.success(`Copied a link to “${item.name}”.`);
  }

  function submitName(name: string) {
    if (!nameTarget) return;
    if (nameTarget.mode === "create") {
      const id = `f-${Date.now().toString(36)}`;
      setFiles((all) => [{ id, name, kind: "folder", parent: here, modified: now, created: now, owner: me }, ...all]);
      toast.success(`Created folder “${name}” in ${hereName}.`, { action: { label: "Open", onClick: () => openFolder(id) } });
    } else {
      const old = byId.get(nameTarget.id)?.name;
      setFiles((all) => all.map((f) => (f.id === nameTarget.id ? { ...f, name, modified: now } : f)));
      toast.success(`Renamed “${old}” to “${name}”.`);
    }
  }

  const nameItem = nameTarget?.mode === "rename" ? byId.get(nameTarget.id) : undefined;
  const nameParent = nameItem ? nameItem.parent : here;
  const takenNames = live.filter((f) => f.parent === nameParent && f.id !== nameItem?.id).map((f) => f.name);

  function actionsFor(item: FileItem, { inSheet = false } = {}): RowAction[] {
    if (item.trashedAt) {
      return [
        { label: "Restore", icon: icons.restore, onSelect: () => restore([item.id]) },
        { label: "Delete forever", icon: icons.deleteForever, destructive: true, separatorBefore: true, onSelect: () => setConfirm({ kind: "delete", ids: [item.id] }) },
      ];
    }
    const common: RowAction[] = [
      { label: "Rename", icon: icons.rename, shortcut: "F2", separatorBefore: true, onSelect: () => setNameTarget({ mode: "rename", id: item.id }) },
      { label: "Move to folder", icon: icons.move, onSelect: () => setMoveIds([item.id]) },
      {
        label: "Move to Trash",
        icon: icons.trash,
        shortcut: "Del",
        destructive: true,
        separatorBefore: true,
        onSelect: () => requestTrash([item.id], inSheet),
      },
    ];
    if (item.kind === "folder") return [{ label: "Open", icon: icons.open, onSelect: () => openFolder(item.id) }, ...common];
    return [
      ...(inSheet ? [] : [{ label: "View details", icon: icons.details, onSelect: () => setPreviewId(item.id) }]),
      { label: item.starred ? "Remove from Starred" : "Add to Starred", icon: icons.star, onSelect: () => toggleStar([item.id]) },
      ...(inSheet ? [] : [{ label: "Copy link", icon: icons.link, onSelect: () => copyLink(item) }]),
      ...common,
    ];
  }

  // Drag and drop: items onto folder cards, folder rows and breadcrumb crumbs.
  function dragStart(event: DragEvent, item: FileItem) {
    const ids = picked.includes(item.id) ? picked : [item.id];
    dragging.current = ids;
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", ids.map((id) => byId.get(id)?.name).join("\n"));
    announce(`Dragging ${label(ids)}. Drop on a folder or a breadcrumb to move.`);
  }
  function dropProps(target: string | null, key: string) {
    return {
      "data-drop": dropTarget === key ? "true" : undefined,
      onDragOver: (event: DragEvent) => {
        const ids = dragging.current;
        if (!ids || !canMove(ids, target)) return;
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
        setDropTarget(key);
      },
      onDragLeave: (event: DragEvent) => {
        if (!(event.currentTarget as HTMLElement).contains(event.relatedTarget as Node)) setDropTarget((t) => (t === key ? null : t));
      },
      onDrop: (event: DragEvent) => {
        event.preventDefault();
        const ids = dragging.current;
        dragging.current = null;
        setDropTarget(null);
        if (ids) move(ids, target);
      },
    };
  }
  function dragEnd() {
    dragging.current = null;
    setDropTarget(null);
  }

  function onAreaKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const target = event.target as HTMLElement;
    if (!areaRef.current?.contains(target) || target.closest("input, textarea, [contenteditable=true]")) return;
    const focused = target.closest<HTMLElement>("[data-item-id]")?.dataset.itemId;
    const targets = picked.length ? picked : focused ? [focused] : [];
    const mod = event.ctrlKey || event.metaKey;
    if (mod && event.key.toLowerCase() === "a") {
      event.preventDefault();
      setSelected(visible.map((f) => f.id));
    } else if (event.key === "Escape" && picked.length) {
      event.preventDefault();
      setSelected([]);
      announce("Selection cleared.");
    } else if ((event.key === "Delete" || (mod && event.key === "Backspace")) && targets.length) {
      event.preventDefault();
      setConfirm({ kind: inTrash ? "delete" : "trash", ids: targets });
    } else if (event.key === "F2" && targets.length === 1 && !inTrash) {
      event.preventDefault();
      setNameTarget({ mode: "rename", id: targets[0]! });
    } else if (event.key === "Enter" && target.getAttribute("role") === "checkbox" && focused) {
      event.preventDefault();
      openItem(byId.get(focused)!);
    }
  }

  const toggle = (id: string, on: boolean) => setSelected((all) => (on ? [...all.filter((x) => visibleIds.has(x)), id] : all.filter((x) => x !== id)));

  const sectionLabel = sections.find((s) => s.id === section)!.label;
  const crumbs =
    section !== "all"
      ? [{ label: sectionLabel }, ...(searching ? [{ label: query.trim() ? `Results for “${query.trim()}”` : "Filtered" }] : [])]
      : searching
        ? [{ label: rootName }, { label: query.trim() ? `Results for “${query.trim()}”` : "Filtered" }]
        : [{ label: rootName }, ...trail.map((f) => ({ label: f.name }))];

  function onCrumb(i: number) {
    if (searching) {
      setQuery("");
      setKinds([]);
    } else if (section === "all") openFolder(i === 0 ? null : trail[i - 1]!.id);
  }

  const confirmItems = confirm ? confirm.ids.map((id) => byId.get(id)).filter((f): f is FileItem => Boolean(f)) : [];
  const insideCount = confirmItems.reduce((n, f) => n + (f.kind === "folder" ? descendants(f.id).length : 0), 0);

  const empty = (() => {
    if (searching)
      return {
        title: "No files match",
        description: filtering
          ? `Nothing ${query.trim() ? `called “${query.trim()}” ` : ""}among ${kinds.map((k) => kindMeta[k].plural.toLowerCase()).join(", ")}${section === "all" ? " in any folder" : ` in ${sectionLabel}`}.`
          : `Search looks at file names${section === "all" ? " in every folder" : ` in ${sectionLabel}`}. Try part of the name.`,
        action: (
          <Button size="sm" onClick={() => (setQuery(""), setKinds([]))}>
            Clear {filtering && query.trim() ? "search and filters" : filtering ? "filters" : "search"}
          </Button>
        ),
      };
    const back = (
      <Button size="sm" onClick={() => go("all")}>
        Go to all files
      </Button>
    );
    switch (section) {
      case "recent":
        return { title: "Nothing changed lately", description: `Files you add or edit show up here for ${RECENT_DAYS} days.`, action: back };
      case "starred":
        return { title: "No starred files", description: "Star a file from its menu or its card to keep it one click away.", action: back };
      case "shared":
        return { title: "Nothing is shared", description: "Turn on link sharing in a file's details to let others view it.", action: back };
      case "trash":
        return { title: "Trash is empty", description: "Files you delete stay here for 30 days, so you can restore them.", action: back };
      default:
        return {
          title: "This folder is empty",
          description: "Upload files here, create a folder, or drag items onto it from another folder.",
          action: (
            <>
              <Button size="sm" onClick={() => setNameTarget({ mode: "create" })}>
                New folder
              </Button>
              <Button size="sm" variant="accent" onClick={() => setUploadOpen(true)}>
                Upload files
              </Button>
            </>
          ),
        };
    }
  })();

  const metaLine = (item: FileItem) =>
    item.kind === "folder" ? plural(children(item.id).length, "item") : `${bytes(item.size ?? 0)} · ${relative(item.modified, today)}`;

  return (
    <div className="grid min-w-0 grid-cols-1 gap-6">
      <PageHeader
        title="Files"
        description={`${plural(liveFiles.length, "file")} in ${plural(live.length - liveFiles.length, "folder")} · ${bytes(used)} of ${bytes(quota)} used`}
      />

      <div className="-mx-1 overflow-x-auto px-1 pb-1 [scrollbar-width:none] max-sm:pr-8 max-sm:[mask-image:linear-gradient(to_right,#000_calc(100%-2.5rem),transparent)] lg:hidden">
        <SegmentedControl
          aria-label="Sections"
          value={section}
          onValueChange={(s) => go(s)}
          options={sections.map((s) => ({
            value: s.id,
            label: (
              <span className="flex items-center gap-1.5 whitespace-nowrap">
                {s.label}
                <span className="text-xs text-muted tabular-nums">{counts[s.id]}</span>
              </span>
            ),
          }))}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_16rem]">
        <div className="grid min-w-0 content-start gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <Breadcrumb
              items={crumbs}
              onSelect={onCrumb}
              itemProps={(i) => {
                if (section !== "all" || searching || i === crumbs.length - 1) return {};
                const target = i === 0 ? null : trail[i - 1]!.id;
                return { ...dropProps(target, `crumb-${i}`), className: "px-1 -mx-1 data-[drop=true]:bg-surface-selected data-[drop=true]:text-fg data-[drop=true]:outline-2 data-[drop=true]:outline-accent" };
              }}
              className="mr-auto min-w-0"
            />
            {inTrash ? (
              <ConfirmDialog
                title="Empty Trash?"
                description={`${plural(trashed.length, "item")} ${trashed.length === 1 ? "is" : "are"} deleted for good and ${bytes(trashSize)} is freed. This can't be undone.`}
                confirmLabel="Empty Trash"
                onConfirm={() => deleteForever(trashed.map((f) => f.id), true)}
                trigger={
                  <Button variant="danger" size="sm" disabled={!trashed.length}>
                    Empty Trash
                  </Button>
                }
              />
            ) : (
              <>
                {section === "all" && !searching && (
                  <Button size="sm" onClick={() => setNameTarget({ mode: "create" })}>
                    <Icon d={icons.folderPlus} />
                    New folder
                  </Button>
                )}
                <Button variant="accent" size="sm" onClick={() => setUploadOpen(true)}>
                  <Icon d={icons.upload} />
                  Upload files
                </Button>
              </>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <SearchInput
              value={query}
              onValueChange={setQuery}
              label="Search files"
              placeholder={section === "all" ? "Search all files…" : `Search ${sectionLabel.toLowerCase()}…`}
              className="min-w-48 flex-1"
            />
            <MultiSelect label="Type" options={kindCounts} value={kinds} onValueChange={(v) => setKinds(v as FileKind[])} />
            <div className="w-40">
              <Select value={sort} onValueChange={(v) => setSort(v as Sort)}>
                <SelectTrigger aria-label="Sort by">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="modified">{inTrash ? "Deleted" : "Last modified"}</SelectItem>
                  <SelectItem value="size">Size</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {!inTrash && (
              <SegmentedControl
                aria-label="Layout"
                options={[
                  { value: "grid", label: "Grid" },
                  { value: "list", label: "List" },
                ]}
                value={view}
                onValueChange={(v) => setView(v as "grid" | "list")}
              />
            )}
          </div>

          <div
            ref={areaRef}
            role="region"
            aria-label={`${sectionLabel}${section === "all" && trail.length && !searching ? `: ${hereName}` : ""}`}
            aria-keyshortcuts="Control+A Delete F2 Escape Enter"
            onKeyDown={onAreaKeyDown}
            className="grid min-w-0 gap-3"
          >
            {visible.length === 0 ? (
              <EmptyState className="surface rounded-card" title={empty.title} description={empty.description} action={empty.action} />
            ) : inTrash || view === "list" ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10 pr-0">
                      <Checkbox
                        aria-label={allPicked ? "Clear selection" : "Select all"}
                        checked={allPicked ? true : picked.length ? "indeterminate" : false}
                        onCheckedChange={() => setSelected(allPicked ? [] : visible.map((f) => f.id))}
                      />
                    </TableHead>
                    <TableHead>Name</TableHead>
                    {inTrash ? (
                      <TableHead className="hidden sm:table-cell">Deleted</TableHead>
                    ) : (
                      <>
                        <TableHead className="hidden lg:table-cell">Owner</TableHead>
                        <TableHead className="hidden sm:table-cell">Modified</TableHead>
                      </>
                    )}
                    <TableHead className="hidden text-right md:table-cell">Size</TableHead>
                    <TableHead className="w-12">
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visible.map((item) => {
                    const on = picked.includes(item.id);
                    const folderDrop = item.kind === "folder" && !inTrash ? dropProps(item.id, item.id) : {};
                    return (
                      <TableRow
                        key={item.id}
                        data-item-id={item.id}
                        data-selected={on}
                        draggable={!inTrash}
                        onDragStart={inTrash ? undefined : (e) => dragStart(e, item)}
                        onDragEnd={dragEnd}
                        {...folderDrop}
                        className="data-[drop=true]:bg-surface-selected data-[drop=true]:outline-2 data-[drop=true]:-outline-offset-2 data-[drop=true]:outline-accent"
                      >
                        <TableCell className="w-10 pr-0">
                          <Checkbox aria-label={`Select “${item.name}”`} checked={on} onCheckedChange={(v) => toggle(item.id, v === true)} />
                        </TableCell>
                        <TableCell className="max-w-0 min-w-40">
                          <span className="flex min-w-0 items-center gap-3">
                            <KindIcon kind={item.kind} className={cn("size-8", inTrash && "opacity-70")} />
                            <span className="min-w-0">
                              {inTrash ? (
                                <span className="block truncate font-medium">{item.name}</span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => openItem(item)}
                                  className="block max-w-full cursor-pointer truncate rounded-sm text-left font-medium hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                                >
                                  {item.name}
                                </button>
                              )}
                              <span className="flex items-center gap-1.5 text-xs text-muted">
                                {item.starred && <Icon d={icons.star} filled className="size-3 text-warning" />}
                                {item.starred && <span className="sr-only">Starred.</span>}
                                {item.shared && <Icon d={icons.shared} className="size-3" />}
                                {item.shared && <span className="sr-only">Shared.</span>}
                                <span className="truncate sm:hidden">{inTrash ? `Deleted ${relative(item.trashedAt!, today).toLowerCase()}` : metaLine(item)}</span>
                                {searching && section === "all" && <span className="hidden truncate sm:inline">{pathOf(item)}</span>}
                              </span>
                            </span>
                          </span>
                        </TableCell>
                        {inTrash ? (
                          <TableCell className="hidden whitespace-nowrap text-muted sm:table-cell">{relative(item.trashedAt!, today)}</TableCell>
                        ) : (
                          <>
                            <TableCell className="hidden whitespace-nowrap text-muted lg:table-cell">{item.owner}</TableCell>
                            <TableCell className="hidden whitespace-nowrap text-muted sm:table-cell">{relative(item.modified, today)}</TableCell>
                          </>
                        )}
                        <TableCell className="hidden text-right whitespace-nowrap text-muted tabular-nums md:table-cell">{bytes(sizeOf(item))}</TableCell>
                        <TableCell className="w-12 pl-0 text-right">
                          <RowActions actions={actionsFor(item)} label={`Actions for “${item.name}”`} />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
                {visible.map((item) => {
                  const on = picked.includes(item.id);
                  const file = item.kind !== "folder";
                  const folderDrop = file ? {} : dropProps(item.id, item.id);
                  return (
                    <li key={item.id} data-item-id={item.id}>
                      <div
                        draggable
                        onDragStart={(e) => dragStart(e, item)}
                        onDragEnd={dragEnd}
                        {...folderDrop}
                        className={cn(
                          "surface lift group/card relative grid h-full gap-3 rounded-card p-3",
                          on && "outline-2 outline-offset-2 outline-accent",
                          "data-[drop=true]:bg-surface-selected data-[drop=true]:outline-2 data-[drop=true]:outline-offset-2 data-[drop=true]:outline-accent data-[drop=true]:outline-dashed",
                        )}
                      >
                        <div className="relative">
                          <Cover item={item} />
                          {/* The overlays sit on artwork, so they carry their own raised surface; the
                              absolute wrapper keeps positioning off the surface (glass makes it relative). */}
                          <span
                            className={cn(
                              "absolute top-1.5 left-1.5 z-10 transition-opacity",
                              !on && !picked.length && "opacity-0 group-hover/card:opacity-100 has-focus-visible:opacity-100 pointer-coarse:opacity-100",
                            )}
                          >
                            <span className="surface-raised grid rounded-[calc(var(--r-field)*0.4+0.375rem)] p-1.5">
                              <Checkbox aria-label={`Select “${item.name}”`} checked={on} onCheckedChange={(v) => toggle(item.id, v === true)} />
                            </span>
                          </span>
                          {file && (
                            <span className="absolute top-1.5 right-1.5 z-10">
                              <button
                                type="button"
                                aria-pressed={!!item.starred}
                                aria-label={item.starred ? `Remove “${item.name}” from Starred` : `Star “${item.name}”`}
                                title={item.starred ? "Remove from Starred" : "Add to Starred"}
                                onClick={() => toggleStar([item.id])}
                                className={cn(
                                  "surface-raised grid size-8 cursor-pointer place-items-center rounded-full text-muted transition-[opacity,color,scale] duration-200 ease-theme",
                                  "hover:text-fg active:scale-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                                  item.starred ? "text-warning hover:text-warning" : "opacity-0 group-hover/card:opacity-100 focus-visible:opacity-100 pointer-coarse:opacity-100",
                                )}
                              >
                                <Icon d={icons.star} filled={item.starred} />
                              </button>
                            </span>
                          )}
                        </div>
                        <div className="flex min-w-0 items-start gap-1">
                          <button
                            type="button"
                            onClick={() => openItem(item)}
                            className={cn(
                              "min-w-0 flex-1 cursor-pointer text-left outline-none",
                              "after:absolute after:inset-0 after:rounded-card focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-accent",
                            )}
                          >
                            <span className="block truncate text-sm font-medium">{item.name}</span>
                            <span className="flex items-center gap-1.5 text-xs text-muted">
                              {item.shared && <Icon d={icons.shared} className="size-3" />}
                              {item.shared && <span className="sr-only">Shared.</span>}
                              <span className="truncate">{metaLine(item)}</span>
                            </span>
                            {searching && section === "all" && <span className="block truncate text-xs text-muted">{pathOf(item)}</span>}
                          </button>
                          <span className="relative z-10 -mr-1 -mt-0.5">
                            <RowActions actions={actionsFor(item)} label={`Actions for “${item.name}”`} />
                          </span>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
            {visible.length > 0 && (
              <p className="hidden flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted lg:flex">
                <span className="flex items-center gap-1.5">
                  <KbdGroup keys={["Ctrl", "A"]} /> select all
                </span>
                <span className="flex items-center gap-1.5">
                  <KbdGroup keys={["Del"]} /> {inTrash ? "delete forever" : "move to Trash"}
                </span>
                {!inTrash && (
                  <span className="flex items-center gap-1.5">
                    <KbdGroup keys={["F2"]} /> rename
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <KbdGroup keys={["Esc"]} /> clear selection
                </span>
                {!inTrash && <span>Drag items onto a folder or a breadcrumb to move them.</span>}
              </p>
            )}
          </div>
          <p role="status" aria-live="polite" className="sr-only">
            {announcement}
          </p>
        </div>

        <aside aria-label="Files navigation and storage" className="surface grid content-start self-start gap-4 rounded-card p-4">
          <nav aria-label="Sections" className="hidden lg:block">
            <ul className="grid gap-0.5">
              {sections.map((s) => {
                const current = section === s.id;
                const drop = s.id === "all" && !(section === "all" && folder === null && !searching) ? dropProps(null, "nav-all") : {};
                return (
                  <li key={s.id}>
                    <button
                      type="button"
                      aria-current={current ? "page" : undefined}
                      onClick={() => go(s.id)}
                      {...drop}
                      className={cn(
                        "flex w-full cursor-pointer items-center gap-3 rounded-field px-3 py-2 text-left text-sm transition-colors",
                        "hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                        "data-[drop=true]:bg-surface-selected data-[drop=true]:outline-2 data-[drop=true]:outline-accent",
                        current ? "bg-surface-selected font-medium text-fg" : "text-fg/80",
                      )}
                    >
                      <Icon d={s.icon} className={current ? "text-accent" : "text-muted"} />
                      <span className="flex-1">{s.label}</span>
                      <span className="text-xs text-muted tabular-nums">{counts[s.id]}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
          <span aria-hidden className="hidden h-px bg-line lg:block" />
          <div className="grid gap-2">
            <h3 className="text-sm font-medium text-muted">Storage</h3>
            <p className="text-sm">
              <span className="text-3xl font-semibold tracking-tight tabular-nums">{bytes(used)}</span>
              <span className="text-muted"> of {bytes(quota)}</span>
            </p>
            <Progress value={used} max={quota} aria-label="Storage used" />
          </div>
          <div className="flex h-2 overflow-hidden rounded-full bg-fg/8" aria-hidden>
            {byKind.map((k) => (
              <span key={k.kind} className={barTone[k.kind]} style={{ width: `${(k.size / Math.max(used, 1)) * 100}%` }} />
            ))}
          </div>
          <ul className="grid gap-2 text-sm">
            {byKind.map((k) => (
              <li key={k.kind} className="flex items-center gap-2">
                <span className={cn("size-2 rounded-full", barTone[k.kind])} aria-hidden />
                <span className="flex-1">{kindMeta[k.kind].plural}</span>
                <span className="text-muted tabular-nums">{bytes(k.size)}</span>
              </li>
            ))}
            <li className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-fg/25" aria-hidden />
              <span className="flex-1">In Trash</span>
              <span className="text-muted tabular-nums">{bytes(trashSize)}</span>
            </li>
          </ul>
          <p className="text-xs text-muted">Items in Trash count toward storage and are deleted for good after 30 days.</p>
        </aside>
      </div>

      {inTrash ? (
        <SelectionBar count={picked.length} noun={["item", "items"]} onClear={() => setSelected([])}>
          <Button size="sm" onClick={() => restore(picked)}>
            <Icon d={icons.restore} />
            Restore
          </Button>
          <Button size="sm" variant="danger" onClick={() => setConfirm({ kind: "delete", ids: picked })}>
            Delete forever
          </Button>
        </SelectionBar>
      ) : (
        <SelectionBar count={picked.length} noun={["item", "items"]} onClear={() => setSelected([])}>
          {pickedItems.some((f) => f.kind !== "folder") && (
            <Button size="sm" variant="ghost" onClick={() => toggleStar(picked)}>
              <Icon d={icons.star} filled={pickedItems.filter((f) => f.kind !== "folder").every((f) => f.starred)} />
              {pickedItems.filter((f) => f.kind !== "folder").every((f) => f.starred) ? "Unstar" : "Star"}
            </Button>
          )}
          <Button size="sm" variant="ghost" onClick={() => setMoveIds(picked)}>
            <Icon d={icons.move} />
            Move
          </Button>
          <Button size="sm" variant="danger" onClick={() => requestTrash(picked)}>
            <Icon d={icons.trash} />
            Move to Trash
          </Button>
        </SelectionBar>
      )}

      <NameDialog
        open={nameTarget !== null}
        onOpenChange={(open) => !open && setNameTarget(null)}
        title={nameTarget?.mode === "create" ? "New folder" : `Rename ${nameItem?.kind === "folder" ? "folder" : "file"}`}
        description={nameTarget?.mode === "create" ? `Creates a folder in ${hereName}.` : `In ${nameItem ? pathOf(nameItem) : rootName}.`}
        label={nameTarget?.mode === "create" ? "Folder name" : "Name"}
        initialValue={nameTarget?.mode === "create" ? "Untitled folder" : nameItem?.name}
        selectStem={nameItem !== undefined && nameItem.kind !== "folder"}
        noun={nameTarget?.mode === "create" || nameItem?.kind === "folder" ? "folder" : "file"}
        takenNames={takenNames}
        submitLabel={nameTarget?.mode === "create" ? "Create folder" : `Rename ${nameItem?.kind === "folder" ? "folder" : "file"}`}
        icon={nameTarget?.mode === "create" ? <Icon d={icons.folderPlus} /> : undefined}
        onSubmit={submitName}
      />

      <FolderPickerDialog
        open={moveIds !== null}
        onOpenChange={(open) => !open && setMoveIds(null)}
        folders={live.filter((f) => f.kind === "folder")}
        rootLabel={rootName}
        exclude={moveIds ?? []}
        currentFolder={moveIds && new Set(moveIds.map((id) => byId.get(id)?.parent)).size === 1 ? (byId.get(moveIds[0]!)?.parent ?? null) : undefined}
        title={moveIds ? `Move ${label(moveIds)}` : "Move"}
        onSelect={(target) => moveIds && move(moveIds, target)}
      />

      <ConfirmDialog
        open={confirm !== null}
        onOpenChange={(open) => !open && setConfirm(null)}
        title={
          confirm?.kind === "delete"
            ? `Delete ${confirm.ids.length === 1 ? `“${confirmItems[0]?.name}”` : plural(confirm.ids.length, "item")} for good?`
            : `Move ${confirm && confirm.ids.length === 1 ? `“${confirmItems[0]?.name}”` : plural(confirm?.ids.length ?? 0, "item")} to Trash?`
        }
        description={
          confirm?.kind === "delete"
            ? "They can't be restored after this, and links to them stop working."
            : insideCount
              ? `Everything inside goes with it: ${plural(insideCount, "item")}. You can restore it from Trash for 30 days.`
              : "You can restore it from Trash for 30 days. Shared links stop working right away."
        }
        confirmLabel={confirm?.kind === "delete" ? "Delete forever" : "Move to Trash"}
        onConfirm={() => {
          if (!confirm) return;
          if (confirm.kind === "delete") deleteForever(confirm.ids);
          else trash(confirm.ids);
        }}
      />

      <Sheet
        open={uploadOpen}
        onOpenChange={(open) => {
          setUploadOpen(open);
          // The drop area unmounts with the sheet, so the next upload starts from zero.
          if (!open) setUploadedCount(0);
        }}
      >
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Upload files</SheetTitle>
            <SheetDescription>To {hereName}. Up to 200 MB per file.</SheetDescription>
          </SheetHeader>
          <FileUpload
            key={here ?? "root"}
            maxSize={200 * 1024 * 1024}
            hint="PNG, PDF, CSV, DOCX, MP4 or ZIP"
            upload={uploadFile}
            onItemsChange={(items) => setUploadedCount(items.filter((it) => it.status === "done").length)}
          />
          <SheetFooter className="flex-row items-center">
            {uploadedCount > 0 && (
              <p className="mr-auto text-sm text-muted">
                {plural(uploadedCount, "file")} saved to {hereName}
              </p>
            )}
            <Button
              size="sm"
              variant={uploadedCount > 0 ? "accent" : "ghost"}
              onClick={() => {
                setUploadOpen(false);
                setUploadedCount(0);
              }}
            >
              {uploadedCount > 0 ? "Done" : "Close"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <Sheet open={preview !== null} onOpenChange={(o) => !o && setPreviewId(null)}>
        <SheetContent>
          {preview && (
            <>
              <SheetHeader>
                <SheetTitle className="break-words">{preview.name}</SheetTitle>
                <SheetDescription>
                  {kindMeta[preview.kind].label} · {bytes(preview.size ?? 0)} · {relative(preview.modified, today)}
                </SheetDescription>
              </SheetHeader>
              <Preview item={preview} />
              <dl className="mt-5 grid grid-cols-[6.5rem_minmax(0,1fr)] gap-x-3 gap-y-2.5 text-sm">
                <dt className="text-muted">Type</dt>
                <dd>
                  {kindMeta[preview.kind].label} <span className="text-muted">· {extensionOf(preview.name)}</span>
                </dd>
                <dt className="text-muted">Size</dt>
                <dd className="tabular-nums">
                  {bytes(preview.size ?? 0)}
                  {preview.duration ? <span className="text-muted"> · {duration(preview.duration)} long</span> : null}
                </dd>
                <dt className="text-muted">Location</dt>
                <dd className="min-w-0">
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewId(null);
                      openFolder(preview.parent);
                    }}
                    className="max-w-full cursor-pointer truncate rounded-sm text-left text-accent hover:underline focus-visible:outline-2 focus-visible:outline-accent"
                    title={`Open ${pathOf(preview)}`}
                  >
                    {pathOf(preview)}
                  </button>
                </dd>
                <dt className="text-muted">Owner</dt>
                <dd>{preview.owner}</dd>
                <dt className="text-muted">Created</dt>
                <dd>{fullDate(preview.created ?? preview.modified, today)}</dd>
                <dt className="text-muted">Modified</dt>
                <dd>{fullDate(preview.modified, today)}</dd>
                <dt className="text-muted">Sharing</dt>
                <dd>{preview.shared ? <Badge variant="success">Anyone with the link</Badge> : <Badge variant="outline">Workspace only</Badge>}</dd>
              </dl>
              <label className="surface mt-4 flex cursor-pointer items-center gap-3 rounded-field px-4 py-3 text-sm">
                <span className="min-w-0 flex-1">
                  <span className="block font-medium">Link sharing</span>
                  <span className="block text-xs text-muted">{preview.shared ? "Turn off to stop old links working." : "Let anyone with the link view this file."}</span>
                </span>
                <Switch checked={!!preview.shared} onCheckedChange={() => toggleShare(preview)} aria-label="Link sharing" />
              </label>
              <SheetFooter className="flex-row flex-nowrap items-center">
                <RowActions actions={actionsFor(preview, { inSheet: true })} label="More actions" align="start" />
                <Button size="sm" className="flex-1" onClick={() => copyLink(preview)}>
                  Copy link
                </Button>
                <Button size="sm" variant="accent" className="flex-1" onClick={() => toast.success(`Downloading “${preview.name}”…`)}>
                  <Icon d={icons.download} />
                  Download
                </Button>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

/** Stable small number from an id, to vary generated artwork. */
const seed = (id: string) => [...id].reduce((n, c) => (n * 31 + c.charCodeAt(0)) >>> 0, 7);
const artTones = ["var(--color-accent)", "var(--color-info)", "var(--color-success)", "var(--color-warning)"];

/** A drawn landscape standing in for an image: theme tones only, no media. */
function ImageArt({ id, className }: { id: string; className?: string }) {
  const s = seed(id);
  const tone = artTones[s % artTones.length]!;
  const alt = artTones[(s + 1) % artTones.length]!;
  const sunX = 30 + (s % 50);
  return (
    <svg viewBox="0 0 160 100" preserveAspectRatio="xMidYMid slice" className={cn("block", className)} aria-hidden>
      <defs>
        <linearGradient id={`sky-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={tone} stopOpacity="0.38" />
          <stop offset="1" stopColor={alt} stopOpacity="0.14" />
        </linearGradient>
      </defs>
      <rect width="160" height="100" fill="var(--color-bg-deep)" />
      <rect width="160" height="100" fill={`url(#sky-${id})`} />
      <circle cx={sunX} cy="30" r="11" fill={alt} fillOpacity="0.7" />
      <path d={`M0 78 L${40 + (s % 20)} 44 L80 70 L${108 + (s % 14)} 38 L160 72 V100 H0Z`} fill={tone} fillOpacity="0.55" />
      <path d="M0 88 L52 66 L96 84 L136 64 L160 76 V100 H0Z" fill={tone} fillOpacity="0.85" />
    </svg>
  );
}

function Cover({ item }: { item: FileItem }) {
  if (item.kind === "image")
    return (
      <span className="block aspect-[4/3] w-full overflow-hidden rounded-field" aria-hidden>
        <ImageArt id={item.id} className="size-full" />
      </span>
    );
  return (
    <span className="relative block" aria-hidden>
      <KindIcon kind={item.kind} className="aspect-[4/3] w-full" />
      {item.kind === "video" && item.duration ? (
        <span className="absolute right-2 bottom-2 rounded-control bg-fg px-1.5 py-0.5 font-mono text-[11px] text-bg tabular-nums">{duration(item.duration)}</span>
      ) : null}
    </span>
  );
}

/** Generated preview for the details sheet: a picture, a page, a sheet or a video frame. */
function Preview({ item }: { item: FileItem }) {
  const frame = "relative aspect-video w-full overflow-hidden rounded-card border border-line bg-bg-deep";
  let body: ReactNode;
  if (item.kind === "image") body = <ImageArt id={item.id} className="size-full" />;
  else if (item.kind === "pdf" || item.kind === "doc")
    body = (
      <div className="absolute inset-x-[22%] top-4 bottom-0 grid content-start gap-2 rounded-t-[max(0.25rem,calc(var(--r-field)-0.25rem))] bg-bg p-4 shadow-lg">
        <span className={cn("h-2.5 w-2/3 rounded-full", item.kind === "pdf" ? "bg-danger/50" : "bg-info/50")} />
        {[92, 84, 96, 70, 88, 60].map((w, i) => (
          <span key={i} className="h-1.5 rounded-full bg-fg/12" style={{ width: `${w}%` }} />
        ))}
        <span className="mt-1 h-10 rounded-sm bg-fg/6" />
        <span className="absolute top-3 right-3 rounded-sm bg-fg/8 px-1.5 py-0.5 font-mono text-[10px] text-muted">{extensionOf(item.name)}</span>
      </div>
    );
  else if (item.kind === "sheet")
    body = (
      <div className="absolute inset-4 grid grid-cols-5 grid-rows-6 overflow-hidden rounded-[max(0.25rem,calc(var(--r-card)-1rem))] border border-line bg-bg">
        {Array.from({ length: 30 }, (_, i) => (
          <span key={i} className={cn("border-r border-b border-line", i < 5 && "bg-success/15", i % 5 === 0 && i >= 5 && "bg-fg/5")} />
        ))}
      </div>
    );
  else if (item.kind === "video")
    body = (
      <>
        <ImageArt id={item.id} className="size-full opacity-60" />
        <span className="absolute inset-0 grid place-items-center">
          <span className="grid size-14 place-items-center rounded-full bg-fg text-bg shadow-lg">
            <svg viewBox="0 0 24 24" className="ml-0.5 size-6" fill="currentColor" aria-hidden>
              <path d="M8 5.5v13l11-6.5z" />
            </svg>
          </span>
        </span>
        {item.duration ? (
          <span className="absolute right-3 bottom-3 rounded-control bg-fg px-2 py-0.5 font-mono text-xs text-bg tabular-nums">{duration(item.duration)}</span>
        ) : null}
      </>
    );
  else body = <KindIcon kind={item.kind} className="size-full rounded-none" />;
  return (
    <figure className={frame}>
      {body}
      <figcaption className="sr-only">
        Preview of {item.name}
        {item.duration ? `, ${duration(item.duration)} long` : ""}
      </figcaption>
    </figure>
  );
}

function kindFromName(name: string): FileKind {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  if (["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(ext)) return "image";
  if (ext === "pdf") return "pdf";
  if (["csv", "xlsx", "xls", "numbers"].includes(ext)) return "sheet";
  if (["mp4", "mov", "webm"].includes(ext)) return "video";
  if (["zip", "gz", "tar", "rar"].includes(ext)) return "archive";
  return "doc";
}
