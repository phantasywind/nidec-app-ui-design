import { readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import {
  PageHeader, RecordManagementWorkspace, WorkspaceSection,
} from '../src/index';
import type {
  PageHeaderProps, RecordManagementWorkspaceProps, WorkspaceSectionProps,
} from '../src/index';

const repositoryRoot = resolve(import.meta.dirname, '..');

const pageHeaderContract: PageHeaderProps = { title: 'Records' };
const sectionContract: WorkspaceSectionProps = { title: 'Current record', children: 'Data list' };
const workspaceContract: RecordManagementWorkspaceProps = {
  'aria-label': 'Record management',
  header: createElement(PageHeader, pageHeaderContract),
  primary: createElement(WorkspaceSection, sectionContract),
};
void [pageHeaderContract, sectionContract, workspaceContract];

describe('record-management workspace composition', () => {
  it('renders one page identity and keeps application actions explicit', () => {
    const html = renderToStaticMarkup(createElement(PageHeader, {
      actions: createElement('button', { type: 'button' }, 'New record'),
      description: 'Maintain governed records.',
      eyebrow: 'Record management',
      title: 'Records',
    }));
    expect(html).toContain('<header');
    expect(html).toContain('<h1');
    expect(html).toContain('Records');
    expect(html).toContain('Maintain governed records.');
    expect(html).toContain('New record');
    expect(html.match(/<h1/g)).toHaveLength(1);
  });

  it('keeps the contextual selector before controlled content in DOM order', () => {
    const html = renderToStaticMarkup(createElement(RecordManagementWorkspace, {
      ...workspaceContract,
      contextRail: createElement('div', {}, 'Available record cards'),
      contextRailLabel: 'Available records',
    }));
    expect(html).toContain('nidec-ui-record-workspace--with-rail');
    expect(html).toContain('<aside aria-label="Available records"');
    expect(html.indexOf('Available record cards')).toBeLessThan(html.indexOf('Current record'));
    expect(() => renderToStaticMarkup(createElement(RecordManagementWorkspace, {
      ...workspaceContract,
      'aria-label': ' ',
    }))).toThrow('non-empty aria-label');
    expect(() => renderToStaticMarkup(createElement(RecordManagementWorkspace, {
      ...workspaceContract,
      contextRail: 'Cards',
    }))).toThrow('requires contextRailLabel');
  });

  it('establishes a governed module surface without forcing nested Fluent Card markup', () => {
    const html = renderToStaticMarkup(createElement(WorkspaceSection, {
      actions: createElement('button', { type: 'button' }, 'Add'),
      description: 'Consumer-owned records.',
      title: 'Current record',
      children: createElement('table', {}, createElement('tbody', {}, createElement('tr', {}, createElement('td', {}, 'Example')))),
    }));
    expect(html).toContain('<section');
    expect(html).toContain('<h2');
    expect(html).toContain('<table');
    expect(html).not.toContain('fui-Card');
  });

  it('binds wide and narrow placement to the documented contract', async () => {
    const css = await readFile(join(repositoryRoot, 'styles', 'components.css'), 'utf8');
    const contract = await readFile(join(repositoryRoot, 'docs', 'record-management-workspace.md'), 'utf8');
    expect(css).toContain('grid-template-areas: "primary rail"');
    expect(css).toContain('@media (max-width: 900px)');
    expect(css).toContain('grid-template-areas: "rail" "primary"');
    expect(css).toContain('grid-template-columns: minmax(0, 1fr) minmax(16rem, 20rem)');
    expect(css).toMatch(/nidec-ui-page-header[\s\S]*?background-color: var\(--colorNeutralBackground1\)[\s\S]*?border: var\(--strokeWidthThin\) solid var\(--colorNeutralStroke2\)[\s\S]*?border-radius: var\(--borderRadiusLarge\)/);
    expect(css).toMatch(/nidec-ui-workspace-section[\s\S]*?background-color: var\(--colorNeutralBackground1\)[\s\S]*?border: var\(--strokeWidthThin\) solid var\(--colorNeutralStroke2\)[\s\S]*?border-radius: var\(--borderRadiusLarge\)/);
    expect(contract).toContain('## Data List placement');
    expect(contract).toContain('## Context rail and Card placement');
    expect(contract).toContain('Do not wrap these modules again in decorative outer Cards');
  });

  it('records the white shell and module rule without taking consumer navigation authority', async () => {
    const shellContract = await readFile(join(repositoryRoot, 'docs', 'application-shell-and-module-layout.md'), 'utf8');
    expect(shellContract).toContain('Use a white application background.');
    expect(shellContract).toContain('short, uppercase group labels followed by icon-and-text navigation items');
    expect(shellContract).toContain('without persistent filled tiles or shadows');
    expect(shellContract).toContain('no second border and no elevation shadow');
    expect(shellContract).toContain('Every module uses a white background');
    expect(shellContract).toContain('Routes, labels, grouping, ordering, visibility and RBAC remain application-owned.');
  });
});
