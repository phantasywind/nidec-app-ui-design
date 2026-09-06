// Freeze the exact local candidate and its scoped evidence; never publish or edit CPQ.
import assert from 'node:assert/strict';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { sha256, inspectArchive } from './qualification-contract.mjs';
const root=join(import.meta.dirname,'..');
const run=join(root,'.qualification/runs/fluent-complete-region-1');
const out=join(root,'.qualification/deliveries/cpq-complete-region-5f90a70c');
const bytes=await readFile(join(run,'build-a/candidate.tgz'));
const digest='5f90a70c1e08724a2249f362cc0d29144f9350cc70f73b31148cd476b04573d6';
assert.equal(sha256(bytes),digest);
assert.equal(bytes.length,5601);
assert.deepEqual(bytes,await readFile(join(run,'build-b/candidate.tgz')));
const snapshot=join(run,'browser-closeout-1');
const checksumText=await readFile(join(snapshot,'SHA256SUMS.txt'),'utf8');
for(const line of checksumText.trim().split('\n')) {
  assert(/^[a-f0-9]{64}  [\w./-]+$/.test(line));
  assert.equal(sha256(await readFile(join(snapshot,line.slice(66)))),line.slice(0,64));
}
await mkdir(out,{recursive:false});
const sums=[];
async function save(path,data){
  await mkdir(dirname(join(out,path)),{recursive:true});
  await writeFile(join(out,path),data,{flag:'wx'});
  assert.equal(sha256(await readFile(join(out,path))),sha256(data));
  sums.push(`${sha256(data)}  ${path}`);
}
async function copy(dir,prefix){
  for(const item of await readdir(dir,{withFileTypes:true})) {
    assert(!item.isSymbolicLink());
    if(item.isDirectory()) await copy(join(dir,item.name),`${prefix}/${item.name}`);
    else await save(`${prefix}/${item.name}`,await readFile(join(dir,item.name)));
  }
}
await save('candidate.tgz',bytes);
for(const path of ['source.json','build-comparison.json','build-a/artifact.json','build-a/verify.txt','build-b/verify.txt']) await save(`evidence/${path}`,await readFile(join(run,path)));
await copy(snapshot,'evidence/browser-closeout-1');
await save('IMPLEMENTATION.md',await readFile(join(root,'docs/implementation/cpq-02-complete-region-implementation.md')));
await save('executor.mjs',await readFile(new URL(import.meta.url)));
await save('manifest.json',JSON.stringify({artifact:inspectArchive(bytes),package:'@phantasywind/nidec-app-ui-design',version:'0.0.0-development',fluent:'9.74.7',scope:'CPQ four-region controlled local implementation and simulation',status:'READY_FOR_LOCAL_IMPLEMENTATION_HANDOFF',sent:false,published:false,independentAcceptance:false,limitations:['Consumer fixture patches are recorded separately from original frozen package source','Host boundary tested on CSS copies; CPQ must implement and regress it','Production CSP, real business flows and independent acceptance are not passed','Uncovered icon-only actions remain an explicit later-phase item']},null,2)+'\n');
await writeFile(join(out,'SHA256SUMS.txt'),sums.join('\n')+'\n',{flag:'wx'});
console.log(`Frozen and read back ${sums.length} delivery files. Not sent, published or installed.`);
