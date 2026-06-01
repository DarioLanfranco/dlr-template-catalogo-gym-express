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
  it("produces a deployable index.html", () => {
    expect(existsSync(resolve(distDir, "index.html"))).toBe(true);
  });
});
