// schema.org helpers shared by every section that contributes to hasMenu.
//
// Each section owns its own MenuSections and main.js concatenates them, so a new
// menu is one export rather than an edit to a central list.

/**
 * Prices on this site are display strings: "$12.00", "$4.25 / $5.25" (two sizes),
 * "$4.00 - $8.00" (a range), "$12.00 & up", "Market Price". schema.org wants one
 * number, so take the first — for a range or a two-size item that's the "from"
 * price, which is what a listing should show.
 *
 * Stripping every non-digit instead turned "$4.25 / $5.25" into "4.255.25", an
 * invalid value that shipped in the live JSON-LD.
 */
export function priceValue(price) {
  if (typeof price === 'number') return String(price);
  const match = String(price ?? '').match(/\d+(?:\.\d+)?/);
  return match ? match[0] : undefined;
}

const offer = (price, name) => {
  const value = priceValue(price);
  if (!value) return undefined;
  return {
    '@type': 'Offer',
    ...(name ? { name } : {}),
    price: value,
    priceCurrency: 'USD',
  };
};

/** Items with no price at all (sauces, sides to choose from) are still valid MenuItems. */
export function menuItem({ name, desc, price, offers }) {
  const list = offers ?? [offer(price)].filter(Boolean);
  return {
    '@type': 'MenuItem',
    name,
    ...(desc ? { description: desc } : {}),
    ...(list.length ? { offers: list.length === 1 ? list[0] : list } : {}),
  };
}

export const menuSection = (name, items) => ({
  '@type': 'MenuSection',
  name,
  hasMenuItem: items,
});

/** Trays priced by the pan carry one Offer per size. */
export const panOffers = ({ full, half }) =>
  [offer(full, 'Full Pan'), offer(half, 'Half Pan')].filter(Boolean);

/** A list of plain strings — choices, sauces, brunch items. */
export const nameOnlySection = (name, names) =>
  menuSection(name, names.map((n) => menuItem({ name: n })));
