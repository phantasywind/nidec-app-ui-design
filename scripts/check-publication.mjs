import { readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

const fixtureMarker = 'SCAFFOLD FIXTURE ONLY. NOT APPROVED BRAND DATA. PUBLICATION BLOCKED.';
const repositoryRoot = resolve(import.meta.dirname, '..');
const packageJson = JSON.parse(await readFile(join(repositoryRoot, 'package.json'), 'utf8'));
const blockers = [];

if (packageJson.private === true) {
  blockers.push('package.json is private');
}

for (const path of [
  join(repositoryRoot, 'tokens', 'fixtures', 'scaffold.tokens.json'),
  join(repositoryRoot, 'styles', 'tokens.css'),
  join(repositoryRoot, 'styles', 'tokens.json'),
]) {
  try {
    const content = await readFile(path, 'utf8');
    if (content.includes(fixtureMarker) || content.includes('"publication": "blocked"')) {
      blockers.push(`scaffold fixture exists at ${path.slice(repositoryRoot.length + 1)}`);
    }
  } catch (error) {
    if (error?.code !== 'ENOENT') {
      throw error;
    }
  }
}

if (blockers.length > 0) {
  throw new Error(`Publication blocked:\n- ${blockers.join('\n- ')}`);
}

console.log('No scaffold publication blocker found.');
