import { BrandMark } from "@/registry/kit/ui/brand-mark";

function LeafGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 19c0-8 5-13 14-14-1 9-6 14-14 14ZM5 19l7-7" />
    </svg>
  );
}

export default function BrandMarkDemo() {
  return (
    <div className="flex flex-wrap items-center gap-8">
      <div className="flex items-end gap-3">
        <BrandMark size="sm" />
        <BrandMark />
        <BrandMark size="lg" />
      </div>
      <span className="flex items-center gap-2.5 font-display text-xl tracking-tight">
        <BrandMark>
          <LeafGlyph />
        </BrandMark>
        fernway
      </span>
    </div>
  );
}
