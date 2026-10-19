// Pure `data -> HTML string`. Behaviour lives in src/features/.

import { esc, brandName } from '../lib/html.js';
import { usd, panPricing, MARKET_PRICE_LABEL } from '../lib/money.js';

export function SectionHeader({ eyebrow, title, titleId, desc }) {
  return `
    <div class="section-header reveal">
      ${eyebrow ? `<span class="section-eyebrow">${brandName(eyebrow)}</span>` : ''}
      <h2 class="section-title"${titleId ? ` id="${esc(titleId)}"` : ''}>${brandName(title)}</h2>
      ${desc ? `<p class="section-desc">${esc(desc)}</p>` : ''}
    </div>`;
}

export function MenuCard({ name, price, desc, tags = [], badge }) {
  return `
    <div class="menu-card${badge ? ' featured' : ''}">
      ${badge ? `<p class="menu-card-badge">${esc(badge)}</p>` : ''}
      <div class="menu-card-header">
        <h3>${esc(name)}</h3>
        <span class="menu-price">${esc(price)}</span>
      </div>
      ${desc ? `<p class="menu-card-desc">${esc(desc)}</p>` : ''}
      ${tags.length ? `<div class="menu-tags">${tags.map((t) => `<span>${esc(t)}</span>`).join('')}</div>` : ''}
    </div>`;
}

export function MenuGrid(items) {
  return `<div class="menu-grid">${items.map(MenuCard).join('')}</div>`;
}

export function GalleryTile({ src, alt, caption, width, height, size }) {
  const mod = size === 'tall' ? ' g-tall' : size === 'wide' ? ' g-wide' : size === 'full' ? ' g-full' : '';
  return `
    <button type="button" class="gallery-item${mod}" data-caption="${esc(caption)}">
      <img src="${esc(src)}" alt="${esc(alt)}" class="gallery-photo"
           width="${width}" height="${height}" loading="lazy" decoding="async" />
      <span class="gallery-overlay"><span>${esc(caption)}</span></span>
    </button>`;
}

export function GalleryGrid(photos, { id } = {}) {
  return `<div class="gallery-grid"${id ? ` id="${esc(id)}"` : ''}>${photos.map(GalleryTile).join('')}</div>`;
}

export function HighlightCard({ img, alt, width, height, tag, title, body, imgClass }) {
  return `
    <article class="highlight-card">
      <div class="highlight-img-wrap">
        <img src="${esc(img)}" alt="${esc(alt)}"${imgClass ? ` class="${esc(imgClass)}"` : ''}
             width="${width}" height="${height}" loading="lazy" decoding="async" />
      </div>
      <div class="highlight-body">
        <span class="highlight-tag">${esc(tag)}</span>
        <h3>${esc(title)}</h3>
        <p>${esc(body)}</p>
      </div>
    </article>`;
}

export function ReviewCard({ stars, text, name, role, initials }) {
  // Initials derive from the name; the override covers names that don't split
  // cleanly, like the single-token "EGKunz".
  const avatar = initials || name.split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase();
  return `
    <figure class="review-card">
      <p class="review-stars">
        <span aria-hidden="true">${'★'.repeat(stars)}${'☆'.repeat(5 - stars)}</span>
        <span class="sr-only">Rated ${stars} out of 5</span>
      </p>
      <blockquote class="review-text">${esc(text)}</blockquote>
      <figcaption class="review-author">
        <span class="review-avatar" aria-hidden="true">${esc(avatar)}</span>
        <span class="review-author-info"><strong>${esc(name)}</strong><span>${esc(role)}</span></span>
      </figcaption>
    </figure>`;
}

export function TrayRow(item) {
  const { parts, marketPrice } = panPricing(item);
  return `
    <div class="tray-row">
      <div class="tray-row-main">
        <h4 class="tray-name">${esc(item.name)}${marketPrice ? ` <abbr class="tray-mp" title="${MARKET_PRICE_LABEL}">M/P</abbr>` : ''}</h4>
        ${item.desc ? `<p class="tray-desc">${esc(item.desc)}</p>` : ''}
      </div>
      <dl class="tray-prices">
        ${parts.map((p) => `<div class="tray-price"><dt>${esc(p.label)}</dt><dd>${esc(p.value)}</dd></div>`).join('')}
      </dl>
    </div>`;
}

export function TrayCategory({ title, items }) {
  return `
    <section class="tray-category">
      <h3 class="tray-category-title">${esc(title)}</h3>
      <div class="tray-rows">${items.map(TrayRow).join('')}</div>
    </section>`;
}

export function PricedList({ title, note, items }) {
  return `
    <section class="tray-category tray-category-compact">
      <h3 class="tray-category-title">${esc(title)}${note ? ` <span class="tray-category-note">${esc(note)}</span>` : ''}</h3>
      <ul class="priced-list">
        ${items.map((i) => `<li><span>${esc(i.name)}</span><span class="priced-list-price">${esc(usd(i.price))}</span></li>`).join('')}
      </ul>
    </section>`;
}

export function ChipList({ title, items, note }) {
  return `
    <section class="tray-category tray-category-compact">
      <h3 class="tray-category-title">${esc(title)}${note ? ` <span class="tray-category-note">${esc(note)}</span>` : ''}</h3>
      <ul class="chip-list">${items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>
    </section>`;
}

/** `detail` overrides the meal-plan phrasing; juice packs count juices, not meals. */
export function PlanCard({ label, meals, perDay, price, featured, detail }) {
  return `
    <article class="plan-card${featured ? ' plan-card-featured' : ''}">
      ${featured ? '<p class="plan-badge">Best Value</p>' : ''}
      <h3 class="plan-label">${esc(label)}</h3>
      <p class="plan-detail">${esc(detail ?? `${meals} meals · ${perDay} per day`)}</p>
      <p class="plan-price">${esc(usd(price))}</p>
    </article>`;
}
