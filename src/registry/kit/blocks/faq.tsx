import { cn } from "@/registry/kit/lib/utils";
import { Accordion } from "@/registry/kit/ui/accordion";
import { TextReveal } from "@/registry/kit/ui/reveal";

export interface FaqItem {
  question: string;
  answer: string;
}

const defaultItems: FaqItem[] = [
  { question: "Can I try it before paying?", answer: "Yes. The Hobby plan is free forever, and Pro comes with a 14-day trial. No card needed to start." },
  { question: "What happens when I hit a limit?", answer: "Nothing breaks. We email you at 80% and 100%, and you choose whether to upgrade or pause usage." },
  { question: "Can I bring my own domain?", answer: "Every plan supports custom domains with automatic certificates, renewed for you." },
  { question: "Where is my data stored?", answer: "In the region you pick when you create a project. You can move it later from settings." },
  { question: "Do you offer discounts for nonprofits and students?", answer: "Yes, 40% off Pro for registered nonprofits and free Pro for students. Email us from your school or organisation address." },
  { question: "How do I cancel?", answer: "From the billing page, in two clicks. You keep access until the end of the period." },
];

export function Faq({
  title = "Questions, answered.",
  description = "Can't find what you need? A person replies within one working day.",
  items = defaultItems,
  contact = { label: "Email support", href: "/contact" },
  headingLevel = "h2",
  compact = false,
  structuredData = false,
}: {
  title?: string;
  description?: string;
  items?: FaqItem[];
  /** Link under the description for questions the list doesn't answer. Pass null to hide it. */
  contact?: { label: string; href: string } | null;
  /** Use "h1" when the FAQ is the page itself. */
  headingLevel?: "h1" | "h2";
  /** Tighter spacing and a smaller title, for dense landing pages. */
  compact?: boolean;
  /** Emits FAQPage JSON-LD so search and answer engines can quote the answers. Use on indexed pages only. */
  structuredData?: boolean;
}) {
  const schema = structuredData && {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })),
  };
  return (
    <section className={cn("bg-bg text-fg", compact ? "px-4 py-16 sm:px-6 md:px-8 md:py-24" : "px-6 py-24 md:px-8 md:py-32")}>
      <div
        className={cn(
          "mx-auto grid max-w-6xl md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]",
          compact ? "gap-8 md:gap-16" : "gap-12 md:gap-20",
        )}
      >
        <div>
          <TextReveal
            as={headingLevel}
            trigger="view"
            className={cn("font-display", compact ? "text-3xl leading-[1.08] md:text-5xl" : "text-4xl leading-[1.02] md:text-6xl")}
          >
            {title}
          </TextReveal>
          <p className="mt-5 text-muted">{description}</p>
          {contact && (
            <a href={contact.href} className="mt-4 inline-block text-sm text-accent underline-offset-4 hover:underline">
              {contact.label} →
            </a>
          )}
        </div>
        <Accordion
          defaultOpen={["faq-0"]}
          items={items.map((item, i) => ({ id: `faq-${i}`, title: item.question, content: item.answer }))}
        />
      </div>
      {schema && (
        // Escape "<" so an answer can never close the script tag.
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
      )}
    </section>
  );
}
