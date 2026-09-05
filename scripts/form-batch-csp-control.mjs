// Same enforced policy, progressively add scanner and application to isolate reports.
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { createHash, randomBytes } from 'node:crypto';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

const root=resolve(import.meta.dirname,'..'),dir=join(root,'.qualification/runs/fluent-form-batch-1/csp-control-2');
await mkdir(dir);
const output=join(root,'.qualification/runs/fluent-form-batch-1/consumer-retest/dist');
const app=await readFile(join(output,'index.html'),'utf8');
const axe=await readFile(join(root,'.qualification/runs/button-validation-ceb04a1/audit-tools/axe-axe.min.js'));
assert.equal(createHash('sha256').update(axe).digest('hex'),'c24f097bd2f451d4f933e8bc7d8d539f8672a2ebcb5cc9f9f3eec8ca9470a0c1');
const assets=new Map();
for(const name of await readdir(join(output,'assets'))) assets.set(`/assets/${name}`,await readFile(join(output,'assets',name)));
let origin,count=0;
const requests=[];
const server=createServer(async(req,res)=>{
  try{
    if(req.headers.host!==origin.slice(7)){res.writeHead(403).end();return;}
    const url=new URL(req.url,origin),nonce=randomBytes(18).toString('base64');
    const policy=`default-src 'self'; connect-src 'self'; script-src 'self'; style-src 'self' 'nonce-${nonce}'; img-src 'self'; font-src 'self'; object-src 'none'; base-uri 'none'; form-action 'none'; report-uri /report`;
    const send=(status,body='',type='text/html')=>{requests.push({path:url.pathname,method:req.method,status,bytes:Buffer.byteLength(body)});res.writeHead(status,{'Content-Type':type,'Content-Security-Policy':policy,'Cache-Control':'no-store'}).end(body);};
    if(req.method==='POST'&&['/report','/result'].includes(url.pathname)){
      if(req.headers.origin&&req.headers.origin!==origin)return send(403);
      const chunks=[];let size=0;for await(const chunk of req){size+=chunk.length;if(size>2*1024*1024)return send(413);chunks.push(chunk);}
      const data=JSON.parse(Buffer.concat(chunks).toString());
      await writeFile(join(dir,`${++count}-${url.pathname.slice(1)}.json`),JSON.stringify(data,null,2),{flag:'wx'});return send(200,'ok','text/plain');
    }
    if(req.method!=='GET')return send(405);
    if(url.pathname==='/status')return send(200,JSON.stringify(requests),'application/json');
    if(url.pathname==='/axe.js')return send(200,axe,'text/javascript');
    if(url.pathname==='/scan.js')return send(200,"axe.run(document).then(r=>fetch('/result',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({path:location.pathname,violations:r.violations,incomplete:r.incomplete})}));",'text/javascript');
    if(assets.has(url.pathname))return send(200,assets.get(url.pathname),url.pathname.endsWith('.css')?'text/css':'text/javascript');
    if(url.pathname==='/app')return send(200,app.replace('<head>',`<head><meta name="csp-nonce" content="${nonce}">`));
    if(['/plain','/axe','/scan'].includes(url.pathname))return send(200,`<!doctype html><html lang="en"><head><title>CSP isolation control</title></head><body><main><h1>CSP isolation control</h1><p>${url.pathname}</p><button type="button">Control button</button></main>${url.pathname!=='/plain'?'<script src="/axe.js"></script>':''}${url.pathname==='/scan'?'<script src="/scan.js"></script>':''}</body></html>`);
    return send(404,'Not found','text/plain');
  }catch(error){res.writeHead(500).end(String(error));}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
origin=`http://127.0.0.1:${server.address().port}`;
await writeFile(join(dir,'server.json'),JSON.stringify({origin,purpose:'Isolate browser/scanner/application style CSP reports; policy is not weakened'},null,2),{flag:'wx'});
await writeFile(join(dir,'executor.mjs'),await readFile(new URL(import.meta.url)),{flag:'wx'});
console.log(origin);
async function close(){await writeFile(join(dir,'requests.json'),JSON.stringify(requests,null,2),{flag:'wx'});server.close();}
process.once('SIGINT',close);process.once('SIGTERM',close);
