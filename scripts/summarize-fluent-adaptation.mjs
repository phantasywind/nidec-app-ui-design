import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { gzipSync } from 'node:zlib';
const root=resolve(import.meta.dirname,'..');
const evidence=join(root,'.qualification/runs/fluent-adaptation');
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const stable=['package.json','package-lock.json','src/index.ts','vite.config.ts','tests/button.test.ts','tests/fluent-contract.test.ts','README.md'];
for(const file of stable) assert.deepEqual(await readFile(join(root,file)),await readFile(join(root,'.tmp/fluent-adaptation/source',file)),`Active package input changed: ${file}`);
const a=await readFile(join(evidence,'build-a/candidate.tgz'));
assert.deepEqual(a,await readFile(join(evidence,'build-b/candidate.tgz')));
const fixture=await readFile(join(root,'fixtures/react-vite-cpq-consumer/src/main.tsx'));
assert.deepEqual(fixture,await readFile(join(evidence,'consumer-retest/main.tsx')));
const audits=[];
for(const name of await readdir(join(evidence,'browser-retest'))) {
  if(!name.endsWith('-audit.json'))continue;
  const data=JSON.parse(await readFile(join(evidence,'browser-retest',name),'utf8'));
  audits.push({file:name,run:data.run,width:data.width,height:data.height,violations:data.results.violations.map(v=>v.id),
    incomplete:data.results.incomplete.map(v=>v.id),overflow:data.overflow,errors:data.errors,
    serviceWorkerControlled:data.serviceWorkerControlled});
}
const requests=JSON.parse(await readFile(join(evidence,'browser-retest/requests.json'),'utf8'));
const csp=requests.reports.map(r=>r['csp-report']);
const positiveCsp=csp.filter(r=>!r['document-uri'].includes('run=strict')&&!r['document-uri'].includes('/__probe/control'));
assert.equal(positiveCsp.length,0,'Unexpected positive-page CSP report');
assert(csp.some(r=>r['effective-directive']==='connect-src'));
assert(csp.some(r=>r['effective-directive']==='style-src-elem'));
async function size(dir){
  const name=(await readdir(dir)).find(n=>n.endsWith('.js'));assert(name);
  const bytes=await readFile(join(dir,name));return {name,bytes:bytes.length,gzipBytes:gzipSync(bytes).length,sha256:sha(bytes)};
}
const summary={status:'implemented; technical review pending accessibility findings',artifactSha256:sha(a),
  packageInputsMatchFrozenSnapshot:true,fixtureRetestSha256:sha(fixture),testsPerBuild:36,
  audits,positiveCspReports:positiveCsp.length,negativeCspReports:csp.length,
  sizes:{previousNativeFixture:await size(join(root,'.qualification/runs/button-validation-ceb04a1/outputs/react-vite-cpq-consumer/assets')),
    fluentFixture:await size(join(evidence,'consumer-retest/dist/assets'))},
  limitations:['Working-source snapshot, not committed release qualification','Accessibility findings not waived',
    'Transient overflow flags during dialog/audit transitions; stable read-back width was 720, root width 704',
    'Browser initial/interaction observations do not prove all-path network isolation','No independent application acceptance'],
};
await writeFile(join(evidence,'review-summary.json'),JSON.stringify(summary,null,2),{flag:'wx'});
console.log(JSON.stringify(summary,null,2));
