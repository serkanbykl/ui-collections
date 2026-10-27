import { Marquee } from "@/registry/kit/ui/marquee";

export interface LogoCloudProps {
  title?: string;
  /** Wordmarks rendered as text. Swap in your own SVG logos. */
  names?: string[];
}

const defaultNames = ["Northwind", "Polaris", "Kitebase", "Halcyon", "Orbitly", "Quarry", "Fernhill", "Lattice", "Monolith"];

export function LogoCloud({ title = "Trusted by teams shipping every day", names = defaultNames }: LogoCloudProps) {
  return (
    <section className="bg-bg py-16 text-fg md:py-20">
      <p className="px-6 text-center text-xs tracking-[0.2em] text-muted uppercase">{title}</p>
      <Marquee duration={40} className="mt-10" gap="4rem">
        {names.map((name, i) => (
          <span
            key={name}
            className={
              i % 3 === 0
                ? "font-display text-3xl text-fg/70"
                : i % 3 === 1
                  ? "text-xl font-semibold tracking-tight text-fg/60"
                  : "font-mono text-lg tracking-widest text-fg/55 uppercase"
            }
          >
            {name}
          </span>
        ))}
      </Marquee>
    </section>
  );
}
