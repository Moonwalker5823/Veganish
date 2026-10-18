// Hero slideshow. Dots are generated from the slide count; the hardcoded markup
// claimed "of 4" regardless of how many slides existed.
import { $, $$, reduceMotion } from '../lib/dom.js';

export function initSlideshow() {
  const slides = $$('.hero-slide');
  const dotsEl = $('.hero-slide-dots');
  const hero = $('.hero');
  if (slides.length < 2) return;

  const INTERVAL = 5000;
  let current = 0;
  let timer = null;

  if (dotsEl) dotsEl.innerHTML = '';

  const dots = slides.map((_, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'slide-dot';
    b.setAttribute('aria-label', `Show image ${i + 1} of ${slides.length}`);
    b.addEventListener('click', () => { goTo(i); start(); });
    dotsEl?.appendChild(b);
    return b;
  });

  function goTo(n) {
    const next = (n + slides.length) % slides.length;
    slides[current]?.classList.remove('active');
    dots[current]?.classList.remove('active');
    dots[current]?.removeAttribute('aria-current');
    current = next;
    slides[current]?.classList.add('active');
    dots[current]?.classList.add('active');
    dots[current]?.setAttribute('aria-current', 'true');
  }

  // Always clear first, or intervals stack and the slideshow accelerates.
  function start() {
    stop();
    if (reduceMotion.matches || document.hidden) return;
    timer = setInterval(() => goTo(current + 1), INTERVAL);
  }
  function stop() { clearInterval(timer); timer = null; }

  if (hero) {
    // Pointer-aware so a tap on touch doesn't stop autoplay forever.
    hero.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') stop(); });
    hero.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') start(); });
    hero.addEventListener('focusin', stop);
    hero.addEventListener('focusout', start);
  }
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
  reduceMotion.addEventListener('change', start);

  slides[0]?.classList.add('active');
  dots[0]?.classList.add('active');
  dots[0]?.setAttribute('aria-current', 'true');
  start();
}
