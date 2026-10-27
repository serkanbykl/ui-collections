import { TiltCard } from "@/registry/kit/ui/tilt-card";

export default function TiltCardDemo() {
  return (
    <TiltCard className="w-80 p-7">
      <div className="flex items-center justify-between text-xs tracking-[0.18em] text-muted uppercase">
        <span>Pro plan</span>
        <span>2026</span>
      </div>
      <p className="mt-16 font-display text-4xl tracking-[-0.02em]">Unlimited builds</p>
      <p className="mt-2 text-sm text-muted">Move the pointer across the card.</p>
    </TiltCard>
  );
}
