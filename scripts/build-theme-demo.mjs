import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { lightPalette } from '../src/internal/light-palette.mjs';

const target=resolve(import.meta.dirname,'../fixtures/react-form-batch-consumer/src/palette.css');
const roles={canvas:'canvas',text:'text','text-secondary':'textSecondary',border:'borderStrong'};
export const demoPaletteCss='/* GENERATED DEMO SHELL. Source: tokens/nidec-light.tokens.json via light-palette.mjs. Do not edit. */\n:root {\n'+
  Object.entries(roles).map(([role,key])=>`  --nidec-demo-${role}: ${lightPalette[key]};`).join('\n')+'\n}\n';
if(process.argv.includes('--check')){
  if((await readFile(target,'utf8')).replaceAll('\r\n','\n')!==demoPaletteCss)throw new Error('Demo palette is stale; run tokens:build.');
}else await writeFile(target,demoPaletteCss);
