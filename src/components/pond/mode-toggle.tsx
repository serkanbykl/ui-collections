"use client";

/** Flips the home page between light and dark and remembers the choice. */
export function ModeToggle() {
  function toggle() {
    const root = document.documentElement;
    const current = root.dataset.mode ?? (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    const next = current === "dark" ? "light" : "dark";
    root.dataset.mode = next;
    try {
      localStorage.setItem("home:mode", next);
    } catch {}
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Switch light or dark"
      className="-m-3 cursor-pointer p-3 opacity-55 transition-opacity duration-150 outline-none hover:opacity-100 focus-visible:opacity-100"
    >
      <svg viewBox="0 0 24 24" className="size-[15px]" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden>
        <circle cx="12" cy="12" r="4.5" />
        <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" />
      </svg>
    </button>
  );
}
