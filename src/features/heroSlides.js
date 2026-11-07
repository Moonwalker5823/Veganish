// Fills the hero slideshow from src/data/heroSlides.js, a fresh draw per visit.
//
// Runs before initSlideshow, which reads whatever slides are in the DOM and
// builds its dots from them - so the count stays honest without it knowing
// anything about the pool.
import { $ } from '../lib/dom.js';
import { asset } from '../lib/assets.js';
import { pickRandom } from '../lib/pick.js';
import { heroSlides, SHOWN } from '../data/heroSlides.js';

export function initHeroSlides() {
  const wrap = $('#heroSlides');
  if (!wrap || !heroSlides.length) return;

  // Width is read once, like every other breakpoint here: a resize past 1024
  // won't pull the chef slide in until reload.
  const w = window.innerWidth;
  const eligible = heroSlides.filter((s) => !s.minWidth || w >= s.minWidth);
  if (!eligible.length) return;

  const pinned = eligible.filter((s) => s.pinned).slice(0, SHOWN);
  const rest = eligible.filter((s) => !s.pinned);
  const chosen = [...pinned, ...pickRandom(rest, SHOWN - pinned.length)];

  // Built as one string rather than appended one by one, so the browser lays the
  // hero out once instead of five times.
  wrap.innerHTML = chosen
    .map((s, i) => {
      const pos = s.position ? `;background-position:${s.position}` : '';
      return `<div class="hero-slide${i === 0 ? ' active' : ''}" style="background-image:url('${asset(s.src)}')${pos}"></div>`;
    })
    .join('');
}
