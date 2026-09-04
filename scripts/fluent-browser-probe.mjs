import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { randomBytes, createHash } from 'node:crypto';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';

const root=resolve(import.meta.dirname,'..');
const upstream=process.argv[2]==='upstream';
const diagnostic=upstream || process.argv[2]==='diagnostic';
const retest=diagnostic || process.argv[2]==='retest';
const evidence=upstream?join(root,'.qualification/runs/fluent-upstream-comparison/browser'):diagnostic?join(root,'.qualification/runs/fluent-focus-diagnostic'):join(root,`.qualification/runs/fluent-adaptation/${retest?'browser-retest':'browser'}`);
await mkdir(evidence); // Never replace a prior run.
const output=join(root,upstream?'.qualification/runs/fluent-upstream-comparison/dist':retest?'.qualification/runs/fluent-adaptation/consumer-retest/dist':'.qualification/runs/fluent-adaptation/consumer-node22/react-vite-cpq-consumer/dist');
const content=new Map([['/',await readFile(join(output,'index.html'))]]);
for(const name of await readdir(join(output,'assets'))) {
  assert(/^[\w.-]+\.(js|css)$/.test(name));
  content.set(`/assets/${name}`,await readFile(join(output,'assets',name)));
}
const oldAudit=join(root,'.qualification/runs/button-validation-ceb04a1/audit-tools/axe-axe.min.js');
const axe=await readFile(oldAudit);
assert.equal(createHash('sha256').update(axe).digest('hex'),'c24f097bd2f451d4f933e8bc7d8d539f8672a2ebcb5cc9f9f3eec8ca9470a0c1');
content.set('/__probe/axe.js',axe);
content.set('/__probe/audit.js',await readFile(join(root,diagnostic?'scripts/fluent-focus-diagnostic.js':'scripts/fluent-browser-audit.js')));
content.set('/__probe/control.js',Buffer.from("fetch('https://nidec-probe.invalid/blocked').catch(()=>{});"));
content.set('/__probe/interference.css',Buffer.from('button,input{font-size:30px;padding:24px;color:purple;background:yellow}'));
const sourceHashes=Object.fromEntries([...content].map(([path,bytes])=>[path,createHash('sha256').update(bytes).digest('hex')]));
await writeFile(join(evidence,'served-hashes.json'),JSON.stringify(sourceHashes,null,2));
await writeFile(join(evidence,'audit.js'),content.get('/__probe/audit.js'));
await writeFile(join(evidence,'server-source.mjs'),await readFile(new URL(import.meta.url)));
let count=0,origin;
const requests=[],reports=[];
const server=createServer(async(req,res)=>{
  try {
    if(req.headers.host!==origin.slice(7)){res.writeHead(403).end();return;}
    const url=new URL(req.url,origin),nonce=randomBytes(18).toString('base64');
    const policy=`default-src 'self'; connect-src 'self'; script-src 'self'; style-src 'self'${url.searchParams.get('mode')==='strict'?'':` 'nonce-${nonce}'`}; img-src 'self'; font-src 'self'; worker-src 'none'; frame-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'; report-uri /__probe/csp`;
    const respond=(status,body='',type='text/plain')=>{
      requests.push({path:url.pathname,query:url.search,method:req.method,status,policy,
        sha256:createHash('sha256').update(body).digest('hex')});
      res.writeHead(status,{'Content-Type':type,'Content-Security-Policy':policy,'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}).end(body);
    };
    if(req.method==='POST' && ['/__probe/audit','/__probe/csp'].includes(url.pathname)){
      if(req.headers.origin && req.headers.origin!==origin) return respond(403);
      const chunks=[];let size=0;
      for await(const chunk of req){size+=chunk.length;if(size>2*1024*1024)return respond(413);chunks.push(chunk);}
      const value=JSON.parse(Buffer.concat(chunks).toString());
      if(url.pathname==='/__probe/csp') reports.push(value);
      await writeFile(join(evidence,`${String(++count).padStart(4,'0')}-${url.pathname.endsWith('audit')?'audit':'csp'}.json`),JSON.stringify(value,null,2),{flag:'wx'});
      return respond(200,'ok');
    }
    if(url.pathname==='/__probe/status')return respond(200,JSON.stringify({requests,reports}),'application/json');
    if(url.pathname==='/__probe/control')return respond(200,'<!doctype html><html lang="en"><head><title>Negative control</title></head><body><main><h1>Negative control</h1><button id="negative-control"></button></main><script src="/__probe/control.js"></script><script src="/__probe/axe.js"></script><script src="/__probe/audit.js"></script></body></html>','text/html');
    if(url.pathname==='/'){
      let html=content.get('/').toString().replace('<head>',`<head><meta name="csp-nonce" content="${nonce}">`);
      if(url.searchParams.has('interference'))html=html.replace('</head>','<link rel="stylesheet" href="/__probe/interference.css"></head>');
      html=html.replace('</body>','<script src="/__probe/axe.js"></script><script src="/__probe/audit.js"></script></body>');
      return respond(200,html,'text/html');
    }
    const bytes=content.get(url.pathname);
    return bytes?respond(200,bytes,url.pathname.endsWith('.css')?'text/css':'text/javascript'):respond(404);
  } catch(error){res.writeHead(500).end(String(error));}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
origin=`http://127.0.0.1:${server.address().port}`;
await writeFile(join(evidence,'server.json'),JSON.stringify({origin,sourceHashes,scope:upstream?'upstream-only diagnostic build; not package consumer acceptance':'instrumented original Node22 consumer; local test only'},null,2));
console.log(origin);
async function close(){
  await mkdir(dirname(join(evidence,'requests.json')),{recursive:true});
  await writeFile(join(evidence,'requests.json'),JSON.stringify({requests,reports},null,2));
  server.close();
}
process.once('SIGINT',close);process.once('SIGTERM',close);
