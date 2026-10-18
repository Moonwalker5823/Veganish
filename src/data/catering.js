// Catering menu.
// Transcribed from the printed menu Nate sent (Oct 2026 batch, IMG_0261/IMG_0262).
// Prices are strings because some items are market price rather than a number.

export const cateringIntro = {
  eyebrow: 'Catering by Veganish',
  title: 'Where Vegan Comfort Meets Elevated Cuisine',
  // Mission statement, verbatim from the brochure.
  mission:
    "Veganish's mission is to create bold satisfying vegan comfort food honoring familiar " +
    'traditions and reimagining inspired favorites elevated through thoughtful preparation, ' +
    'quality ingredients, and soulful flavor.',
  terms: '48–72 hour advance notice required. Minimum order applies.',
};

/** Tray categories. `full` / `half` are pan prices; `null` means market price. */
export const cateringTrays = [
  {
    id: 'proteins',
    title: 'Protein Trays',
    items: [
      { name: 'Fried Oyster Mushroom', full: 170, half: 85, marketPrice: true, desc: 'Crispy golden oyster mushrooms, lightly seasoned with a tender meaty bite that brings a soulful crunch with each bite.' },
      { name: 'Vegan Pulled Pork', full: 130, half: 65, desc: 'Sweet, smoky jackfruit shredded to perfection and glazed in a rich BBQ sauce that melts in your mouth.' },
      { name: 'Vegan Curry Chunks', full: 120, half: 60, desc: 'Hearty, flavorful veggie chunks and chickpeas bathed in a vibrant yet creamy coconut sauce that warms the soul.' },
      { name: 'Vegan Meatless Meatloaf', full: 150, half: 75, marketPrice: true, desc: 'A hearty plant based classic made with pure comfort and warmth in mind. Our savory loaf is satisfyingly rich and 100 percent plant powered.' },
      { name: 'Vegan Fried Calamari', full: 130, half: 65, desc: 'Lightly breaded king oyster mushroom bites fried golden, seasoned with a crisp finish that rivals the real deal.' },
      { name: 'Brown Stew Veggie Chunks', full: 120, half: 60, desc: 'Slow cooked chickpeas and veggie chunks simmered in an aromatic and savory stew. Full of bold flavors and soul.' },
      { name: 'Vegan Crabless Cakes', full: 160, half: 80, desc: 'Crispy on the outside, tender and full of flavor on the inside. A light crisp take on a traditional seaside favorite.' },
    ],
  },
  {
    id: 'specialty',
    title: 'Base & Specialty Trays',
    items: [
      { name: 'Coconut Rice', full: 130, half: 65 },
      { name: 'Quinoa & Wild Rice', full: 150, half: 75 },
      { name: 'Basmati Rice', full: 100, half: 50 },
      { name: 'Seafood Platter', full: 200, half: 100, desc: 'A coastal inspired feast featuring a flavorful medley of our vegan seafood favorites. Crispy fysh bites, golden crabless cakes, tender calamari and fried corn. Served with a house made remoulade and garnished with lemon wedges.' },
      { name: 'Vegan Lasagna', full: 180, half: 90, desc: 'Layers of tender pasta, richly seasoned veggie crumbles and creamy plant based cheesy goodness baked to perfection in a fragrant tomato basil sauce until beautifully golden.' },
      { name: 'Eggplant Parm', full: 160, half: 80, desc: 'Hand breaded eggplant slices layered with a slow simmered marinara and vegan mozzarella. A timeless Italian dish with hearty, heartwarming flavor.' },
      { name: 'Vegan Sweet Chilli Salmon', full: 190, half: 95, halfNote: '6 pc', marketPrice: true, desc: 'Tender plant based salmon glazed in a warm sweet chilli glaze. Seared to perfection for a vibrant caramelized finish.' },
      { name: 'Vegan Sirloin', full: 250, half: 125, marketPrice: true, desc: 'A classically crafted tender cut of plant based perfection. Pan seared with a rich garlic finish that is both elegant and deeply satisfying.' },
    ],
  },
  {
    id: 'sides',
    title: 'Side Trays',
    items: [
      { name: 'Mac & Cheese', full: 170, half: 85 },
      { name: 'Fried Cauliflower', full: 110, half: 55 },
      { name: 'Potato Salad', full: 130, half: 65 },
      { name: 'Collard Greens', full: 100, half: 50 },
      { name: 'Candied Yams', full: 120, half: 60 },
      { name: 'Lentil Meatballs', full: 180, half: 90 },
      { name: 'Empanadas', full: 120, half: 60 },
      { name: 'Falafel', full: 90, half: 45 },
      { name: 'Steamed Broccoli', full: 80, half: 40 },
      { name: 'Cabbage & Mixed Vegetables', full: 100, half: 50 },
    ],
  },
];

/** Priced per 32oz container rather than by pan. */
export const cateringSoups = {
  title: 'Soups',
  note: '32 oz',
  items: [
    { name: 'Lentil Pumpkin', price: 25 },
    { name: 'Red Bean & Okra', price: 25 },
    { name: 'Wild Mushroom & Onion', price: 25 },
    { name: 'Lasagna', price: 30 },
  ],
};

export const cateringSauces = {
  title: 'Sauces',
  items: ['Sweet Chilli', 'Sweet Chilli Jerk', 'BBQ', 'Orange Ginger', 'Avocado Aioli', 'Bang Bang'],
};

export const cateringDesserts = {
  title: 'Desserts',
  items: ['Vegan Chocolate Cookie Platter', 'Decadent Chocolate Lava Cake', 'Vegan Brownie Bites'],
};

/** From the brochure's "We cater brunch too!" panel. */
export const cateringBrunch = {
  title: 'We Cater Brunch Too',
  items: [
    'Fried Corn', 'The Nitty Grittys', 'The V-Scrambler', 'Tofu Scrambler',
    'Very Berry Pancakes', 'Cinnamon Sweet Potato Pancakes', 'Upside-Down Pineapple Pancakes',
    'Stuffed Sweet Potato French Toast', 'Loaded Nachos', 'Crispy Fish Bites',
  ],
};
