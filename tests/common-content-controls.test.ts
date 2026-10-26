import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import {
  Avatar, AvatarGroup, AvatarGroupItem, Divider, InfoLabel, Label,
  Persona, Popover, PopoverSurface, PopoverTrigger,
  SearchBox, Slider, SpinButton, Tag, TagGroup,
} from '../src/index';

describe('Common content and control foundations', () => {
  it('renders labelled search and numeric controls without application validation rules', () => {
    const html = renderToStaticMarkup(createElement('div', {},
      createElement(Label, { htmlFor: 'search' }, 'Search'),
      createElement(SearchBox, { id: 'search', placeholder: 'Find records' }),
      createElement(InfoLabel, { info: 'Example guidance' }, 'Quantity'),
      createElement(SpinButton, { defaultValue: 1, min: 0, 'aria-label': 'Quantity' }),
      createElement(Slider, { defaultValue: 50, 'aria-label': 'Example percentage' })));
    expect(html).toContain('Find records');
    expect(html).toContain('Quantity');
    expect(html).toContain('aria-label="information"');
    expect(html).toContain('Example percentage');
  });

  it('renders identity and classification primitives without owning user or status semantics', () => {
    const html = renderToStaticMarkup(createElement('div', {},
      createElement(Avatar, { name: 'Example User' }),
      createElement(Persona, { name: 'Example User', secondaryText: 'Example role' }),
      createElement(AvatarGroup, { layout: 'spread' },
        createElement(AvatarGroupItem, { name: 'Example A' }),
        createElement(AvatarGroupItem, { name: 'Example B' })),
      createElement(TagGroup, { 'aria-label': 'Example tags' }, createElement(Tag, { value: 'sample' }, 'Sample'))));
    expect(html).toContain('Example User');
    expect(html).toContain('Example role');
    expect(html).toContain('Example tags');
    expect(html).toContain('Sample');
  });

  it('renders a labelled divider', () => {
    expect(renderToStaticMarkup(createElement(Divider, {}, 'More'))).toContain('More');
  });

  it('keeps contextual disclosure compositional', () => {
    const html = renderToStaticMarkup(createElement(Popover, {
      open: true,
      inline: true,
      children: [
        createElement(PopoverTrigger, { key: 'trigger' }, createElement('button', { type: 'button' }, 'Details')),
        createElement(PopoverSurface, { key: 'surface' }, 'Consumer-owned detail'),
      ],
    }));
    expect(html).toContain('Details');
    expect(html).toContain('Consumer-owned detail');
  });
});
