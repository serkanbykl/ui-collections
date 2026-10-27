"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";

import { cn } from "@/registry/kit/lib/utils";

export interface InlineEditProps {
  value?: string;
  defaultValue?: string;
  /** Called with the trimmed text when an edit is committed. Empty edits are discarded. */
  onSave?: (value: string) => void;
  /** Accessible name, e.g. "Project name". */
  label: string;
  placeholder?: string;
  className?: string;
}

/**
 * Text that turns into a field in place. Click or press Enter to edit;
 * Enter or leaving the field saves, Escape cancels. An accent underline draws
 * in while editing.
 */
export function InlineEdit({ value, defaultValue = "", onSave, label, placeholder = "Untitled", className }: InlineEditProps) {
  const [internal, setInternal] = useState(defaultValue);
  const text = value ?? internal;
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(text);
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef(false);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    } else if (returnFocus.current) {
      returnFocus.current = false;
      triggerRef.current?.focus();
    }
  }, [editing]);

  function begin() {
    setDraft(text);
    setEditing(true);
  }

  function finish(commit: boolean, keepFocus: boolean) {
    const next = draft.trim();
    if (commit && next && next !== text) {
      setInternal(next);
      onSave?.(next);
    }
    returnFocus.current = keepFocus;
    setEditing(false);
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") finish(true, true);
    if (event.key === "Escape") finish(false, true);
  }

  return (
    <span className={cn("group/edit relative inline-grid max-w-full align-baseline", className)}>
      {editing ? (
        <input
          ref={inputRef}
          aria-label={label}
          value={draft}
          placeholder={placeholder}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={() => finish(true, false)}
          size={Math.max(draft.length, placeholder.length, 4)}
          className="col-start-1 row-start-1 min-w-0 bg-transparent text-inherit outline-none placeholder:text-muted/60"
        />
      ) : (
        <button
          ref={triggerRef}
          type="button"
          onClick={begin}
          aria-label={`Edit ${label}: ${text || placeholder}`}
          className="col-start-1 row-start-1 inline-flex cursor-text items-baseline gap-2 text-left outline-none"
        >
          <span className={cn(!text && "text-muted/60")}>{text || placeholder}</span>
          <svg
            viewBox="0 0 24 24"
            aria-hidden
            className="size-[0.6em] shrink-0 self-center text-muted opacity-0 transition-opacity duration-300 group-focus-within/edit:opacity-100 group-hover/edit:opacity-100"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 20h4L19 9l-4-4L4 16v4Z" />
          </svg>
        </button>
      )}
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-x-0 -bottom-1 h-px origin-left bg-fg/25 transition-[scale,background-color] duration-500 ease-theme",
          editing
            ? "scale-x-100 bg-accent"
            : "scale-x-0 group-hover/edit:scale-x-100 group-has-[:focus-visible]/edit:scale-x-100 group-has-[:focus-visible]/edit:bg-accent",
        )}
      />
    </span>
  );
}
