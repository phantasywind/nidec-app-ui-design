// Read only the two known local probe telemetry endpoints, not browser content.
import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

const root=resolve(import.meta.dirname,'..','.qualification/runs/fluent-form-batch-1');
for(const [directory,endpoint] of [['browser','/__probe/status'],['csp-control-2','/status']]){
  const dir=join(root,directory);
  const {origin}=JSON.parse(await readFile(join(dir,'server.json'),'utf8'));
  assert(/^http:\/\/127\.0\.0\.1:\d+$/.test(origin));
  const response=await globalThis.fetch(origin+endpoint);
  assert.equal(response.status,200);
  await writeFile(join(dir,'requests.json'),JSON.stringify(await response.json(),null,2)+'\n',{flag:'wx'});
}
await writeFile(join(root,'telemetry-capture-executor.mjs'),await readFile(new URL(import.meta.url)),{flag:'wx'});
console.log('Captured both local telemetry snapshots before exact-process shutdown.');
