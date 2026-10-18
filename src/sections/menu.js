// Main restaurant menu - tabbed panels rendered from src/data/menu.js.
// The wrapper carries [data-tabs] so the scoped tab controller treats this group
// independently of any other tab strip on the page.
import { SectionHeader, MenuGrid } from '../components/index.js';
import { esc, join } from '../lib/html.js';
import { menuItem, menuSection } from '../lib/schema.js';
import { menu } from '../data/menu.js';
import { site } from '../data/site.js';

const LABELS = {
  breakfast: 'Breakfast',
  starters: 'Appetizers',
  lunch: 'Lunch/Dinner',
  bowls: 'Salads & Bowls',
  brunch: 'Brunch',
  sides: 'Sides & Drinks',
};

export function renderMenu() {
  const keys = Object.keys(menu);

  const tabs = keys.map((key, i) => `
    <button class="tab-btn${i === 0 ? ' active' : ''}" type="button" role="tab"
            id="tabbtn-${esc(key)}" data-tab="tab-${esc(key)}"
            aria-selected="${i === 0}" aria-controls="tab-${esc(key)}" tabindex="${i === 0 ? 0 : -1}">
      ${esc(LABELS[key] ?? key)}
    </button>`);

  const panels = keys.map((key, i) => `
    <div class="menu-panel${i === 0 ? ' active' : ''}" id="tab-${esc(key)}" role="tabpanel"
         aria-labelledby="tabbtn-${esc(key)}" tabindex="0"${i === 0 ? '' : ' hidden'}>
      ${menu[key].note ? `<p class="menu-tab-note">${esc(menu[key].note)}</p>` : ''}
      ${MenuGrid(menu[key].items)}
    </div>`);

  return `
    <div class="container">
      ${SectionHeader({ eyebrow: 'What We Serve', title: 'The Menu', titleId: 'menu-title' })}
      <div class="menu-tabs-wrap" data-tabs>
        <div class="menu-tabs" id="menuTabs" role="tablist" aria-label="Menu categories">
          ${join(tabs)}
        </div>
        ${join(panels)}
      </div>
      <div class="menu-note">
        <p>* Menu items and prices may vary. Please ask about daily specials and seasonal offerings.</p>
        <a href="#order" class="btn btn-accent">Place an Order</a>
      </div>
    </div>`;
}

export const menuSections = () =>
  Object.entries(menu).map(([key, panel]) =>
    menuSection(LABELS[key] ?? key, panel.items.map(menuItem)));
