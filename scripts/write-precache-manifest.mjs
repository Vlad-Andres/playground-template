import { createHash } from "node:crypto";
import { statSync } from "node:fs";
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const OUTPUT_DIRECTORY = "out";
const SERVICE_WORKER_FILE = "sw.js";
const MANIFEST_PLACEHOLDER = 'const PRECACHE_MANIFEST = { version: "development", urls: [] };';

async function listFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => {
      const entryPath = path.join(directory, entry.name);
      return entry.isDirectory() ? listFiles(entryPath) : [entryPath];
    }),
  );
  return nested.flat();
}

const toCacheUrl = (relativePath) => {
  const urlPath = relativePath.split(path.sep).join("/");
  if (urlPath === "index.html") return "./";
  return urlPath.endsWith("/index.html") ? urlPath.slice(0, -"index.html".length) : urlPath;
};

const relativePaths = (await listFiles(OUTPUT_DIRECTORY))
  .map((filePath) => path.relative(OUTPUT_DIRECTORY, filePath))
  .filter((relativePath) => relativePath !== SERVICE_WORKER_FILE && !relativePath.endsWith(".txt") && !path.basename(relativePath).startsWith("."))
  // PGlite (~15 MB, emitted under _next/static/media) is cached by the service worker the first
  // time someone runs SQL, not up front.
  .filter((relativePath) => !relativePath.startsWith(`pglite${path.sep}`) && statSync(path.join(OUTPUT_DIRECTORY, relativePath)).size < 2_000_000)
  .sort();

const hash = createHash("sha256");
for (const relativePath of relativePaths) {
  hash.update(relativePath);
  hash.update(await readFile(path.join(OUTPUT_DIRECTORY, relativePath)));
}

const manifest = {
  version: hash.digest("hex").slice(0, 16),
  urls: relativePaths.map(toCacheUrl),
};

const serviceWorkerPath = path.join(OUTPUT_DIRECTORY, SERVICE_WORKER_FILE);
const serviceWorker = await readFile(serviceWorkerPath, "utf8");
if (!serviceWorker.includes(MANIFEST_PLACEHOLDER)) throw new Error(`${serviceWorkerPath} has no precache manifest placeholder`);
await writeFile(
  serviceWorkerPath,
  serviceWorker.replace(MANIFEST_PLACEHOLDER, `const PRECACHE_MANIFEST = ${JSON.stringify(manifest)};`),
);
console.log(`Precache manifest ${manifest.version}: ${manifest.urls.length} files`);
