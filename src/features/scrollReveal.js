// Elements opt in with .reveal or [data-reveal]; stagger groups with
// [data-reveal-stagger]. The previous version held a hardcoded selector list, so
// new sections stayed invisible until someone remembered to extend it.
import { $$, reduceMotion } from '../lib/dom.js';

export function initScrollReveal() {
  if (reduceMotion.matches) return;

  const targets = $$('.reveal, [data-reveal]');
  if (!targets.length) return;

  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    }
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  for (const el of targets) {
    el.classList.add('reveal');
    observer.observe(el);
  }

  // Stagger siblings within each group rather than across the whole page.
  for (const group of $$('[data-reveal-stagger]')) {
    [...group.children].filter((el) => el.classList.contains('reveal')).forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i, 5) * 80}ms`;
    });
  }
}
