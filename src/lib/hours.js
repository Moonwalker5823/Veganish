// Opening-hours logic, evaluated in the cafe's timezone rather than the visitor's.
// Ported from the original main.js:801-838.

import { TIMEZONE } from '../data/site.js';

const toMinutes = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

function nowAtCafe(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: TIMEZONE, weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false,
  }).formatToParts(date);

  const get = (type) => parts.find((p) => p.type === type)?.value ?? '';
  const day = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[get('weekday')];
  // Some engines report "24" at midnight.
  const hour = Number(get('hour')) % 24;
  return { day, minutes: hour * 60 + Number(get('minute')) };
}

/** `{ isOpen, today }` for the given hours table. */
export function openState(hours, date = new Date()) {
  const { day, minutes } = nowAtCafe(date);
  if (day === undefined) return { isOpen: false, today: null };

  const today = hours.find((h) => h.day === day) ?? null;
  const isOpen = Boolean(
    today && !today.closed && minutes >= toMinutes(today.open) && minutes < toMinutes(today.close)
  );
  return { isOpen, today };
}

/** "10:00 AM – 7:30 PM" */
export function formatRange(entry) {
  if (!entry || entry.closed) return 'Closed';
  const fmt = (hhmm) => {
    const [h, m] = hhmm.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 === 0 ? 12 : h % 12;
    return `${hour12}:${String(m).padStart(2, '0')} ${period}`;
  };
  return `${fmt(entry.open)} – ${fmt(entry.close)}`;
}

/** schema.org openingHoursSpecification, derived rather than hand-maintained. */
export function toSchemaHours(hours) {
  const open = hours.filter((h) => !h.closed);
  const groups = new Map();
  for (const h of open) {
    const key = `${h.open}-${h.close}`;
    if (!groups.has(key)) groups.set(key, { opens: h.open, closes: h.close, dayOfWeek: [] });
    groups.get(key).dayOfWeek.push(h.label);
  }
  return [...groups.values()].map((g) => ({ '@type': 'OpeningHoursSpecification', ...g }));
}
