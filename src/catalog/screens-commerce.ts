import type { CatalogEntry } from "./types.ts";

const screen = (entry: Omit<CatalogEntry, "category" | "engine" | "files" | "previewHeight"> & { previewHeight?: number }): CatalogEntry => ({
  category: "screens",
  engine: "CSS",
  files: [`screens/${entry.slug}.tsx`],
  previewHeight: 860,
  ...entry,
  // AppShell hosts the toaster that screens report to.
  uses: [...(entry.uses ?? []), "toast"],
});

const tableParts = ["selection-bar", "data-table", "filter-bar", "search-input", "multi-select", "checkbox", "badge", "button"];

/** Commerce, billing and business dashboards. */
export const screensCommerce: CatalogEntry[] = [
  screen({
    slug: "screen-products",
    name: "Products",
    description: "Catalogue table with product tiles, stock warnings, status and category filters, bulk archive and CSV copy, column toggle and pagination.",
    uses: [...tableParts, "page-header", "chip"],
    props: [
      { name: "products", type: "Product[]", default: "sampleProducts", description: "Rows to show. Archiving updates a local copy." },
      { name: "newHref", type: "string", default: '"#/app/products/new"', description: "Where Add product goes." },
      { name: "detailHref", type: "string", description: "When set, product names link to `${detailHref}/${id}`." },
    ],
  }),
  screen({
    slug: "screen-product-detail",
    name: "Product detail",
    description: "One product: a photo gallery, colour and size pickers with per-variant stock, inventory by location with adjusters, and 30-day sales.",
    uses: ["badge", "button", "chart-sparkline", "progress", "stat-card", "page-header"],
    props: [
      { name: "product", type: "ProductDetail", default: "sampleProductDetail", description: "Gallery labels, variants, locations and daily sales." },
      { name: "editHref", type: "string", default: '"#/app/products/edit"', description: "Where Edit product goes." },
    ],
  }),
  screen({
    slug: "screen-product-form",
    name: "Product form",
    description: "Create or edit a product: details, a photo dropzone, pricing, status and category selects, inventory switches, inline validation and a saving state.",
    uses: ["field", "select", "switch", "button", "file-upload", "page-header", "chip"],
    props: [
      { name: "initialValues", type: "ProductFormValues", default: "sampleProductForm", description: "Starting values. Pass emptyProductForm for a new product." },
      { name: "onSave", type: "(values) => Promise<void> | void", description: "Called once the values pass validation. The button shows a spinner until it resolves." },
      { name: "cancelHref", type: "string", default: '"#/app/products"', description: "Where Cancel goes." },
    ],
  }),
  screen({
    slug: "screen-orders",
    name: "Orders",
    description: "Order list with fulfilment tabs and counts, a date range picker, search, a paid total for the view and bulk mark-as-fulfilled.",
    uses: ["data-table", "filter-bar", "search-input", "date-range-picker", "avatar", "checkbox", "badge", "button", "selection-bar", "page-header", "chip"],
    props: [
      { name: "orders", type: "Order[]", default: "sampleOrders", description: "Rows to show." },
      { name: "today", type: "Date", default: "Oct 24, 2026", description: "Anchors the date presets, so server and client agree." },
      { name: "detailHref", type: "string", description: "When set, order numbers link to `${detailHref}/${id}`." },
    ],
  }),
  screen({
    slug: "screen-order-detail",
    name: "Order detail",
    description: "One order: line items, payment totals, a timeline, the customer card, and fulfil and refund flows behind confirm dialogs.",
    uses: ["activity-list", "avatar", "badge", "button", "dialog", "field", "select", "page-header"],
    props: [{ name: "order", type: "OrderDetail", default: "sampleOrderDetail", description: "Lines, totals inputs, customer and timeline." }],
  }),
  screen({
    slug: "screen-customers",
    name: "Customers",
    description: "Customer list with KPI tiles, segment filter, search sorted by lifetime spend, and bulk copy of opted-in emails.",
    uses: [...tableParts, "avatar", "stat-card", "page-header"],
    props: [
      { name: "customers", type: "Customer[]", default: "sampleCustomers", description: "Rows to show." },
      { name: "detailHref", type: "string", default: '"#/app/customers"', description: "Names link to `${detailHref}/${id}`." },
    ],
  }),
  screen({
    slug: "screen-customer-detail",
    name: "Customer detail",
    description: "One customer: profile and tags, lifetime value tiles, spend by month, order history, marketing consent and team notes.",
    uses: ["avatar", "badge", "button", "chart-bar", "field", "stat-card", "table", "page-header"],
    props: [
      { name: "customer", type: "CustomerProfile", default: "sampleCustomerProfile", description: "Profile, orders, monthly spend and notes." },
      { name: "orderHref", type: "string", default: '"#/app/orders"', description: "Order numbers link to `${orderHref}/${id}`." },
    ],
  }),
  screen({
    slug: "screen-store",
    name: "Store",
    description: "Customer-facing storefront home or collection page: a seasonal banner, perks and collection tiles, search, category filter and sort, and a product grid with ratings, sale and sold-out badges, quick add to cart, and loading, error and no-results states.",
    uses: ["badge", "button", "search-input", "select", "skeleton", "states", "chip"],
    previewHeight: 1100,
    props: [
      { name: "addVariant", type: '"accent" | "solid" | "surface"', default: '"accent"', description: "Finish of the cards' Add to cart buttons; accent follows the theme's Accent setting." },
      { name: "products", type: "StoreProduct[]", default: "sampleStoreProducts", description: "Catalogue with variants, stock, ratings and reviews." },
      { name: "onAddToCart", type: "(line: StoreCartLine) => void", description: "Called with a line for the product's first available variant." },
      { name: "productHref", type: "(slug) => string", default: '(slug) => "#/store/p/" + slug', description: "Where a product card links." },
      { name: "collection", type: "StoreCollection", description: "Show one collection: its heading replaces the banner and only its products are listed." },
      { name: "collections / collectionHref", type: "StoreCollection[] / (slug) => string", description: "Collection tiles on the home page." },
      { name: "title / initialQuery", type: "string", description: "Heading and starting search for a search results page." },
      { name: "featuredSlug", type: "string", default: '"waxed-field-jacket"', description: "Product promoted in the banner." },
      { name: "status", type: '"ready" | "loading" | "error"', default: '"ready"', description: "Card skeletons while loading, a retry state on error." },
      { name: "onRetry", type: "() => void", description: "Try again in the error state." },
    ],
  }),
  screen({
    slug: "screen-store-product",
    name: "Store product",
    description: "Product page: gallery with four views, colour and size pickers with sold-out sizes, a quantity stepper, add to cart with a size check, details, reviews with a rating breakdown and related products.",
    uses: ["screen-store", "accordion", "badge", "breadcrumb", "button", "progress", "states", "image-carousel"],
    previewHeight: 1500,
    props: [
      { name: "product", type: "StoreProduct", default: "sampleStoreProducts[0]", description: "The product, its variants and reviews." },
      { name: "related", type: "StoreProduct[]", default: "sampleStoreProducts", description: "Pool for You might also like; same category first." },
      { name: "onAddToCart", type: "(line: StoreCartLine) => void", description: "Called with the chosen variant and quantity." },
      { name: "storeHref / cartHref", type: "string", description: "Breadcrumb and cart links." },
      { name: "productHref", type: "(slug) => string", description: "Links for related products." },
    ],
  }),
  screen({
    slug: "screen-store-cart",
    name: "Store cart",
    description: "Cart: line items with quantity steppers and undoable remove, a promo code with inline validation, a free-shipping meter, the order summary and an empty state.",
    uses: ["screen-store", "badge", "button", "field", "progress", "states", "stepper"],
    props: [
      { name: "lines", type: "StoreCartLine[]", default: "sampleStoreCart", description: "Cart lines. Kept locally when left out." },
      { name: "onLinesChange", type: "(lines) => void", description: "Called after a quantity change, remove or undo." },
      { name: "promoCode / onPromoCodeChange", type: "string | null", description: "The applied code; codes come from `promos`." },
      { name: "promos", type: "StorePromo[]", default: "sampleStorePromos", description: "Valid codes: AUTUMN15 (15% off) and FREESHIP." },
      { name: "storeHref / checkoutHref", type: "string", description: "Continue shopping and Go to checkout." },
    ],
    // Also exports StoreMiniCart, the compact cart for a drawer.
  }),
  screen({
    slug: "screen-store-checkout",
    name: "Store checkout",
    description: "Checkout in three steps (details, shipping, payment), each validated before moving on, with Back, kept values, a clickable stepper and an order summary that collapses on phones. Payment checks the card (Luhn, expiry, CVC), takes an optional billing address and shows paying and declined states.",
    uses: ["screen-store", "screen-store-cart", "screen-store-confirmation", "alert", "badge", "button", "dialog", "checkbox", "field", "radio-group", "select", "states", "stepper", "switch"],
    previewHeight: 1500,
    props: [
      { name: "lines", type: "StoreCartLine[]", default: "sampleStoreCart", description: "What is being bought." },
      { name: "promoCode", type: "string | null", description: "Applied code from the cart." },
      { name: "initialValues", type: "StoreCheckoutValues", default: "emptyStoreCheckout", description: "Starting form values." },
      { name: "onPlaceOrder", type: "(order: StoreOrder) => void", description: "Called once payment succeeds. Without it the confirmation shows in place." },
      { name: "today", type: "Date", default: "Oct 27, 2026", description: "Anchors expiry checks and delivery dates." },
      { name: "cartHref / storeHref", type: "string", description: "Back to cart and the empty-cart action." },
    ],
  }),
  screen({
    slug: "screen-store-confirmation",
    name: "Store order confirmation",
    description: "Order placed: the order number, what happens next, delivery and payment details, the items, totals and a printable receipt.",
    uses: ["screen-store", "screen-store-cart", "button", "stepper"],
    previewHeight: 1200,
    props: [
      { name: "order", type: "StoreOrder", default: "sampleStoreOrder", description: "Number, contact, address, method, payment, lines and totals." },
      { name: "storeHref", type: "string", default: '"#/store"', description: "Where Continue shopping goes." },
      { name: "productHref", type: "(slug) => string", description: "Links on the items." },
    ],
  }),
  screen({
    slug: "screen-invoices",
    name: "Invoices",
    description: "Invoice list with totals by status that double as filters, status chips, and per-row send, mark paid, remind and void actions.",
    uses: ["badge", "button", "dropdown-menu", "states", "table", "page-header", "chip"],
    props: [
      { name: "invoices", type: "Invoice[]", default: "sampleInvoices", description: "Rows to show." },
      { name: "previewHref", type: "string", default: '"#/app/invoices"', description: "Invoice numbers link to `${previewHref}/${id}`." },
      { name: "newHref", type: "string", default: '"#/app/invoices/new"', description: "Where New invoice goes." },
    ],
  }),
  screen({
    slug: "screen-invoice-preview",
    name: "Invoice preview",
    description: "A printable invoice sheet. The toolbar hides in print and the sheet turns plain black on white, so Print or save PDF gives a clean page.",
    uses: ["badge", "button", "page-header"],
    props: [
      { name: "invoice", type: "InvoiceDocument", default: "sampleInvoiceDocument", description: "Parties, lines, tax rate, notes and payment details." },
      { name: "editHref", type: "string", default: '"#/app/invoices/edit"', description: "Where Edit goes." },
    ],
  }),
  screen({
    slug: "screen-invoice-editor",
    name: "Invoice editor",
    description: "Build an invoice: add and remove line items, pick payment terms, set tax and a discount, with totals that update as you type.",
    uses: ["button", "field", "select", "page-header"],
    props: [
      { name: "initialDraft", type: "InvoiceDraft", default: "sampleInvoiceDraft", description: "Starting client, terms, lines, tax and notes." },
      { name: "onSend", type: "(draft, total) => Promise<void> | void", description: "Called on Send once the draft is valid." },
      { name: "previewHref", type: "string", default: '"#/app/invoices/preview"', description: "Where Preview goes." },
    ],
  }),
  screen({
    slug: "screen-dashboard-ecommerce",
    name: "E-commerce dashboard",
    description: "Store overview by period: revenue, orders, conversion and AOV tiles, revenue against the previous period, sales by channel, best sellers, recent orders and low stock.",
    uses: ["stat-card", "chart-area", "chart-donut", "progress-list", "segmented-control", "badge", "button", "page-header"],
    previewHeight: 980,
    props: [
      { name: "data", type: "EcommerceDashboardData", default: "sampleEcommerceData", description: "Series per period, channels, products, stock and orders." },
      { name: "defaultPeriod", type: '"7d" | "30d" | "90d"', default: '"30d"', description: "Period selected first." },
    ],
  }),
  screen({
    slug: "screen-dashboard-crm",
    name: "CRM dashboard",
    description: "Sales pipeline: pipeline and win-rate tiles, value by stage, won against target, open deals filtered by owner, tasks and recent activity.",
    uses: ["stat-card", "chart-bar", "activity-list", "avatar", "badge", "checkbox", "segmented-control", "table", "page-header"],
    previewHeight: 980,
    props: [{ name: "data", type: "CrmDashboardData", default: "sampleCrmData", description: "Deals, tasks, activity and monthly won revenue." }],
  }),
  screen({
    slug: "screen-dashboard-projects",
    name: "Projects dashboard",
    description: "Delivery overview: health tiles, a filterable project list with progress and team, hours by discipline, team workload and upcoming deadlines.",
    uses: ["stat-card", "chart-bar", "progress", "progress-list", "avatar", "badge", "segmented-control", "states", "page-header"],
    previewHeight: 980,
    props: [
      { name: "data", type: "ProjectsDashboardData", default: "sampleProjectsData", description: "Projects, weekly hours, workload and deadlines." },
      { name: "projectHref", type: "string", default: '"#/app/projects"', description: "Project names link to `${projectHref}/${id}`." },
    ],
  }),
];
