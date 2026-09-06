// Append-only technical checkpoint, not a publication/application acceptance gate.
import assert from 'node:assert/strict';
import { mkdir, readFile, readdir, writeFile, cp } from 'node:fs/promises';
import { join, relative, dirname } from 'node:path';
import { sha256 } from './qualification-contract.mjs';
const root=join(import.meta.dirname,'..');
const run=join(root,'.qualification/runs/fluent-directory-actions-1');
const out=join(run,'checkpoint-2');
await mkdir(out);
const result=JSON.parse(await readFile(join(run,'consumer-retest-3/results.json'),'utf8'));
for(const consumer of result){
  const destination=join(out,consumer.name,'dist');
  await mkdir(dirname(destination),{recursive:true});
  for(const item of consumer.outputs){
    const source=join(root,'.tmp/fluent-directory-actions-1/consumer-node22',consumer.name,'dist',item.path);
    assert.equal(sha256(await readFile(source)),item.sha256);
  }
  await cp(join(root,'.tmp/fluent-directory-actions-1/consumer-node22',consumer.name,'dist'),destination,{recursive:true,errorOnExist:true,force:false});
}
for(const name of ['browser-1','browser-2','consumer-retest-1','consumer-retest-2','consumer-retest-3'])await cp(join(run,name),join(out,name),{recursive:true,errorOnExist:true,force:false});
await cp(join(root,'docs/implementation/fluent-directory-actions-record.md'),join(out,'record.md'));
await cp(new URL(import.meta.url),join(out,'executor.mjs'));
async function files(dir){const all=[];for(const entry of await readdir(dir,{withFileTypes:true})){assert(!entry.isSymbolicLink());const path=join(dir,entry.name);if(entry.isDirectory())all.push(...await files(path));else all.push(path);}return all.sort();}
const lines=[];
for(const path of await files(out))lines.push(`${sha256(await readFile(path))}  ${relative(out,path).replaceAll('\\','/')}`);
await writeFile(join(out,'SHA256SUMS.txt'),lines.join('\n')+'\n',{flag:'wx'});
for(const line of lines)assert.equal(sha256(await readFile(join(out,line.slice(66)))),line.slice(0,64));
console.log(`Read back ${lines.length} checkpoint files; no application acceptance or publication claimed.`);
