// Breakpoints for JS. The stylesheet hardcodes the same values in its media
// queries - CSS can't read custom properties inside @media, so these two have to
// be kept in step by hand. They previously drifted and broke the reviews carousel
// at exactly 768px and 1024px.
export const BREAKPOINTS = {
  mobile: 480,
  tablet: 768,
  desktop: 1024,
  // The nav collapses to the hamburger earlier than the rest: nine items stop
  // fitting on one line around 1050px.
  nav: 1024,
};

// Lazy so importing this doesn't require a `window`.
const cache = {};
export function mq(name) {
  cache[name] ??= window.matchMedia(`(max-width: ${BREAKPOINTS[name]}px)`);
  return cache[name];
}
