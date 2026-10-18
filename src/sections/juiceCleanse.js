// Juice Cleanse section - built from src/data/juiceCleanse.js.
//
// `juiceCleansePublished` still gates the whole section: main.js drops the
// section and its nav link when it's false, so the menu can be pulled without
// touching markup.
import { SectionHeader, PlanCard, MenuGrid, ChipList, GalleryGrid } from '../components/index.js';
import { esc, join } from '../lib/html.js';
import {
  juiceCleansePublished, juiceCleanseIntro, juiceCleansePlans, juiceCleanseNote,
  juiceCleanseJuices, juiceCleanseShots, juiceCleanseHerbal, juiceCleanseAddOns,
} from '../data/juiceCleanse.js';
import { juice as juicePhotos } from '../data/photos.js';
import { withAssets } from '../lib/assets.js';
import { layoutTiles } from '../lib/gridLayout.js';
import { site } from '../data/site.js';

export const isJuiceCleansePublished = () => juiceCleansePublished;

const MenuBlock = ({ title, note, items }) => `
  <div class="juice-menu-block reveal">
    <h3 class="tray-category-title">${esc(title)}${note ? ` <span class="tray-category-note">${esc(note)}</span>` : ''}</h3>
    ${MenuGrid(items)}
  </div>`;

export function renderJuiceCleanse() {
  if (!juiceCleansePublished) return '';

  // The menu card is promo art rather than photography, so it trails the bottles
  // the same way the meal prep flyers do.
  const photos = withAssets(juicePhotos);
  const shots = photos.filter((p) => !p.flyer);
  const flyers = photos.filter((p) => p.flyer);

  return `
    <div class="container">
      ${SectionHeader({
        eyebrow: juiceCleanseIntro.eyebrow,
        title: juiceCleanseIntro.title,
        titleId: 'juice-title',
        desc: juiceCleanseIntro.desc,
      })}

      <div class="plan-grid" data-reveal-stagger>
        ${join(juiceCleansePlans.map((p) => `<div class="reveal">${PlanCard({
          ...p,
          detail: `${p.juices} juices · ${p.days}`,
        })}</div>`))}
      </div>

      <p class="juice-note reveal">${esc(juiceCleanseNote)}</p>

      ${MenuBlock(juiceCleanseJuices)}
      ${MenuBlock(juiceCleanseShots)}
      ${MenuBlock(juiceCleanseHerbal)}

      <div class="tray-extras" data-reveal-stagger>
        <div class="reveal">${ChipList(juiceCleanseAddOns)}</div>
      </div>

      ${GalleryGrid(layoutTiles([...shots, ...flyers]), { id: 'juiceGrid' })
        .replace('<div class="gallery-grid"', '<div class="gallery-grid" data-lightbox-grid')}

      <div class="catering-cta reveal">
        <p>Start your reset. Pickup at ${esc(site.address.street)}.</p>
        <div class="catering-cta-actions">
          <a href="${esc(site.phone.href)}" class="btn btn-primary btn-lg">Call ${esc(site.phone.display)}</a>
          <a href="mailto:${esc(site.email)}" class="btn btn-outline btn-lg">Email to Order</a>
        </div>
      </div>
    </div>`;
}
