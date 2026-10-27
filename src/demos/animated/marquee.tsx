import { Marquee } from "@/registry/kit/ui/marquee";

const stack = ["React", "TypeScript", "Tailwind CSS", "Motion", "Next.js", "Vite", "shadcn"];

export default function MarqueeDemo() {
  return (
    <div className="grid w-full gap-6">
      <Marquee duration={36}>
        {stack.map((name) => (
          <span key={name} className="flex items-center gap-12 font-display text-4xl tracking-[-0.02em] whitespace-nowrap">
            {name}
            <span aria-hidden className="text-base text-accent">
              ✦
            </span>
          </span>
        ))}
      </Marquee>
      <Marquee duration={28} reverse gap="1rem">
        {stack.map((name) => (
          <span key={name} className="surface rounded-control px-5 py-2 text-sm whitespace-nowrap text-fg/85">
            {name}
          </span>
        ))}
      </Marquee>
    </div>
  );
}
