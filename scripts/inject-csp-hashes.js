import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = resolve(__dirname, "../dist");
const htmlPath = resolve(distDir, "index.html");

if (!existsSync(htmlPath)) {
  console.error("[csp] dist/index.html not found — skipping");
  process.exit(0);
}

const html = readFileSync(htmlPath, "utf-8");

const scriptRegex = /<script\b([^>]*)>([\s\S]*?)<\/script>/g;
const hashes = [];
let match;

while ((match = scriptRegex.exec(html)) !== null) {
  const attrs = match[1];
  const code = match[2];

  if (attrs.includes('application/ld+json')) continue;
  if (!code.trim()) continue;

  const hash = createHash("sha256").update(code, "utf-8").digest("base64");
  hashes.push(`'sha256-${hash}'`);
}

const baseDirectives = "default-src 'self'; img-src 'self' data:;";
const scriptDirective = `script-src 'self' ${hashes.join(" ")}`;
const styleDirective = "style-src 'self' 'unsafe-inline'";
const newCsp = `${baseDirectives} ${scriptDirective}; ${styleDirective};`;

const updated = html.replace(
  /<meta http-equiv="Content-Security-Policy"[^>]*>/,
  `<meta http-equiv="Content-Security-Policy" content="${newCsp}">`,
);

writeFileSync(htmlPath, updated, "utf-8");
console.log(`[csp] ✓ ${hashes.length} script hashes injected into CSP`);
