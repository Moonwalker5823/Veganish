// Random selection without repeats.

/**
 * `n` distinct items from `list`, in random order. Returns a shuffled copy when
 * the list is shorter than `n`, so a half-filled pool still renders rather than
 * leaving holes.
 *
 * Fisher-Yates on a copy: `sort(() => Math.random() - 0.5)` is the usual
 * shortcut and it isn't uniform - the comparator is inconsistent, so some
 * orderings come up far more often than others.
 */
export function pickRandom(list, n) {
  const copy = [...list];
  const take = Math.min(n, copy.length);
  for (let i = 0; i < take; i++) {
    const j = i + Math.floor(Math.random() * (copy.length - i));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, take);
}
