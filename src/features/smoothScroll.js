// Smooth in-page scrolling, offset for the fixed navbar.
import { reduceMotion } from '../lib/dom.js';

export function initSmoothScroll() {
  // Mirrors --nav-h in the stylesheet.
  const NAV_OFFSET = 80;

  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;

    const href = anchor.getAttribute('href');
    // querySelector('#') throws, and a bare "#" has no target anyway.
    if (!href || href === '#') return;

    let target;
    try { target = document.querySelector(href); } catch { return; }
    if (!target) return;

    e.preventDefault();
    window.scrollTo({
      top: target.getBoundingClientRect().top + window.scrollY - NAV_OFFSET,
      behavior: reduceMotion.matches ? 'auto' : 'smooth',
    });

    // Move keyboard focus along with the viewport.
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
    target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });

    if (history.replaceState) history.replaceState(null, '', href);
  });
}

export function initFooterYear() {
  const el = document.getElementById('footerYear');
  if (el) el.textContent = String(new Date().getFullYear());
}
