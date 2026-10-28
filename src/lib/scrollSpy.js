// Marks whichever link points at the topmost in-view target. Shared by the main
// nav and the events chip row so the two can't drift apart.
export function scrollSpy(links, { rootMargin = '-45% 0px -45% 0px' } = {}) {
  const byId = new Map();
  for (const link of links) {
    const id = link.getAttribute('href')?.slice(1);
    if (id) byId.set(id, link);
  }
  if (!byId.size) return;

  const targets = [...byId.keys()].map((id) => document.getElementById(id)).filter(Boolean);
  if (!targets.length) return;

  const visible = new Set();
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) visible.add(entry.target.id);
      else visible.delete(entry.target.id);
    }
    // Topmost visible target wins, so the highlight tracks reading position.
    const active = targets.find((t) => visible.has(t.id));
    byId.forEach((link, id) => link.classList.toggle('active', id === active?.id));
  }, { rootMargin, threshold: 0 });

  targets.forEach((t) => observer.observe(t));
}
