import { createElement } from 'react';
import type { ComponentPropsWithoutRef, MouseEvent, ReactNode } from 'react';
import {
  Button as FluentButton, Popover, PopoverSurface, PopoverTrigger, makeStyles, mergeClasses, tokens,
} from '@fluentui/react-components';
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
  /**
   * Detail shown in a popover below a reached stage when its arrow is activated, usually a
   * BusinessProcessStageDetail. Return undefined for a stage without detail. Content is consumer-owned.
   */
  renderStageDetail?: (stage: BusinessProcessStageDefinition) => ReactNode;
};

const useStageDetailStyles = makeStyles({
  surface: {
    boxSizing: 'border-box',
    maxWidth: 'min(36rem, calc(100vw - 2rem))',
    minWidth: '20rem',
    padding: `${tokens.spacingVerticalL} ${tokens.spacingHorizontalXL}`,
  },
  root: {
    color: tokens.colorNeutralForeground1,
    display: 'grid',
    fontFamily: tokens.fontFamilyBase,
    fontSize: tokens.fontSizeBase300,
    lineHeight: tokens.lineHeightBase300,
    rowGap: tokens.spacingVerticalM,
  },
  header: { display: 'grid', rowGap: tokens.spacingVerticalXXS },
  title: {
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightSemibold,
    lineHeight: tokens.lineHeightBase400,
    margin: 0,
  },
  secondary: { color: tokens.colorNeutralForeground2 },
  section: { display: 'grid', rowGap: tokens.spacingVerticalS },
  checks: { display: 'grid', listStyleType: 'none', margin: 0, padding: 0, rowGap: tokens.spacingVerticalS },
  check: {
    alignItems: 'start',
    columnGap: tokens.spacingHorizontalS,
    display: 'grid',
    gridTemplateColumns: `${tokens.lineHeightBase300} minmax(0, 1fr) auto`,
  },
  icon: {
    alignItems: 'center',
    display: 'inline-flex',
    height: tokens.lineHeightBase300,
    justifyContent: 'center',
    '& svg': { height: '1rem', width: '1rem' },
  },
  checkLabel: { fontWeight: tokens.fontWeightSemibold },
  checkDetail: {
    color: tokens.colorNeutralForeground2,
    display: 'block',
    fontSize: tokens.fontSizeBase200,
    lineHeight: tokens.lineHeightBase200,
  },
  checkAction: { justifySelf: 'end' },
  // The popover renders in a portal outside the scoped stylesheet, so it carries its own hidden-text rule.
  visuallyHidden: {
    blockSize: '1px', clipPath: 'inset(50%)', inlineSize: '1px', overflow: 'hidden',
    position: 'absolute', whiteSpace: 'nowrap',
  },
  actions: { display: 'flex', flexWrap: 'wrap', gap: tokens.spacingHorizontalS },
  next: {
    borderTop: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke1}`,
    color: tokens.colorNeutralForeground2,
    paddingTop: tokens.spacingVerticalM,
  },
});

/** Application-controlled lifecycle with separate, bounded navigation to reached stage content. */
export function BusinessProcessFlow({ 'aria-label': ariaLabel, stages, viewedStageId, onStageView, renderStageDetail, className, ...props }: BusinessProcessFlowProps) {
  if (!ariaLabel.trim()) throw new Error('BusinessProcessFlow requires a non-empty aria-label.');
  if (stages.length === 0) throw new Error('BusinessProcessFlow requires at least one stage.');
  if (new Set(stages.map(stage => stage.id)).size !== stages.length) throw new Error('Business process stage IDs must be unique.');
  if (stages.filter(stage => stage.status === 'current').length > 1) throw new Error('Only one business process stage may be current.');
  if (viewedStageId !== undefined && !stages.some(stage => stage.id === viewedStageId && stage.status !== 'upcoming')) {
    throw new Error('Viewed business process stage must be a reached stage.');
  }
  const styles = useStageDetailStyles();
  const activeViewId = viewedStageId ?? stages.find(stage => stage.status === 'current')?.id;

  return createElement('section', {
    ...props,
    'aria-label': ariaLabel,
    className: withClass('nidec-ui-business-process-flow', className),
    tabIndex: props.tabIndex ?? 0,
  }, createElement('ol', { className: 'nidec-ui-business-process-flow__track' },
    stages.map((stage, index) => {
      const detail = stage.status === 'upcoming' ? undefined : renderStageDetail?.(stage);
      const hasDetail = detail !== undefined && detail !== null && detail !== false;
      const interactive = stage.status !== 'upcoming' && (onStageView !== undefined || hasDetail);
      const body = createElement(interactive ? 'button' : 'div', {
        className: 'nidec-ui-business-process-flow__body',
        ...(interactive ? {
          type: 'button' as const,
          'aria-current': onStageView && stage.id === activeViewId ? 'location' as const : undefined,
          onClick: (event: MouseEvent<HTMLButtonElement>) => onStageView?.(event, stage),
        } : {}),
      },
        createElement('span', { className: 'nidec-ui-business-process-flow__marker', 'aria-hidden': true }, index + 1),
        createElement('span', { className: 'nidec-ui-business-process-flow__copy' },
          createElement('strong', null, stage.label),
          stage.description === undefined ? null : createElement('small', null, stage.description),
          createElement('span', { className: 'nidec-ui-visually-hidden' }, stage.statusLabel)));
      return createElement('li', {
        key: stage.id,
        'aria-current': stage.status === 'current' ? 'step' : undefined,
        className: 'nidec-ui-business-process-flow__stage',
        'data-stage-status': stage.status,
        'data-viewed': stage.id === activeViewId ? 'true' : undefined,
      }, hasDetail ? createElement(Popover, {
        // 8px gap between the arrow and the card, like spacingVerticalS.
        positioning: { position: 'below', align: 'start', offset: 8 },
        trapFocus: true,
        children: [
          createElement(PopoverTrigger, { key: 'trigger', disableButtonEnhancement: true }, body),
          createElement(PopoverSurface, { key: 'surface', 'aria-label': stage.label, className: styles.surface }, detail),
        ],
      }) : body);
    })));
}

export type BusinessProcessStageCheck = Readonly<{
  id: string;
  label: ReactNode;
  /** Whether the consumer's condition is satisfied; the package never evaluates it. */
  met: boolean;
  /** Localised accessible text for the met or unmet icon, for example "Done" or "Missing". */
  stateLabel: string;
  /** Supporting text under the label, such as who returned the request and why. */
  detail?: ReactNode;
  /** Optional trailing action, usually a Link to the field or lines to fix. */
  action?: ReactNode;
}>;

export type BusinessProcessStageDetailProps = Omit<ComponentPropsWithoutRef<'div'>, 'title' | 'children'> & {
  title: ReactNode;
  /** Who or what the stage waits on, for example "Waiting for you (Engineer)". */
  status?: ReactNode;
  /** Heading for the checks, for example "To move to Review". */
  checksTitle?: ReactNode;
  checks?: readonly BusinessProcessStageCheck[];
  /** Heading for the actions, for example "Your actions". */
  actionsTitle?: ReactNode;
  /** Consumer-owned commands, usually one primary and one secondary Button. */
  actions?: ReactNode;
  /** What happens after this stage, shown under a divider. */
  next?: ReactNode;
};

function checkIcon(met: boolean) {
  // 16px outline glyphs stroked with the theme's success or danger foreground.
  return createElement('svg', { viewBox: '0 0 16 16', fillOpacity: 0, stroke: met ? tokens.colorStatusSuccessForeground1 : tokens.colorStatusDangerForeground1, strokeWidth: 1.25, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true, focusable: false },
    createElement('circle', { cx: 8, cy: 8, r: 6.375 }),
    met
      ? createElement('path', { d: 'M5.5 8.25 7.25 10l3.25-3.75' })
      : createElement('path', { d: 'M6 6l4 4M10 6l-4 4' }));
}

/** Popover content for one BusinessProcessFlow stage: status, checks with met/unmet icons, actions and next step. */
export function BusinessProcessStageDetail({ title, status, checksTitle, checks, actionsTitle, actions, next, className, ...props }: BusinessProcessStageDetailProps) {
  if (checks !== undefined && new Set(checks.map(check => check.id)).size !== checks.length) throw new Error('Business process stage check IDs must be unique.');
  if (checks?.some(check => !check.stateLabel.trim())) throw new Error('Every business process stage check requires a non-empty stateLabel.');
  const styles = useStageDetailStyles();
  return createElement('div', { ...props, className: mergeClasses('nidec-ui-business-process-stage-detail', styles.root, className) },
    createElement('div', { className: styles.header },
      createElement('h3', { className: styles.title }, title),
      status === undefined ? null : createElement('div', { className: styles.secondary }, status)),
    checks === undefined || checks.length === 0 ? null : createElement('div', { className: styles.section },
      checksTitle === undefined ? null : createElement('div', { className: styles.secondary }, checksTitle),
      createElement('ul', { className: styles.checks }, checks.map(check => createElement('li', {
        key: check.id, className: styles.check, 'data-check-state': check.met ? 'met' : 'unmet',
      },
        createElement('span', { className: styles.icon }, checkIcon(check.met)),
        createElement('span', null,
          createElement('span', { className: styles.visuallyHidden }, `${check.stateLabel}: `),
          createElement('span', { className: styles.checkLabel }, check.label),
          check.detail === undefined ? null : createElement('span', { className: styles.checkDetail }, check.detail)),
        check.action === undefined ? null : createElement('span', { className: styles.checkAction }, check.action))))),
    actions === undefined ? null : createElement('div', { className: styles.section },
      actionsTitle === undefined ? null : createElement('div', { className: styles.secondary }, actionsTitle),
      createElement('div', { className: styles.actions }, actions)),
    next === undefined ? null : createElement('div', { className: styles.next }, next));
}
