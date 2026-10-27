"use client";

import { useEffect, useState } from "react";

import { BentoFeatures, type BentoItem } from "@/registry/kit/blocks/bento-features";
import { CtaPanel } from "@/registry/kit/blocks/cta-panel";
import { Faq, type FaqItem } from "@/registry/kit/blocks/faq";
import { HeroProduct, ProductPreview } from "@/registry/kit/blocks/hero-product";
import { InstallSnippet, type InstallSnippetTab, type InstallStep } from "@/registry/kit/blocks/install-snippet";
import { ProofBand, type ProofMetric, type ProofQuote } from "@/registry/kit/blocks/proof-band";
import { VsList, type VsRow } from "@/registry/kit/blocks/vs-list";
import { href } from "@/registry/kit/templates/template-lumen-app";
import { Badge } from "@/registry/kit/ui/badge";
import { BarList } from "@/registry/kit/ui/bar-list";
import { ChartFunnel } from "@/registry/kit/ui/chart-funnel";
import { CopyButton } from "@/registry/kit/ui/copy-button";
import { LiveIndicator } from "@/registry/kit/ui/live-indicator";
import { ScrollTextReveal } from "@/registry/kit/ui/scroll-text-reveal";
import { Switch } from "@/registry/kit/ui/switch";

/*
 * Lumen's home page: product-led hero, a bento of working product moments,
 * install, proof, a statement, the comparison, FAQ and the final CTA.
 * Composed only from registry blocks and components.
 */

// The hero and the final CTA ask for the same thing in the same words (rule 4b).
export const primaryCta = { label: "Start free trial", href: href("/signup") };
export const riskReducer = "Free for 14 days, no card required. Cancel in one click.";

const script = '<script defer src="https://cdn.lumen.example/l.js" data-site="polaris.example"></script>';

/* ------------------------------------------------------- bento visuals */

/** Flip the switch to see the page with the consent pop-up Lumen makes unnecessary. */
function ConsentToggle() {
  const [withBanner, setWithBanner] = useState(false);
  return (
    <div className="grid w-full grid-cols-1 gap-3">
      <div aria-hidden className="surface relative h-28 overflow-hidden rounded-field p-3">
        <div className="h-2 w-1/3 rounded-full bg-fg/15" />
        <div className="mt-3 h-2 w-4/5 rounded-full bg-fg/10" />
        <div className="mt-2 h-2 w-3/5 rounded-full bg-fg/10" />
        <div className="mt-2 h-2 w-2/3 rounded-full bg-fg/10" />
        <div
          className={`surface-raised absolute inset-x-2 bottom-2 rounded-field p-2.5 text-[11px] leading-snug transition-[translate,opacity] duration-500 ease-theme ${withBanner ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
        >
          We use cookies to improve your experience.
          <span className="mt-1.5 flex gap-1.5">
            <span className="rounded-control bg-fg px-2 py-0.5 text-bg">Accept all</span>
            <span className="rounded-control border border-line px-2 py-0.5">Manage</span>
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between gap-3">
        <label htmlFor="lumen-consent" className="text-xs text-muted">
          Show the usual cookie pop-up
        </label>
        <Switch id="lumen-consent" checked={withBanner} onCheckedChange={setWithBanner} />
      </div>
      <p aria-live="polite" className="text-xs">
        {withBanner ? (
          <Badge variant="warning">Consent needed before counting</Badge>
        ) : (
          <Badge variant="success">0 cookies set · nothing to consent to</Badge>
        )}
      </p>
    </div>
  );
}

const liveDrift = [1, -2, 2, 1, -1, -2, 3, -1];

/** Visitors on the site right now; nudges by a visitor or two every few seconds. */
function LiveVisitors() {
  const [now, setNow] = useState(128);
  useEffect(() => {
    let i = 0;
    const id = setInterval(() => setNow((n) => n + liveDrift[i++ % liveDrift.length]!), 3000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="grid w-full grid-cols-1 gap-3">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-3xl font-semibold tracking-tight tabular-nums">{now}</span>
        <LiveIndicator className="text-xs text-muted" label="Online now" />
      </div>
      <BarList
        label="Visitors online now, by country"
        size="sm"
        items={[
          { label: "Germany", value: 41, leading: <span className="font-mono text-[10px] text-muted">DE</span> },
          { label: "Türkiye", value: 29, leading: <span className="font-mono text-[10px] text-muted">TR</span> },
          { label: "United States", value: 23, leading: <span className="font-mono text-[10px] text-muted">US</span> },
        ]}
      />
    </div>
  );
}

const bento: BentoItem[] = [
  {
    title: "Find the step where people give up",
    body: "Build a funnel from any page or event. Orbitly fixed one confusing onboarding screen and lifted trials 18%.",
    size: "lg",
    visual: (
      <ChartFunnel
        label="Trial funnel, last 30 days"
        height={128}
        steps={[
          { label: "Viewed pricing", value: 9412 },
          { label: "Started trial", value: 2318 },
          { label: "Added script", value: 1604 },
          { label: "Upgraded", value: 412 },
        ]}
      />
    ),
  },
  {
    title: "Drop the cookie banner",
    body: "No cookies and no personal data, so most sites can remove the pop-up. Polaris saw 11.4% fewer bounces that week.",
    visual: <ConsentToggle />,
  },
  {
    title: "See who's here right now",
    body: "Realtime visitors, pages and countries, updated every few seconds without a refresh.",
    visual: <LiveVisitors />,
  },
  {
    title: "1.4 kB, loaded after your page",
    body: "One script tag, no tag manager. On a typical site it adds less than 5 ms.",
    visual: (
      <div className="grid w-full grid-cols-1 gap-3">
        <div className="surface-field flex items-center justify-between gap-2 rounded-field px-3 py-2">
          <code className="truncate font-mono text-xs text-fg/85">{script}</code>
          <CopyButton value={script} iconOnly label="Copy script tag" variant="ghost" />
        </div>
        <dl className="grid grid-cols-3 gap-2 text-center text-xs">
          {[
            ["1.4 kB", "Script"],
            ["<5 ms", "Added"],
            ["0", "Cookies"],
          ].map(([value, label]) => (
            <div key={label} className="surface flex flex-col-reverse rounded-field px-2 py-2">
              <dt className="text-muted">{label}</dt>
              <dd className="text-sm font-semibold tabular-nums">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    ),
  },
  {
    title: "Share a live dashboard",
    body: "Send clients or the whole company a read-only link, with an optional password and expiry date.",
    visual: (
      <div className="grid w-full grid-cols-1 gap-3">
        <div className="surface-field flex items-center justify-between gap-2 rounded-field px-3 py-2">
          <span className="truncate font-mono text-xs text-fg/85">lumen.example/share/polaris-q4</span>
          <CopyButton value="https://lumen.example/share/polaris-q4" iconOnly label="Copy share link" variant="ghost" />
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge variant="accent">Password on</Badge>
          <Badge>Expires 30 Nov</Badge>
          <span className="ml-auto text-xs text-muted tabular-nums">Opened 214 times</span>
        </div>
      </div>
    ),
  },
];

/* --------------------------------------------------------------- content */

const steps: InstallStep[] = [
  { title: "Add one script tag", body: "Paste it into your site's head, or install the npm package for your framework." },
  { title: "Bring your history", body: "Connect Google Analytics during signup and we import the last two years, marked so you can tell it apart." },
  { title: "Share what matters", body: "Send a live, read-only link to a client or the whole company. Everyone reads the same numbers." },
];

const snippets: InstallSnippetTab[] = [
  { label: "HTML", file: "index.html", code: `<!-- In <head>, on every page -->\n<script defer\n  src="https://cdn.lumen.example/l.js"\n  data-site="polaris.example"></script>` },
  {
    label: "Next.js",
    file: "app/layout.tsx",
    code: `import Script from "next/script";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
      <Script src="https://cdn.lumen.example/l.js" data-site="polaris.example" />
    </html>
  );
}`,
  },
  {
    label: "npm",
    file: "src/analytics.ts",
    code: `// npm install @lumen/tracker
import { init, track } from "@lumen/tracker";

init({ site: "polaris.example" });
track("Signed up", { plan: "growth" });`,
  },
];

const metrics: ProofMetric[] = [
  { value: "38,214", label: "Sites measured" },
  { value: "2.14B", label: "Events a month" },
  { value: "1.4 kB", label: "Script size" },
  { value: "0", label: "Cookies set" },
];

const quotes: ProofQuote[] = [
  { result: "11.4% fewer bounces", quote: "We dropped our cookie banner and our bounce rate in the same week. The numbers finally match our sales data.", name: "Ada Kowalski", role: "Head of growth, Polaris" },
  { result: "+18% trials", quote: "Funnels showed us one confusing step in onboarding. We fixed it and trials went up.", name: "Jun Lee", role: "Product manager, Orbitly" },
  { result: "23 people read it weekly", quote: "Our whole team reads the dashboard now. It answers the question before you've finished asking it.", name: "Mateo Ruiz", role: "Founder, Kitebase" },
  { result: "2 years imported in 6 minutes", quote: "The Google Analytics import kept our history, so the switch cost us nothing.", name: "Sara Okafor", role: "Marketing lead, Fernhill" },
];

const vs: VsRow[] = [
  { topic: "Consent banner", them: "Required for EU visitors, and many click it away", us: "Not needed: no cookies, no personal data" },
  { topic: "Script weight", them: "45 kB or more, plus a tag manager", us: "1.4 kB, loaded after your page" },
  { topic: "Dashboard", them: "Dozens of reports to dig through", us: "Visitors, sources, pages and goals on one screen" },
  { topic: "Your data", them: "Shared with an ad network", us: "Yours, stored in Frankfurt and Helsinki" },
  { topic: "Price", them: "Free, paid for with your visitors' data", us: "Free up to 10,000 events, then from $19 a month" },
];

const faq: FaqItem[] = [
  { question: "How is Lumen different from Google Analytics?", answer: "Lumen counts visits without cookies or personal data, so you don't need a consent banner, and the dashboard fits on one screen." },
  { question: "Do I really not need a cookie banner?", answer: "For most sites, no: Lumen stores nothing on the visitor's device and never processes personal data. Your legal team can read our DPA on the Privacy page." },
  { question: "Will it slow my site down?", answer: "The script is 1.4 kB and loads after your page. On a typical site it adds less than 5 ms." },
  { question: "Can I import my old data?", answer: "Yes. Connect Google Analytics during signup and we bring in the last two years." },
  { question: "Where is my data stored?", answer: "On servers in Frankfurt and Helsinki, owned by an EU company. Export or delete everything at any time." },
  { question: "What happens when the trial ends?", answer: "You choose a plan or drop to Starter, which stays free up to 10,000 events a month. We never delete your history without asking." },
  { question: "Can my clients see their own numbers?", answer: "Yes. Shared reports give anyone a live, read-only dashboard, with an optional password and expiry date." },
];

/* ------------------------------------------------------------------ page */

export function LumenHome() {
  return (
    <>
      <HeroProduct
        badge="Funnels 2.0 is live"
        badgeHref={href("/changelog")}
        title="Know what visitors do, without cookies."
        description="Where people come from, what they read and where they drop off, on one screen. No consent banner in their way."
        primary={primaryCta}
        secondary={{ label: "Open the live demo", href: href("/app") }}
        notes={["14 days free, no card", "No cookie banner needed", "Hosted in the EU"]}
        url="app.lumen.example/polaris"
        visual={<ProductPreview site="polaris.example" />}
        logos={["Polaris", "Kitebase", "Halcyon", "Orbitly", "Fernhill", "Northwind"]}
        logosLabel="Counting visits on 38,214 sites, including"
      />
      <BentoFeatures
        eyebrow="Why Lumen"
        title="Clear answers, and nothing stored on their devices."
        description="What teams get in their first month, in their own numbers."
        items={bento}
      />
      <InstallSnippet
        eyebrow="How it works"
        title="Live in five minutes, in three steps."
        description="No tag manager, no consent setup, no data team."
        steps={steps}
        snippets={snippets}
        note="1.4 kB gzipped · loads after your page · sets no cookies"
        action={{ label: "Read the install guide", href: href("/app/help") }}
      />
      <ProofBand
        eyebrow="Customers"
        title="Teams switched and stopped worrying."
        metrics={metrics}
        quotes={quotes}
        action={{ label: "Read customer stories", href: href("/customers") }}
      />
      <section className="bg-bg px-4 py-12 text-fg sm:px-6 md:px-8 md:py-16">
        <ScrollTextReveal as="h2" className="mx-auto max-w-4xl font-display text-2xl leading-snug md:text-4xl">
          Your visitors came to read, buy or sign up, not to be followed around the web. Lumen counts what happened on your site and forgets who did it.
        </ScrollTextReveal>
      </section>
      <VsList
        eyebrow="Compared"
        title="Lumen vs the usual analytics."
        description="Same questions answered, without the banner, the weight or the ad network."
        us="Lumen"
        them="The usual analytics"
        rows={vs}
        note={riskReducer}
      />
      <Faq
        compact
        structuredData
        title="Questions, answered."
        description="Still curious? A person replies within a day."
        contact={{ label: "Email hello@lumen.example", href: "mailto:hello@lumen.example" }}
        items={faq}
      />
      <CtaPanel
        compact
        title="Start measuring in five minutes."
        description="Add one script tag and watch your first visitors arrive."
        primary={primaryCta}
        secondary={{ label: "Compare plans", href: href("/pricing") }}
        note={riskReducer}
      />
    </>
  );
}
