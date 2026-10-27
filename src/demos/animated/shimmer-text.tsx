import { ShimmerText } from "@/registry/kit/ui/shimmer-text";

export default function ShimmerTextDemo() {
  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <ShimmerText as="h2" className="font-display text-5xl tracking-[-0.03em] md:text-6xl">
        Building your preview
      </ShimmerText>
      <div className="surface flex items-center gap-3 rounded-control px-5 py-2.5 text-sm">
        <ShimmerText duration={2}>Thinking through 14 files…</ShimmerText>
      </div>
    </div>
  );
}
