import { createElement, type ReactElement } from 'react';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import {
  EditableGrid,
  EditableGridRowActionGroup,
  TableActionIconButton,
} from '../src/index';
import type { EditableGridProps, EditableGridRowActionGroupProps } from '../src/index';

const repositoryRoot = join(dirname(fileURLToPath(import.meta.url)), '..');

const gridContract: EditableGridProps = {
  'aria-label': 'Line editor',
  title: 'Lines',
  description: 'Edit a controlled batch.',
  status: '3 unsaved changes',
  toolbar: createElement('button', { type: 'button' }, 'Add line'),
  children: createElement('table', null, createElement('tbody')),
  footer: '25 lines',
};

const actionContract: EditableGridRowActionGroupProps = {
  confirmIcon: createElement('span', null, 'confirm-icon'),
  confirmLabel: 'Confirm line edits',
  cancelIcon: createElement('span', null, 'cancel-icon'),
  cancelLabel: 'Cancel line edits',
  onConfirm: () => undefined,
  onCancel: () => undefined,
};

describe('EditableGrid governance', () => {
  it('renders a labelled batch-editing frame without owning row data', () => {
    const html = renderToStaticMarkup(createElement(EditableGrid, gridContract));
    expect(html).toContain('aria-label="Line editor"');
    expect(html).toContain('aria-label="Line editor rows"');
    expect(html).toContain('nidec-ui-editable-grid__toolbar');
    expect(html).toContain('nidec-ui-editable-grid__viewport');
    expect(html).toContain('tabindex="0"');
    expect(html).toContain('3 unsaved changes');
    expect(html).not.toContain('role="status"');
  });

  it('omits the header and toolbar it is not given, so no empty strip is drawn', () => {
    const html = renderToStaticMarkup(createElement(EditableGrid, {
      'aria-label': 'Lines', children: createElement('table', null, createElement('tbody')),
    }));
    expect(html).not.toContain('nidec-ui-editable-grid__header');
    expect(html).not.toContain('nidec-ui-editable-grid__toolbar');
    expect(html).not.toContain('<h2');
    const statusOnly = renderToStaticMarkup(createElement(EditableGrid, {
      'aria-label': 'Lines', status: '2 issues', children: createElement('table'),
    }));
    expect(statusOnly).toContain('nidec-ui-editable-grid__header');
    expect(statusOnly).not.toContain('<h2');
  });

  it('marks compact density and caps the viewport with maxHeight', async () => {
    const html = renderToStaticMarkup(createElement(EditableGrid, {
      ...gridContract, density: 'compact', maxHeight: 'calc(100vh - 320px)',
    }));
    expect(html).toContain('data-density="compact"');
    expect(html).toContain('data-max-height="true"');
    expect(html).toContain('max-height:calc(100vh - 320px)');
    expect(renderToStaticMarkup(createElement(EditableGrid, { ...gridContract, maxHeight: 360 }))).toContain('max-height:360px');
    expect(renderToStaticMarkup(createElement(EditableGrid, gridContract))).not.toContain('data-density');
    const css = await readFile(join(repositoryRoot, 'styles', 'components.css'), 'utf8');
    expect(css).toMatch(/\.nidec-ui-editable-grid__viewport\[data-max-height\] thead th\s*\{[^}]*position:\s*sticky/s);
  });

  it('rejects an unnamed editing surface', () => {
    expect(() => EditableGrid({ ...gridContract, 'aria-label': ' ' })).toThrow('non-empty aria-label');
  });

  it('uses the governed transparent row icon action for confirm and cancel', () => {
    const element = EditableGridRowActionGroup(actionContract);
    const tooltips = (element.props as typeof element.props & {
      children: ReactElement<{ content: string; children: ReactElement<{ className?: string }> }>[];
    }).children;
    expect(tooltips).toHaveLength(2);
    expect(tooltips[0]!.props.content).toBe('Confirm line edits');
    expect(tooltips[0]!.props.children.type).toBe(TableActionIconButton);
    expect(tooltips[0]!.props.children.props.className).toBe('nidec-ui-editable-grid__confirm-action');
    expect(tooltips[1]!.props.children.type).toBe(TableActionIconButton);
    const html = renderToStaticMarkup(element);
    expect(html).toContain('aria-label="Confirm line edits"');
    expect(html).toContain('aria-label="Cancel line edits"');
    expect(html).not.toContain('>Confirm line edits<');
    expect(html).not.toContain('>Cancel line edits<');
  });

  it('forwards row action events and disabled state', () => {
    const onConfirm = vi.fn();
    const element = EditableGridRowActionGroup({ ...actionContract, confirmDisabled: true, onConfirm });
    const children = (element.props as typeof element.props & {
      children: ReactElement<{ children: ReactElement<{ disabled?: boolean; onClick?: unknown }> }>[];
    }).children;
    const confirm = children[0]!.props.children;
    expect(confirm.props.disabled).toBe(true);
    expect(confirm.props.onClick).toBe(onConfirm);
  });

  it('requires accessible labels for both active-row actions', () => {
    expect(() => EditableGridRowActionGroup({ ...actionContract, confirmLabel: ' ' })).toThrow('non-empty action labels');
    expect(() => EditableGridRowActionGroup({ ...actionContract, cancelLabel: '' })).toThrow('non-empty action labels');
  });

  it('ships token-based density, dirty, active and invalid states', async () => {
    const css = await readFile(join(repositoryRoot, 'styles', 'components.css'), 'utf8');
    expect(css).toContain('.nidec-ui-editable-grid');
    expect(css).toContain('[data-editing="true"]');
    expect(css).toContain('[data-dirty="true"]');
    expect(css).toContain('[aria-invalid="true"]');
    expect(css).toContain('.nidec-ui-editable-grid__row-actions');
    expect(css).not.toMatch(/nidec-ui-editable-grid[\s\S]*?#[0-9a-f]{3,8}/i);
  });

  it('governs one sticky final action column for plain and grouped leaf rows', async () => {
    const css = await readFile(join(repositoryRoot, 'styles', 'components.css'), 'utf8');
    const preview = await readFile(join(repositoryRoot, 'fixtures', 'react-composite-patterns-consumer', 'src', 'demos.tsx'), 'utf8');
    expect(css).toMatch(/\.nidec-ui-editable-grid__viewport td\.nidec-ui-editable-grid__action-column\s*\{[^}]*position:\s*sticky/s);
    expect(css).toMatch(/\.nidec-ui-editable-grid__viewport th\.nidec-ui-editable-grid__action-column\s*\{[^}]*position:\s*sticky/s);
    // Only the marked action header is pinned, never whatever column happens to be last.
    expect(css).not.toMatch(/editable-grid__viewport th:last-child/);
    expect(css).toMatch(/\.nidec-ui-editable-grid__viewport tr\[data-editing="true"\] td\.nidec-ui-editable-grid__action-column/);
    expect(preview.match(/<TableCell className="nidec-ui-editable-grid__action-column">/g)).toHaveLength(2);
    expect(preview.match(/<TableHeaderCell className="nidec-ui-editable-grid__action-column">/g)).toHaveLength(2);
  });

  it('keeps the frozen action column free of a divider line', async () => {
    const css = await readFile(join(repositoryRoot, 'styles', 'components.css'), 'utf8');
    const actionCell = /\.nidec-ui-editable-grid__viewport td\.nidec-ui-editable-grid__action-column\s*\{([^}]*)\}/s.exec(css);
    const actionHeader = /\.nidec-ui-editable-grid__viewport th\.nidec-ui-editable-grid__action-column\s*\{([^}]*)\}/s.exec(css);
    expect(actionCell?.[1]).toBeDefined();
    expect(actionHeader?.[1]).toBeDefined();
    expect(actionCell?.[1]).not.toMatch(/border/);
    expect(actionHeader?.[1]).not.toMatch(/border/);
  });
});
