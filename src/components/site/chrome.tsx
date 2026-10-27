import { collection } from "next/root-params";

import { SiteLink as Link } from "@/components/site/site-link";
import type { Engine } from "@/catalog";
import { author, getCollection, homeOrigin } from "@/collections";
import { cn } from "@/registry/kit/lib/utils";

export async function Wordmark({ className }: { className?: string }) {
  const c = getCollection(await collection());
  return (
    <Link href="/" aria-label={`${c.name} home`} className={cn("group flex items-baseline leading-none", className)}>
      <span className="font-display text-[1.75rem] tracking-tight">{c.name}</span>
      <span aria-hidden className="ml-0.5 size-1.5 self-end rounded-full bg-accent transition-transform group-hover:scale-125" />
    </Link>
  );
}

async function Year() {
  "use cache";
  return <>{new Date().getFullYear()}</>;
}

export function SiteFooter() {
  return (
    <footer className="mx-auto w-full max-w-7xl px-6 pt-4 pb-10 md:px-8">
      <div className="hairline mb-8" />
      <div className="flex flex-col items-start justify-between gap-4 text-xs text-muted md:flex-row md:items-center">
        <Wordmark />
        <p>
          © <Year />{" "}
          <a href={homeOrigin()} className="text-fg/80 transition-colors hover:text-accent">
            {author.name}
          </a>
          . Open source under MIT.
        </p>
      </div>
    </footer>
  );
}

export function EngineBadge({ engine, className }: { engine: Engine; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-control border px-2.5 py-0.5 text-[11px] tracking-[0.12em] uppercase",
        engine === "CSS" ? "border-accent/30 text-accent" : "border-fg/15 text-fg/70",
        className,
      )}
      title={engine === "CSS" ? "Animated with CSS only" : "Uses the Motion library"}
    >
      <span aria-hidden className={cn("size-1.5 rounded-full", engine === "CSS" ? "bg-accent" : "bg-fg/60")} />
      {engine}
    </span>
  );
}

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("text-xs tracking-[0.2em] text-muted uppercase", className)}>{children}</div>;
}
