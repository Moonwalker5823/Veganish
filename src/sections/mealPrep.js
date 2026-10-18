// Meal Prep section - built from src/data/mealPrep.js.
import { SectionHeader, PlanCard, ChipList, GalleryGrid } from '../components/index.js';
import { esc, join } from '../lib/html.js';
import { mealPrepIntro, mealPrepPlans, mealPrepChoices } from '../data/mealPrep.js';
import { mealprep as mealPrepPhotos } from '../data/photos.js';
import { withAssets } from '../lib/assets.js';
import { layoutTiles } from '../lib/gridLayout.js';
import { site } from '../data/site.js';

export function renderMealPrep() {
  // Flyers carry their own typography and read as promo art, so they trail the
  // food photography rather than mixing into it.
  const photos = withAssets(mealPrepPhotos);
  const dishes = photos.filter((p) => !p.flyer);
  const flyers = photos.filter((p) => p.flyer);

  return `
    <div class="container">
      ${SectionHeader({
        eyebrow: mealPrepIntro.eyebrow,
        title: mealPrepIntro.title,
        titleId: 'mealprep-title',
        desc: mealPrepIntro.desc,
      })}

      <div class="plan-grid" data-reveal-stagger>
        ${join(mealPrepPlans.map((p) => `<div class="reveal">${PlanCard(p)}</div>`))}
      </div>

      <div class="tray-extras" data-reveal-stagger>
        ${join(mealPrepChoices.map((c) => `<div class="reveal">${ChipList(c)}</div>`))}
      </div>

      ${GalleryGrid(layoutTiles([...dishes, ...flyers]), { id: 'mealPrepGrid' })
        .replace('<div class="gallery-grid"', '<div class="gallery-grid" data-lightbox-grid')}

      <div class="catering-cta reveal">
        <p>Order your week. Pickup at ${esc(site.address.street)}.</p>
        <div class="catering-cta-actions">
          <a href="${esc(site.phone.href)}" class="btn btn-primary btn-lg">Call ${esc(site.phone.display)}</a>
          <a href="mailto:${esc(site.email)}" class="btn btn-outline btn-lg">Email to Order</a>
        </div>
      </div>
    </div>`;
}
