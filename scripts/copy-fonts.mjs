// Kopiert die selbstgehosteten Variable-Fonts aus node_modules nach assets/fonts.
// Nutzung: npm install && npm run fonts
import { copyFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const nm = (p) => new URL(`../node_modules/${p}`, import.meta.url);

const jobs = [
  ["@fontsource-variable/fraunces/files/fraunces-latin-opsz-normal.woff2", "assets/fonts/fraunces-var.woff2"],
  ["@fontsource-variable/instrument-sans/files/instrument-sans-latin-wght-normal.woff2", "assets/fonts/instrument-sans-var.woff2"],
  ["@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2", "assets/fonts/jetbrains-mono-var.woff2"]
];

await mkdir(new URL("../assets/fonts/", import.meta.url), { recursive: true });
for (const [src, dest] of jobs) {
  await copyFile(nm(src), new URL(`../${dest}`, import.meta.url));
  console.log("✓", dest);
}
console.log("Fonts kopiert.");
