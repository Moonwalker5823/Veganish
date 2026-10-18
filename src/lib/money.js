// Menu prices are strings ("$4.25 / $5.25", market price); catering prices are
// numbers. Both shapes are kept rather than normalised, which would lose detail.

export const MARKET_PRICE_LABEL = 'Market Price';

export const usd = (n) =>
  typeof n === 'number' ? `$${Number.isInteger(n) ? n : n.toFixed(2)}` : String(n ?? '');

export function panPricing({ full, half, halfNote, marketPrice }) {
  const parts = [];
  if (full != null) parts.push({ label: 'Full Pan', value: usd(full) });
  if (half != null) parts.push({ label: 'Half Pan', value: usd(half) + (halfNote ? ` (${halfNote})` : '') });
  return { parts, marketPrice: Boolean(marketPrice) };
}
