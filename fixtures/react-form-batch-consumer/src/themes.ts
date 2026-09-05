import { webLightTheme, webDarkTheme } from '@fluentui/react-components';
import type { Theme } from '@fluentui/react-components';

// Single theme entry for the whole demo. Brand mapping is intentionally pending
// the documented color-source decision; do not mix two consumer palettes here.
export const demoLightTheme: Theme = webLightTheme;
export const demoDarkTheme: Theme = webDarkTheme;
