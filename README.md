# Veganish CT — Official Website

Official website for **Veganish Cafe**, a Black women-owned vegan restaurant in Downtown Bridgeport, CT, founded by Nate & Hannah Campbell.

---

## 🌱 About

Veganish Cafe brings bold, plant-based soul food to Bridgeport's Lafayette Blvd. From smash burgers to weekend brunch spreads, every dish is crafted with love and seasoned with culture. The cafe has hosted Governor Ned Lamont, Congressman Jim Himes, and State Representative Antonio Felipe.

---

## 🛠 Tech Stack

- **Vanilla HTML / CSS / JavaScript** — no framework
- **Vite** — dev server & build tool
- **Google Fonts** — Playfair Display, Inter, Dancing Script
- **Deployed on Vercel**

---

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Runs on `http://localhost:5173`

> **Run it with Vite, not Live Server.** Files in `public/` (the background
> music, favicon, `robots.txt`, `sitemap.xml`) are served from the site root by
> Vite and by the production build. A plain static server will 404 on them.

### Build for production

```bash
npm run build
```

Output goes to `dist/`

### Preview production build

```bash
npm run preview
```

---

## 📁 Project Structure

```
veganish/
├── index.html          # Single-page app entry + LocalBusiness JSON-LD
├── css/
│   └── styles.css      # All styles & animations
├── js/
│   └── main.js         # Interactivity (loaded as type="module")
├── assets/
│   └── images/         # Photos, referenced from HTML so Vite hashes them
├── public/             # Copied to the site root verbatim
│   ├── audio/          # Background music track
│   ├── favicon.svg
│   ├── og-image.jpg
│   ├── robots.txt
│   └── sitemap.xml
├── vite.config.js
└── package.json
```

### Things that will bite you

- **`js/main.js` must stay `type="module"`.** Vite silently refuses to bundle a
  classic `<script src>`, which ships an `index.html` pointing at a file that
  doesn't exist in `dist/` — a blank page in production.
- **Don't add broad ignore patterns** (`*.webp`, `*.jpg`) to `.gitignore`. The
  site's own images live in `assets/images/` and must be committed.
- **Static assets go in `public/`,** not `assets/`, unless they're referenced
  from HTML/CSS. Vite only fingerprints what it can see in the markup, and
  `<audio src>` is not one of the attributes it rewrites.

### Content that maintains itself

- **Events** carry `data-event-date="YYYY-MM-DD"` (or `data-event-dates="a,b,c"`).
  Once every date on a card has passed it flips to a "Past Event" treatment and
  the section retitles itself. Add a new event by copying a card and setting the
  date — no other edits needed.
- **Opening hours** live in one place: the `#hoursList` markup. The "Open now /
  Closed now" pill is derived from it in the cafe's timezone. Keep it in sync
  with the `openingHoursSpecification` in the JSON-LD block in `<head>`.
- **Footer year** updates itself.

### Ordering links

Grubhub and Uber Eats are hardcoded in two places each — the order banner (`#order`) and the
footer's "Order & Connect" list. Keep them in sync.

**Clover Online Ordering is staged but not live.** Both spots carry a commented-out
`TODO(clover)` block waiting on the store's ordering URL. The cafe finds it in the Clover
Dashboard under *Account & Setup → Online Ordering*, then *Online Ordering Providers → Clover
→ "More Options"*. When it lands, un-comment both blocks, paste the URL over
`CLOVER_ORDERING_URL`, and drop the phone button to `btn-outline` so Clover is the only
primary CTA — it's commission-free, unlike the delivery marketplaces.

---

## ✨ Features

- **Animated intro splash** with SVG logo draw animation
- **Hero slideshow** — 5 slides, auto-advances every 5s, dot navigation
- **Full menu** with 6 tabbed categories and real prices
- **Photo gallery** with CSS grid layout
- **Reviews carousel** — 8 real customer reviews with prev/next navigation
- **Notable Moments** — highlights grid featuring governor, congressman, and owners
- **Events section** — Vegans on the Run 5K with event flyer
- **YouTube review embed**
- **Scroll reveal animations** via IntersectionObserver
- **Fully responsive** — mobile, tablet, desktop

---

## 🔗 Links

- **Live site:** [veganish-ct.vercel.app](https://veganish-ct.vercel.app)
- **Instagram:** [@veganish_ct](https://www.instagram.com/veganish_ct/)
- **Facebook:** [Veganish CT](https://www.facebook.com/profile.php?id=61559221286333)
- **Order:** [Grubhub](https://www.grubhub.com/restaurant/veganish-cafe-881-lafayette-blvd-bridgeport/11368064) · [Uber Eats](https://www.ubereats.com/store/veganish-cafe/M534NMX0TJ2JhZ4s1W9c2g)
- **Location:** 881 Lafayette Blvd, Bridgeport, CT 06604
- **Phone:** (203) 275-8924

---

## 👨‍💻 Developer

Designed & built by [Eric Askew](https://ea-portfolio-khaki.vercel.app/)
