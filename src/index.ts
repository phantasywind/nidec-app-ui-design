// Public root entry. Each governed component lives in src/internal/components;
// this file is the complete, explicit list of what the package exposes.
export { nidecLightTheme } from './internal/components/theme';
export { NidecProvider } from './internal/components/provider';
export type { NidecProviderProps } from './internal/components/provider';
export { Button, IconButton, TableActionIconButton } from './internal/components/button';
export type { ButtonProps, IconButtonProps, TableActionIconButtonProps } from './internal/components/button';
export { Option } from './internal/components/option';
export { MultiSelectDropdown } from './internal/components/multi-select-dropdown';
export type { MultiSelectDropdownOption, MultiSelectDropdownProps } from './internal/components/multi-select-dropdown';
export { GroupedTableSectionRow } from './internal/components/grouped-table';
export type { GroupedTableSectionRowProps } from './internal/components/grouped-table';
export { EditableGrid, EditableGridRowActionGroup } from './internal/components/editable-grid';
export type { EditableGridProps, EditableGridRowActionGroupProps } from './internal/components/editable-grid';
export { LiteEditableGrid } from './internal/components/lite-editable-grid';
export type {
  LiteEditableGridProps, LiteEditableGridColumn, LiteEditableGridEditor, LiteEditableGridOption, LiteEditableGridCellChange,
  LiteEditableGridGroup, LiteEditableGridRowHeight,
} from './internal/components/lite-editable-grid';
export { LiteRowEditGrid } from './internal/components/lite-row-edit-grid';
export type { LiteRowEditGridProps, LiteRowEditGridRowChange } from './internal/components/lite-row-edit-grid';
export { ViewModeToggle } from './internal/components/view-mode-toggle';
export type { ViewMode, ViewModeToggleProps } from './internal/components/view-mode-toggle';
export { SegmentedControl } from './internal/components/segmented-control';
export type { SegmentedControlOption, SegmentedControlProps } from './internal/components/segmented-control';
export { InlineModeTabs } from './internal/components/inline-mode-tabs';
export type { InlineModeTabOption, InlineModeTabsProps } from './internal/components/inline-mode-tabs';
export { PageHeader, RecordManagementWorkspace, WorkspaceSection, WorkspaceStack } from './internal/components/workspace';
export type { PageHeaderProps, RecordManagementWorkspaceProps, WorkspaceSectionProps, WorkspaceStackProps } from './internal/components/workspace';
export { SingleSelectDropdown } from './internal/components/single-select-dropdown';
export type {
  SingleSelectDropdownOption, SingleSelectDropdownProps, SingleSelectDropdownSelectData,
} from './internal/components/single-select-dropdown';
export { Pagination } from './internal/components/pagination';
export type { PaginationProps } from './internal/components/pagination';
export { FactList } from './internal/components/fact-list';
export type { FactListItem, FactListProps } from './internal/components/fact-list';
export { FormDrawer } from './internal/components/form-drawer';
export type { FormDrawerProps } from './internal/components/form-drawer';
export { SectionNavigation } from './internal/components/section-navigation';
export type { SectionNavigationItem, SectionNavigationProps } from './internal/components/section-navigation';
export { StepStatusIcon } from './internal/components/step-status';
export type { StepStatus, StepStatusIconProps } from './internal/components/step-status';
export { TableScrollRegion, numericColumnClassName } from './internal/components/table-scroll-region';
export type { TableScrollRegionProps } from './internal/components/table-scroll-region';
export { TruncatedText, MatrixCellButton } from './internal/components/table-cells';
export { RecordLink, CountBadge, ActiveBadge, RowEndStatus, EmptyState, MoreActionsMenu } from './internal/components/record-patterns';
export type {
  RecordLinkProps, CountBadgeProps, ActiveBadgeProps, RowEndStatusProps, EmptyStateProps, MoreActionsItem, MoreActionsMenuProps,
} from './internal/components/record-patterns';
export { BusinessNumberInput } from './internal/components/number-input';
export type { BusinessNumberInputProps, BusinessNumberInvalidInput } from './internal/components/number-input';
export { FormGrid, FormGridItem } from './internal/components/form-grid';
export type { FormGridProps, FormGridItemProps } from './internal/components/form-grid';
export { ChangeHistoryTable } from './internal/components/change-history';
export type { ChangeHistoryTableProps, ChangeHistoryEntry, ChangeHistoryFieldChange } from './internal/components/change-history';
export { UnsavedChangesProvider, useUnsavedChanges, useConfirmDiscard, StickySaveBar } from './internal/components/unsaved-changes';
export type { UnsavedChangesProviderProps, StickySaveBarProps } from './internal/components/unsaved-changes';
export type { TruncatedTextProps, MatrixCellButtonProps } from './internal/components/table-cells';
export { CollectionList, CollectionListItem } from './internal/components/collection-list';
export type { CollectionListProps, CollectionListItemProps } from './internal/components/collection-list';
export { RecordIdentityCellLayout, RecordTableHeader, RecordDataGridHeader } from './internal/components/record-table';
export type { RecordIdentityCellLayoutProps, RecordTableHeaderProps, RecordDataGridHeaderProps } from './internal/components/record-table';
export { RecordSelectionRegion, RecordSelectionDataGrid, RecordSelectionDataGridRow } from './internal/components/record-selection';
export type {
  RecordSelectionRegionProps, RecordSelectionDataGridProps, RecordSelectionDataGridRowProps,
} from './internal/components/record-selection';
export { CardGallery, CardGalleryItem, ActionableCardGalleryItem } from './internal/components/card-gallery';
export type { CardGalleryProps, CardGalleryItemProps, ActionableCardGalleryItemProps } from './internal/components/card-gallery';
export { ProcessStageIndicator, StageNavigator, BusinessProcessFlow, BusinessProcessStageDetail } from './internal/components/process-stage';
export type {
  ProcessStageStatus, ProcessStageDefinition, ProcessStageIndicatorProps, StageNavigatorProps,
  BusinessProcessStageDefinition, BusinessProcessStageStatus, BusinessProcessFlowProps, BusinessProcessStageCheck, BusinessProcessStageDetailProps,
} from './internal/components/process-stage';

export {
  Input, Field, Dialog, DialogTrigger, DialogSurface, DialogBody,
  DialogTitle, DialogContent, DialogActions,
  Textarea, Select, Checkbox, RadioGroup, Radio, Switch,
  OverlayDrawer, DrawerHeader, DrawerHeaderTitle, DrawerBody, DrawerFooter,
  MessageBar, MessageBarBody, MessageBarTitle, MessageBarActions,
  Text, Body1, Caption1, Subtitle2, Spinner,
  Tooltip, Link, TabList, Tab,
  Menu, MenuTrigger, MenuPopover, MenuList, MenuItem, MenuDivider,
  Dropdown, Combobox, OptionGroup,
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
  DropdownProps, ComboboxProps, OptionProps, OptionGroupProps,
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
