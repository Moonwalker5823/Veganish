// Reviews carousel. Breakpoints come from lib/breakpoints.js; retyping them here
// is what caused the off-by-one at exactly 768px and 1024px previously.
import { $, $$, rafThrottle, reduceMotion } from '../lib/dom.js';
import { mq } from '../lib/breakpoints.js';

export function initReviewsCarousel() {
  const track = $('#reviewsTrack');
  const viewport = $('#reviewsViewport');
  const dotsEl = $('#reviewsDots');
  const prevBtn = $('#reviewsPrev');
  const nextBtn = $('#reviewsNext');
  if (!track || !viewport) return;

  const cards = $$('.review-card', track);
  if (!cards.length) return;

  const INTERVAL = 6000;
  let current = 0;
  let timer = null;
  let dots = [];

  const perView = () => (mq('tablet').matches ? 1 : mq('desktop').matches ? 2 : 3);
  const maxIndex = () => Math.max(0, cards.length - perView());

  function stride() {
    if (cards.length > 1) {
      const delta = cards[1].offsetLeft - cards[0].offsetLeft;
      if (delta > 0) return delta;
    }
    return cards[0].offsetWidth + (parseFloat(getComputedStyle(track).columnGap) || 24);
  }

  function render() {
    track.style.transform = `translate3d(-${current * stride()}px, 0, 0)`;
    dots.forEach((d, i) => {
      const on = i === current;
      d.classList.toggle('active', on);
      d.setAttribute('aria-current', String(on));
    });
    if (prevBtn) prevBtn.disabled = current === 0;
    if (nextBtn) nextBtn.disabled = current === maxIndex();
    cards.forEach((card, i) => {
      const shown = i >= current && i < current + perView();
      // Keep offscreen cards out of the tab order so keyboard focus can't scroll
      // the clipped track sideways.
      card.querySelectorAll('a, button').forEach((el) => { el.tabIndex = shown ? 0 : -1; });
    });
  }

  function goTo(n) { current = Math.max(0, Math.min(n, maxIndex())); render(); }
  function start() {
    stop();
    if (reduceMotion.matches || document.hidden || maxIndex() === 0) return;
    timer = setInterval(() => goTo(current >= maxIndex() ? 0 : current + 1), INTERVAL);
  }
  function stop() { clearInterval(timer); timer = null; }
  const nudge = (fn) => () => { stop(); fn(); start(); };

  // Dots are generated from the real page count so they can't drift out of sync
  // with the number of reviews or the current breakpoint.
  function buildDots() {
    if (!dotsEl) return;
    dotsEl.innerHTML = '';
    const pages = maxIndex() + 1;
    dots = Array.from({ length: pages }, (_, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'rdot';
      b.setAttribute('aria-label', `Show reviews starting at ${i + 1} of ${cards.length}`);
      b.addEventListener('click', nudge(() => goTo(i)));
      dotsEl.appendChild(b);
      return b;
    });
    dotsEl.hidden = pages <= 1;
  }

  prevBtn?.addEventListener('click', nudge(() => goTo(current - 1)));
  nextBtn?.addEventListener('click', nudge(() => goTo(current + 1)));

  viewport.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); nudge(() => goTo(current + 1))(); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); nudge(() => goTo(current - 1))(); }
  });

  let startX = 0, startY = 0, tracking = false;
  viewport.addEventListener('touchstart', (e) => {
    tracking = true;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    stop();
  }, { passive: true });

  viewport.addEventListener('touchend', (e) => {
    if (!tracking) return;
    tracking = false;
    const dx = e.changedTouches[0].clientX - startX;
    const dy = e.changedTouches[0].clientY - startY;
    // Ignore mostly-vertical drags so we don't hijack page scrolling.
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) goTo(current + (dx < 0 ? 1 : -1));
    start();
  }, { passive: true });

  viewport.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') stop(); });
  viewport.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') start(); });
  viewport.addEventListener('focusin', stop);
  viewport.addEventListener('focusout', start);

  const onResize = rafThrottle(() => { buildDots(); goTo(current); });
  window.addEventListener('resize', onResize, { passive: true });
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));

  buildDots();
  goTo(0);
  start();
}
