// Immutable technical handoff only. Never installs into CPQ or publishes.
import assert from 'node:assert/strict';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { sha256, inspectArchive } from './qualification-contract.mjs';
const root=join(import.meta.dirname,'..');
const run=join(root,'.qualification/runs/fluent-directory-actions-1');
const source=join(root,'.tmp/fluent-directory-actions-1/source');
const out=join(root,'.qualification/deliveries/cpq-directory-actions-304a5d85');
const digest='304a5d85e96c42d941a1c602dbc98c9927d7ecd0513d735678402292d27f7ea0';
const archive=await readFile(join(run,'build-a/candidate.tgz'));
assert.equal(sha256(archive),digest);assert.equal(archive.length,6066);
assert.deepEqual(archive,await readFile(join(run,'build-b/candidate.tgz')));
const inventory=JSON.parse(await readFile(join(run,'source.json'),'utf8'));
for(const item of inventory.files){
  assert(/^[\w./-]+$/.test(item.path)&&!item.path.startsWith('/')&&!item.path.split('/').includes('..'));
  assert.equal(sha256(await readFile(join(source,item.path))),item.sha256);
  if(/^(src\/|styles\/|tokens\/|package(?:-lock)?\.json$|vite\.config\.ts$|tsconfig[^/]*\.json$)/.test(item.path))
    assert.equal(sha256(await readFile(join(root,item.path))),item.sha256,`Package input changed: ${item.path}`);
}
const snapshot=join(run,'checkpoint-2');
for(const line of (await readFile(join(snapshot,'SHA256SUMS.txt'),'utf8')).trim().split('\n')){
  assert(/^[a-f0-9]{64}  [\w./-]+$/.test(line)&&!line.slice(66).split('/').includes('..'));
  assert.equal(sha256(await readFile(join(snapshot,line.slice(66)))),line.slice(0,64));
}
await mkdir(out);const sums=[];
async function save(path,bytes){await mkdir(dirname(join(out,path)),{recursive:true});await writeFile(join(out,path),bytes,{flag:'wx'});assert.equal(sha256(await readFile(join(out,path))),sha256(bytes));sums.push(`${sha256(bytes)}  ${path}`);}
async function copy(dir,prefix){for(const item of await readdir(dir,{withFileTypes:true})){assert(!item.isSymbolicLink());if(item.isDirectory())await copy(join(dir,item.name),`${prefix}/${item.name}`);else await save(`${prefix}/${item.name}`,await readFile(join(dir,item.name)));}}
await save('candidate.tgz',archive);
for(const item of inventory.files)await save(`source/${item.path}`,await readFile(join(source,item.path)));
for(const name of ['source.json','build-comparison.json','build-a/artifact.json','build-a/ci.txt','build-a/verify.txt','build-a/pack.txt','build-b/ci.txt','build-b/verify.txt','build-b/pack.txt'])await save(`evidence/${name}`,await readFile(join(run,name)));
await copy(snapshot,'evidence/checkpoint-2');
await save('CANDIDATE.md',await readFile(join(root,'docs/implementation/cpq-directory-actions-candidate.md')));
await save('qualification-record.md',await readFile(join(root,'docs/implementation/fluent-directory-actions-record.md')));
await save('executor.mjs',await readFile(new URL(import.meta.url)));
await save('manifest.json',JSON.stringify({package:'@phantasywind/nidec-app-ui-design',version:'0.0.0-development',fluent:'9.74.7',sha256:digest,artifact:inspectArchive(archive),sourceHead:inventory.head,cleanSource:false,status:'TECHNICAL_CANDIDATE_RECORDED_APPLICATION_SCOPE_PENDING',installed:false,published:false,independentAcceptance:false,limitations:['Fixture fixes are separate from original frozen source','CPQ batch paths and behavior contract require02 confirmation','Host copies are not application regression','Sentinel accessibility finding retained','Production CSP, OS IME and independent acceptance pending']},null,2)+'\n');
await writeFile(join(out,'SHA256SUMS.txt'),sums.join('\n')+'\n',{flag:'wx'});
for(const line of sums)assert.equal(sha256(await readFile(join(out,line.slice(66)))),line.slice(0,64));
console.log(`Frozen ${sums.length} technical candidate files. No CPQ install authorization or publication.`);
