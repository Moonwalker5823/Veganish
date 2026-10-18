// Browsers refuse audio without a user gesture, so playback hangs off the first
// real interaction and the toggle is always visible.
import { $ } from '../lib/dom.js';

export function initMusic() {
  const audio = $('#bgMusic');
  const toggle = $('#musicToggle');
  if (!audio || !toggle) return { enable() {}, startFromGesture() {}, autoplay() {} };

  const STORAGE_KEY = 'veganish:music';
  const TARGET_VOLUME = 0.35;
  const FADE_MS = 1400;

  let fadeFrame = null;
  let armed = false;
  // Intent, tracked separately from audio.paused: pausing runs a 1400ms fade, so
  // during it audio.paused is still false and a second click would re-pause
  // instead of resuming, leaving the button apparently dead.
  let wantsPlaying = false;
  audio.volume = 0;

  // localStorage, not session: turning the music off should stay off on the next
  // visit rather than restarting every time.
  const optedOut = () => {
    try { return localStorage.getItem(STORAGE_KEY) === 'off'; } catch { return false; }
  };
  const remember = (state) => {
    try { localStorage.setItem(STORAGE_KEY, state); } catch { /* private mode - fine */ }
  };

  function fadeTo(target, onDone) {
    cancelAnimationFrame(fadeFrame);
    const from = audio.volume;
    const start = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - start) / FADE_MS);
      // Clamp: float drift can land outside [0,1] and HTMLMediaElement.volume
      // throws IndexSizeError rather than saturating.
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
    wantsPlaying = true;
    try {
      await audio.play();
      fadeTo(TARGET_VOLUME);
      reflect(true);
      if (shouldRemember) remember('on');
      return true;
    } catch {
      wantsPlaying = false;
      reflect(false);
      return false;
    }
  }

  function pause({ remember: shouldRemember = true } = {}) {
    wantsPlaying = false;
    fadeTo(0, () => { if (!wantsPlaying) audio.pause(); });
    reflect(false);
    if (shouldRemember) remember('off');
  }

  function armFirstGesture() {
    if (armed) return;
    armed = true;
    const events = ['pointerdown', 'keydown', 'touchstart'];
    const onGesture = () => {
      if (!optedOut() && !wantsPlaying) play();
      events.forEach((e) => document.removeEventListener(e, onGesture));
    };
    events.forEach((e) => document.addEventListener(e, onGesture, { once: true, passive: true }));
  }

  toggle.addEventListener('click', () => (wantsPlaying ? pause() : play()));

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (!audio.paused) { audio.pause(); toggle.classList.add('was-playing'); }
    } else if (toggle.classList.contains('was-playing')) {
      toggle.classList.remove('was-playing');
      if (!optedOut()) audio.play().catch(() => {});
    }
  });

  return {
    enable() { toggle.hidden = false; },
    /** Try outright, then fall back to the first gesture. */
    async autoplay() {
      if (optedOut()) { reflect(false); return; }
      if (!(await play({ remember: false }))) armFirstGesture();
    },
    async startFromGesture() {
      if (optedOut()) { reflect(false); return; }
      if (!(await play())) armFirstGesture();
    },
  };
}
