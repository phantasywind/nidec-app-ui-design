import { createElement } from 'react';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { Tooltip as FluentTooltip } from '@fluentui/react-components';
import { withClass } from './with-class';

export type StepStatus = 'done' | 'pending' | 'notApplicable';

export type StepStatusIconProps = Omit<ComponentPropsWithoutRef<'span'>, 'children' | 'role' | 'aria-label'> & {
  status: StepStatus;
  /** Accessible name, for example "Painting: done on 22 Oct 2026". */
  label: string;
  /** Optional hover and focus detail, such as the completion date. */
  tooltip?: string;
  size?: 'small' | 'medium';
};

const marks: Record<StepStatus, ReactNode> = {
  done: createElement('path', { d: 'M6.5 10.25 8.75 12.5l4.75-5' }),
  pending: null,
  notApplicable: createElement('path', { d: 'M6.5 10h7' }),
};

/**
 * Status of one independent step in a list of steps: done (filled green
 * tick), pending (hollow circle) or not applicable (minus). For a sequential
 * process with a current stage use BusinessProcessFlow instead.
 */
export function StepStatusIcon({ status, label, tooltip, size = 'medium', className, ...props }: StepStatusIconProps) {
  if (!label.trim()) throw new Error('StepStatusIcon requires a non-empty label.');
  const dimension = size === 'small' ? 16 : 20;
  const icon = createElement('span', {
    ...props,
    'aria-label': label,
    className: withClass('nidec-ui-step-status', className),
    'data-status': status,
    role: 'img',
    ...(tooltip === undefined ? {} : { tabIndex: 0 }),
  }, createElement('svg', {
    'aria-hidden': true, focusable: false, viewBox: '0 0 20 20', width: dimension, height: dimension,
    className: 'nidec-ui-glyph', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round',
  }, createElement('circle', { className: 'nidec-ui-step-status__ring', cx: 10, cy: 10, r: 7.25 }),
  marks[status] === null ? null : createElement('g', { className: 'nidec-ui-step-status__mark' }, marks[status])));
  return tooltip === undefined ? icon : createElement(FluentTooltip, { content: tooltip, relationship: 'description' }, icon);
}
