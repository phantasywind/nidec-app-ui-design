import { describe, expect, it } from 'vitest';
import { createElement, createRef } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Button } from '../src/index';
import type { ButtonProps } from '../src/index';
import { Button as FluentButton } from '@fluentui/react-components';

describe('Button native contract', () => {
  it('defaults to a non-submitting native button and escapes text', () => {
    const html = renderToStaticMarkup(createElement(Button, {children:'Save <draft>'}));
    expect(html).toContain('type="button"');
    expect(html).toContain('nidec-ui-button');
    expect(html).toContain('Save &lt;draft&gt;');
  });
  it.each(['submit', 'reset'] as const)('preserves explicit %s behavior', type => {
    expect(renderToStaticMarkup(createElement(Button, {children:'Action', type}))).toContain(`type="${type}"`);
  });
  it('forwards native disabled and accessible attributes', () => {
    const html = renderToStaticMarkup(createElement(Button, {children:'Save', disabled:true, name:'intent', value:'save', 'aria-describedby':'hint'}));
    expect(html).toContain('disabled=""');
    expect(html).toContain('aria-describedby="hint"');
    expect(html).toContain('name="intent"');
  });
  it('composes classes and forwards the ref and event handler', () => {
    const onClick = () => undefined;
    const ref = createRef<HTMLButtonElement>();
    const element = Button({children:'Save', className:'consumer-class', onClick, ref});
    expect(element.type).toBe(FluentButton);
    expect(element.props.onClick).toBe(onClick);
    const node = { tagName:'BUTTON' } as HTMLButtonElement;
    expect(typeof element.props.ref).toBe('function');
    if (typeof element.props.ref === 'function') {
      Reflect.apply(element.props.ref, null, [node]);
      expect(ref.current).toBe(node);
      element.props.ref(null);
      expect(ref.current).toBeNull();
    }
    expect(element.props.className).toBe('nidec-ui-button consumer-class');
  });
  it('preserves callback ref identity and cleanup return values', () => {
    const cleanup = () => undefined;
    const ref = () => cleanup;
    expect(Button({children:'Action', ref}).props.ref).toBe(ref);
  });
  it('normalizes undefined disabled without submitting or changing public props', () => {
    const element = Button({children:'Action', disabled:undefined});
    expect(element.props.disabled).toBe(false);
    expect(element.props.type).toBe('button');
  });
});
const valid: ButtonProps = {children:'Text', type:'button'};
// @ts-expect-error Visible text is mandatory.
const missing: ButtonProps = {};
// @ts-expect-error HTML injection is outside the text-only slice.
const html: ButtonProps = {children:'Text', dangerouslySetInnerHTML:{__html:'unsafe'}};
// @ts-expect-error Links remain application-owned.
const link: ButtonProps = {children:'Text', href:'/page'};
void [valid, missing, html, link];
