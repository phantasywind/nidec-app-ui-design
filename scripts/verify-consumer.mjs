import { cp, mkdir, readFile, readdir, realpath, rm, writeFile } from 'node:fs/promises';
import { delimiter, dirname, join, relative, resolve, sep } from 'node:path';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { verifyPhysicalReact } from './qualification-contract.mjs';
import { RELEASE_PACKAGE_VERSION as packageVersion, verifyReleaseBinding as verifyBinding } from './release-contract.mjs';

const packageName = '@phantasywind/nidec-app-ui-design';
const repositoryRoot = resolve(import.meta.dirname, '..');
const fixturesRoot = join(repositoryRoot, 'fixtures');
const packRoot = join(repositoryRoot, '.pack');
const consumerEvidencePath = join(packRoot, 'consumer-result.json');
const temporaryRoot = resolve(repositoryRoot, '.tmp', 'consumers');
const cacheRoot = resolve(repositoryRoot, '.tmp', 'fluent-npm-cache');
const npmCliPath = process.env.npm_execpath;
const exactToolchainEnvironment = {
  ...process.env,
  PATH: `${dirname(process.execPath)}${delimiter}${process.env.PATH ?? ''}`,
  npm_config_cache: cacheRoot,
  npm_config_audit: 'false',
  npm_config_fund: 'false',
};

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function runNpm(arguments_, cwd, captureOnly = false) {
  assert(typeof npmCliPath === 'string' && npmCliPath.length > 0, 'npm_execpath is required for exact npm execution.');
  const result = spawnSync(process.execPath, [npmCliPath, ...arguments_], {
    cwd,
    encoding: 'utf8',
    env: exactToolchainEnvironment,
    maxBuffer: 20 * 1024 * 1024,
  });

  if (!captureOnly && result.stdout) {
    process.stdout.write(result.stdout);
  }
  if (result.stderr) {
    process.stderr.write(result.stderr);
  }
  assert(!result.error, `npm process failed in ${relative(repositoryRoot, cwd)}: ${result.error?.message}`);
  assert(result.status === 0, `npm ${arguments_.join(' ')} failed in ${relative(repositoryRoot, cwd)}.`);
  return result.stdout;
}

async function listFiles(path) {
  const files = [];
  for (const entry of await readdir(path, { withFileTypes: true })) {
    const entryPath = join(path, entry.name);
    if (entry.isDirectory()) {
      files.push(...await listFiles(entryPath));
    } else if (entry.isFile()) {
      files.push(entryPath);
    } else {
      throw new Error(`Unsupported filesystem entry: ${entryPath}`);
    }
  }
  return files;
}

async function fileExists(path) {
  try {
    await readFile(path);
    return true;
  } catch (error) {
    if (error?.code === 'ENOENT') {
      return false;
    }
    throw error;
  }
}

function collectDependencyVersions(node, names, versions = new Map(names.map((name) => [name, new Set()]))) {
  for (const [name, dependency] of Object.entries(node.dependencies ?? {})) {
    if (names.includes(name) && typeof dependency.version === 'string') {
      versions.get(name).add(dependency.version);
    }
    collectDependencyVersions(dependency, names, versions);
  }
  return versions;
}

async function verifyInstalledPackage(consumerRoot) {
  const installedRoot = join(consumerRoot, 'node_modules', '@phantasywind', 'nidec-app-ui-design');
  const installedManifest = JSON.parse(await readFile(join(installedRoot, 'package.json'), 'utf8'));
  assert(installedManifest.version === packageVersion, `Unexpected installed Design System version in ${consumerRoot}.`);

  const expectedFiles = [
    'README.md',
    'dist/date-picker.d.ts',
    'dist/date-picker.js',
    'dist/index.d.ts',
    'dist/index.js',
    'dist/layouts.d.ts',
    'dist/layouts.js',
    'dist/styles.css',
    'dist/styles.css.d.ts',
    'dist/tokens.css',
    'dist/tokens.css.d.ts',
    'dist/tokens.json',
    'package.json',
  ];
  const actualFiles = (await listFiles(installedRoot))
    .map((path) => relative(installedRoot, path).replaceAll('\\', '/'))
    .sort();
  assert(
    JSON.stringify(actualFiles) === JSON.stringify(expectedFiles),
    `Installed package contains unexpected files in ${consumerRoot}:\n${actualFiles.join('\n')}`,
  );
  return installedManifest;
}

async function verifyNoRuntimeGitHubDependency(consumerRoot) {
  const buildRoot = join(consumerRoot, 'dist');
  for (const path of await listFiles(buildRoot)) {
    const content = await readFile(path, 'utf8');
    assert(!/github\.com|npm\.pkg\.github\.com/i.test(content), `Runtime GitHub reference found in ${path}.`);
    assert(!content.includes(repositoryRoot), `Repository source path leaked into ${path}.`);
  }
}

async function verifyConsumer(name, artifactUrl) {
  const templateRoot = join(fixturesRoot, name);
  const consumerRoot = join(temporaryRoot, name);
  await cp(templateRoot, consumerRoot, { recursive: true });

  const manifestPath = join(consumerRoot, 'package.json');
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  manifest.dependencies = {
    ...(manifest.dependencies ?? {}),
    [packageName]: artifactUrl,
  };
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');

  console.log(`Preparing isolated ${name} fixture.`);
  verifyBinding(await readFile(artifactPath), packEvidence.archiveEvidence);
  runNpm(['install', '--ignore-scripts', '--no-fund', '--offline'], consumerRoot);

  const lock = JSON.parse(await readFile(join(consumerRoot, 'package-lock.json'), 'utf8'));
  assert(lock.lockfileVersion === 3, `${name} must use lockfile version 3.`);
  assert(lock.packages?.['']?.dependencies?.[packageName] === artifactUrl, `${name} lockfile does not reference the actual tarball.`);

  const modulesPath = resolve(consumerRoot, 'node_modules');
  assert(modulesPath === `${consumerRoot}${sep}node_modules`, `Unexpected node_modules path: ${modulesPath}`);
  await rm(modulesPath, { force: true, recursive: true });
  verifyBinding(await readFile(artifactPath), packEvidence.archiveEvidence);
  runNpm(['ci', '--ignore-scripts', '--no-fund', '--offline'], consumerRoot);
  verifyBinding(await readFile(artifactPath), packEvidence.archiveEvidence);
  runNpm(['run', 'verify'], consumerRoot);

  const installedManifest = await verifyInstalledPackage(consumerRoot);
  await verifyNoRuntimeGitHubDependency(consumerRoot);

  if (name === 'token-only-consumer') {
    assert(!(await fileExists(join(consumerRoot, 'node_modules', '@fluentui', 'react-components', 'package.json'))),
      'Token-only consumer unexpectedly installed Fluent.');
    assert(
      !(await fileExists(join(consumerRoot, 'node_modules', 'react', 'package.json'))),
      'Token-only consumer unexpectedly installed React.',
    );
    assert(
      !(await fileExists(join(consumerRoot, 'node_modules', 'react-dom', 'package.json'))),
      'Token-only consumer unexpectedly installed React DOM.',
    );
  }

  if (name === 'react-vite-cpq-consumer') {
    await verifyPhysicalReact(consumerRoot, join(consumerRoot, 'node_modules', '@phantasywind', 'nidec-app-ui-design'));
    const tree = JSON.parse(runNpm(['ls', 'react', 'react-dom', '--all', '--json'], consumerRoot, true));
    const versions = collectDependencyVersions(tree, ['react', 'react-dom']);
    assert(JSON.stringify([...versions.get('react')]) === JSON.stringify(['19.2.7']), 'React must resolve exactly once at 19.2.7.');
    assert(JSON.stringify([...versions.get('react-dom')]) === JSON.stringify(['19.2.7']), 'React DOM must resolve exactly once at 19.2.7.');
  }

  let navigationDependency;
  if (name === 'react-navigation-cold-consumer') {
    assert(manifest.dependencies?.['@fluentui/react-icons'] === undefined, 'Cold Navigation fixture must not declare Fluent icons.');
    assert(installedManifest.dependencies?.['@fluentui/react-icons'] === undefined && installedManifest.peerDependencies?.['@fluentui/react-icons'] === undefined,
      'Shared package must not claim a direct icon dependency without reproduced evidence.');
    const iconLock = lock.packages?.['node_modules/@fluentui/react-icons'];
    assert(iconLock?.version === '2.0.339', 'Fluent 9.74.7 dependency closure must resolve react-icons 2.0.339.');
    const requireApp = createRequire(manifestPath);
    const resolvedPath = await realpath(requireApp.resolve('@fluentui/react-icons'));
    const tree = JSON.parse(runNpm(['ls', '@fluentui/react-icons', '--all', '--json'], consumerRoot, true));
    navigationDependency = { declaredByApplication: false, version: iconLock.version, resolvedPath, tree };
  }

  console.log(`Verified isolated ${name} fixture.`);
  return navigationDependency;
}

assert(temporaryRoot === `${repositoryRoot}${sep}.tmp${sep}consumers`, `Unexpected temporary root: ${temporaryRoot}`);
await mkdir(cacheRoot, { recursive: true });
const artifacts = (await readdir(packRoot)).filter((name) => name.endsWith('.tgz'));
assert(artifacts.length === 1, 'Exactly one packed .tgz is required before consumer verification.');
const artifactPath = join(packRoot, artifacts[0]);
const packEvidence = JSON.parse(await readFile(join(packRoot, 'pack-result.json'), 'utf8'));
verifyBinding(await readFile(artifactPath), packEvidence.archiveEvidence);
const artifactUrl = `file:${artifactPath.replaceAll('\\', '/')}`;
const completedConsumers = [];
const evidence = {
  status: 'running',
  node: process.version,
  npmUserAgent: process.env.npm_config_user_agent ?? 'unknown',
  artifact: artifacts[0],
  completedConsumers,
  navigationDependency: undefined,
  temporaryConsumersRemoved: false,
};

await rm(temporaryRoot, { force: true, recursive: true });
await rm(consumerEvidencePath, { force: true });

try {
  await verifyConsumer('token-only-consumer', artifactUrl);
  completedConsumers.push('token-only-consumer');
  await verifyConsumer('react-vite-cpq-consumer', artifactUrl);
  completedConsumers.push('react-vite-cpq-consumer');
  evidence.navigationDependency = await verifyConsumer('react-navigation-cold-consumer', artifactUrl);
  completedConsumers.push('react-navigation-cold-consumer');
  evidence.status = 'passed';
} catch (error) {
  evidence.status = 'failed';
  evidence.error = error instanceof Error ? error.stack : String(error);
  throw error;
} finally {
  await rm(temporaryRoot, { force: true, recursive: true });
  evidence.temporaryConsumersRemoved = true;
  await writeFile(consumerEvidencePath, `${JSON.stringify(evidence, null, 2)}\n`, 'utf8');
}

console.log('All isolated consumers verified and temporary installations removed.');
