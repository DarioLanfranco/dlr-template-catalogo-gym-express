import { readdirSync, writeFileSync, existsSync } from "node:fs";
import { join, resolve, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = resolve(__dirname, "../dist");

if (!existsSync(distDir)) {
  console.error("[precache] dist/ not found — skipping (run `astro build` first)");
  process.exit(0);
}

function walk(dir) {
  const files = [];
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return files;
  }
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(full));
    else if (entry.isFile()) files.push(full);
  }
  return files;
}

const allFiles = walk(distDir);
const assets = ["/"];

for (const filePath of allFiles) {
  const rel = "/" + relative(distDir, filePath).replace(/\\/g, "/");

  const isCritical =
    rel === "/index.html" ||
    rel === "/manifest.json" ||
    rel === "/robots.txt" ||
    rel === "/favicon.svg" ||
    rel === "/favicon.ico" ||
    rel === "/sw.js";

  const isIcon = rel.startsWith("/icons/");

  const isBundle =
    rel.startsWith("/_astro/") &&
    (rel.endsWith(".css") || rel.endsWith(".js") || rel.endsWith(".woff2") || rel.endsWith(".svg"));

  const isSitemap = rel.startsWith("/sitemap") && rel.endsWith(".xml");

  if (isCritical || isIcon || isBundle || isSitemap) {
    assets.push(rel);
  }
}

const outputPath = join(distDir, "precache-manifest.js");
writeFileSync(outputPath, `self.PRECACHE_ASSETS = ${JSON.stringify(assets, null, 2)};\n`);
console.log(`[precache] ✓ ${assets.length} assets written → ${outputPath}`);
