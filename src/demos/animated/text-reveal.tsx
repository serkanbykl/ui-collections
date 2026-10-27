"use client";

import { useState } from "react";

import { Button } from "@/registry/kit/ui/button";
import { Reveal, TextReveal } from "@/registry/kit/ui/reveal";

export default function TextRevealDemo() {
  const [run, setRun] = useState(0);

  return (
    <div key={run} className="flex max-w-2xl flex-col items-center text-center">
      <TextReveal as="h2" className="font-display text-5xl leading-[0.95] tracking-[-0.03em] md:text-6xl">
        Interfaces you can see through.
      </TextReveal>
      <Reveal trigger="load" delay={500} className="mt-6 text-muted">
        Words rise out of a soft blur, one after another.
      </Reveal>
      <Reveal trigger="load" delay={700} className="mt-8">
        <Button size="sm" onClick={() => setRun((n) => n + 1)}>
          Replay animation
        </Button>
      </Reveal>
    </div>
  );
}
