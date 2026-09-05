// Read-only artifact verification by default. Never installs, extracts, or repacks.
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFile, mkdir, writeFile} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {inspectArchive,sha256} from './qualification-contract.mjs';

const root=resolve(import.meta.dirname,'..');
const bindingPath=join(root,'docs/implementation/cpq-fluent-pilot-artifact.json');
const bindingBytes=await readFile(bindingPath),binding=JSON.parse(bindingBytes);
const args=process.argv.slice(2);
assert(args.length<=1,'Use no argument, --record, or an explicit archive path');
const record=args[0]==='--record';
const target=resolve(root,args[0] && !record ? args[0] : binding.source);
function verify(bytes){
  assert.equal(sha256(bytes),binding.sha256,'Wrong candidate SHA-256; filename/version are not identity');
  assert.equal(bytes.length,binding.size,'Archive size mismatch');
  assert.equal('sha512-'+createHash('sha512').update(bytes).digest('base64'),binding.integrity,'npm integrity mismatch');
  return inspectArchive(bytes);
}
const archive=verify(await readFile(target));
verify(await readFile(join(root,binding.mirror)));
const sums=await readFile(join(root,binding.qualificationManifest));
assert.equal(sha256(sums),binding.qualificationManifestSha256,'Qualification manifest changed');
const artifact=JSON.parse(await readFile(join(root,'.qualification/runs/fluent-adaptation/build-a/artifact.json')));
assert.equal(artifact.sha256,binding.sha256);
assert.deepEqual(archive.files,artifact.archiveEvidence.files,'Packed file manifest mismatch');
const candidate=await readFile(target),corrupt=Buffer.from(candidate);
corrupt[corrupt.length-1]^=1;
assert.throws(()=>verify(corrupt),/Wrong candidate SHA-256/);
const excluded=await readFile(join(root,binding.excludedArchive));
assert.throws(()=>verify(excluded),/Wrong candidate SHA-256/);
const result={status:'artifact identity verified; installation not performed',target,archive,
  npmIntegrity:binding.integrity,bindingSha256:sha256(bindingBytes),
  controls:{corruptedBytesRejected:true,excludedArchiveRejected:true,excludedObservedSha256:sha256(excluded)},
  node:process.version,date:new Date().toISOString()};
if(record){
  const dir=join(root,'.qualification/runs/cpq-fluent-p1-preflight');
  await mkdir(dir); // Exclusive: preserve prior runs.
  const files={'result.json':Buffer.from(JSON.stringify(result,null,2)+'\n'),'binding.json':bindingBytes,
    'verifier.mjs':await readFile(new URL(import.meta.url)),
    'qualification-contract.mjs':await readFile(join(root,'scripts/qualification-contract.mjs'))};
  for(const [name,bytes] of Object.entries(files))await writeFile(join(dir,name),bytes,{flag:'wx'});
  await writeFile(join(dir,'SHA256SUMS.txt'),Object.entries(files).map(([name,bytes])=>`${sha256(bytes)}  ${name}`).join('\n')+'\n',{flag:'wx'});
}
console.log(JSON.stringify(result,null,2));
