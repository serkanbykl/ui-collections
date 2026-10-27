import { BrandMark } from "@/registry/kit/ui/brand-mark";
import { buttonVariants } from "@/registry/kit/ui/button";
export interface FooterColumn {
  title: string;
  links: { label: string; href: string }[];
}

const link = (label: string, href: string) => ({ label, href });

const defaultColumns: FooterColumn[] = [
  { title: "Product", links: [link("Deploys", "/deploys"), link("Previews", "/previews"), link("Edge network", "/edge"), link("Pricing", "/pricing"), link("Changelog", "/changelog")] },
  { title: "Developers", links: [link("Documentation", "/docs"), link("API reference", "/docs/api"), link("CLI", "/docs/cli"), link("Status", "/status")] },
  { title: "Company", links: [link("About", "/about"), link("Blog", "/blog"), link("Careers", "/careers"), link("Contact", "/contact")] },
  { title: "Legal", links: [link("Privacy", "/privacy"), link("Terms", "/terms"), link("Security", "/security"), link("DPA", "/legal/dpa")] },
];

export interface FooterSocial {
  label: string;
  href: string;
  /** SVG path in a 24×24 box. */
  path: string;
  /** Draw the path filled instead of stroked. */
  filled?: boolean;
}

const defaultSocials: FooterSocial[] = [
  { label: "GitHub", href: "https://github.com", filled: true, path: "M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.3-3.4-1.3-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.6 2.4 1.1 3 .9.1-.7.4-1.1.6-1.4-2.2-.2-4.6-1.1-4.6-5a3.9 3.9 0 0 1 1-2.7 3.6 3.6 0 0 1 .1-2.7s.8-.3 2.8 1a9.6 9.6 0 0 1 5 0c1.9-1.3 2.8-1 2.8-1 .5 1.4.2 2.4.1 2.7a3.9 3.9 0 0 1 1 2.7c0 3.9-2.3 4.7-4.6 5 .4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5A10 10 0 0 0 12 2Z" },
  { label: "X", href: "https://x.com", path: "M4 4l16 16M20 4 4 20" },
  { label: "RSS feed", href: "/rss.xml", path: "M5 5a14 14 0 0 1 14 14M5 11a8 8 0 0 1 8 8M6 18h.01" },
];

export function FooterColumns({
  brand = "lumen",
  logo,
  tagline = "Calm infrastructure for teams that ship.",
  columns = defaultColumns,
  year = 2026,
  homeHref = "/",
  socials = defaultSocials,
}: {
  brand?: string;
  /** Brand mark beside the name. Defaults to a generic accent mark. */
  logo?: React.ReactNode;
  tagline?: string;
  columns?: FooterColumn[];
  year?: number;
  /** Where the brand links to. */
  homeHref?: string;
  /** Icon links under the tagline. */
  socials?: FooterSocial[];
}) {
  return (
    <footer className="bg-bg-deep px-6 pt-20 pb-10 text-fg md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,3fr)]">
          <div>
            <a href={homeHref} className="flex items-center gap-2 font-display text-3xl tracking-tight">
              {logo ?? <BrandMark size="lg" />}
              {brand}
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">{tagline}</p>
            <div className="mt-6 flex gap-2">
              {socials.map((s) => (
                <a key={s.label} href={s.href} aria-label={s.label} className={buttonVariants({ variant: "surface", size: "icon", className: "size-10 rounded-full text-fg/80" })}>
                  <svg viewBox="0 0 24 24" className="size-4" fill={s.filled ? "currentColor" : "none"} stroke={s.filled ? "none" : "currentColor"} strokeWidth="1.8" strokeLinecap="round" aria-hidden>
                    <path d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
          <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {columns.map((col) => (
              <div key={col.title}>
                <h3 className="text-xs tracking-[0.2em] text-muted uppercase">{col.title}</h3>
                <ul className="mt-4 grid gap-2.5 text-sm">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <a href={link.href} className="text-fg/75 transition-colors hover:text-fg">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
        <div className="hairline mt-16 mb-6" />
        <div className="flex flex-col justify-between gap-3 text-xs text-muted sm:flex-row">
          <p>
            © {year} {brand}. All rights reserved.
          </p>
          <p className="flex items-center gap-2">
            <span aria-hidden className="size-1.5 rounded-full bg-accent" />
            All systems normal
          </p>
        </div>
      </div>
    </footer>
  );
}
