import { ReviewCard } from '../components/index.js';
import { esc, join } from '../lib/html.js';
import { asset } from '../lib/assets.js';
import { reviews } from '../data/reviews.js';
import { site } from '../data/site.js';

/* The plaque is decorative at this size - the caption carries the same words in
   real type, so the image is alt-empty to keep a screen reader from hearing it
   twice. */
function Award() {
  const a = site.award;
  return `
    <figure class="award">
      <img class="award-plaque" src="${asset(a.image)}" alt="" role="presentation"
           width="${a.width}" height="${a.height}" loading="lazy" decoding="async" />
      <figcaption class="award-text">
        <strong>${esc(a.title)} — ${esc(a.category)}</strong>
        <span>${esc(a.region)}</span>
        <span class="award-source">${esc(a.issuer)}, from ${esc(a.basis)}</span>
      </figcaption>
    </figure>`;
}

export function renderReviews() {
  return `
    <div class="container">
      <div class="section-header reveal">
        <span class="section-eyebrow">Reviews</span>
        <h2 class="section-title" id="reviews-title">What People Are Saying</h2>
        <p class="reviews-overall">
          <span aria-hidden="true">★★★★★</span>
          <strong>${site.rating.value}</strong> from ${site.rating.count} reviews
        </p>
        ${Award()}
      </div>
      <div class="reviews-carousel-wrap">
        <button type="button" class="reviews-arrow reviews-prev" id="reviewsPrev" aria-label="Previous reviews">←</button>
        <!-- .reviews-track-outer is the element the stylesheet clips with
             overflow:hidden. Naming this anything else lets the track expand to
             the full width of all eight cards and blows out the page. -->
        <div class="reviews-track-outer" id="reviewsViewport" tabindex="0"
             aria-live="polite" aria-label="Customer reviews">
          <div class="reviews-track" id="reviewsTrack">${join(reviews.map(ReviewCard))}</div>
        </div>
        <button type="button" class="reviews-arrow reviews-next" id="reviewsNext" aria-label="Next reviews">→</button>
      </div>
      <div class="reviews-dots" id="reviewsDots"></div>
    </div>`;
}
