"use client";

import { useState } from "react";

import { InputOTP } from "@/registry/kit/ui/input-otp";

export default function InputOTPDemo() {
  const [code, setCode] = useState("");

  return (
    <div className="flex flex-col items-center gap-5 text-center">
      <div>
        <p className="font-display text-3xl tracking-[-0.02em]">Check your email</p>
        <p className="mt-1 text-sm text-muted">Enter the 6-digit code we sent to you.</p>
      </div>
      <InputOTP aria-label="Verification code" name="code" onValueChange={setCode} />
      <p className="h-5 text-xs text-muted" aria-live="polite">
        {code.length === 6 ? "Verifying…" : `${6 - code.length} digits to go`}
      </p>
    </div>
  );
}
