// Collects tiles from every [data-lightbox-grid] into one ordered list sharing a
// single modal, so arrowing runs across grids. The previous version bound to
// #galleryGrid alone, which would have left the catering and meal-prep grids dead.
import { $, $$, reduceMotion, scrollLock } from '../lib/dom.js';

export function initLightbox(gridSelector = '[data-lightbox-grid]') {
  const box = $('#lightbox');
  const img = $('#lightboxImg');
  const caption = $('#lightboxCaption');
  if (!box || !img || !caption) return;

  const grids = $$(gridSelector);
  if (!grids.length) return;

  let items = [];
  let index = 0;
  let lastFocused = null;

  function show(i) {
    index = (i + items.length) % items.length;
    const source = $('img', items[index]);
    if (!source) return;
    img.src = source.currentSrc || source.src;
    img.alt = source.alt || '';
    caption.textContent = items[index].dataset.caption || source.alt || '';
  }

  function open(tile) {
    const i = items.indexOf(tile);
    if (i === -1) return;
    lastFocused = document.activeElement;
    show(i);
    box.hidden = false;
    scrollLock.lock();
    requestAnimationFrame(() => box.classList.add('open'));
    $('#lightboxClose')?.focus();
  }

  function close() {
    box.classList.remove('open');
    scrollLock.unlock();
    const finish = () => { box.hidden = true; img.removeAttribute('src'); };
    if (reduceMotion.matches) finish();
    else setTimeout(finish, 250);
    lastFocused?.focus();
  }

  // Delegated per grid, so tiles rendered later still work without rebinding.
  for (const grid of grids) {
    grid.addEventListener('click', (e) => {
      const tile = e.target.closest('.gallery-item');
      if (tile && grid.contains(tile)) {
        // Rebuild on open: grids may have been re-rendered since load.
        items = grids.flatMap((g) => $$('.gallery-item', g));
        open(tile);
      }
    });
  }

  $('#lightboxClose')?.addEventListener('click', close);
  $('#lightboxPrev')?.addEventListener('click', () => show(index - 1));
  $('#lightboxNext')?.addEventListener('click', () => show(index + 1));

  // Clicking the backdrop (but not the photo or controls) closes.
  box.addEventListener('click', (e) => { if (e.target === box) close(); });

  document.addEventListener('keydown', (e) => {
    if (box.hidden) return;
    if (e.key === 'Escape') { e.preventDefault(); close(); }
    if (e.key === 'ArrowRight') { e.preventDefault(); show(index + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); show(index - 1); }
    if (e.key === 'Tab') {
      // Focus trap across the dialog's three controls.
      const focusables = $$('button', box);
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
}
