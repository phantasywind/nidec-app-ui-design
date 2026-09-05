import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Checkbox, Radio, RadioGroup, Select, Switch, Textarea } from '../src/index';
import type * as Shared from '../src/index';
import type * as Fluent from '@fluentui/react-components';

type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2) ? true : false;
const exactTypes: [Equal<Shared.TextareaProps, Fluent.TextareaProps>,
  Equal<Shared.SelectProps, Fluent.SelectProps>, Equal<Shared.CheckboxProps, Fluent.CheckboxProps>,
  Equal<Shared.RadioGroupProps, Fluent.RadioGroupProps>, Equal<Shared.RadioProps, Fluent.RadioProps>,
  Equal<Shared.SwitchProps, Fluent.SwitchProps>] = [true, true, true, true, true, true];
void exactTypes;

describe('Form batch preserves native and upstream contracts', () => {
  it('preserves multiline text, readonly and caller-provided names', () => {
    const html = renderToStaticMarkup(createElement(Textarea, {
      name:'notes', value:'Line one\nLine two', readOnly:true, 'aria-label':'Notes',
    }));
    expect(html).toContain('<textarea');
    expect(html).toContain('name="notes"');
    expect(html).toMatch(/readonly=""/i);
    expect(html).toContain('Line one\nLine two');
  });
  it('preserves native select options and disabled behavior', () => {
    const html = renderToStaticMarkup(createElement(Select, {
      name:'density', disabled:true, defaultValue:'compact', 'aria-label':'Density',
    }, createElement('option',{value:'comfortable'},'Comfortable'), createElement('option',{value:'compact'},'Compact')));
    expect(html).toContain('<select');
    expect(html).toContain('disabled=""');
    expect(html).toContain('value="compact" selected=""');
  });
  it('keeps checkbox, radio and switch semantics distinct', () => {
    expect(renderToStaticMarkup(createElement(Checkbox,{label:'Mixed example',checked:'mixed'}))).toContain('type="checkbox"');
    const radio = renderToStaticMarkup(createElement(RadioGroup, {name:'layout', defaultValue:'stacked', 'aria-label':'Layout'},
      createElement(Radio,{value:'stacked', label:'Stacked'}), createElement(Radio,{value:'columns', label:'Columns'})));
    expect(radio).toContain('role="radiogroup"');
    expect(radio).toContain('type="radio"');
    expect(radio).toContain('name="layout"');
    expect(renderToStaticMarkup(createElement(Switch,{label:'Disabled switch',disabled:true}))).toContain('role="switch"');
  });
});

// Upstream event payloads stay intact; no Nidec-only event protocol is introduced.
const checked: Shared.CheckboxProps = {onChange:(_event,data) => {
  const value: boolean | 'mixed' = data.checked;
  void value;
}};
const switched: Shared.SwitchProps = {onChange:(_event,data) => { const value:boolean=data.checked; void value; }};
// @ts-expect-error A switch has a boolean state, not a mixed checkbox state.
const mixedSwitch: Shared.SwitchProps = {checked:'mixed'};
// @ts-expect-error Textarea values are strings, not arbitrary objects.
const objectText: Shared.TextareaProps = {value:{text:'no'}};
void [checked, switched, mixedSwitch, objectText];
