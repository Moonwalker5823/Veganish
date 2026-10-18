// Assigns tile size modifiers so a photo grid never ends with holes.
//
// A 3-column grid needs its cell count divisible by 3. A tall tile costs 2 cells,
// a wide tile 2, so both are levers. Preference order: spend tall tiles first
// (they give the grid its rhythm), and only widen the final tile if tall alone
// can't balance the count.
//
// Below 768px the stylesheet collapses tall to one row and resets the spans, so
// only the 3-column case is computed here.

const COLUMNS = 3;

export function layoutTiles(photos) {
  const n = photos.length;
  if (!n) return photos;

  // roughly one tall per six tiles, reduced until the total divides evenly
  let tall = 0;
  for (let t = Math.floor(n / 6); t > 0; t--) {
    if ((n + t) % COLUMNS === 0) { tall = t; break; }
  }

  const remainder = (n + tall) % COLUMNS;
  const step = tall > 0 ? Math.floor(n / tall) : 0;

  return photos.map((p, i) => {
    const isTall = tall > 0 && i % step === 0 && i / step < tall;
    // span enough columns to close the last row: 1 short -> span 3, 2 short -> span 2
    const isWide = remainder > 0 && i === n - 1;
    return { ...p, size: isTall ? 'tall' : isWide ? (remainder === 1 ? 'full' : 'wide') : undefined };
  });
}
