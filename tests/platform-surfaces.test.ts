import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import {
  Accordion, AccordionHeader, AccordionItem, AccordionPanel,
  Badge, Breadcrumb, BreadcrumbButton, BreadcrumbItem,
  Card, CardFooter, CardHeader,
  Nav, NavItem, ProgressBar, Skeleton, SkeletonItem,
  Table, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow,
  Toolbar, ToolbarButton, Tree, TreeItem, TreeItemLayout,
} from '../src/index';

describe('Data, feedback, workspace, and navigation surfaces', () => {
  it('renders a semantic Fluent table without owning business columns or row actions', () => {
    const html = renderToStaticMarkup(createElement(Table, { 'aria-label': 'Example records' },
      createElement(TableHeader, {}, createElement(TableRow, {},
        createElement(TableHeaderCell, {}, 'Name'), createElement(TableHeaderCell, {}, 'Status'))),
      createElement(TableBody, {}, createElement(TableRow, {},
        createElement(TableCell, {}, 'Example'), createElement(TableCell, {}, 'Ready')))));
    expect(html).toContain('<table');
    expect(html).toContain('Example records');
    expect(html).toContain('fui-Table');
  });

  it('renders neutral feedback primitives without encoding application status meaning', () => {
    const html = renderToStaticMarkup(createElement('div', {},
      createElement(Badge, { appearance: 'tint', color: 'success' }, 'Ready'),
      createElement(ProgressBar, { value: 0.5, 'aria-label': 'Example progress' }),
      createElement(Skeleton, { 'aria-label': 'Loading example' }, createElement(SkeletonItem, {}))));
    expect(html).toContain('Ready');
    expect(html).toContain('Example progress');
    expect(html).toContain('Loading example');
  });

  it('keeps cards and toolbars compositional', () => {
    const html = renderToStaticMarkup(createElement(Card, {},
      createElement(CardHeader, { header: createElement('span', {}, 'Example card') }),
      createElement('p', {}, 'Consumer-owned content'),
      createElement(CardFooter, {}, createElement(Toolbar, { 'aria-label': 'Example actions' },
        createElement(ToolbarButton, {}, 'Open')))));
    expect(html).toContain('Example card');
    expect(html).toContain('Consumer-owned content');
    expect(html).toContain('Example actions');
  });

  it('renders navigation, breadcrumb, tree, and disclosure using upstream semantics', () => {
    const html = renderToStaticMarkup(createElement('div', {},
      createElement(Breadcrumb, { 'aria-label': 'Location' },
        createElement(BreadcrumbItem, {}, createElement(BreadcrumbButton, {}, 'Home'))),
      createElement(Nav, { 'aria-label': 'Primary' }, createElement(NavItem, { as: 'a', href: '#one', value: 'one' }, 'One')),
      createElement(Tree, { 'aria-label': 'Hierarchy' }, createElement(TreeItem, { itemType: 'leaf' },
        createElement(TreeItemLayout, {}, 'Leaf'))),
      createElement(Accordion, { collapsible: true }, createElement(AccordionItem, { value: 'details' },
        createElement(AccordionHeader, {}, 'Details'), createElement(AccordionPanel, {}, 'Content')))));
    expect(html).toContain('Location');
    expect(html).toContain('Primary');
    expect(html).toContain('Hierarchy');
    expect(html).toContain('Details');
  });
});
