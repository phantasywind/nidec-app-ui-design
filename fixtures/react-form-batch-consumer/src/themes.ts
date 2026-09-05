import { webDarkTheme } from '@fluentui/react-components';
import type { Theme } from '@fluentui/react-components';
import { nidecLightTheme } from '@phantasywind/nidec-app-ui-design';

// Shared light theme is explicit. Dark remains an official upstream test input.
export const demoLightTheme: Theme = nidecLightTheme;
export const demoDarkTheme: Theme = webDarkTheme;
