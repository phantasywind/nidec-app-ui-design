import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { gzipSync } from 'node:zlib';

const root=resolve(import.meta.dirname,'..');
const evidence=join(root,'.qualification/runs/fluent-form-batch-1');
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const readJson=async path=>JSON.parse(await readFile(path,'utf8'));
const current=await readJson(join(evidence,'consumer-retest/results.json'));
const baseline=await readJson(join(evidence,'baseline-node22/results.json'));
const a=await readFile(join(evidence,'build-a/candidate.tgz'));
assert.deepEqual(a,await readFile(join(evidence,'build-b/candidate.tgz')));
assert.notEqual(hash(a),'f1bca649bcc2828635744c9e477301fc179272b514f6588eeb122f209c07b20a');
const source=await readJson(join(evidence,'source.json'));
const overlay=await readJson(join(evidence,'consumer-retest/overlay.json'));
for(const entry of source.files.filter(entry=>/^(src\/|tests\/|fixtures\/|package(?:-lock)?\.json$|tsconfig|vite.config|vitest.config)/.test(entry.path))){
  assert.equal(hash(await readFile(join(root,entry.path))),overlay.find(item=>item.path===entry.path)?.sha256??entry.sha256,`Tested source changed: ${entry.path}`);
}
for(const entry of overlay)assert.equal(hash(await readFile(join(root,entry.path))),entry.sha256);
async function size(dir){
  const result={javascript:0,css:0,gzipJavascript:0,gzipCss:0};
  for(const name of await readdir(join(dir,'assets'))){
    if(!/\.(js|css)$/.test(name))continue;
    const bytes=await readFile(join(dir,'assets',name)),js=name.endsWith('.js');
    result[js?'javascript':'css']+=bytes.length;
    result[js?'gzipJavascript':'gzipCss']+=gzipSync(bytes).length;
  }
  return result;
}
const before=await size(join(evidence,'baseline-node22/react-vite-cpq-consumer/dist'));
const after=await size(join(evidence,'consumer-node22/react-vite-cpq-consumer/dist'));
const formDemo=await size(join(evidence,'consumer-retest/dist'));
const delta=Object.fromEntries(Object.keys(before).map(key=>[key,after[key]-before[key]]));
const publication=spawnSync(process.execPath,[join(root,'scripts/check-publication.mjs')],{cwd:root,encoding:'utf8'});
await writeFile(join(evidence,'publication-block.txt'),(publication.stdout??'')+(publication.stderr??''),{flag:'wx'});
assert.equal(publication.status,1,'Publication guard must execute and reject');
assert.match((publication.stdout??'')+(publication.stderr??''),/Publication blocked:/);
await writeFile(join(evidence,'summary-executor.mjs'),await readFile(new URL(import.meta.url)),{flag:'wx'});
const result={status:'engineering checks consolidated; browser observations require separate review',artifact:{sha256:hash(a),bytes:a.length},
  sourceHead:source.head,sourceIsUncommitted:true,current,baseline,
  size:{unit:'bytes',method:'production asset bytes and locally computed gzip; not network transferred bytes',sameFixture:{before,after,delta},formDemo,
    limitation:'New form demo is a different composition; its absolute size is not a like-for-like migration delta. No size budget is approved.'},
  publicationBlocked:true,applicationAdoptionApproved:false};
await writeFile(join(evidence,'engineering-summary.json'),JSON.stringify(result,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify(result,null,2));
