import { createElement } from 'react';
import type { ComponentPropsWithRef, ReactElement } from 'react';
import { Button as FluentButton, FluentProvider, createLightTheme } from '@fluentui/react-components';
import type { BrandVariants, ButtonProps as FluentButtonProps, FluentProviderProps, Theme } from '@fluentui/react-components';
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
  colorNeutralForeground3: palette.textMuted,
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
