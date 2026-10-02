// Architecture check. Runs inside every build (wired in astro.config.mjs) and
// stops the build with a clear message when the structure is broken:
//
//  1. Globals match the lock: each folder in src/globals has an entry in
//     globals.lock.json with the same version and the same file fingerprint.
//     (Change a global by pulling/approving a new version, then update the lock.)
//  2. Only src/shell imports from src/globals.
//  3. Only the front controller, the 404 page (and the listed leftovers) are route files.
//  4. Every page type's index.tsx is made with withShell(...).
//  5. The front controller and the 404 page render inside SiteLayout; the 404 page uses a page type.
//
// CLI:  node scripts/check-architecture.mjs          -> run the check
//       node scripts/check-architecture.mjs --print  -> print current fingerprints
import { createHash } from "node:crypto";
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

// Route files allowed besides the front controller. Leftovers from the stack
// proof and the starter template; to be removed in the pre-launch clean-up.
const LEGACY_ROUTES = [
  "img/[width]/[file].ts",
  "about.astro",
  "blog/index.astro",
  "blog/[...slug].astro",
  "rss.xml.js",
];
const FRONT_CONTROLLER = "[...path].astro";
const ERROR_PAGE = "404.astro"; // Astro serves this file for unknown addresses

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir).sort()) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}
const posix = (p) => p.split(sep).join("/");
const sha = (buf) => createHash("sha256").update(buf).digest("hex");

/** Fingerprint of a global: every file in its folder, path + content. */
export function fingerprint(globalDir) {
  const h = createHash("sha256");
  for (const file of walk(globalDir)) {
    h.update(posix(relative(globalDir, file)) + "\0" + sha(readFileSync(file)) + "\n");
  }
  return h.digest("hex");
}

export function checkArchitecture(root) {
  const errors = [];
  const src = join(root, "src");
  const globalsDir = join(src, "globals");
  const lockPath = join(root, "globals.lock.json");

  // 1. Globals match the lock.
  const lock = existsSync(lockPath) ? JSON.parse(readFileSync(lockPath, "utf8")) : null;
  if (!lock) errors.push("globals.lock.json is missing.");
  const names = existsSync(globalsDir) ? readdirSync(globalsDir).filter((n) => statSync(join(globalsDir, n)).isDirectory()) : [];
  for (const name of names) {
    const dir = join(globalsDir, name);
    const metaPath = join(dir, "global.json");
    if (!existsSync(metaPath)) { errors.push(`src/globals/${name}: global.json is missing.`); continue; }
    const meta = JSON.parse(readFileSync(metaPath, "utf8"));
    const entry = lock?.globals?.[name];
    if (!entry) { errors.push(`src/globals/${name} has no entry in globals.lock.json.`); continue; }
    if (entry.version !== meta.version) errors.push(`${name}: global.json says version ${meta.version}, the lock says ${entry.version}.`);
    const fp = fingerprint(dir);
    if (entry.fingerprint !== fp) {
      errors.push(`${name}: files in src/globals/${name} do not match the lock (version ${entry.version}). A global changes only through a new approved version; then update globals.lock.json (node scripts/check-architecture.mjs --print).`);
    }
  }
  for (const name of Object.keys(lock?.globals ?? {})) {
    if (!names.includes(name)) errors.push(`globals.lock.json lists "${name}" but src/globals/${name} does not exist.`);
  }

  // 2. Only src/shell imports from src/globals.
  const importRe = /(?:from\s+|import\s*\(\s*|import\s+)["']([^"']+)["']/g;
  for (const file of walk(src)) {
    if (!/\.(ts|tsx|js|jsx|mjs|astro)$/.test(file)) continue;
    const rel = posix(relative(src, file));
    if (rel.startsWith("globals/") || rel.startsWith("shell/")) continue;
    const text = readFileSync(file, "utf8");
    for (const m of text.matchAll(importRe)) {
      if (/(^|\/)globals(\/|$)/.test(m[1])) errors.push(`src/${rel} imports a global ("${m[1]}"). Only src/shell may import from src/globals.`);
    }
  }

  // 3. Route files.
  const pagesDir = join(src, "pages");
  const routes = walk(pagesDir).map((f) => posix(relative(pagesDir, f)));
  if (!routes.includes(FRONT_CONTROLLER)) errors.push(`The front controller src/pages/${FRONT_CONTROLLER} is missing.`);
  for (const r of routes) {
    if (r !== FRONT_CONTROLLER && r !== ERROR_PAGE && !LEGACY_ROUTES.includes(r)) {
      errors.push(`src/pages/${r} is a second route file. Every page is rendered by src/pages/${FRONT_CONTROLLER}; add a page type instead.`);
    }
  }

  // 4. Page types go through the shell.
  const typesDir = join(src, "page-types");
  for (const name of existsSync(typesDir) ? readdirSync(typesDir) : []) {
    const idx = join(typesDir, name, "index.tsx");
    if (existsSync(idx) && !/export\s+default\s+withShell\s*[<(]/.test(readFileSync(idx, "utf8"))) {
      errors.push(`src/page-types/${name}/index.tsx must be "export default withShell(...)".`);
    }
  }

  // 5. The front controller uses the frame.
  const fc = join(pagesDir, FRONT_CONTROLLER);
  if (existsSync(fc) && !readFileSync(fc, "utf8").includes("<SiteLayout")) {
    errors.push(`src/pages/${FRONT_CONTROLLER} must render inside <SiteLayout>.`);
  }

  const ep = join(pagesDir, ERROR_PAGE);
  if (existsSync(ep)) {
    const t = readFileSync(ep, "utf8");
    if (!t.includes("<SiteLayout")) errors.push(`src/pages/${ERROR_PAGE} must render inside <SiteLayout>.`);
    if (!/page-types\/[^"']+/.test(t)) errors.push(`src/pages/${ERROR_PAGE} must render a page type from src/page-types.`);
  }

  return errors;
}

/** Astro integration: fail the build (and warn in dev) on any error. */
export function architectureCheck() {
  let root = process.cwd();
  return {
    name: "vssw-architecture-check",
    hooks: {
      "astro:config:done": ({ config }) => { root = fileURLToPath(config.root); },
      "astro:build:start": () => {
        const errors = checkArchitecture(root);
        if (errors.length) {
          throw new Error("\n\nARCHITECTURE CHECK FAILED\n\n" + errors.map((e) => " - " + e).join("\n") + "\n");
        }
        console.log("[architecture-check] OK");
      },
    },
  };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const root = process.cwd();
  if (process.argv.includes("--print")) {
    const dir = join(root, "src", "globals");
    for (const name of readdirSync(dir)) console.log(name, fingerprint(join(dir, name)));
  } else {
    const errors = checkArchitecture(root);
    if (errors.length) { console.error("ARCHITECTURE CHECK FAILED\n" + errors.map((e) => " - " + e).join("\n")); process.exit(1); }
    console.log("architecture check OK");
  }
}
