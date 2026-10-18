// Contact section. Every business fact comes from src/data/site.js - the phone
// number alone previously appeared six times across index.html.
import { SectionHeader } from '../components/index.js';
import { esc, join } from '../lib/html.js';
import { site, hours, hoursNotes } from '../data/site.js';
import { formatRange } from '../lib/hours.js';

export function renderHoursList() {
  return join(hours.map((h) => `
    <li data-day="${h.day}"${h.closed ? '' : ` data-open="${esc(h.open)}" data-close="${esc(h.close)}"`}>
      <span>${esc(h.label)}</span>
      <span${h.closed ? ' class="hours-closed"' : ''}>${esc(formatRange(h))}</span>
    </li>`));
}

function note(n) {
  if (typeof n === 'string') return esc(n);
  return `${esc(n.text)}<a href="${esc(n.link.href)}" target="_blank" rel="noopener noreferrer">${esc(n.link.label)}</a>${esc(n.after ?? '')}`;
}

export function renderContact() {
  const maps = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(site.address.full)}`;
  return `
    <div class="container">
      <div class="contact-grid">
        <div class="contact-info reveal">
          ${SectionHeader({ eyebrow: 'Come See Us', title: 'Visit Veganish Cafe', titleId: 'contact-title' })}
          <div class="contact-items">
            <div class="contact-item">
              <span class="contact-icon" aria-hidden="true">📍</span>
              <div>
                <strong>Location</strong>
                <address>${esc(site.address.street)}<br />${esc(site.address.city)}, ${esc(site.address.region)} ${esc(site.address.postalCode)}</address>
              </div>
            </div>
            <div class="contact-item">
              <span class="contact-icon" aria-hidden="true">🕐</span>
              <div>
                <strong data-hours-pill>Hours</strong>
                <ul class="hours-list" id="hoursList" data-hours-list></ul>
                <p class="hours-note">${join(hoursNotes.map((n) => note(n)))}</p>
              </div>
            </div>
            <div class="contact-item">
              <span class="contact-icon" aria-hidden="true">📞</span>
              <div><strong>Phone</strong><a href="${esc(site.phone.href)}">${esc(site.phone.display)}</a></div>
            </div>
            <div class="contact-item">
              <span class="contact-icon" aria-hidden="true">✉️</span>
              <div><strong>Email</strong><a href="mailto:${esc(site.email)}">${esc(site.email)}</a></div>
            </div>
          </div>
        </div>
        <div class="contact-map reveal">
          <iframe title="Map to Veganish Cafe" loading="lazy" referrerpolicy="no-referrer-when-downgrade"
            src="https://www.google.com/maps?q=${encodeURIComponent(site.address.full)}&output=embed"></iframe>
          <a href="${esc(maps)}" target="_blank" rel="noopener noreferrer" class="btn btn-primary map-directions">Get Directions</a>
        </div>
      </div>
    </div>`;
}
