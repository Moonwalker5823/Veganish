/* ══════════════════════════════════════════
   VEGANISH CT — Main JS
══════════════════════════════════════════ */

// ── INTRO SEQUENCE ──
const INTRO_DURATION = 3800; // ms before auto-dismiss

function launchSite() {
  const intro = document.getElementById('intro');
  const main  = document.getElementById('main-site');

  intro.classList.add('exit');
  main.classList.remove('hidden');

  setTimeout(() => {
    main.classList.add('visible');
    intro.style.display = 'none';
    document.body.classList.remove('intro-active');
  }, 700);
}

document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('intro-active');

  // Auto-launch after INTRO_DURATION
  const introTimer = setTimeout(launchSite, INTRO_DURATION);

  // Also allow clicking the intro to skip
  document.getElementById('intro').addEventListener('click', () => {
    clearTimeout(introTimer);
    launchSite();
  });
});


// ── NAVBAR ──
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  updateActiveNavLink();
});

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const isOpen = navLinks.classList.contains('open');
  navToggle.setAttribute('aria-expanded', isOpen);
  // Animate hamburger to X
  const spans = navToggle.querySelectorAll('span');
  if (isOpen) {
    spans[0].style.transform = 'translateY(7px) rotate(45deg)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  }
});

// Close nav on link click
document.querySelectorAll('.nav-link, .nav-cta').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    const spans = navToggle.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  });
});

// Active nav link highlighting
function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const scrollPos = window.scrollY + 120;

  sections.forEach(section => {
    const top    = section.offsetTop;
    const height = section.offsetHeight;
    const id     = section.getAttribute('id');
    const link   = document.querySelector(`.nav-link[href="#${id}"]`);
    if (!link) return;

    if (scrollPos >= top && scrollPos < top + height) {
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    }
  });
}


// ── MENU TABS ──
const tabBtns  = document.querySelectorAll('.tab-btn');
const menuPanels = document.querySelectorAll('.menu-panel');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const targetTab = btn.dataset.tab;

    tabBtns.forEach(b => b.classList.remove('active'));
    menuPanels.forEach(p => {
      p.classList.remove('active');
    });

    btn.classList.add('active');
    const panel = document.getElementById(`tab-${targetTab}`);
    if (panel) {
      panel.classList.add('active');
      // Animate menu cards in
      panel.querySelectorAll('.menu-card').forEach((card, i) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
          card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, i * 60);
      });
    }
  });
});


// ── SCROLL REVEAL ──
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

function setupRevealElements() {
  // Add reveal class to key elements
  const revealSelectors = [
    '.about-grid > *',
    '.menu-card',
    '.testimonial-card',
    '.gallery-item',
    '.contact-grid > *',
    '.stat-card',
    '.value-item',
    '.section-header',
    '.hero-badge',
  ];

  revealSelectors.forEach(sel => {
    document.querySelectorAll(sel).forEach((el, i) => {
      el.classList.add('reveal');
      if (i === 1) el.classList.add('reveal-delay-1');
      if (i === 2) el.classList.add('reveal-delay-2');
      if (i === 3) el.classList.add('reveal-delay-3');
      revealObserver.observe(el);
    });
  });
}

// Run reveal setup after intro so elements are visible
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(setupRevealElements, INTRO_DURATION + 200);
});


// ── HERO SLIDESHOW ──
(function() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots   = document.querySelectorAll('.slide-dot');
  if (!slides.length) return;

  let current = 0;
  let timer;

  function goTo(n) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (n + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  function next() { goTo(current + 1); }

  function startAuto() { timer = setInterval(next, 5000); }
  function stopAuto()  { clearInterval(timer); }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { stopAuto(); goTo(i); startAuto(); });
  });

  const heroEl = document.querySelector('.hero');
  if (heroEl) {
    heroEl.addEventListener('mouseenter', stopAuto);
    heroEl.addEventListener('mouseleave', startAuto);
  }

  startAuto();
})();


// ── REVIEWS CAROUSEL ──
(function() {
  const track   = document.getElementById('reviewsTrack');
  const prevBtn = document.getElementById('reviewsPrev');
  const nextBtn = document.getElementById('reviewsNext');
  const dotsEl  = document.getElementById('reviewsDots');
  if (!track) return;

  const cards = track.querySelectorAll('.review-card');
  const rdots = dotsEl ? dotsEl.querySelectorAll('.rdot') : [];
  let current = 0;
  const visible = () => window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3;
  let timer;

  function getOffset(idx) {
    const v = visible();
    const max = Math.max(0, cards.length - v);
    const clamped = Math.min(idx, max);
    const cardW = cards[0].offsetWidth;
    const gap = 24;
    return clamped * (cardW + gap);
  }

  function goTo(n) {
    const v = visible();
    const max = Math.max(0, cards.length - v);
    current = Math.max(0, Math.min(n, max));
    track.style.transform = `translateX(-${getOffset(current)}px)`;
    rdots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  function startAuto() { timer = setInterval(() => goTo(current + 1 > cards.length - visible() ? 0 : current + 1), 5000); }
  function stopAuto()  { clearInterval(timer); }

  if (prevBtn) prevBtn.addEventListener('click', () => { stopAuto(); goTo(current - 1); startAuto(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { stopAuto(); goTo(current + 1); startAuto(); });
  rdots.forEach((d, i) => { d.addEventListener('click', () => { stopAuto(); goTo(i); startAuto(); }); });

  window.addEventListener('resize', () => goTo(current));
  startAuto();
})();


// ── SMOOTH SCROLL with offset for fixed nav ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
