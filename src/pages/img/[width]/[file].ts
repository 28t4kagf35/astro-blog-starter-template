// Live image transform: fetches one clean original from R2 and resizes/reformats
// it at the edge via Cloudflare's Workers-native cf.image fetch() option. No
// custom domain/zone needed -- cf.image works on any *.workers.dev Worker.
// This is the "real" pipeline (vs. the pre-baked static variants), so we can
// Lighthouse-test both approaches side by side.
export const prerender = false;

import type { APIRoute } from "astro";

const R2_BASE = "https://pub-fd4b2549c703402ea7ec95adbd09f66d.r2.dev";

// Allowlist of originals this route is willing to transform -- keeps the
// route from being an open proxy for the whole public bucket.
const ALLOWED_FILES = new Set([
  "tvindefossen-hero-original.jpg",
  "tvindefossen-headon-original.jpg",
  "tvindefossen-close-original.jpg",
]);

export const GET: APIRoute = async ({ params, request }) => {
  const { width, file } = params;
  const w = Number(width);

  if (!file || !ALLOWED_FILES.has(file) || !Number.isFinite(w) || w < 1 || w > 3000) {
    return new Response("Not found", { status: 404 });
  }

  const accept = request.headers.get("accept") ?? "";
  const format = accept.includes("image/avif")
    ? "avif"
    : accept.includes("image/webp")
      ? "webp"
      : "jpeg";

  const upstream = await fetch(`${R2_BASE}/${file}`, {
    cf: {
      image: { width: w, format, quality: 82, fit: "scale-down" },
    },
  } as RequestInit);

  if (!upstream.ok) {
    return new Response(`Upstream transform failed: ${upstream.status}`, { status: 502 });
  }

  return new Response(upstream.body, {
    status: 200,
    headers: {
      "content-type": upstream.headers.get("content-type") ?? "image/jpeg",
      "cache-control": "public, max-age=31536000, immutable",
    },
  });
};
