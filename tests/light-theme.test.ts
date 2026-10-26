import { describe, expect, it } from 'vitest';
import { webLightTheme, webDarkTheme } from '@fluentui/react-components';
import { nidecLightTheme } from '../src/index';
import { lightPalette } from '../src/internal/light-palette.mjs';

function luminance(hex: string): number {
  const c=[1,3,5].map(offset=>parseInt(hex.slice(offset,offset+2),16)/255).map(x=>x<=0.04045?x/12.92:((x+0.055)/1.055)**2.4);
  return c[0]!*0.2126+c[1]!*0.7152+c[2]!*0.0722;
}
function contrast(a: string,b: string): number {
  const values=[luminance(a),luminance(b)].sort((x,y)=>y-x);
  return (values[0]!+0.05)/(values[1]!+0.05);
}

describe('central light theme mapping',()=>{
  it('preserves the complete upstream contract and does not change geometry or official themes',()=>{
    expect(Object.keys(nidecLightTheme).sort()).toEqual(Object.keys(webLightTheme).sort());
    for(const [key,value] of Object.entries(webLightTheme)){
      if(!/^(color|shadow)/.test(key))expect(nidecLightTheme[key as keyof typeof nidecLightTheme]).toBe(value);
    }
    expect(webLightTheme.colorBrandBackground).not.toBe(lightPalette.brandStrong);
    expect(webDarkTheme.colorBrandBackground).not.toBe(lightPalette.brandStrong);
  });
  it('uses the approved source roles and keeps raw brand green distinct from on-brand text surfaces',()=>{
    expect(lightPalette.brand).toBe('#009b4a');
    expect(nidecLightTheme.colorBrandBackgroundStatic).toBe(lightPalette.brand);
    expect(nidecLightTheme.colorBrandBackground).toBe(lightPalette.brandStrong);
    expect(nidecLightTheme.colorNeutralBackground2).toBe(lightPalette.canvas);
    expect(nidecLightTheme.colorNeutralForeground1).toBe(lightPalette.text);
    expect(nidecLightTheme.colorStrokeFocus2).toBe(lightPalette.focus);
    expect(contrast(lightPalette.brand,lightPalette.surface)).toBeLessThan(4.5);
  });
  it('checks all central text and status pairs without waiving a low contrast result',()=>{
    const t=nidecLightTheme;
    const pairs=[
      [t.colorNeutralForeground1,t.colorNeutralBackground1],
      [t.colorNeutralForeground2,t.colorNeutralBackground1],
      [t.colorNeutralForeground3,t.colorNeutralBackground1],
      [t.colorNeutralForeground3,t.colorNeutralBackground6],
      [t.colorBrandForegroundLink,t.colorNeutralBackground1],
      [t.colorNeutralForegroundOnBrand,t.colorBrandBackground],
      [t.colorNeutralForegroundOnBrand,t.colorBrandBackgroundHover],
      [t.colorNeutralForegroundOnBrand,t.colorBrandBackgroundPressed],
      [t.colorNeutralForegroundOnBrand,t.colorBrandBackgroundSelected],
      [t.colorStatusSuccessForeground1,t.colorStatusSuccessBackground1],
      [t.colorStatusWarningForeground1,t.colorStatusWarningBackground1],
      [t.colorStatusDangerForeground1,t.colorStatusDangerBackground1],
      [t.colorStatusSuccessForeground2,t.colorStatusSuccessBackground2],
      [t.colorStatusWarningForeground2,t.colorStatusWarningBackground2],
      [t.colorStatusDangerForeground2,t.colorStatusDangerBackground2],
      [t.colorPaletteBlueForeground2,t.colorPaletteBlueBackground2],
    ];
    for(const [foreground,background] of pairs)expect(contrast(foreground!,background!),`${foreground} on ${background}`).toBeGreaterThanOrEqual(4.5);
    for(const foreground of [t.colorCompoundBrandBackground,t.colorNeutralStrokeAccessible,t.colorStrokeFocus2])expect(contrast(foreground,t.colorNeutralBackground1)).toBeGreaterThanOrEqual(3);
  });
  it('maps the attention amber onto Marigold with darker hover and pressed fills',()=>{
    const t=nidecLightTheme;
    expect(lightPalette.attention).toBe('#e08a00');
    expect(t.colorPaletteMarigoldBackground3).toBe(lightPalette.attention);
    // White on the attention fill is below 4.5:1; Locke approved it for the button on 2026-10-26.
    const rest=contrast(t.colorNeutralForegroundOnBrand,t.colorPaletteMarigoldBackground3);
    expect(rest).toBeGreaterThan(2.6);
    expect(contrast(t.colorNeutralForegroundOnBrand,t.colorPaletteMarigoldForeground1)).toBeGreaterThan(rest);
    expect(contrast(t.colorNeutralForegroundOnBrand,t.colorPaletteMarigoldForeground2)).toBeGreaterThan(contrast(t.colorNeutralForegroundOnBrand,t.colorPaletteMarigoldForeground1));
  });
  it('uses one neutral grey for hover backgrounds and keeps brand text readable on it',()=>{
    const t=nidecLightTheme;
    expect(t.colorSubtleBackgroundHover).toBe(t.colorNeutralBackground1Hover);
    expect(contrast(t.colorBrandForeground1,t.colorNeutralBackground1Hover)).toBeGreaterThanOrEqual(4.5);
  });
  it('defines differentiated hover/pressed/selected brand states and mapped semantic colors',()=>{
    expect(new Set([nidecLightTheme.colorBrandBackground,nidecLightTheme.colorBrandBackgroundHover,nidecLightTheme.colorBrandBackgroundPressed,nidecLightTheme.colorBrandBackgroundSelected]).size).toBe(4);
    expect(nidecLightTheme.colorStatusSuccessBackground3).toBe(lightPalette.success);
    expect(nidecLightTheme.colorStatusWarningBackground3).toBe(lightPalette.warning);
    expect(nidecLightTheme.colorStatusDangerBackground3).toBe(lightPalette.danger);
    for(const [key,value] of Object.entries(nidecLightTheme))if(/Brand/.test(key))expect(value).not.toBeUndefined();
  });
});
