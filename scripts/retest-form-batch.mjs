// Rebuild only the corrected fixture on its already clean-installed exact lock.
// Keep the original frozen source, failed typecheck and both package builds intact.
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { cp, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { delimiter, dirname, join, relative, resolve } from 'node:path';
import { inspectArchive, verifyPhysicalReact } from './qualification-contract.mjs';

const root=resolve(import.meta.dirname,'..'),run=join(root,'.qualification/runs/fluent-form-batch-1');
const evidence=join(run,'consumer-retest');
const node=join(root,'.tmp/node-22.22.0/node-v22.22.0-win-x64/node.exe');
const working=join(root,'.tmp/fluent-form-batch-1/consumer-node22');
const name='react-form-batch-consumer',destination=join(working,name);
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
await mkdir(evidence);
const patchFiles=['src/main.tsx','src/demo.css.d.ts'];
const overlay=[];
for(const path of patchFiles){
  const bytes=await readFile(join(root,'fixtures',name,path));
  await mkdir(dirname(join(evidence,'source',path)),{recursive:true});
  await writeFile(join(evidence,'source',path),bytes,{flag:'wx'});
  await writeFile(join(destination,path),bytes);
  overlay.push({path:`fixtures/${name}/${path}`,sha256:hash(bytes)});
}
await writeFile(join(evidence,'overlay.json'),JSON.stringify(overlay,null,2)+'\n',{flag:'wx'});
await writeFile(join(evidence,'executor.mjs'),await readFile(new URL(import.meta.url)),{flag:'wx'});
const lockBefore=hash(await readFile(join(destination,'package-lock.json')));
const result=spawnSync(node,[join(dirname(node),'node_modules/npm/bin/npm-cli.js'),'run','verify'],{
  cwd:destination,encoding:'utf8',maxBuffer:32*1024*1024,env:{...process.env,PATH:`${dirname(node)}${delimiter}${process.env.PATH??''}`},
});
const output=(result.stdout??'')+(result.stderr??'');
await writeFile(join(evidence,'verify.txt'),output,{flag:'wx'});console.log(output);
assert.equal(result.status,0,'Corrected consumer must typecheck and build');
assert.equal(hash(await readFile(join(destination,'package-lock.json'))),lockBefore,'Retest changed dependency lock');
await cp(join(destination,'dist'),join(evidence,'dist'),{recursive:true,errorOnExist:true,force:false});
const archive=await readFile(join(run,'build-a/candidate.tgz')),expected=inspectArchive(archive);
const results=[];
for(const consumer of ['token-only-consumer','react-vite-cpq-consumer',name]){
  const path=join(working,consumer),shared=join(path,'node_modules/@phantasywind/nidec-app-ui-design');
  for(const [file,digest] of Object.entries(expected.files))assert.equal(hash(await readFile(join(shared,file))),digest);
  const lock=JSON.parse(await readFile(join(path,'package-lock.json'),'utf8'));
  let react='not-installed';
  if(consumer==='token-only-consumer'){
    for(const key of Object.keys(lock.packages))assert(!/(^|\/)node_modules\/(react|react-dom|@fluentui\/[^/]+)$/.test(key));
  }else{
    react=await verifyPhysicalReact(path,shared);
    assert.equal(lock.packages['node_modules/@fluentui/react-components'].version,'9.74.7');
  }
  if(consumer===name){
    await writeFile(join(evidence,'package.json'),await readFile(join(path,'package.json')),{flag:'wx'});
    await writeFile(join(evidence,'lock.json'),await readFile(join(path,'package-lock.json')),{flag:'wx'});
  }
  const dist=consumer===name?join(evidence,'dist'):join(run,'consumer-node22',consumer,'dist');
  const outputs=[];
  async function visit(dir){for(const entry of await readdir(dir,{withFileTypes:true})){
    const file=join(dir,entry.name);if(entry.isDirectory())await visit(file);else {assert(entry.isFile());const bytes=await readFile(file);outputs.push({path:relative(dist,file),bytes:bytes.length,sha256:hash(bytes)});}
  }}
  await visit(dist);
  results.push({name:consumer,node:'22.22.0',artifact:hash(archive),react,outputs,retest:consumer===name});
}
await writeFile(join(evidence,'results.json'),JSON.stringify(results,null,2)+'\n',{flag:'wx'});
console.log('All three consumers verified; corrected form fixture used unchanged installed lock.');
