import { ScrollTextReveal } from "@/registry/kit/ui/scroll-text-reveal";

export default function ScrollTextRevealDemo() {
  return (
    <div className="h-[22rem] w-full max-w-3xl overflow-y-auto rounded-card [scrollbar-width:thin]">
      <div className="flex h-[22rem] items-end justify-center pb-6 text-sm text-muted">Scroll inside this box ↓</div>
      <ScrollTextReveal as="h2" className="mx-auto max-w-2xl px-4 text-center font-display text-4xl leading-tight md:text-5xl">
        Ship the change on Tuesday and know by Wednesday whether 4,183 people actually used it.
      </ScrollTextReveal>
      <div className="h-[22rem]" />
    </div>
  );
}
