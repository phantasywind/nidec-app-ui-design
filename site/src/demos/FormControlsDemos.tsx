import { useMemo, useRef, useState } from 'react';
import {
  Badge,
  BusinessNumberInput,
  Button,
  Checkbox,
  Combobox,
  Dropdown,
  Field,
  FormGrid,
  FormGridItem,
  Input,
  Lookup,
  LookupSearchWindow,
  MessageBar,
  MessageBarBody,
  MultiSelectDropdown,
  Option,
  Radio,
  RadioGroup,
  SegmentedControl,
  SingleSelectDropdown,
  Slider,
  SpinButton,
  StickySaveBar,
  Switch,
  Text,
  Textarea,
  UnsavedChangesProvider,
  createLookupAnchor,
  useConfirmDiscard,
  useUnsavedChanges,
  formatCurrency,
  type BusinessNumberInvalidInput,
  type LookupAnchor,
  type LookupColumn,
} from '@phantasywind/nidec-app-ui-design';
import {
  BusinessDatePicker,
  type BusinessDateInvalidInput,
} from '@phantasywind/nidec-app-ui-design/date-picker';

export function TextFieldsDemo() {
  const [columns, setColumns] = useState<1 | 2 | 3>(2);
  const [name, setName] = useState('Traction Drive M400');
  const [code, setCode] = useState('DRV-400-A');
  const [notes, setNotes] = useState('Verified mechanical mounting tolerance and thermal margin.');

  const nameInvalid = name.trim().length === 0;

  return (
    <div className="demo-stack">
      <div className="site-playground__controls">
        <div className="site-playground__control-group">
          <span>FormGrid columns:</span>
          <SegmentedControl
            aria-label="FormGrid column count"
            size="small"
            value={String(columns)}
            onValueChange={(_, v) => setColumns(Number(v) as 1 | 2 | 3)}
            options={[
              { value: '1', label: '1 column' },
              { value: '2', label: '2 columns' },
              { value: '3', label: '3 columns' },
            ]}
          />
        </div>
      </div>

      <FormGrid columns={columns}>
        <Field
          label="Item name"
          required
          validationState={nameInvalid ? 'error' : undefined}
          validationMessage={nameInvalid ? 'Item name is required.' : undefined}
        >
          <Input value={name} onChange={(_, d) => setName(d.value)} />
        </Field>
        <Field label="Record identifier" hint="Read-only values remain copyable (never fake read-only with disabled).">
          <Input value={code} readOnly onChange={(_, d) => setCode(d.value)} />
        </Field>
        <Field label="Disabled reference">
          <Input value="LOCKED-SYS-01" disabled />
        </Field>
        <FormGridItem wide>
          <Field label="Engineering notes" hint="Textarea retains Fluent default height (never crush to 24px).">
            <Textarea value={notes} onChange={(_, d) => setNotes(d.value)} rows={3} />
          </Field>
        </FormGridItem>
      </FormGrid>
    </div>
  );
}

const SHORT_REGIONS = [
  { value: 'apac', text: 'Asia Pacific' },
  { value: 'emea', text: 'Europe' },
  { value: 'amer', text: 'Americas' },
  { value: 'cn', text: 'China' },
  { value: 'jp', text: 'Japan' },
];

const MANY_PLANT_OPTIONS = [
  'Plant 01 — Shanghai',
  'Plant 02 — Suzhou',
  'Plant 03 — Osaka',
  'Plant 04 — Kyoto',
  'Plant 05 — Nagoya',
  'Plant 06 — Munich',
  'Plant 07 — Milan',
  'Plant 08 — Madrid',
  'Plant 09 — Lyon',
  'Plant 10 — Chicago',
  'Plant 11 — Monterrey',
  'Plant 12 — Singapore',
  'Plant 13 — Bengaluru',
  'Plant 14 — Seoul',
].map((text, index) => ({ value: `P${String(index + 1).padStart(2, '0')}`, text }));

export function SelectsDemo() {
  const [region, setRegion] = useState<string | null>('apac');
  const [plant, setPlant] = useState<string | null>('P01');
  const [multiTrigger, setMultiTrigger] = useState<string[]>(['apac', 'emea']);
  const [multiBelow, setMultiBelow] = useState<string[]>(['apac', 'cn', 'jp']);
  const [comboText, setComboText] = useState('Drive module');

  return (
    <div className="demo-stack">
      <FormGrid columns={2}>
        <Field label="SingleSelectDropdown (5 options — standard list)">
          <SingleSelectDropdown
            placeholder="Select region"
            options={SHORT_REGIONS}
            selectedOption={region}
            onOptionSelect={(_, d) => setRegion(d.optionValue)}
          />
        </Field>

        <Field
          label="SingleSelectDropdown (14 options — auto-searchable)"
          hint="Automatically switches to a type-to-filter Combobox at 12+ options."
        >
          <SingleSelectDropdown
            placeholder="Search plant..."
            options={MANY_PLANT_OPTIONS}
            selectedOption={plant}
            onOptionSelect={(_, d) => setPlant(d.optionValue)}
          />
        </Field>

        <Field label="MultiSelectDropdown (tags in trigger)">
          <MultiSelectDropdown
            placeholder="Select regions"
            options={SHORT_REGIONS}
            selectedOptions={multiTrigger}
            onOptionSelect={(_, d) => setMultiTrigger(d.selectedOptions)}
            maxVisibleTags={2}
          />
        </Field>

        <Field label="MultiSelectDropdown (tags below + searchable)">
          <MultiSelectDropdown
            placeholder="Filter regions..."
            options={SHORT_REGIONS}
            selectedOptions={multiBelow}
            onOptionSelect={(_, d) => setMultiBelow(d.selectedOptions)}
            tagPlacement="below"
            searchable
          />
        </Field>

        <Field label="Direct Fluent Dropdown">
          <Dropdown defaultValue="Standard" defaultSelectedOptions={['std']}>
            <Option value="std">Standard</Option>
            <Option value="heavy">Heavy duty</Option>
            <Option value="custom">Custom build</Option>
          </Dropdown>
        </Field>

        <Field label="Fluent Combobox (free-form or searchable)">
          <Combobox value={comboText} onInput={(e) => setComboText((e.target as HTMLInputElement).value)}>
            <Option value="drive">Drive module</Option>
            <Option value="brake">Brake unit</Option>
            <Option value="sensor">Sensor bracket</Option>
          </Combobox>
        </Field>
      </FormGrid>
    </div>
  );
}

export function DatePickerDemo() {
  const [targetDate, setTargetDate] = useState<string | null>('2026-10-22');
  const [invalidInput, setInvalidInput] = useState<BusinessDateInvalidInput | null>(null);

  return (
    <div className="demo-stack">
      <div className="demo-field-short">
        <Field
          label="Target delivery date"
          hint="Accepts 2026-10-22 or 22 Oct 2026. Allowed range: 2026-01-01 to 2026-12-31."
          validationState={invalidInput ? 'error' : undefined}
          validationMessage={
            invalidInput
              ? invalidInput.reason === 'out-of-bounds'
                ? `Date "${invalidInput.text}" falls outside 2026.`
                : `"${invalidInput.text}" is not a valid date.`
              : undefined
          }
        >
          <BusinessDatePicker
            value={targetDate}
            onValueChange={(next) => {
              setInvalidInput(null);
              setTargetDate(next);
            }}
            onInvalidInput={(info) => setInvalidInput(info)}
            minDate={new Date(2026, 0, 1)}
            maxDate={new Date(2026, 11, 31)}
          />
        </Field>
      </div>

      <div className="demo-row">
        <Badge appearance="tint" color="brand">
          Stored value (yyyy-MM-dd)
        </Badge>
        <code className="site-inline-code">{targetDate ?? 'null'}</code>
        <Button
          size="small"
          onClick={() => {
            setInvalidInput(null);
            setTargetDate(null);
          }}
        >
          Clear date
        </Button>
      </div>
    </div>
  );
}

export function NumbersDemo() {
  const [weight, setWeight] = useState<number | null>(1240.5);
  const [amount, setAmount] = useState<number | null>(18450);
  const [currency, setCurrency] = useState('USD');
  const [invalidNum, setInvalidNum] = useState<BusinessNumberInvalidInput | null>(null);
  const [quantity, setQuantity] = useState(4);
  const [ratio, setRatio] = useState(65);

  return (
    <div className="demo-stack">
      <FormGrid columns={2}>
        <Field
          label="Rated weight"
          hint="Range 0 to 5,000 kg with thousands separator."
          validationState={invalidNum ? 'error' : undefined}
          validationMessage={
            invalidNum
              ? invalidNum.reason === 'out-of-range'
                ? `"${invalidNum.text}" must be between 0 and 5000.`
                : `"${invalidNum.text}" is not a valid number.`
              : undefined
          }
        >
          <BusinessNumberInput
            value={weight}
            onValueChange={(v) => {
              setInvalidNum(null);
              setWeight(v);
            }}
            onInvalidInput={(info) => setInvalidNum(info)}
            unit="kg"
            min={0}
            max={5000}
            decimals={2}
          />
        </Field>

        <Field label="Unit amount (formatCurrency preview)">
          <BusinessNumberInput
            value={amount}
            onValueChange={setAmount}
            decimals={2}
            fixedDecimals
          />
        </Field>

        <Field label="Small integer step (SpinButton)">
          <SpinButton
            value={quantity}
            min={1}
            max={20}
            onChange={(_, d) => {
              if (typeof d.value === 'number') setQuantity(d.value);
            }}
          />
        </Field>

        <Field label={`Continuous estimate (Slider): ${ratio}%`}>
          <Slider min={0} max={100} value={ratio} onChange={(_, d) => setRatio(d.value)} />
        </Field>
      </FormGrid>

      <div className="site-playground__controls">
        <div className="site-playground__control-group">
          <span>Currency:</span>
          <SegmentedControl
            aria-label="Currency code"
            size="small"
            value={currency}
            onValueChange={(_, v) => setCurrency(v)}
            options={[
              { value: 'USD', label: 'USD' },
              { value: 'CNY', label: 'CNY' },
              { value: 'JPY', label: 'JPY' },
              { value: 'HKD', label: 'HKD' },
              { value: 'EUR', label: 'EUR' },
            ]}
          />
        </div>
        <span className="demo-status-caption">
          <code className="site-inline-code">formatCurrency({amount ?? 0}, &apos;{currency}&apos;)</code> →{' '}
          <strong>{formatCurrency(amount ?? 0, currency)}</strong>
        </span>
      </div>
    </div>
  );
}

export function ChoicesDemo() {
  const [priority, setPriority] = useState('standard');
  const [checks, setChecks] = useState({ electrical: true, mechanical: false, documentation: true });
  const [autoNotify, setAutoNotify] = useState(true);

  const values = Object.values(checks);
  const allChecked = values.every(Boolean);
  const someChecked = values.some(Boolean);
  const parentState = allChecked ? true : someChecked ? 'mixed' : false;

  return (
    <FormGrid columns={3}>
      <Field label="Mutually exclusive (RadioGroup)">
        <RadioGroup value={priority} onChange={(_, d) => setPriority(d.value)}>
          <Radio value="standard" label="Standard schedule" />
          <Radio value="expedited" label="Expedited schedule" />
          <Radio value="hold" label="On hold" />
        </RadioGroup>
      </Field>

      <Field label="Batch selection (Checkbox + mixed)">
        <div className="demo-stack--tight">
          <Checkbox
            label="Select all checks"
            checked={parentState}
            onChange={(_, d) => {
              const next = Boolean(d.checked);
              setChecks({ electrical: next, mechanical: next, documentation: next });
            }}
          />
          <div style={{ paddingLeft: 20 }} className="demo-stack--tight">
            <Checkbox
              label="Electrical spec"
              checked={checks.electrical}
              onChange={(_, d) => setChecks((c) => ({ ...c, electrical: Boolean(d.checked) }))}
            />
            <Checkbox
              label="Mechanical tolerance"
              checked={checks.mechanical}
              onChange={(_, d) => setChecks((c) => ({ ...c, mechanical: Boolean(d.checked) }))}
            />
            <Checkbox
              label="Documentation package"
              checked={checks.documentation}
              onChange={(_, d) => setChecks((c) => ({ ...c, documentation: Boolean(d.checked) }))}
            />
          </div>
        </div>
      </Field>

      <Field label="Immediate binary setting (Switch)">
        <Switch
          label={autoNotify ? 'Email notifications enabled' : 'Email notifications muted'}
          checked={autoNotify}
          onChange={(_, d) => setAutoNotify(d.checked)}
        />
      </Field>
    </FormGrid>
  );
}

function UnsavedChangesInner() {
  const [savedValue, setSavedValue] = useState('Baseline specification v2');
  const [draft, setDraft] = useState(savedValue);
  const [status, setStatus] = useState('Edit the field below to mark the form dirty.');
  const dirty = draft !== savedValue;

  useUnsavedChanges(dirty);
  const { confirmDiscard } = useConfirmDiscard();

  const tryLeave = async () => {
    const ok = await confirmDiscard();
    if (ok) {
      setDraft(savedValue);
      setStatus('Changes discarded after confirmation.');
    } else {
      setStatus('Navigation cancelled — edits preserved.');
    }
  };

  return (
    <div className="demo-stack">
      <div className="demo-field-medium">
        <Field label="Specification summary" hint="Type a change to trigger StickySaveBar and discard confirmation.">
          <Input value={draft} onChange={(_, d) => setDraft(d.value)} />
        </Field>
      </div>

      <div className="demo-row">
        <Button onClick={tryLeave}>Simulate leaving page</Button>
        <Badge appearance="tint" color={dirty ? 'warning' : 'success'}>
          {dirty ? 'Unsaved changes' : 'Clean'}
        </Badge>
      </div>

      {dirty && (
        <StickySaveBar
          message="1 unsaved field change"
          actions={
            <>
              <Button
                onClick={() => {
                  setDraft(savedValue);
                  setStatus('Draft reset to last saved value.');
                }}
              >
                Discard
              </Button>
              <Button
                appearance="primary"
                onClick={() => {
                  setSavedValue(draft);
                  setStatus('Saved changes locally.');
                }}
              >
                Save changes
              </Button>
            </>
          }
        />
      )}

      <MessageBar intent="info">
        <MessageBarBody>{status}</MessageBarBody>
      </MessageBar>
    </div>
  );
}

export function UnsavedChangesDemo() {
  return (
    <UnsavedChangesProvider
      title="Discard unsaved changes?"
      message="You have modified fields in this form. Leaving now will discard your edits."
    >
      <UnsavedChangesInner />
    </UnsavedChangesProvider>
  );
}

type CatalogPart = {
  code: string;
  name: string;
  specification: string;
  unit: string;
  categoryCode: string;
  categoryName: string;
};

const LOOKUP_CATEGORIES = [
  { code: '011', name: 'Traction Drives' },
  { code: '024', name: 'Control Modules' },
  { code: '038', name: 'Safety Hardware' },
  { code: '052', name: 'Mechanical Assemblies' },
] as const;

const LOOKUP_NAMES: Record<string, readonly string[]> = {
  '011': ['Permanent magnet drive', 'Geared traction unit', 'High-torque motor'],
  '024': ['Vector inverter unit', 'Main relay controller', 'Encoder interface board'],
  '038': ['Dual-coil brake assembly', 'Overspeed governor', 'Buffer switch module'],
  '052': ['Isolation mounting frame', 'Guide shoe assembly', 'Counterweight bracket'],
};

const LOOKUP_SPECS = [
  'WT 1000kg 1.0m/s',
  'WT 1000kg 1.75m/s',
  'WT 1600kg 2.5m/s',
  '400V 3-phase IP54',
  'Dual channel EN81-20',
  'Heavy-duty thermal class F',
] as const;

const LOOKUP_CATALOG: readonly CatalogPart[] = Array.from({ length: 240 }, (_, index) => {
  const cat = LOOKUP_CATEGORIES[index % LOOKUP_CATEGORIES.length]!;
  const names = LOOKUP_NAMES[cat.code]!;
  return {
    code: `M${cat.code}${String(1001 + index).padStart(4, '0')}`,
    name: names[Math.floor(index / LOOKUP_CATEGORIES.length) % names.length]!,
    specification: LOOKUP_SPECS[index % LOOKUP_SPECS.length]!,
    unit: index % 5 === 0 ? 'SET' : 'EA',
    categoryCode: cat.code,
    categoryName: cat.name,
  };
});

export function LookupDemo() {
  const [size, setSize] = useState<'medium' | 'small'>('medium');
  const [lockedCategory, setLockedCategory] = useState(false);
  const [allowManual, setAllowManual] = useState(true);
  const [selectedCode, setSelectedCode] = useState<string | null>('M0111001');
  const [customDisplay, setCustomDisplay] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [manualName, setManualName] = useState('');
  const [manualCode, setManualCode] = useState('');
  const [manualSpec, setManualSpec] = useState('');
  const [eventLog, setEventLog] = useState('Click the field, press Enter/F4, or start typing to search. Press Delete to clear.');

  // Standalone virtual-anchor window demo (for table cells / custom triggers)
  const triggerBtnRef = useRef<HTMLDivElement>(null);
  const [anchorTarget, setAnchorTarget] = useState<LookupAnchor | null>(null);
  const [anchorQuery, setAnchorQuery] = useState('');

  const effectiveCategory = lockedCategory ? '011' : categoryFilter;

  const filterCatalog = (searchText: string, catCode: string) => {
    const words = searchText.trim().toLowerCase().split(/\s+/).filter(Boolean);
    return LOOKUP_CATALOG.filter((item) => {
      if (catCode !== 'all' && item.categoryCode !== catCode) return false;
      if (words.length === 0) return true;
      const haystack = `${item.code} ${item.name} ${item.specification} ${item.categoryCode} ${item.categoryName}`.toLowerCase();
      return words.every((word) => haystack.includes(word));
    });
  };

  const matchedItems = useMemo(
    () => filterCatalog(query, effectiveCategory),
    [query, effectiveCategory],
  );

  const anchorItems = useMemo(
    () => filterCatalog(anchorQuery, 'all'),
    [anchorQuery],
  );

  const columns = useMemo<readonly LookupColumn<CatalogPart>[]>(() => {
    const base: LookupColumn<CatalogPart>[] = [
      { key: 'code', header: 'Part Number', width: '8.5rem', getValue: (item) => item.code },
      { key: 'name', header: 'Name', width: '11.5rem', getValue: (item) => item.name },
      { key: 'specification', header: 'Specification', getValue: (item) => item.specification },
      { key: 'unit', header: 'Unit', width: '4rem', getValue: (item) => item.unit },
    ];
    if (!lockedCategory) {
      base.push({
        key: 'categoryCode',
        header: 'Category',
        width: '5.5rem',
        getValue: (item) => item.categoryCode,
        getTitle: (item) => `${item.categoryCode} ${item.categoryName}`,
      });
    }
    return base;
  }, [lockedCategory]);

  const selectedRecord = LOOKUP_CATALOG.find((item) => item.code === selectedCode) ?? null;
  const displayValue = customDisplay
    ?? (selectedRecord ? `${selectedRecord.code}  ${selectedRecord.name}` : '');

  const manualProblem = manualName.trim() === '' ? 'Enter an item name before confirming.' : undefined;

  return (
    <div className="demo-stack">
      <div className="site-playground__controls">
        <div className="site-playground__control-group">
          <span>Size:</span>
          <SegmentedControl
            aria-label="Lookup input size"
            size="small"
            value={size}
            onValueChange={(_, v) => setSize(v as 'medium' | 'small')}
            options={[
              { value: 'medium', label: 'Medium (32px)' },
              { value: 'small', label: 'Small (24px)' },
            ]}
          />
        </div>
        <Checkbox
          label="Lock to category 011"
          checked={lockedCategory}
          onChange={(_, d) => setLockedCategory(Boolean(d.checked))}
        />
        <Checkbox
          label="Allow manual entry mode"
          checked={allowManual}
          onChange={(_, d) => setAllowManual(Boolean(d.checked))}
        />
      </div>

      <FormGrid columns={2}>
        <Field
          label="Catalog item lookup"
          hint="Click, press Enter / F4 / ↓, or type any letter while focused. Press Delete to clear."
        >
          <Lookup<CatalogPart>
            aria-label="Catalog item lookup"
            size={size}
            value={selectedCode ?? (customDisplay ? '__manual__' : null)}
            displayValue={displayValue}
            placeholder="Click or type to search catalog..."
            title="Choose catalog item"
            searchLabel="Search catalog items"
            searchPlaceholder="Code, name or specification: every word must match"
            columns={columns}
            items={matchedItems.slice(0, 120)}
            totalCount={matchedItems.length}
            getItemKey={(item) => item.code}
            debounceMs={120}
            onQueryChange={setQuery}
            onOpenChange={(open) => {
              if (!open) setQuery('');
            }}
            filterSlot={
              lockedCategory ? (
                <Text size={200} style={{ color: 'var(--colorNeutralForeground3)' }}>
                  Category 011 Traction Drives
                </Text>
              ) : (
                <SingleSelectDropdown
                  aria-label="Category filter"
                  style={{ width: '100%' }}
                  selectedOption={categoryFilter}
                  onOptionSelect={(_, data) => setCategoryFilter(data.optionValue)}
                  options={[
                    { value: 'all', text: 'All categories' },
                    ...LOOKUP_CATEGORIES.map((c) => ({ value: c.code, text: `${c.code} ${c.name}` })),
                  ]}
                />
              )
            }
            manualMode={
              allowManual
                ? {
                  switcherLabel: 'Item source',
                  searchLabel: 'From the catalog',
                  manualLabel: 'Not in catalog',
                  footerNote: 'Manual entries are flagged for engineering review.',
                  confirmLabel: 'Use',
                  confirmDisabled: Boolean(manualProblem),
                  confirmDisabledReason: manualProblem,
                  onConfirm: () => {
                    const summary = `${manualCode.trim() ? `${manualCode.trim()}  ` : ''}${manualName.trim()}`;
                    setSelectedCode(null);
                    setCustomDisplay(summary);
                    setEventLog(`Manual entry confirmed: ${summary}${manualSpec.trim() ? ` (${manualSpec.trim()})` : ''}`);
                  },
                  content: (
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                        gap: 'var(--spacingVerticalM) var(--spacingHorizontalM)',
                        alignItems: 'start',
                      }}
                    >
                      <Field label="Name" required>
                        <Input
                          value={manualName}
                          placeholder="e.g. Custom traction assembly"
                          onChange={(_, d) => setManualName(d.value)}
                        />
                      </Field>
                      <Field label="Part Number" hint="Optional: can be assigned later.">
                        <Input
                          value={manualCode}
                          placeholder="Optional code"
                          onChange={(_, d) => setManualCode(d.value)}
                        />
                      </Field>
                      <div style={{ gridColumn: '1 / -1' }}>
                        <Field label="Specification">
                          <Input
                            value={manualSpec}
                            placeholder="Rating, dimensions, or standard"
                            onChange={(_, d) => setManualSpec(d.value)}
                          />
                        </Field>
                      </div>
                    </div>
                  ),
                }
                : undefined
            }
            onSelect={(item) => {
              setSelectedCode(item.code);
              setCustomDisplay(null);
              setEventLog(`Selected ${item.code} — ${item.name} (${item.specification})`);
            }}
            onClear={() => {
              setSelectedCode(null);
              setCustomDisplay(null);
              setEventLog('Cleared selection via Delete / Backspace.');
            }}
          />
        </Field>

        <Field
          label="Virtual anchor (for grid cells)"
          hint="Use LookupSearchWindow + createLookupAnchor(rect) to open next to any cell."
        >
          <div ref={triggerBtnRef} className="demo-row">
            <Button
              size={size}
              onClick={() => {
                const rect = triggerBtnRef.current?.getBoundingClientRect();
                if (rect) {
                  setAnchorQuery('');
                  setAnchorTarget(createLookupAnchor(rect));
                }
              }}
            >
              Open anchored window
            </Button>
          </div>
          {anchorTarget && (
            <LookupSearchWindow<CatalogPart>
              target={anchorTarget}
              title="Pick replacement item"
              searchPlaceholder="Filter 240 catalog records..."
              columns={columns}
              items={anchorItems.slice(0, 120)}
              totalCount={anchorItems.length}
              selectedKey={selectedCode}
              getItemKey={(item) => item.code}
              debounceMs={100}
              onQueryChange={setAnchorQuery}
              onSelect={(item) => {
                setSelectedCode(item.code);
                setCustomDisplay(null);
                setAnchorTarget(null);
                setEventLog(`Picked via virtual anchor: ${item.code} — ${item.name}`);
              }}
              onClose={() => setAnchorTarget(null)}
            />
          )}
        </Field>
      </FormGrid>

      <div className="demo-row">
        <Badge appearance="outline" color="subtle">Event log</Badge>
        <span className="demo-status-caption">{eventLog}</span>
      </div>
    </div>
  );
}
