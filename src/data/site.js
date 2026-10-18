// Business facts, single source. Previously duplicated across index.html - the
// phone number six times, hours three.

export const site = {
  name: 'Veganish Cafe',
  altName: "Vegan'ish Cafe",
  tagline: 'Flavorful. Plant-Based. Unapologetically Good.',
  ownership: 'Black Women Owned',
  owners: 'Chef Hannah & Nate Campbell',
  shortDesc: 'Bold, 100% plant-based soul food in Downtown Bridgeport.',

  phone: { display: '(203) 275-8924', href: 'tel:+12032758924' },
  email: 'veganish881@gmail.com',
  address: {
    street: '881 Lafayette Blvd',
    city: 'Bridgeport',
    region: 'CT',
    postalCode: '06604',
    get full() { return `${this.street}, ${this.city}, ${this.region} ${this.postalCode}`; },
  },

  rating: { value: 4.7, count: 171 },

  social: {
    instagram: 'https://www.instagram.com/veganish_ct/',
    instagramHandle: '@veganish_ct',
    facebook: 'https://www.facebook.com/profile.php?id=61559221286333',
  },

  ordering: {
    grubhub: 'https://www.grubhub.com/restaurant/veganish-cafe-881-lafayette-blvd-bridgeport/11368064',
    ubereats: 'https://www.ubereats.com/store/veganish-cafe/M534NMX0TJ2JhZ4s1W9c2g',
    // Waiting on the store's Clover Online Ordering URL. Commission-free, unlike the
    // delivery marketplaces, so it should become the primary CTA once it exists.
    // Dashboard > Account & Setup > Online Ordering > Providers > Clover > More Options.
    clover: null,
  },
};

/** `day` is JS getDay() (0 = Sunday). Drives the hours list, the pill and the JSON-LD. */
export const hours = [
  { day: 1, label: 'Monday', closed: true },
  { day: 2, label: 'Tuesday', open: '10:00', close: '19:30' },
  { day: 3, label: 'Wednesday', open: '10:00', close: '19:30' },
  { day: 4, label: 'Thursday', open: '10:00', close: '19:30' },
  { day: 5, label: 'Friday', open: '10:00', close: '19:30' },
  { day: 6, label: 'Saturday', open: '10:00', close: '18:30' },
  { day: 0, label: 'Sunday', open: '10:00', close: '18:30' },
];

export const hoursNotes = [
  'Brunch served all day Saturday & Sunday.',
  { text: 'Concert late nights run to 11:00 PM — schedule posted monthly on ', link: { href: 'https://www.instagram.com/veganish_ct/', label: 'Instagram' }, after: '.' },
];

export const TIMEZONE = 'America/New_York';
