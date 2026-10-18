// Food gallery: the original nine plus the Oct 2026 plated shots.
import { SectionHeader, GalleryGrid } from '../components/index.js';
import { esc } from '../lib/html.js';
import { legacyGallery } from '../data/gallery.js';
import { withAssets } from '../lib/assets.js';
import { layoutTiles } from '../lib/gridLayout.js';
import { gallery as newGallery, brand } from '../data/photos.js';
import { site } from '../data/site.js';

function galleryPhotos() {
  const all = withAssets([...legacyGallery, ...newGallery, ...brand].map((p) => ({ ...p, size: undefined })));
  return layoutTiles(all);
}

export function renderGallery() {
  return `
    <div class="container">
      ${SectionHeader({
        eyebrow: 'From Our Kitchen',
        title: 'Food That Speaks For Itself',
        titleId: 'gallery-title',
      })}
      ${GalleryGrid(galleryPhotos(), { id: 'galleryGrid' })
        .replace('<div class="gallery-grid"', '<div class="gallery-grid" data-lightbox-grid data-reveal-stagger')}
      <div class="gallery-footer">
        <p>Follow along for daily food photos &amp; specials</p>
        <div class="gallery-footer-actions">
          <a href="${esc(site.social.instagram)}" target="_blank" rel="noopener noreferrer" class="btn btn-outline">
            ${esc(site.social.instagramHandle)}
          </a>
          <a href="${esc(site.social.facebook)}" target="_blank" rel="noopener noreferrer" class="btn btn-outline">
            Veganish CT
          </a>
        </div>
      </div>
    </div>`;
}
