// Free of DOM references so components stay renderable outside a browser.

export const esc = (s) => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

export const join = (parts) => parts.filter(Boolean).join('');

/**
 * "Veganish" / "Vegan-ish" picks up the logo's split: plain word, orange suffix.
 * Escapes first and injects after, so callers keep passing plain strings.
 */
export const brandName = (text) =>
  esc(text).replace(/Vegan(-?ish)\b/g, 'Vegan<em class="brand-ish">$1</em>');
