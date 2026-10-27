"use client";

import { useEffect, useState, type RefObject } from "react";

/** True once the element has entered the viewport; never flips back. */
export function useInViewOnce(
  ref: RefObject<Element | null>,
  { enabled = true, rootMargin = "0px 0px -10% 0px", threshold = 0 } = {},
) {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!enabled || inView || !el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, enabled, inView, rootMargin, threshold]);

  return inView;
}
