// Juice Cleanse menu.
// Transcribed from the 180 Juice Cleanse & Herbal Health Bar menu Nate sent
// (Oct 2026 batch, thumbnail.jpeg).
//
// "Slimwass Tea" is spelled that way on the printed menu. Left as printed rather
// than corrected to a guess - flag it to Nate the way the meal prep flyer's
// "Aspararagus" was flagged.

export const juiceCleansePublished = true;

export const juiceCleanseIntro = {
  eyebrow: '180 Juice Cleanse & Herbal Health Bar',
  title: 'Fresh Ingredients. Real Wellness.',
  desc: 'Cold-pressed, plant-powered juices, wellness shots and herbal blends, pressed fresh at the bar.',
};

/**
 * Package tiers. `days` is a string because the larger packs are open-ended
 * ("3 days +"), and the section renders `juices` and `days` into one line.
 * Featured marks the lowest per-juice price: $7.92 against the $12.00 single.
 */
export const juiceCleansePlans = [
  { id: 'starter',  label: 'Starter Package',      juices: 4,  days: '1 day',    price: 40 },
  { id: 'moderate', label: 'Moderate 8 Pack',      juices: 8,  days: '2 days',   price: 76 },
  { id: 'all-in',   label: 'All-In Package',       juices: 12, days: '3 days',   price: 108 },
  { id: 'complete', label: '180 Complete 18 Pack', juices: 18, days: '3 days +', price: 153 },
  { id: 'extreme',  label: '180 Extreme 24 Pack',  juices: 24, days: '5 days +', price: 190, featured: true },
];

export const juiceCleanseNote = 'Pair with our vegan meal plans & meal prep for the ultimate reset.';

/** MenuCard shape: price is a display string, so ranges pass through intact. */
export const juiceCleanseJuices = {
  title: 'Signature Fresh Juices',
  note: '16 oz · Cold-pressed',
  items: [
    { name: 'Green Wave',       price: '$12.00', desc: 'Kale, cucumber, celery, apple, lemon, ginger' },
    { name: "Surf's Up",        price: '$12.00', desc: 'Pineapple, orange, mango, coconut water' },
    { name: 'Tropical Kiss',    price: '$12.00', desc: 'Pineapple, mango, orange, ginger' },
    { name: 'Island Blend',     price: '$12.00', desc: 'Mango, pineapple, orange, banana' },
    { name: '180 Peak',         price: '$12.00', desc: 'Beet, apple, carrot, lemon, ginger' },
    { name: 'Beet Blvd',        price: '$12.00', desc: 'Beet, carrot, apple, lemon, ginger' },
    { name: 'Sour Sop Twist',   price: '$12.00', desc: 'Pineapple, grapefruit, lime, mint' },
    { name: 'The Good Juice',   price: '$12.00', desc: 'Orange, carrot, apple, turmeric' },
    { name: '180 Splash',       price: '$12.00', desc: 'Watermelon, pineapple, mint, lime' },
    { name: 'Ultimate Cleanse', price: '$12.00', desc: 'Kale, spinach, cucumber, green apple, lemon' },
    { name: 'Cool Breeze',      price: '$12.00', desc: 'Cucumber, celery, apple, mint, lime' },
  ],
};

export const juiceCleanseShots = {
  title: 'Wellness Shots',
  note: 'Small bottles. Big benefits.',
  items: [
    {
      name: 'Energy Shot',
      price: '$5.00',
      desc: 'Ginger, turmeric, lemon, cayenne. Natural energy and focus.',
    },
    {
      // The menu footnotes the honey itself; carried as a tag so it reads on the
      // card rather than as small print the page would lose.
      name: 'Wellness Shot',
      price: '$5.00',
      desc: 'Ginger, lemon, honey, cayenne. Supports your natural defenses.',
      tags: ['Contains honey — not vegan'],
    },
  ],
};

export const juiceCleanseHerbal = {
  title: 'Herbal Drinks',
  note: 'Teas, blends & sea moss',
  items: [
    { name: 'Slimwass Tea',  price: '$4.00',          desc: 'Herbal blend for balance and wellness.' },
    { name: 'Big Kahuna',    price: '$6.00',          desc: 'Powerful herbal blend.' },
    { name: 'Sea Moss Jars', price: '$12.00 & up',    desc: 'Wildcrafted sea moss for daily support.' },
    { name: 'Herbal Blends', price: '$4.00 – $8.00',  desc: 'Seasonal and specialty blends.' },
  ],
};

export const juiceCleanseAddOns = {
  id: 'add-ons',
  title: 'Add-Ons',
  items: ['Sea moss jars & superfood blends — $12.00+', 'Meal plans / meal prep — ask for details'],
};
