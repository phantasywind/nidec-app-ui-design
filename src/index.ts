import { createContext, createElement } from 'react';
import type { ComponentPropsWithRef, ComponentPropsWithoutRef, KeyboardEvent, MouseEvent, ReactElement, ReactNode } from 'react';
import {
  Button as FluentButton, Card as FluentCard, FluentProvider,
  DataGrid as FluentDataGrid, DataGridHeader as FluentDataGridHeader, DataGridRow as FluentDataGridRow,
  TableCellLayout as FluentTableCellLayout,
  TableHeader as FluentTableHeader, Toolbar as FluentToolbar,
  ToolbarRadioButton as FluentToolbarRadioButton, ToolbarRadioGroup as FluentToolbarRadioGroup,
  createLightTheme, makeStyles, mergeClasses, tokens,
} from '@fluentui/react-components';
import type {
  BrandVariants, ButtonProps as FluentButtonProps, CardProps as FluentCardProps,
  DataGridHeaderProps as FluentDataGridHeaderProps, DataGridProps as FluentDataGridProps,
  DataGridRowProps as FluentDataGridRowProps, FluentProviderProps, TableRowId,
  TableCellLayoutProps as FluentTableCellLayoutProps, TableHeaderProps as FluentTableHeaderProps, Theme,
  ToolbarProps as FluentToolbarProps,
} from '@fluentui/react-components';
import { lightPalette as palette } from './internal/light-palette.mjs';

// Deterministic sRGB interpolation. Derived states are UI mapping choices, not
// additional official raw brand colors. See ADR-0006 and the mapping record.
function mixColor(from: string, to: string, weight: number): string {
  const channels = [1, 3, 5].map(offset => Math.round(
    parseInt(from.slice(offset, offset + 2), 16) * (1 - weight) +
    parseInt(to.slice(offset, offset + 2), 16) * weight,
  ).toString(16).padStart(2, '0'));
  return `#${channels.join('')}`;
}

const brandRamp: BrandVariants = /* @__PURE__ */ (() => ({
  10: mixColor(palette.brandStrong, palette.text, 0.9),
  20: mixColor(palette.brandStrong, palette.text, 0.8),
  30: mixColor(palette.brandStrong, palette.text, 0.65),
  40: mixColor(palette.brandStrong, palette.text, 0.5),
  50: mixColor(palette.brandStrong, palette.text, 0.35),
  60: mixColor(palette.brandStrong, palette.text, 0.18),
  70: palette.brandStrong,
  80: palette.brand,
  90: mixColor(palette.brand, palette.surface, 0.12),
  100: mixColor(palette.brand, palette.surface, 0.24),
  110: mixColor(palette.brand, palette.surface, 0.36),
  120: mixColor(palette.brand, palette.surface, 0.48),
  130: mixColor(palette.brand, palette.surface, 0.6),
  140: mixColor(palette.brand, palette.surface, 0.72),
  150: mixColor(palette.brand, palette.surface, 0.82),
  160: palette.brandSoft,
}))();

/** Centrally mapped light theme; Provider still requires explicit opt-in. */
export const nidecLightTheme: Theme = /* @__PURE__ */ (() => ({
  ...createLightTheme(brandRamp),
  colorNeutralForeground1: palette.text,
  colorNeutralForeground1Hover: palette.text,
  colorNeutralForeground1Pressed: palette.text,
  colorNeutralForeground1Selected: palette.text,
  colorNeutralForeground2: palette.textSecondary,
  // Fluent pairs this role with darker neutral surfaces (for example the
  // neutral Avatar background), so darken the approved muted-text source just
  // enough to retain AA text contrast across the supported light-theme pair.
  colorNeutralForeground3: mixColor(palette.textMuted, palette.text, 0.12),
  colorNeutralForegroundOnBrand: palette.surface,
  colorNeutralBackground1: palette.surface,
  colorNeutralBackground2: palette.canvas,
  colorNeutralBackground3: palette.surfaceSubtle,
  colorNeutralStroke1: palette.border,
  colorNeutralStroke2: palette.borderStrong,
  // Decorative borders can stay subtle; functional control boundaries are darker.
  colorNeutralStrokeAccessible: palette.textMuted,
  colorNeutralStrokeAccessibleHover: palette.textSecondary,
  colorNeutralStrokeAccessiblePressed: palette.text,
  colorStrokeFocus1: palette.surface,
  colorStrokeFocus2: palette.focus,
  // Text on a solid brand surface needs the stronger green, not raw brand 80.
  colorBrandBackground: brandRamp[70],
  colorBrandBackgroundHover: brandRamp[60],
  colorBrandBackgroundPressed: brandRamp[40],
  colorBrandBackgroundSelected: brandRamp[50],
  colorBrandForeground1: brandRamp[70],
  colorBrandForegroundOnLight: brandRamp[70],
  colorBrandForegroundOnLightHover: brandRamp[60],
  colorBrandForegroundOnLightPressed: brandRamp[40],
  colorBrandForegroundOnLightSelected: brandRamp[50],
  colorNeutralForeground2BrandHover: brandRamp[70],
  colorNeutralForeground2BrandPressed: brandRamp[60],
  colorNeutralForeground2BrandSelected: brandRamp[70],
  colorNeutralForeground3BrandHover: brandRamp[70],
  colorNeutralForeground3BrandPressed: brandRamp[60],
  colorNeutralForeground3BrandSelected: brandRamp[70],
  colorStatusSuccessForeground1: palette.success,
  colorStatusSuccessForeground2: palette.success,
  colorStatusSuccessForeground3: palette.success,
  colorStatusSuccessForegroundInverted: mixColor(palette.success, palette.surface, 0.5),
  colorStatusSuccessBackground1: mixColor(palette.success, palette.surface, 0.96),
  colorStatusSuccessBackground2: mixColor(palette.success, palette.surface, 0.9),
  colorStatusSuccessBackground3: palette.success,
  colorStatusSuccessBorderActive: palette.success,
  colorStatusSuccessBorder1: mixColor(palette.success, palette.surface, 0.65),
  colorStatusSuccessBorder2: palette.success,
  colorStatusWarningForeground1: palette.warning,
  colorStatusWarningForeground2: palette.warning,
  colorStatusWarningForeground3: palette.warning,
  colorStatusWarningForegroundInverted: mixColor(palette.warning, palette.surface, 0.5),
  colorStatusWarningBackground1: mixColor(palette.warning, palette.surface, 0.96),
  colorStatusWarningBackground2: mixColor(palette.warning, palette.surface, 0.9),
  colorStatusWarningBackground3: palette.warning,
  colorStatusWarningBorderActive: palette.warning,
  colorStatusWarningBorder1: mixColor(palette.warning, palette.surface, 0.65),
  colorStatusWarningBorder2: palette.warning,
  colorStatusDangerForeground1: palette.danger,
  colorStatusDangerForeground2: palette.danger,
  colorStatusDangerForeground3: palette.danger,
  colorStatusDangerForegroundInverted: mixColor(palette.danger, palette.surface, 0.5),
  colorStatusDangerBackground1: mixColor(palette.danger, palette.surface, 0.96),
  colorStatusDangerBackground2: mixColor(palette.danger, palette.surface, 0.9),
  colorStatusDangerBackground3: palette.danger,
  colorStatusDangerBackground3Hover: mixColor(palette.danger, palette.text, 0.15),
  colorStatusDangerBackground3Pressed: mixColor(palette.danger, palette.text, 0.3),
  colorStatusDangerBorderActive: palette.danger,
  colorStatusDangerBorder1: mixColor(palette.danger, palette.surface, 0.65),
  colorStatusDangerBorder2: palette.danger,
  // Fluent has no colorStatusInfo family; information uses its Blue palette roles.
  colorPaletteBlueForeground2: palette.info,
  colorPaletteBlueBackground2: mixColor(palette.info, palette.surface, 0.9),
  colorPaletteBlueBorderActive: palette.info,
} satisfies Theme))();

/** Text-labelled native action with Fluent appearance; theme belongs to Provider. */
export type ButtonProps = Omit<ComponentPropsWithRef<'button'>, 'children' | 'dangerouslySetInnerHTML'> & {
  children: string;
} & Pick<FluentButtonProps, 'appearance' | 'size' | 'shape' | 'icon' | 'iconPosition'>;

export function Button({ children, type = 'button', disabled = false, className, ref, ...props }: ButtonProps) {
  // Bridge object refs through a callback: Fluent's event-derived ref type can
  // infer never with exact optional properties. No public ref type is narrowed.
  const forwardedRef = typeof ref === 'function' ? ref : ref ? (node: HTMLButtonElement | null) => {
    ref.current = node;
  } : null;
  return createElement(FluentButton, {
    ...props,
    as: 'button',
    disabled,
    ref: forwardedRef,
    type,
    className: ['nidec-ui-button', className].filter(Boolean).join(' '),
  }, children);
}

export type NidecProviderProps = Omit<FluentProviderProps,
  'theme' | 'customStyleHooks_unstable' | 'overrides_unstable'> & { theme: Theme };

/** Explicit theme required. The caller owns its approved theme values. */
export function NidecProvider(props: NidecProviderProps) {
  const hostProps = { ...props, 'data-nidec-ui': '' };
  return createElement(FluentProvider, hostProps);
}

/** Icon actions have an explicit accessible name; business meaning stays with the caller. */
export type IconButtonProps = Omit<ButtonProps, 'children' | 'icon' | 'aria-label' | 'aria-labelledby'> & {
  icon: ReactElement;
  'aria-label': string;
  children?: never;
};

export function IconButton({ icon, 'aria-label': label, ...props }: IconButtonProps) {
  if (!label.trim()) throw new Error('IconButton requires a non-empty aria-label.');
  return Button({ ...props, icon, 'aria-label': label, children: '' });
}

export type TableActionIconButtonProps = Omit<IconButtonProps, 'appearance' | 'size' | 'shape'>;

/** Compact secondary action for a Table/DataGrid row; icon meaning stays consumer-owned. */
export function TableActionIconButton({ icon, 'aria-label': label, className, ...props }: TableActionIconButtonProps) {
  return IconButton({
    ...props,
    icon,
    'aria-label': label,
    className: withClass('nidec-ui-table-action-icon-button', className),
    appearance: 'transparent',
    size: 'small',
    shape: 'rounded',
  });
}

const withClass = (base: string, className?: string) => className ? `${base} ${className}` : base;

export type SegmentedControlOption = Readonly<{
  value: string;
  label: string;
  disabled?: boolean;
}>;

export type SegmentedControlProps = Omit<ComponentPropsWithoutRef<'div'>,
  'children' | 'onChange' | 'role'> & {
  'aria-label': string;
  options: readonly SegmentedControlOption[];
  value: string;
  onValueChange: (event: MouseEvent | KeyboardEvent, value: string) => void;
  size?: 'small' | 'medium';
  disabled?: boolean;
};

const segmentedControlName = 'nidec-segmented-control';
const useSegmentedControlStyles = makeStyles({
  item: {
    '&[aria-checked="true"]': {
      backgroundColor: tokens.colorBrandBackground,
      color: tokens.colorNeutralForegroundOnBrand,
      fontWeight: tokens.fontWeightSemibold,
    },
    '&[aria-checked="true"]:hover': {
      backgroundColor: tokens.colorBrandBackgroundHover,
      color: tokens.colorNeutralForegroundOnBrand,
    },
    '&[aria-checked="true"]:active': {
      backgroundColor: tokens.colorBrandBackgroundPressed,
      color: tokens.colorNeutralForegroundOnBrand,
    },
  },
});

/** Controlled, mutually exclusive mode selection backed by Fluent toolbar radio behavior. */
export function SegmentedControl({
  'aria-label': ariaLabel,
  options,
  value,
  onValueChange,
  size = 'medium',
  disabled = false,
  className,
  ...props
}: SegmentedControlProps): ReactElement<FluentToolbarProps> {
  const styles = useSegmentedControlStyles();
  if (!ariaLabel.trim()) throw new Error('SegmentedControl requires a non-empty aria-label.');
  if (options.length < 2) throw new Error('SegmentedControl requires at least two options.');
  if (new Set(options.map(option => option.value)).size !== options.length) throw new Error('SegmentedControl option values must be unique.');
  if (options.some(option => !option.value.trim() || !option.label.trim())) throw new Error('SegmentedControl options require non-empty values and labels.');
  if (!options.some(option => option.value === value)) throw new Error('SegmentedControl value must match an option.');

  return createElement(FluentToolbar, {
    ...props,
    'aria-label': ariaLabel,
    checkedValues: { [segmentedControlName]: [value] },
    className: withClass('nidec-ui-segmented-control', className),
    onCheckedValueChange: (event, data) => {
      const nextValue = data.checkedItems[0];
      if (data.name === segmentedControlName && nextValue !== undefined && nextValue !== value) {
        onValueChange(event, nextValue);
      }
    },
    size,
  }, createElement(FluentToolbarRadioGroup, {
    'aria-label': ariaLabel,
    className: 'nidec-ui-segmented-control__group',
  }, options.map(option => createElement(FluentToolbarRadioButton, {
    appearance: 'subtle',
    className: mergeClasses('nidec-ui-segmented-control__item', styles.item),
    ...((disabled || option.disabled) ? { disabled: true } : {}),
    key: option.value,
    name: segmentedControlName,
    value: option.value,
  }, option.label))));
}

export type CollectionListProps = Omit<ComponentPropsWithoutRef<'ul'>, 'children'> & {
  children?: ReactNode;
  density?: 'compact' | 'comfortable';
};

/** Stable list semantics with Fluent-theme composition; selection stays explicit. */
export function CollectionList({ children, density = 'comfortable', className, ...props }: CollectionListProps) {
  return createElement('ul', { ...props, className: withClass(`nidec-ui-collection-list nidec-ui-collection-list--${density}`, className) }, children);
}

export type CollectionListItemProps = Omit<ComponentPropsWithoutRef<'li'>, 'children'> & {
  primary: ReactNode;
  secondary?: ReactNode;
  selection?: ReactNode;
  leading?: ReactNode;
  metadata?: ReactNode;
  actions?: ReactNode;
};

/** Slot layout only; consumers supply labelled Fluent selection and business actions. */
export function CollectionListItem({ primary, secondary, selection, leading, metadata, actions, className, ...props }: CollectionListItemProps) {
  return createElement('li', { ...props, className: withClass('nidec-ui-collection-list__item', className) },
    selection === undefined && leading === undefined ? null : createElement('span', { className: 'nidec-ui-collection-list__leading' }, selection, leading),
    createElement('span', { className: 'nidec-ui-collection-list__content' },
      createElement('span', { className: 'nidec-ui-collection-list__primary' }, primary),
      secondary === undefined ? null : createElement('span', { className: 'nidec-ui-collection-list__secondary' }, secondary)),
    metadata === undefined ? null : createElement('span', { className: 'nidec-ui-collection-list__metadata' }, metadata),
    actions === undefined ? null : createElement('span', { className: 'nidec-ui-collection-list__actions' }, actions));
}

export type RecordIdentityCellLayoutProps = Omit<FluentTableCellLayoutProps,
  'appearance' | 'children' | 'description'> & {
  primary: ReactNode;
  secondary?: ReactNode;
};

/**
 * Declares the single record identity within a consumer-owned Table/DataGrid row.
 * Navigable identities are supplied as a semantic Fluent Link in the primary slot.
 * The surrounding cell, row, columns and business meaning remain consumer-owned.
 */
export function RecordIdentityCellLayout({ primary, secondary, ...props }: RecordIdentityCellLayoutProps): ReactElement<FluentTableCellLayoutProps> {
  return createElement(FluentTableCellLayout, {
    ...props,
    appearance: 'primary',
    ...(secondary === undefined ? {} : { description: { children: secondary } }),
  }, primary);
}

export type RecordTableHeaderProps = FluentTableHeaderProps;

/** Gives record tables a governed header hierarchy without owning their columns. */
export function RecordTableHeader({ className, ...props }: RecordTableHeaderProps): ReactElement<FluentTableHeaderProps> {
  return createElement(FluentTableHeader, {
    ...props,
    className: withClass('nidec-ui-record-table-header', className),
  });
}

export type RecordDataGridHeaderProps = FluentDataGridHeaderProps;

/** Gives record data grids the same governed header hierarchy. */
export function RecordDataGridHeader({ className, ...props }: RecordDataGridHeaderProps): ReactElement<FluentDataGridHeaderProps> {
  return createElement(FluentDataGridHeader, {
    ...props,
    className: withClass('nidec-ui-record-table-header', className),
  });
}

export type RecordSelectionRegionProps = Omit<ComponentPropsWithoutRef<'section'>, 'children'> & {
  toolbar: ReactNode;
  children: ReactNode;
};

/** Standard spacing between consumer-owned directory tools and a record-selection grid. */
export function RecordSelectionRegion({ toolbar, children, className, ...props }: RecordSelectionRegionProps): ReactElement<ComponentPropsWithoutRef<'section'>> {
  return createElement('section', {
    ...props,
    className: withClass('nidec-ui-record-selection-region', className),
  }, toolbar, children);
}

export type RecordSelectionDataGridProps = Omit<FluentDataGridProps,
  'defaultSelectedItems' | 'focusMode' | 'selectionAppearance' | 'selectionMode' | 'subtleSelection'> & {
  'aria-label': string;
  getRowId: NonNullable<FluentDataGridProps['getRowId']>;
  onSelectionChange: NonNullable<FluentDataGridProps['onSelectionChange']>;
  selectedItems: Set<TableRowId>;
};

type RecordSelectionContextValue = {
  onSelectionChange: NonNullable<FluentDataGridProps['onSelectionChange']>;
};

const RecordSelectionContext = createContext<RecordSelectionContextValue | null>(null);

/** Controlled single-record selection for loading content in the current surface; never navigation. */
export function RecordSelectionDataGrid({
  'aria-label': ariaLabel,
  className,
  getRowId,
  onSelectionChange,
  selectedItems,
  ...props
}: RecordSelectionDataGridProps): ReactElement {
  if (!ariaLabel.trim()) throw new Error('RecordSelectionDataGrid requires a non-empty aria-label.');
  if (selectedItems.size > 1) throw new Error('RecordSelectionDataGrid supports exactly zero or one selected record.');
  return createElement(RecordSelectionContext.Provider, { value: { onSelectionChange } },
    createElement(FluentDataGrid, {
      ...props,
      'aria-label': ariaLabel,
      className: withClass('nidec-ui-record-selection-grid', className),
      focusMode: 'composite',
      getRowId,
      onSelectionChange,
      selectedItems,
      selectionAppearance: 'neutral',
      selectionMode: 'single',
      subtleSelection: false,
    }));
}

export type RecordSelectionDataGridRowProps<TItem = unknown> = Omit<FluentDataGridRowProps<TItem>,
  'appearance' | 'aria-selected' | 'onClick' | 'onKeyDown' | 'onKeyDownCapture' | 'selectionCell' | 'tabIndex'> & {
  recordId: TableRowId;
};

/** Whole-row selection with Enter added to Fluent's pointer and Space behavior. */
export function RecordSelectionDataGridRow<TItem = unknown>({
  className,
  recordId,
  ...props
}: RecordSelectionDataGridRowProps<TItem>): ReactElement {
  return createElement(RecordSelectionContext.Consumer, {
    children: (context: RecordSelectionContextValue | null) => {
      if (!context) throw new Error('RecordSelectionDataGridRow must be rendered inside RecordSelectionDataGrid.');
      const onKeyDownCapture = (event: KeyboardEvent<HTMLElement>) => {
        if (event.key !== 'Enter') return;
        const target = event.target as EventTarget & { closest?: (selector: string) => Element | null };
        const interactiveTarget = target !== event.currentTarget && target.closest?.(
          'a, button, input, select, textarea, [role="button"], [role="checkbox"], [role="link"], [role="menuitem"], [role="switch"]',
        );
        if (interactiveTarget) return;
        event.preventDefault();
        context.onSelectionChange(event, { selectedItems: new Set([recordId]) });
      };
      return createElement(FluentDataGridRow, {
        ...props,
        className: withClass('nidec-ui-record-selection-row', className),
        onKeyDownCapture,
        selectionCell: null,
      } as FluentDataGridRowProps<unknown>);
    },
  });
}

export type CardGalleryProps = Omit<ComponentPropsWithoutRef<'ul'>, 'children'> & {
  children?: ReactNode;
  minimumItemWidth?: 'small' | 'medium' | 'large';
};

/** Responsive collection layout; card content and application actions remain consumer-owned. */
export function CardGallery({ children, minimumItemWidth = 'medium', className, ...props }: CardGalleryProps) {
  return createElement('ul', { ...props, className: withClass(`nidec-ui-card-gallery nidec-ui-card-gallery--${minimumItemWidth}`, className) }, children);
}

export type CardGalleryItemProps = Omit<ComponentPropsWithoutRef<'li'>, 'children'> & {
  children?: ReactNode;
  cardProps?: Omit<FluentCardProps, 'children'>;
};

export function CardGalleryItem({ children, cardProps, className, ...props }: CardGalleryItemProps) {
  const { className: cardClassName, ...remainingCardProps } = cardProps ?? {};
  return createElement('li', { ...props, className: withClass('nidec-ui-card-gallery__item', className) },
    createElement(FluentCard, { ...remainingCardProps, className: withClass('nidec-ui-card-gallery__card', cardClassName) }, children));
}

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
  onStageSelect?: (event: MouseEvent<HTMLButtonElement>, stage: ProcessStageDefinition) => void;
};

export type StageNavigatorProps = Omit<ProcessStageIndicatorProps, 'onStageSelect'> & {
  onStageSelect: (event: MouseEvent<HTMLButtonElement>, stage: ProcessStageDefinition) => void;
};

/** @deprecated Use StageNavigator for navigation or BusinessProcessFlow for read-only lifecycle state. */
export function ProcessStageIndicator({ 'aria-label': ariaLabel, stages, orientation = 'responsive', onStageSelect, className, ...props }: ProcessStageIndicatorProps) {
  if (!ariaLabel.trim()) throw new Error('ProcessStageIndicator requires a non-empty aria-label.');
  if (stages.length === 0) throw new Error('ProcessStageIndicator requires at least one stage.');
  if (new Set(stages.map(stage => stage.id)).size !== stages.length) throw new Error('Process stage IDs must be unique.');
  if (stages.filter(stage => stage.status === 'current').length > 1) throw new Error('Only one process stage may be current.');
  return createElement('ol', { ...props, 'aria-label': ariaLabel, className: withClass(`nidec-ui-process-stage nidec-ui-process-stage--${orientation}`, className) },
    stages.map((stage, index) => {
      const current = stage.status === 'current' ? { 'aria-current': 'step' as const } : {};
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
      return createElement('li', { key: stage.id, className: 'nidec-ui-process-stage__item', 'data-stage-status': stage.status }, stageContent);
    }));
}

/** Interactive navigation between sibling workspaces; it does not represent automatic lifecycle progression. */
export function StageNavigator(props: StageNavigatorProps) {
  return ProcessStageIndicator(props);
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
};

/** Read-only, application-controlled lifecycle presentation with no manual stage-switch API. */
export function BusinessProcessFlow({ 'aria-label': ariaLabel, stages, className, ...props }: BusinessProcessFlowProps) {
  if (!ariaLabel.trim()) throw new Error('BusinessProcessFlow requires a non-empty aria-label.');
  if (stages.length === 0) throw new Error('BusinessProcessFlow requires at least one stage.');
  if (new Set(stages.map(stage => stage.id)).size !== stages.length) throw new Error('Business process stage IDs must be unique.');
  if (stages.filter(stage => stage.status === 'current').length > 1) throw new Error('Only one business process stage may be current.');

  return createElement('section', {
    ...props,
    'aria-label': ariaLabel,
    className: withClass('nidec-ui-business-process-flow', className),
  }, createElement('ol', { className: 'nidec-ui-business-process-flow__track' },
    stages.map((stage, index) => createElement('li', {
      key: stage.id,
      'aria-current': stage.status === 'current' ? 'step' : undefined,
      className: 'nidec-ui-business-process-flow__stage',
      'data-stage-status': stage.status,
    },
    createElement('span', { className: 'nidec-ui-business-process-flow__marker', 'aria-hidden': true }, index + 1),
    createElement('span', { className: 'nidec-ui-business-process-flow__copy' },
      createElement('strong', null, stage.label),
      stage.description === undefined ? null : createElement('small', null, stage.description),
      createElement('span', { className: 'nidec-ui-visually-hidden' }, stage.statusLabel))))));
}

export {
  Input, Field, Dialog, DialogTrigger, DialogSurface, DialogBody,
  DialogTitle, DialogContent, DialogActions,
  Textarea, Select, Checkbox, RadioGroup, Radio, Switch,
  OverlayDrawer, DrawerHeader, DrawerHeaderTitle, DrawerBody, DrawerFooter,
  MessageBar, MessageBarBody, MessageBarTitle, MessageBarActions,
  Text, Body1, Caption1, Subtitle2, Spinner,
  Tooltip, Link, TabList, Tab,
  Menu, MenuTrigger, MenuPopover, MenuList, MenuItem, MenuDivider,
  Combobox, Option, OptionGroup,
  Table, TableHeader, TableBody, TableRow, TableHeaderCell, TableCell,
  TableCellLayout, TableSelectionCell, TableCellActions,
  DataGrid, DataGridHeader, DataGridBody, DataGridRow, DataGridHeaderCell, DataGridCell,
  Card, CardHeader, CardPreview, CardFooter,
  Badge, CounterBadge, PresenceBadge, Skeleton, SkeletonItem, ProgressBar,
  Breadcrumb, BreadcrumbItem, BreadcrumbDivider, BreadcrumbButton,
  Toolbar, ToolbarButton, ToolbarDivider, ToolbarGroup,
  Nav, NavItem, NavCategory, NavCategoryItem, NavSubItem, NavSubItemGroup,
  NavDrawer, NavDrawerHeader, NavDrawerBody, NavDrawerFooter, NavDivider,
  AppItem, AppItemStatic, Hamburger,
  Tree, TreeItem, TreeItemLayout,
  Accordion, AccordionItem, AccordionHeader, AccordionPanel,
  SearchBox, SpinButton, Slider,
  ToggleButton, MenuButton, SplitButton,
  Label, InfoLabel, Divider,
  Avatar, AvatarGroup, AvatarGroupItem, AvatarGroupPopover, Persona,
  Tag, TagGroup,
  Popover, PopoverTrigger, PopoverSurface,
} from '@fluentui/react-components';
export type {
  InputProps, FieldProps, DialogProps, DialogTriggerProps, DialogSurfaceProps,
  DialogBodyProps, DialogTitleProps, DialogContentProps, DialogActionsProps,
  TextareaProps, SelectProps, CheckboxProps, RadioGroupProps, RadioProps, SwitchProps,
  OverlayDrawerProps, DrawerHeaderProps, DrawerHeaderTitleProps, DrawerBodyProps, DrawerFooterProps,
  MessageBarProps, MessageBarBodyProps, MessageBarTitleProps, MessageBarActionsProps,
  TextProps, SpinnerProps,
  TooltipProps, LinkProps, TabListProps, TabProps,
  MenuProps, MenuTriggerProps, MenuPopoverProps, MenuListProps, MenuItemProps, MenuDividerProps,
  ComboboxProps, OptionProps, OptionGroupProps,
  TableProps, TableHeaderProps, TableBodyProps, TableRowProps, TableHeaderCellProps, TableCellProps,
  TableCellLayoutProps, TableSelectionCellProps, TableCellActionsProps,
  DataGridProps, DataGridHeaderProps, DataGridBodyProps, DataGridRowProps, DataGridHeaderCellProps, DataGridCellProps,
  CardProps, CardHeaderProps, CardPreviewProps, CardFooterProps,
  BadgeProps, CounterBadgeProps, PresenceBadgeProps, SkeletonProps, SkeletonItemProps, ProgressBarProps,
  BreadcrumbProps, BreadcrumbItemProps, BreadcrumbDividerProps, BreadcrumbButtonProps,
  ToolbarProps, ToolbarButtonProps, ToolbarDividerProps, ToolbarGroupProps,
  NavProps, NavItemProps, NavCategoryProps, NavCategoryItemProps, NavSubItemProps, NavSubItemGroupProps,
  NavDrawerProps, NavDrawerHeaderProps, NavDrawerBodyProps, NavDrawerFooterProps, NavDividerProps,
  AppItemProps, AppItemStaticProps, HamburgerProps,
  TreeProps, TreeItemProps, TreeItemLayoutProps,
  AccordionProps, AccordionItemProps, AccordionHeaderProps, AccordionPanelProps,
  SearchBoxProps, SpinButtonProps, SliderProps,
  ToggleButtonProps, MenuButtonProps, SplitButtonProps,
  LabelProps, InfoLabelProps, DividerProps,
  AvatarProps, AvatarGroupProps, AvatarGroupItemProps, AvatarGroupPopoverProps, PersonaProps,
  TagProps, TagGroupProps,
  PopoverProps, PopoverTriggerProps, PopoverSurfaceProps,
} from '@fluentui/react-components';
