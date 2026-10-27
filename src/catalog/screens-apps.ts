import type { CatalogEntry } from "./types.ts";

const screen = (slug: string, entry: Omit<CatalogEntry, "slug" | "category" | "engine" | "files">): CatalogEntry => ({
  slug: `screen-${slug}`,
  category: "screens",
  engine: "CSS",
  files: [`screens/screen-${slug}.tsx`],
  previewHeight: 820,
  ...entry,
  // AppShell hosts the toaster that screens report to; every app opens with a PageHeader.
  uses: [...(entry.uses ?? []), "toast", "page-header"],
});

export const screensApps: CatalogEntry[] = [
  screen("mail", {
    name: "Mail",
    description: "Inbox with folders, unread counts, search, a reading pane and a compose sheet with address validation.",
    uses: ["avatar", "badge", "button", "field", "search-input", "select", "sheet", "states"],
    dependencies: ["radix-ui"],
    props: [
      { name: "messages", type: "MailMessage[]", default: "defaultMessages", description: "Messages across inbox, sent, drafts, archive and trash." },
      { name: "me", type: "{ name: string; email: string }", description: "Sender used for new messages." },
    ],
  }),
  screen("chat", {
    name: "Chat",
    description: "Conversation list with unread and online state, a message thread, typing indicator and an Enter-to-send composer.",
    uses: ["avatar", "badge", "button", "search-input", "states"],
    props: [
      { name: "conversations", type: "ChatConversation[]", default: "defaultConversations", description: "Contacts, their messages and canned replies." },
      { name: "replyDelay", type: "number", default: "1600", description: "How long the typing indicator shows before a reply, in ms." },
    ],
  }),
  screen("calendar", {
    name: "Calendar",
    description: "Month and week views built from scratch, with colour-coded calendars and a sheet to create, edit and delete events.",
    uses: ["button", "confirm-dialog", "field", "segmented-control", "select", "sheet"],
    dependencies: ["radix-ui"],
    props: [
      { name: "events", type: "CalendarEvent[]", default: "defaultEvents", description: "Events with YYYY-MM-DD dates and HH:MM times." },
      { name: "calendars", type: "CalendarSource[]", default: "defaultCalendars", description: "Calendars and their tones." },
      { name: "today", type: "string", default: '"2026-10-26"', description: "Today's date; passed in so server and client match." },
      { name: "defaultView", type: '"month" | "week"', default: '"month"', description: "View shown first." },
    ],
  }),
  screen("kanban", {
    name: "Kanban board",
    description: "Columns with WIP limits and cards with labels, assignees and due dates, filtered by label chips. Move cards by drag, menu or arrow keys.",
    uses: ["avatar", "badge", "button", "chip", "dropdown-menu"],
    dependencies: ["radix-ui"],
    props: [
      { name: "columns", type: "KanbanColumn[]", default: "defaultColumns", description: "Columns in order, with optional WIP limits." },
      { name: "cards", type: "KanbanCard[]", default: "defaultCards", description: "Cards and the column each sits in." },
      { name: "today", type: "string", default: '"2026-10-26"', description: "Used to mark overdue cards." },
      { name: "keyPrefix", type: "string", default: '"LUM"', description: "Prefix for new card ids." },
    ],
  }),
  screen("tasks", {
    name: "Tasks",
    description: "To-do list with status and priority filters, due and overdue labels, complete with undo, and a progress summary.",
    uses: ["badge", "button", "checkbox", "chip", "field", "progress", "search-input", "segmented-control", "select", "states"],
    dependencies: ["radix-ui"],
    props: [
      { name: "tasks", type: "Task[]", default: "defaultTasks", description: "Tasks with priority, due date and done state." },
      { name: "today", type: "string", default: '"2026-10-26"', description: "Used for due today and overdue labels." },
    ],
  }),
  screen("notes", {
    name: "Notes",
    description: "Searchable notes list with pinning, an editor that saves as you type, word count and delete confirmation.",
    uses: ["button", "dialog", "search-input", "states"],
    dependencies: ["radix-ui"],
    props: [{ name: "notes", type: "Note[]", default: "defaultNotes", description: "Notes shown in the list; pinned ones sort first." }],
  }),
  screen("file-manager", {
    name: "File manager",
    description: "Folders with sections (all, recent, starred, shared, trash), grid and list layouts, selection with bulk actions, new folder and rename with validation, move by folder picker or drag and drop, type filters, keyboard shortcuts, storage breakdown, uploads and a details sheet with a generated preview.",
    uses: ["badge", "breadcrumb", "button", "checkbox", "confirm-dialog", "file-upload", "folder-picker-dialog", "kbd", "multi-select", "name-dialog", "page-header", "progress", "row-actions", "search-input", "segmented-control", "select", "selection-bar", "sheet", "states", "switch", "table", "toast"],
    dependencies: ["radix-ui"],
    props: [
      { name: "files", type: "FileItem[]", default: "defaultFiles", description: "Files and folders linked by parent id." },
      { name: "quota", type: "number", default: "2 GB", description: "Storage quota in bytes." },
      { name: "rootName", type: "string", default: '"All files"', description: "Label of the root breadcrumb." },
      { name: "me", type: "string", default: '"Ada Kaya"', description: "Owner stamped on uploads and new folders." },
      { name: "today", type: "string", default: '"2026-10-27"', description: "\"Now\" for relative dates and the Recent section (last 14 days)." },
    ],
  }),
  screen("contacts", {
    name: "Contacts",
    description: "A–Z grouped, searchable contact list with favourites, a detail pane with copy actions and activity, and an add-contact sheet.",
    uses: ["avatar", "badge", "button", "field", "search-input", "sheet", "states"],
    dependencies: ["radix-ui"],
    props: [{ name: "contacts", type: "Contact[]", default: "defaultContacts", description: "People shown in the A–Z list." }],
  }),
];
