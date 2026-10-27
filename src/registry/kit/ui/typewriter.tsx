"use client";

import { useEffect, useState } from "react";

import { cn } from "@/registry/kit/lib/utils";

const keyframes = `
@keyframes kit-caret { 0%, 45% { opacity: 1 } 55%, 100% { opacity: 0 } }
`;

export interface TypewriterProps {
  /** Phrases to type, delete and cycle through. */
  words: string[];
  /** Milliseconds per typed character. */
  typeSpeed?: number;
  /** Milliseconds per deleted character. */
  deleteSpeed?: number;
  /** Milliseconds a finished word stays up. */
  pause?: number;
  className?: string;
}

/**
 * Types each phrase, holds it, erases it and moves on, with a soft blinking
 * caret. Screen readers get the full list once instead of every keystroke;
 * with reduced motion the words simply swap.
 */
export function Typewriter({ words, typeSpeed = 60, deleteSpeed = 32, pause = 1800, className }: TypewriterProps) {
  const [text, setText] = useState(words[0] ?? "");
  const key = words.join("\u0000");

  useEffect(() => {
    const list = key.split("\u0000");
    if (list.length === 0) return;
    let word = 0;
    let chars = list[0]!.length;
    let deleting = true;
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      const target = list[word]!;
      if (deleting) {
        chars -= 1;
        setText(target.slice(0, chars));
        if (chars <= 0) {
          deleting = false;
          word = (word + 1) % list.length;
        }
        timer = setTimeout(tick, deleteSpeed);
      } else {
        chars += 1;
        setText(target.slice(0, chars));
        if (chars >= target.length) {
          deleting = true;
          timer = setTimeout(tick, pause);
        } else {
          timer = setTimeout(tick, typeSpeed + Math.random() * typeSpeed * 0.6);
        }
      }
    };

    // The first word starts fully typed (it is also the server render).
    timer = setTimeout(tick, pause);
    return () => clearTimeout(timer);
  }, [key, typeSpeed, deleteSpeed, pause]);

  return (
    <span className={cn("inline-flex items-baseline", className)}>
      <style href="kit-caret" precedence="medium">
        {keyframes}
      </style>
      <span className="sr-only">{words.join(", ")}</span>
      <span aria-hidden className="whitespace-pre">
        {text}
      </span>
      <span
        aria-hidden
        className="kit-caret ml-0.5 inline-block h-[0.9em] w-[2px] translate-y-[0.1em] self-center rounded-full bg-accent"
        style={{ animation: "kit-caret 1.1s steps(1) infinite" }}
      />
    </span>
  );
}
