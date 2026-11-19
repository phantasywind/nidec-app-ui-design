import rootPackage from '../../../package.json';
import tokensTemplate from '../../../design-system/content/tokens.template.json';
import { lightPalette } from '../../../src/internal/light-palette.mjs';

export const PACKAGE_NAME = rootPackage.name;
export const PACKAGE_VERSION = rootPackage.version;
export const FLUENT_VERSION = rootPackage.peerDependencies['@fluentui/react-components'];
export const DATE_PICKER_VERSION = rootPackage.peerDependencies['@fluentui/react-datepicker-compat'];
export const REACT_PEER_RANGE = rootPackage.peerDependencies.react;
export const REPO_URL = 'https://github.com/phantasywind/nidec-app-ui-design';
export const PAGES_URL = 'https://phantasywind.github.io/nidec-app-ui-design/';

export type ColorTokenCategory = 'brand' | 'text' | 'surface' | 'semantic';

export type ResolvedColorToken = Readonly<{
  name: string;
  paletteKey: string;
  cssVar: string | null;
  hex: string;
  usage: string;
  category: ColorTokenCategory;
  contrastOnSurface: number;
  isDarkFill: boolean;
}>;

const paletteMap = lightPalette as Record<string, string>;

function relativeLuminance(hex: string): number {
  const n = parseInt(hex.slice(1), 16);
  const channels = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * channels[0]! + 0.7152 * channels[1]! + 0.0722 * channels[2]!;
}

export function contrastRatio(hexA: string, hexB: string): number {
  const [hi, lo] = [relativeLuminance(hexA), relativeLuminance(hexB)].sort((a, b) => b - a);
  return (hi + 0.05) / (lo + 0.05);
}

function classifyToken(name: string): ColorTokenCategory {
  if (name.includes('brand')) return 'brand';
  if (name.startsWith('text')) return 'text';
  if (name.startsWith('surface') || name.startsWith('border') || name === 'canvas') return 'surface';
  return 'semantic';
}

const cssVarByPaletteKey: Record<string, string> = {
  brand: '--nidec-ui-color-brand',
  brandStrong: '--nidec-ui-color-brand-strong',
  brandSoft: '--nidec-ui-color-brand-soft',
  text: '--nidec-ui-color-text',
  textSecondary: '--nidec-ui-color-text-secondary',
  textMuted: '--nidec-ui-color-text-muted',
  canvas: '--nidec-ui-color-canvas',
  surface: '--nidec-ui-color-surface',
  surfaceSubtle: '--nidec-ui-color-surface-subtle',
  border: '--nidec-ui-color-border',
  borderStrong: '--nidec-ui-color-border-strong',
  info: '--nidec-ui-color-info',
  success: '--nidec-ui-color-success',
  attention: '--nidec-ui-color-attention',
  warning: '--nidec-ui-color-warning',
  danger: '--nidec-ui-color-danger',
  focus: '--nidec-ui-color-focus',
};

const surfaceHex = paletteMap.surface!;

export const COLOR_TOKENS: readonly ResolvedColorToken[] = tokensTemplate.color.tokens.map((item) => {
  const hex = paletteMap[item.palette] ?? surfaceHex;
  const cssVar = item.name === 'on-brand-strong' ? null : (cssVarByPaletteKey[item.palette] ?? null);
  const onSurface = contrastRatio(hex, surfaceHex);
  return {
    name: item.name,
    paletteKey: item.palette,
    cssVar,
    hex,
    usage: item.usage,
    category: classifyToken(item.name),
    contrastOnSurface: onSurface,
    isDarkFill: relativeLuminance(hex) < 0.32,
  };
});

export const TYPE_FAMILIES = tokensTemplate.type.families;
export const TYPE_STYLES = tokensTemplate.type.groups[0]!.styles;
export const SPACING_TOKENS = tokensTemplate.spacing.tokens;
export const RADIUS_TOKENS = tokensTemplate.radius.tokens;
export const CONTRAST_CHECKS = tokensTemplate.checks.map((check) => {
  const fg = COLOR_TOKENS.find((t) => t.name === check.fg)!;
  const bg = COLOR_TOKENS.find((t) => t.name === check.bg)!;
  const ratio = contrastRatio(fg.hex, bg.hex);
  return {
    fg: check.fg,
    bg: check.bg,
    min: check.min,
    ratio,
    pass: ratio >= check.min,
  };
});
