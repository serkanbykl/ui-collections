import { BrandMark } from "@/registry/kit/ui/brand-mark";

const defaultLinks = [
  { label: "Docs", href: "/docs" },
  { label: "Pricing", href: "/pricing" },
  { label: "Blog", href: "/blog" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];

export function FooterMinimal({
  brand = "lumen",
  logo,
  links = defaultLinks,
  year = 2026,
  homeHref = "/",
}: {
  brand?: string;
  /** Brand mark beside the name. Defaults to a generic accent mark. */
  logo?: React.ReactNode;
  links?: { label: string; href: string }[];
  year?: number;
  /** Where the brand links to. */
  homeHref?: string;
}) {
  return (
    <footer className="bg-bg px-6 py-10 text-fg md:px-8">
      <div className="surface mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 rounded-card px-6 py-6 md:flex-row md:px-8">
        <a href={homeHref} className="flex items-center gap-2 font-display text-2xl tracking-tight">
          {logo ?? <BrandMark size="sm" />}
          {brand}
        </a>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
            {links.map((link) => (
              <li key={link.label}>
                <a href={link.href} className="text-muted transition-colors hover:text-fg">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <p className="text-xs text-muted">
          © {year} {brand}
        </p>
      </div>
    </footer>
  );
}
