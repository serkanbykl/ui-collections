"use client";

import { useEffect, useId, useRef, useState, type DragEvent, type ReactNode } from "react";

import { cn } from "@/registry/kit/lib/utils";
import { Button } from "@/registry/kit/ui/button";
import { Progress } from "@/registry/kit/ui/progress";

export type UploadStatus = "uploading" | "done" | "error";

export interface UploadItem {
  id: string;
  name: string;
  size: number;
  type?: string;
  status: UploadStatus;
  /** 0–100 while uploading. */
  progress: number;
  error?: string;
  /** Kept so a failed upload can be retried. Absent for files that were already uploaded. */
  file?: File;
  /** Object URL for an image thumbnail; revoked when the row goes. */
  previewUrl?: string;
}

export interface FileUploadProps {
  /** Same syntax as the input's `accept`: ".pdf,image/*". */
  accept?: string;
  multiple?: boolean;
  /** Largest file in bytes. */
  maxSize?: number;
  /** Most files the list may hold. */
  maxFiles?: number;
  /** Main line in the drop area. */
  label?: string;
  /** Second line, e.g. the formats and size limit. */
  hint?: string;
  /** Files already uploaded, shown as done. */
  defaultItems?: { name: string; size: number; type?: string }[];
  /**
   * Sends one file. Call `onProgress` with 0–100 as it goes; throw to mark it failed.
   * Without it, uploads are simulated so the states can be seen.
   */
  upload?: (file: File, onProgress: (percent: number) => void) => Promise<void>;
  /** Called whenever the list changes. */
  onItemsChange?: (items: UploadItem[]) => void;
  /** Extra text after a file's size, e.g. "Cover" for the first photo. */
  itemNote?: (item: UploadItem, index: number) => ReactNode;
  /** "compact" is a single row for one attachment inside a form. */
  variant?: "default" | "compact";
  disabled?: boolean;
  /** Error for the whole field, e.g. "Attach your CV". */
  error?: string;
  name?: string;
  className?: string;
}

const formatSize = (bytes: number) =>
  bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;

function matchesAccept(file: File, accept?: string) {
  if (!accept) return true;
  const name = file.name.toLowerCase();
  return accept.split(",").some((raw) => {
    const rule = raw.trim().toLowerCase();
    if (!rule) return false;
    if (rule.startsWith(".")) return name.endsWith(rule);
    if (rule.endsWith("/*")) return file.type.startsWith(rule.slice(0, -1));
    return file.type === rule;
  });
}

function kindOf(type = "", name = "") {
  if (type.startsWith("image/")) return "image";
  if (type.startsWith("video/")) return "video";
  if (type === "application/pdf" || name.endsWith(".pdf")) return "pdf";
  if (/\.(zip|rar|7z|gz)$/i.test(name)) return "archive";
  return "file";
}

const kindPaths: Record<string, string> = {
  image: "M5 4h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Zm-1 12 4.5-4.5 4 4 2.5-2.5L20 18M15 9h.01",
  video: "M4 6h11a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1Zm12 4.5 5-3v9l-5-3",
  pdf: "M7 3h7l5 5v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm7 0v5h5M9 13h6M9 17h4",
  archive: "M7 3h7l5 5v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm4 0v2m0 2v2m0 2v2",
  file: "M7 3h7l5 5v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm7 0v5h5",
};

const kindWords: Record<string, string> = { image: "image", video: "video", pdf: "document", archive: "archive", file: "file" };

/** "JPG image", "PDF document", "CSV file". */
function typeLabel(item: Pick<UploadItem, "name" | "type">) {
  const ext = item.name.includes(".") ? item.name.split(".").pop()!.toUpperCase() : "";
  return `${ext ? `${ext} ` : ""}${kindWords[kindOf(item.type, item.name)]}`;
}

/** Image files show a real thumbnail; everything else shows its kind's icon. */
function Thumb({ item }: { item: UploadItem }) {
  const src = item.previewUrl;
  if (src && item.status !== "error") {
    // eslint-disable-next-line @next/next/no-img-element -- a local object URL, not an optimisable asset
    return <img src={src} alt="" className="size-10 shrink-0 rounded-field object-cover ring-1 ring-line" />;
  }
  return (
    <span
      aria-hidden
      className={cn(
        "grid size-10 shrink-0 place-items-center rounded-field",
        item.status === "error" ? "bg-danger/12 text-danger" : "bg-accent/12 text-accent",
      )}
    >
      {line(kindPaths[kindOf(item.type, item.name)]!, "size-[18px]")}
    </span>
  );
}

const line = (d: string, className = "size-5") => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d={d} />
  </svg>
);

let counter = 0;
const nextId = () => `upload-${++counter}`;

/** Simulated transfer: ticks progress over about a second and a half. */
export function simulateUpload(_file: File, onProgress: (percent: number) => void) {
  return new Promise<void>((resolve) => {
    let percent = 0;
    const tick = setInterval(() => {
      percent = Math.min(100, percent + 12 + Math.round(Math.random() * 14));
      onProgress(percent);
      if (percent >= 100) {
        clearInterval(tick);
        resolve();
      }
    }, 180);
  });
}

/**
 * Drop area with a file picker, type/size/count checks, a per-file progress
 * row, retry for failed uploads and remove. Keyboard users get the picker on
 * Enter or Space; results are announced politely.
 */
export function FileUpload({
  accept,
  multiple = true,
  maxSize,
  maxFiles,
  label = multiple ? "Drop files here or browse" : "Drop a file here or browse",
  hint,
  defaultItems = [],
  upload = simulateUpload,
  onItemsChange,
  itemNote,
  variant = "default",
  disabled = false,
  error,
  name,
  className,
}: FileUploadProps) {
  const [items, setItems] = useState<UploadItem[]>(() =>
    defaultItems.map((d) => ({ ...d, id: nextId(), status: "done", progress: 100 })),
  );
  const [dragging, setDragging] = useState(false);
  const [notice, setNotice] = useState("");
  const [rejections, setRejections] = useState("");
  const depth = useRef(0);
  const input = useRef<HTMLInputElement>(null);
  const live = useRef(true);
  const inputId = useId();
  const hintId = `${inputId}-hint`;
  const errorId = `${inputId}-error`;
  const limit = multiple ? maxFiles : 1;

  useEffect(() => {
    live.current = true;
    return () => {
      live.current = false;
    };
  }, []);

  function change(update: (all: UploadItem[]) => UploadItem[]) {
    setItems(update);
  }

  // Report changes after render, never from inside a state update.
  const reported = useRef(items);
  const onItemsChangeRef = useRef(onItemsChange);
  useEffect(() => {
    onItemsChangeRef.current = onItemsChange;
  });
  useEffect(() => {
    if (reported.current === items) return;
    reported.current = items;
    onItemsChangeRef.current?.(items);
  }, [items]);

  function patch(id: string, fields: Partial<UploadItem>) {
    if (live.current) change((all) => all.map((it) => (it.id === id ? { ...it, ...fields } : it)));
  }

  function send(item: UploadItem) {
    if (!item.file) return;
    upload(item.file, (progress) => patch(item.id, { progress }))
      .then(() => {
        patch(item.id, { status: "done", progress: 100 });
        if (live.current) setNotice(`${item.name} uploaded.`);
      })
      .catch((e: unknown) => {
        const message = e instanceof Error && e.message ? e.message : "Upload failed. Check your connection and retry.";
        patch(item.id, { status: "error", error: message });
        if (live.current) setNotice(`${item.name} didn't upload.`);
      });
  }

  function add(list: FileList | null) {
    if (!list?.length || disabled) return;
    const picked = [...list];
    const rejected: string[] = [];
    const accepted: UploadItem[] = [];
    // A single-file field replaces what it holds.
    const room = limit === undefined ? Infinity : multiple ? limit - items.length : 1;

    for (const file of picked) {
      if (!matchesAccept(file, accept)) rejected.push(`${file.name} isn't a supported type.`);
      else if (maxSize && file.size > maxSize) rejected.push(`${file.name} is over ${formatSize(maxSize)}.`);
      else if (accepted.length >= room) rejected.push(`${file.name} wasn't added: ${limit} file${limit === 1 ? "" : "s"} at most.`);
      else accepted.push({ id: nextId(), name: file.name, size: file.size, type: file.type, status: "uploading", progress: 0, file,
        previewUrl: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined });
    }

    if (accepted.length) {
      change((all) => (multiple ? [...all, ...accepted] : accepted));
      accepted.forEach(send);
    }
    setRejections(rejected.join(" "));
    setNotice(
      [accepted.length ? `Uploading ${accepted.length} file${accepted.length === 1 ? "" : "s"}.` : "", ...rejected].filter(Boolean).join(" "),
    );
  }

  function onDragEnter(e: DragEvent) {
    e.preventDefault();
    if (disabled) return;
    depth.current += 1;
    setDragging(true);
  }
  function onDragLeave() {
    depth.current = Math.max(0, depth.current - 1);
    if (!depth.current) setDragging(false);
  }
  function onDrop(e: DragEvent) {
    e.preventDefault();
    depth.current = 0;
    setDragging(false);
    add(e.dataTransfer.files);
  }

  const full = limit !== undefined && multiple && items.length >= limit;
  const describedBy = [hint ? hintId : "", error || rejections ? errorId : ""].filter(Boolean).join(" ") || undefined;
  const compact = variant === "compact";
  const single = compact && !multiple ? items[0] : undefined;

  return (
    <div className={cn("grid gap-3", className)}>
      <label
        htmlFor={inputId}
        onDragEnter={onDragEnter}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        data-dragging={dragging || undefined}
        className={cn(
          "surface relative cursor-pointer rounded-card border border-dashed border-line-strong transition-[background-color,border-color,scale] duration-200 ease-theme",
          "hover:bg-surface-hover has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-accent",
          "data-dragging:scale-[1.01] data-dragging:border-accent data-dragging:bg-surface-selected",
          compact ? "flex flex-wrap items-center gap-3 px-4 py-3.5" : "grid place-items-center gap-2 px-5 py-9 text-center",
          (error || rejections) && "border-danger",
          (disabled || full) && "pointer-events-none opacity-60",
        )}
      >
        <span
          aria-hidden
          className={cn(
            "grid shrink-0 place-items-center rounded-field bg-accent/12 text-accent transition-transform duration-300 ease-theme",
            compact ? "size-9" : "size-12 rounded-control in-data-dragging:-translate-y-1",
          )}
        >
          {line("M12 16V5m0 0-4 4m4-4 4 4M5 15v2a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2", compact ? "size-[18px]" : "size-6")}
        </span>
        <span className={cn("min-w-0", compact ? "flex-1" : "grid gap-1")}>
          <span className="block truncate text-sm font-medium">
            {single ? single.name : dragging ? "Release to upload" : full ? `${limit} of ${limit} files added` : label}
          </span>
          {(hint || single) && (
            <span id={hintId} className="block text-xs text-muted">
              {single ? `${formatSize(single.size)} · ${single.status === "uploading" ? `${single.progress}%` : single.status === "error" ? "Failed" : "Uploaded"}` : hint}
            </span>
          )}
        </span>
        {compact && <span className="text-xs font-medium text-accent">{single ? "Replace" : "Browse"}</span>}
        <input
          ref={input}
          id={inputId}
          type="file"
          name={name}
          accept={accept}
          multiple={multiple}
          disabled={disabled || full}
          aria-describedby={describedBy}
          aria-invalid={error || rejections ? true : undefined}
          className="sr-only"
          onChange={(e) => {
            add(e.target.files);
            e.target.value = "";
          }}
        />
      </label>

      {(error || rejections) && (
        <p id={errorId} className="px-1 text-xs text-danger">
          {error ?? rejections}
        </p>
      )}

      {!single && items.length > 0 && (
        <ul className="grid gap-2" aria-label="Files">
          {items.map((item, i) => (
            <li key={item.id} className="surface flex min-w-0 animate-pop-in items-center gap-3 rounded-field px-3 py-2.5">
              <Thumb item={item} />
              <div className="grid min-w-0 flex-1 gap-1">
                <div className="flex min-w-0 items-baseline justify-between gap-3">
                  <p className="truncate text-sm">{item.name}</p>
                  {item.status === "uploading" && <span className="shrink-0 text-xs text-muted tabular-nums">{item.progress}%</span>}
                  {item.status === "done" && (
                    <span className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-success">
                      {line("M5 12.5 10 17l9-10", "size-3.5")}
                      Uploaded
                    </span>
                  )}
                </div>
                {item.status === "uploading" ? (
                  <Progress value={item.progress} aria-label={`Uploading ${item.name}`} className="h-1.5" />
                ) : (
                  <p className={cn("truncate text-xs", item.status === "error" ? "text-danger" : "text-muted")}>
                    {item.status === "error" ? item.error : `${typeLabel(item)} · ${formatSize(item.size)}`}
                    {item.status === "done" && itemNote?.(item, i) && <> · {itemNote(item, i)}</>}
                  </p>
                )}
              </div>
              {item.status === "error" && item.file && (
                <Button type="button" size="sm" variant="ghost" onClick={() => {
                  patch(item.id, { status: "uploading", progress: 0, error: undefined });
                  send(item);
                }}>
                  Retry
                </Button>
              )}
              <Button
                type="button"
                size="icon"
                variant="ghost"
                aria-label={`Remove ${item.name}`}
                className="size-8 shrink-0"
                onClick={() => {
                  if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
                  change((all) => all.filter((it) => it.id !== item.id));
                  setNotice(`${item.name} removed.`);
                  input.current?.focus();
                }}
              >
                {line("M6 6l12 12M18 6 6 18", "size-4")}
              </Button>
            </li>
          ))}
        </ul>
      )}

      <p role="status" aria-live="polite" className="sr-only">
        {notice}
      </p>
    </div>
  );
}
