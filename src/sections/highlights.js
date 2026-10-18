import { SectionHeader, HighlightCard } from '../components/index.js';
import { join } from '../lib/html.js';
import { highlights } from '../data/highlights.js';
import { asset } from '../lib/assets.js';

export function renderHighlights() {
  return `
    <div class="container">
      ${SectionHeader({ eyebrow: 'Notable Moments', title: 'Where Community Meets', titleId: 'highlights-title' })}
      <div class="highlights-grid" data-reveal-stagger>
        ${join(highlights.map((h) => HighlightCard({ ...h, img: asset(h.img) })))}
      </div>
    </div>`;
}
