import type { AboutMilestone, AboutStat, AboutValue } from "@/registry/kit/blocks/about";
import type { Post } from "@/registry/kit/blocks/blog-cards";
import type { PostAuthor, PostSection, RelatedPost } from "@/registry/kit/blocks/blog-post";
import type { Role } from "@/registry/kit/blocks/careers";
import type { RoleDetail } from "@/registry/kit/blocks/careers-role";
import type { CaseChapter, CaseMetric } from "@/registry/kit/blocks/case-study";
import type { Channel, Office } from "@/registry/kit/blocks/contact-page";
import type { CaseStudyCard } from "@/registry/kit/blocks/customers";

/*
 * Copy for Lumen's company pages (about, careers, blog, customers, contact).
 * Kept apart from the page code so the router file stays readable. Links are
 * hash routes, the same as everywhere else in the template.
 */

/* ---------------------------------------------------------------- about */

export const about = {
  title: "Analytics that respect the people being counted.",
  lead: "Lumen is a small, independent company in Berlin and Istanbul. We build product analytics that answer real questions without cookies, profiles or a consent banner.",
  stats: [
    { value: 38_214, label: "sites measured" },
    { value: 2.14, decimals: 2, suffix: "B", label: "events a month" },
    { value: 99.98, decimals: 2, suffix: "%", label: "uptime over 12 months" },
    { value: 27, label: "people, fully remote" },
  ] satisfies AboutStat[],
  story: [
    "Lumen started in 2021 as a weekend fix for our own consulting clients. They wanted to know which pages sold, and they were tired of a cookie banner that half their visitors refused.",
    "Today the same 1.4 kB script counts visits on 38,214 sites, from personal blogs to listed retailers. We are funded by customers, not investors, and every person here takes a turn answering support.",
  ],
  milestones: [
    { year: "2021", text: "First version counts visits for four client sites." },
    { year: "2022", text: "Public launch. 1,206 sites in the first month." },
    { year: "2024", text: "Funnels and goals ship; servers move fully to the EU." },
    { year: "2026", text: "Funnels 2.0, retention cohorts and SOC 2 Type II." },
  ] satisfies AboutMilestone[],
  values: [
    { title: "Count less, explain more", body: "We collect the smallest set of fields that answers the question, and spend our effort on making the answer clear." },
    { title: "No dark patterns", body: "No auto-renew surprises, no hidden limits. Pricing changes are announced 60 days ahead on the changelog." },
    { title: "Everyone does support", body: "Engineers and designers each take a support week every two months. It is the fastest way to learn what to build." },
    { title: "Calm pace", body: "Six-week cycles, two-week cool-downs and no launch nights. Analytics should be boring to run." },
  ] satisfies AboutValue[],
  team: [
    { name: "Ada Kaya", role: "Co-founder, Growth" },
    { name: "Mateo Ruiz", role: "Co-founder, Engineering" },
    { name: "Jun Lee", role: "Head of Infrastructure" },
    { name: "Sara Okafor", role: "Developer Experience" },
    { name: "Liam Novak", role: "Security Lead" },
    { name: "Priya Shah", role: "Head of Support" },
    { name: "Tomás Herrera", role: "Data Engineer" },
    { name: "Hana Sato", role: "Product Designer" },
  ],
};

/* -------------------------------------------------------------- careers */

export const roles: Role[] = [
  { slug: "senior-data-engineer", title: "Senior Data Engineer", team: "Engineering", location: "Remote, Europe", type: "Full-time", summary: "Keep 2.1 billion events a month flowing through ClickHouse.", salary: "€88k – €112k", posted: "2026-10-14" },
  { slug: "frontend-engineer", title: "Frontend Engineer", team: "Engineering", location: "Berlin or remote", type: "Full-time", summary: "Make the dashboard load in under 400 ms with 90 days selected.", salary: "€76k – €96k", posted: "2026-10-03" },
  { slug: "product-designer", title: "Product Designer", team: "Design", location: "Remote, Europe", type: "Full-time", summary: "Turn funnels and cohorts into screens anyone can read.", salary: "€72k – €90k", posted: "2026-09-29" },
  { slug: "support-engineer", title: "Support Engineer", team: "Support", location: "Istanbul or remote", type: "Full-time", summary: "Answer with a fix or a query, not a ticket number.", salary: "€54k – €66k", posted: "2026-10-18" },
  { slug: "technical-writer", title: "Technical Writer", team: "Support", location: "Remote, Europe", type: "Part-time", summary: "Write the install guides for 14 frameworks.", salary: "€34k – €41k (0.6 FTE)", posted: "2026-08-27" },
];

// One description for every opening: what working on a Lumen team is like.
export const roleDetail: RoleDetail = {
  about:
    "Lumen is 27 people in teams of three or four. Each team owns one part of the product end to end, from the first design doc to the support replies, and ships in six-week cycles with two weeks to tidy up. Last quarter that meant Funnels 2.0, a 4.6× cheaper event store and a dashboard that loads in under 400 ms.",
  responsibilities: [
    "Own a part of Lumen with your team, from the first sketch to the support reply.",
    "Write the short design docs that decide what we build, and the ones that decide what we don't.",
    "Ship in small pieces and read the numbers afterwards. We use our own product for that.",
    "Take a turn on support one week in eight, and fix what you find.",
  ],
  requirements: [
    "Several years doing this work for a product people pay for.",
    "Care for the details people notice: copy, speed, edge cases.",
    "Clear written English. Most of our decisions happen in documents.",
  ],
  niceToHave: ["Experience with analytics, data tools or privacy law.", "You have run a small open-source project or community."],
  process: ["30-minute intro call", "Paid take-home (€400) or a past project walkthrough", "Two 60-minute conversations with the team", "Reference calls and an offer within 10 working days"],
};

/* ----------------------------------------------------------------- blog */

export interface LumenPost {
  slug: string;
  tag: string;
  title: string;
  excerpt: string;
  /** ISO date. */
  date: string;
  readingTime: string;
  sections: PostSection[];
  pullQuote: { text: string; cite: string; after: number } | null;
}

export const author: PostAuthor = {
  name: "Sara Okafor",
  role: "Developer Experience",
  bio: "Sara leads developer experience at Lumen. Before that she ran docs at Kitebase for five years.",
  href: "#/about",
};

export const blogPosts: LumenPost[] = [
  {
    slug: "funnels-2",
    tag: "Product",
    title: "Funnels 2.0: why we show the median time between steps",
    excerpt: "Averages made our own onboarding look fine. The median, and the spread around it, told us where people actually stalled.",
    date: "2026-10-21",
    readingTime: "7 min read",
    sections: [
      {
        id: "the-problem",
        title: "Averages hid the slow step",
        body: [
          "Our own trial funnel said people took 6 minutes on average to go from sign-up to adding the script. That looked fine, and it was wrong.",
          "Most people finished in under 2 minutes. A long tail took days, and those few dragged the average up while hiding how many got stuck.",
        ],
      },
      {
        id: "what-changed",
        title: "What changed in Funnels 2.0",
        body: [
          "Every step now shows the median time from the step before, with the 25th and 75th percentiles as a band. A wide band means people split into two groups, and that is usually the step to look at.",
          "Funnels also accept any custom event, not only page views, so you can measure a step like \"copied the snippet\" that never loads a page.",
        ],
      },
      {
        id: "results",
        title: "What we found in our own data",
        body: [
          "The slow group was people on Webflow, who had to find a settings page we never linked to. One help article and a direct link cut their median from 3 days to 11 minutes.",
          "Trials that added the script on day one went from 61% to 74% in the four weeks after.",
        ],
      },
    ],
    pullQuote: { text: "The average said six minutes. The median said two, and a third of people took days.", cite: "Sara Okafor, Developer Experience", after: 0 },
  },
  {
    slug: "counting-without-cookies",
    tag: "Engineering",
    title: "Counting visitors without cookies",
    excerpt: "A daily rotating salt, a hash we can't reverse, and the numbers we tested it against.",
    date: "2026-10-02",
    readingTime: "9 min read",
    sections: [
      {
        id: "the-idea",
        title: "One hash a day, then forget it",
        body: [
          "To count unique visitors we hash the site, the IP address, the browser and a salt that changes every midnight. The salt is never stored, so yesterday's hashes can't be rebuilt.",
          "The IP address itself never reaches a disk. It lives in memory for the few milliseconds it takes to look up the country.",
        ],
      },
      {
        id: "accuracy",
        title: "How close is it?",
        body: [
          "We ran the method next to a cookie-based counter on 212 consenting sites for 30 days. Daily uniques matched within 2.8%, with the gap mostly from people switching networks.",
          "Multi-day uniques are less exact by design. We show them as ranges and say so in the interface.",
        ],
      },
      {
        id: "trade-offs",
        title: "The trade-offs we accept",
        body: [
          "We can't follow one person across days or devices, and we don't want to. If your question needs that, you need consent, and Lumen is the wrong tool.",
        ],
      },
    ],
    pullQuote: null,
  },
  {
    slug: "clickhouse-migration",
    tag: "Engineering",
    title: "Moving 2 billion events to ClickHouse",
    excerpt: "Three migrations, one weekend of dual writes and a 4.6× smaller bill.",
    date: "2026-09-12",
    readingTime: "11 min read",
    sections: [
      {
        id: "why-move",
        title: "Why we moved",
        body: [
          "Our Postgres cluster handled 2.14 billion events a month, but a 90-day query on a busy site took 1.9 seconds at p95 and storage grew faster than revenue.",
          "Columnar storage fits analytics: we read a few columns over many rows, almost never one whole row.",
        ],
      },
      {
        id: "dual-writes",
        title: "A weekend of dual writes",
        body: [
          "For 48 hours every event went to both databases. A checker compared hourly counts per site and paged us on any gap above 0.1%. It fired twice, both times for clock skew in one region.",
          "We moved dashboards over one plan tier at a time, starting with Starter sites, which forgive a slow chart more easily.",
        ],
      },
      {
        id: "results",
        title: "Results",
        body: ["p95 query time dropped to 410 ms. The storage bill fell 4.6×, which paid for the migration in under three months."],
      },
    ],
    pullQuote: { text: "Columnar storage fits analytics: we read a few columns over many rows.", cite: "Jun Lee, Head of Infrastructure", after: 0 },
  },
];

const shortDate = (iso: string) => new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });

/** Cards for the blog index. */
export const posts: Post[] = blogPosts.map((p) => ({
  title: p.title,
  excerpt: p.excerpt,
  tag: p.tag,
  date: shortDate(p.date),
  readingTime: p.readingTime.replace(" read", ""),
  href: `#/blog/${p.slug}`,
}));

/** The other posts, for the "Keep reading" list under a post. */
export const relatedTo = (slug: string): RelatedPost[] =>
  blogPosts.filter((p) => p.slug !== slug).map((p) => ({ title: p.title, tag: p.tag, readingTime: p.readingTime.replace(" read", ""), href: `#/blog/${p.slug}` }));

/* ------------------------------------------------------------ customers */

export interface LumenCaseStudy {
  slug: string;
  company: string;
  industry: string;
  title: string;
  summary: string;
  metrics: CaseMetric[];
  facts: { label: string; value: string }[];
  chapters: CaseChapter[];
  quote: { text: string; name: string; role: string };
  card: Omit<CaseStudyCard, "company" | "industry" | "href">;
}

export const caseStudies: LumenCaseStudy[] = [
  {
    slug: "polaris",
    company: "Polaris",
    industry: "SaaS",
    title: "How Polaris dropped its cookie banner and 11.4% of its bounces.",
    summary: "A 62-person SaaS company replaced Google Analytics with Lumen, removed its consent pop-up and finally got numbers that matched its sales data.",
    metrics: [
      { value: 11.4, decimals: 1, suffix: "%", label: "fewer bounces in the first week" },
      { value: 23, suffix: "%", label: "more visits counted than with GA and a consent banner" },
      { value: 5, suffix: " min", label: "to install across three sites" },
    ],
    facts: [
      { label: "Industry", value: "SaaS, scheduling" },
      { label: "Team size", value: "62 people" },
      { label: "Headquarters", value: "Copenhagen" },
      { label: "Using Lumen since", value: "February 2025" },
      { label: "Plan", value: "Business yearly" },
    ],
    chapters: [
      {
        title: "The challenge",
        paragraphs: [
          "Polaris sells scheduling software to clinics across the Nordics. Its legal team required a consent banner for Google Analytics, and 38% of visitors declined it.",
          "Marketing was making decisions on less than two thirds of its traffic, and the numbers never matched sign-ups in the billing system.",
        ],
      },
      {
        title: "The approach",
        paragraphs: [
          "The growth team ran Lumen next to GA for two weeks to compare. Legal reviewed the data processing agreement and confirmed no consent was needed for Lumen.",
          "Then they removed GA and the banner on the same day, and imported two years of history so the trend lines stayed intact.",
        ],
      },
      {
        title: "The results",
        paragraphs: [
          "Bounce rate fell 11.4% the first week without the pop-up. Lumen counted 23% more visits than GA had, and sign-up attribution now matches billing within 2%.",
          "The weekly growth meeting runs off one shared Lumen dashboard instead of three exported spreadsheets.",
        ],
      },
    ],
    quote: { text: "We dropped our cookie banner and our bounce rate in the same week. The numbers finally match our sales data.", name: "Ada Kowalski", role: "Head of growth, Polaris" },
    card: { metric: "11.4%", metricLabel: "fewer bounces after dropping the banner", quote: "We dropped our cookie banner and our bounce rate in the same week.", person: "Ada Kowalski", role: "Head of growth" },
  },
  {
    slug: "orbitly",
    company: "Orbitly",
    industry: "SaaS",
    title: "How Orbitly found one confusing step and lifted trials 18%.",
    summary: "A product team used Lumen funnels to see where sign-ups stalled during onboarding, fixed one screen and measured the change the same week.",
    metrics: [
      { value: 18, suffix: "%", label: "more trials started" },
      { value: 3, suffix: " days", label: "from first funnel to shipped fix" },
      { value: 4.1, decimals: 1, suffix: "%", label: "trial-to-paid, up from 3.3%" },
    ],
    facts: [
      { label: "Industry", value: "SaaS, team planning" },
      { label: "Team size", value: "34 people" },
      { label: "Headquarters", value: "Lisbon" },
      { label: "Using Lumen since", value: "June 2025" },
      { label: "Plan", value: "Growth" },
    ],
    chapters: [
      {
        title: "The challenge",
        paragraphs: [
          "Orbitly's sign-ups were growing, but trials weren't keeping up. The team had page views by the million and no idea which step people abandoned.",
        ],
      },
      {
        title: "The approach",
        paragraphs: [
          "They built a four-step funnel from custom events: sign-up, workspace created, first plan added, teammate invited. The median time on step three was 14 minutes, against under 2 for the rest.",
          "Session notes showed people stuck on an empty plan template. The team replaced it with a filled-in example.",
        ],
      },
      {
        title: "The results",
        paragraphs: ["The median on step three fell to 3 minutes and trials rose 18% over the next four weeks, with no change in traffic."],
      },
    ],
    quote: { text: "Funnels showed us one confusing step in onboarding. We fixed it and trials went up 18%.", name: "Jun Lee", role: "Product manager, Orbitly" },
    card: { metric: "18%", metricLabel: "more trials after one onboarding fix", quote: "Funnels showed us one confusing step. We fixed it the same afternoon.", person: "Jun Lee", role: "Product manager" },
  },
  {
    slug: "marlow-finch",
    company: "Marlow & Finch",
    industry: "Agencies",
    title: "How Marlow & Finch replaced monthly PDF reports with live links.",
    summary: "A web agency moved 41 client sites to Lumen and swapped its monthly reporting day for shared dashboards clients actually open.",
    metrics: [
      { value: 41, label: "client sites on one account" },
      { value: 2, suffix: " days", label: "of reporting work saved each month" },
      { value: 87, suffix: "%", label: "of clients open their link weekly" },
    ],
    facts: [
      { label: "Industry", value: "Web and brand agency" },
      { label: "Team size", value: "19 people" },
      { label: "Headquarters", value: "Bristol" },
      { label: "Using Lumen since", value: "October 2024" },
      { label: "Plan", value: "Business" },
    ],
    chapters: [
      {
        title: "The challenge",
        paragraphs: [
          "Every month two people spent two days exporting charts into PDF reports for 41 clients. Most clients never replied, and some asked for numbers that were already inside.",
        ],
      },
      {
        title: "The approach",
        paragraphs: [
          "The agency moved every site to one Lumen account and gave each client a shared, read-only dashboard with a password and their own goals.",
        ],
      },
      {
        title: "The results",
        paragraphs: ["Reporting day is gone. 87% of clients open their link at least once a week, and account calls start from the same numbers."],
      },
    ],
    quote: { text: "Clients get a live link instead of a monthly PDF, and they actually read it.", name: "Elif Demir", role: "Managing partner, Marlow & Finch" },
    card: { metric: "41", metricLabel: "client sites reporting from one account", quote: "Clients get a live link instead of a monthly PDF, and they read it.", person: "Elif Demir", role: "Managing partner" },
  },
];

/** Story cards for the customers page. */
export const stories: CaseStudyCard[] = caseStudies.map((c) => ({ company: c.company, industry: c.industry, href: `#/customers/${c.slug}`, ...c.card }));

/* -------------------------------------------------------------- contact */

export const channels: Channel[] = [
  { title: "Sales", body: "Business plans, security reviews and paying by invoice.", action: "Email sales", href: "mailto:sales@lumen.example" },
  { title: "Support", body: "Stuck on setup? Median first reply is 2 hours 14 minutes.", action: "Open the help center", href: "#/app/help" },
  { title: "Press", body: "Logos, screenshots and founder bios in one download.", action: "Email press", href: "mailto:press@lumen.example" },
];

export const offices: Office[] = [
  { city: "Berlin", address: ["Linienstraße 214", "10119 Berlin, Germany"], hours: "Mon–Fri, 09:00–18:00 CET", pin: { x: 52.5, y: 33 }, mapHref: "https://maps.google.com/?q=Linienstra%C3%9Fe+214+Berlin" },
  { city: "Istanbul", address: ["Kemankeş Karamustafa Paşa Mah. 41", "34425 Beyoğlu, İstanbul, Türkiye"], hours: "Mon–Fri, 09:00–18:00 TRT", pin: { x: 58, y: 40 }, mapHref: "https://maps.google.com/?q=Karak%C3%B6y+Istanbul" },
];
