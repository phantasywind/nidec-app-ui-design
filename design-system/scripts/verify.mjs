// Renders every built preview in Chromium and reports page errors. Screenshots go to dist/screens.
// Set DS_CHROMIUM_PATH to a Chromium executable if Playwright cannot find one.
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { chromium } from 'playwright-core';

const dist = resolve(import.meta.dirname, '../dist');
const project = join(dist, 'project');
const screens = join(dist, 'screens');
mkdirSync(screens, { recursive: true });
const tokens = JSON.parse(readFileSync(join(project, 'tokens.json'), 'utf8'));
const css = [':root, [data-theme="light"] {'];
for (const t of tokens.color.tokens) css.push(`  --${t.name}: ${t.value.light};`);
for (const f of ['spacing', 'radius']) for (const t of tokens[f].tokens) css.push(`  --${t.name}: ${t.value};`);
css.push(`  --font-sans: ${tokens.type.families.sans};`, '}');
const bundleJs = readFileSync(join(project, 'components/bundle.js'), 'utf8').replace(/<\/script/gi, '<\\/script');
const bundleCss = readFileSync(join(project, 'components/bundle.css'), 'utf8');
const browser = await chromium.launch(process.env.DS_CHROMIUM_PATH ? { executablePath: process.env.DS_CHROMIUM_PATH } : {});
let failed = 0;
for (const name of readdirSync(join(project, 'components'), { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name)) {
  const html = readFileSync(join(project, 'components', name, 'preview.html'), 'utf8');
  const meta = /<!-- @dsCard group="[^"]*"(?: height=(\d+))?(?: width=(\d+))?/.exec(html);
  const page = await browser.newPage({ viewport: { width: Number(meta?.[2] ?? 960), height: Number(meta?.[1] ?? 300) + 48 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => { if (m.type() === 'error' && !(name === 'Cover' && /Failed to load resource/.test(m.text()))) errors.push(m.text()); });
  const harness = join(screens, `_${name}.html`);
  writeFileSync(harness, `<!doctype html><html data-theme="light"><head><meta charset="utf-8"><style>${css.join('\n')}\n${bundleCss}</style><script>${bundleJs}</script></head><body>${html.replace(/^<!--.*?-->\n/, '')}</body></html>`);
  await page.goto(`file://${harness}`);
  await page.waitForTimeout(300);
  const empty = await page.evaluate((n) => n !== 'Cover' && (document.getElementById('root')?.childElementCount ?? 0) === 0, name);
  await page.screenshot({ path: join(screens, `${name}.png`), fullPage: true });
  if (errors.length || empty) { failed += 1; console.log(`FAIL ${name}: ${empty ? 'nothing rendered; ' : ''}${errors.slice(0, 2).join(' | ')}`); }
  await page.close();
}
await browser.close();
if (failed) { console.error(`${failed} preview(s) failed.`); process.exit(1); }
console.log('All previews rendered without errors.');
