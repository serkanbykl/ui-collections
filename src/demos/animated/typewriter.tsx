import { Typewriter } from "@/registry/kit/ui/typewriter";

export default function TypewriterDemo() {
  return (
    <h2 className="text-center font-display text-5xl leading-tight tracking-[-0.03em] md:text-6xl">
      Ship your
      <br />
      <Typewriter words={["landing page", "dashboard", "side project", "next idea"]} className="text-accent" />
    </h2>
  );
}
