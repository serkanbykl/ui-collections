"use client";

import { useEffect, useSyncExternalStore, type ReactNode } from "react";

import { About } from "@/registry/kit/blocks/about";
import { AuthCheckEmail } from "@/registry/kit/blocks/auth-check-email";
import { AuthForgot } from "@/registry/kit/blocks/auth-forgot";
import { AuthLockScreen } from "@/registry/kit/blocks/auth-lock-screen";
import { AuthOtp } from "@/registry/kit/blocks/auth-otp";
import { AuthReset } from "@/registry/kit/blocks/auth-reset";
import { AuthSignIn } from "@/registry/kit/blocks/auth-sign-in";
import { AuthSignInSplit } from "@/registry/kit/blocks/auth-sign-in-split";
import { AuthSignUp } from "@/registry/kit/blocks/auth-sign-up";
import { AuthSignUpSplit } from "@/registry/kit/blocks/auth-sign-up-split";
import { AuthVerifyEmail } from "@/registry/kit/blocks/auth-verify-email";
import { BlogCards } from "@/registry/kit/blocks/blog-cards";
import { BlogPost } from "@/registry/kit/blocks/blog-post";
import { Careers } from "@/registry/kit/blocks/careers";
import { CareersRole } from "@/registry/kit/blocks/careers-role";
import { CaseStudy } from "@/registry/kit/blocks/case-study";
import { Changelog, type Release } from "@/registry/kit/blocks/changelog";
import { ComingSoon } from "@/registry/kit/blocks/coming-soon";
import { ContactPage } from "@/registry/kit/blocks/contact-page";
import { CtaPanel } from "@/registry/kit/blocks/cta-panel";
import { Customers } from "@/registry/kit/blocks/customers";
import { Error403 } from "@/registry/kit/blocks/error-403";
import { Error404 } from "@/registry/kit/blocks/error-404";
import { Error500 } from "@/registry/kit/blocks/error-500";
import { Faq, type FaqItem } from "@/registry/kit/blocks/faq";
import { FooterColumns, type FooterColumn } from "@/registry/kit/blocks/footer-columns";
import { Maintenance } from "@/registry/kit/blocks/maintenance";
import { Navbar } from "@/registry/kit/blocks/navbar";
import { Newsletter } from "@/registry/kit/blocks/newsletter";
import { Offline } from "@/registry/kit/blocks/offline";
import { PricingCompare, type CompareGroup } from "@/registry/kit/blocks/pricing-compare";
import { PricingTiers, type Tier } from "@/registry/kit/blocks/pricing-tiers";
import { appPages, go, href, LumenAppPage, LumenGlyph } from "@/registry/kit/templates/template-lumen-app";
import { LumenHome, primaryCta, riskReducer } from "@/registry/kit/templates/template-lumen-home";
import { storeRoutes } from "@/registry/kit/templates/template-lumen-store";
import { about, author, blogPosts, caseStudies, channels, offices, posts, relatedTo, roleDetail, roles, stories } from "@/registry/kit/templates/template-lumen-content";
import { AuroraBackdrop } from "@/registry/kit/ui/aurora-backdrop";
import { BrandMark } from "@/registry/kit/ui/brand-mark";
import { buttonVariants } from "@/registry/kit/ui/button";

/*
 * Lumen — a complete marketing site plus a 40-screen admin app, composed only
 * from registry blocks, screens and dashboards (AGENTS.md: templates compose,
 * never copy). Pages switch on the URL hash, so it runs in any React app.
 * Every route is listed in `pages` below and on the #/pages index; anything
 * else renders the 404 page.
 */

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/* --------------------------------------------------------------- content */

const nav = [
  { label: "Product", href: href("/") },
  { label: "Pricing", href: href("/pricing") },
  { label: "Customers", href: href("/customers") },
  { label: "Blog", href: href("/blog") },
];

const tiers: Tier[] = [
  { name: "Starter", description: "For personal sites and side projects.", monthly: 0, yearly: 0, features: ["10K events / month", "1 site", "Realtime dashboard", "30-day history"], cta: "Start free" },
  { name: "Growth", description: "For products finding their market.", monthly: 24, yearly: 19, features: ["1M events / month", "10 sites", "Funnels and goals", "Unlimited history", "Shared reports"], cta: "Start 14-day trial", featured: true },
  { name: "Business", description: "For teams with many products.", monthly: 96, yearly: 79, features: ["10M events / month", "Unlimited sites", "Retention cohorts", "SSO and roles", "Priority support"], cta: "Start 14-day trial" },
];

const compare: CompareGroup[] = [
  {
    title: "Measurement",
    rows: [
      { feature: "Events / month", values: ["10K", "1M", "10M"] },
      { feature: "Sites", values: ["1", "10", "Unlimited"] },
      { feature: "Data history", values: ["30 days", "Unlimited", "Unlimited"] },
      { feature: "Realtime dashboard", values: [true, true, true] },
    ],
  },
  {
    title: "Insights",
    rows: [
      { feature: "Goals and custom events", values: [false, true, true] },
      { feature: "Funnels", values: [false, true, true] },
      { feature: "Retention cohorts", values: [false, false, true] },
      { feature: "Shared reports", values: [false, true, true] },
    ],
  },
  {
    title: "Team",
    rows: [
      { feature: "Seats", values: ["1", "5", "Unlimited"] },
      { feature: "SSO and roles", values: [false, false, true] },
      { feature: "Support", values: ["Community", "Email", "Priority"] },
    ],
  },
];

const pricingFaq: FaqItem[] = [
  { question: "What counts as an event?", answer: "A page view or a custom event you send. Visitors themselves are free, however many there are." },
  { question: "What happens if I go over my limit?", answer: "Nothing breaks. We email you at 80% and 100% and suggest a plan; we never stop counting mid-month." },
  { question: "Do I need a card for the trial?", answer: "No. Start the 14-day trial with just an email. We ask for billing details only if you keep a paid plan." },
  { question: "Can I cancel anytime?", answer: "Yes, in one click from Settings. Plans are month to month, or yearly with two months free." },
  { question: "Do you offer discounts?", answer: "Registered non-profits and open-source projects get 50% off Growth. Email billing@lumen.example from your organisation's domain." },
  { question: "Which currencies and payment methods do you take?", answer: "USD, EUR and GBP, by card or, on yearly Business plans, by bank transfer against an invoice." },
];

const releases: Release[] = [
  { version: "2.0", date: "Oct 2026", title: "Funnels 2.0", notes: ["Build funnels from any event, not only page views.", "See the median time between steps.", "Compare two date ranges side by side."] },
  { version: "1.9", date: "Sep 2026", title: "Retention cohorts", notes: ["Weekly and monthly cohorts on the Business plan.", "Cohorts can be filtered by source or country."] },
  { version: "1.8", date: "Aug 2026", title: "Shared reports", notes: ["Share a live, read-only dashboard with a link.", "Optional password and expiry date per link."] },
  { version: "1.7", date: "Jul 2026", title: "Google Analytics import", notes: ["Bring in up to two years of history during signup.", "Imported data is marked so you can tell it apart."] },
];

const footer: FooterColumn[] = [
  {
    title: "Product",
    links: [
      { label: "Features", href: href("/") },
      { label: "Pricing", href: href("/pricing") },
      { label: "Changelog", href: href("/changelog") },
      { label: "Customers", href: href("/customers") },
      { label: "Sign in", href: href("/signin") },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: href("/about") },
      { label: "Careers", href: href("/careers") },
      { label: "Blog", href: href("/blog") },
      { label: "Contact", href: href("/contact") },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Help center", href: href("/app/help") },
      { label: "Platform status", href: href("/app/status") },
      { label: "Live demo", href: href("/app") },
      { label: "All pages", href: href("/pages") },
    ],
  },
  { title: "Legal", links: [{ label: "Privacy", href: href("/privacy") }, { label: "Terms", href: href("/terms") }] },
];

type LegalRoute = "/privacy" | "/terms";

const legal: Record<LegalRoute, { title: string; updated: string; sections: { heading: string; body: string }[] }> = {
  "/privacy": {
    title: "Privacy policy",
    updated: "Updated 3 September 2026",
    sections: [
      { heading: "What we collect from your visitors", body: "Page URL, referrer, browser, operating system, screen size and country, worked out from the IP address and then discarded. We never store IP addresses, set cookies or build profiles." },
      { heading: "What we collect from you", body: "Your name, email and billing details, so we can run your account and send invoices. We don't sell or share them, and we don't use them for advertising." },
      { heading: "Where it lives", body: "On servers in Frankfurt and Helsinki, run by an EU company. Our data processing agreement is part of the Terms and applies to every plan." },
      { heading: "Your rights", body: "Export or delete your data from Settings at any time. For anything else, email privacy@lumen.example and a person replies within two working days." },
    ],
  },
  "/terms": {
    title: "Terms of service",
    updated: "Updated 3 September 2026",
    sections: [
      { heading: "Your account", body: "You're responsible for the sites you add and for keeping your password safe. Invite colleagues instead of sharing a login." },
      { heading: "Billing", body: "Plans renew monthly or yearly until you cancel. If you go over your event limit we email you first; we never stop counting mid-month or charge without warning." },
      { heading: "Cancelling", body: "Cancel from Settings in one click. Your dashboard stays readable until the end of the period, and you can export everything before it closes." },
      { heading: "Data processing", body: "Lumen acts as your processor under the GDPR. We process visitor data only to produce your reports and delete raw events after 24 months." },
    ],
  },
};

function Pricing() {
  return (
    <>
      <PricingTiers
        headingLevel="h1"
        title="Simple pricing, based on events."
        tiers={tiers}
        ctaHref={href("/signup")}
        unit="/ month"
        note="Starter is free up to 10,000 events · paid plans start with 14 days free, no card required"
      />
      <PricingCompare title="Compare plans" plans={["Starter", "Growth", "Business"]} groups={compare} highlight={1} />
      <Faq
        title="Billing, plainly."
        description="Anything else? We answer every message ourselves."
        contact={{ label: "Email billing@lumen.example", href: "mailto:billing@lumen.example" }}
        items={pricingFaq}
      />
      <CtaPanel
        title="Try every Growth feature free for 14 days."
        description={`Downgrade to Starter at any time and your history stays. ${riskReducer}`}
        primary={primaryCta}
        secondary={{ label: "Read the changelog", href: href("/changelog") }}
      />
    </>
  );
}

function ChangelogPage() {
  return (
    <>
      <Changelog title="What's new in Lumen" releases={releases} headingLevel="h1" />
      <Newsletter title="Release notes, once a month." description="New features and the occasional analytics essay. Unsubscribe in one click." />
    </>
  );
}

function LegalPage({ page }: { page: LegalRoute }) {
  const doc = legal[page];
  return (
    <article className="bg-bg px-6 py-20 text-fg md:px-8 md:py-28">
      <div className="mx-auto max-w-2xl">
        <p className="text-sm text-muted">{doc.updated}</p>
        <h1 className="mt-3 font-display text-4xl leading-tight md:text-5xl">{doc.title}</h1>
        {doc.sections.map((s) => (
          <section key={s.heading} className="mt-10">
            <h2 className="text-lg font-medium">{s.heading}</h2>
            <p className="mt-2 leading-relaxed text-muted">{s.body}</p>
          </section>
        ))}
        <a href={href("/")} className={buttonVariants({ variant: "surface", className: "mt-12" })}>
          Back to home
        </a>
      </div>
    </article>
  );
}

/* ----------------------------------------------------------------- pages */

const logo = (
  <BrandMark>
    <LumenGlyph />
  </BrandMark>
);

/** Site chrome for marketing pages: sticky navbar, main landmark and footer. */
function MarketingPage({ active, children }: { active: string; children: ReactNode }) {
  return (
    <div className="relative isolate min-h-dvh bg-bg text-fg">
      {/* The same page backdrop as the app and store; the theme's --aurora-strength sets it. */}
      <AuroraBackdrop grid={false} className="fixed print:hidden" />
      <div className="sticky top-0 z-40 border-b border-line bg-bg/80 backdrop-blur-xl">
        <Navbar
          backdrop={false}
          items={nav}
          activeHref={href(active)}
          homeHref={href("/")}
          logo={logo}
          signIn={{ label: "Sign in", href: href("/signin") }}
          cta={primaryCta}
        />
      </div>
      <main id="main">{children}</main>
      <FooterColumns
        brand="lumen"
        logo={
          <BrandMark size="lg">
            <LumenGlyph />
          </BrandMark>
        }
        tagline="Privacy-friendly product analytics."
        columns={footer}
        homeHref={href("/")}
        // Lumen has no social accounts to link yet.
        socials={[]}
      />
    </div>
  );
}

const lastSegment = (path: string) => path.split("/").pop() ?? "";

function BlogPostPage({ path }: { path: string }) {
  const p = blogPosts.find((x) => x.slug === lastSegment(path)) ?? blogPosts[0]!;
  return (
    <BlogPost
      tag={p.tag}
      title={p.title}
      excerpt={p.excerpt}
      date={p.date}
      readingTime={p.readingTime}
      sections={p.sections}
      pullQuote={p.pullQuote}
      author={author}
      related={relatedTo(p.slug)}
      blogHref={href("/blog")}
    />
  );
}

function CaseStudyPage({ path }: { path: string }) {
  const index = Math.max(
    0,
    caseStudies.findIndex((c) => c.slug === lastSegment(path)),
  );
  const study = caseStudies[index]!;
  const next = caseStudies[(index + 1) % caseStudies.length]!;
  return (
    <CaseStudy
      company={study.company}
      industry={study.industry}
      title={study.title}
      summary={study.summary}
      metrics={study.metrics}
      facts={study.facts}
      chapters={study.chapters}
      quote={study.quote}
      customersHref={href("/customers")}
      signUpHref={href("/signup")}
      salesHref={href("/contact")}
      next={{ company: next.company, title: next.card.metricLabel, href: href(`/customers/${next.slug}`) }}
    />
  );
}

/* ---------------------------------------------------------------- routes */

interface SitePage {
  /** Hash path; `:slug` matches any one segment. */
  path: string;
  title: string;
  /** Group on the #/pages index. */
  section: string;
  /** A concrete path for `:slug` routes. */
  sample?: string;
  /** "site" wraps the page in the navbar and footer; "bare" pages fill the screen; "own" pages bring their own chrome. */
  chrome: "site" | "bare" | "own";
  /** The navbar link to mark; defaults to `path`. */
  nav?: string;
  render: (path: string) => ReactNode;
}

const me = { name: "Ada Kaya", email: "ada@lumen.example" };

const sitePages: SitePage[] = [
  // Marketing.
  { path: "/", title: "Home", section: "Marketing", chrome: "site", render: () => <LumenHome /> },
  { path: "/pricing", title: "Pricing", section: "Marketing", chrome: "site", render: () => <Pricing /> },
  { path: "/changelog", title: "Changelog", section: "Marketing", chrome: "site", render: () => <ChangelogPage /> },
  {
    path: "/customers",
    title: "Customers",
    section: "Marketing",
    chrome: "site",
    render: () => (
      <Customers
        title="38,214 sites count visits with Lumen."
        lead="From personal blogs to listed retailers. Here's what changed for a few of them after the cookie banner went."
        stories={stories}
        signUpHref={href("/signup")}
        salesHref={href("/contact")}
      />
    ),
  },
  { path: "/customers/:slug", title: "Case study", section: "Marketing", sample: "/customers/polaris", chrome: "site", nav: "/customers", render: (path) => <CaseStudyPage path={path} /> },
  { path: "/privacy", title: "Privacy policy", section: "Marketing", chrome: "site", render: () => <LegalPage page="/privacy" /> },
  { path: "/terms", title: "Terms of service", section: "Marketing", chrome: "site", render: () => <LegalPage page="/terms" /> },

  // Company.
  {
    path: "/about",
    title: "About",
    section: "Company",
    chrome: "site",
    render: () => (
      <About
        title={about.title}
        lead={about.lead}
        stats={about.stats}
        story={about.story}
        milestones={about.milestones}
        values={about.values}
        team={about.team}
        careersHref={href("/careers")}
        contactHref={href("/contact")}
        hiringNote={`${roles.length} open roles across engineering, design and support. Remote within Europe and Türkiye.`}
      />
    ),
  },
  {
    path: "/careers",
    title: "Careers",
    section: "Company",
    chrome: "site",
    render: () => (
      <Careers
        title="Build analytics people don't have to consent to."
        lead="We're 27 people across 9 countries. Small teams, real ownership and a pace you can keep for years."
        roles={roles}
        roleHref={(role) => href(`/careers/${role.slug}`)}
        openApplicationHref="mailto:jobs@lumen.example"
      />
    ),
  },
  {
    path: "/careers/:slug",
    title: "Open role",
    section: "Company",
    sample: `/careers/${roles[0]!.slug}`,
    chrome: "site",
    nav: "/careers",
    render: (path) => (
      <CareersRole role={roles.find((r) => r.slug === lastSegment(path)) ?? roles[0]} detail={roleDetail} careersHref={href("/careers")} privacyHref={href("/privacy")} />
    ),
  },
  { path: "/blog", title: "Blog", section: "Company", chrome: "site", render: () => <BlogCards title="The Lumen journal" posts={posts} allHref={null} headingLevel="h1" /> },
  { path: "/blog/:slug", title: "Blog post", section: "Company", sample: `/blog/${blogPosts[0]!.slug}`, chrome: "site", nav: "/blog", render: (path) => <BlogPostPage path={path} /> },
  {
    path: "/contact",
    title: "Contact",
    section: "Company",
    chrome: "site",
    render: () => <ContactPage channels={channels} offices={offices} privacyHref={href("/privacy")} />,
  },

  // Account: sign-in, sign-up and recovery flows.
  {
    path: "/signin",
    title: "Sign in",
    section: "Account",
    chrome: "bare",
    render: () => (
      <AuthSignIn
        brand="lumen"
        logo={logo}
        homeHref={href("/")}
        signUpHref={href("/signup")}
        forgotHref={href("/forgot")}
        // Demo: prefilled, and every way in leads straight to the app.
        defaultValues={{ email: me.email, password: "demo-password" }}
        onProvider={() => go("/app")}
        onSubmit={() => go("/app")}
      />
    ),
  },
  {
    path: "/signin/split",
    title: "Sign in, split with two-factor",
    section: "Account",
    chrome: "bare",
    render: () => (
      <AuthSignInSplit
        brand="lumen"
        logo={logo}
        homeHref={href("/")}
        signUpHref={href("/signup/split")}
        forgotHref={href("/forgot")}
        quote={{ quote: "We dropped our cookie banner and our bounce rate in the same week.", name: "Ada Kowalski", role: "Head of growth, Polaris" }}
        proof="Counting visits on 38,214 sites, without cookies."
        defaultValues={{ email: me.email, password: "demo-password" }}
        onProvider={() => go("/otp")}
        // This variant asks for a two-factor code before the app opens.
        onSubmit={() => go("/otp")}
      />
    ),
  },
  {
    path: "/signup",
    title: "Sign up",
    section: "Account",
    chrome: "bare",
    render: () => (
      <AuthSignUp
        brand="lumen"
        logo={logo}
        title="Know your product in minutes."
        perks={["14-day free trial, no card required", "No cookies, no consent banner", "Import your Google Analytics history"]}
        homeHref={href("/")}
        signInHref={href("/signin")}
        termsHref={href("/terms")}
        privacyHref={href("/privacy")}
        defaultValues={{ firstName: "Ada", lastName: "Kaya", email: me.email, password: "Demo-password-2026" }}
        onSubmit={() => go("/app")}
      />
    ),
  },
  {
    path: "/signup/split",
    title: "Sign up, split with email check",
    section: "Account",
    chrome: "bare",
    render: () => (
      <AuthSignUpSplit
        brand="lumen"
        logo={logo}
        homeHref={href("/")}
        signInHref={href("/signin/split")}
        termsHref={href("/terms")}
        privacyHref={href("/privacy")}
        quote={{ quote: "Funnels showed us one confusing step in onboarding. We fixed it and trials went up 18%.", name: "Jun Lee", role: "Product manager, Orbitly" }}
        proof="14-day trial. No card needed."
        defaultValues={{ name: me.name, email: me.email, password: "Demo-password-2026" }}
        onProvider={() => go("/app")}
        onSubmit={async () => {
          await delay(700);
          go("/verify-email");
        }}
      />
    ),
  },
  {
    path: "/forgot",
    title: "Forgot password",
    section: "Account",
    chrome: "bare",
    render: () => (
      <AuthForgot
        brand="lumen"
        logo={logo}
        homeHref={href("/")}
        signInHref={href("/signin")}
        defaultEmail={me.email}
        onSubmit={async () => {
          await delay(700);
          go("/check-email");
        }}
      />
    ),
  },
  {
    path: "/check-email",
    title: "Check your email",
    section: "Account",
    chrome: "bare",
    render: () => (
      <AuthCheckEmail
        brand="lumen"
        logo={logo}
        homeHref={href("/")}
        email={me.email}
        title="Check your inbox"
        description={
          <>
            We sent a password reset link to <span className="break-all text-fg">{me.email}</span>. It works for 30 minutes.
          </>
        }
        changeEmailHref={href("/forgot")}
      />
    ),
  },
  {
    path: "/reset",
    title: "Choose a new password",
    section: "Account",
    chrome: "bare",
    render: () => <AuthReset brand="lumen" logo={logo} homeHref={href("/")} signInHref={href("/signin")} email={me.email} />,
  },
  {
    path: "/otp",
    title: "Two-factor code",
    section: "Account",
    chrome: "bare",
    render: () => (
      <AuthOtp
        brand="lumen"
        logo={logo}
        homeHref={href("/")}
        destination="ada@l•••••.example"
        recoveryHref={href("/contact")}
        signInHref={href("/signin")}
        continueHref={href("/app")}
        onVerify={async () => {
          await delay(700);
          go("/app");
        }}
      />
    ),
  },
  {
    path: "/verify-email",
    title: "Verify email",
    section: "Account",
    chrome: "bare",
    render: () => <AuthVerifyEmail brand="lumen" logo={logo} homeHref={href("/")} email={me.email} continueHref={href("/app")} supportHref={href("/contact")} />,
  },
  {
    path: "/lock",
    title: "Lock screen",
    section: "Account",
    chrome: "bare",
    render: () => (
      <AuthLockScreen
        user={me}
        switchAccountHref={href("/signin")}
        forgotHref={href("/forgot")}
        onUnlock={async () => {
          await delay(700);
          go("/app");
        }}
      />
    ),
  },

  // System pages.
  {
    path: "/404",
    title: "Page not found",
    section: "System",
    chrome: "site",
    render: () => (
      <Error404
        title="We couldn't find that page."
        description="The link may be old or mistyped. The product, pricing and changelog are one click away."
        homeHref={href("/")}
        supportHref={href("/contact")}
      />
    ),
  },
  {
    path: "/500",
    title: "Server error",
    section: "System",
    chrome: "site",
    render: () => (
      <Error500
        description="Your dashboards and data are safe. We've logged the error and the on-call engineer has been paged."
        reference="LUM-7Q4K-2291"
        homeHref={href("/")}
        statusHref={href("/app/status")}
        supportHref={href("/contact")}
        onRetry={async () => {
          await delay(900);
          go("/app");
        }}
      />
    ),
  },
  {
    path: "/403",
    title: "Access denied",
    section: "System",
    chrome: "site",
    render: () => (
      <Error403
        description="It belongs to the Finance workspace. An admin can add you, usually within a working day."
        account={me}
        homeHref={href("/app")}
        switchAccountHref={href("/signin")}
      />
    ),
  },
  {
    path: "/maintenance",
    title: "Maintenance",
    section: "System",
    chrome: "bare",
    render: () => (
      <Maintenance
        title="We're moving to a faster database."
        description="Your data is safe and visits are still being counted. Dashboards are paused until the move finishes."
        statusHref={href("/app/status")}
        privacyHref={href("/privacy")}
      />
    ),
  },
  {
    path: "/coming-soon",
    title: "Coming soon",
    section: "System",
    chrome: "bare",
    render: () => (
      <ComingSoon
        brand="lumen"
        logo={logo}
        homeHref={href("/")}
        eyebrow="Lumen Heatmaps · Private beta"
        title="See where visitors click, still without cookies."
        description="Aggregated click and scroll maps for every page. Join 2,417 teams on the launch list."
        privacyHref={href("/privacy")}
      />
    ),
  },
  {
    path: "/offline",
    title: "Offline",
    section: "System",
    chrome: "bare",
    render: () => (
      <Offline
        description="Dashboards you opened recently are kept on this device. New visits appear when you reconnect."
        saved={[
          { label: "Analytics overview", href: href("/app") },
          { label: "Notes", href: href("/app/notes") },
          { label: "Help: set up single sign-on", href: href("/app/help/article") },
        ]}
      />
    ),
  },
  { path: "/pages", title: "All pages", section: "System", chrome: "site", render: () => <PagesIndex /> },

  // The public storefront, with its own header, cart drawer and footer.
  ...storeRoutes.map((r): SitePage => ({ ...r, section: "Store", chrome: "own" })),
];

type Match = { kind: "site"; page: SitePage } | { kind: "app"; page: (typeof appPages)[number] };

const allPages: Match[] = [...sitePages.map((page) => ({ kind: "site" as const, page })), ...appPages.map((page) => ({ kind: "app" as const, page }))];

const toPattern = (path: string) => new RegExp(`^${path.replace(/:[a-z]+/g, "[^/]+")}$`);

/** Exact paths win over `:slug` patterns, so /app/products/new isn't a product id. */
function findPage(path: string): Match | undefined {
  return allPages.find((m) => m.page.path === path) ?? allPages.find((m) => m.page.path.includes(":") && toPattern(m.page.path).test(path));
}

/** The path in the hash without query or trailing slash, or null for an in-page anchor such as "#main". */
function readRoute(): string | null {
  const raw = window.location.hash.replace(/^#/, "") || "/";
  if (!raw.startsWith("/")) return null;
  const path = raw.split("?")[0]!.replace(/(.)\/+$/, "$1");
  return path;
}

const subscribeToHash = (onChange: () => void) => {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
};

/** Last page path; an in-page anchor such as "#main" keeps the page it's on. */
let lastRoute = "/";
const hashSnapshot = () => (lastRoute = readRoute() ?? lastRoute);

/**
 * Tiny hash router. The server can't see the hash, so it renders no page
 * (null) rather than guessing "/": guessing painted the landing page for a
 * moment before a deep link such as #/app/mail took over.
 */
function useHashRoute() {
  const route = useSyncExternalStore(subscribeToHash, hashSnapshot, () => null);
  useEffect(() => {
    if (route !== null) window.scrollTo({ top: 0 });
  }, [route]);
  return route;
}

/* ------------------------------------------------------------ page index */

const sectionOrder = ["Marketing", "Company", "Account", "System", "Dashboards", "Apps", "E-commerce", "Store", "Invoices", "Users", "Settings", "Support"];

/** Every route, grouped, like a premium template's page index. */
function PagesIndex() {
  const sections = sectionOrder.map((name) => ({
    name,
    links: allPages.filter((m) => m.page.section === name).map((m) => ({ title: m.page.title, path: m.page.sample ?? m.page.path })),
  }));
  const total = sections.reduce((sum, s) => sum + s.links.length, 0);

  return (
    <section className="bg-bg px-6 py-20 text-fg md:px-8 md:py-28">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm text-muted">{total} pages · site, account flows, system states and the app</p>
        <h1 className="mt-3 font-display text-4xl leading-tight md:text-5xl">Every page in Lumen</h1>
        <p className="mt-4 max-w-2xl leading-relaxed text-muted">
          Open any page directly. App pages share one sidebar, so once you&apos;re inside you can reach the rest from the menu.
        </p>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map((s) => (
            <section key={s.name} className="surface rounded-card p-5" aria-labelledby={`pages-${s.name}`}>
              <h2 id={`pages-${s.name}`} className="flex items-baseline justify-between gap-3 text-sm font-medium">
                {s.name}
                <span className="text-xs font-normal text-subtle tabular-nums">{s.links.length}</span>
              </h2>
              <ul className="mt-3 grid gap-0.5">
                {s.links.map((link) => (
                  <li key={link.path}>
                    <a
                      href={href(link.path)}
                      className="-mx-2 flex items-baseline justify-between gap-3 rounded-control px-2 py-1.5 text-sm transition-colors outline-none hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-accent"
                    >
                      <span className="min-w-0 truncate">{link.title}</span>
                      <span className="shrink-0 font-mono text-[11px] text-subtle">{link.path}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
        <a href={href("/")} className={buttonVariants({ variant: "surface", className: "mt-12" })}>
          Back to home
        </a>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- template */

export function TemplateLumen() {
  const route = useHashRoute();
  // Server and first paint: just the page colour, until the hash says which page.
  if (route === null) return <div className="min-h-dvh bg-bg" />;
  const match = findPage(route) ?? { kind: "site" as const, page: sitePages.find((p) => p.path === "/404")! };

  if (match.kind === "app") return <LumenAppPage page={match.page} route={route} />;
  const { page } = match;
  if (page.chrome === "own") return <>{page.render(route)}</>;
  if (page.chrome === "bare") return <main id="main">{page.render(route)}</main>;
  return <MarketingPage active={page.nav ?? page.path}>{page.render(route)}</MarketingPage>;
}
