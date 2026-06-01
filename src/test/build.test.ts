import { describe, it, expect, beforeAll } from "vitest";
import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

const distDir = resolve(import.meta.dirname, "../../dist");

beforeAll(() => {
  execSync("npm run build", {
    cwd: resolve(import.meta.dirname, "../.."),
    stdio: "pipe",
  });
}, 60_000);

describe("build output", () => {
  it("produces dist/index.html", () => {
    expect(existsSync(resolve(distDir, "index.html"))).toBe(true);
  });

  it("produces dist/sitemap-index.xml", () => {
    expect(existsSync(resolve(distDir, "sitemap-index.xml"))).toBe(true);
  });

  it("produces dist/og-image.png", () => {
    expect(existsSync(resolve(distDir, "og-image.png"))).toBe(true);
  });

  it("produces dist/favicon.ico", () => {
    expect(existsSync(resolve(distDir, "favicon.ico"))).toBe(true);
  });
});
