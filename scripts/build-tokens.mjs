import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

const fixtureMarker = 'SCAFFOLD FIXTURE ONLY. NOT APPROVED BRAND DATA. PUBLICATION BLOCKED.';
const extensionKey = 'com.nidec.ui.scaffold';
const repositoryRoot = resolve(import.meta.dirname, '..');
const sourcePath = join(repositoryRoot, 'tokens', 'fixtures', 'scaffold.tokens.json');
const stylesPath = join(repositoryRoot, 'styles');
const componentSourcePath = join(stylesPath, 'components.css');
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
    assert(colorSpace === 'srgb', `Fixture color must use sRGB: ${token.path}`);
    assert(Array.isArray(components) && components.length === 3, `Fixture color must have three components: ${token.path}`);
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

  throw new Error(`Unsupported scaffold token type: ${token.type}`);
}

function toCssVariable(path) {
  const suffix = path.replaceAll('.', '-').replaceAll(/[^a-zA-Z0-9-]/g, '-').toLowerCase();
  return `--nidec-ui-${suffix}`;
}

const source = JSON.parse(await readFile(sourcePath, 'utf8'));
const scaffoldExtension = source.$extensions?.[extensionKey];
assert(source.$description === fixtureMarker, 'Fixture marker is missing or changed.');
assert(scaffoldExtension?.status === 'scaffold-only', 'Fixture status must remain scaffold-only.');
assert(scaffoldExtension?.publication === 'blocked', 'Fixture publication must remain blocked.');
assert(scaffoldExtension?.brandAuthority === 'absent', 'Fixture must not claim brand authority.');

const tokens = flattenTokens(source).sort((left, right) => left.path.localeCompare(right.path, 'en'));
assert(tokens.length > 0, 'Scaffold fixture must exercise at least one token.');
assert(tokens.every((token) => token.path.startsWith('fixture.')), 'Every scaffold token path must start with fixture.');

const metadata = {
  $description: fixtureMarker,
  $extensions: {
    [extensionKey]: {
      status: 'scaffold-only',
      publication: 'blocked',
      brandAuthority: 'absent',
      source: 'tokens/fixtures/scaffold.tokens.json',
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
const tokenCss = `/* ${fixtureMarker} */\n@layer nidec-ui {\n  [data-nidec-ui] {\n${cssDeclarations}\n  }\n}\n`;
const componentCss = await readFile(componentSourcePath, 'utf8');
assert(componentCss.includes(`/* ${fixtureMarker} */`), 'Component stylesheet marker is missing.');
assert(componentCss.includes('@layer nidec-ui'), 'Component stylesheet layer is missing.');
const tokenJson = `${JSON.stringify(metadata, null, 2)}\n`;
const stylesheetDeclaration = 'declare const stylesheet: string;\nexport default stylesheet;\n';

await mkdir(stylesPath, { recursive: true });
await mkdir(distPath, { recursive: true });

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

console.log(`Generated ${tokens.length} scaffold-only tokens. Publication remains blocked.`);
