import { createElement } from 'react';
import type { ComponentPropsWithoutRef, MouseEvent } from 'react';
import { Button as FluentButton } from '@fluentui/react-components';
import { withClass } from './with-class';

export type ProcessStageStatus = 'completed' | 'current' | 'upcoming' | 'error';
export type ProcessStageDefinition = Readonly<{
  id: string;
  label: string;
  status: ProcessStageStatus;
  statusLabel: string;
  description?: string;
  disabled?: boolean;
}>;
export type ProcessStageIndicatorProps = Omit<ComponentPropsWithoutRef<'ol'>, 'children' | 'aria-label'> & {
  'aria-label': string;
  stages: readonly ProcessStageDefinition[];
  orientation?: 'horizontal' | 'vertical' | 'responsive';
  selectedStageId?: string;
  onStageSelect?: (event: MouseEvent<HTMLButtonElement>, stage: ProcessStageDefinition) => void;
};

export type StageNavigatorProps = Omit<ProcessStageIndicatorProps, 'onStageSelect'> & {
  /** The viewed workspace; independent of each stage's own status and marker fill. */
  selectedStageId: string;
  onStageSelect: (event: MouseEvent<HTMLButtonElement>, stage: ProcessStageDefinition) => void;
};

/** @deprecated Use StageNavigator for peer workspaces or BusinessProcessFlow for governed lifecycle and reached-stage viewing. */
export function ProcessStageIndicator({ 'aria-label': ariaLabel, stages, orientation = 'responsive', selectedStageId, onStageSelect, className, ...props }: ProcessStageIndicatorProps) {
  if (!ariaLabel.trim()) throw new Error('ProcessStageIndicator requires a non-empty aria-label.');
  if (stages.length === 0) throw new Error('ProcessStageIndicator requires at least one stage.');
  if (new Set(stages.map(stage => stage.id)).size !== stages.length) throw new Error('Process stage IDs must be unique.');
  if (stages.filter(stage => stage.status === 'current').length > 1) throw new Error('Only one process stage may be current.');
  if (selectedStageId !== undefined && !stages.some(stage => stage.id === selectedStageId)) throw new Error('Selected stage ID must exist.');
  return createElement('ol', { ...props, 'aria-label': ariaLabel, className: withClass(`nidec-ui-process-stage nidec-ui-process-stage--${orientation}`, className) },
    stages.map((stage, index) => {
      const current = selectedStageId === undefined
        ? stage.status === 'current' ? { 'aria-current': 'step' as const } : {}
        : stage.id === selectedStageId ? { 'aria-current': 'location' as const } : {};
      const content = createElement('span', { className: 'nidec-ui-process-stage__layout' },
        createElement('span', { className: 'nidec-ui-process-stage__marker', 'aria-hidden': true }, index + 1),
        createElement('span', { className: 'nidec-ui-process-stage__text' },
          createElement('span', { className: 'nidec-ui-process-stage__label' }, stage.label),
          stage.description === undefined ? null : createElement('span', { className: 'nidec-ui-process-stage__description' }, stage.description),
          createElement('span', { className: 'nidec-ui-visually-hidden' }, stage.statusLabel)));
      const stageContent = onStageSelect ? createElement(FluentButton, {
        ...current, appearance: 'transparent', className: 'nidec-ui-process-stage__button', disabled: stage.disabled ?? false,
        onClick: (event: MouseEvent<HTMLButtonElement>) => onStageSelect(event, stage),
        style: { minWidth: 0, padding: 'var(--spacingVerticalXS) var(--spacingHorizontalXS)', width: 'fit-content' }, type: 'button',
      }, content) : createElement('div', { ...current, className: 'nidec-ui-process-stage__content' }, content);
      return createElement('li', { key: stage.id, className: 'nidec-ui-process-stage__item', 'data-stage-status': stage.status, 'data-selected': stage.id === selectedStageId ? 'true' : undefined }, stageContent);
    }));
}

/** Interactive navigation between sibling workspaces; it does not represent automatic lifecycle progression. */
export function StageNavigator(props: StageNavigatorProps) {
  return ProcessStageIndicator({ ...props, className: withClass('nidec-ui-stage-navigator', props.className) });
}

export type BusinessProcessStageDefinition = Readonly<{
  id: string;
  label: string;
  status: ProcessStageStatus;
  statusLabel: string;
  description?: string;
}>;

export type BusinessProcessFlowProps = Omit<ComponentPropsWithoutRef<'section'>, 'children' | 'aria-label'> & {
  'aria-label': string;
  stages: readonly BusinessProcessStageDefinition[];
  /** The stage whose content is being viewed; this never changes the authoritative process stage. */
  viewedStageId?: string;
  /** View navigation only. Upcoming stages are never activatable. */
  onStageView?: (event: MouseEvent<HTMLButtonElement>, stage: BusinessProcessStageDefinition) => void;
};

/** Application-controlled lifecycle with separate, bounded navigation to reached stage content. */
export function BusinessProcessFlow({ 'aria-label': ariaLabel, stages, viewedStageId, onStageView, className, ...props }: BusinessProcessFlowProps) {
  if (!ariaLabel.trim()) throw new Error('BusinessProcessFlow requires a non-empty aria-label.');
  if (stages.length === 0) throw new Error('BusinessProcessFlow requires at least one stage.');
  if (new Set(stages.map(stage => stage.id)).size !== stages.length) throw new Error('Business process stage IDs must be unique.');
  if (stages.filter(stage => stage.status === 'current').length > 1) throw new Error('Only one business process stage may be current.');
  if (viewedStageId !== undefined && !stages.some(stage => stage.id === viewedStageId && stage.status !== 'upcoming')) {
    throw new Error('Viewed business process stage must be a reached stage.');
  }
  const activeViewId = viewedStageId ?? stages.find(stage => stage.status === 'current')?.id;

  return createElement('section', {
    ...props,
    'aria-label': ariaLabel,
    className: withClass('nidec-ui-business-process-flow', className),
    tabIndex: props.tabIndex ?? 0,
  }, createElement('ol', { className: 'nidec-ui-business-process-flow__track' },
    stages.map((stage, index) => createElement('li', {
      key: stage.id,
      'aria-current': stage.status === 'current' ? 'step' : undefined,
      className: 'nidec-ui-business-process-flow__stage',
      'data-stage-status': stage.status,
      'data-viewed': stage.id === activeViewId ? 'true' : undefined,
    },
    createElement(onStageView && stage.status !== 'upcoming' ? 'button' : 'div', {
      className: 'nidec-ui-business-process-flow__body',
      ...(onStageView && stage.status !== 'upcoming' ? {
        type: 'button' as const,
        'aria-current': stage.id === activeViewId ? 'location' as const : undefined,
        onClick: (event: MouseEvent<HTMLButtonElement>) => onStageView(event, stage),
      } : {}),
    },
      createElement('span', { className: 'nidec-ui-business-process-flow__marker', 'aria-hidden': true }, index + 1),
      createElement('span', { className: 'nidec-ui-business-process-flow__copy' },
        createElement('strong', null, stage.label),
        stage.description === undefined ? null : createElement('small', null, stage.description),
        createElement('span', { className: 'nidec-ui-visually-hidden' }, stage.statusLabel)))))));
}
