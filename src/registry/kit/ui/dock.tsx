"use client";

import { m, useMotionValue, useSpring, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";

import { MotionScope } from "@/registry/kit/lib/motion";
import { cn } from "@/registry/kit/lib/utils";

export interface DockItem {
  label: string;
  icon: React.ReactNode;
  href?: string;
  onClick?: () => void;
  /** Shows a small dot under the icon. */
  active?: boolean;
}

export interface DockProps {
  items: DockItem[];
  /** Resting icon size in px. */
  size?: number;
  /** Size of the icon directly under the pointer, in px. */
  magnification?: number;
  /** How far, in px, the swell reaches either side of the pointer. */
  distance?: number;
  className?: string;
}

const spring = { mass: 0.15, stiffness: 170, damping: 17 };

function DockIcon({
  item,
  pointerX,
  size,
  magnification,
  distance,
}: {
  item: DockItem;
  pointerX: MotionValue<number>;
  size: number;
  magnification: number;
  distance: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const offset = useTransform(pointerX, (x) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect || !Number.isFinite(x)) return distance;
    return x - rect.left - rect.width / 2;
  });
  const target = useTransform(offset, [-distance, 0, distance], [size, magnification, size]);
  const extent = useSpring(target, spring);

  const inner = (
    <>
      <span aria-hidden className="grid size-[46%] place-items-center [&>svg]:size-full">
        {item.icon}
      </span>
      <span className="sr-only">{item.label}</span>
    </>
  );
  const control =
    "surface grid size-full place-items-center rounded-field text-fg outline-none focus-visible:ring-2 focus-visible:ring-accent/70";

  return (
    <li className="group/dock relative flex flex-col items-center">
      <span
        aria-hidden
        className="surface-raised pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 translate-y-1 rounded-control px-2.5 py-1 text-xs whitespace-nowrap opacity-0 transition-[opacity,translate] duration-300 ease-theme group-focus-within/dock:translate-y-0 group-focus-within/dock:opacity-100 group-hover/dock:translate-y-0 group-hover/dock:opacity-100"
      >
        {item.label}
      </span>
      <m.div ref={ref} style={{ width: extent, height: extent }}>
        {item.href ? (
          <a href={item.href} className={control} aria-current={item.active ? "page" : undefined}>
            {inner}
          </a>
        ) : (
          <button
            type="button"
            onClick={item.onClick}
            aria-current={item.active ? "page" : undefined}
            className={cn(control, "cursor-pointer")}
          >
            {inner}
          </button>
        )}
      </m.div>
      <span
        aria-hidden
        className={cn("absolute -bottom-2 size-1 rounded-full bg-fg/80 transition-opacity", item.active ? "opacity-100" : "opacity-0")}
      />
    </li>
  );
}

/**
 * A surface dock whose icons swell as the mouse passes over them, like a
 * desktop launcher. Sizes ride on springs driven by one pointer motion value,
 * so moving the mouse never re-renders React. Touch and keyboard get the
 * resting size. The bar is tall enough for the largest icon, which swells
 * from its centre and so stays inside it; the dock also reserves room above
 * itself for the floating label, so it never covers what sits on top.
 */
export function Dock({ items, size = 44, magnification = 58, distance = 130, className }: DockProps) {
  const pointerX = useMotionValue(Number.POSITIVE_INFINITY);

  return (
    <MotionScope>
      <nav
        aria-label="Dock"
        onPointerMove={(e) => e.pointerType === "mouse" && pointerX.set(e.clientX)}
        onPointerLeave={() => pointerX.set(Number.POSITIVE_INFINITY)}
        className={cn("surface-raised inline-flex items-center rounded-card px-3", className)}
        // Room for the largest icon inside the bar, and for the label above it.
        style={{ height: Math.max(size, magnification) + 20, marginTop: 40 }}
      >
        <ul className="flex items-center gap-2.5">
          {items.map((item) => (
            <DockIcon
              key={item.label}
              item={item}
              pointerX={pointerX}
              size={size}
              magnification={magnification}
              distance={distance}
            />
          ))}
        </ul>
      </nav>
    </MotionScope>
  );
}
