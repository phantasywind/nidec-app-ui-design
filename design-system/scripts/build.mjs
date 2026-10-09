// Builds the Claude Design System artifact files into design-system/dist/project.
// Prerequisite: `npm ci` at the repository root and in this directory.
import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import vm from 'node:vm';
import { build } from 'vite';
import { transform } from 'esbuild';

const here = resolve(import.meta.dirname, '..');
const repo = resolve(here, '..');
const dist = join(here, 'dist');
const out = join(dist, 'project');
const config = JSON.parse(readFileSync(join(here, 'config.json'), 'utf8'));
const pkg = JSON.parse(readFileSync(join(repo, 'package.json'), 'utf8'));
const git = (...args) => execFileSync('git', args, { cwd: repo, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();

rmSync(dist, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

// ---- provenance -----------------------------------------------------------
const sha = git('rev-parse', '--short', 'HEAD');
const dirty = git('status', '--porcelain', '--', 'src', 'styles', 'tokens', 'design-system').length > 0;
let sinceTag = '';
try { sinceTag = git('describe', '--tags', '--abbrev=0', '--match', 'v*'); } catch { /* no tag */ }
const onTag = sinceTag === `v${pkg.version}` && git('rev-list', '-n', '1', sinceTag).startsWith(git('rev-parse', 'HEAD').slice(0, 7));
const branch = git('rev-parse', '--abbrev-ref', 'HEAD');
const ref = `${branch}@${sha}${dirty ? ' (uncommitted changes)' : ''}`;
const unreleased = onTag
  ? `This build matches the published tag ${sinceTag}.`
  : `This build is from a branch and may include changes that are not in the published ${pkg.version}; the release record of the next version lists them.`;
const fill = (text) => text
  .replaceAll('{{SOURCE_REF}}', ref)
  .replaceAll('{{PACKAGE}}', `${pkg.name}@${pkg.version}`)
  .replaceAll('{{PACKAGE_VERSION}}', pkg.version)
  .replaceAll('{{UNRELEASED_NOTE}}', unreleased)
  .replaceAll('{{DATE}}', new Date().toISOString().slice(0, 10))
  .replaceAll('{{LOGO_BLOB}}', config.logoBlob);

// ---- tokens: colours come from the governed palette, never retyped ---------
const { lightPalette } = await import(join(repo, 'src/internal/light-palette.mjs'));
const template = JSON.parse(readFileSync(join(here, 'content/tokens.template.json'), 'utf8'));
const hex = (name) => lightPalette[template.color.tokens.find((t) => t.name === name).palette];
const lin = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const lum = (h) => { const n = parseInt(h.slice(1), 16); return 0.2126 * lin(n >> 16) + 0.7152 * lin((n >> 8) & 255) + 0.0722 * lin(n & 255); };
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const failures = (template.checks ?? []).filter((c) => ratio(hex(c.fg), hex(c.bg)) < c.min)
  .map((c) => `${c.fg} on ${c.bg}: ${ratio(hex(c.fg), hex(c.bg)).toFixed(2)} < ${c.min}`);
if (failures.length) throw new Error(`Palette contrast checks failed:\n- ${failures.join('\n- ')}`);
const tokens = JSON.parse(fill(JSON.stringify(template)));
delete tokens.checks; delete tokens.checksNote;
tokens.color.tokens = tokens.color.tokens.map(({ name, palette, usage }) => ({ name, value: { light: lightPalette[palette] }, usage }));
writeFileSync(join(out, 'tokens.json'), `${JSON.stringify(tokens, null, 2)}\n`);

// ---- documents ---------------------------------------------------------------
const content = join(here, 'content');
writeFileSync(join(out, 'README.md'), fill(readFileSync(join(content, 'README.md'), 'utf8')));
writeFileSync(join(out, 'page-selection.md'), readFileSync(join(content, 'page-selection.md'), 'utf8'));
mkdirSync(join(out, 'assets/Logos'), { recursive: true });
cpSync(join(content, 'assets/Logos/README.md'), join(out, 'assets/Logos/README.md'));
const components = readdirSync(join(content, 'components'), { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name).sort();
for (const name of components) {
  mkdirSync(join(out, 'components', name), { recursive: true });
  cpSync(join(content, 'components', name, 'README.md'), join(out, 'components', name, 'README.md'));
}

// ---- component bundle: the repository's own source, React included ----------
await build({
  configFile: false,
  root: repo,
  logLevel: 'warn',
  define: { 'process.env.NODE_ENV': '"production"' },
  build: {
    outDir: join(dist, 'bundle'), emptyOutDir: true, sourcemap: false, minify: true, cssCodeSplit: false,
    lib: { entry: join(here, 'src/entry.ts'), formats: ['iife'], name: 'NidecUiBundle', fileName: () => 'bundle.js' },
  },
});
const bundle = readFileSync(join(dist, 'bundle/bundle.js'), 'utf8');
if (/<\/script|<!--/i.test(bundle)) throw new Error('bundle.js contains a sequence that cannot be inlined in a page.');
const header = `/* @ds-bundle: ${JSON.stringify({ format: 4, namespace: config.namespace, components: components.map((name) => ({ name })) })} */\n`;
mkdirSync(join(out, 'components'), { recursive: true });
writeFileSync(join(out, 'components/bundle.js'), header + bundle);
cpSync(join(repo, 'styles/styles.css'), join(out, 'components/bundle.css'));

// ---- types as documentation --------------------------------------------------
execFileSync(process.execPath, [join(repo, 'node_modules/typescript/bin/tsc'), '-p', join(repo, 'tsconfig.build.json'), '--outDir', join(dist, 'types')], { cwd: repo, stdio: 'inherit' });
const dts = ['index', 'layouts', 'date-picker'].map((n) => `// ---- ${n} ----\n${readFileSync(join(dist, 'types', `${n}.d.ts`), 'utf8')}`).join('\n');
writeFileSync(join(out, 'components/index.d.ts'), dts);

// ---- previews: JSX sources compiled into one small page each -----------------
const ctx = { }; ctx.window = ctx; ctx.self = ctx; ctx.globalThis = ctx;
vm.runInNewContext(bundle, ctx, { timeout: 30000 });
const exportsList = Object.keys(ctx.NidecUi).filter((k) => /^[A-Za-z_$][\w$]*$/.test(k) && !['React', 'createRoot'].includes(k));
const pageStyle = '<style>body{margin:0;padding:24px;background:var(--surface);color:var(--text);font-family:var(--font-sans)}</style>';
const sources = readdirSync(join(here, 'previews')).sort();
for (const file of sources) {
  const name = file.replace(/\.(jsx|html)$/, '');
  const target = join(out, 'components', name, 'preview.html');
  mkdirSync(join(out, 'components', name), { recursive: true });
  const source = readFileSync(join(here, 'previews', file), 'utf8');
  if (file.endsWith('.html')) { writeFileSync(target, fill(source)); continue; }
  const meta = /^\/\/ @card group="([^"]*)" height=(\d+)(?: width=(\d+))? subtitle="([^"]*)"/.exec(source);
  if (!meta) throw new Error(`${file}: missing // @card line`);
  if (!components.includes(name) && name !== 'Cover') throw new Error(`${file}: no matching component page in content/components`);
  const used = exportsList.filter((n) => new RegExp(`\\b${n}\\b`).test(source));
  const { code } = await transform(source, { loader: 'jsx', jsxFactory: 'h', jsxFragment: 'Frag' });
  writeFileSync(target, `<!-- @dsCard group="${meta[1]}" height=${meta[2]}${meta[3] ? ` width=${meta[3]}` : ''} subtitle="${meta[4]}" -->
${pageStyle}
<div id="root"></div>
<script>
(function(){
var U=window.NidecUi;if(!U){document.body.textContent='Component bundle not loaded.';return;}
var h=U.React.createElement,Frag=U.React.Fragment,useState=U.React.useState;
${used.length ? `var {${used.join(',')}}=U;` : ''}
${code}
U.createRoot(document.getElementById('root')).render(h(U.NidecProvider,{theme:U.nidecLightTheme},h(Demo)));
})();
</script>
`);
}
const missing = components.filter((n) => !existsSync(join(out, 'components', n, 'preview.html')));
if (missing.length) throw new Error(`Components without a preview: ${missing.join(', ')}`);
console.log(`Built ${components.length} components, ${sources.length} previews, bundle ${(bundle.length / 1024).toFixed(0)} KB -> ${out}`);
console.log(`Source ${ref}. ${unreleased}`);
