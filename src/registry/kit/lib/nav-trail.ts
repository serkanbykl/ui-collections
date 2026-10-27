import type { BreadcrumbItem } from "@/registry/kit/ui/breadcrumb";
import type { SidebarGroup } from "@/registry/kit/ui/sidebar-nav";

type NavLink = { label: string; href: string; children?: NavLink[] };

const flatten = (links: NavLink[]): NavLink[] => links.flatMap((link) => [link, ...flatten(link.children ?? [])]);

/** Every link in the menu, sub-links included, in menu order. */
export const navLinks = (nav: SidebarGroup[]) => flatten(nav.flatMap((g) => g.items));

/**
 * Home › Group › Item (› Sub-item) › Title, read from a sidebar menu. The first
 * item of the first group is Home. Empty when the page isn't in the menu.
 */
export function navTrail(nav: SidebarGroup[], current: string, title?: string): BreadcrumbItem[] {
  const home = nav[0]?.items[0];
  for (const group of nav) {
    for (const item of group.items) {
      const child = item.children?.find((c) => c.href === current);
      if (item.href !== current && !child) continue;
      const path: NavLink[] = child ? [item, child] : [item];
      const crumbs: BreadcrumbItem[] = [{ label: "Home", href: home?.href }];
      // Skip a group named like its own item ("Users › Users").
      if (group.label && group.label.toLowerCase() !== item.label.toLowerCase()) crumbs.push({ label: group.label });
      path.forEach((link) => crumbs.push({ label: link.label, href: link.href }));
      // A page reached from its list (a detail view) adds its own title, unless
      // it only restates the menu label ("General" → "General settings").
      const label = path.at(-1)!.label.toLowerCase();
      const own = title?.toLowerCase();
      if (title && own !== label && !own!.includes(label) && !label.includes(own!)) crumbs.push({ label: title });
      const last = crumbs.at(-1)!;
      crumbs[crumbs.length - 1] = { label: last.label };
      return crumbs;
    }
  }
  return [];
}
