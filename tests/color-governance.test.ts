import { describe, expect, it } from 'vitest';
import { colorFindings } from '../scripts/check-colors.mjs';

describe('centralized color guard',()=>{
  it('rejects scattered hexadecimal, functional and named colors',()=>{
    for(const text of ['color:#009b4a;','background:rgb(0 1 2);','border:1px solid green;','color:rebeccapurple;']){
      expect(colorFindings(text,true).length).toBeGreaterThan(0);
    }
    expect(colorFindings("{ color: 'blue' }",false).length).toBeGreaterThan(0);
  });
  it('accepts role variables and neutral CSS values',()=>{
    expect(colorFindings('a {color:var(--nidec-demo-text);border:1px solid var(--nidec-demo-border);background:transparent;}',true)).toEqual([]);
  });
});
