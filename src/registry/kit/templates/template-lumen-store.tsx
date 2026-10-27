"use client";

import { useSyncExternalStore, type ReactNode } from "react";

import { Faq, type FaqItem } from "@/registry/kit/blocks/faq";
import { StoreFooter, type StoreFooterColumn } from "@/registry/kit/blocks/store-footer";
import { StoreHeader, type StoreMenuItem } from "@/registry/kit/blocks/store-header";
import {
  addStoreLine,
  formatUsd,
  sampleStoreCollections,
  sampleStoreProducts,
  storeItemCount,
  StoreProductArt,
  StoreScreen,
  type StoreCartLine,
} from "@/registry/kit/screens/screen-store";
import { sampleStoreCart, StoreCartScreen, StoreMiniCart } from "@/registry/kit/screens/screen-store-cart";
import { StoreCheckoutScreen } from "@/registry/kit/screens/screen-store-checkout";
import { sampleStoreOrder, StoreConfirmationScreen, type StoreOrder } from "@/registry/kit/screens/screen-store-confirmation";
import { StoreProductScreen } from "@/registry/kit/screens/screen-store-product";
import { AuroraBackdrop } from "@/registry/kit/ui/aurora-backdrop";
import { BrandMark } from "@/registry/kit/ui/brand-mark";
import type { NotificationItem } from "@/registry/kit/ui/notification-bell";
import { buttonVariants } from "@/registry/kit/ui/button";
import { EmptyState } from "@/registry/kit/ui/states";

/*
 * Lumen's public storefront, "Northwind Supply": what shoppers see, with its
 * own header, cart drawer and footer and no admin chrome. The admin's Store
 * menu item opens it, like "View store" in a commerce admin.
 */

const href = (route: string) => `#${route}`;
const go = (route: string) => {
  window.location.hash = route;
};

/* ------------------------------------------------------------------ cart */

// One cart for the whole template: the storefront writes it, the cart drawer,
// cart and checkout read it, and the admin's Store menu item shows its count.
type CartState = { lines: StoreCartLine[]; promo: string | null; order: StoreOrder | null; drawer: boolean };

const initialCart: CartState = { lines: sampleStoreCart, promo: null, order: null, drawer: false };
let cart = initialCart;
const cartListeners = new Set<() => void>();

const cartStore = {
  subscribe(listener: () => void) {
    cartListeners.add(listener);
    return () => {
      cartListeners.delete(listener);
    };
  },
  get: () => cart,
  set(next: Partial<CartState>) {
    cart = { ...cart, ...next };
    cartListeners.forEach((l) => l());
  },
};

export function useLumenCart() {
  return useSyncExternalStore(cartStore.subscribe, cartStore.get, () => initialCart);
}

/* ---------------------------------------------------------------- chrome */

export const storeHome = "/store";
const storeHref = href(storeHome);
const cartHref = href("/store/cart");
const checkoutHref = href("/store/checkout");
const productHref = (slug: string) => href(`/store/p/${slug}`);
const collectionHref = (slug: string) => href(`/store/c/${slug}`);
const brand = {
  name: "Northwind Supply",
  href: storeHref,
  logo: (
    <BrandMark>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M12 3v18M12 3l-5 6M12 3l5 6M6 15h12" />
      </svg>
    </BrandMark>
  ),
};

// Order updates in the header bell. Read state lives here so it survives page changes.
let orderUpdates: NotificationItem[] = [
  {
    id: "shipped",
    title: `Order ${sampleStoreOrder.number} has shipped`,
    detail: "DHL Express · arrives Thursday, Oct 29",
    time: "35 min ago",
    tone: "success",
    href: href("/store/confirmation"),
  },
  {
    id: "restock",
    title: "Trail runner, slate is back in stock",
    detail: "Your size, EU 42, is available again",
    time: "Yesterday",
    tone: "info",
    href: productHref("trail-runner-slate"),
  },
  { id: "repair", title: "Your repair is on its way back", detail: "Waxed field jacket · new zip fitted", time: "Oct 22", read: true, href: href("/store/help") },
];

const byRank = (a: { rank: number }, b: { rank: number }) => a.rank - b.rank;

const menu: StoreMenuItem[] = sampleStoreCollections.map((c) => {
  const picks = sampleStoreProducts.filter(c.match).sort(byRank);
  const feature = picks.find((p) => p.stock > 0) ?? picks[0];
  return {
    label: c.label,
    href: collectionHref(c.slug),
    description: c.description,
    highlight: c.highlight,
    links: c.highlight ? undefined : picks.slice(0, 5).map((p) => ({ label: p.name, href: productHref(p.slug), meta: formatUsd(p.price) })),
    feature: feature && {
      title: feature.name,
      description: feature.summary,
      href: productHref(feature.slug),
      art: <StoreProductArt kind={feature.kind} tone={feature.tone} className="aspect-[4/3]" />,
    },
  };
});

const footerColumns: StoreFooterColumn[] = [
  { title: "Shop", links: sampleStoreCollections.map((c) => ({ label: c.label, href: collectionHref(c.slug) })) },
  {
    title: "Help",
    links: [
      { label: "Help and FAQ", href: href("/store/help") },
      { label: "Shipping and returns", href: href("/store/help") },
      { label: "Your cart", href: cartHref },
      { label: "Email us", href: "mailto:help@northwind.example" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Sign in", href: href("/signin") },
      { label: "Create an account", href: href("/signup") },
      { label: "Store admin", href: href("/app/products") },
    ],
  },
];

const addToCart = (line: StoreCartLine) => cartStore.set({ lines: addStoreLine(cartStore.get().lines, line) });

function StoreLayout({ current, checkout = false, children }: { current?: string; checkout?: boolean; children: ReactNode }) {
  const { lines, promo, drawer } = useLumenCart();
  return (
    <div className="relative isolate flex min-h-dvh flex-col bg-bg text-fg">
      {/* The same page backdrop as the app and marketing site; the theme's --aurora-strength sets it. */}
      <AuroraBackdrop grid={false} className="fixed print:hidden" />
      <StoreHeader
        brand={brand}
        menu={menu}
        currentHref={current}
        variant={checkout ? "checkout" : "full"}
        backLink={{ label: "Back to cart", href: cartHref }}
        notice={{ message: "You're previewing Northwind Supply as a shopper.", link: { label: "Back to admin", href: href("/app/products") } }}
        onSearch={(q) => go(`/store/search?q=${encodeURIComponent(q)}`)}
        account={{ label: "Sign in", href: href("/signin") }}
        notifications={{
          items: orderUpdates,
          onItemsChange: (next) => {
            orderUpdates = next;
          },
        }}
        cartCount={storeItemCount(lines)}
        cartOpen={drawer}
        onCartOpenChange={(open) => cartStore.set({ drawer: open })}
        cart={
          <StoreMiniCart
            lines={lines}
            promoCode={promo}
            onLinesChange={(next) => cartStore.set({ lines: next })}
            cartHref={cartHref}
            checkoutHref={checkoutHref}
            storeHref={storeHref}
            productHref={productHref}
            onNavigate={() => cartStore.set({ drawer: false })}
          />
        }
      />
      <main id="main" tabIndex={-1} className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 outline-none md:px-8 md:py-12">
        {children}
      </main>
      {!checkout && (
        <StoreFooter
          brand={brand}
          tagline="Clothing and goods made to be worn for a decade, then mended. Sewn in Portugal, shipped from Lisbon."
          columns={footerColumns}
          legal={[
            { label: "Privacy", href: href("/privacy") },
            { label: "Terms", href: href("/terms") },
          ]}
        />
      )}
    </div>
  );
}

/* ---------------------------------------------------------------- routes */

const lastSegment = (route: string) => route.split("/").pop() ?? "";

const subscribeHash = (listener: () => void) => {
  window.addEventListener("hashchange", listener);
  return () => window.removeEventListener("hashchange", listener);
};

function SearchPage() {
  const hash = useSyncExternalStore(subscribeHash, () => window.location.hash, () => "");
  const q = new URLSearchParams(hash.split("?")[1] ?? "").get("q") ?? "";
  return <StoreScreen key={q} title={q ? `Results for "${q}"` : "Search"} initialQuery={q} onAddToCart={addToCart} productHref={productHref} />;
}

function NotFound({ what }: { what: string }) {
  return (
    <div className="surface rounded-card">
      <h1 className="sr-only">{what} not found</h1>
      <EmptyState
        title={`We couldn't find that ${what.toLowerCase()}`}
        description="It may have been renamed or retired. Everything we sell right now is in the store."
        action={
          <a href={storeHref} className={buttonVariants({ variant: "accent" })}>
            Browse the store
          </a>
        }
      />
    </div>
  );
}

function CollectionPage({ route }: { route: string }) {
  const collection = sampleStoreCollections.find((c) => c.slug === lastSegment(route));
  if (!collection) return <NotFound what="Collection" />;
  return <StoreScreen key={collection.slug} collection={collection} onAddToCart={addToCart} productHref={productHref} />;
}

function ProductPage({ route }: { route: string }) {
  const product = sampleStoreProducts.find((p) => p.slug === lastSegment(route));
  if (!product) return <NotFound what="Product" />;
  return (
    <StoreProductScreen
      key={product.slug}
      product={product}
      onAddToCart={(line) => {
        addToCart(line);
        cartStore.set({ drawer: true });
      }}
      storeHref={storeHref}
      cartHref={cartHref}
      productHref={productHref}
    />
  );
}

function CartPage() {
  const { lines, promo } = useLumenCart();
  return (
    <StoreCartScreen
      lines={lines}
      onLinesChange={(next) => cartStore.set({ lines: next })}
      promoCode={promo}
      onPromoCodeChange={(code) => cartStore.set({ promo: code })}
      storeHref={storeHref}
      checkoutHref={checkoutHref}
      productHref={productHref}
    />
  );
}

function CheckoutPage() {
  const { lines, promo } = useLumenCart();
  return (
    <StoreCheckoutScreen
      lines={lines}
      promoCode={promo}
      cartHref={cartHref}
      storeHref={storeHref}
      onPlaceOrder={(order) => {
        cartStore.set({ order, lines: [], promo: null });
        go("/store/confirmation");
      }}
    />
  );
}

function ConfirmationPage() {
  const { order } = useLumenCart();
  return <StoreConfirmationScreen order={order ?? undefined} storeHref={storeHref} productHref={productHref} />;
}

const helpItems: FaqItem[] = [
  { question: "How long does delivery take?", answer: "Standard shipping takes 3–5 business days and is free on orders over $150. Express arrives in 1–2 business days for $18, and next-day delivery costs $29 if you order by 2 pm." },
  { question: "How do I return something?", answer: "Returns are free within 30 days of delivery. Use the return link in your shipping email to print a label, and we refund your card within 3 business days of the parcel reaching Lisbon." },
  { question: "Can I exchange for another size?", answer: "Yes. Start a return and choose Exchange; we ship the new size as soon as the courier scans your parcel, so you're not without it for long." },
  { question: "What does repairs for life cover?", answer: "Split seams, broken zips, worn elbows and lost buttons on anything we make. Send it back with the repair form and we mend it free; you only pay postage one way." },
  { question: "Which payment methods do you take?", answer: "Visa, Mastercard, American Express, Apple Pay and PayPal. Prices are in US dollars and include duties, so nothing extra is due on delivery." },
  { question: "How do I find my size?", answer: "Each product page lists the fit. Our shirts run relaxed, so most people size down for a closer cut. Denim shrinks about 3% on the first wash and the size labels allow for it." },
  { question: "Can I change or cancel my order?", answer: "Reply to your confirmation email within an hour of ordering and we'll change or cancel it. After that it's usually packed, and a free return is quicker." },
];

export interface StoreRoute {
  path: string;
  title: string;
  sample?: string;
  render: (route: string) => ReactNode;
}

/** Every storefront route, each in its own store chrome. */
export const storeRoutes: StoreRoute[] = [
  {
    path: "/store",
    title: "Storefront",
    render: () => (
      <StoreLayout current={storeHref}>
        <StoreScreen onAddToCart={addToCart} productHref={productHref} collections={sampleStoreCollections} collectionHref={collectionHref} />
      </StoreLayout>
    ),
  },
  {
    path: "/store/c/:slug",
    title: "Collection",
    sample: "/store/c/men",
    render: (route) => (
      <StoreLayout current={href(route)}>
        <CollectionPage route={route} />
      </StoreLayout>
    ),
  },
  {
    path: "/store/p/:slug",
    title: "Product",
    sample: `/store/p/${sampleStoreProducts[0]!.slug}`,
    render: (route) => (
      <StoreLayout>
        <ProductPage route={route} />
      </StoreLayout>
    ),
  },
  {
    path: "/store/search",
    title: "Search results",
    sample: "/store/search?q=merino",
    render: () => (
      <StoreLayout>
        <SearchPage />
      </StoreLayout>
    ),
  },
  {
    path: "/store/cart",
    title: "Cart",
    render: () => (
      <StoreLayout>
        <CartPage />
      </StoreLayout>
    ),
  },
  {
    path: "/store/checkout",
    title: "Checkout",
    render: () => (
      <StoreLayout checkout>
        <CheckoutPage />
      </StoreLayout>
    ),
  },
  {
    path: "/store/confirmation",
    title: "Order confirmation",
    render: () => (
      <StoreLayout>
        <ConfirmationPage />
      </StoreLayout>
    ),
  },
  {
    path: "/store/help",
    title: "Help and FAQ",
    render: () => (
      <StoreLayout>
        <Faq
          headingLevel="h1"
          title="Help and FAQ"
          description="Shipping, returns, sizing and repairs. A person on our Lisbon team replies to email within one working day."
          items={helpItems}
          contact={{ label: "Email help@northwind.example", href: "mailto:help@northwind.example" }}
        />
      </StoreLayout>
    ),
  },
];
