import { highlight, type CodeLang } from "@/lib/source";
import { cn } from "@/registry/kit/lib/utils";

import { CopyButton } from "./copy-button";

export async function CodeBlock({
  code,
  lang,
  title,
  className,
}: {
  code: string;
  lang: CodeLang;
  title?: string;
  className?: string;
}) {
  const html = await highlight(code.trimEnd(), lang);
  return (
    <div data-mode="dark" className={cn("code-block overflow-hidden rounded-field border border-line bg-bg-deep text-fg", className)}>
      <div className="flex items-center justify-between gap-4 border-b border-line py-1 pr-1.5 pl-4">
        <span className="truncate font-mono text-xs text-muted">{title ?? lang}</span>
        <CopyButton value={code} />
      </div>
      {/* Focusable so keyboard users can scroll long sources. */}
      <div
        tabIndex={0}
        role="region"
        aria-label={title ?? `${lang} code`}
        className="max-h-[30rem] overflow-auto text-[13px] leading-relaxed outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-inset"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}

/** One-line shell command with a copy button. */
export function CommandLine({ command, className }: { command: string; className?: string }) {
  return (
    // Code wells stay dark in every theme so the Shiki palette reads the same.
    <div
      data-mode="dark"
      className={cn(
        "flex items-center gap-3 rounded-field border border-line bg-bg-deep py-1.5 pr-1.5 pl-4 font-mono text-[13px] text-fg",
        className,
      )}
    >
      <span aria-hidden className="text-accent select-none">$</span>
      <code className="flex-1 overflow-x-auto whitespace-nowrap text-fg/85 [scrollbar-width:none]">{command}</code>
      <CopyButton value={command} />
    </div>
  );
}
