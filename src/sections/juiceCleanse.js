// Juice Cleanse section.
//
// Built and styled, but unpublished: Nate listed this as one of the three new
// menus and said he'd send it, and it wasn't in the Oct 2026 batch. Flip
// `juiceCleansePublished` in src/data/juiceCleanse.js once the content arrives -
// no markup changes needed, and the nav link appears automatically.
import { SectionHeader, PlanCard, ChipList } from '../components/index.js';
import { join } from '../lib/html.js';
import {
  juiceCleansePublished, juiceCleanseIntro, juiceCleansePlans, juiceCleanseChoices,
} from '../data/juiceCleanse.js';

export const isJuiceCleansePublished = () => juiceCleansePublished;

export function renderJuiceCleanse() {
  if (!juiceCleansePublished) return '';
  return `
    <div class="container">
      ${SectionHeader({
        eyebrow: juiceCleanseIntro.eyebrow,
        title: juiceCleanseIntro.title,
        titleId: 'juice-title',
        desc: juiceCleanseIntro.desc,
      })}
      <div class="plan-grid" data-reveal-stagger>
        ${join(juiceCleansePlans.map((p) => `<div class="reveal">${PlanCard(p)}</div>`))}
      </div>
      <div class="tray-extras" data-reveal-stagger>
        ${join(juiceCleanseChoices.map((c) => `<div class="reveal">${ChipList(c)}</div>`))}
      </div>
    </div>`;
}
