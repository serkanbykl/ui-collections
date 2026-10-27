import { AuroraBackdrop } from "@/registry/kit/ui/aurora-backdrop";

export default function AuroraBackdropDemo() {
  return (
    <div className="relative isolate grid aspect-video w-full max-w-2xl place-items-center overflow-hidden rounded-card bg-bg-deep">
      <AuroraBackdrop />
      <div className="surface rounded-card px-8 py-6 text-center">
        <p className="font-display text-4xl tracking-[-0.02em]">Light, without a video.</p>
        <p className="mt-2 text-sm text-muted">Three gradients, three transforms.</p>
      </div>
    </div>
  );
}
