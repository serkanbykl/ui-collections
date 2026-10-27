import type { CatalogEntry } from "./types.ts";

const screen = (entry: Omit<CatalogEntry, "category" | "engine" | "files" | "previewHeight"> & { files?: string[]; previewHeight?: number }): CatalogEntry => ({
  category: "screens",
  engine: "CSS",
  files: [`screens/${entry.slug}.tsx`],
  previewHeight: 860,
  ...entry,
  // AppShell hosts the toaster that screens report to.
  uses: [...(entry.uses ?? []), "toast"],
});

const tableParts = ["selection-bar", "data-table", "filter-bar", "search-input", "multi-select", "checkbox", "badge", "button"];
const settings = "screen-settings-layout";
const linksProp = { name: "links", type: "SettingsLink[]", default: "defaultSettingsLinks", description: "The settings menu; ids match each page's `active`." };

/** People, account settings and support. */
export const screensAccount: CatalogEntry[] = [
  screen({
    slug: "screen-users",
    name: "Users",
    description: "Workspace members in a data table: avatars, roles, status and last active, row actions, bulk role changes and removal, and an invite dialog that checks seats.",
    uses: [...tableParts, "avatar", "dialog", "dropdown-menu", "select", "stat-card", "page-header", "chip"],
    props: [
      { name: "users", type: "AppUser[]", default: "sampleUsers", description: "Rows to show. Changes update a local copy." },
      { name: "seats", type: "number", default: "25", description: "Seats on the plan; invites stop when they run out." },
      { name: "onInvite", type: "(invite) => void", description: "Called with each new invite's email, role and team." },
      { name: "profileHref", type: "string", description: "When set, names link to `${profileHref}/${id}`." },
    ],
  }),
  screen({
    slug: "screen-user-profile",
    name: "User profile",
    description: "A person's page: cover and avatar header with follow and message, stats, and tabs for overview, activity, projects and connections.",
    uses: ["activity-list", "avatar", "badge", "button", "entity-card", "progress", "progress-list", "tabs", "page-header"],
    props: [
      { name: "person", type: "ProfilePerson", default: "sampleProfile", description: "Name, title, location, bio, skills and stats." },
      { name: "activity", type: "ActivityItem[]", default: "sampleProfileActivity", description: "Feed for the overview and activity tabs." },
      { name: "projects", type: "ProfileProject[]", default: "sampleProfileProjects", description: "Cards in the projects tab." },
      { name: "connections", type: "ProfileConnection[]", default: "sampleConnections", description: "People in the connections tab." },
      { name: "defaultTab", type: '"overview" | "activity" | "projects" | "connections"', default: '"overview"', description: "Tab shown first." },
    ],
  }),
  screen({
    slug: "screen-roles",
    name: "Roles and permissions",
    description: "Role cards with member avatars, a permissions matrix of checkboxes with save and discard, and a dialog to create or edit a role.",
    uses: ["avatar", "badge", "button", "checkbox", "dialog", "field", "table", "page-header"],
    props: [
      { name: "roles", type: "Role[]", default: "sampleRoles", description: "Roles with their members and granted permission ids." },
      { name: "permissions", type: "Permission[]", default: "samplePermissions", description: "Rows of the matrix, grouped by `group`." },
      { name: "onSave", type: "(roles: Role[]) => void", description: "Called when the matrix or a role is saved." },
    ],
  }),
  screen({
    slug: "screen-team",
    name: "Team",
    description: "Seat usage with a meter, an inline invite form, a searchable member grid with presence and local time, and pending invites to resend or revoke.",
    uses: ["avatar", "badge", "button", "field", "progress", "search-input", "segmented-control", "select", "states", "page-header"],
    props: [
      { name: "members", type: "TeamMember[]", default: "sampleTeam", description: "People in the grid." },
      { name: "invites", type: "PendingInvite[]", default: "samplePendingInvites", description: "Invites waiting to be accepted." },
      { name: "seats", type: "number", default: "15", description: "Seats paid for." },
      { name: "billingHref", type: "string", default: '"#/app/settings/billing"', description: "Where Add seats goes." },
    ],
  }),
  screen({
    slug: settings,
    name: "Settings layout",
    description: "The frame every settings page shares: title, a section menu that scrolls on phones and sticks beside the content on desktop, and section cards with a danger tone.",
    files: ["screens/settings-layout.tsx"],
    uses: ["page-header"],
    props: [
      { name: "active", type: "string", description: "Id of the current page in `links`." },
      { name: "title", type: "string", description: "Page heading." },
      { name: "description", type: "ReactNode", description: "One line under the title: what's set up, counts or status." },
      linksProp,
      { name: "actions", type: "ReactNode", description: "Buttons beside the title." },
    ],
  }),
  screen({
    slug: "screen-settings-general",
    name: "Settings: general",
    description: "Profile form with avatar upload (pick or drop, size and type checks), language and grouped time zone selects, date format, and a delete-account dialog that asks you to type the workspace name.",
    uses: [settings, "avatar", "button", "dialog", "field", "segmented-control", "select"],
    props: [
      { name: "profile", type: "GeneralProfile", default: "sampleGeneralProfile", description: "Starting values for the form." },
      { name: "workspaceName", type: "string", default: '"Northwind"', description: "Typed to confirm deleting the account." },
      { name: "onSave", type: "(profile) => void", description: "Called after a save." },
      { name: "onDeleteAccount", type: "() => void", description: "Called once deletion is confirmed." },
      linksProp,
    ],
  }),
  screen({
    slug: "screen-settings-security",
    name: "Settings: security",
    description: "Password change with a strength meter, a three-step two-factor setup (QR, one-time code, recovery codes to copy or download) and active sessions to sign out of.",
    uses: [settings, "alert", "badge", "button", "dialog", "field", "input-otp"],
    props: [
      { name: "sessions", type: "SecuritySession[]", default: "sampleSessions", description: "Devices signed in; `current` marks this one." },
      { name: "twoFactorEnabled", type: "boolean", default: "false", description: "Whether two-factor starts out on." },
      { name: "recoveryCodes", type: "string[]", default: "sampleRecoveryCodes", description: "Codes shown at the end of setup." },
      { name: "accountLabel", type: "string", default: '"priya@northwind.io"', description: "Account name shown in the authenticator step." },
      linksProp,
    ],
  }),
  screen({
    slug: "screen-settings-notifications",
    name: "Settings: notifications",
    description: "A switch matrix of events by channel (email, push, in-app) with all-or-none per channel and locked security email, plus quiet hours and email cadence.",
    uses: [settings, "button", "segmented-control", "select", "switch"],
    props: [
      { name: "events", type: "NotificationEvent[]", default: "sampleNotificationEvents", description: "Rows, grouped by `group`; `required` locks a channel on." },
      { name: "prefs", type: "NotificationPrefs", default: "sampleNotificationPrefs", description: "On or off per event and channel." },
      { name: "onSave", type: "(prefs) => void", description: "Called when preferences are saved." },
      linksProp,
    ],
  }),
  screen({
    slug: "screen-settings-billing",
    name: "Settings: billing",
    description: "Current plan and total, payment card with an update dialog, usage meters that warn near a limit, an invoices table and a change-plan dialog with monthly or yearly pricing.",
    uses: [settings, "badge", "button", "dialog", "field", "progress", "radio-group", "segmented-control", "table"],
    props: [
      { name: "plans", type: "BillingPlan[]", default: "samplePlans", description: "Plans offered in the change-plan dialog." },
      { name: "currentPlan", type: "string", default: '"growth"', description: "Id of the active plan." },
      { name: "seats", type: "number", default: "18", description: "Seats billed." },
      { name: "usage", type: "UsageMeter[]", default: "sampleUsage", description: "Meters for this cycle." },
      { name: "invoices", type: "Invoice[]", default: "sampleInvoices", description: "Rows of the invoices table." },
      linksProp,
    ],
  }),
  screen({
    slug: "screen-settings-api",
    name: "Settings: API and webhooks",
    description: "API keys with scopes and environments, a create dialog that shows the secret once with copy, revoke with confirmation, and webhook endpoints to add, test and pause.",
    uses: [settings, "alert", "badge", "button", "checkbox", "dialog", "field", "segmented-control", "select", "states", "switch", "table"],
    props: [
      { name: "apiKeys", type: "ApiKey[]", default: "sampleApiKeys", description: "Existing keys; only their prefix is shown." },
      { name: "webhooks", type: "Webhook[]", default: "sampleWebhooks", description: "Endpoints with their events and delivery rate." },
      linksProp,
    ],
  }),
  screen({
    slug: "screen-settings-connections",
    name: "Settings: connections",
    description: "Integration cards to connect (with a pending state) or disconnect (with confirmation), filtered by status and search.",
    uses: [settings, "badge", "button", "dialog", "search-input", "segmented-control", "states"],
    props: [
      { name: "integrations", type: "Integration[]", default: "sampleIntegrations", description: "Apps; `account` is set when connected." },
      { name: "onConnect", type: "(id: string) => void", description: "Called after an app connects." },
      { name: "onDisconnect", type: "(id: string) => void", description: "Called after an app disconnects." },
      linksProp,
    ],
  }),
  screen({
    slug: "screen-help-center",
    name: "Help center",
    description: "Support home: a search hero that filters articles as you type, topic cards, popular articles and a contact card with reply times.",
    uses: ["badge", "button", "search-input", "states", "page-header", "chip"],
    props: [
      { name: "categories", type: "HelpCategory[]", default: "sampleHelpCategories", description: "Topic cards." },
      { name: "articles", type: "HelpArticleSummary[]", default: "sampleHelpArticles", description: "Searchable articles; the first six are shown as popular." },
      { name: "articleHref", type: "(id: string) => string", description: "Link for an article." },
      { name: "categoryHref", type: "(id: string) => string", description: "Link for a topic." },
      { name: "contactHref", type: "string", default: '"#/app/help/contact"', description: "Where Contact support goes." },
    ],
  }),
  screen({
    slug: "screen-help-article",
    name: "Help article",
    description: "Article with breadcrumbs, author and read time, a table of contents that follows your scroll, related reading and a “Was this helpful?” prompt that asks what was missing.",
    uses: ["alert", "avatar", "button", "field", "kbd", "page-header"],
    props: [
      { name: "article", type: "HelpArticle", default: "sampleHelpArticle", description: "Title, summary, meta and sections with ids for the contents." },
      { name: "related", type: "{ id, title, href }[]", description: "Links under the article." },
      { name: "helpHref", type: "string", default: '"#/app/help"', description: "Target of the breadcrumbs." },
      { name: "onFeedback", type: "(helpful: boolean, comment?: string) => void", description: "Called when feedback is sent." },
    ],
  }),
  screen({
    slug: "screen-faq",
    name: "FAQ",
    description: "Questions in grouped accordions with a topic switch and a search that matches answers too, highlights hits and opens matching items.",
    uses: ["accordion", "button", "search-input", "segmented-control", "states", "page-header"],
    props: [
      { name: "groups", type: "FaqGroup[]", default: "sampleFaqGroups", description: "Topics with their questions and answers." },
      { name: "contactHref", type: "string", default: '"#/app/help/contact"', description: "Where Contact support goes." },
    ],
  }),
  screen({
    slug: "screen-search-results",
    name: "Search results",
    description: "Results across people, projects, files and messages: tabs with counts, highlighted matches, best-match or recent sorting, and empty states.",
    uses: ["avatar", "badge", "button", "search-input", "select", "states", "tabs", "page-header"],
    props: [
      { name: "results", type: "SearchResult[]", default: "sampleSearchResults", description: "Everything that can be found." },
      { name: "initialQuery", type: "string", default: '"invoice"', description: "Query the page opens with." },
    ],
  }),
  screen({
    slug: "screen-timeline",
    name: "Activity timeline",
    description: "Workspace activity grouped by day on a rail, with type and person filters, search, quoted details and a button to load older days.",
    uses: ["avatar", "button", "filter-bar", "multi-select", "search-input", "states", "page-header"],
    props: [
      { name: "events", type: "TimelineEvent[]", default: "sampleTimeline", description: "Events with a `day` heading each." },
      { name: "older", type: "TimelineEvent[]", default: "olderTimeline", description: "Shown by Load older activity; empty hides the button." },
    ],
  }),
];
