// Read-only local preview of the qualified production bytes; no API proxy.
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { createHash, randomBytes } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

const light=process.argv[2]==='light-theme';
assert(!process.argv[2]||light,'Only the recorded form or light-theme run may be previewed');
const evidence=resolve(import.meta.dirname,'..',light?'.qualification/runs/nidec-light-theme-1':'.qualification/runs/fluent-form-batch-1');
const summary=JSON.parse(await readFile(join(evidence,'engineering-summary.json'),'utf8'));
const demo=summary.current.find(item=>item.name==='react-form-batch-consumer');
if(!light)assert.equal(summary.artifact.sha256,'7038a7e9f164b87e0036f2632e8384d27edc7b086267dbf2bc05c0facfec5590');
else assert.equal(createHash('sha256').update(await readFile(join(evidence,'build-a/candidate.tgz'))).digest('hex'),summary.artifact.sha256);
const content=new Map();
for(const item of demo.outputs){
  const bytes=await readFile(join(evidence,light?'consumer-node22/react-form-batch-consumer/dist':'consumer-retest/dist',item.path));
  assert.equal(createHash('sha256').update(bytes).digest('hex'),item.sha256);
  content.set('/'+item.path.replaceAll('\\','/'),bytes);
}
let origin;
const server=createServer((req,res)=>{
  if(req.headers.host!==origin.slice(7)){res.writeHead(403).end();return;}
  if(req.method!=='GET'){res.writeHead(405).end();return;}
  const path=new URL(req.url,origin).pathname;
  const bytes=content.get(path==='/'?'/index.html':path);
  if(!bytes){res.writeHead(404).end();return;}
  const nonce=randomBytes(18).toString('base64'),html=path==='/'||path==='/index.html';
  res.writeHead(200,{'Content-Type':html?'text/html':path.endsWith('.css')?'text/css':'text/javascript',
    'Cache-Control':'no-store','X-Content-Type-Options':'nosniff',
    'Content-Security-Policy':`default-src 'self'; connect-src 'none'; script-src 'self'; style-src 'self' 'nonce-${nonce}'; img-src 'self'; font-src 'self'; object-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'`});
  res.end(html?bytes.toString().replace('<head>',`<head><meta name="csp-nonce" content="${nonce}">`):bytes);
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
origin=`http://127.0.0.1:${server.address().port}`;
console.log(`${light?'Nidec light theme':'Form batch 01'} preview: ${origin} — local demonstration only, not CPQ.`);
