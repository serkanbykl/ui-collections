"use client";

import { useEffect, useId, useState, type FormEvent, type ReactNode } from "react";

import { cn } from "@/registry/kit/lib/utils";
import { BrandMark } from "@/registry/kit/ui/brand-mark";
import { Button, buttonVariants } from "@/registry/kit/ui/button";
import { NotificationBell, type NotificationItem } from "@/registry/kit/ui/notification-bell";
import { Popover, PopoverContent, PopoverTrigger } from "@/registry/kit/ui/popover";
import { SearchInput } from "@/registry/kit/ui/search-input";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/registry/kit/ui/sheet";

export interface StoreMenuLink {
  label: string;
  href: string;
  /** Short detail on the right, such as a price. */
  meta?: string;
}

export interface StoreMenuItem {
  label: string;
  href: string;
  /** One line under the title in the mega-menu. */
  description?: string;
  /** With links, the item opens a mega-menu instead of navigating. */
  links?: StoreMenuLink[];
  /** A promoted tile in the mega-menu. */
  feature?: { title: string; description: string; href: string; art?: ReactNode };
  /** Shown in the danger tone, e.g. Sale. */
  highlight?: boolean;
}

export interface StoreHeaderProps {
  brand: { name: string; href: string; logo?: ReactNode };
  menu?: StoreMenuItem[];
  /** Marks the current menu item. */
  currentHref?: string;
  /** Called with the trimmed query from the search field. */
  onSearch?: (query: string) => void;
  account?: { label: string; href: string };
  /** Order updates in a bell beside the account link, e.g. shipped or back in stock. */
  notifications?: { items: NotificationItem[]; onItemsChange?: (items: NotificationItem[]) => void; viewAllHref?: string };
  cartCount?: number;
  /** Cart drawer content; the cart button opens it. Without it the button links to `cartHref`. */
  cart?: ReactNode;
  cartHref?: string;
  cartOpen?: boolean;
  onCartOpenChange?: (open: boolean) => void;
  /** A slim bar above the header, e.g. a store preview notice. */
  notice?: { message: ReactNode; link?: { label: string; href: string } };
  /** `checkout` keeps only the brand, a secure note and a way back. */
  variant?: "full" | "checkout";
  backLink?: { label: string; href: string };
  className?: string;
}

const line = (d: string, className = "size-5") => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d={d} />
  </svg>
);

const paths = {
  menu: "M4 7h16M4 12h16M4 17h10",
  bag: "M5 8h14l-1 12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1zM9 8V6a3 3 0 0 1 6 0v2",
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0",
  search: "M11 17.5a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13M20 20l-4-4",
  chevron: "m6 9 6 6 6-6",
  lock: "M7 11V8a5 5 0 0 1 10 0v3M5 11h14v10H5z",
  back: "M15 6l-6 6 6 6",
};

function SearchForm({ onSearch, className, autoFocus }: { onSearch?: (q: string) => void; className?: string; autoFocus?: boolean }) {
  const [query, setQuery] = useState("");
  function submit(event: FormEvent) {
    event.preventDefault();
    if (query.trim()) onSearch?.(query.trim());
  }
  return (
    <form role="search" onSubmit={submit} className={className}>
      <SearchInput label="Search products" value={query} onValueChange={setQuery} autoFocus={autoFocus} />
    </form>
  );
}

/** A mega-menu: the item's links on the left and a promoted tile on the right. */
function MegaMenu({ item, onNavigate }: { item: StoreMenuItem; onNavigate: () => void }) {
  return (
    <div className="grid gap-6 sm:grid-cols-[minmax(0,1fr)_minmax(0,15rem)]">
      <div className="min-w-0">
        <p className="text-base font-semibold">{item.label}</p>
        {item.description && <p className="mt-1 text-sm text-muted">{item.description}</p>}
        <ul className="mt-4 grid gap-0.5">
          {item.links!.map((link) => (
            <li key={link.href + link.label}>
              <a
                href={link.href}
                onClick={onNavigate}
                className="-mx-2 flex items-baseline justify-between gap-3 rounded-control px-2 py-2 text-sm transition-colors outline-none hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-accent"
              >
                <span className="min-w-0 truncate">{link.label}</span>
                {link.meta && <span className="shrink-0 text-xs text-muted tabular-nums">{link.meta}</span>}
              </a>
            </li>
          ))}
        </ul>
        <a href={item.href} onClick={onNavigate} className={buttonVariants({ variant: "surface", size: "sm", className: "mt-4" })}>
          Shop all {item.label.toLowerCase()}
        </a>
      </div>
      {item.feature && (
        <a
          href={item.feature.href}
          onClick={onNavigate}
          className="group/feature flex flex-col gap-3 rounded-card outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {item.feature.art}
          <span>
            <span className="block text-sm font-medium group-hover/feature:text-accent">{item.feature.title}</span>
            <span className="mt-0.5 block text-xs text-muted">{item.feature.description}</span>
          </span>
        </a>
      )}
    </div>
  );
}

/**
 * Storefront header: brand, a category menu with mega-menus on desktop and a
 * drawer on small screens, search, optional order updates, account, and a cart button with a live
 * count that opens a cart drawer. `variant="checkout"` strips it down.
 */
export function StoreHeader({
  brand,
  menu = [],
  currentHref,
  onSearch,
  account,
  notifications,
  cartCount = 0,
  cart,
  cartHref = "#cart",
  cartOpen: cartOpenProp,
  onCartOpenChange,
  notice,
  variant = "full",
  backLink,
  className,
}: StoreHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openItem, setOpenItem] = useState<string | null>(null);
  const [localCartOpen, setLocalCartOpen] = useState(false);
  const cartOpen = cartOpenProp ?? localCartOpen;
  const setCartOpen = (open: boolean) => {
    setLocalCartOpen(open);
    onCartOpenChange?.(open);
  };
  const cartTitleId = useId();

  // Close menus when the page changes.
  useEffect(() => {
    const close = () => {
      setOpenItem(null);
      setMenuOpen(false);
    };
    window.addEventListener("hashchange", close);
    return () => window.removeEventListener("hashchange", close);
  }, []);

  const brandLink = (
    <a
      href={brand.href}
      className="flex min-w-0 items-center gap-2.5 rounded-control text-base font-semibold md:text-lg tracking-tight outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
    >
      {brand.logo ?? <BrandMark />}
      <span className="truncate">{brand.name}</span>
    </a>
  );

  const cartLabel = `Cart, ${cartCount} ${cartCount === 1 ? "item" : "items"}`;
  const cartBadge = (
    <span
      aria-hidden
      className={cn(
        "absolute -top-1 -right-1 grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-[11px] font-semibold text-accent-fg tabular-nums transition-[scale] duration-300 ease-theme",
        cartCount === 0 && "scale-0",
      )}
    >
      {cartCount}
    </span>
  );

  return (
    <header className={cn("sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur-xl", className)}>
      <a
        href="#main"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("main")?.focus();
        }}
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-control focus:bg-accent focus:px-3 focus:py-2 focus:text-accent-fg"
      >
        Skip to content
      </a>
      {notice && (
        <div className="border-b border-line bg-bg-deep/60 px-4 py-2 text-center text-xs text-muted md:px-8">
          {notice.message}
          {notice.link && (
            <>
              {" "}
              <a href={notice.link.href} className="font-medium whitespace-nowrap text-fg underline-offset-4 hover:underline">
                {notice.link.label}
              </a>
            </>
          )}
        </div>
      )}

      {variant === "checkout" ? (
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 md:px-8">
          {brandLink}
          <span className="hidden items-center gap-1.5 text-sm text-muted sm:flex">
            {line(paths.lock, "size-4")}
            Secure checkout
          </span>
          {backLink && (
            <a href={backLink.href} className={buttonVariants({ variant: "ghost", size: "sm", className: "ml-auto" })}>
              {line(paths.back, "size-4")}
              {backLink.label}
            </a>
          )}
        </div>
      ) : (
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-2 px-4 md:gap-4 md:px-8">
          <Button variant="ghost" size="icon" aria-label="Open menu" className="-ml-2 size-10 lg:hidden" onClick={() => setMenuOpen(true)}>
            {line(paths.menu)}
          </Button>
          {brandLink}

          <nav aria-label="Shop" className="ml-4 hidden lg:block">
            <ul className="flex items-center gap-1">
              {menu.map((item) => {
                const current = currentHref === item.href;
                const triggerClass = cn(
                  "flex h-9 cursor-pointer items-center gap-1 rounded-control px-3 text-sm transition-colors outline-none hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-accent",
                  current ? "text-fg" : "text-fg/75 hover:text-fg",
                  item.highlight && "text-danger hover:text-danger",
                );
                return (
                  <li key={item.href}>
                    {item.links?.length ? (
                      <Popover open={openItem === item.href} onOpenChange={(open) => setOpenItem(open ? item.href : null)}>
                        <PopoverTrigger className={cn(triggerClass, current && "bg-surface-selected")}>
                          {item.label}
                          {line(paths.chevron, cn("size-3.5 opacity-60 transition-[rotate] duration-300", openItem === item.href && "rotate-180"))}
                        </PopoverTrigger>
                        <PopoverContent align="start" className="w-[min(40rem,calc(100vw-2rem))] p-6">
                          <MegaMenu item={item} onNavigate={() => setOpenItem(null)} />
                        </PopoverContent>
                      </Popover>
                    ) : (
                      <a href={item.href} aria-current={current ? "page" : undefined} className={cn(triggerClass, current && "bg-surface-selected")}>
                        {item.label}
                      </a>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-1 md:gap-2">
            <SearchForm onSearch={onSearch} className="hidden w-52 xl:block xl:w-64" />
            {/* The menu drawer opens on search, so phones with a bell drop this duplicate to keep the brand readable. */}
            <Button variant="ghost" size="icon" aria-label="Search" className={cn("size-10 xl:hidden", notifications && "hidden sm:inline-flex")} onClick={() => setMenuOpen(true)}>
              {line(paths.search)}
            </Button>
            {notifications && <NotificationBell items={notifications.items} onItemsChange={notifications.onItemsChange} viewAllHref={notifications.viewAllHref} />}
            {account && (
              <a href={account.href} aria-label={account.label} className={buttonVariants({ variant: "ghost", size: "icon", className: "hidden size-10 sm:inline-flex" })}>
                {line(paths.user)}
              </a>
            )}
            {cart ? (
              <Button variant="ghost" size="icon" aria-label={cartLabel} aria-haspopup="dialog" className="relative size-10 overflow-visible" onClick={() => setCartOpen(true)}>
                {line(paths.bag)}
                {cartBadge}
              </Button>
            ) : (
              <a href={cartHref} aria-label={cartLabel} className={buttonVariants({ variant: "ghost", size: "icon", className: "relative size-10 overflow-visible" })}>
                {line(paths.bag)}
                {cartBadge}
              </a>
            )}
          </div>
        </div>
      )}

      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="left" bodyClassName="grid content-start gap-6">
          <SheetTitle className="text-lg font-semibold">{brand.name}</SheetTitle>
          <SheetDescription className="sr-only">Search and shop by category</SheetDescription>
          <SearchForm onSearch={onSearch} autoFocus />
          <nav aria-label="Shop">
            <ul className="grid gap-4">
              {menu.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    aria-current={currentHref === item.href ? "page" : undefined}
                    className={cn(
                      "-mx-2 flex items-center justify-between rounded-control px-2 py-2 text-base font-medium outline-none hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-accent",
                      currentHref === item.href && "bg-surface-selected",
                      item.highlight && "text-danger",
                    )}
                  >
                    {item.label}
                  </a>
                  {item.links && item.links.length > 0 && (
                    <ul className="mt-1 ml-2 grid gap-0.5 border-l border-line pl-3">
                      {item.links.slice(0, 4).map((link) => (
                        <li key={link.href + link.label}>
                          <a href={link.href} className="block rounded-control py-1.5 text-sm text-muted outline-none hover:text-fg focus-visible:outline-2 focus-visible:outline-accent">
                            {link.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </nav>
          {account && (
            <a href={account.href} className={buttonVariants({ variant: "surface" })}>
              {line(paths.user, "size-4")}
              {account.label}
            </a>
          )}
        </SheetContent>
      </Sheet>

      {cart && (
        <Sheet open={cartOpen} onOpenChange={setCartOpen}>
          <SheetContent side="right" aria-labelledby={cartTitleId} bodyClassName="flex flex-col p-0 md:p-0">
            <SheetTitle id={cartTitleId} className="px-6 pt-6 pr-14 text-lg font-semibold">
              Your cart{cartCount > 0 ? ` · ${cartCount}` : ""}
            </SheetTitle>
            <SheetDescription className="sr-only">Items in your cart and the way to checkout</SheetDescription>
            {cart}
          </SheetContent>
        </Sheet>
      )}
    </header>
  );
}
