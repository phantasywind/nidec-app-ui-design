import { readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

const blockedMarker = 'SCAFFOLD FIXTURE ONLY. NOT APPROVED BRAND DATA. PUBLICATION BLOCKED.';
const repositoryRoot = resolve(import.meta.dirname, '..');
const packageJson = JSON.parse(await readFile(join(repositoryRoot, 'package.json'), 'utf8'));
const lock = JSON.parse(await readFile(join(repositoryRoot, 'package-lock.json'), 'utf8'));
const source = JSON.parse(await readFile(join(repositoryRoot, 'tokens', 'nidec-light.tokens.json'), 'utf8'));
const metadata = JSON.parse(await readFile(join(repositoryRoot, 'styles', 'tokens.json'), 'utf8'));
const blockers = [];

if (packageJson.version !== '0.1.0-rc.1') blockers.push('unexpected release-candidate version');
if (packageJson.private !== false) blockers.push('package is not explicitly publishable');
if (packageJson.publishConfig?.registry !== 'https://npm.pkg.github.com' || packageJson.publishConfig?.access !== 'restricted') blockers.push('GitHub Packages publishConfig is incomplete');
if (lock.version !== packageJson.version || lock.packages?.['']?.version !== packageJson.version) blockers.push('package lock identity is stale');
if (source.$extensions?.['com.nidec.ui']?.status !== 'release-candidate' || source.$extensions?.['com.nidec.ui']?.authority !== 'ADR-0006') blockers.push('governed token authority is missing');
if (metadata.$extensions?.['com.nidec.ui']?.source !== 'tokens/nidec-light.tokens.json') blockers.push('generated token metadata is stale');

for (const relativePath of [
  'tokens/nidec-light.tokens.json', 'styles/tokens.css', 'styles/tokens.json', 'styles/components.css', 'styles/styles.css',
]) {
  const content = await readFile(join(repositoryRoot, relativePath), 'utf8');
  if (content.includes(blockedMarker) || content.includes('"publication": "blocked"')) blockers.push(`blocked scaffold content remains at ${relativePath}`);
}

if (blockers.length > 0) throw new Error(`Publication blocked:\n- ${blockers.join('\n- ')}`);
console.log(`Release-candidate publication inputs verified for ${packageJson.name}@${packageJson.version}.`);
