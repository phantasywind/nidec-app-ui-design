import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { gzipSync } from 'node:zlib';

const root=resolve(import.meta.dirname,'..'),run=join(root,'.qualification/runs/nidec-light-theme-1');
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const json=async path=>JSON.parse(await readFile(path,'utf8'));
const artifact=await json(join(run,'build-a/artifact.json'));
const a=await readFile(join(run,'build-a/candidate.tgz')),b=await readFile(join(run,'build-b/candidate.tgz'));
assert.deepEqual(a,b);assert.equal(hash(a),artifact.sha256);
const current=await json(join(run,'consumer-node22/results.json'));
assert.equal(current.length,3);for(const item of current)assert.equal(item.artifact,artifact.sha256);
const warm=await json(join(run,'warm-consumer/result.json'));
assert.equal(warm.artifact,artifact.sha256);
for(const item of current.find(item=>item.name==='react-form-batch-consumer').outputs){
  assert.equal(hash(await readFile(join(run,'warm-consumer/dist',item.path))),item.sha256,'Browser-tested warm bytes differ from clean consumer');
}
const snapshot=await json(join(run,'source.json'));
for(const item of snapshot.files.filter(item=>/^(src\/|fixtures\/|scripts\/(build-theme-demo|check-colors))/.test(item.path))){
  assert.equal(hash(await readFile(join(root,item.path))),item.sha256,`Source drift: ${item.path}`);
}
const old=await json(join(root,'.qualification/runs/fluent-form-batch-1/engineering-summary.json'));
const measures=[];
for(const item of current){
  const totals={javascript:0,css:0,gzipJavascript:0,gzipCss:0};
  for(const output of item.outputs){
    const bytes=await readFile(join(run,'consumer-node22',item.name,'dist',output.path));
    assert.equal(hash(bytes),output.sha256);
    if(output.path.endsWith('.js')){totals.javascript+=bytes.length;totals.gzipJavascript+=gzipSync(bytes).length;}
    if(output.path.endsWith('.css')){totals.css+=bytes.length;totals.gzipCss+=gzipSync(bytes).length;}
  }
  measures.push({name:item.name,...totals});
}
const core=measures.find(item=>item.name==='react-vite-cpq-consumer');
const before=old.size.sameFixture.after;
const coreDelta=Object.fromEntries(Object.keys(before).map(key=>[key,core[key]-before[key]]));
const previousSource=await json(join(root,'.qualification/runs/fluent-form-batch-1/source.json'));
for(const item of snapshot.files.filter(item=>item.path.startsWith('fixtures/react-vite-cpq-consumer/'))){
  assert.equal(previousSource.files.find(oldItem=>oldItem.path===item.path)?.sha256,item.sha256,'Core comparison fixture differs');
}
const {nidecLightTheme}=await import(pathToFileURL(join(root,'.tmp/nidec-light-theme-1/build-a/dist/index.js')).href);
await writeFile(join(run,'theme.json'),JSON.stringify(nidecLightTheme,null,2),{flag:'wx'});
const blocked=spawnSync(process.execPath,[join(root,'scripts/check-publication.mjs')],{cwd:root,encoding:'utf8'});
assert.notEqual(blocked.status,0);assert((blocked.stderr??'').includes('Publication blocked:'));
await writeFile(join(run,'publication-block.txt'),(blocked.stdout??'')+(blocked.stderr??''),{flag:'wx'});
const summary={status:'Engineering complete; browser review recorded separately',artifact:{sha256:artifact.sha256,bytes:a.length},
  sourceHead:snapshot.head,sourceIsUncommitted:true,current,warmBrowserBytesEqualCleanConsumer:true,
  size:{unit:'bytes; local gzip calculation, not transfer capture',measures,coreBefore:before,coreDelta,
    formBefore:old.size.formDemo,limitation:'Form comparison includes theme, shell palette and explanatory text changes. No size budget.'},
  publicationBlocked:true,applicationAdoptionApproved:false};
await writeFile(join(run,'engineering-summary.json'),JSON.stringify(summary,null,2),{flag:'wx'});
await writeFile(join(run,'summary-executor.mjs'),await readFile(new URL(import.meta.url)),{flag:'wx'});
console.log(JSON.stringify(summary,null,2));
