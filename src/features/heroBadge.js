// The hero announcement strip. Rotates through src/data/announcements.js.
//
// The hero is static markup rather than a rendered section, so this writes into
// the placeholder instead of returning a string the way the sections do.
import { $, reduceMotion } from '../lib/dom.js';
import { esc } from '../lib/html.js';
import { pickRandom } from '../lib/pick.js';
import { announcements } from '../data/announcements.js';

const INTERVAL = 6000;

export function initHeroBadge() {
  let el = $('#heroBadge');
  if (!el || !announcements.length) return;

  // `days` scopes an announcement to weekdays - JS getDay(), 0 = Sunday, the
  // same convention src/data/hours.js uses. Undated ones always qualify. If a
  // day's filter leaves nothing, fall back to the full list rather than an
  // empty strip.
  const today = new Date().getDay();
  const dated = announcements.filter((a) => !a.days || a.days.includes(today));
  const eligible = dated.length ? dated : announcements;

  // Weight repeats an entry in the cycle, so a heavier one comes round more
  // often. Shuffled per visit so nobody always meets the same opener.
  const pool = eligible.flatMap((a) => Array(Math.max(1, a.weight ?? 1)).fill(a));
  const order = pickRandom(pool, pool.length);

  let i = 0;
  const render = (a) => {
    const lead = a.tag
      ? `<span class="badge-tag">${esc(a.tag)}</span>`
      : `<span class="badge-icon" aria-hidden="true">${esc(a.icon ?? '')}</span>`;
    const chevron = a.href ? '<span class="badge-chevron" aria-hidden="true"></span>' : '';
    const inner = `${lead}<span class="badge-text">${esc(a.text)}</span>${chevron}`;

    // Swapping the element rather than nesting a link, so the whole strip is the
    // target - it's 48px tall and a text-sized hit area inside it would be under
    // the touch minimum. A statement has no href, so it has to become a <p>.
    const wantsLink = Boolean(a.href);
    if (wantsLink === (el.tagName === 'A')) {
      if (wantsLink) el.setAttribute('href', a.href);
      el.innerHTML = inner;
      return;
    }
    const next = document.createElement(wantsLink ? 'a' : 'p');
    next.className = el.className;
    next.id = el.id;
    if (wantsLink) next.href = a.href;
    next.innerHTML = inner;
    el.replaceWith(next);
    el = next;
  };

  render(order[0]);
  if (order.length < 2) return;

  // Fade out, swap, fade in. Guarded on the class rather than a timer flag so a
  // swap interrupted by a tab switch can't leave it stuck at opacity 0.
  const advance = () => {
    const skip = order.length > 2 ? 1 : 0;
    let next = (i + 1) % order.length;
    if (skip && order[next] === order[i]) next = (next + 1) % order.length;
    i = next;
    el.classList.add('is-swapping');
    setTimeout(() => {
      render(order[i]);
      el.classList.remove('is-swapping');
    }, 300);
  };

  let timer = null;
  const stop = () => { clearInterval(timer); timer = null; el?.classList.remove('is-swapping'); };
  const start = () => {
    stop();
    // Honours the OS preference, same as the slideshow and the marquee: without
    // motion it just shows whichever one it opened on.
    if (reduceMotion.matches || document.hidden) return;
    timer = setInterval(advance, INTERVAL);
  };

  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
  reduceMotion.addEventListener('change', start);
  start();
}
