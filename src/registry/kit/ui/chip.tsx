"use client";

import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";

import { cn } from "@/registry/kit/lib/utils";

export type ChipSize = "sm" | "md";

const base =
  "inline-flex shrink-0 items-center gap-1.5 rounded-control border font-medium whitespace-nowrap transition-[background-color,border-color,color,scale] duration-200 ease-theme select-none";
const sizes: Record<ChipSize, string> = {
  sm: "h-7 px-2.5 text-xs [&_svg]:size-3.5",
  md: "h-9 px-3.5 text-[13px] [&_svg]:size-4",
};
const idle = "surface border-line text-fg/80";
const on = "border-accent/45 bg-accent/12 text-accent";

const check = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="-ml-0.5 animate-pop-in">
    <path d="M5 12.5 10 17l9-10" />
  </svg>
);

export interface ChipProps {
  children: ReactNode;
  /** Leading icon or avatar. */
  icon?: ReactNode;
  /** Makes it a toggle (filter chip): pressed state with a check mark. */
  selected?: boolean;
  onSelectedChange?: (selected: boolean) => void;
  /** Adds a remove button (input chip), e.g. for a tag or a recipient. */
  onRemove?: () => void;
  /** Plain click handler for an action chip. */
  onClick?: () => void;
  /** Small count after the label. */
  count?: number;
  size?: ChipSize;
  disabled?: boolean;
  className?: string;
}

/**
 * One compact token in four roles: a static label, an action (`onClick`), a
 * filter toggle (`selected`) or a removable entry (`onRemove`). Backspace or
 * Delete on a focused removable chip removes it.
 */
export function Chip({ children, icon, selected, onSelectedChange, onRemove, onClick, count, size = "md", disabled, className }: ChipProps) {
  const toggle = selected !== undefined;
  const interactive = toggle || !!onClick;
  const content = (
    <>
      {toggle && selected ? check : icon}
      <span className="truncate">{children}</span>
      {count !== undefined && <span className={cn("tabular-nums", selected ? "text-accent/80" : "text-muted")}>{count}</span>}
    </>
  );

  if (onRemove) {
    return (
      <span
        className={cn(base, sizes[size], idle, "pr-1", disabled && "opacity-50", className)}
        // The whole chip is one stop; Backspace/Delete removes it, like in an email field.
        tabIndex={disabled ? undefined : 0}
        role="group"
        aria-label={typeof children === "string" ? children : undefined}
        onKeyDown={(e) => {
          if (!disabled && (e.key === "Backspace" || e.key === "Delete")) {
            e.preventDefault();
            onRemove();
          }
        }}
      >
        {content}
        <button
          type="button"
          tabIndex={-1}
          disabled={disabled}
          aria-label={`Remove ${typeof children === "string" ? children : "item"}`}
          onClick={onRemove}
          className="grid size-5 cursor-pointer place-items-center rounded-full text-muted transition-colors hover:bg-fg/10 hover:text-fg [&_svg]:size-3!"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" aria-hidden>
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>
      </span>
    );
  }

  if (!interactive) {
    return <span className={cn(base, sizes[size], idle, className)}>{content}</span>;
  }

  return (
    <button
      type="button"
      disabled={disabled}
      aria-pressed={toggle ? selected : undefined}
      onClick={() => (toggle ? onSelectedChange?.(!selected) : onClick?.())}
      className={cn(
        base,
        sizes[size],
        selected ? on : cn(idle, "hover:border-line-strong hover:text-fg"),
        "cursor-pointer active:scale-(--press-scale) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        "disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
    >
      {content}
    </button>
  );
}

export interface ChipGroupOption {
  value: string;
  label: string;
  icon?: ReactNode;
  count?: number;
  disabled?: boolean;
}

interface ChipGroupBase {
  options: ChipGroupOption[];
  /** Names the group for screen readers, e.g. "Filter by status". */
  label: string;
  size?: ChipSize;
  /** Lay chips on one scrollable row instead of wrapping. */
  scroll?: boolean;
  className?: string;
}

export type ChipGroupProps = ChipGroupBase &
  (
    | { multiple?: false; value: string | null; onValueChange: (value: string | null) => void; /** Allow clearing the single choice by pressing it again. */ deselectable?: boolean }
    | { multiple: true; value: string[]; onValueChange: (value: string[]) => void; deselectable?: never }
  );

/** Filter chips as a single- or multi-select group. Arrow keys move between chips. */
export function ChipGroup(props: ChipGroupProps) {
  const { options, label, size = "md", scroll, className } = props;
  const ref = useRef<HTMLDivElement>(null);

  function isOn(value: string) {
    return props.multiple ? props.value.includes(value) : props.value === value;
  }
  function press(value: string) {
    if (props.multiple) {
      props.onValueChange(isOn(value) ? props.value.filter((v) => v !== value) : [...props.value, value]);
    } else {
      props.onValueChange(isOn(value) && props.deselectable ? null : value);
    }
  }
  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) return;
    const chips = [...(ref.current?.querySelectorAll<HTMLButtonElement>("button:not(:disabled)") ?? [])];
    const i = chips.indexOf(document.activeElement as HTMLButtonElement);
    if (i < 0) return;
    e.preventDefault();
    const next = e.key === "Home" ? 0 : e.key === "End" ? chips.length - 1 : (i + (e.key === "ArrowRight" ? 1 : -1) + chips.length) % chips.length;
    chips[next]?.focus();
  }

  return (
    <div
      ref={ref}
      role="group"
      aria-label={label}
      onKeyDown={onKeyDown}
      className={cn(
        "flex gap-2",
        scroll ? "-my-1 overflow-x-auto py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" : "flex-wrap",
        className,
      )}
    >
      {options.map((o) => (
        <Chip key={o.value} size={size} icon={o.icon} count={o.count} disabled={o.disabled} selected={isOn(o.value)} onSelectedChange={() => press(o.value)}>
          {o.label}
        </Chip>
      ))}
    </div>
  );
}

export interface ChipInputProps {
  value: string[];
  onValueChange: (value: string[]) => void;
  label: string;
  placeholder?: string;
  /** Rejects an entry with a message, e.g. a malformed email. Return null to accept. */
  validate?: (entry: string) => string | null;
  max?: number;
  className?: string;
}

/**
 * Field that turns typed entries into removable chips on Enter, comma or
 * paste. Backspace in an empty field removes the last chip.
 */
export function ChipInput({ value, onValueChange, label, placeholder = "Type and press Enter", validate, max, className }: ChipInputProps) {
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const full = max !== undefined && value.length >= max;

  function add(raw: string) {
    const entries = raw.split(/[,\n]/).map((s) => s.trim()).filter(Boolean);
    const next = [...value];
    for (const entry of entries) {
      if (next.some((v) => v.toLowerCase() === entry.toLowerCase())) continue;
      if (max !== undefined && next.length >= max) {
        setError(`${max} at most.`);
        break;
      }
      const problem = validate?.(entry);
      if (problem) {
        setError(problem);
        setDraft(entry);
        onValueChange(next);
        return;
      }
      next.push(entry);
    }
    setError(null);
    setDraft("");
    onValueChange(next);
  }

  return (
    <div className={className}>
      <label className="mb-1.5 block px-0.5 text-[13px] font-medium text-muted" htmlFor={`${label}-chip-input`}>
        {label}
      </label>
      <div
        onClick={() => inputRef.current?.focus()}
        className={cn(
          "surface-field flex min-h-11 cursor-text flex-wrap items-center gap-1.5 rounded-field px-2 py-1.5",
          "transition-[border-color,box-shadow] duration-300 ease-theme focus-within:border-accent/50 focus-within:shadow-[0_0_0_4px_color-mix(in_oklab,var(--color-accent)_12%,transparent)]",
          error && "border-danger/60",
        )}
      >
        {value.map((v) => (
          <Chip
            key={v}
            size="sm"
            onRemove={() => {
              onValueChange(value.filter((x) => x !== v));
              inputRef.current?.focus();
            }}
          >
            {v}
          </Chip>
        ))}
        <input
          ref={inputRef}
          id={`${label}-chip-input`}
          value={draft}
          disabled={full}
          placeholder={full ? "" : value.length ? "" : placeholder}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${label}-chip-error` : undefined}
          onChange={(e) => {
            setDraft(e.target.value);
            if (error) setError(null);
          }}
          onKeyDown={(e) => {
            if ((e.key === "Enter" || e.key === ",") && draft.trim()) {
              e.preventDefault();
              add(draft);
            } else if (e.key === "Backspace" && !draft && value.length) {
              onValueChange(value.slice(0, -1));
            }
          }}
          onBlur={() => draft.trim() && add(draft)}
          onPaste={(e) => {
            const text = e.clipboardData.getData("text");
            if (/[,\n]/.test(text)) {
              e.preventDefault();
              add(draft + text);
            }
          }}
          className="h-7 min-w-24 flex-1 bg-transparent px-1 text-sm text-fg outline-none placeholder:text-subtle"
        />
      </div>
      {error && (
        <p id={`${label}-chip-error`} className="mt-1.5 px-0.5 text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
