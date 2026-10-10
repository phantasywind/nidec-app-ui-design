import { createElement } from 'react';
import { FluentProvider } from '@fluentui/react-components';
import type { FluentProviderProps, Theme } from '@fluentui/react-components';

export type NidecProviderProps = Omit<FluentProviderProps,
  'theme' | 'customStyleHooks_unstable' | 'overrides_unstable'> & { theme: Theme };

/** Explicit theme required. The caller owns its approved theme values. */
export function NidecProvider(props: NidecProviderProps) {
  const hostProps = { ...props, 'data-nidec-ui': '' };
  return createElement(FluentProvider, hostProps);
}
