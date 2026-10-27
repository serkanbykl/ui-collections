import { ScrollProgress } from "@/registry/kit/ui/scroll-progress";

const paragraphs = [
  "Release notes are written as the work lands, not the night before. Each entry links to the change that caused it.",
  "Builds now reuse the cache from the last successful deploy on the same branch, which cuts most rebuilds in half.",
  "Preview links stay up for thirty days and inherit the environment variables of their target branch.",
  "The dashboard remembers the last project you opened on each device.",
  "Logs can be filtered by request id, and a click on any line opens the full trace.",
  "Webhooks retry with exponential backoff for up to a day before giving up.",
];

export default function ScrollProgressDemo() {
  return (
    <div className="surface h-80 w-full max-w-lg overflow-hidden rounded-card">
      {/* Scroll on an inner element: the surface shell itself must not scroll. */}
      <div className="h-full overflow-y-auto [scrollbar-width:thin]">
        <ScrollProgress scope="container" />
        <article className="space-y-4 p-7 text-[15px] leading-relaxed text-muted">
          <h3 className="font-display text-3xl tracking-[-0.02em] text-fg">Changelog</h3>
          {paragraphs.concat(paragraphs).map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </article>
      </div>
    </div>
  );
}
