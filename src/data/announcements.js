// The hero strip. One of these shows per visit, picked at random, so the line
// under the buttons carries something current instead of the same credential
// forever. It's also the only place Soul Food Sundays is announced now, which is
// why that one is weighted heaviest.
//
// Adding one: anything true and checkable. `href` makes the strip a link and
// adds a chevron; without it it's a statement. `tag` shows as the orange pill,
// `icon` as an emoji in the same slot - use one or the other. Keep `text` near
// the length of the longest below: it sits on two lines at 375 and one from 768,
// and much longer starts pushing the hero's buttons up on a phone.
//
// `weight` is how many times a line enters the cycle; everything defaults to 1,
// so a heavier one comes round more often.
//
// `days` limits a line to certain weekdays - JS getDay(), 0 = Sunday, the same
// convention src/data/hours.js uses. That's what a daily special wants:
//
//   { tag: 'Today', text: 'Jerk Chick\u2019n Wrap', href: '#menu', days: [2] }
//
// Leave it off and the line shows every day. If a day's filter leaves nothing,
// the full list is used rather than an empty strip.
export const announcements = [
  {
    tag: 'New',
    text: 'Soul Food Platter, every Sunday',
    href: '#soul-food-platter',
    weight: 3,
  },
  {
    tag: 'Award',
    text: 'Best of 2026 \u2014 Vegan Restaurant, Fairfield County',
    href: '#reviews',
    weight: 2,
  },
  {
    icon: '\u2b50',
    text: '4.7 from 171 Google reviews',
    href: '#reviews',
  },
  {
    icon: '\ud83c\udf96\ufe0f',
    text: 'As featured \u2014 Gov. Ned Lamont \u00b7 Rep. Jim Himes \u00b7 State Rep. Antonio Felipe',
  },
];
