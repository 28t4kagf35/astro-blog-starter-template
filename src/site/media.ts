// Page images that live on documents (not in a Media list): the build step in
// scripts/fetch-media.mjs saves each one as public/media/pages/<id>-<width>.webp.
// Sanity asset id "image-<hash>-<w>x<h>-<ext>" -> "<first 12 of hash>".
export const mediaSrc = (assetId?: string | null): string => {
  const hash = assetId?.split("-")[1];
  return hash ? `/media/pages/${hash.slice(0, 12)}-1600.webp` : "";
};
