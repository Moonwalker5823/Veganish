// "Open now / Closed now" pill. The mount is an explicit [data-hours-pill]; the
// previous version walked up to .contact-item, so renaming that wrapper silently
// discarded the pill.
import { $ } from '../lib/dom.js';
import { openState } from '../lib/hours.js';
import { hours } from '../data/site.js';

export function initHoursPill() {
  const mount = $('[data-hours-pill]');
  if (!mount) return;

  const { isOpen, today } = openState(hours);
  if (!today) return;

  $(`[data-day="${today.day}"]`)?.classList.add('is-today');

  const pill = document.createElement('span');
  pill.className = `hours-pill ${isOpen ? 'is-open' : 'is-closed'}`;
  pill.textContent = isOpen ? 'Open now' : 'Closed now';
  mount.append(' ', pill);
}
