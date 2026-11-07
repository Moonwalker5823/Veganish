// The hero slideshow pool. Five are drawn per visit, so the homepage isn't the
// same five photos every time.
//
// Rules for anything added here, both learned the hard way:
//
// 1. Landscape or square only. The slides are background-size:cover, so a
//    portrait photo gets cropped to its middle band - the chef portrait at 1920
//    showed y241-529 of 770, which was her chin. `position` overrides the focal
//    point when centre isn't right.
// 2. At least ~1000px wide, or it upscales past 2x at 1440 and looks soft.
// 3. Check it against the scrim before adding. The headline and subtitle sit on
//    top of whatever this is, and a bright plate can take the subtitle under its
//    contrast floor - that's what happened with the smothered plate at 768,
//    where 46% of it was unreadable. Every photo below was measured at 375, 768
//    and 1440: subtitle 0% under 3:1, headline at worst 0.01%.
// 4. Food only. Group shots cover-crop to a band that cuts everyone off at the
//    shins and puts faces behind the headline.
//
// `minWidth` keeps a slide off narrower screens; `pinned` keeps it in every
// draw, and pinned slides lead.
export const SHOWN = 5;

export const heroSlides = [
  // Below 1024 the hero is taller than it is wide, so this fills the full height
  // and her face lands behind the headline and the nav. Our Story carries her on
  // those widths instead.
  {
    src: 'assets/images/brand/chef-hannah-wide.webp',
    position: '70% center',
    minWidth: 1024,
    pinned: true,
  },

  { src: 'assets/images/food-1.webp' },
  { src: 'assets/images/gallery/smothered-mashed-potatoes.webp' },
  { src: 'assets/images/gallery/tenders-and-fries.webp' },
  { src: 'assets/images/gallery/brunch-platter.webp' },
  { src: 'assets/images/gallery/oyster-mushroom-salad.webp' },
  { src: 'assets/images/gallery/smash-burger-closeup.webp' },
  { src: 'assets/images/gallery/vegan-tacos.webp' },
  { src: 'assets/images/gallery/sweet-chili-cauliflower-platter.webp' },
  { src: 'assets/images/catering/chafing-setup.webp' },
  { src: 'assets/images/catering/fried-cauliflower-jalapeno.webp' },
  { src: 'assets/images/catering/fried-cauliflower-pan.webp' },
  { src: 'assets/images/catering/fried-chunks-peppers.webp' },
  { src: 'assets/images/mealprep/meal-prep-table.webp' },
  { src: 'assets/images/mealprep/meal-prep-variety.webp' },
];
