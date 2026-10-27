/**
 * Fails when a collection theme misses part of the contract in
 * src/themes/contract.ts. Run with `npm run check:themes`.
 */
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

import { themeSurfaces, themeVariables } from "../src/themes/contract.ts";

const dir = path.join(import.meta.dirname, "../src/themes");
const themes = readdirSync(dir).filter((f) => f.endsWith(".css") && f !== "base.css");

let failed = false;
for (const file of themes) {
  const id = file.replace(/\.css$/, "");
  const css = readFileSync(path.join(dir, file), "utf8");
  const missing = [
    ...(css.includes(`[data-theme="${id}"]`) ? [] : [`[data-theme="${id}"] scope`]),
    ...themeVariables.filter((v) => !new RegExp(`${v}\\s*:`).test(css)),
    ...themeSurfaces.filter((s) => !css.includes(s)),
  ];
  if (missing.length) {
    failed = true;
    console.error(`✖ ${file} is missing: ${missing.join(", ")}`);
  } else {
    console.log(`✔ ${file}`);
  }
}

if (!themes.length) {
  console.error("✖ no themes found in src/themes");
  failed = true;
}
process.exit(failed ? 1 : 0);
