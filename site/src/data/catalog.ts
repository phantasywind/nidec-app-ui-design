import type { ComponentType } from 'react';
import type { PropRow } from '../components/DocPrimitives';
import { ButtonDemo, IconActionsDemo, ModesDemo } from '../demos/ActionsAndModesDemos';
import {
  ChoicesDemo,
  DatePickerDemo,
  NumbersDemo,
  SelectsDemo,
  TextFieldsDemo,
  UnsavedChangesDemo,
} from '../demos/FormControlsDemos';
import {
  FormDrawerDemo,
  HintsPopoversDemo,
  StatusFeedbackDemo,
} from '../demos/FeedbackAndOverlaysDemos';
import {
  ChangeHistoryDemo,
  DataTableDemo,
  EditableGridGroupedDemo,
  LiteEditableGridDemo,
  LiteRowEditGridDemo,
  RecordSelectionDemo,
} from '../demos/TablesAndGridsDemos';
import {
  AppShellDemo,
  BusinessProcessFlowDemo,
  CollectionsCardsDemo,
  StageNavigatorDemo,
  WorkspaceStructureDemo,
} from '../demos/LayoutsAndWorkflowDemos';
import {
  AuthenticationExample,
  CompleteFormExample,
  DirectoryWorkspaceExample,
  GovernanceExample,
  MasterDataExample,
  RecordWorkspaceExample,
} from '../demos/WorkspaceExamples';

export type NavGroupId =
  | 'Start here'
  | 'Actions & Modes'
  | 'Form Controls'
  | 'Tables & Grids'
  | 'Feedback & Overlays'
  | 'Layouts & Navigation'
  | 'Stages & Workflows'
  | 'Workspace Examples';

export type NavItemMeta = Readonly<{
  route: string;
  group: NavGroupId;
  title: string;
  keywords: string;
}>;

export type ComponentSpecPage = Readonly<{
  route: string;
  group: NavGroupId;
  title: string;
  subtitle: string;
  keywords: string;
  subpath: '' | '/layouts' | '/date-picker';
  symbols: readonly string[];
  Demo: ComponentType;
  code: string;
  canvasBackground?: boolean;
  dos: readonly string[];
  donts: readonly string[];
  ownership: string;
  propsList: readonly PropRow[];
}>;

export type ExampleSpecPage = Readonly<{
  route: string;
  group: 'Workspace Examples';
  title: string;
  subtitle: string;
  keywords: string;
  symbols: readonly string[];
  subpath: '' | '/layouts';
  Demo: ComponentType;
  summaryPoints: readonly string[];
}>;

export const FOUNDATION_NAV: readonly NavItemMeta[] = [
  { route: '', group: 'Start here', title: 'Overview', keywords: 'home overview version changelog summary' },
  { route: 'install', group: 'Start here', title: 'Install & Usage Guide', keywords: 'npm install npmrc github packages setup adoption migration rollback' },
  { route: 'tokens', group: 'Start here', title: 'Design Tokens', keywords: 'color palette hex css variables contrast typography spacing radius theme' },
  { route: 'archetypes', group: 'Start here', title: 'Page Archetypes', keywords: 'page selection layout template directory form governance master data' },
];

export const COMPONENT_PAGES: readonly ComponentSpecPage[] = [
  {
    route: 'components/button',
    group: 'Actions & Modes',
    title: 'Button',
    subtitle: 'Text-only native button governed to three appearances: primary, attention, and secondary.',
    keywords: 'button primary attention amber secondary disabledReason busy submit',
    subpath: '',
    symbols: ['Button'],
    Demo: ButtonDemo,
    code: `<Button appearance="primary" onClick={onSave}>Submit</Button>
<Button appearance="attention" onClick={onReturn}>Return</Button>
<Button onClick={onExport}>Export</Button>
<Button disabled disabledReason="Complete required fields first">Approve</Button>`,
    dos: [
      'Use primary to advance the process, edit properties, or open a creation form (at most one primary per action group).',
      'Use attention (amber #e08a00) for commands users must notice before running: Start change, Return, Send back.',
      'Use secondary (default) for every other command such as Cancel, Export, or Refresh.',
      'Disable unavailable commands instead of hiding them, and explain why with disabledReason.',
      'Keep buttons content-sized inside a wrapping flex row (8px gap); only sign-in submit fills width.',
    ],
    donts: [
      'Never pass outline, subtle, or transparent appearances — they were removed in 0.3.0.',
      'Never import ToggleButton, MenuButton, or SplitButton — use MoreActionsMenu or SegmentedControl.',
      'Never use red danger buttons or place navigation links inside Button (use Link for navigation).',
      'Never layer legacy CSS skins or force width: 100% / flex: 1 across ordinary buttons.',
    ],
    ownership: 'The application owns click handlers, busy/duplicate-submit guards, permissions, and exact command wording.',
    propsList: [
      { name: 'children', type: 'string', description: 'Plain text verb label (sentence case).' },
      { name: 'appearance', type: "'primary' | 'attention' | 'secondary'", defaultValue: "'secondary'", description: 'Visual hierarchy role (three governed types only).' },
      { name: 'size', type: "'small' | 'medium' | 'large'", defaultValue: "'medium'", description: 'Fluent control size; use small in dense bars.' },
      { name: 'type', type: "'button' | 'submit' | 'reset'", defaultValue: "'button'", description: 'Defaults to native button so forms are not accidentally submitted.' },
      { name: 'disabledReason', type: 'string', description: 'Explanation shown when disabled; keeps the button keyboard-focusable so assistive tech can read it.' },
      { name: 'disabledReasonDisplay', type: "'tooltip' | 'inline'", defaultValue: "'tooltip'", description: 'Renders disabledReason in a Tooltip or inline caption below key actions.' },
    ],
  },
  {
    route: 'components/icon-actions',
    group: 'Actions & Modes',
    title: 'Icon Actions & Menus',
    subtitle: 'IconButton, TableActionIconButton, MoreActionsMenu, and Menu for compact toolbar, row, and overflow commands.',
    keywords: 'IconButton TableActionIconButton MoreActionsMenu Menu row actions overflow',
    subpath: '',
    symbols: ['IconButton', 'TableActionIconButton', 'MoreActionsMenu', 'Menu'],
    Demo: IconActionsDemo,
    code: `<Tooltip content="Edit record" relationship="description">
  <TableActionIconButton aria-label="Edit record" icon={<EditRegular />} onClick={onEdit} />
</Tooltip>

<MoreActionsMenu
  items={[
    { id: 'dup', label: 'Duplicate', onClick: onDuplicate },
    { id: 'arch', label: 'Archive', disabled: true, disabledReason: 'Record is locked', onClick: () => {} },
  ]}
/>`,
    dos: [
      'Use TableActionIconButton inside TableCellActions visible for direct row actions (fixed 24x24px small transparent target).',
      'Always pair every icon-only button with a non-empty aria-label and a matching Tooltip.',
      'Group low-frequency or destructive commands inside MoreActionsMenu and pass disabledReason on disabled items.',
    ],
    donts: [
      'Do not use text-labelled Button for direct table row icons.',
      'Do not hide row actions until pointer hover — always pass visible to TableCellActions.',
      'Do not use Menu as a substitute for mutually exclusive form selection (use SingleSelectDropdown or RadioGroup).',
    ],
    ownership: 'The application provides icons (from @fluentui/react-icons), authorization, confirmation dialogs, and action handlers.',
    propsList: [
      { name: 'icon', type: 'ReactElement', description: 'Icon element for IconButton / TableActionIconButton.' },
      { name: 'aria-label', type: 'string', description: 'Required accessible label matching the Tooltip wording.' },
      { name: 'appearance (IconButton)', type: "'primary' | 'secondary'", defaultValue: "'secondary'", description: 'Icon-only commands never use attention appearance.' },
      { name: 'items (MoreActionsMenu)', type: 'readonly MoreActionsItem[]', description: 'Overflow menu entries with optional disabled and disabledReason.' },
    ],
  },
  {
    route: 'components/modes',
    group: 'Actions & Modes',
    title: 'Mode & View Switches',
    subtitle: 'SegmentedControl, InlineModeTabs, and ViewModeToggle for immediate compact mode selection.',
    keywords: 'SegmentedControl InlineModeTabs ViewModeToggle toggle switch list card',
    subpath: '',
    symbols: ['SegmentedControl', 'InlineModeTabs', 'ViewModeToggle'],
    Demo: ModesDemo,
    code: `<SegmentedControl
  aria-label="Change type"
  value={mode}
  onValueChange={(_, v) => setMode(v)}
  options={[{ value: 'all', label: 'All' }, { value: 'commercial', label: 'Commercial' }]}
/>

<ViewModeToggle
  aria-label="View mode"
  value={viewMode}
  onValueChange={(_, v) => setViewMode(v)}
  listIcon={<TextBulletListLtrRegular />}
  cardIcon={<GridRegular />}
/>`,
    dos: [
      'Use SegmentedControl for 2+ mutually exclusive peer modes with immediate effect (default small 24px; use "all" instead of empty string).',
      'Use InlineModeTabs (20px pill) strictly for repeated inline editor input-source switches tied to an adjacent tabpanel.',
      'Use ViewModeToggle (two 32px icon buttons) strictly for List/Table vs Card/Gallery switching, preserving query and page.',
    ],
    donts: [
      'Do not use SegmentedControl or InlineModeTabs for page navigation, workflow steps, boolean settings, or long radio descriptions.',
      'Do not pass an empty string "" as a SegmentedControl option value (use value={null} when unselected).',
      'Do not restyle segments with raw colors or legacy selected-button skins.',
    ],
    ownership: 'The application owns option lists, controlled values, inactive-mode draft preservation, and business effects.',
    propsList: [
      { name: 'aria-label', type: 'string', description: 'Required accessible group label across all three controls.' },
      { name: 'options', type: 'readonly SegmentedControlOption[] | InlineModeTabOption[]', description: 'At least two unique options; InlineModeTabs also requires tabId and panelId.' },
      { name: 'value', type: 'string | null (or ViewMode)', description: 'Controlled active option.' },
      { name: 'onValueChange', type: '(event, value) => void', description: 'Selection callback.' },
      { name: 'size (SegmentedControl)', type: "'small' | 'medium'", defaultValue: "'small'", description: 'Small (24px) by default; medium retains 32px.' },
    ],
  },
  {
    route: 'components/text-fields',
    group: 'Form Controls',
    title: 'Text Inputs & FormGrid',
    subtitle: 'Field, Input, Textarea, FormGrid, and FormGridItem for structured, accessible form entry.',
    keywords: 'Input Textarea Field FormGrid FormGridItem validation form',
    subpath: '',
    symbols: ['Field', 'Input', 'Textarea', 'FormGrid', 'FormGridItem'],
    Demo: TextFieldsDemo,
    code: `<FormGrid columns={2}>
  <Field label="Item name" required validationState={error ? 'error' : undefined} validationMessage={error}>
    <Input value={name} onChange={(_, d) => setName(d.value)} />
  </Field>
  <FormGridItem wide>
    <Field label="Notes"><Textarea rows={3} /></Field>
  </FormGridItem>
</FormGrid>`,
    dos: [
      'Always place labels, required indicators, hints, and error messages inside Field.',
      'Use FormGrid to keep peer fields aligned at uniform width (default 20rem) and responsive across narrow viewports.',
      'Use native readOnly for copyable read-only values instead of disabled.',
    ],
    donts: [
      'Never compress Textarea height to 24px (keep Fluent default 40px or >=28px minimum to avoid clipped scrollbars).',
      'Never use placeholders as a substitute for visible Field labels.',
      'Never use Input type="number" for business numbers — use BusinessNumberInput.',
    ],
    ownership: 'The application owns field state, validation rules, submission handling, and dirty tracking.',
    propsList: [
      { name: 'columns (FormGrid)', type: '1 | 2 | 3', defaultValue: '1', description: 'Fields per row at wide widths; wraps automatically on narrow viewports.' },
      { name: 'fieldWidth (FormGrid)', type: 'string', defaultValue: "'20rem'", description: 'Uniform column width for aligned fields.' },
      { name: 'wide (FormGridItem)', type: 'boolean', defaultValue: 'false', description: 'Spans the full grid width for multi-line notes.' },
      { name: 'validationState / validationMessage (Field)', type: "'error' | 'warning' | 'success' / ReactNode", description: 'Inline field validation feedback.' },
    ],
  },
  {
    route: 'components/selects',
    group: 'Form Controls',
    title: 'Dropdowns & Selection',
    subtitle: 'SingleSelectDropdown, MultiSelectDropdown, Dropdown, Combobox, and Option with governed popup width and hover.',
    keywords: 'SingleSelectDropdown MultiSelectDropdown Dropdown Combobox Option searchThreshold',
    subpath: '',
    symbols: ['SingleSelectDropdown', 'MultiSelectDropdown', 'Dropdown', 'Combobox', 'Option'],
    Demo: SelectsDemo,
    code: `<SingleSelectDropdown
  options={plants}
  selectedOption={plant}
  onOptionSelect={(_, d) => setPlant(d.optionValue)}
/>

<MultiSelectDropdown
  options={regions}
  selectedOptions={selected}
  onOptionSelect={(_, d) => setSelected(d.selectedOptions)}
  tagPlacement="below"
  searchable
/>`,
    dos: [
      'Prefer SingleSelectDropdown for single-choice fields: it automatically upgrades to a searchable Combobox at 12+ options.',
      'Use MultiSelectDropdown with tagPlacement="below" and searchable when users pick many tags without stretching the trigger.',
      'Always use the package Option component so portal hover stays neutral grey and selection stays brand-soft.',
    ],
    donts: [
      'Do not add local min-width or scrollIntoView workarounds — v0.3.0 handles 100%-height page scroll and ellipsis truncation natively.',
      'Do not pass empty strings as option values.',
    ],
    ownership: 'The application supplies option arrays, filtering/async loading if remote, and selected state.',
    propsList: [
      { name: 'options', type: 'readonly { value: string; text: string; disabled?: boolean }[]', description: 'Governed option list.' },
      { name: 'searchThreshold (SingleSelectDropdown)', type: 'number', defaultValue: '12', description: 'Switches to type-to-filter Combobox at or above this option count.' },
      { name: 'tagPlacement (MultiSelectDropdown)', type: "'trigger' | 'below'", defaultValue: "'trigger'", description: 'Renders selected tags inside the trigger or wrapped below with Clear all.' },
      { name: 'searchable (MultiSelectDropdown)', type: 'boolean', defaultValue: 'false', description: 'Enables filter typing when tagPlacement="below".' },
      { name: 'maxVisibleTags (MultiSelectDropdown)', type: 'number', description: 'Collapses excess trigger tags into a count chip.' },
    ],
  },
  {
    route: 'components/date-picker',
    group: 'Form Controls',
    title: 'BusinessDatePicker & DatePicker',
    subtitle: 'Timezone-free calendar date selection isolated in the /date-picker subpath.',
    keywords: 'BusinessDatePicker DatePicker calendar yyyy-MM-dd minDate maxDate',
    subpath: '/date-picker',
    symbols: ['BusinessDatePicker', 'DatePicker', 'formatBusinessDate', 'parseBusinessDate'],
    Demo: DatePickerDemo,
    code: `import { BusinessDatePicker } from '@phantasywind/nidec-app-ui-design/date-picker';

<BusinessDatePicker
  value={date}
  onValueChange={setDate}
  onInvalidInput={(info) => setError(info.reason)}
  minDate={new Date(2026, 0, 1)}
/>`,
    dos: [
      'Use BusinessDatePicker for calendar dates without timezones: value is yyyy-MM-dd, display defaults to "22 Oct 2026", weeks start Monday.',
      'Handle onInvalidInput to display typed invalid or out-of-bounds text errors in the wrapping Field.',
      'Install @fluentui/react-datepicker-compat@0.6.39 only in applications that import /date-picker.',
    ],
    donts: [
      'Do not convert business calendar dates through UTC ISO timestamps (prevents off-by-one day shifts across timezones).',
      'Do not ignore onInvalidInput when minDate/maxDate is set — otherwise rejected typed text can appear silently saved.',
    ],
    ownership: 'The application owns date semantics, allowed min/max bounds, holiday/business calendars, and localization overrides.',
    propsList: [
      { name: 'value', type: 'string | null', description: 'Timezone-free yyyy-MM-dd date string or null.' },
      { name: 'onValueChange', type: '(value: string | null) => void', description: 'Called when a valid date is selected or cleared.' },
      { name: 'onInvalidInput', type: '(input: BusinessDateInvalidInput) => void', description: 'Reports invalid-input or out-of-bounds typed text.' },
      { name: 'minDate / maxDate', type: 'Date', description: 'Optional inclusive calendar boundaries.' },
    ],
  },
  {
    route: 'components/numbers',
    group: 'Form Controls',
    title: 'Numbers & Currency',
    subtitle: 'BusinessNumberInput, formatCurrency, SpinButton, and Slider for governed numeric entry and formatting.',
    keywords: 'BusinessNumberInput formatCurrency SpinButton Slider currency decimals unit',
    subpath: '',
    symbols: ['BusinessNumberInput', 'formatCurrency', 'SpinButton', 'Slider'],
    Demo: NumbersDemo,
    code: `<BusinessNumberInput
  value={weight}
  onValueChange={setWeight}
  unit="kg"
  min={0}
  max={5000}
  decimals={2}
/>

// Governed currency formatting: "$ 100.00", "¥ 1,250.50", "JPY 1,200"
const display = formatCurrency(amount, 'USD');`,
    dos: [
      'Use BusinessNumberInput for weights, amounts, dimensions, and nullable decimals with unit suffixes and thousands separators.',
      'Use formatCurrency(amount, currency) in tables and read-only fields: symbol + one space for USD/CNY, ISO code for all other currencies, end-aligned.',
      'Use SpinButton for small integer steppers and Slider for bounded estimates.',
    ],
    donts: [
      'Do not use native <Input type="number"> for business metrics.',
      'Do not mix symbols for currencies sharing $ or ¥ (HKD, JPY must show ISO codes).',
    ],
    ownership: 'The application owns units, rounding rules, min/max business limits, and currency codes.',
    propsList: [
      { name: 'value (BusinessNumberInput)', type: 'number | null', description: 'Controlled numeric value or null when empty.' },
      { name: 'onValueChange', type: '(value: number | null) => void', description: 'Called only for accepted numbers or null.' },
      { name: 'decimals / fixedDecimals', type: 'number (2) / boolean (false)', description: 'Maximum decimal places and optional fixed trailing zeros when blurred.' },
      { name: 'min / max / unit', type: 'number / number / string', description: 'Bounds and inline trailing unit label.' },
      { name: 'onInvalidInput', type: '(input: BusinessNumberInvalidInput) => void', description: 'Notifies invalid-input or out-of-range text.' },
    ],
  },
  {
    route: 'components/choices',
    group: 'Form Controls',
    title: 'Choices & Switches',
    subtitle: 'RadioGroup, Checkbox, and Switch for mutually exclusive, batch, and immediate binary selections.',
    keywords: 'RadioGroup Radio Checkbox Switch mixed indeterminate',
    subpath: '',
    symbols: ['RadioGroup', 'Radio', 'Checkbox', 'Switch'],
    Demo: ChoicesDemo,
    code: `<RadioGroup value={priority} onChange={(_, d) => setPriority(d.value)}>
  <Radio value="standard" label="Standard" />
  <Radio value="expedited" label="Expedited" />
</RadioGroup>
<Checkbox checked="mixed" label="Partial selection" />
<Switch checked={enabled} onChange={(_, d) => setEnabled(d.checked)} label="Enabled" />`,
    dos: [
      'Use RadioGroup when options are mutually exclusive and few enough to compare side-by-side.',
      'Use Checkbox (including checked="mixed") for multi-selection and parent/child batch selection.',
      'Use Switch for settings that take effect immediately without a separate submit.',
    ],
    donts: [
      'Do not use Switch inside a form that requires clicking Save unless the state meaning is unmistakable.',
      'Do not replace RadioGroup options carrying long descriptions with SegmentedControl.',
    ],
    ownership: 'The application owns option values, selection state, and persistence timing.',
    propsList: [
      { name: 'value / onChange (RadioGroup)', type: 'string / (ev, data) => void', description: 'Controlled exclusive value.' },
      { name: 'checked (Checkbox)', type: "boolean | 'mixed'", description: 'Supports indeterminate parent selection state.' },
      { name: 'checked (Switch)', type: 'boolean', description: 'Immediate binary toggle state.' },
    ],
  },
  {
    route: 'components/unsaved-changes',
    group: 'Form Controls',
    title: 'Unsaved Changes & StickySaveBar',
    subtitle: 'UnsavedChangesProvider, useUnsavedChanges, useConfirmDiscard, and StickySaveBar for dirty-form protection.',
    keywords: 'UnsavedChangesProvider useUnsavedChanges useConfirmDiscard StickySaveBar dirty',
    subpath: '',
    symbols: ['UnsavedChangesProvider', 'useUnsavedChanges', 'useConfirmDiscard', 'StickySaveBar'],
    Demo: UnsavedChangesDemo,
    code: `<UnsavedChangesProvider>
  <EditorForm />
</UnsavedChangesProvider>

// Inside EditorForm:
useUnsavedChanges(dirty);
const { confirmDiscard } = useConfirmDiscard();
{dirty && (
  <StickySaveBar
    message="Unsaved changes"
    actions={<><Button onClick={onDiscard}>Discard</Button><Button appearance="primary" onClick={onSave}>Save</Button></>}
  />
)}`,
    dos: [
      'Wrap dirty-tracked views in UnsavedChangesProvider to get consistent beforeunload protection and confirmation dialog UX.',
      'Place Discard before the primary Save action inside StickySaveBar.',
    ],
    donts: [
      'Do not implement ad-hoc window.confirm dialogs or conflicting beforeunload listeners per page.',
      'Do not silently discard edits when switching records or closing a FormDrawer.',
    ],
    ownership: 'The application computes dirty state, invokes confirmDiscard() before route/record changes, and executes actual saves.',
    propsList: [
      { name: 'title / message (UnsavedChangesProvider)', type: 'string / string', description: 'Optional customized discard dialog copy.' },
      { name: 'useUnsavedChanges(dirty)', type: '(dirty: boolean) => void', description: 'Registers dirty status with the nearest provider and browser unload guard.' },
      { name: 'useConfirmDiscard()', type: '() => { confirmDiscard: () => Promise<boolean>; hasUnsavedChanges: boolean }', description: 'Returns confirmDiscard() and aggregate dirty status.' },
      { name: 'message / actions (StickySaveBar)', type: 'ReactNode / ReactNode', description: 'Sticky bottom bar summary and action buttons.' },
    ],
  },
  {
    route: 'components/lite-editable-grid',
    group: 'Tables & Grids',
    title: 'LiteEditableGrid',
    subtitle: 'Preferred lightweight cell-editable grid with auto or fixed virtualized row heights and optional 2-level grouping.',
    keywords: 'LiteEditableGrid cell edit bom auto rowHeight virtualized grouping formatCurrency',
    subpath: '',
    symbols: ['LiteEditableGrid', 'EditableGrid', 'formatCurrency'],
    Demo: LiteEditableGridDemo,
    code: `<EditableGrid aria-label="Line editor" density="compact">
  <LiteEditableGrid
    aria-label="Lines"
    columns={columns}
    rows={rows}
    getRowId={(r) => r.id}
    rowHeight="auto"
    height={420}
    getRowGroup={(r) => [r.section]}
    onCellChange={handleCellChange}
  />
</EditableGrid>`,
    dos: [
      'Prefer LiteEditableGrid for BOM templates, project line lists, and rows with long wrapped descriptions, tags, or section groups.',
      'Keep default rowHeight="auto" for <= ~300 rows; pass explicit rowHeight={32 | 40 | 48} for virtual scrolling thousands of rows.',
      'Pass format: (v) => formatCurrency(v, "USD") so resting cells show formatted amounts while editors edit plain numbers.',
    ],
    donts: [
      'Do not omit rowHeight on multi-thousand-row grids (0.3.0 breaking change: default is now "auto" without virtualization).',
      'Do not add per-row Save/Cancel buttons — edits commit automatically on cell leave and cancel on Escape.',
      'Do not use Fluent Table with embedded Fluent inputs for high-density editable grids.',
    ],
    ownership: 'The application owns rows, column schemas, validation functions, derived calculations, and server persistence.',
    propsList: [
      { name: 'columns', type: 'readonly LiteEditableGridColumn<Row>[]', description: 'Column definitions supporting editors: none, text, longText, number, select, combobox, multiselect.' },
      { name: 'rows / getRowId', type: 'readonly Row[] / (row: Row) => string', description: 'Row collection and stable unique row key.' },
      { name: 'onCellChange', type: '(change: LiteEditableGridCellChange<Row>) => void', description: 'Fired when a changed cell commits on leave/Enter.' },
      { name: 'rowHeight', type: "'auto' | 32 | 40 | 48", defaultValue: "'auto'", description: 'Auto wraps multiline text; fixed heights enable virtual scrolling.' },
      { name: 'getRowGroup', type: '(row: Row) => readonly string[]', description: 'Optional 1- or 2-level collapsible section path (e.g. [section] or [section, subsection]).' },
      { name: 'height', type: 'number | string', defaultValue: "'28rem'", description: 'Scroll viewport height.' },
    ],
  },
  {
    route: 'components/lite-row-edit-grid',
    group: 'Tables & Grids',
    title: 'LiteRowEditGrid',
    subtitle: 'Lightweight whole-row editable grid with fixed row height and virtual scrolling for thousands of uniform records.',
    keywords: 'LiteRowEditGrid row edit virtual scrolling master data cost management',
    subpath: '',
    symbols: ['LiteRowEditGrid', 'EditableGrid'],
    Demo: LiteRowEditGridDemo,
    code: `<EditableGrid aria-label="Master components" density="compact">
  <LiteRowEditGrid
    aria-label="Master rows"
    columns={columns}
    rows={rows}
    getRowId={(r) => r.id}
    rowHeight={40}
    height={420}
    onRowChange={handleRowChange}
  />
</EditableGrid>`,
    dos: [
      'Use LiteRowEditGrid for long, uniform master-data or cost tables maintained a full row at a time.',
      'Choose fixed rowHeight (32, 40, or 48) appropriate for density; virtual scrolling handles thousands of rows smoothly.',
      'Let users start editing via Enter, F2, or double-click, save once on row leave, and discard with Escape.',
    ],
    donts: [
      'Do not use LiteRowEditGrid when you need section groups or multiline wrapped rows — use LiteEditableGrid.',
      'Do not add an explicit row actions column for confirm/cancel — row leave saves automatically.',
    ],
    ownership: 'The application owns row data, validation, persistence of the batch row change payload, and canEditRow permissions.',
    propsList: [
      { name: 'columns / rows / getRowId', type: 'LiteGridCommonProps<Row>', description: 'Shared column schema and stable row IDs.' },
      { name: 'onRowChange', type: '(change: LiteRowEditGridRowChange<Row>) => void', description: 'Called once when leaving an edited row with all changed columns.' },
      { name: 'rowHeight', type: '32 | 40 | 48', defaultValue: '40', description: 'Fixed virtualized row height in pixels.' },
      { name: 'height / maxHeight', type: 'number | string', defaultValue: "'28rem'", description: 'Fixed or capped viewport height.' },
      { name: 'canEditRow', type: '(row: Row) => boolean', description: 'Optional row-level editability gate.' },
    ],
  },
  {
    route: 'components/editable-grid',
    group: 'Tables & Grids',
    title: 'EditableGrid & Grouped Sections',
    subtitle: 'EditableGrid frame container and GroupedTableSectionRow for collapsible hierarchical collections.',
    keywords: 'EditableGrid EditableGridRowActionGroup GroupedTableSectionRow grouped table',
    subpath: '',
    symbols: ['EditableGrid', 'GroupedTableSectionRow'],
    Demo: EditableGridGroupedDemo,
    code: `<EditableGrid aria-label="Grouped assemblies" title="Assemblies" density="compact">
  <Table aria-label="Assemblies">
    <TableBody>
      <GroupedTableSectionRow
        label="Drive assembly"
        count={2}
        summary="2 items · $ 1,920.00"
        columnSpan={4}
        level={0}
        expanded={open}
        icon={open ? <ChevronDownRegular /> : <ChevronRightRegular />}
        onToggle={toggle}
      />
    </TableBody>
  </Table>
</EditableGrid>`,
    dos: [
      'Use EditableGrid as the outer chrome around LiteEditableGrid, LiteRowEditGrid, or read-only grouped tables.',
      'Keep group summary counts/totals visible while sections are collapsed, and preserve leaf-row drafts across collapse.',
      'Omit title or toolbar when already titled by the page — no empty strip is drawn.',
    ],
    donts: [
      'Never make a GroupedTableSectionRow itself editable or selectable as a business record.',
      'If keeping a legacy Fluent Table inside EditableGrid, always mark the Actions header cell with nidec-ui-editable-grid__action-column.',
    ],
    ownership: 'The application owns grouping hierarchy, expansion state, summary calculations, and leaf-row data.',
    propsList: [
      { name: 'aria-label (EditableGrid)', type: 'string', description: 'Required accessible landmark label.' },
      { name: 'density', type: "'default' | 'compact'", defaultValue: "'default'", description: 'Compact tightens header/toolbar/footer spacing.' },
      { name: 'maxHeight', type: 'number | string', description: 'Caps table height with sticky header.' },
      { name: 'label / count / columnSpan / level / expanded (GroupedTableSectionRow)', type: 'string / number / number / 0 | 1 / boolean', description: 'Section disclosure metadata and hierarchy depth.' },
    ],
  },
  {
    route: 'components/data-table',
    group: 'Tables & Grids',
    title: 'Data Table & TableScrollRegion',
    subtitle: 'Table, RecordTableHeader, TableScrollRegion, RecordLink, TruncatedText, and MatrixCellButton.',
    keywords: 'Table DataGrid TableScrollRegion pinnedScrollbar frozenColumns RecordLink TruncatedText MatrixCellButton numericColumnClassName',
    subpath: '',
    symbols: ['Table', 'RecordTableHeader', 'TableScrollRegion', 'RecordLink', 'TruncatedText', 'MatrixCellButton', 'numericColumnClassName'],
    Demo: DataTableDemo,
    code: `<TableScrollRegion aria-label="Records" pinnedScrollbar maxHeight={320} frozenColumns={1}>
  <Table aria-label="Records">
    <RecordTableHeader>
      <TableRow>
        <TableHeaderCell>Record ID</TableHeaderCell>
        <TableHeaderCell className={numericColumnClassName}>Amount</TableHeaderCell>
      </TableRow>
    </RecordTableHeader>
    ...
  </Table>
</TableScrollRegion>`,
    dos: [
      'Wrap wide tables in TableScrollRegion with pinnedScrollbar, maxHeight (sticky header), and frozenColumns when needed.',
      'Use RecordTableHeader / RecordDataGridHeader for consistent neutral header distinction.',
      'Enforce one field per column; put the single navigable RecordLink in the primary identity column.',
      'Right-align numeric/currency columns with numericColumnClassName and truncate long text with TruncatedText.',
    ],
    donts: [
      'Never stack two fields (e.g., code above name) inside one table cell without explicit approval.',
      'Never combine whole-row navigation, a primary Link, and a duplicate Open button on the same row.',
      'Never hide a clickable row without a clear semantic Link in a directory table.',
    ],
    ownership: 'The application owns sorting, filtering, data fetching, routes, and matrix cell business rules.',
    propsList: [
      { name: 'pinnedScrollbar (TableScrollRegion)', type: 'boolean', defaultValue: 'false', description: 'Pins horizontal scrollbar to the bottom of the viewport while scrolling tall wide tables.' },
      { name: 'maxHeight (TableScrollRegion)', type: 'number | string', description: 'Enables vertical scrolling with sticky column headers.' },
      { name: 'frozenColumns (TableScrollRegion)', type: 'number', description: 'Number of leading columns kept pinned during horizontal scroll.' },
      { name: 'weight (RecordLink)', type: "'regular' | 'semibold'", defaultValue: "'regular'", description: 'Use semibold for emphasized identity links instead of custom bold CSS.' },
      { name: 'matched / selected (MatrixCellButton)', type: 'boolean / boolean', description: 'Visual states for selection-matrix cells that open a detail drawer.' },
    ],
  },
  {
    route: 'components/record-selection',
    group: 'Tables & Grids',
    title: 'Record Selection (Form + List)',
    subtitle: 'RecordSelectionRegion, RecordSelectionDataGrid, and RecordSelectionDataGridRow for same-page editing selection.',
    keywords: 'RecordSelectionRegion RecordSelectionDataGrid RecordSelectionDataGridRow form list master data',
    subpath: '',
    symbols: ['RecordSelectionRegion', 'RecordSelectionDataGrid', 'RecordSelectionDataGridRow'],
    Demo: RecordSelectionDemo,
    code: `<RecordSelectionRegion toolbar={<SearchBox aria-label="Filter" />}>
  <RecordSelectionDataGrid
    aria-label="Definitions"
    items={items}
    columns={columns}
    getRowId={(r) => r.id}
    selectedItems={new Set([selectedId])}
    onSelectionChange={handleSelect}
  >
    ...
  </RecordSelectionDataGrid>
</RecordSelectionRegion>`,
    dos: [
      'Use exclusively when clicking or pressing Enter/Space on a row loads that record into an editor on the same page.',
      'Render the primary record identifier as plain text — no Link and no duplicate Open/Select button.',
      'Always pass a controlled single-item Set to selectedItems and guard unsaved changes before changing selection.',
    ],
    donts: [
      'Never use RecordSelectionDataGrid for URL navigation directories or multi-row bulk selection.',
      'Never embed secondary interactive buttons inside a RecordSelectionDataGridRow.',
    ],
    ownership: 'The application owns dirty-switch confirmation, editor loading, filtering, and persistence.',
    propsList: [
      { name: 'toolbar (RecordSelectionRegion)', type: 'ReactNode', description: 'Local search/filter toolbar paired with the selection grid.' },
      { name: 'selectedItems (RecordSelectionDataGrid)', type: 'Set<TableRowId>', description: 'Controlled single-selection Set (rejects >1 selected ID).' },
      { name: 'getRowId / onSelectionChange', type: 'Required callbacks', description: 'Stable row ID resolver and selection handler.' },
      { name: 'recordId (RecordSelectionDataGridRow)', type: 'TableRowId', description: 'Row identity enabling unified pointer, Enter, and Space activation.' },
    ],
  },
  {
    route: 'components/change-history',
    group: 'Tables & Grids',
    title: 'ChangeHistoryTable',
    subtitle: 'Governed audit and revision history log showing structured field diffs, actor, timestamp, and reason.',
    keywords: 'ChangeHistoryTable audit log history revisions diff drawer',
    subpath: '',
    symbols: ['ChangeHistoryTable'],
    Demo: ChangeHistoryDemo,
    code: `<ChangeHistoryTable
  aria-label="Record change history"
  entries={[
    {
      id: '1',
      at: '26 Oct 2026 14:15',
      actor: 'A. Lin',
      action: 'Updated pricing',
      changes: [{ field: 'Unit price', from: '$ 1,240.00', to: '$ 1,310.00' }],
      reason: 'Annual supplier revision',
    },
  ]}
/>`,
    dos: [
      'Pass entries ordered newest first with already formatted timestamps and human-readable action names.',
      'Present record history inside a large FormDrawer or dedicated tab rather than crowding primary editing forms.',
    ],
    donts: [
      'Do not pass raw database column names or unformatted epoch timestamps directly into entries.',
    ],
    ownership: 'The application owns audit retrieval, date formatting, localization, and field-diff construction.',
    propsList: [
      { name: 'aria-label', type: 'string', description: 'Accessible name for the history table.' },
      { name: 'entries', type: 'readonly ChangeHistoryEntry[]', description: 'Newest-first entries with at, actor, action, optional changes[], and reason.' },
      { name: 'labels', type: 'Partial<{ at, actor, action, changes, reason, empty }>', description: 'Optional localized column headers and empty message.' },
    ],
  },
  {
    route: 'components/form-drawer',
    group: 'Feedback & Overlays',
    title: 'FormDrawer & Dialog',
    subtitle: 'FormDrawer (Sheet) for contextual forms and checklists; centered Dialog strictly for short confirmations.',
    keywords: 'FormDrawer OverlayDrawer Dialog Sheet modal confirmation unsaved',
    subpath: '',
    symbols: ['FormDrawer', 'OverlayDrawer', 'Dialog'],
    Demo: FormDrawerDemo,
    code: `<FormDrawer
  open={open}
  size="medium"
  onDismiss={handleDismiss}
  title="Edit record"
  actions={<><Button onClick={handleDismiss}>Cancel</Button><Button appearance="primary" onClick={onSave}>Save</Button></>}
>
  <FormGrid columns={1}>...</FormGrid>
</FormDrawer>`,
    dos: [
      'Always use FormDrawer (right-side Sheet) when opening a form or checklist over the current page (shared rule).',
      'Guard unsaved edits inside onDismiss so backdrop click, Escape, and close button follow one consistent policy.',
      'Reserve centered Dialog for short confirmations, entering a rejection reason, or urgent reminders.',
    ],
    donts: [
      'Never place multi-field editing forms inside a centered Dialog.',
      'Never mount drawers outside NidecProvider — portals automatically inherit scoped package tokens and opaque surfaces.',
    ],
    ownership: 'The application controls open state, dirty checks, busy submission locks, and confirmation flow.',
    propsList: [
      { name: 'open / onDismiss (FormDrawer)', type: 'boolean / () => void', description: 'Controlled visibility and unified close callback (Escape, backdrop, X button).' },
      { name: 'title / actions', type: 'ReactNode / ReactNode', description: 'Header title and footer commands (primary button last).' },
      { name: 'size', type: "'medium' | 'large'", defaultValue: "'medium'", description: 'Medium for standard forms; large for wide forms or history tables.' },
    ],
  },
  {
    route: 'components/status-feedback',
    group: 'Feedback & Overlays',
    title: 'Feedback, Badges & Empty States',
    subtitle: 'MessageBar, Badge, CountBadge, ActiveBadge, RowEndStatus, StepStatusIcon, EmptyState, Spinner, Skeleton, and ProgressBar.',
    keywords: 'MessageBar Badge CountBadge ActiveBadge RowEndStatus StepStatusIcon EmptyState Tag Spinner Skeleton ProgressBar',
    subpath: '',
    symbols: ['MessageBar', 'Badge', 'CountBadge', 'ActiveBadge', 'RowEndStatus', 'StepStatusIcon', 'EmptyState', 'Spinner', 'Skeleton', 'ProgressBar'],
    Demo: StatusFeedbackDemo,
    code: `<EmptyState
  title="No matching records"
  description="Adjust your search or filters."
  actions={<Button onClick={onReset}>Reset filters</Button>}
/>
<StepStatusIcon status="done" label="Electrical check: done" tooltip="22 Oct 2026" />`,
    dos: [
      'Always pair semantic status colors with text or an icon — never communicate status by color alone.',
      'Use StepStatusIcon for independent done/pending/not-applicable checklist steps rather than BusinessProcessFlow.',
      'Use EmptyState for zero-result collections and keep search/filter controls visible during loading or empty states.',
    ],
    donts: [
      'Never make Badge clickable like a button, and give table badge columns enough width so badges stay single-line.',
      'Never hide critical error messages exclusively inside a Tooltip.',
    ],
    ownership: 'The application maps business statuses to presentation colors and owns error/empty copy.',
    propsList: [
      { name: 'count / size (CountBadge)', type: "number / 'small' | 'medium'", description: 'Displays counts (including 0) after headings or inside tabs.' },
      { name: 'active (ActiveBadge)', type: 'boolean', description: 'Standard Active / Inactive status presentation.' },
      { name: 'status / label / tooltip (StepStatusIcon)', type: "'done' | 'pending' | 'notApplicable' / string / string", description: 'Accessible independent step indicator.' },
      { name: 'title / description / actions (EmptyState)', type: 'ReactNode', description: 'Structured empty collection state with recovery action.' },
    ],
  },
  {
    route: 'components/hints-popovers',
    group: 'Feedback & Overlays',
    title: 'Tooltips, InfoLabel & Popover',
    subtitle: 'Lightweight contextual disclosure for icons, field definitions, and brief read-only details.',
    keywords: 'Tooltip InfoLabel Popover help hint disclosure',
    subpath: '',
    symbols: ['Tooltip', 'InfoLabel', 'Popover'],
    Demo: HintsPopoversDemo,
    code: `<Field label={<InfoLabel info="Rated capacity determines the frame class.">Rated load</InfoLabel>}>
  <Input />
</Field>`,
    dos: [
      'Pair every icon-only button with a Tooltip carrying the exact same wording as aria-label.',
      'Use InfoLabel for optional field explanations that do not need to clutter the main form.',
      'Use Popover for brief supplementary inspection that dismisses cleanly on Escape or outside click.',
    ],
    donts: [
      'Never put required instructions, validation errors, or destructive warnings exclusively inside a hover Tooltip.',
      'Never build multi-field editing forms inside a Popover — use FormDrawer.',
    ],
    ownership: 'The application provides concise English help copy and controls any interactive popover state.',
    propsList: [
      { name: 'content / relationship (Tooltip)', type: "ReactNode / 'label' | 'description' | 'inaccessible'", description: 'Accessible tooltip text and ARIA relationship.' },
      { name: 'info (InfoLabel)', type: 'ReactNode', description: 'Popover explanation attached to a field label.' },
      { name: 'PopoverTrigger / PopoverSurface', type: 'Fluent compound slots', description: 'Accessible click-triggered popover container.' },
    ],
  },
  {
    route: 'components/app-shell',
    group: 'Layouts & Navigation',
    title: 'ApplicationFrame & Navigation',
    subtitle: 'ApplicationFrame, ApplicationTopBar, ApplicationNavigation, and Breadcrumb from /layouts.',
    keywords: 'ApplicationFrame ApplicationTopBar ApplicationNavigation Breadcrumb shell sidebar topbar',
    subpath: '/layouts',
    symbols: ['ApplicationFrame', 'ApplicationTopBar', 'ApplicationNavigation', 'ApplicationNavigationGroup', 'ApplicationNavigationItem'],
    Demo: AppShellDemo,
    canvasBackground: true,
    code: `import { ApplicationFrame, ApplicationTopBar, ApplicationNavigation } from '@phantasywind/nidec-app-ui-design/layouts';

<ApplicationFrame
  aria-label="Engineering Portal"
  brand={<strong>Nidec Portal</strong>}
  compactBrand={<strong>N</strong>}
  navigationOpen={navOpen}
  navigationToggleIcon={<NavigationRegular />}
  navigationToggleLabel="Open navigation"
  navigationCloseLabel="Close navigation"
  onNavigationOpenChange={setNavOpen}
  topBar={<ApplicationTopBar location="Records" breadcrumb={<Breadcrumb>...</Breadcrumb>} />}
  navigation={<ApplicationNavigation aria-label="Main">...</ApplicationNavigation>}
>
  {children}
</ApplicationFrame>`,
    dos: [
      'Keep the sidebar and top bar white and flat, separated from page content by one subtle border.',
      'Use ApplicationTopBar breadcrumb for record-level hierarchy and ApplicationNavigation footer for system links or version info.',
      'Supply compactBrand and accessible toggle/close labels for responsive mobile drawer reflow.',
    ],
    donts: [
      'Do not add filled tile backgrounds, drop shadows, or legacy navigation skins over ApplicationNavigation.',
      'Do not render a second page <h1> inside the top bar — keep one <h1> in the main PageHeader.',
    ],
    ownership: 'The application owns routes, active item matching, permissions, identity/sign-out menus, and mobile open state.',
    propsList: [
      { name: 'brand / compactBrand (ApplicationFrame)', type: 'ReactNode / ReactNode', description: 'Full sidebar brand lockup and compact rail fallback.' },
      { name: 'navigationOpen / onNavigationOpenChange', type: 'boolean / (open: boolean) => void', description: 'Controls narrow-screen overlay drawer with Escape and focus restoration.' },
      { name: 'location / utilities / breadcrumb (ApplicationTopBar)', type: 'ReactNode', description: 'Top bar identity, trailing account/utilities, and optional breadcrumb row.' },
      { name: 'footer (ApplicationNavigation)', type: 'ReactNode', description: 'Bottom-pinned navigation group or version metadata.' },
    ],
  },
  {
    route: 'components/workspace-structure',
    group: 'Layouts & Navigation',
    title: 'PageHeader, Sections & FactList',
    subtitle: 'PageHeader, WorkspaceSection, WorkspaceStack, SectionNavigation, FactList, and Tabs.',
    keywords: 'PageHeader WorkspaceSection WorkspaceStack SectionNavigation FactList TabList Tab',
    subpath: '',
    symbols: ['PageHeader', 'WorkspaceSection', 'WorkspaceStack', 'SectionNavigation', 'FactList', 'TabList', 'Tab'],
    Demo: WorkspaceStructureDemo,
    code: `<WorkspaceStack>
  <PageHeader title="Drive Assembly" titleAdornment={<Badge appearance="tint" color="success">Released</Badge>} />
  <SectionNavigation aria-label="Sections" items={sections} sticky />
  <WorkspaceSection title="Attributes" count={4}>
    <FactList facts={[{ label: 'Owner', value: 'A. Lin' }]} />
  </WorkspaceSection>
</WorkspaceStack>`,
    dos: [
      'Use WorkspaceStack to enforce consistent 12px spacing between stacked WorkspaceSection modules.',
      'Place page status badges in PageHeader titleAdornment and section counts in WorkspaceSection count.',
      'Use FactList for structured read-only key/value pairs and SectionNavigation (optionally sticky) for long single-record pages.',
    ],
    donts: [
      'Do not nest bordered cards or boxes inside a WorkspaceSection — maintain a single module border.',
      'Do not use Tabs to represent sequential business approval stages.',
    ],
    ownership: 'The application owns page headings, section counts/progress computation, and tab panel content.',
    propsList: [
      { name: 'title / titleAdornment / actions (PageHeader)', type: 'ReactNode', description: 'Single page h1, inline status adornment, and page-level action buttons.' },
      { name: 'count / headerContent / actions (WorkspaceSection)', type: 'number / ReactNode / ReactNode', description: 'Module heading, trailing CountBadge, inline title-row controls, and section actions.' },
      { name: 'items / sticky / orientation (SectionNavigation)', type: "readonly SectionNavigationItem[] / boolean / 'horizontal' | 'vertical'", description: 'In-page anchor navigation with count/total and status icons.' },
      { name: 'facts / emptyValue (FactList)', type: 'readonly FactListItem[] / ReactNode', description: 'Responsive read-only metadata grid.' },
    ],
  },
  {
    route: 'components/collections-cards',
    group: 'Layouts & Navigation',
    title: 'Collections, Cards & Pagination',
    subtitle: 'Toolbar, SearchBox, CollectionList, CardGallery, ActionableCardGalleryItem, and Pagination.',
    keywords: 'Toolbar SearchBox CollectionList CardGallery ActionableCardGalleryItem Pagination',
    subpath: '',
    symbols: ['Toolbar', 'SearchBox', 'CollectionList', 'CollectionListItem', 'CardGallery', 'ActionableCardGalleryItem', 'Pagination'],
    Demo: CollectionsCardsDemo,
    code: `<CardGallery aria-label="Records" minimumItemWidth="medium">
  <ActionableCardGalleryItem aria-label="Open REC-301" onActivate={onOpen}>
    <CardHeader header={<strong>Traction Drive M400</strong>} description="Plant 01" />
  </ActionableCardGalleryItem>
</CardGallery>
<Pagination aria-label="Pages" page={page} pageSize={10} totalCount={60} onPageChange={(_, p) => setPage(p)} />`,
    dos: [
      'Use ActionableCardGalleryItem when an entire card is the single link or open trigger; use CardGalleryItem for display-only summaries.',
      'Reset pagination to page 1 when search or filter queries change, but preserve query, filters, and page when toggling List/Card.',
      'Use CollectionList for compact summaries or narrow context rails rather than full multi-column comparisons.',
    ],
    donts: [
      'Never nest a Link or Button inside an ActionableCardGalleryItem.',
      'Never place CardGallery inside a one-column right context rail — use CollectionList there.',
    ],
    ownership: 'The application owns filtering, sorting, server/client pagination, and item activation targets.',
    propsList: [
      { name: 'minimumItemWidth (CardGallery)', type: "'small' | 'medium' | 'large'", defaultValue: "'medium'", description: 'Responsive auto-fill card track width.' },
      { name: 'href | onActivate (ActionableCardGalleryItem)', type: 'string | () => void', description: 'Whole-card navigation link or command handler.' },
      { name: 'page / pageSize / totalCount / onPageChange (Pagination)', type: 'number / number / number / callback', description: 'One-based controlled pagination bar with optional pageSizeOptions.' },
    ],
  },
  {
    route: 'components/stage-navigator',
    group: 'Stages & Workflows',
    title: 'StageNavigator',
    subtitle: 'Direct-selection numbered workspace switcher where users can inspect any peer stage, including upcoming ones.',
    keywords: 'StageNavigator steps preparation workspace stages',
    subpath: '',
    symbols: ['StageNavigator'],
    Demo: StageNavigatorDemo,
    code: `<StageNavigator
  aria-label="Preparation workspaces"
  stages={stages}
  selectedStageId={selectedStageId}
  onStageSelect={(_, stage) => setSelectedStageId(stage.id)}
/>`,
    dos: [
      'Use StageNavigator when stages represent peer workspaces users may visit freely in any order.',
      'Keep selectedStageId independent from each stage marker status fill (the outer ring tracks the viewed workspace).',
    ],
    donts: [
      'Do not use StageNavigator for server-enforced approval lifecycles where upcoming stages are locked — use BusinessProcessFlow.',
      'Do not use the deprecated ProcessStageIndicator for new work.',
    ],
    ownership: 'The application supplies stage statuses, handles selection switching, and guards unsaved edits.',
    propsList: [
      { name: 'aria-label', type: 'string', description: 'Required accessible landmark name.' },
      { name: 'stages', type: 'readonly ProcessStageDefinition[]', description: 'Ordered stage items with id, label, status (completed|current|upcoming|error), and statusLabel.' },
      { name: 'selectedStageId', type: 'string', description: 'Currently viewed workspace ID (controls outer ring only).' },
      { name: 'onStageSelect', type: '(event, stage) => void', description: 'Called when any enabled stage is activated.' },
    ],
  },
  {
    route: 'components/business-process-flow',
    group: 'Stages & Workflows',
    title: 'BusinessProcessFlow',
    subtitle: 'Authoritative lifecycle chevron bar with reached-stage inspection and BusinessProcessStageDetail popovers.',
    keywords: 'BusinessProcessFlow BusinessProcessStageDetail bpf workflow approval lifecycle',
    subpath: '',
    symbols: ['BusinessProcessFlow', 'BusinessProcessStageDetail'],
    Demo: BusinessProcessFlowDemo,
    code: `<BusinessProcessFlow
  aria-label="Approval process"
  stages={serverStages}
  viewedStageId={viewedStageId}
  onStageView={(_, stage) => setViewedStageId(stage.id)}
  renderStageDetail={(stage) => (
    <BusinessProcessStageDetail title={stage.label} checks={checks} actions={actions} />
  )}
/>`,
    dos: [
      'Use BusinessProcessFlow when the server or state machine controls authoritative progression and users only inspect reached stages.',
      'Render entry conditions and explicit advance/return buttons inside BusinessProcessStageDetail.',
      'Put process-advancing commands in primary Buttons and return/rework commands in attention Buttons.',
    ],
    donts: [
      'Never let clicking a chevron advance, reverse, or skip a business process stage.',
      'Never make upcoming stages interactive.',
      'Never use BusinessProcessFlow for an unordered checklist — use StepStatusIcon.',
    ],
    ownership: 'The application owns authoritative lifecycle state, check evaluation, RBAC, and transition APIs.',
    propsList: [
      { name: 'stages', type: 'readonly BusinessProcessStageDefinition[]', description: 'Authoritative stages with completed | current | upcoming | error | revisit status.' },
      { name: 'viewedStageId / onStageView', type: 'string / (ev, stage) => void', description: 'Tracks which reached stage is currently inspected.' },
      { name: 'renderStageDetail', type: '(stage) => ReactNode', description: 'Renders BusinessProcessStageDetail inside the stage popover.' },
      { name: 'checks / actions / next (BusinessProcessStageDetail)', type: 'structured detail slots', description: 'Displays consumer-evaluated checklist items and explicit commands.' },
    ],
  },
];

export const EXAMPLE_PAGES: readonly ExampleSpecPage[] = [
  {
    route: 'examples/directory',
    group: 'Workspace Examples',
    title: 'Enterprise Directory',
    subtitle: 'DirectoryWorkspace combining search, status filter, List/Card toggle, Pagination, and contextual FormDrawer.',
    keywords: 'example directory workspace list card drawer pagination',
    subpath: '/layouts',
    symbols: ['DirectoryWorkspace', 'PageHeader', 'TableScrollRegion', 'CardGallery', 'FormDrawer', 'Pagination'],
    Demo: DirectoryWorkspaceExample,
    summaryPoints: [
      'Primary column uses a single RecordLink; row actions stay icon-only inside TableCellActions visible.',
      'Switching between List and Card preserves search query, status filter, and current page.',
      'Clicking a record link, card, or edit icon opens FormDrawer without leaving the directory.',
    ],
  },
  {
    route: 'examples/form',
    group: 'Workspace Examples',
    title: 'Complete Entry Form',
    subtitle: 'Dedicated creation/editing form using WorkspaceSection, FormGrid, BusinessDatePicker, BusinessNumberInput, and StickySaveBar.',
    keywords: 'example form entry validation sticky save bar',
    subpath: '',
    symbols: ['WorkspaceSection', 'FormGrid', 'Field', 'SingleSelectDropdown', 'BusinessDatePicker', 'BusinessNumberInput', 'StickySaveBar'],
    Demo: CompleteFormExample,
    summaryPoints: [
      'Uses a real <form> with inline Field validation and bounded FormGrid columns.',
      'Primary submit appears first at the end of the form, paired with StickySaveBar while dirty.',
    ],
  },
  {
    route: 'examples/master-data',
    group: 'Workspace Examples',
    title: 'Master Data (Form + List)',
    subtitle: 'Same-surface definition editor paired with whole-row RecordSelectionDataGrid and unsaved-changes switch guard.',
    keywords: 'example master data form list record selection',
    subpath: '',
    symbols: ['RecordManagementWorkspace', 'RecordSelectionRegion', 'RecordSelectionDataGrid', 'Dialog'],
    Demo: MasterDataExample,
    summaryPoints: [
      'Selecting a row updates the editor above; primary values are plain text with no duplicate Open button.',
      'Edit the name and click another row to verify the discard-confirmation Dialog.',
    ],
  },
  {
    route: 'examples/record',
    group: 'Workspace Examples',
    title: 'Record Workspace',
    subtitle: 'Single-record workspace with PageHeader status badge, StageNavigator, FactList, and responsive context rail.',
    keywords: 'example record workspace stage navigator context rail responsive',
    subpath: '',
    symbols: ['RecordManagementWorkspace', 'PageHeader', 'StageNavigator', 'FactList', 'CollectionList'],
    Demo: RecordWorkspaceExample,
    summaryPoints: [
      'Context rail sits on the right above 900px and reflows above primary content at 900px and below.',
      'Try the 900px / 640px preview toggle above to verify reflow without losing selected stage.',
    ],
  },
  {
    route: 'examples/governance',
    group: 'Workspace Examples',
    title: 'Versioned Governance',
    subtitle: 'VersionedWorkspaceLayout combining BusinessProcessFlow, revision metadata, tabs, and ChangeHistoryTable drawer.',
    keywords: 'example governance versioned workspace bpf change history',
    subpath: '/layouts',
    symbols: ['VersionedWorkspaceLayout', 'BusinessProcessFlow', 'BusinessProcessStageDetail', 'ChangeHistoryTable', 'FormDrawer'],
    Demo: GovernanceExample,
    summaryPoints: [
      'Separates stable object identity, current revision, and lifecycle state as explicit labelled facts.',
      'Click Review in BusinessProcessFlow to inspect stage checks, or open Change history in a large FormDrawer.',
    ],
  },
  {
    route: 'examples/authentication',
    group: 'Workspace Examples',
    title: 'Authentication Entry',
    subtitle: 'Standalone sign-in surface built with AuthenticationLayout (synthetic non-submitting preview).',
    keywords: 'example login authentication sign in layout',
    subpath: '/layouts',
    symbols: ['AuthenticationLayout', 'Field', 'Input', 'Button', 'MessageBar'],
    Demo: AuthenticationExample,
    summaryPoints: [
      'Quiet canvas ground, single bounded centered panel, visible labels, and one full-width primary submit.',
      'Synthetic preview only — SSO, MFA, sessions, and credential checks stay strictly application-owned.',
    ],
  },
];

export const NAV_GROUPS: readonly NavGroupId[] = [
  'Start here',
  'Actions & Modes',
  'Form Controls',
  'Tables & Grids',
  'Feedback & Overlays',
  'Layouts & Navigation',
  'Stages & Workflows',
  'Workspace Examples',
];

export const ALL_NAV_ITEMS: readonly NavItemMeta[] = [
  ...FOUNDATION_NAV,
  ...COMPONENT_PAGES.map((p) => ({
    route: p.route,
    group: p.group,
    title: p.title,
    keywords: `${p.title} ${p.symbols.join(' ')} ${p.keywords}`,
  })),
  ...EXAMPLE_PAGES.map((p) => ({
    route: p.route,
    group: p.group,
    title: p.title,
    keywords: `${p.title} ${p.symbols.join(' ')} ${p.keywords}`,
  })),
];
