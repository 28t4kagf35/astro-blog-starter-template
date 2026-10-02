// Fetches page media from the (private) Sanity dataset at build time and puts
// resized copies into public/media/, so they are served with the site.
// Nothing downloaded here is committed (public/media/ is git-ignored).
//
// Needs the build variable SANITY_READ_TOKEN. If it is missing or an image
// cannot be fetched, the build continues and the page shows its honest
// "image unavailable" boxes instead; the reason is printed in the build log.
import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

export const MEDIA_WIDTHS = [640, 1080, 1600, 2400];
const PROJECT = "r102svrh";
const DATASET = "production";

// Which Sanity documents carry media, and the folder each one gets.
const SOURCES = [
  { folder: "home", query: `*[_type == "homePage"][0].media[]{ "slot": slot, "url": image.asset->url }` },
  {
    folder: "pages",
    // images attached directly to documents: articles, activity, observe feed
    query: `[
      ...*[_type in ["learnArticle","experienceArticle","cultureArticle","activity"]].heroImage.asset->{ "slot": _id, "url": url },
      ...*[_type == "activity"].wideTerrainImage.asset->{ "slot": _id, "url": url },
      ...*[_type == "observePage"][0].blocks[].image.asset->{ "slot": _id, "url": url },
      ...[*[_type == "masterGuide"][0].heroImage.asset->{ "slot": _id, "url": url }],
      ...[*[_type == "masterGuide"][0].cabinImage.asset->{ "slot": _id, "url": url }],
      ...*[_type == "masterGuide"][0].falls[].image.asset->{ "slot": _id, "url": url }
    ]`,
    slotOf: (id) => id.split("-")[1].slice(0, 12),
  },
  { folder: "cabin", query: `*[_type == "cabinPage"][0].media[]{ "slot": slot, "url": image.asset->url }` },
];

async function fetchOk(url, token) {
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error(`${res.status} for ${url.split("?")[0]}`);
  return Buffer.from(await res.arrayBuffer());
}

export async function fetchMedia(root) {
  const token = process.env.SANITY_READ_TOKEN;
  if (!token) {
    console.warn("[media] SANITY_READ_TOKEN is not set: no media fetched, pages will show 'image unavailable'.");
    return;
  }
  for (const { folder, query, slotOf } of SOURCES) {
    try {
      const listUrl = `https://${PROJECT}.api.sanity.io/v2025-02-19/data/query/${DATASET}?query=${encodeURIComponent(query)}&perspective=published`;
      const items = (JSON.parse((await fetchOk(listUrl, token)).toString()).result ?? []).filter((m) => m?.slot && m?.url)
        .map((m) => ({ ...m, slot: slotOf ? slotOf(m.slot) : m.slot }))
        .filter((m, i, all) => all.findIndex((x) => x.slot === m.slot) === i);
      const dir = join(root, "public", "media", folder);
      mkdirSync(dir, { recursive: true });
      let done = 0;
      const queue = [];
      for (const m of items) for (const w of MEDIA_WIDTHS) queue.push({ slot: m.slot, w, url: `${m.url}?w=${w}&fm=webp&q=80` });
      // a few at a time
      const worker = async () => {
        while (queue.length) {
          const job = queue.shift();
          const file = join(dir, `${job.slot}-${job.w}.webp`);
          try {
            writeFileSync(file, await fetchOk(job.url, token));
            done++;
          } catch (e) {
            console.warn(`[media] ${folder}/${job.slot}-${job.w}: ${e.message}`);
          }
        }
      };
      await Promise.all([worker(), worker(), worker(), worker()]);
      console.log(`[media] ${folder}: ${done} files fetched for ${items.length} images`);
    } catch (e) {
      console.warn(`[media] ${folder}: not fetched (${e.message}). Pages will show 'image unavailable'.`);
    }
  }
}

export function mediaFetch() {
  return {
    name: "vssw-media-fetch",
    hooks: {
      "astro:config:setup": async ({ config }) => {
        await fetchMedia(fileURLToPath(config.root));
      },
    },
  };
}
