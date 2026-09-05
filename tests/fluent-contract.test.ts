import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import * as upstream from '@fluentui/react-components';
import * as shared from '../src/index';
import type { NidecProviderProps } from '../src/index';

const compositions = ['Input', 'Field', 'Dialog', 'DialogTrigger', 'DialogSurface',
  'DialogBody', 'DialogTitle', 'DialogContent', 'DialogActions',
  'Textarea', 'Select', 'Checkbox', 'RadioGroup', 'Radio', 'Switch'] as const;

describe('Fluent public boundary', () => {
  it('exports exactly the approved API and preserves upstream composition identity', () => {
    expect(Object.keys(shared).sort()).toEqual(['Button', 'NidecProvider', ...compositions].sort());
    for (const name of compositions) expect(shared[name]).toBe(upstream[name]);
  });
  it('forwards an explicit theme and establishes a host', () => {
    const element = shared.NidecProvider({theme:upstream.webLightTheme, id:'host', children:'Fixture'});
    expect(element.type).toBe(upstream.FluentProvider);
    expect(element.props.theme).toBe(upstream.webLightTheme);
    const html = renderToStaticMarkup(createElement(shared.NidecProvider, {
      theme: upstream.webLightTheme, id:'host', children:'Fixture',
    }));
    expect(html).toContain('data-nidec-ui=""');
    expect(html).toContain('id="host"');
  });
});
// @ts-expect-error No implicit production theme.
const missingTheme: NidecProviderProps = { children:'Fixture' };
// @ts-expect-error No null theme.
const nullTheme: NidecProviderProps = { theme:null };
// @ts-expect-error Unstable upstream styling is not public Nidec API.
const unstable: NidecProviderProps = { theme:upstream.webLightTheme, overrides_unstable:{} };
// @ts-expect-error Unstable style hooks are not public Nidec API.
const hooks: NidecProviderProps = { theme:upstream.webLightTheme, customStyleHooks_unstable:{} };
void [missingTheme, nullTheme, unstable, hooks];
