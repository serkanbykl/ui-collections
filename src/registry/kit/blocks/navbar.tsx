import { cn } from "@/registry/kit/lib/utils";
import { BrandMark } from "@/registry/kit/ui/brand-mark";
import { AuroraBackdrop } from "@/registry/kit/ui/aurora-backdrop";
import { ButtonShine, buttonVariants } from "@/registry/kit/ui/button";
import { NotificationBell, type NotificationItem } from "@/registry/kit/ui/notification-bell";
import { SiteNav, type NavItem } from "@/registry/kit/ui/site-nav";

const defaultItems: NavItem[] = [
  { label: "Product", href: "#product" },
  { label: "Docs", href: "#docs" },
  { label: "Changelog", href: "#changelog" },
  { label: "Pricing", href: "#pricing" },
];

interface NavLink {
  label: string;
  href: string;
}

export interface NavbarProps {
  brand?: string;
  /** Brand mark beside the name. Defaults to a generic accent mark. */
  logo?: React.ReactNode;
  items?: NavItem[];
  activeHref?: string;
  /** Where the brand links to. */
  homeHref?: string;
  /** `null` hides it, e.g. for a signed-in visitor. */
  signIn?: NavLink | null;
  cta?: NavLink;
  /** Showcase backdrop (aurora, tall band). Turn off to use the bar inside a page. */
  backdrop?: boolean;
  /** Pin to the viewport and frost on scroll. */
  fixed?: boolean;
  /** Shows a bell with "3 new" for signed-in visitors, e.g. replies and release notes. */
  notifications?: NotificationItem[];
  /** "View all notifications" link at the foot of the bell. */
  notificationsHref?: string;
}

export function Navbar({
  brand = "lumen",
  logo,
  items = defaultItems,
  activeHref = "#product",
  homeHref = "/",
  signIn = { label: "Sign in", href: "/signin" },
  cta = { label: "Start free trial", href: "/signup" },
  backdrop = true,
  fixed = false,
  notifications,
  notificationsHref,
}: NavbarProps) {
  return (
    <div className={cn("relative isolate text-fg", backdrop && "min-h-72 overflow-hidden bg-bg-deep")}>
      {backdrop && <AuroraBackdrop />}
      <SiteNav
        fixed={fixed}
        activeHref={activeHref}
        items={items}
        utility={notifications && <NotificationBell variant="chip" items={notifications} viewAllHref={notificationsHref} />}
        brand={
          <a href={homeHref} className="flex items-center gap-2 font-display text-2xl tracking-tight">
            {logo ?? <BrandMark />}
            {brand}
          </a>
        }
        action={
          <div className="flex items-center gap-2">
            {signIn && (
              <a href={signIn.href} className={buttonVariants({ variant: "ghost", size: "sm" })}>
                {signIn.label}
              </a>
            )}
            <a href={cta.href} className={buttonVariants({ variant: "solid", size: "sm" })}>
              <ButtonShine />
              {cta.label}
            </a>
          </div>
        }
      />
    </div>
  );
}
