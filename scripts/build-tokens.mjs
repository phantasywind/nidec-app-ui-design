import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

const releaseMarker = 'NIDEC LIGHT THEME RELEASE CANDIDATE. Source: ADR-0006.';
const extensionKey = 'com.nidec.ui';
const repositoryRoot = resolve(import.meta.dirname, '..');
const sourcePath = join(repositoryRoot, 'tokens', 'nidec-light.tokens.json');
const stylesPath = join(repositoryRoot, 'styles');
const componentSourcePath = join(stylesPath, 'components.css');
const palettePath = join(repositoryRoot, 'src', 'internal', 'light-palette.mjs');
const distPath = join(repositoryRoot, 'dist');

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function flattenTokens(node, path = [], inheritedType) {
  assert(node && typeof node === 'object' && !Array.isArray(node), `Invalid token group: ${path.join('.') || '<root>'}`);

  const currentType = node.$type ?? inheritedType;
  if (Object.hasOwn(node, '$value')) {
    assert(path.length > 0, 'A token must have a non-empty path.');
    assert(typeof currentType === 'string', `Missing $type for token: ${path.join('.')}`);
    return [{ path: path.join('.'), type: currentType, value: node.$value }];
  }

  const tokens = [];
  for (const key of Object.keys(node).filter((key) => !key.startsWith('$')).sort()) {
    tokens.push(...flattenTokens(node[key], [...path, key], currentType));
  }
  return tokens;
}

function cssNumber(value, context) {
  assert(typeof value === 'number' && Number.isFinite(value), `Expected a finite number for ${context}.`);
  return String(value);
}

function toCssValue(token) {
  if (token.type === 'color') {
    const { colorSpace, components, alpha = 1 } = token.value ?? {};
    assert(colorSpace === 'srgb', `Color must use sRGB: ${token.path}`);
    assert(Array.isArray(components) && components.length === 3, `Color must have three components: ${token.path}`);
    const serializedComponents = components.map((value) => {
      assert(typeof value === 'number' && value >= 0 && value <= 1, `Invalid sRGB component: ${token.path}`);
      return cssNumber(value, token.path);
    });
    assert(typeof alpha === 'number' && alpha >= 0 && alpha <= 1, `Invalid alpha: ${token.path}`);
    return `color(srgb ${serializedComponents.join(' ')} / ${cssNumber(alpha, token.path)})`;
  }

  if (token.type === 'dimension' || token.type === 'duration') {
    const { value, unit } = token.value ?? {};
    const allowedUnits = token.type === 'dimension' ? ['px', 'rem'] : ['ms', 's'];
    assert(allowedUnits.includes(unit), `Invalid ${token.type} unit: ${token.path}`);
    return `${cssNumber(value, token.path)}${unit}`;
  }

  if (token.type === 'number') {
    return cssNumber(token.value, token.path);
  }

  throw new Error(`Unsupported release token type: ${token.type}`);
}

function toCssVariable(path) {
  const suffix = path.replaceAll(/([a-z0-9])([A-Z])/g, '$1-$2').replaceAll('.', '-').replaceAll(/[^a-zA-Z0-9-]/g, '-').toLowerCase();
  return `--nidec-ui-${suffix}`;
}

const source = JSON.parse(await readFile(sourcePath, 'utf8'));
const releaseExtension = source.$extensions?.[extensionKey];
assert(releaseExtension?.status === 'release-candidate', 'Token source must remain a release candidate.');
assert(releaseExtension?.publication === 'qualified-input', 'Token source is not approved for candidate qualification.');
assert(releaseExtension?.authority === 'ADR-0006', 'Token authority must remain ADR-0006.');
assert(releaseExtension?.darkMode === 'out-of-scope', 'Dark Mode must remain outside this release scope.');

const tokens = flattenTokens(source).sort((left, right) => left.path.localeCompare(right.path, 'en'));
assert(tokens.length === 17, 'The approved light palette must contain exactly 17 roles.');
assert(tokens.every((token) => token.path.startsWith('color.')), 'Every release token path must start with color.');

const metadata = {
  $description: source.$description,
  $extensions: {
    [extensionKey]: {
      ...releaseExtension,
      source: 'tokens/nidec-light.tokens.json',
    },
  },
  tokens: tokens.map((token) => ({
    path: token.path,
    type: token.type,
    value: token.value,
    cssVariable: toCssVariable(token.path),
  })),
};

const cssDeclarations = tokens
  .map((token) => `    ${toCssVariable(token.path)}: ${toCssValue(token)};`)
  .join('\n');
const tokenCss = `/* ${releaseMarker} */\n@layer nidec-ui {\n  [data-nidec-ui] {\n${cssDeclarations}\n  }\n}\n`;
const componentCss = await readFile(componentSourcePath, 'utf8');
assert(componentCss.includes(`/* ${releaseMarker} */`), 'Component stylesheet release marker is missing.');
assert(componentCss.includes('@layer nidec-ui'), 'Component stylesheet layer is missing.');
const tokenJson = `${JSON.stringify(metadata, null, 2)}\n`;
const stylesheetDeclaration = 'declare const stylesheet: string;\nexport default stylesheet;\n';

const paletteEntries = Object.fromEntries(tokens.map((token) => {
  const role = token.path.slice('color.'.length);
  const components = token.value.components.map((value) => Math.round(value * 255).toString(16).padStart(2, '0'));
  return [role, `#${components.join('')}`];
}));
const paletteSource = `// GENERATED from tokens/nidec-light.tokens.json. Authority: ADR-0006.\n` +
  `// State derivatives live in the central theme mapping, never in components.\n` +
  `export const lightPalette = /* @__PURE__ */ Object.freeze(${JSON.stringify(paletteEntries, null, 2)});\n`;

await mkdir(stylesPath, { recursive: true });
await mkdir(distPath, { recursive: true });
await writeFile(palettePath, paletteSource, 'utf8');

for (const [fileName, content] of [
  ['tokens.css', tokenCss],
  ['tokens.css.d.ts', stylesheetDeclaration],
  ['styles.css', componentCss],
  ['styles.css.d.ts', stylesheetDeclaration],
  ['tokens.json', tokenJson],
]) {
  await writeFile(join(stylesPath, fileName), content, 'utf8');
  await writeFile(join(distPath, fileName), content, 'utf8');
}

console.log(`Generated ${tokens.length} governed light-theme tokens from ADR-0006.`);
