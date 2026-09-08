import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { join, relative, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

// Bounded source guard, not a complete CSS/JS interpreter. Upstream, historical
// historical fixtures, generated token outputs and test negative cases are not scanned.
export function colorFindings(text, css=false){
  const source=text.replace(/\/\*[\s\S]*?\*\//g,'');
  const findings=[];
  if(/#[\da-f]{3,8}\b/i.test(source))findings.push('hex color');
  if(/\b(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color|color-mix)\s*\(/i.test(source))findings.push('color function');
  // Reject named/literal CSS paint values; role variables and neutral keywords
  // remain valid. Checks border/shadow shorthand as well as color properties.
  if(css){
    const paint=/(?:^|[;{])\s*(?:[\w-]*color|background(?:-color)?|border(?:-(?:top|right|bottom|left))?|outline|(?:box|text)-shadow|fill|stroke)\s*:\s*([^;}]+)/gi;
    for(const match of source.matchAll(paint)){
      const words=match[1].replace(/var\(--[\w-]+\)/g,'').replace(/[\d.]+(?:px|rem|em|%)?/g,'').match(/[a-zA-Z]+/g)??[];
      if(words.some(word=>!['transparent','currentColor','inherit','initial','unset','none','solid','dashed','dotted','double','inset'].includes(word)))findings.push('unregistered CSS paint value');
    }
  }
  if(/(?:color\w*|background\w*|borderColor|fill|stroke)\s*:\s*['"][a-z]+['"]/i.test(source))findings.push('literal JS paint value');
  return findings;
}

export async function checkColors(root){
  const paths=[];
  async function visit(dir){for(const item of await readdir(dir,{withFileTypes:true})){
    const path=join(dir,item.name);if(item.isDirectory())await visit(path);else if(/\.(?:tsx?|mjs|css)$/.test(path))paths.push(path);
  }}
  await visit(join(root,'src'));
  await visit(join(root,'fixtures/react-form-batch-consumer/src'));
  await visit(join(root,'fixtures/react-complete-region-consumer/src'));
  await visit(join(root,'fixtures/react-directory-actions-consumer/src'));
  await visit(join(root,'fixtures/react-composite-patterns-consumer/src'));
  paths.push(join(root,'styles/components.css'));
  for(const path of paths){
    const name=relative(root,path).replaceAll('\\','/');
    const source=await readFile(path,'utf8');
    if(name==='src/internal/light-palette.mjs'){
      assert(source.includes('GENERATED from tokens/nidec-light.tokens.json')&&source.includes('ADR-0006'),'Generated palette requires recorded source and authority');
      assert.equal([...source.matchAll(/#[\da-f]{6}\b/gi)].length,16,'Review raw role changes explicitly');
      continue;
    }
    if(name==='fixtures/react-form-batch-consumer/src/palette.css'){
      assert(source.includes('GENERATED DEMO SHELL'),'Palette must come from central source');
      assert.equal([...source.matchAll(/#[\da-f]{6}\b/gi)].length,4,'Review central palette role changes explicitly');
      continue;
    }
    assert.deepEqual(colorFindings(source,path.endsWith('.css')),[],`Scattered color in ${name}`);
    if(name.startsWith('fixtures/react-form-batch-consumer/src/')&&!name.endsWith('/themes.ts')){
      assert(!/\b(?:webLightTheme|webDarkTheme|createLightTheme|createDarkTheme)\b/.test(source),`Theme selection must stay centralized: ${name}`);
    }
  }
  return paths.length;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){
  console.log(`Color governance checked ${await checkColors(resolve(import.meta.dirname,'..'))} current source files.`);
}
