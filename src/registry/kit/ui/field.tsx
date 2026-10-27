"use client";

import { useId, type InputHTMLAttributes, type TextareaHTMLAttributes } from "react";

import { cn } from "@/registry/kit/lib/utils";

/** Heights match the button scale: 28 · 36 · 44 · 56 · 64 px. */
export type FieldSize = "xs" | "sm" | "md" | "lg" | "xl";

interface FieldProps {
  label: string;
  /**
   * `lg` (default) and `xl` float the label inside the field; `xs`–`md` are
   * too short for that, so the label sits above, ready to line up with
   * same-size buttons in toolbars and dense forms.
   */
  size?: FieldSize;
  /** Helper text under the field. Replaced by `error` when set. */
  hint?: string;
  error?: string;
}

const controlClass = cn(
  "peer surface-field block w-full rounded-field text-fg outline-none",
  "transition-[border-color,background-color,box-shadow] duration-300 ease-theme",
  "hover:border-line-strong focus:border-accent/50 focus:bg-field-focus",
  "focus:shadow-[0_0_0_4px_color-mix(in_oklab,var(--color-accent)_12%,transparent)]",
  "aria-invalid:border-danger/60 aria-invalid:focus:shadow-[0_0_0_4px_color-mix(in_oklab,var(--color-danger)_15%,transparent)]",
  "disabled:cursor-not-allowed disabled:opacity-50",
);

const floats = (size: FieldSize) => size === "lg" || size === "xl";

const inputSize: Record<FieldSize, string> = {
  xs: "h-7 px-2.5 text-xs",
  sm: "h-9 px-3 text-[13px]",
  md: "h-11 px-3.5 text-sm",
  lg: "h-14 px-4 pt-6 pb-2 text-[15px]",
  xl: "h-16 px-5 pt-7 pb-2 text-base",
};

const textareaSize: Record<FieldSize, string> = {
  xs: "px-2.5 py-1.5 text-xs",
  sm: "px-3 py-2 text-[13px]",
  md: "px-3.5 py-2.5 text-sm",
  lg: "px-4 pt-7 pb-2 text-[15px]",
  xl: "px-5 pt-8 pb-3 text-base",
};

// Static label above short fields.
const stackedLabel: Record<FieldSize, string> = {
  xs: "mb-1 block px-0.5 text-[11px] font-medium text-muted",
  sm: "mb-1.5 block px-0.5 text-xs font-medium text-muted",
  md: "mb-1.5 block px-0.5 text-[13px] font-medium text-muted",
  lg: "",
  xl: "",
};

// Floats above the value; drops into the field while it is empty and unfocused.
const labelClass = cn(
  "pointer-events-none absolute top-4 left-4 origin-left text-[15px] text-muted",
  "-translate-y-2.5 scale-[0.78] transition-[translate,scale,color] duration-300 ease-theme",
  "peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100",
  "peer-focus:-translate-y-2.5 peer-focus:scale-[0.78] peer-focus:text-accent",
  "peer-aria-invalid:text-danger",
);

function FieldShell({
  id,
  label,
  hint,
  error,
  size = "lg",
  className,
  children,
}: FieldProps & { id: string; className?: string; children: React.ReactNode }) {
  const note = error ?? hint;
  if (!floats(size)) {
    return (
      <div className={className}>
        <label htmlFor={id} className={cn(stackedLabel[size], error && "text-danger")}>
          {label}
        </label>
        {children}
        {note && (
          <p id={`${id}-note`} className={cn("mt-1.5 px-0.5 text-xs", error ? "text-danger" : "text-muted")}>
            {note}
          </p>
        )}
      </div>
    );
  }
  return (
    <div className={cn("relative", className)}>
      {children}
      <label htmlFor={id} className={cn(labelClass, size === "xl" && "top-5 left-5 text-base")}>
        {label}
      </label>
      {note && (
        <p id={`${id}-note`} className={cn("mt-2 px-1 text-xs", error ? "text-danger" : "text-muted")}>
          {note}
        </p>
      )}
    </div>
  );
}

function useFieldProps({ id, hint, error }: { id?: string; hint?: string; error?: string }) {
  const generated = useId();
  const fieldId = id ?? generated;
  return {
    id: fieldId,
    // A blank placeholder lets CSS detect an empty field via :placeholder-shown.
    placeholder: " ",
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error || hint ? `${fieldId}-note` : undefined,
  };
}

export type InputProps = FieldProps & Omit<InputHTMLAttributes<HTMLInputElement>, "placeholder" | "size">;

export function Input({ label, hint, error, id, size = "lg", className, ...props }: InputProps) {
  const field = useFieldProps({ id, hint, error });
  return (
    <FieldShell id={field.id} label={label} hint={hint} error={error} size={size} className={className}>
      <input {...field} className={cn(controlClass, inputSize[size])} {...props} />
    </FieldShell>
  );
}

export type TextareaProps = FieldProps & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "placeholder">;

export function Textarea({ label, hint, error, id, size = "lg", className, rows = 5, ...props }: TextareaProps) {
  const field = useFieldProps({ id, hint, error });
  return (
    <FieldShell id={field.id} label={label} hint={hint} error={error} size={size} className={className}>
      <textarea {...field} rows={rows} className={cn(controlClass, "resize-none", textareaSize[size])} {...props} />
    </FieldShell>
  );
}
