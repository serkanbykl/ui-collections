import { Accordion } from "@/registry/kit/ui/accordion";

const faq = [
  {
    q: "Is it free?",
    a: "Yes. Everything is MIT licensed. Copy it, change it, ship it.",
  },
  {
    q: "Do I need Next.js?",
    a: "No. The components are plain React with Tailwind CSS v4, so Vite, Remix or anything else that runs React works.",
  },
  {
    q: "How do I update a component?",
    a: "Run the add command again. The CLI shows a diff and asks before overwriting your file.",
  },
  {
    q: "What about reduced motion?",
    a: "With reduced motion on, reveals fade in place instead of rising; everything else keeps its short, gentle motion.",
  },
];

export default function AccordionDemo() {
  return (
    <Accordion
      className="w-full max-w-2xl"
      defaultOpen={["q0"]}
      items={faq.map((item, i) => ({ id: `q${i}`, title: item.q, content: item.a }))}
    />
  );
}
