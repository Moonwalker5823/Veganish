// Meal Prep menu.
// Transcribed from the flyer Nate sent (Oct 2026 batch, 1000023595.jpg).
// Note: the printed flyer misspells "Asparagus" as "Aspararagus" - corrected here.
// Flag that to Nate so the printed version gets fixed too.

export const mealPrepIntro = {
  eyebrow: 'Meal Prep Mondays',
  title: 'Lunch and Dinner, Handled',
  desc: 'Pick your proteins, sides and soups. We cook, portion and pack the week for you.',
};

export const mealPrepPlans = [
  { id: '4-day', days: 4, meals: 8, perDay: 2, price: 175, label: '4 Day Meal Prep' },
  { id: '5-day', days: 5, meals: 10, perDay: 2, price: 200, label: '5 Day Meal Prep', featured: true },
];

export const mealPrepChoices = [
  {
    id: 'proteins',
    title: 'Proteins',
    items: [
      'Vegan BBQ Pulled Pork', "Sweet Chili Vegan Chick'n", 'Meatless Meatloaf',
      'Cajun Bean Stew', 'Vegan Lasagna', 'Curry Chickpeas', 'Vegan Crabless Cakes',
    ],
  },
  {
    id: 'sides',
    title: 'Sides',
    items: [
      'Basmati Rice', 'Quinoa', 'Baked Sweet Potatoes', 'Squash',
      'Cabbage', 'Asparagus', 'Broccoli', 'Mixed Vegetables',
    ],
  },
  {
    id: 'soups-salads',
    title: 'Soups & Salads',
    items: ['Red Peas & Okra', 'Lentil & Pumpkin', 'Vegan Cobb', 'Vegan Caesar Salad'],
  },
];
