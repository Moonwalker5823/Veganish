import { SectionHeader, HighlightCard } from '../components/index.js';
import { join } from '../lib/html.js';
import { highlights } from '../data/highlights.js';
import { asset } from '../lib/assets.js';
import { pickRandom } from '../lib/pick.js';

/* The section shows four, drawn at random from the whole pool, so repeat
   visitors don't land on the same four every time. The pool is meant to hold
   twelve - three screens' worth - and anything in src/data/highlights.js is
   eligible. Four is what the row fits at full card width; see highlights.css for
   why the grid is flex, which also means a pool shorter than four still lays out
   rather than leaving a hole. */
const SHOWN = 4;

export function renderHighlights() {
  // Pinned cards hold their place in every draw; the rest of the row is filled
  // at random from what's left. Pinned ones lead so the row doesn't reshuffle
  // around them between loads. More pinned cards than SHOWN would crowd the
  // random ones out entirely, so the pinned set is capped at SHOWN too.
  const pinned = highlights.filter((h) => h.pinned).slice(0, SHOWN);
  const rest = highlights.filter((h) => !h.pinned);
  const shown = [...pinned, ...pickRandom(rest, SHOWN - pinned.length)];
  return `
    <div class="container">
      ${SectionHeader({ eyebrow: 'Notable Moments', title: 'Where Community Meets', titleId: 'highlights-title' })}
      <div class="highlights-grid" data-reveal-stagger>
        ${join(shown.map((h) => HighlightCard({ ...h, img: asset(h.img) })))}
      </div>
    </div>`;
}
