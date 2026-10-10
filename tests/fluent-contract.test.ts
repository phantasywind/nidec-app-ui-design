import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import * as upstream from '@fluentui/react-components';
import * as shared from '../src/index';
import type { NidecProviderProps } from '../src/index';

const compositions = ['Input', 'Field', 'Dialog', 'DialogTrigger', 'DialogSurface',
  'DialogBody', 'DialogTitle', 'DialogContent', 'DialogActions',
  'Textarea', 'Select', 'Checkbox', 'RadioGroup', 'Radio', 'Switch',
  'OverlayDrawer', 'DrawerHeader', 'DrawerHeaderTitle', 'DrawerBody', 'DrawerFooter',
  'MessageBar', 'MessageBarBody', 'MessageBarTitle', 'MessageBarActions',
  'Text', 'Body1', 'Caption1', 'Subtitle2', 'Spinner',
  'Tooltip', 'Link', 'TabList', 'Tab', 'Menu', 'MenuTrigger', 'MenuPopover', 'MenuList', 'MenuItem', 'MenuDivider',
  'Dropdown', 'Combobox', 'OptionGroup'] as const;
const platformSurfaces = [
  'Table', 'TableHeader', 'TableBody', 'TableRow', 'TableHeaderCell', 'TableCell',
  'TableCellLayout', 'TableSelectionCell', 'TableCellActions',
  'DataGrid', 'DataGridHeader', 'DataGridBody', 'DataGridRow', 'DataGridHeaderCell', 'DataGridCell',
  'Card', 'CardHeader', 'CardPreview', 'CardFooter',
  'Badge', 'CounterBadge', 'PresenceBadge', 'Skeleton', 'SkeletonItem', 'ProgressBar',
  'Breadcrumb', 'BreadcrumbItem', 'BreadcrumbDivider', 'BreadcrumbButton',
  'Toolbar', 'ToolbarButton', 'ToolbarDivider', 'ToolbarGroup',
  'Nav', 'NavItem', 'NavCategory', 'NavCategoryItem', 'NavSubItem', 'NavSubItemGroup',
  'NavDrawer', 'NavDrawerHeader', 'NavDrawerBody', 'NavDrawerFooter', 'NavDivider',
  'AppItem', 'AppItemStatic', 'Hamburger',
  'Tree', 'TreeItem', 'TreeItemLayout', 'Accordion', 'AccordionItem', 'AccordionHeader', 'AccordionPanel',
] as const;
const commonContentControls = [
  'SearchBox', 'SpinButton', 'Slider',
  'ToggleButton', 'MenuButton', 'SplitButton',
  'Label', 'InfoLabel', 'Divider',
  'Avatar', 'AvatarGroup', 'AvatarGroupItem', 'AvatarGroupPopover', 'Persona',
  'Tag', 'TagGroup', 'Popover', 'PopoverTrigger', 'PopoverSurface',
] as const;
const compositePatterns = [
  'CollectionList', 'CollectionListItem', 'CardGallery', 'CardGalleryItem', 'ActionableCardGalleryItem',
  'ProcessStageIndicator', 'StageNavigator', 'BusinessProcessFlow',
  'RecordIdentityCellLayout', 'RecordTableHeader', 'RecordDataGridHeader', 'TableActionIconButton',
  'EditableGrid', 'EditableGridRowActionGroup', 'GroupedTableSectionRow',
  'RecordSelectionRegion', 'RecordSelectionDataGrid', 'RecordSelectionDataGridRow', 'SegmentedControl', 'InlineModeTabs', 'ViewModeToggle',
  'PageHeader', 'RecordManagementWorkspace', 'WorkspaceSection',
] as const;

describe('Fluent public boundary', () => {
  it('exports exactly the approved API and preserves upstream composition identity', () => {
    expect(Object.keys(shared).sort()).toEqual(['Button', 'IconButton', 'Option', 'MultiSelectDropdown', 'NidecProvider', 'nidecLightTheme', ...compositions, ...platformSurfaces, ...commonContentControls, ...compositePatterns].sort());
    for (const name of [...compositions, ...platformSurfaces, ...commonContentControls]) expect(shared[name]).toBe(upstream[name]);
  });
  it('forwards an explicit theme and establishes a host', () => {
    const element = shared.NidecProvider({theme:upstream.webLightTheme, id:'host', children:'Fixture'});
    expect(element.type).toBe(upstream.FluentProvider);
    expect(element.props.theme).toBe(upstream.webLightTheme);
    const html = renderToStaticMarkup(createElement(shared.NidecProvider, {
      theme: upstream.webLightTheme, id:'host', children:'Fixture',
    }));
    expect(html).toContain('data-nidec-ui=""');
    expect(html).toContain('id="host"');
  });
});
// @ts-expect-error No implicit production theme.
const missingTheme: NidecProviderProps = { children:'Fixture' };
// @ts-expect-error No null theme.
const nullTheme: NidecProviderProps = { theme:null };
// @ts-expect-error Unstable upstream styling is not public Nidec API.
const unstable: NidecProviderProps = { theme:upstream.webLightTheme, overrides_unstable:{} };
// @ts-expect-error Unstable style hooks are not public Nidec API.
const hooks: NidecProviderProps = { theme:upstream.webLightTheme, customStyleHooks_unstable:{} };
void [missingTheme, nullTheme, unstable, hooks];
