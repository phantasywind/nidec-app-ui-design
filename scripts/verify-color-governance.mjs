import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { cp, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { delimiter, dirname, join, relative, resolve } from 'node:path';

const root=resolve(import.meta.dirname,'..');
const evidence=join(root,'.qualification/runs/color-governance-1');
const consumer=join(root,'.tmp/fluent-form-batch-1/consumer-node22/react-form-batch-consumer');
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
await mkdir(evidence); // Exclusive run; no historical evidence is replaced.
const files=['package.json','scripts/check-colors.mjs','scripts/check-colors.d.mts','tests/color-governance.test.ts',
  'docs/decisions/0006-color-governance.md','docs/implementation/color-source-review.md'];
for(const name of await readdir(join(root,'fixtures/react-form-batch-consumer/src')))files.push('fixtures/react-form-batch-consumer/src/'+name);
const source=[];
for(const path of files){
  const bytes=await readFile(join(root,path));
  await mkdir(dirname(join(evidence,'source',path)),{recursive:true});
  await writeFile(join(evidence,'source',path),bytes,{flag:'wx'});
  source.push({path,sha256:hash(bytes)});
}
await writeFile(join(evidence,'source.json'),JSON.stringify(source,null,2),{flag:'wx'});
await writeFile(join(evidence,'executor.mjs'),await readFile(new URL(import.meta.url)),{flag:'wx'});
const references=[];
for(const name of ['AGENTS.md','client/src/styles/tokens.css','client/src/design-system/styles.css']){
  const bytes=await readFile(join('D:/Documents/Nidec Elevator CPQ',name));
  references.push({path:name,sha256:hash(bytes)});
  if(name.endsWith('.css')){
    const target=join(evidence,'cpq-reference',name);await mkdir(dirname(target),{recursive:true});await writeFile(target,bytes,{flag:'wx'});
  }
}
await writeFile(join(evidence,'cpq-reference.json'),JSON.stringify(references,null,2),{flag:'wx'});
function run(version,cwd,name){
  const node=join(root,`.tmp/node-${version}/node-v${version}-win-x64/node.exe`);
  const result=spawnSync(node,[join(dirname(node),'node_modules/npm/bin/npm-cli.js'),'run','verify'],{
    cwd,encoding:'utf8',maxBuffer:32*1024*1024,env:{...process.env,PATH:`${dirname(node)}${delimiter}${process.env.PATH??''}`},
  });
  const output=(result.stdout??'')+(result.stderr??'');
  return {name,output,exit:result.status};
}
const checks=[];
const first=run('24.20.0',root,'root-node24');
await writeFile(join(evidence,first.name+'.txt'),first.output,{flag:'wx'});console.log(first.output);
assert.equal(first.exit,0);checks.push({name:first.name,exit:first.exit});
const lock=await readFile(join(consumer,'package-lock.json'));
await writeFile(join(evidence,'consumer-lock.json'),lock,{flag:'wx'});
await cp(join(consumer,'src'),join(evidence,'consumer-source-before'),{recursive:true});
await cp(join(root,'fixtures/react-form-batch-consumer/src'),join(consumer,'src'),{recursive:true});
const second=run('22.22.0',consumer,'consumer-node22');
await writeFile(join(evidence,second.name+'.txt'),second.output,{flag:'wx'});console.log(second.output);
assert.equal(second.exit,0);checks.push({name:second.name,exit:second.exit});
assert.equal(hash(await readFile(join(consumer,'package-lock.json'))),hash(lock));
await cp(join(consumer,'dist'),join(evidence,'dist'),{recursive:true});
await writeFile(join(evidence,'result.json'),JSON.stringify({checks,lockSha256:hash(lock),
  sharedArtifact:'7038a7e9f164b87e0036f2632e8384d27edc7b086267dbf2bc05c0facfec5590',
  scope:'Existing real-tarball consumer, same installed lock; source-only color ownership refactor. Not a new clean install or brand mapping approval.'},null,2),{flag:'wx'});
const sums=[];
async function visit(dir){for(const entry of await readdir(dir,{withFileTypes:true})){
  const path=join(dir,entry.name);if(entry.isDirectory())await visit(path);else sums.push(`${hash(await readFile(path))}  ${relative(evidence,path).replaceAll('\\','/')}`);
}}
await visit(evidence);
await writeFile(join(evidence,'SHA256SUMS.txt'),sums.sort().join('\n')+'\n',{flag:'wx'});
for(const line of sums)assert.equal(hash(await readFile(join(evidence,line.slice(66)))),line.slice(0,64));
console.log(`Color governance verified; ${sums.length} retained files checked.`);
