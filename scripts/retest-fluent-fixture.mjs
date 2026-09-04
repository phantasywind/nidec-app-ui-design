import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { cp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { delimiter, dirname, join, resolve } from 'node:path';
const root=resolve(import.meta.dirname,'..');
const consumer=join(root,'.tmp/fluent-adaptation/consumer-node22/react-vite-cpq-consumer');
const evidence=join(root,'.qualification/runs/fluent-adaptation/consumer-retest');
await mkdir(evidence);
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const artifact=await readFile(join(consumer,'candidate.tgz'));
assert.equal(hash(artifact),'f1bca649bcc2828635744c9e477301fc179272b514f6588eeb122f209c07b20a');
const fixture=await readFile(join(consumer,'src/main.tsx'));
assert.deepEqual(fixture,await readFile(join(root,'fixtures/react-vite-cpq-consumer/src/main.tsx')));
const node=join(root,'.tmp/node-22.22.0/node-v22.22.0-win-x64/node.exe');
const result=spawnSync(node,[join(dirname(node),'node_modules/npm/bin/npm-cli.js'),'run','verify'],{
  cwd:consumer,encoding:'utf8',env:{...process.env,PATH:`${dirname(node)}${delimiter}${process.env.PATH ?? ''}`},
});
await writeFile(join(evidence,'verify.txt'),result.stdout+result.stderr);
assert.equal(result.status,0,result.stdout+result.stderr);
await writeFile(join(evidence,'main.tsx'),fixture);
await cp(join(consumer,'dist'),join(evidence,'dist'),{recursive:true});
await writeFile(join(evidence,'record.json'),JSON.stringify({
  reason:'Native comparison button spacing corrected after target-size failure; no library or dependency changes.',
  artifact:hash(artifact),fixture:hash(fixture),lock:hash(await readFile(join(consumer,'package-lock.json'))),
  installedPackage:hash(await readFile(join(consumer,'node_modules/@phantasywind/nidec-app-ui-design/dist/index.js'))),
  note:'Reuses the already clean-installed Node22 consumer; rebuild only, not a new npm ci.',
},null,2));
console.log(result.stdout+result.stderr);
