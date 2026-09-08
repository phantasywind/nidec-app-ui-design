import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const pkg = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
const expected = pkg.version;
const approved = process.env.NIDEC_UI_RELEASE_APPROVED;
if (approved !== expected) {
  throw new Error(`Publication authorization is absent. NIDEC_UI_RELEASE_APPROVED must equal ${expected}.`);
}
const status = execFileSync('git', ['status', '--porcelain'], { cwd: root, encoding: 'utf8' });
if (status.trim()) throw new Error('Publication requires a clean working tree.');
const tags = execFileSync('git', ['tag', '--points-at', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim().split(/\r?\n/).filter(Boolean);
if (!tags.includes(`v${expected}`)) throw new Error(`Publication requires tag v${expected} at HEAD.`);
console.log(`Explicit publication authorization, clean tree and tag v${expected} verified.`);
