"use client";

import { unstable_OneTimePasswordField as OTP } from "radix-ui";
import { Fragment, type ComponentProps } from "react";

import { cn } from "@/registry/kit/lib/utils";

export interface InputOTPProps extends Omit<ComponentProps<typeof OTP.Root>, "children"> {
  /** Number of characters. */
  length?: number;
  /** Insert a divider after every `groupSize` cells. 0 for none. */
  groupSize?: number;
}

/**
 * One-time code entry: one surface cell per character, with paste, autofill
 * and arrow-key support from Radix. The hidden input carries the value for forms.
 */
export function InputOTP({ length = 6, groupSize = 3, className, ...props }: InputOTPProps) {
  return (
    <OTP.Root className={cn("flex items-center gap-1.5 sm:gap-2", className)} {...props}>
      {Array.from({ length }, (_, i) => (
        <Fragment key={i}>
          {groupSize > 0 && i > 0 && i % groupSize === 0 && (
            <span aria-hidden className="mx-1 h-px w-3 bg-fg/25" />
          )}
          {/* Smaller cells below `sm` so six fit inside a dialog on a phone. */}
          <OTP.Input
            className={cn(
              "surface-field size-10 rounded-field text-center font-mono text-lg text-fg caret-accent outline-none sm:size-12 sm:text-xl",
              "transition-[box-shadow,scale] duration-200 ease-theme focus:scale-105",
              "focus:shadow-[inset_0_0_0_1.5px_var(--color-accent),0_0_0_4px_color-mix(in_oklab,var(--color-accent)_15%,transparent)]",
              "disabled:opacity-50",
            )}
          />
        </Fragment>
      ))}
      <OTP.HiddenInput />
    </OTP.Root>
  );
}
