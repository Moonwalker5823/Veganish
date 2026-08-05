/* ══════════════════════════════════════════
   VEGANISH CAFE — Main JS

   Loaded as a module (deferred), so the DOM is already parsed when this runs.
   Every block is independently guarded: a missing element in one feature must
   never take down the rest of the page.
══════════════════════════════════════════ */

const root = document.documentElement;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const $  = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

/** Runs `fn` on the next frame, coalescing bursts of calls (scroll/resize). */
function rafThrottle(fn) {
  let queued = false;
  return (...args) => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      fn(...args);
    });
  };
}

/* Scroll locking is shared by the mobile nav and the lightbox, so it has to be
   reference-counted — otherwise closing one re-enables scrolling under the other. */
const scrollLock = (() => {
  let count = 0;
  return {
    lock() {
      if (count++ === 0) root.classList.add('scroll-locked');
    },
    unlock() {
      count = Math.max(0, count - 1);
      if (count === 0) root.classList.remove('scroll-locked');
    },
  };
})();


/* ══════════════════════════════════════════
   BACKGROUND MUSIC
   Browsers refuse to start audio without a user gesture, so we hang playback
   off the first real interaction and always expose a visible toggle.
══════════════════════════════════════════ */
const music = (() => {
  const audio  = $('#bgMusic');
  const toggle = $('#musicToggle');
  if (!audio || !toggle) return { enable() {}, startFromGesture() {} };

  const STORAGE_KEY = 'veganish:music';
  const TARGET_VOLUME = 0.35;
  const FADE_MS = 1400;

  let fadeFrame = null;
  let armed = false;

  audio.volume = 0;

  const optedOut = () => {
    try { return sessionStorage.getItem(STORAGE_KEY) === 'off'; } catch { return false; }
  };
  const remember = (state) => {
    try { sessionStorage.setItem(STORAGE_KEY, state); } catch { /* private mode — fine */ }
  };

  function fadeTo(target, onDone) {
    cancelAnimationFrame(fadeFrame);
    const from = audio.volume;
    const start = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - start) / FADE_MS);
      // Clamp: floating-point drift can land a hair outside [0,1], and
      // HTMLMediaElement.volume throws IndexSizeError rather than saturating.
      audio.volume = Math.min(1, Math.max(0, from + (target - from) * t));
      if (t < 1) fadeFrame = requestAnimationFrame(step);
      else if (onDone) onDone();
    };
    fadeFrame = requestAnimationFrame(step);
  }

  function reflect(playing) {
    toggle.classList.toggle('playing', playing);
    toggle.setAttribute('aria-pressed', String(playing));
    toggle.setAttribute('aria-label', playing ? 'Mute background music' : 'Play background music');
  }

  async function play({ remember: shouldRemember = true } = {}) {
    try {
      await audio.play();
      fadeTo(TARGET_VOLUME);
      reflect(true);
      if (shouldRemember) remember('on');
      return true;
    } catch {
      // Autoplay blocked. Leave the toggle in its "off" state; the visitor can
      // still start it manually, and armFirstGesture() gives it one more try.
      reflect(false);
      return false;
    }
  }

  function pause({ remember: shouldRemember = true } = {}) {
    fadeTo(0, () => audio.pause());
    reflect(false);
    if (shouldRemember) remember('off');
  }

  /** Last-resort: if autoplay was refused, retry on the visitor's first interaction. */
  function armFirstGesture() {
    if (armed) return;
    armed = true;
    const onGesture = () => {
      if (!optedOut() && audio.paused) play();
      cleanup();
    };
    const cleanup = () => {
      ['pointerdown', 'keydown', 'touchstart'].forEach(e =>
        document.removeEventListener(e, onGesture)
      );
    };
    ['pointerdown', 'keydown', 'touchstart'].forEach(e =>
      document.addEventListener(e, onGesture, { once: true, passive: true })
    );
  }

  toggle.addEventListener('click', () => {
    if (audio.paused) play();
    else pause();
  });

  // Don't keep playing into a tab nobody is looking at.
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (!audio.paused) { audio.pause(); toggle.classList.add('was-playing'); }
    } else if (toggle.classList.contains('was-playing')) {
      toggle.classList.remove('was-playing');
      if (!optedOut()) audio.play().catch(() => {});
    }
  });

  return {
    /** Reveal the toggle once the splash is out of the way. */
    enable() {
      toggle.hidden = false;
    },
    /** Called from inside a real user gesture (the splash click). */
    async startFromGesture() {
      if (optedOut()) { reflect(false); return; }
      const ok = await play();
      if (!ok) armFirstGesture();
    },
    /** Called when the splash timed out on its own — no gesture available yet. */
    deferToFirstGesture() {
      if (!optedOut()) armFirstGesture();
    },
  };
})();


/* ══════════════════════════════════════════
   INTRO / SPLASH
   The <head> script already added .intro-active and installed an 8s failsafe,
   so a failure in this file can never trap the visitor behind the splash.
══════════════════════════════════════════ */
(() => {
  const intro = $('#intro');
  if (!intro) { music.enable(); return; }

  const INTRO_DURATION = 3800;
  const SEEN_KEY = 'veganish:introSeen';

  let dismissed = false;
  let timer = null;

  function dismiss({ fromGesture }) {
    if (dismissed) return;
    dismissed = true;
    clearTimeout(timer);

    try { sessionStorage.setItem(SEEN_KEY, '1'); } catch { /* ignore */ }

    intro.classList.add('exit');
    root.classList.remove('intro-active');
    music.enable();

    if (fromGesture) music.startFromGesture();
    else music.deferToFirstGesture();

    const remove = () => intro.remove();
    if (reduceMotion.matches) remove();
    else intro.addEventListener('animationend', remove, { once: true });
    // Belt and braces in case animationend never fires (e.g. tab backgrounded).
    setTimeout(remove, 1200);
  }

  // Returning visitor in the same session — skip straight to the site.
  let alreadySeen = false;
  try { alreadySeen = sessionStorage.getItem(SEEN_KEY) === '1'; } catch { /* ignore */ }
  if (alreadySeen) {
    intro.remove();
    root.classList.remove('intro-active');
    music.enable();
    music.deferToFirstGesture();
    return;
  }

  timer = setTimeout(() => dismiss({ fromGesture: false }), INTRO_DURATION);

  intro.addEventListener('click', () => dismiss({ fromGesture: true }));
  document.addEventListener('keydown', (e) => {
    if (!dismissed && (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape')) {
      e.preventDefault();
      dismiss({ fromGesture: true });
    }
  });
})();


/* ══════════════════════════════════════════
   NAVBAR
══════════════════════════════════════════ */
(() => {
  const navbar   = $('#navbar');
  const navToggle = $('#navToggle');
  const navLinks  = $('#navLinks');
  if (!navbar) return;

  const onScroll = rafThrottle(() => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (!navToggle || !navLinks) return;

  function setMenu(open) {
    navLinks.classList.toggle('open', open);
    navToggle.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    if (open) scrollLock.lock();
    else scrollLock.unlock();
  }

  const isOpen = () => navLinks.classList.contains('open');

  navToggle.addEventListener('click', () => setMenu(!isOpen()));

  navLinks.addEventListener('click', (e) => {
    if (e.target.closest('a') && isOpen()) setMenu(false);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen()) {
      setMenu(false);
      navToggle.focus();
    }
  });

  // Desktop breakpoint re-entry must not leave the overlay latched open.
  const desktop = window.matchMedia('(min-width: 769px)');
  desktop.addEventListener('change', (e) => {
    if (e.matches && isOpen()) setMenu(false);
  });
})();


/* ══════════════════════════════════════════
   ACTIVE NAV LINK
   IntersectionObserver instead of measuring offsetTop on every scroll event —
   the old approach forced a layout on each of ~8 sections per frame.
══════════════════════════════════════════ */
(() => {
  const links = new Map();
  $$('.nav-link').forEach((link) => {
    const id = link.getAttribute('href')?.slice(1);
    if (id) links.set(id, link);
  });
  if (!links.size) return;

  const sections = $$('main section[id]').filter(s => links.has(s.id));
  if (!sections.length) return;

  const visible = new Set();

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) visible.add(entry.target.id);
      else visible.delete(entry.target.id);
    });

    // Topmost visible section wins, so the highlight tracks reading position.
    const active = sections.find(s => visible.has(s.id));
    links.forEach((link, id) => link.classList.toggle('active', id === active?.id));
  }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });

  sections.forEach(s => observer.observe(s));
})();


/* ══════════════════════════════════════════
   MENU TABS
══════════════════════════════════════════ */
(() => {
  const tabs = $$('.tab-btn');
  const panels = $$('.menu-panel');
  if (!tabs.length || !panels.length) return;

  /** Restarts the staggered card entrance. Capped so a 12-item panel isn't slow. */
  function animatePanel(panel) {
    if (reduceMotion.matches) return;
    $$('.menu-card', panel).forEach((card, i) => {
      card.style.setProperty('--stagger', `${Math.min(i, 8) * 45}ms`);
    });
    panel.classList.remove('panel-animate');
    void panel.offsetWidth; // force reflow so the animation replays
    panel.classList.add('panel-animate');
  }

  function select(tab, { focus = false } = {}) {
    const target = $(`#tab-${tab.dataset.tab}`);
    if (!target) return;

    tabs.forEach((t) => {
      const on = t === tab;
      t.classList.toggle('active', on);
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
    });
    panels.forEach((p) => {
      const on = p === target;
      p.classList.toggle('active', on);
      p.hidden = !on;
    });

    animatePanel(target);
    if (focus) tab.focus();
  }

  tabs.forEach(tab => tab.addEventListener('click', () => select(tab)));

  // Arrow-key navigation, per the WAI-ARIA tabs pattern.
  $('#menuTabs')?.addEventListener('keydown', (e) => {
    const i = tabs.indexOf(document.activeElement);
    if (i === -1) return;
    const moves = {
      ArrowRight: (i + 1) % tabs.length,
      ArrowLeft: (i - 1 + tabs.length) % tabs.length,
      Home: 0,
      End: tabs.length - 1,
    };
    const next = moves[e.key];
    if (next === undefined) return;
    e.preventDefault();
    select(tabs[next], { focus: true });
  });

  // Animate the initially-open panel when the menu first scrolls into view.
  const active = panels.find(p => p.classList.contains('active'));
  const section = $('#menu');
  if (active && section) {
    const io = new IntersectionObserver((entries) => {
      if (entries.some(e => e.isIntersecting)) {
        animatePanel(active);
        io.disconnect();
      }
    }, { threshold: 0.05 });
    io.observe(section);
  }
})();


/* ══════════════════════════════════════════
   SCROLL REVEAL
   Set up immediately. The previous build deferred this by ~4s, which meant
   already-visible elements were flipped to opacity:0 and then faded back in.
══════════════════════════════════════════ */
(() => {
  if (reduceMotion.matches) return;

  const targets = $$([
    '.about-image-col',
    '.about-text-col',
    '.highlight-card',
    '.gallery-item',
    '.contact-info',
    '.contact-map',
    '.stat-card',
    '.value-item',
    '.section-header',
    '.hero-badge',
    '.event-left',
    '.event-right',
    // Not .review-card: offscreen carousel cards are clipped by the track's
    // overflow:hidden, so they'd never intersect and would stay invisible.
  ].join(','));
  if (!targets.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  targets.forEach((el) => {
    el.classList.add('reveal');
    observer.observe(el);
  });

  // Stagger siblings within each group rather than across the whole page —
  // the old code only ever delayed items 1-3 of each selector.
  ['.about-stat-row', '.about-values', '.highlights-grid', '.gallery-grid'].forEach((sel) => {
    $$(`${sel} > .reveal`).forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i, 5) * 80}ms`;
    });
  });
})();


/* ══════════════════════════════════════════
   HERO SLIDESHOW
══════════════════════════════════════════ */
(() => {
  const slides = $$('.hero-slide');
  const dots   = $$('.slide-dot');
  const hero   = $('.hero');
  if (slides.length < 2) return;

  const INTERVAL = 5000;
  let current = 0;
  let timer = null;

  function goTo(n) {
    const next = (n + slides.length) % slides.length;
    slides[current]?.classList.remove('active');
    dots[current]?.classList.remove('active');
    dots[current]?.removeAttribute('aria-current');
    current = next;
    slides[current]?.classList.add('active');
    dots[current]?.classList.add('active');
    dots[current]?.setAttribute('aria-current', 'true');
  }

  // Always clear before setting: the old version could stack intervals and
  // make the slideshow accelerate after a few hover/click cycles.
  function start() {
    stop();
    if (reduceMotion.matches || document.hidden) return;
    timer = setInterval(() => goTo(current + 1), INTERVAL);
  }
  function stop() {
    clearInterval(timer);
    timer = null;
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { goTo(i); start(); });
  });

  if (hero) {
    // Pointer-aware so a tap on a touch device doesn't stop autoplay forever.
    hero.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') stop(); });
    hero.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') start(); });
    hero.addEventListener('focusin', stop);
    hero.addEventListener('focusout', start);
  }

  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
  reduceMotion.addEventListener('change', start);

  dots[0]?.setAttribute('aria-current', 'true');
  start();
})();


/* ══════════════════════════════════════════
   REVIEWS CAROUSEL
══════════════════════════════════════════ */
(() => {
  const track    = $('#reviewsTrack');
  const viewport = $('#reviewsViewport');
  const dotsEl   = $('#reviewsDots');
  const prevBtn  = $('#reviewsPrev');
  const nextBtn  = $('#reviewsNext');
  if (!track || !viewport) return;

  const cards = $$('.review-card', track);
  if (!cards.length) return;

  const INTERVAL = 6000;
  let current = 0;
  let timer = null;
  let dots = [];

  /* These must mirror the CSS breakpoints exactly. The previous build used
     `innerWidth < 768 / < 1024` against `max-width: 768px / 1024px` media
     queries, so at exactly 768px and 1024px the JS and CSS disagreed on how
     many cards were on screen and the track scrolled to the wrong offset. */
  const mqMobile = window.matchMedia('(max-width: 768px)');
  const mqTablet = window.matchMedia('(max-width: 1024px)');
  const perView = () => (mqMobile.matches ? 1 : mqTablet.matches ? 2 : 3);
  const maxIndex = () => Math.max(0, cards.length - perView());

  /** True distance between card origins, gap included — no hardcoded numbers. */
  function stride() {
    if (cards.length > 1) {
      const delta = cards[1].offsetLeft - cards[0].offsetLeft;
      if (delta > 0) return delta;
    }
    const gap = parseFloat(getComputedStyle(track).columnGap) || 24;
    return cards[0].offsetWidth + gap;
  }

  function render() {
    track.style.transform = `translate3d(-${current * stride()}px, 0, 0)`;
    dots.forEach((d, i) => {
      const on = i === current;
      d.classList.toggle('active', on);
      d.setAttribute('aria-current', String(on));
    });
    if (prevBtn) prevBtn.disabled = current === 0;
    if (nextBtn) nextBtn.disabled = current === maxIndex();
    cards.forEach((card, i) => {
      const shown = i >= current && i < current + perView();
      // Keep offscreen cards out of the tab order so keyboard focus can't
      // scroll the clipped track sideways.
      card.querySelectorAll('a, button').forEach(el => { el.tabIndex = shown ? 0 : -1; });
    });
  }

  function goTo(n) {
    current = Math.max(0, Math.min(n, maxIndex()));
    render();
  }

  function start() {
    stop();
    if (reduceMotion.matches || document.hidden || maxIndex() === 0) return;
    timer = setInterval(() => goTo(current >= maxIndex() ? 0 : current + 1), INTERVAL);
  }
  function stop() {
    clearInterval(timer);
    timer = null;
  }
  const nudge = (fn) => () => { stop(); fn(); start(); };

  // Dots are generated from the real page count so they can never drift out of
  // sync with the number of reviews or the current breakpoint.
  function buildDots() {
    if (!dotsEl) return;
    dotsEl.innerHTML = '';
    const pages = maxIndex() + 1;
    dots = Array.from({ length: pages }, (_, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'rdot';
      b.setAttribute('aria-label', `Show reviews starting at ${i + 1} of ${cards.length}`);
      b.addEventListener('click', nudge(() => goTo(i)));
      dotsEl.appendChild(b);
      return b;
    });
    dotsEl.hidden = pages <= 1;
  }

  prevBtn?.addEventListener('click', nudge(() => goTo(current - 1)));
  nextBtn?.addEventListener('click', nudge(() => goTo(current + 1)));

  viewport.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); nudge(() => goTo(current + 1))(); }
    if (e.key === 'ArrowLeft')  { e.preventDefault(); nudge(() => goTo(current - 1))(); }
  });

  // Touch swipe.
  let startX = 0, startY = 0, tracking = false;
  viewport.addEventListener('touchstart', (e) => {
    tracking = true;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    stop();
  }, { passive: true });

  viewport.addEventListener('touchend', (e) => {
    if (!tracking) return;
    tracking = false;
    const dx = e.changedTouches[0].clientX - startX;
    const dy = e.changedTouches[0].clientY - startY;
    // Ignore mostly-vertical drags so we don't hijack page scrolling.
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) {
      goTo(current + (dx < 0 ? 1 : -1));
    }
    start();
  }, { passive: true });

  viewport.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') stop(); });
  viewport.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') start(); });
  viewport.addEventListener('focusin', stop);
  viewport.addEventListener('focusout', start);

  const onResize = rafThrottle(() => {
    buildDots();
    goTo(current);
  });
  window.addEventListener('resize', onResize, { passive: true });
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));

  buildDots();
  goTo(0);
  start();
})();


/* ══════════════════════════════════════════
   GALLERY LIGHTBOX
   The tiles already advertised themselves with cursor:pointer but did nothing.
══════════════════════════════════════════ */
(() => {
  const grid    = $('#galleryGrid');
  const box     = $('#lightbox');
  const img     = $('#lightboxImg');
  const caption = $('#lightboxCaption');
  if (!grid || !box || !img || !caption) return;

  const items = $$('.gallery-item', grid);
  if (!items.length) return;

  let index = 0;
  let lastFocused = null;

  function show(i) {
    index = (i + items.length) % items.length;
    const source = $('img', items[index]);
    if (!source) return;
    img.src = source.currentSrc || source.src;
    img.alt = source.alt || '';
    caption.textContent = items[index].dataset.caption || source.alt || '';
  }

  function open(i) {
    lastFocused = document.activeElement;
    show(i);
    box.hidden = false;
    scrollLock.lock();
    requestAnimationFrame(() => box.classList.add('open'));
    $('#lightboxClose')?.focus();
  }

  function close() {
    box.classList.remove('open');
    scrollLock.unlock();
    const finish = () => {
      box.hidden = true;
      img.removeAttribute('src');
    };
    if (reduceMotion.matches) finish();
    else setTimeout(finish, 250);
    lastFocused?.focus();
  }

  items.forEach((item, i) => item.addEventListener('click', () => open(i)));

  $('#lightboxClose')?.addEventListener('click', close);
  $('#lightboxPrev')?.addEventListener('click', () => show(index - 1));
  $('#lightboxNext')?.addEventListener('click', () => show(index + 1));

  // Clicking the backdrop (but not the photo or controls) closes.
  box.addEventListener('click', (e) => {
    if (e.target === box) close();
  });

  document.addEventListener('keydown', (e) => {
    if (box.hidden) return;
    if (e.key === 'Escape')     { e.preventDefault(); close(); }
    if (e.key === 'ArrowRight') { e.preventDefault(); show(index + 1); }
    if (e.key === 'ArrowLeft')  { e.preventDefault(); show(index - 1); }
    if (e.key === 'Tab') {
      // Simple focus trap across the dialog's three controls.
      const focusables = $$('button', box);
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
})();


/* ══════════════════════════════════════════
   YOUTUBE FACADE
══════════════════════════════════════════ */
(() => {
  const wrap = $('#youtubeEmbed');
  const btn  = $('#youtubePlay');
  if (!wrap || !btn) return;

  btn.addEventListener('click', () => {
    const id = wrap.dataset.videoId;
    if (!id) return;
    const frame = document.createElement('iframe');
    // youtube-nocookie avoids setting tracking cookies until playback starts.
    frame.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
    frame.title = 'Veganish Cafe restaurant review';
    frame.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    frame.allowFullscreen = true;
    frame.loading = 'lazy';
    wrap.replaceChildren(frame);
  });
})();


/* ══════════════════════════════════════════
   EVENT AUTO-EXPIRY
   Stops the site advertising dates that have already passed. Cards declare
   either data-event-date="YYYY-MM-DD" or data-event-dates="a,b,c"; a card is
   spent once its last date is gone. Individual line-up rows expire on their
   own so a partly-run series still reads correctly.
══════════════════════════════════════════ */
(() => {
  const section = $('#events');
  if (!section) return;

  /** End of the given day, local time — an event isn't past while it's running. */
  function endOfDay(iso) {
    const [y, m, d] = String(iso).trim().split('-').map(Number);
    if (!y || !m || !d) return null;
    return new Date(y, m - 1, d, 23, 59, 59).getTime();
  }

  const now = Date.now();
  const cards = $$('[data-event-date], [data-event-dates]', section);
  let anyUpcoming = false;

  cards.forEach((card) => {
    const raw = card.dataset.eventDates || card.dataset.eventDate || '';
    const stamps = raw.split(',').map(endOfDay).filter(Boolean);
    if (!stamps.length) return;

    // Grey out individual line-up rows as their dates pass.
    $$('[data-date]', card).forEach((row) => {
      const t = endOfDay(row.dataset.date);
      if (t && now > t) row.classList.add('is-past');
    });

    const lastDate = Math.max(...stamps);
    if (now <= lastDate) {
      anyUpcoming = true;
      const next = stamps.filter(t => t >= now).length;
      if (next < stamps.length) {
        const eyebrow = $('[data-event-eyebrow]', card);
        if (eyebrow) eyebrow.textContent = `${next} date${next === 1 ? '' : 's'} left`;
      }
      return;
    }

    card.classList.add('event-past');
    const eyebrow = $('[data-event-eyebrow]', card);
    if (eyebrow) eyebrow.textContent = 'Past Event';

    const cta = $('[data-event-cta]', card);
    if (cta) {
      cta.textContent = 'Follow us for the next one';
      cta.href = 'https://www.instagram.com/veganish_ct/';
      cta.target = '_blank';
      cta.rel = 'noopener noreferrer';
    }

    if (!$('.event-past-note', card)) {
      const note = document.createElement('p');
      note.className = 'event-past-note';
      note.textContent = 'This one has already happened — follow along on Instagram to hear about the next one first.';
      ($('.event-details-box', card) || $('.lineup-box', card))?.insertAdjacentElement('afterend', note);
    }
  });

  // Don't call the section "What's On" when nothing is.
  if (!anyUpcoming) {
    const eyebrow = $('[data-events-eyebrow]', section);
    if (eyebrow) eyebrow.textContent = 'Recently at Veganish';
    const desc = $('[data-events-desc]', section);
    if (desc) {
      desc.textContent = 'Here’s what we’ve been up to. Follow us on Instagram so you catch the next one live.';
    }
  }
})();


/* ══════════════════════════════════════════
   "OPEN NOW" INDICATOR
   Evaluated in the cafe's timezone, not the visitor's.
══════════════════════════════════════════ */
(() => {
  const list = $('#hoursList');
  if (!list) return;

  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(new Date());

  const get = (type) => parts.find(p => p.type === type)?.value ?? '';
  const dayIndex = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[get('weekday')];
  if (dayIndex === undefined) return;

  const hour = Number(get('hour')) % 24; // some engines report "24" at midnight
  const minutes = hour * 60 + Number(get('minute'));

  const toMinutes = (hhmm) => {
    const [h, m] = hhmm.split(':').map(Number);
    return h * 60 + m;
  };

  const today = $(`li[data-day="${dayIndex}"]`, list);
  if (!today) return;
  today.classList.add('is-today');

  const open = today.dataset.open;
  const close = today.dataset.close;
  const isOpen = Boolean(open && close) &&
    minutes >= toMinutes(open) && minutes < toMinutes(close);

  const pill = document.createElement('span');
  pill.className = `hours-pill ${isOpen ? 'is-open' : 'is-closed'}`;
  pill.textContent = isOpen ? 'Open now' : 'Closed now';
  $('strong', list.closest('.contact-item'))?.append(' ', pill);
})();


/* ══════════════════════════════════════════
   SMOOTH SCROLL (offset for the fixed navbar)
══════════════════════════════════════════ */
(() => {
  const NAV_OFFSET = 80;

  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;

    const href = anchor.getAttribute('href');
    // `querySelector('#')` throws, and a bare "#" has no target anyway.
    if (!href || href === '#') return;

    let target;
    try { target = document.querySelector(href); } catch { return; }
    if (!target) return;

    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
    window.scrollTo({ top, behavior: reduceMotion.matches ? 'auto' : 'smooth' });

    // Move keyboard focus along with the viewport.
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
    target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });

    if (history.replaceState) history.replaceState(null, '', href);
  });
})();


/* ══════════════════════════════════════════
   FOOTER YEAR
══════════════════════════════════════════ */
(() => {
  const el = $('#footerYear');
  if (el) el.textContent = String(new Date().getFullYear());
})();
