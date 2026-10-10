import { createElement } from 'react';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { withClass } from './with-class';

export type PageHeaderProps = Omit<ComponentPropsWithoutRef<'header'>, 'children'> & {
  title: ReactNode;
  description?: ReactNode;
  eyebrow?: ReactNode;
  actions?: ReactNode;
};

/** Page-level identity and commands; the surrounding application shell remains consumer-owned. */
export function PageHeader({ title, description, eyebrow, actions, className, ...props }: PageHeaderProps) {
  return createElement('header', { ...props, className: withClass('nidec-ui-page-header', className) },
    createElement('div', { className: 'nidec-ui-page-header__copy' },
      eyebrow === undefined ? null : createElement('div', { className: 'nidec-ui-page-header__eyebrow' }, eyebrow),
      createElement('h1', { className: 'nidec-ui-page-header__title' }, title),
      description === undefined ? null : createElement('div', { className: 'nidec-ui-page-header__description' }, description)),
    actions === undefined ? null : createElement('div', { className: 'nidec-ui-page-header__actions' }, actions));
}

export type RecordManagementWorkspaceProps = Omit<ComponentPropsWithoutRef<'section'>, 'children'> & {
  'aria-label': string;
  header: ReactNode;
  primary: ReactNode;
  contextRail?: ReactNode;
  contextRailLabel?: string;
};

/**
 * Neutral record-management page composition. The rail precedes the controlled
 * content in DOM order, appears on the right at wide widths, and moves above it
 * on constrained widths. Data, selection, routing and commands remain consumer-owned.
 */
export function RecordManagementWorkspace({
  'aria-label': ariaLabel,
  header,
  primary,
  contextRail,
  contextRailLabel,
  className,
  ...props
}: RecordManagementWorkspaceProps) {
  if (!ariaLabel.trim()) throw new Error('RecordManagementWorkspace requires a non-empty aria-label.');
  if (contextRail !== undefined && !contextRailLabel?.trim()) {
    throw new Error('RecordManagementWorkspace requires contextRailLabel when contextRail is provided.');
  }
  const hasRail = contextRail !== undefined;
  return createElement('section', {
    ...props,
    'aria-label': ariaLabel,
    className: withClass(`nidec-ui-record-workspace${hasRail ? ' nidec-ui-record-workspace--with-rail' : ''}`, className),
  },
  header,
  createElement('div', { className: 'nidec-ui-record-workspace__body' },
    hasRail ? createElement('aside', {
      'aria-label': contextRailLabel,
      className: 'nidec-ui-record-workspace__rail',
    }, contextRail) : null,
    createElement('div', { className: 'nidec-ui-record-workspace__primary' }, primary)));
}

export type WorkspaceSectionProps = Omit<ComponentPropsWithoutRef<'section'>, 'children'> & {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
};

/** Standard white bordered module for one workspace region; nested content must not add a redundant surface. */
export function WorkspaceSection({ title, description, actions, children, className, ...props }: WorkspaceSectionProps) {
  return createElement('section', { ...props, className: withClass('nidec-ui-workspace-section', className) },
    createElement('header', { className: 'nidec-ui-workspace-section__header' },
      createElement('div', { className: 'nidec-ui-workspace-section__copy' },
        createElement('h2', { className: 'nidec-ui-workspace-section__title' }, title),
        description === undefined ? null : createElement('div', { className: 'nidec-ui-workspace-section__description' }, description)),
      actions === undefined ? null : createElement('div', { className: 'nidec-ui-workspace-section__actions' }, actions)),
    createElement('div', { className: 'nidec-ui-workspace-section__content' }, children));
}
