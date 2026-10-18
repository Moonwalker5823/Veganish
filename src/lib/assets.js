// Asset URL resolution.
//
// Vite only fingerprints what it can see: assets referenced from markup/CSS, or
// imported from JS. Now that photos come from data modules their paths are just
// strings, so Vite never processes them - they'd be left out of dist/ entirely
// and 404 in production. (The README already warns about this for <audio src>.)
//
// import.meta.glob with eager makes every image a real build input, and the map
// turns a data path into the hashed URL Vite emitted for it.

const urls = import.meta.glob('../../assets/images/**/*.{webp,jpg,jpeg,png}', {
  eager: true,
  query: '?url',
  import: 'default',
});

// Glob keys are relative to this file ('../../assets/images/...'); data stores
// repo-relative paths ('assets/images/...').
const byPath = new Map(
  Object.entries(urls).map(([key, url]) => [key.replace(/^(\.\.\/)+/, ''), url])
);

/** Resolve a repo-relative image path to its built URL. */
export function asset(src) {
  const hit = byPath.get(src);
  if (hit) return hit;
  // Loud in dev, harmless in production - a missing asset is a data bug.
  if (import.meta.env?.DEV) console.warn(`[assets] no build output for "${src}"`);
  return src;
}

/** Map a list of photo records through `asset`. */
export const withAssets = (photos) => photos.map((p) => ({ ...p, src: asset(p.src) }));
