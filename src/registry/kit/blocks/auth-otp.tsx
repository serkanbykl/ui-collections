"use client";

import { useState } from "react";

import { AuthBrand, AuthCenter, AuthIcon, pretend, useResendTimer } from "@/registry/kit/lib/auth-kit";
import { Button, buttonVariants } from "@/registry/kit/ui/button";
import { InputOTP } from "@/registry/kit/ui/input-otp";

export interface AuthOtpProps {
  brand?: string;
  logo?: React.ReactNode;
  homeHref?: string;
  /** Where the code was sent, shown masked by the caller, e.g. "+44 •••• 0192". */
  destination?: string;
  length?: number;
  /** Seconds before a new code can be requested. */
  resendAfter?: number;
  /** Link for people without access to the device. */
  recoveryHref?: string;
  signInHref?: string;
  /** Where "Continue" goes after a successful check when no `onVerify` is wired. */
  continueHref?: string;
  /** Checks the code. Return an error message when it's wrong. */
  onVerify?: (code: string) => string | void | Promise<string | void>;
  onResend?: () => void | Promise<void>;
}

export function AuthOtp({
  brand = "lumen",
  logo,
  homeHref = "/",
  destination = "ada@northwind.dev",
  length = 6,
  resendAfter = 30,
  recoveryHref = "/signin/recovery",
  signInHref = "/signin",
  continueHref = "/",
  onVerify,
  onResend,
}: AuthOtpProps) {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string>();
  const [pending, setPending] = useState(false);
  const [resending, setResending] = useState(false);
  const [resentNote, setResentNote] = useState<string>();
  const [verified, setVerified] = useState(false);
  const { left, restart } = useResendTimer(resendAfter);

  async function verify(value: string) {
    if (value.length < length) return setError(`Enter all ${length} digits.`);
    setPending(true);
    setError(undefined);
    const result = onVerify ? await onVerify(value) : await pretend(800);
    setPending(false);
    if (result) {
      setError(result);
      setCode("");
    } else if (!onVerify) setVerified(true);
  }

  if (verified)
    return (
      <AuthCenter>
        <AuthBrand brand={brand} logo={logo} homeHref={homeHref} />
        <div role="status" className="mt-8">
          <AuthIcon tone="success">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12.5l4.5 4.5L19 7.5" />
            </svg>
          </AuthIcon>
          <h1 className="mt-5 font-display text-4xl">You&apos;re verified</h1>
          <p className="mt-3 text-sm text-muted">This device is trusted for the next 30 days.</p>
          <a href={continueHref} className={buttonVariants({ variant: "solid", size: "lg", className: "mt-8 w-full" })}>
            Continue to workspace
          </a>
        </div>
      </AuthCenter>
    );

  return (
    <AuthCenter wide>
      <AuthBrand brand={brand} logo={logo} homeHref={homeHref} />
      <h1 className="mt-8 font-display text-4xl">Enter the code</h1>
      <p className="mt-2 text-sm text-muted">
        We sent a {length}-digit code to <span className="text-fg">{destination}</span>. It expires in 10 minutes.
      </p>
      <form
        className="mt-8"
        onSubmit={(e) => {
          e.preventDefault();
          if (!pending) verify(String(new FormData(e.currentTarget).get("code") ?? code));
        }}
      >
        <InputOTP
          length={length}
          value={code}
          onValueChange={(value) => {
            setCode(value);
            if (error) setError(undefined);
          }}
          name="code"
          autoSubmit
          disabled={pending}
          aria-label="Verification code"
          aria-invalid={error ? true : undefined}
          aria-describedby="otp-error"
          className="max-sm:gap-1.5 max-sm:[&>input]:size-10"
        />
        <p id="otp-error" role="alert" className="mt-3 min-h-5 text-sm text-danger">
          {error}
        </p>
        <Button type="submit" variant="solid" size="lg" loading={pending} className="mt-3 w-full">
          {pending ? "Checking…" : "Verify code"}
        </Button>
      </form>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-sm text-muted">
        <span aria-live="polite">
          {left > 0 ? (
            <>
              Resend in <span className="text-fg tabular-nums">0:{String(left).padStart(2, "0")}</span>
            </>
          ) : (
            <button
              type="button"
              disabled={resending}
              className="cursor-pointer text-accent underline-offset-4 hover:underline disabled:cursor-wait disabled:opacity-60"
              onClick={async () => {
                setResending(true);
                await (onResend ? onResend() : pretend(600));
                setResending(false);
                setResentNote(`New code sent to ${destination}.`);
                restart();
              }}
            >
              {resending ? "Sending…" : "Send a new code"}
            </button>
          )}
        </span>
        <a href={recoveryHref} className="underline-offset-4 hover:text-fg hover:underline">
          Use a recovery code
        </a>
      </div>
      {resentNote && left > 0 && <p className="mt-2 text-xs text-success">{resentNote}</p>}
      <a href={signInHref} className="mt-8 block text-center text-sm text-muted underline-offset-4 hover:text-fg hover:underline">
        Sign in with a different account
      </a>
    </AuthCenter>
  );
}
