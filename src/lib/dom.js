// DOM helpers shared across every feature.

export const root = document.documentElement;
export const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

export const $ = (sel, ctx = document) => ctx.querySelector(sel);
export const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

/** Runs `fn` on the next frame, coalescing bursts of calls (scroll/resize). */
export function rafThrottle(fn) {
  let queued = false;
  return (...args) => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      fn(...args);
    });
  };
}

/**
 * Scroll locking is shared by the mobile nav and the lightbox, so it has to be
 * reference-counted - otherwise closing one re-enables scrolling under the other.
 */
export const scrollLock = (() => {
  let count = 0;
  return {
    lock() {
      if (count++ === 0) root.classList.add('scroll-locked');
    },
    unlock() {
      count = Math.max(0, count - 1);
      if (count === 0) root.classList.remove('scroll-locked');
    },
  };
})();

export { esc, join } from './html.js';

export function mount(selector, html, ctx = document) {
  const el = $(selector, ctx);
  if (!el) return null;
  el.innerHTML = html;
  return el;
}
