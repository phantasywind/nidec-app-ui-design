import { useState } from 'react';
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
  Textarea,
  UnsavedChangesProvider,
  useConfirmDiscard,
  useUnsavedChanges,
  formatCurrency,
  type BusinessNumberInvalidInput,
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
