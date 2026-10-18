/* ══════════════════════════════════════════
   VEGANISH CAFE — entry point

   Order matters: sections render their markup first, then features bind to it.
   Every feature is independently guarded, so one missing element can never take
   down the rest of the page.
══════════════════════════════════════════ */
import { $, mount } from './lib/dom.js';

import { renderMenu, menuSchema } from './sections/menu.js';
import { renderGallery } from './sections/gallery.js';
import { renderReviews } from './sections/reviews.js';
import { renderHighlights } from './sections/highlights.js';
import { renderCatering } from './sections/catering.js';
import { renderMealPrep } from './sections/mealPrep.js';
import { renderJuiceCleanse, isJuiceCleansePublished } from './sections/juiceCleanse.js';
import { renderContact, renderHoursList } from './sections/contact.js';

import { initMusic } from './features/music.js';
import { initIntro } from './features/intro.js';
import { initNav, initActiveNavLink } from './features/nav.js';
import { initMenuTabs } from './features/menuTabs.js';
import { initLightbox } from './features/lightbox.js';
import { initSlideshow } from './features/slideshow.js';
import { initReviewsCarousel } from './features/reviewsCarousel.js';
import { initHoursPill } from './features/hours.js';
import { initEvents } from './features/events.js';
import { initScrollReveal } from './features/scrollReveal.js';
import { initYouTube } from './features/youtube.js';
import { initSmoothScroll, initFooterYear } from './features/smoothScroll.js';

import { site, hours } from './data/site.js';
import { toSchemaHours } from './lib/hours.js';

/* ── 1. content ───────────────────────────── */
mount('#highlights', renderHighlights());
mount('#menu', renderMenu());
mount('#gallery', renderGallery());
mount('#catering', renderCatering());
mount('#mealprep', renderMealPrep());
mount('#reviews', renderReviews());
mount('#contact', renderContact());
mount('[data-hours-list]', renderHoursList());

// Unpublished sections are removed outright rather than hidden, so they can't be
// reached by keyboard, read by a screen reader, or indexed.
const juice = $('#juice');
if (isJuiceCleansePublished()) mount('#juice', renderJuiceCleanse());
else {
  juice?.remove();
  $('[data-nav-juice]')?.remove();
}

/* ── 2. structured data ───────────────────── */
// Derived from the same data the page renders, so it can't drift the way three
// hand-maintained copies of the hours did.
const ld = $('#ldJson');
if (ld) {
  ld.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    '@id': 'https://veganish-ct.vercel.app/#restaurant',
    name: site.name,
    alternateName: site.altName,
    description: `100% plant-based soul food cafe in Downtown Bridgeport, Connecticut. ${site.ownership} by ${site.owners}.`,
    url: 'https://veganish-ct.vercel.app/',
    telephone: '+1-203-275-8924',
    email: site.email,
    servesCuisine: ['Vegan', 'Soul Food', 'American', 'Plant-Based'],
    priceRange: '$$',
    paymentAccepted: 'Cash, Credit Card',
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      addressRegion: site.address.region,
      postalCode: site.address.postalCode,
      addressCountry: 'US',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: String(site.rating.value),
      reviewCount: String(site.rating.count),
    },
    openingHoursSpecification: toSchemaHours(hours),
    sameAs: [site.social.instagram, site.social.facebook],
    hasMenu: menuSchema(),
  });
}

/* ── 3. behaviour ─────────────────────────── */
const music = initMusic();
initIntro(music);
initNav();
initMenuTabs();        // scoped per [data-tabs] group
initLightbox();        // spans every [data-lightbox-grid]
initSlideshow();
initReviewsCarousel();
initHoursPill();
initEvents();
initYouTube();
initSmoothScroll();
initFooterYear();
initScrollReveal();
initActiveNavLink();   // last: needs the final set of sections in the DOM
