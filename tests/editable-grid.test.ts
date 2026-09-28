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
});
