// Build-time Sanity access (published content only). The dataset is private:
// the read key comes from the build variable SANITY_READ_TOKEN and is never
// written in this repository.
const SANITY_PROJECT = "r102svrh";
const SANITY_DATASET = "production";

export async function sanityFetch<T = any>(query: string): Promise<T> {
  const url =
    `https://${SANITY_PROJECT}.api.sanity.io/v2025-02-19/data/query/${SANITY_DATASET}` +
    `?query=${encodeURIComponent(query)}&perspective=published`;
  const token = process.env.SANITY_READ_TOKEN;
  if (!token) throw new Error("SANITY_READ_TOKEN is not set: the build needs this variable to read content from Sanity.");
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error(`Sanity fetch failed: ${res.status} ${await res.text()}`);
  return (await res.json()).result as T;
}

/** Throws (failing the build) when a document that needs an address has no slug. */
export function requireSlugs<T extends { slug?: string; title?: string; name?: string }>(type: string, docs: T[]): T[] {
  const missing = docs.filter((d) => !d.slug);
  if (missing.length) {
    throw new Error(`Sanity: ${type} without a slug: ${missing.map((d) => d.title ?? d.name ?? "(untitled)").join(", ")}. Every published ${type} needs a slug to get an address.`);
  }
  return docs;
}
