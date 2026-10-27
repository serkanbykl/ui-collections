"use client";

import { useEffect, useRef, type InputHTMLAttributes } from "react";

import { cn } from "@/registry/kit/lib/utils";
import { Button } from "@/registry/kit/ui/button";
import { Kbd } from "@/registry/kit/ui/kbd";

export interface SearchInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "type"> {
  value: string;
  onValueChange: (value: string) => void;
  /** Accessible name; also the placeholder when none is given. */
  label: string;
  /** Focus the field with ⌘K / Ctrl+K and show the hint. */
  shortcut?: boolean;
}

/** Pill search field with a clear button. Escape clears, ⌘K focuses. */
export function SearchInput({
  value,
  onValueChange,
  label,
  shortcut = false,
  placeholder,
  className,
  onKeyDown,
  ...props
}: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!shortcut) return;
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [shortcut]);

  return (
    <div className={cn("group/search relative w-full", className)}>
      <svg
        viewBox="0 0 24 24"
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted transition-colors duration-300 group-focus-within/search:text-accent"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      >
        <circle cx="11" cy="11" r="6.5" />
        <path d="m16 16 4 4" />
      </svg>
      <input
        ref={inputRef}
        type="search"
        aria-label={label}
        placeholder={placeholder ?? label}
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape" && value) {
            e.preventDefault();
            onValueChange("");
          }
          onKeyDown?.(e);
        }}
        className={cn(
          "surface-field h-11 w-full rounded-control pr-12 pl-10 text-sm text-fg outline-none placeholder:text-muted/80",
          "transition-[border-color,background-color,box-shadow] duration-300 ease-theme",
          "hover:border-fg/20 focus:border-accent/50 focus:bg-field-focus",
          "focus:shadow-[0_0_0_4px_color-mix(in_oklab,var(--color-accent)_12%,transparent)]",
          "[&::-webkit-search-cancel-button]:hidden",
        )}
        {...props}
      />
      {value ? (
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Clear search"
          onClick={() => {
            onValueChange("");
            inputRef.current?.focus();
          }}
          className="absolute top-1/2 right-1.5 size-7 -translate-y-1/2 rounded-full text-muted"
        >
          <svg viewBox="0 0 24 24" aria-hidden className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </Button>
      ) : shortcut ? (
        <Kbd className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2">⌘K</Kbd>
      ) : null}
    </div>
  );
}
