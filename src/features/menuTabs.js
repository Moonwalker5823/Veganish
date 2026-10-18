// WAI-ARIA tabs, scoped per container so independent tab groups can coexist.
// The previous version used page-global selectors and hid every panel that
// wasn't the target, so a second tab group would have blanked the first.
import { $, $$, reduceMotion } from '../lib/dom.js';

/** @param {HTMLElement} container element wrapping one tablist + its panels */
function initOne(container) {
  const tablist = $('[role="tablist"]', container);
  const tabs = $$('.tab-btn', container);
  const panels = $$('.menu-panel', container);
  if (!tabs.length || !panels.length) return;

  /** Restarts the staggered card entrance. Capped so a 12-item panel isn't slow. */
  function animatePanel(panel) {
    if (reduceMotion.matches) return;
    $$('.menu-card', panel).forEach((card, i) => {
      card.style.setProperty('--stagger', `${Math.min(i, 8) * 45}ms`);
    });
    panel.classList.remove('panel-animate');
    void panel.offsetWidth; // force reflow so the animation replays
    panel.classList.add('panel-animate');
  }

  function select(tab, { focus = false } = {}) {
    const target = $(`#${CSS.escape(tab.dataset.tab)}`, container)
      || $(`[data-panel="${CSS.escape(tab.dataset.tab)}"]`, container);
    if (!target) return;

    for (const t of tabs) {
      const on = t === tab;
      t.classList.toggle('active', on);
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
    }
    for (const p of panels) {
      const on = p === target;
      p.classList.toggle('active', on);
      p.hidden = !on;
    }

    animatePanel(target);
    if (focus) tab.focus();
  }

  tabs.forEach((tab) => tab.addEventListener('click', () => select(tab)));

  tablist?.addEventListener('keydown', (e) => {
    const i = tabs.indexOf(document.activeElement);
    if (i === -1) return;
    const moves = {
      ArrowRight: (i + 1) % tabs.length,
      ArrowLeft: (i - 1 + tabs.length) % tabs.length,
      Home: 0,
      End: tabs.length - 1,
    };
    const next = moves[e.key];
    if (next === undefined) return;
    e.preventDefault();
    select(tabs[next], { focus: true });
  });

  // Animate the initially-open panel when this group scrolls into view.
  const active = panels.find((p) => p.classList.contains('active'));
  if (active) {
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { animatePanel(active); io.disconnect(); }
    }, { threshold: 0.05 });
    io.observe(container);
  }
}

/** Initialises every tab group on the page independently. */
export function initMenuTabs(selector = '[data-tabs]') {
  $$(selector).forEach(initOne);
}
