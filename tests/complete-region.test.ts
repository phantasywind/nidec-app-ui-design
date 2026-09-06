import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Button, Body1, Caption1, Subtitle2, Field, Input, MessageBar, MessageBarBody,
  MessageBarTitle, Spinner } from '../src/index';
import type { ButtonProps, OverlayDrawerProps } from '../src/index';

describe('Complete-region primitives', () => {
  it.each(['primary', 'secondary', 'outline', 'subtle', 'transparent'] as const)(
    'forwards %s without changing native action semantics', appearance => {
      const element = Button({ children: 'Save', appearance, size: 'small', shape: 'rounded' });
      expect(element.props.appearance).toBe(appearance);
      expect(element.props.size).toBe('small');
      expect(element.props.type).toBe('button');
    });
  it('supports a labelled busy action without inventing an async protocol', () => {
    const icon = createElement(Spinner, { size: 'tiny' });
    const element = Button({ children: 'Saving', disabled: true, 'aria-busy': true, icon });
    expect(element.props.icon).toBe(icon);
    expect(element.props.disabled).toBe(true);
    expect(element.props['aria-busy']).toBe(true);
  });
  it('renders an ordinary text input inside the upstream Field contract', () => {
    const html = renderToStaticMarkup(createElement(Field, {
      label: 'Name', validationState: 'error', validationMessage: 'Check this value',
    }, createElement(Input, { id: 'region-name', value: 'Example', readOnly: true })));
    expect(html).toContain('fui-Input');
    expect(html).toContain('aria-describedby=');
    expect(html).toContain('aria-invalid="true"');
    expect(html).toContain('Check this value');
  });
  it('uses upstream text presets and message composition', () => {
    for (const component of [Body1, Caption1, Subtitle2]) {
      expect(renderToStaticMarkup(createElement(component, {}, 'Example'))).toContain('Example');
    }
    const html = renderToStaticMarkup(createElement(MessageBar, { intent: 'warning' },
      createElement(MessageBarBody, {}, createElement(MessageBarTitle, {}, 'Review'), 'Local example')));
    expect(html).toContain('fui-MessageBar');
    expect(html).toContain('Local example');
  });
});

const drawer: OverlayDrawerProps = { open: true, position: 'end', size: 'medium', modalType: 'modal',
  onOpenChange: (_, data) => { void data.open; } };
const button: ButtonProps = { children: 'Save', appearance: 'primary', size: 'medium' };
// @ts-expect-error No invented danger appearance.
const danger: ButtonProps = { children: 'Delete', appearance: 'danger' };
// @ts-expect-error Visible text remains mandatory, even with an icon.
const iconOnly: ButtonProps = { icon: createElement('span') };
void [drawer, button, danger, iconOnly];
