import { readFile, readdir } from 'node:fs/promises';
import { extname, join, relative, resolve, sep } from 'node:path';

const repositoryRoot = resolve(import.meta.dirname, '..');
const packagePath = join(repositoryRoot, 'package.json');
const publicEntryPath = join(repositoryRoot, 'src', 'index.ts');
const namespacePath = join(repositoryRoot, 'src', 'internal', 'namespace.ts');
const distPath = join(repositoryRoot, 'dist');

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function readJson(path) {
  return JSON.parse(await readFile(path, 'utf8'));
}

async function listFiles(path) {
  const files = [];

  try {
    const entries = await readdir(path, { withFileTypes: true });

    for (const entry of entries) {
      const entryPath = join(path, entry.name);

      if (entry.isDirectory()) {
        files.push(...await listFiles(entryPath));
      } else if (entry.isFile()) {
        files.push(entryPath);
      } else {
        throw new Error(`Unsupported filesystem entry: ${entryPath}`);
      }
    }
  } catch (error) {
    if (error?.code !== 'ENOENT') {
      throw error;
    }
  }

  return files;
}

function isExactVersion(value) {
  return /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(value);
}

const packageJson = await readJson(packagePath);

assert(packageJson.name === '@phantasywind/nidec-app-ui-design', 'Unexpected package name.');
assert(packageJson.version === '0.0.0-development', 'Unexpected development version.');
assert(packageJson.private === true, 'Package must remain private.');
assert(packageJson.type === 'module', 'Package must remain ESM.');
assert(packageJson.packageManager === 'npm@11.19.0', 'Unexpected package manager.');
assert(packageJson.engines?.node === '>=22.12.0', 'Unexpected consumer Node engine floor.');
assert(JSON.stringify(packageJson.files) === JSON.stringify(['dist']), 'Package files allowlist must contain only dist.');
assert(packageJson.types === './dist/index.d.ts', 'Unexpected declaration entry.');
assert(packageJson.module === './dist/index.js', 'Unexpected ESM entry.');
assert(
  JSON.stringify(packageJson.exports) === JSON.stringify({
    '.': {
      types: './dist/index.d.ts',
      import: './dist/index.js',
    },
    './tokens.css': {
      types: './dist/tokens.css.d.ts',
      default: './dist/tokens.css',
    },
    './styles.css': {
      types: './dist/styles.css.d.ts',
      default: './dist/styles.css',
    },
    './tokens.json': './dist/tokens.json',
  }),
  'Only the approved Stage 3D public subpaths are allowed.',
);
assert(packageJson.dependencies === undefined, 'Stage 3C must not add runtime dependencies.');
assert(packageJson.peerDependencies?.react === '>=19.2.0 <20', 'Unexpected React peer range.');
assert(packageJson.peerDependencies?.['react-dom'] === '>=19.2.0 <20', 'Unexpected React DOM peer range.');
assert(packageJson.peerDependenciesMeta?.react?.optional === true, 'React peer must remain optional for token-only consumers.');
assert(packageJson.peerDependenciesMeta?.['react-dom']?.optional === true, 'React DOM peer must remain optional for token-only consumers.');

for (const [name, version] of Object.entries(packageJson.devDependencies ?? {})) {
  assert(isExactVersion(version), `Development dependency must use an exact version: ${name}=${version}`);
}

const publicEntry = await readFile(publicEntryPath, 'utf8');
assert(publicEntry.trim() === 'export {};', 'Stage 3C public entry must remain empty.');

const namespaceSource = await readFile(namespacePath, 'utf8');
for (const requiredValue of [
  "hostAttribute: 'data-nidec-ui'",
  "hostSelector: '[data-nidec-ui]'",
  "cssVariablePrefix: '--nidec-ui-'",
  "cssClassPrefix: 'nidec-ui-'",
  "cascadeLayer: 'nidec-ui'",
]) {
  assert(namespaceSource.includes(requiredValue), `Missing namespace contract: ${requiredValue}`);
}

const sourceFiles = await listFiles(join(repositoryRoot, 'src'));
const publicSourceFiles = sourceFiles.filter((path) => !path.includes(`${sep}internal${sep}`));
const publicSourcePaths = publicSourceFiles.map((path) => relative(repositoryRoot, path).replaceAll('\\', '/'));
assert(
  JSON.stringify(publicSourcePaths) === JSON.stringify(['src/index.ts']),
  'Stage 3C may expose only src/index.ts outside the internal directory.',
);

const forbiddenBusinessTerms = /\b(cpq|epm|quote|pricing|bom|configuration|approval|rbac)\b/i;
for (const sourcePath of sourceFiles.filter((path) => ['.ts', '.tsx'].includes(extname(path)))) {
  const source = await readFile(sourcePath, 'utf8');
  assert(!forbiddenBusinessTerms.test(source), `Application business term found in ${relative(repositoryRoot, sourcePath)}.`);
}

const distFiles = (await listFiles(distPath)).map((path) => relative(distPath, path).replaceAll('\\', '/')).sort();
if (distFiles.length > 0) {
  const allowedDistFiles = [
    'index.d.ts',
    'index.js',
    'styles.css',
    'styles.css.d.ts',
    'tokens.css',
    'tokens.css.d.ts',
    'tokens.json',
  ];
  assert(JSON.stringify(distFiles) === JSON.stringify(allowedDistFiles), `Unexpected dist files: ${distFiles.join(', ')}`);

  const builtJavaScript = await readFile(join(distPath, 'index.js'), 'utf8');
  assert(!/from\s+['"]react(?:-dom)?(?:\/jsx-runtime)?['"]/.test(builtJavaScript), 'React must not be bundled or imported by the empty entry.');

  const declaration = await readFile(join(distPath, 'index.d.ts'), 'utf8');
  assert(declaration.trim() === 'export {};', 'Stage 3C declaration must remain empty.');
}

console.log(`Boundary contract verified${distFiles.length > 0 ? ` for ${distFiles.length} build files` : ' before build'}.`);
