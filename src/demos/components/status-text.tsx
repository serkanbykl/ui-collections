import { StatusText } from "@/registry/kit/ui/status-text";

export default function StatusTextDemo() {
  return (
    <div className="flex max-w-xl flex-col gap-5 text-sm leading-relaxed text-fg">
      <p>
        Deploy of <span className="font-mono text-[13px]">atlas-web</span> finished in 2m 48s.{" "}
        <StatusText tone="success" icon>
          Live on production
        </StatusText>
      </p>
      <p>
        The card ending 4417 was declined.{" "}
        <StatusText tone="danger" icon>
          Payment failed
        </StatusText>{" "}
        — update it before 14 Nov to keep your Growth plan.
      </p>
      <p>
        Your trial ends in <StatusText tone="warning">3 days</StatusText>. Usage is at{" "}
        <StatusText tone="accent">683,412 of 1M</StatusText> events.
      </p>
      <StatusText as="p" tone="info" icon>
        Exports run overnight and land in your inbox by 07:00.
      </StatusText>
      <StatusText as="p" tone="muted" icon>
        Last synced 12 minutes ago
      </StatusText>
    </div>
  );
}
