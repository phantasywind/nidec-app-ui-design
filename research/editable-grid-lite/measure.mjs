// Renders every scenario x row height in Chromium, screenshots it and measures what moves
// when row 2 enters edit: the row height, and where the Item code text sits.
import { mkdirSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const here = resolve(import.meta.dirname);
const shots = join(here, 'dist', 'shots');
mkdirSync(shots, { recursive: true });
const page0 = pathToFileURL(join(here, 'dist', 'index.html')).href;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1328, height: 900 }, deviceScaleFactor: 2 });
const open = async (query) => {
  await page.goto(`${page0}?view=single&${query}`);
  await page.waitForSelector('body[data-ready="true"] .nidec-ui-editable-grid');
  await page.evaluate(() => document.fonts.ready);
  await page.mouse.move(0, 0);
};

// Text geometry of a cell: the text run in view mode, the input's content box in edit mode.
const probe = (col) => page.evaluate((col) => {
  const row = document.querySelector('[data-row-id="2"]');
  const cell = row.querySelector(`[data-col="${col}"]`);
  const r = (b) => ({ x: +b.left.toFixed(1), y: +((b.top + b.bottom) / 2).toFixed(1), top: +b.top.toFixed(1), h: +b.height.toFixed(1) });
  const input = cell.querySelector('input, textarea');
  let text;
  if (input) {
    const s = getComputedStyle(input); const b = input.getBoundingClientRect();
    const left = b.left + parseFloat(s.borderLeftWidth) + parseFloat(s.paddingLeft);
    const top = b.top + parseFloat(s.borderTopWidth) + parseFloat(s.paddingTop);
    const bottom = b.bottom - parseFloat(s.borderBottomWidth) - parseFloat(s.paddingBottom);
    const lh = parseFloat(s.lineHeight) || 20;
    // textarea text starts at the top of its content box; input text is centred in it.
    const center = input.tagName === 'TEXTAREA' ? top + lh / 2 : (top + bottom) / 2;
    text = { x: +left.toFixed(1), y: +center.toFixed(1) };
    var box = r((input.closest(".rs-field") ?? input.parentElement).getBoundingClientRect());
  } else {
    const span = cell.querySelector('.rs-text') ?? cell;
    const range = document.createRange(); range.selectNodeContents(span);
    const rects = range.getClientRects(); const first = rects[0] ?? span.getBoundingClientRect();
    text = { x: +first.left.toFixed(1), y: +((first.top + first.bottom) / 2).toFixed(1) };
  }
  return { rowHeight: +row.getBoundingClientRect().height.toFixed(1), cellHeight: +cell.getBoundingClientRect().height.toFixed(1), text, controlHeight: box ? box.h : undefined };
}, col);

const scenarios = [
  { id: 'current', q: 'scenario=current' },
  { id: 'lite-row-grey', q: 'scenario=lite-row&frame=grey' },
  { id: 'lite-row-filled', q: 'scenario=lite-row&frame=filled' },
  { id: 'lite-row-ghost', q: 'scenario=lite-row&frame=ghost' },
  { id: 'lite-row-inset', q: 'scenario=lite-row&frame=inset' },
  { id: 'lite-row-cell', q: 'scenario=lite-row&frame=cell' },
  { id: 'lite-row-underline', q: 'scenario=lite-row&frame=underline' },
];
const heights = ['32', '40', '48', 'auto'];
const results = [];
for (const s of scenarios) {
  for (const h of heights) {
    const row = { scenario: s.id, height: h };
    for (const col of ['code', 'description']) {
      await open(`${s.q}&h=${h}&edit=none`);
      const view = await probe(col);
      await open(`${s.q}&h=${h}&edit=2&focus=qty`);
      const edit = await probe(col);
      row[col] = { viewRow: view.rowHeight, editRow: edit.rowHeight, dx: +(edit.text.x - view.text.x).toFixed(1), dy: +(edit.text.y - view.text.y).toFixed(1), control: edit.controlHeight };
    }
    await open(`${s.q}&h=${h}&edit=2&focus=qty`);
    await page.locator('.nidec-ui-editable-grid').screenshot({ path: join(shots, `${s.id}-${h}.png`) });
    results.push(row);
  }
}
// Extra states for the lightweight row: open list, multiselect, validation error, single-cell mode.
const extras = [
  ['lite-row-grey-40-select', 'scenario=lite-row&frame=grey&h=40&edit=2&focus=category&open=category'],
  ['lite-row-filled-40-select', 'scenario=lite-row&frame=filled&h=40&edit=2&focus=category&open=category'],
  ['lite-row-ghost-40-select', 'scenario=lite-row&frame=ghost&h=40&edit=2&focus=category&open=category'],
  ['lite-row-inset-40-select', 'scenario=lite-row&frame=inset&h=40&edit=2&focus=category&open=category'],
  ['lite-row-inset-auto-multiselect', 'scenario=lite-row&frame=inset&h=auto&edit=2&focus=regions&open=regions'],
  ['lite-row-inset-40-error', 'scenario=lite-row&frame=inset&h=40&edit=2&focus=qty&error=1'],
  ['lite-cell-40', 'scenario=lite-cell&frame=cell&h=40&edit=2&focus=description'],
  ['current-40-select', 'scenario=current&h=40&edit=2'],
];
for (const [name, q] of extras) {
  await open(q);
  if (name === 'current-40-select') { await page.locator('[data-row-id="2"] [data-col="category"] button, [data-row-id="2"] [data-col="category"] [role="combobox"]').first().click(); await page.waitForTimeout(300); }
  await page.locator('.rs-page').screenshot({ path: join(shots, `${name}.png`) });
}
await browser.close();
writeFileSync(join(here, 'dist', 'measurements.json'), JSON.stringify(results, null, 2));
console.table(results.map(r => ({ scenario: r.scenario, h: r.height,
  'code row view→edit': `${r.code.viewRow}→${r.code.editRow}`, 'code dx,dy': `${r.code.dx},${r.code.dy}`, 'code control h': r.code.control,
  'desc row view→edit': `${r.description.viewRow}→${r.description.editRow}`, 'desc dx,dy': `${r.description.dx},${r.description.dy}` })));
