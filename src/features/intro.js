// The <head> script sets .intro-active and installs an 8s failsafe, so a failure
// here can never trap the visitor behind the splash.
import { $, root, reduceMotion } from '../lib/dom.js';

export function initIntro(music) {
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
    else music.autoplay();

    const remove = () => intro.remove();
    if (reduceMotion.matches) remove();
    else intro.addEventListener('animationend', remove, { once: true });
    // Belt and braces in case animationend never fires (e.g. tab backgrounded).
    setTimeout(remove, 1200);
  }

  let alreadySeen = false;
  try { alreadySeen = sessionStorage.getItem(SEEN_KEY) === '1'; } catch { /* ignore */ }
  if (alreadySeen) {
    intro.remove();
    root.classList.remove('intro-active');
    music.enable();
    music.autoplay();
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
}
