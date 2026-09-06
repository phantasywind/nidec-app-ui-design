import { createElement, createRef } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { IconButton, TabList, Tab, Link, Combobox, Option } from '../src/index';
import type { IconButtonProps, TabListProps, ComboboxProps } from '../src/index';

const icon = createElement('svg', { 'aria-hidden': true });
describe('Directory and action contracts', () => {
  it('requires an explicit accessible name and defaults to a non-submit button', () => {
    const element=IconButton({icon,'aria-label':'Edit item'});
    expect(element.props.type).toBe('button');
    expect(element.props.as).toBe('button');
    expect(element.props['aria-label']).toBe('Edit item');
    expect(element.props.icon).toBe(icon);
    expect(element.props.className).toContain('nidec-ui-button');
  });
  it('rejects empty names without inventing business labels', () => {
    expect(()=>IconButton({icon,'aria-label':'  '})).toThrow('non-empty aria-label');
  });
  it('preserves explicit submit, disabled, ref and event contracts', () => {
    const ref=createRef<HTMLButtonElement>();
    const click=()=>{};
    const element=IconButton({icon,'aria-label':'Apply',type:'submit',disabled:true,ref,onClick:click});
    expect(element.props.disabled).toBe(true);
    expect(element.props.type).toBe('submit');
    expect(element.props.onClick).toBe(click);
    expect(typeof element.props.ref).toBe('function');
    if (typeof element.props.ref === 'function') element.props.ref(null);
    expect(ref.current).toBeNull();
  });
  it('renders icon-only Fluent appearance while retaining a labelled native button',()=>{
    const html=renderToStaticMarkup(createElement(IconButton,{icon,'aria-label':'Edit item'}));
    expect(html).toContain('aria-label="Edit item"');
    expect(html).toContain('type="button"');
    expect(html).toContain('fui-Button');
  });
  it('keeps link navigation and tab selection distinct from actions',()=>{
    const link=renderToStaticMarkup(createElement(Link,{href:'#example'},'View example'));
    expect(link).toContain('href="#example"');
    const tabs=renderToStaticMarkup(createElement(TabList,{selectedValue:'one'},
      createElement(Tab,{value:'one'},'One'),createElement(Tab,{value:'two'},'Two')));
    expect(tabs).toContain('role="tablist"');
    expect(tabs).toContain('aria-selected="true"');
  });
  it('retains the upstream combobox contract',()=>{
    const html=renderToStaticMarkup(createElement(Combobox,{'aria-label':'Filter',value:'Alpha',selectedOptions:['a']},
      createElement(Option,{value:'a',text:'Alpha'},'Alpha')));
    expect(html).toContain('role="combobox"');
    expect(html).toContain('value="Alpha"');
  });
});
const tabs:TabListProps={selectedValue:'one',onTabSelect:(_,data)=>{void data.value;}};
const combo:ComboboxProps={selectedOptions:['a'],onOptionSelect:(_,data)=>{void data.optionValue;void data.selectedOptions;}};
// @ts-expect-error Accessible name cannot be omitted.
const unnamed:IconButtonProps={icon};
// @ts-expect-error Icon-only API does not accept visible text children.
const mixed:IconButtonProps={icon,'aria-label':'Edit',children:'Edit'};
// @ts-expect-error Icon actions cannot silently turn into links.
const href:IconButtonProps={icon,'aria-label':'Edit',href:'/edit'};
void [tabs,combo,unnamed,mixed,href];
