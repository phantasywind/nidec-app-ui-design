// Append a scoped implementation authorization; do not rewrite technical evidence.
import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { sha256 } from './qualification-contract.mjs';
const root=join(import.meta.dirname,'..');
const candidate=join(root,'.qualification/deliveries/cpq-directory-actions-304a5d85');
const digest='304a5d85e96c42d941a1c602dbc98c9927d7ecd0513d735678402292d27f7ea0';
const sums=await readFile(join(candidate,'SHA256SUMS.txt'),'utf8');
for(const line of sums.trim().split('\n')){
  assert(/^[a-f0-9]{64}  [\w./-]+$/.test(line)&&!line.slice(66).split('/').includes('..'));
  assert.equal(sha256(await readFile(join(candidate,line.slice(66)))),line.slice(0,64));
}
assert.equal(sha256(await readFile(join(candidate,'candidate.tgz'))),digest);
const out=join(root,'.qualification/deliveries/cpq-directory-actions-implementation-1');
await mkdir(out);
const files={
  'IMPLEMENTATION.md':await readFile(join(root,'docs/implementation/cpq-02-directory-actions-implementation.md')),
  'candidate-SHA256SUMS.txt':sums,
  'executor.mjs':await readFile(new URL(import.meta.url)),
  'manifest.json':JSON.stringify({status:'READY_FOR_CONTROLLED_LOCAL_IMPLEMENTATION',candidatePath:join(candidate,'candidate.tgz'),sha256:digest,version:'0.0.0-development',fluent:'9.74.7',consumer:'CPQ existing main / existing02',pages:['EnquiriesPage','QuotesPage','ReviewsPage','ProjectBomQueuePage','QuoteCommercialAddOns'],authority:'Locke approved six-phase continuous migration; scope defined in IMPLEMENTATION.md',installed:false,independentAcceptance:false,published:false,deployed:false},null,2)+'\n',
};
const outputSums=[];
for(const [path,bytes] of Object.entries(files)){await writeFile(join(out,path),bytes,{flag:'wx'});assert.equal(sha256(await readFile(join(out,path))),sha256(bytes));outputSums.push(`${sha256(bytes)}  ${path}`);}
await writeFile(join(out,'SHA256SUMS.txt'),outputSums.join('\n')+'\n',{flag:'wx'});
console.log('312 candidate records revalidated; four implementation handoff files frozen. No CPQ mutation or dispatch.');
