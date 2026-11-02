// Navbar + mobile overlay.
import { $, $$, rafThrottle, scrollLock, root } from '../lib/dom.js';
import { scrollSpy } from '../lib/scrollSpy.js';
import { BREAKPOINTS } from '../lib/breakpoints.js';

export function initNav() {
  const navbar = $('#navbar');
  const navToggle = $('#navToggle');
  const navLinks = $('#navLinks');
  if (!navbar) return;

  // root carries the same flag so elements outside the navbar — the hero corner
  // link — can react when the dark bar comes in.
  const onScroll = rafThrottle(() => {
    const scrolled = window.scrollY > 60;
    navbar.classList.toggle('scrolled', scrolled);
    root.classList.toggle('is-scrolled', scrolled);
  });
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (!navToggle || !navLinks) return;

  function setMenu(open) {
    navLinks.classList.toggle('open', open);
    navToggle.classList.toggle('open', open);
    // Drops the navbar's backdrop-filter while open. Without this the filter makes
    // the navbar a containing block for the fixed overlay, collapsing it to navbar
    // height and throwing the first links above y=0 - see the note in the CSS.
    navbar.classList.toggle('menu-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    if (open) scrollLock.lock(); else { scrollLock.unlock(); closeSubs(); }
  }

  // Events disclosure. Mobile-only in CSS; desktop opens on hover/focus, so this
  // never fires there.
  const subToggles = $$('.nav-sub-toggle', navLinks);
  for (const toggle of subToggles) {
    toggle.addEventListener('click', () => {
      const parent = toggle.closest('.nav-has-sub');
      const open = parent.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
  }
  const closeSubs = () => {
    for (const toggle of subToggles) {
      toggle.closest('.nav-has-sub')?.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  };

  const isOpen = () => navLinks.classList.contains('open');
  navToggle.addEventListener('click', () => setMenu(!isOpen()));
  navLinks.addEventListener('click', (e) => { if (e.target.closest('a') && isOpen()) setMenu(false); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen()) { setMenu(false); navToggle.focus(); }
  });

  // Widening past the nav breakpoint must not leave the overlay latched open.
  const wide = window.matchMedia(`(min-width: ${BREAKPOINTS.nav + 1}px)`);
  wide.addEventListener('change', (e) => { if (e.matches && isOpen()) setMenu(false); });
}

/**
 * Resolves each nav href to its target directly. The previous version scanned
 * `main section[id]`, so wrapping a section one level deeper silently killed its
 * highlighting.
 */
export function initActiveNavLink() {
  scrollSpy($$('.nav-link'));
}
