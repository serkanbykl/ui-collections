"use client";

import { Fragment, type ReactNode } from "react";

import { cn } from "@/registry/kit/lib/utils";
import { Button } from "@/registry/kit/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/registry/kit/ui/dropdown-menu";

export interface RowAction {
  /** Verb + object where it helps: "Move to Trash", "Copy link". */
  label: string;
  /** 24×24 stroke icon, or an SVG path string drawn as one. */
  icon?: ReactNode;
  onSelect: () => void;
  /** Red text, for steps that remove or delete. */
  destructive?: boolean;
  /** Draws a divider above this item, to group related actions. */
  separatorBefore?: boolean;
  disabled?: boolean;
  /** Key hint on the right, e.g. "F2". */
  shortcut?: string;
}

export interface RowActionsProps {
  actions: RowAction[];
  /** Accessible name of the trigger: "Actions for “Q3 report.pdf”". */
  label?: string;
  align?: "start" | "center" | "end";
  /** Replaces the ⋯ icon button. Must accept a ref (a Button or native element). */
  trigger?: ReactNode;
  /** Classes for the default ⋯ trigger, e.g. to reveal it on row hover. */
  triggerClassName?: string;
  onOpenChange?: (open: boolean) => void;
}

const iconFor = (icon: ReactNode) =>
  typeof icon === "string" ? (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={icon} />
    </svg>
  ) : (
    icon
  );

/**
 * The per-item “more” menu for rows, cards and detail panels. Pass the same
 * action list everywhere an item appears, so a file offers the same choices
 * in a grid, a table and its details sheet.
 */
export function RowActions({ actions, label = "More actions", align = "end", trigger, triggerClassName, onOpenChange }: RowActionsProps) {
  if (!actions.length) return null;
  return (
    <DropdownMenu modal={false} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>
        {trigger ?? (
          <Button size="icon-sm" variant="ghost" aria-label={label} title={label} className={cn("shrink-0", triggerClassName)}>
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <circle cx="5.5" cy="12" r="1.6" />
              <circle cx="12" cy="12" r="1.6" />
              <circle cx="18.5" cy="12" r="1.6" />
            </svg>
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="min-w-48">
        <RowActionItems actions={actions} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/** The menu items alone, for a menu you build yourself (a context menu, a split button). */
export function RowActionItems({ actions }: { actions: RowAction[] }) {
  return (
    <>
      {actions.map((action, i) => (
        <Fragment key={action.label}>
          {action.separatorBefore && i > 0 && <DropdownMenuSeparator />}
          <DropdownMenuItem variant={action.destructive ? "danger" : "default"} disabled={action.disabled} onSelect={action.onSelect}>
            {action.icon && iconFor(action.icon)}
            {action.label}
            {action.shortcut && <DropdownMenuShortcut>{action.shortcut}</DropdownMenuShortcut>}
          </DropdownMenuItem>
        </Fragment>
      ))}
    </>
  );
}
