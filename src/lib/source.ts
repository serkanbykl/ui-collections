import { readFile } from "node:fs/promises";
import path from "node:path";

import { createHighlighter } from "shiki";

export type CodeLang = "tsx" | "css" | "bash";

let highlighter: ReturnType<typeof createHighlighter> | undefined;

export async function highlight(code: string, lang: CodeLang) {
  "use cache";
  highlighter ??= createHighlighter({ themes: ["poimandres"], langs: ["tsx", "css", "bash"] });
  return (await highlighter).codeToHtml(code, { lang, theme: "poimandres" });
}

/** Rewrites registry imports to the aliases `shadcn add` installs to, so shown code matches installed code. */
function toInstalledImports(code: string) {
  return code
    .replace(/@\/registry\/tide\/lib\/utils/g, "@/lib/utils")
    .replace(/@\/registry\/tide\/ui\//g, "@/components/ui/")
    .replace(/@\/registry\/tide\/hooks\//g, "@/hooks/")
    .replace(/@\/registry\/tide\/lib\//g, "@/lib/");
}

/** Reads a file under src/ at build time. */
export async function readSource(relativeToSrc: string) {
  "use cache";
  const code = await readFile(path.join(process.cwd(), "src", relativeToSrc), "utf8");
  return toInstalledImports(code);
}
