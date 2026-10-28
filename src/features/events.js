// Stops the site advertising dates that have passed. Cards carry
// data-event-date or data-event-dates; line-up rows expire individually so a
// partly-run series still reads correctly.
import { $, $$ } from '../lib/dom.js';
import { brandName } from '../lib/html.js';
import { scrollSpy } from '../lib/scrollSpy.js';

/** End of the given day, local time - an event isn't past while it's running. */
function endOfDay(iso) {
  const [y, m, d] = String(iso).trim().split('-').map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d, 23, 59, 59).getTime();
}

export function initEvents() {
  const section = $('#events');
  if (!section) return;

  const now = Date.now();
  let anyUpcoming = false;

  for (const card of $$('[data-event-date], [data-event-dates]', section)) {
    const raw = card.dataset.eventDates || card.dataset.eventDate || '';
    const stamps = raw.split(',').map(endOfDay).filter(Boolean);
    if (!stamps.length) continue;

    // Grey out individual line-up rows as their dates pass.
    for (const row of $$('[data-date]', card)) {
      const t = endOfDay(row.dataset.date);
      if (t && now > t) row.classList.add('is-past');
    }

    if (now <= Math.max(...stamps)) {
      anyUpcoming = true;
      const left = stamps.filter((t) => t >= now).length;
      if (left < stamps.length) {
        const eyebrow = $('[data-event-eyebrow]', card);
        if (eyebrow) eyebrow.textContent = `${left} date${left === 1 ? '' : 's'} left`;
      }
      continue;
    }

    card.classList.add('event-past');
    const eyebrow = $('[data-event-eyebrow]', card);
    if (eyebrow) eyebrow.textContent = 'Past Event';

    const cta = $('[data-event-cta]', card);
    if (cta) {
      cta.textContent = 'Follow us for the next one';
      cta.href = 'https://www.instagram.com/veganish_ct/';
      cta.target = '_blank';
      cta.rel = 'noopener noreferrer';
    }

    if (!$('.event-past-note', card)) {
      const note = document.createElement('p');
      note.className = 'event-past-note';
      note.textContent = 'This one has already happened — follow along on Instagram to hear about the next one first.';
      // Anchor on an explicit hook rather than guessing between two right-rail
      // variants: the original tried .event-details-box then .lineup-box and
      // silently dropped the note if a card had neither.
      ($('[data-event-note-anchor]', card) || $('.event-details-box', card) || $('.lineup-box', card))
        ?.insertAdjacentElement('afterend', note);
    }
  }

  // A weekly special has no last date, so it can't be expressed as a list of
  // days — it stays current indefinitely. data-event-recurring carries the
  // running label ("Every Sunday"), which replaces the announcement wording
  // once data-event-from has passed.
  for (const card of $$('[data-event-recurring]', section)) {
    anyUpcoming = true;
    const from = endOfDay(card.dataset.eventFrom);
    const eyebrow = $('[data-event-eyebrow]', card);
    if (eyebrow && from && now > from) eyebrow.textContent = card.dataset.eventRecurring;
  }

  // Don't call the section "What's On" when nothing is.
  if (!anyUpcoming) {
    const eyebrow = $('[data-events-eyebrow]', section);
    if (eyebrow) eyebrow.innerHTML = brandName('Recently at Veganish');
    const desc = $('[data-events-desc]', section);
    if (desc) desc.textContent = 'Here’s what we’ve been up to. Follow us on Instagram so you catch the next one live.';
  }

  // Event cards run 900-1700px tall, so a tighter band than the nav's -45%:
  // with that margin one card holds the highlight across the whole section.
  scrollSpy($$('[data-event-sub]'), { rootMargin: '-15% 0px -70% 0px' });
}
