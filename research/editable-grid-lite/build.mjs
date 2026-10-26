// Builds the research prototype into one self-contained HTML file (dist/index.html).
import { readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { build } from 'vite';

const here = resolve(import.meta.dirname);
const out = join(here, 'dist');
rmSync(out, { recursive: true, force: true });
await build({
  configFile: false,
  root: here,
  logLevel: 'warn',
  esbuild: { jsx: 'automatic' },
  define: { 'process.env.NODE_ENV': '"production"' },
  build: { outDir: join(out, 'raw'), emptyOutDir: true, cssCodeSplit: false, assetsInlineLimit: 1e9, modulePreload: false },
});
const raw = join(out, 'raw');
const assets = readdirSync(join(raw, 'assets'));
const js = assets.filter(f => f.endsWith('.js')).map(f => readFileSync(join(raw, 'assets', f), 'utf8')).join('\n');
const css = assets.filter(f => f.endsWith('.css')).map(f => readFileSync(join(raw, 'assets', f), 'utf8')).join('\n');
const html = readFileSync(join(here, 'index.html'), 'utf8')
  .replace('<script type="module" src="./app.tsx"></script>', () => `<script type="module">${js.replaceAll('</script', '<\\/script')}</script>`)
  .replace('</head>', () => `<style>${css}</style></head>`);
writeFileSync(join(out, 'index.html'), html);
rmSync(raw, { recursive: true, force: true });
console.log(`dist/index.html ${(html.length / 1024).toFixed(0)} KB`);
