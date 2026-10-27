"use client";

import type { ElementType, ReactNode } from "react";

import { cn } from "@/registry/kit/lib/utils";
import { Avatar } from "@/registry/kit/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/registry/kit/ui/dropdown-menu";

export interface AccountMenuItem {
  label: string;
  /** Navigates here; otherwise `onSelect` runs. */
  href?: string;
  onSelect?: () => void;
  icon?: ReactNode;
  /** Draws a divider above the item, e.g. before "Sign out". */
  separated?: boolean;
  variant?: "default" | "danger";
}

export interface AccountMenuProps {
  name: string;
  email?: string;
  /** Image URL; initials otherwise. */
  avatar?: string;
  items: AccountMenuItem[];
  /** Router link component for item hrefs, e.g. Next's Link. Defaults to `a`. */
  linkAs?: ElementType;
  /** Classes for the initials fallback, e.g. a tinted gradient. */
  fallbackClassName?: string;
  className?: string;
}

/**
 * The signed-in person's avatar as a menu button: name and email at the top,
 * then account links such as profile, settings and sign out.
 */
export function AccountMenu({
  name,
  email,
  avatar,
  items,
  linkAs: Link = "a",
  fallbackClassName = "bg-accent/15 font-semibold text-accent",
  className,
}: AccountMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={`Account menu for ${name}`}
        className={cn(
          "cursor-pointer rounded-full outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
          className,
        )}
      >
        <Avatar src={avatar} alt="" fallback={initials(name)} fallbackClassName={fallbackClassName} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <div className="px-3 py-2">
          <p className="truncate text-sm font-medium text-fg">{name}</p>
          {email && <p className="truncate text-xs text-muted">{email}</p>}
        </div>
        <DropdownMenuSeparator />
        {items.map((item) => (
          <MenuEntry key={item.label} item={item} Link={Link} />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function MenuEntry({ item, Link }: { item: AccountMenuItem; Link: ElementType }) {
  return (
    <>
      {item.separated && <DropdownMenuSeparator />}
      {item.href ? (
        <DropdownMenuItem asChild variant={item.variant}>
          <Link href={item.href}>
            {item.icon}
            {item.label}
          </Link>
        </DropdownMenuItem>
      ) : (
        <DropdownMenuItem variant={item.variant} onSelect={item.onSelect}>
          {item.icon}
          {item.label}
        </DropdownMenuItem>
      )}
    </>
  );
}

const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
