import { useState } from 'react';
import {
  AddRegular,
  ArrowClockwiseRegular,
  DeleteRegular,
  EditRegular,
  GridRegular,
  MoreHorizontalRegular,
  TextBulletListLtrRegular,
} from '@fluentui/react-icons';
import {
  Badge,
  Button,
  Checkbox,
  Field,
  IconButton,
  InlineModeTabs,
  Input,
  Link,
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  MoreActionsMenu,
  RecordTableHeader,
  SegmentedControl,
  Spinner,
  Table,
  TableActionIconButton,
  TableBody,
  TableCell,
  TableCellActions,
  TableHeaderCell,
  TableRow,
  TableScrollRegion,
  Tooltip,
  ViewModeToggle,
  type ViewMode,
} from '@phantasywind/nidec-app-ui-design';

export function ButtonDemo() {
  const [size, setSize] = useState<'medium' | 'small'>('medium');
  const [disabled, setDisabled] = useState(false);
  const [reasonDisplay, setReasonDisplay] = useState<'tooltip' | 'inline'>('tooltip');
  const [busy, setBusy] = useState(false);
  const [lastAction, setLastAction] = useState('Click any button to observe action state.');

  const triggerBusy = () => {
    setBusy(true);
    setLastAction('Submitting command (duplicate submission blocked while busy)...');
    window.setTimeout(() => {
      setBusy(false);
      setLastAction('Primary command completed.');
    }, 900);
  };

  return (
    <div className="demo-stack">
      <div className="site-playground__controls">
        <div className="site-playground__control-group">
          <span>Size:</span>
          <SegmentedControl
            aria-label="Button size"
            size="small"
            value={size}
            onValueChange={(_, v) => setSize(v as 'medium' | 'small')}
            options={[
              { value: 'medium', label: 'Medium (default)' },
              { value: 'small', label: 'Small' },
            ]}
          />
        </div>
        <Checkbox
          label="Disabled with reason"
          checked={disabled}
          onChange={(_, d) => setDisabled(Boolean(d.checked))}
        />
        {disabled && (
          <div className="site-playground__control-group">
            <span>Reason display:</span>
            <SegmentedControl
              aria-label="Disabled reason display"
              size="small"
              value={reasonDisplay}
              onValueChange={(_, v) => setReasonDisplay(v as 'tooltip' | 'inline')}
              options={[
                { value: 'tooltip', label: 'Tooltip' },
                { value: 'inline', label: 'Inline' },
              ]}
            />
          </div>
        )}
      </div>

      <div className="demo-stack--tight">
        <span className="demo-status-caption">Three governed button types (primary · attention · secondary)</span>
        <div className="demo-row">
          <Button
            appearance="primary"
            size={size}
            disabled={disabled || busy}
            disabledReason={disabled ? 'Complete required fields before submitting.' : undefined}
            disabledReasonDisplay={reasonDisplay}
            onClick={triggerBusy}
          >
            {busy ? 'Submitting...' : 'Submit'}
          </Button>
          <Button
            appearance="attention"
            size={size}
            disabled={disabled}
            disabledReason={disabled ? 'No active revision available to return.' : undefined}
            disabledReasonDisplay={reasonDisplay}
            onClick={() => setLastAction('Attention action clicked: Return for rework')}
          >
            Return
          </Button>
          <Button
            size={size}
            disabled={disabled}
            disabledReason={disabled ? 'Export unavailable while offline.' : undefined}
            disabledReasonDisplay={reasonDisplay}
            onClick={() => setLastAction('Secondary action clicked: Export')}
          >
            Export
          </Button>
          {busy && <Spinner size="tiny" label="Saving" />}
        </div>
      </div>

      <div className="demo-row">
        <Badge appearance="tint" color="informative">
          Event log
        </Badge>
        <span className="demo-status-caption">{lastAction}</span>
      </div>
    </div>
  );
}

export function IconActionsDemo() {
  const [eventLog, setEventLog] = useState('Hover or focus any icon button to inspect its Tooltip.');
  const rows = [
    { id: 'REC-101', name: 'Drive Assembly A1', status: 'Active' },
    { id: 'REC-102', name: 'Control Cabinet B4', status: 'Draft' },
  ];

  return (
    <div className="demo-stack">
      <div className="demo-row">
        <Tooltip content="Add record" relationship="label">
          <IconButton
            appearance="primary"
            aria-label="Add record"
            icon={<AddRegular />}
            onClick={() => setEventLog('Clicked primary IconButton: Add record')}
          />
        </Tooltip>
        <Tooltip content="Refresh list" relationship="label">
          <IconButton
            aria-label="Refresh list"
            icon={<ArrowClockwiseRegular />}
            onClick={() => setEventLog('Clicked secondary IconButton: Refresh list')}
          />
        </Tooltip>
        <MoreActionsMenu
          label="More actions"
          items={[
            { id: 'duplicate', label: 'Duplicate record', onClick: () => setEventLog('Selected: Duplicate record') },
            {
              id: 'archive',
              label: 'Archive record',
              disabled: true,
              disabledReason: 'Release is locked',
              onClick: () => undefined,
            },
            { id: 'export', label: 'Export CSV', onClick: () => setEventLog('Selected: Export CSV') },
          ]}
        />
        <Menu>
          <MenuTrigger disableButtonEnhancement>
            <Button>Menu trigger</Button>
          </MenuTrigger>
          <MenuPopover>
            <MenuList>
              <MenuItem onClick={() => setEventLog('Menu item: Download summary')}>Download summary</MenuItem>
              <MenuItem onClick={() => setEventLog('Menu item: View history')}>View history</MenuItem>
            </MenuList>
          </MenuPopover>
        </Menu>
      </div>

      <TableScrollRegion aria-label="Row icon actions example">
        <Table aria-label="Row icon actions example">
          <RecordTableHeader>
            <TableRow>
              <TableHeaderCell style={{ minWidth: 160 }}>Record</TableHeaderCell>
              <TableHeaderCell style={{ minWidth: 180 }}>Name</TableHeaderCell>
              <TableHeaderCell style={{ minWidth: 110 }}>Status</TableHeaderCell>
              <TableHeaderCell style={{ minWidth: 130 }}>Actions</TableHeaderCell>
            </TableRow>
          </RecordTableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  <Link
                    inline
                    href={`#/${row.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      setEventLog(`Opened record identity link: ${row.id}`);
                    }}
                  >
                    {row.id}
                  </Link>
                </TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>
                  <Badge appearance="tint" color={row.status === 'Active' ? 'success' : 'informative'}>
                    {row.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <TableCellActions visible>
                    <Tooltip content={`Edit ${row.id}`} relationship="description">
                      <TableActionIconButton
                        aria-label={`Edit ${row.id}`}
                        icon={<EditRegular />}
                        onClick={() => setEventLog(`Row action: Edit ${row.id}`)}
                      />
                    </Tooltip>
                    <Tooltip content={`Delete ${row.id}`} relationship="description">
                      <TableActionIconButton
                        aria-label={`Delete ${row.id}`}
                        icon={<DeleteRegular />}
                        onClick={() => setEventLog(`Row action: Delete ${row.id}`)}
                      />
                    </Tooltip>
                    <Tooltip content={`More actions for ${row.id}`} relationship="description">
                      <TableActionIconButton
                        aria-label={`More actions for ${row.id}`}
                        icon={<MoreHorizontalRegular />}
                        onClick={() => setEventLog(`Row action: More actions for ${row.id}`)}
                      />
                    </Tooltip>
                  </TableCellActions>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableScrollRegion>

      <span className="demo-status-caption">{eventLog}</span>
    </div>
  );
}

export function ModesDemo() {
  const [changeType, setChangeType] = useState('commercial');
  const [segSize, setSegSize] = useState<'small' | 'medium'>('small');
  const [paramSource, setParamSource] = useState('field');
  const [fieldDraft, setFieldDraft] = useState('LOAD_RATING_KG');
  const [fixedDraft, setFixedDraft] = useState('1600');
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  return (
    <div className="demo-stack">
      <div className="demo-stack--tight">
        <div className="demo-row--spread">
          <strong>1. SegmentedControl — Peer business mode</strong>
          <SegmentedControl
            aria-label="SegmentedControl preview size"
            size="small"
            value={segSize}
            onValueChange={(_, v) => setSegSize(v as 'small' | 'medium')}
            options={[
              { value: 'small', label: 'Small (default 24px)' },
              { value: 'medium', label: 'Medium (32px)' },
            ]}
          />
        </div>
        <div className="demo-row">
          <SegmentedControl
            aria-label="Change type"
            size={segSize}
            value={changeType}
            onValueChange={(_, v) => setChangeType(v)}
            options={[
              { value: 'all', label: 'All' },
              { value: 'commercial', label: 'Commercial change' },
              { value: 'engineering', label: 'Engineering change' },
            ]}
          />
          <span className="demo-status-caption">Selected: {changeType}</span>
        </div>
      </div>

      <div className="demo-stack--tight">
        <strong>2. InlineModeTabs — Local editor source capsule (20px pill)</strong>
        <div className="demo-field-medium demo-stack--tight">
          <InlineModeTabs
            aria-label="Parameter source"
            value={paramSource}
            onValueChange={(_, v) => setParamSource(v)}
            options={[
              { value: 'field', label: 'Field', tabId: 'demo-tab-field', panelId: 'demo-panel-field' },
              { value: 'fixed', label: 'Fixed', tabId: 'demo-tab-fixed', panelId: 'demo-panel-fixed' },
            ]}
          />
          {paramSource === 'field' ? (
            <div role="tabpanel" id="demo-panel-field" aria-labelledby="demo-tab-field">
              <Field label="Source field key" hint="Draft value is preserved when switching modes.">
                <Input value={fieldDraft} onChange={(_, d) => setFieldDraft(d.value)} />
              </Field>
            </div>
          ) : (
            <div role="tabpanel" id="demo-panel-fixed" aria-labelledby="demo-tab-fixed">
              <Field label="Fixed constant value" hint="Draft value is preserved when switching modes.">
                <Input value={fixedDraft} onChange={(_, d) => setFixedDraft(d.value)} />
              </Field>
            </div>
          )}
        </div>
      </div>

      <div className="demo-stack--tight">
        <strong>3. ViewModeToggle — List / Card presentation switch (32px icon buttons)</strong>
        <div className="demo-row">
          <span className="demo-status-caption">24 records</span>
          <ViewModeToggle
            aria-label="Collection view mode"
            value={viewMode}
            onValueChange={(_, next) => setViewMode(next)}
            listIcon={<TextBulletListLtrRegular />}
            cardIcon={<GridRegular />}
          />
          <Badge appearance="tint" color="brand">
            Active view: {viewMode}
          </Badge>
        </div>
      </div>
    </div>
  );
}
