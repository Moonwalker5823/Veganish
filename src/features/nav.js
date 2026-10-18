// Navbar + mobile overlay.
import { $, $$, rafThrottle, scrollLock } from '../lib/dom.js';
import { BREAKPOINTS } from '../lib/breakpoints.js';

export function initNav() {
  const navbar = $('#navbar');
  const navToggle = $('#navToggle');
  const navLinks = $('#navLinks');
  if (!navbar) return;

  const onScroll = rafThrottle(() => navbar.classList.toggle('scrolled', window.scrollY > 60));
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
    if (open) scrollLock.lock(); else scrollLock.unlock();
  }

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
  const links = new Map();
  for (const link of $$('.nav-link')) {
    const id = link.getAttribute('href')?.slice(1);
    if (id) links.set(id, link);
  }
  if (!links.size) return;

  const sections = [...links.keys()]
    .map((id) => document.getElementById(id))
    .filter(Boolean);
  if (!sections.length) return;

  const visible = new Set();
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) visible.add(entry.target.id);
      else visible.delete(entry.target.id);
    }
    // Topmost visible section wins, so the highlight tracks reading position.
    const active = sections.find((s) => visible.has(s.id));
    links.forEach((link, id) => link.classList.toggle('active', id === active?.id));
  }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });

  sections.forEach((s) => observer.observe(s));
}
