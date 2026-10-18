// Loads the real iframe only on click.
import { $$ } from '../lib/dom.js';

export function initYouTube() {
  for (const wrap of $$('[data-video-id]')) {
    const btn = wrap.querySelector('.youtube-play, #youtubePlay');
    if (!btn) continue;
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
  }
}
