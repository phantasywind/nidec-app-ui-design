import { describe, expect, it } from 'vitest';
import { createElement, createRef } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Button } from '../src/index';
import type { ButtonProps } from '../src/index';

describe('Button native contract', () => {
  it('defaults to a non-submitting native button and escapes text', () => {
    expect(renderToStaticMarkup(createElement(Button, {children:'Save <draft>'}))).toBe('<button type="button" class="nidec-ui-button">Save &lt;draft&gt;</button>');
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
    expect(element.type).toBe('button');
    expect(element.props.onClick).toBe(onClick);
    expect(element.props.ref).toBe(ref);
    expect(element.props.className).toBe('nidec-ui-button consumer-class');
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
