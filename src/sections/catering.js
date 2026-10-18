// Catering section - built entirely from src/data/catering.js.
import { SectionHeader, TrayCategory, PricedList, ChipList, GalleryGrid } from '../components/index.js';
import { esc, join } from '../lib/html.js';
import { menuItem, menuSection, nameOnlySection, panOffers } from '../lib/schema.js';
import {
  cateringIntro, cateringTrays, cateringSoups, cateringSauces, cateringDesserts, cateringBrunch,
} from '../data/catering.js';
import { catering as cateringPhotos } from '../data/photos.js';
import { withAssets } from '../lib/assets.js';
import { layoutTiles } from '../lib/gridLayout.js';
import { site } from '../data/site.js';

export function renderCatering() {
  return `
    <div class="container">
      ${SectionHeader({
        eyebrow: cateringIntro.eyebrow,
        title: cateringIntro.title,
        titleId: 'catering-title',
        desc: cateringIntro.mission,
      })}

      <p class="catering-terms reveal">
        <strong>${esc(cateringIntro.terms)}</strong>
        <span class="catering-legend">M/P = market price, quoted when you book.</span>
      </p>

      <div class="tray-categories" data-reveal-stagger>
        ${join(cateringTrays.map((c) => `<div class="reveal">${TrayCategory(c)}</div>`))}
      </div>

      <div class="tray-extras" data-reveal-stagger>
        <div class="reveal">${PricedList(cateringSoups)}</div>
        <div class="reveal">${ChipList(cateringSauces)}</div>
        <div class="reveal">${ChipList(cateringDesserts)}</div>
        <div class="reveal">${ChipList(cateringBrunch)}</div>
      </div>

      ${GalleryGrid(layoutTiles(withAssets(cateringPhotos)), { id: 'cateringGrid' })
        .replace('<div class="gallery-grid"', '<div class="gallery-grid" data-lightbox-grid')}

      <div class="catering-cta reveal">
        <p>Planning something? Tell us the date, the headcount and the vibe.</p>
        <div class="catering-cta-actions">
          <a href="mailto:${esc(site.email)}" class="btn btn-primary btn-lg">Email ${esc(site.email)}</a>
          <a href="${esc(site.phone.href)}" class="btn btn-outline btn-lg">Call ${esc(site.phone.display)}</a>
        </div>
      </div>
    </div>`;
}

/** Tray prices are per pan, so each tray carries a Full Pan and a Half Pan offer. */
export const cateringSections = () => [
  ...cateringTrays.map((cat) =>
    menuSection(`Catering — ${cat.title}`, cat.items.map((i) =>
      menuItem({ name: i.name, desc: i.desc, offers: panOffers(i) })))),
  menuSection(`Catering — ${cateringSoups.title}`, cateringSoups.items.map(menuItem)),
  nameOnlySection(`Catering — ${cateringSauces.title}`, cateringSauces.items),
  nameOnlySection(`Catering — ${cateringDesserts.title}`, cateringDesserts.items),
  nameOnlySection(`Catering — ${cateringBrunch.title}`, cateringBrunch.items),
];
