import { useState } from 'react';
import {
  ActiveBadge,
  Badge,
  Button,
  CountBadge,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  EmptyState,
  Field,
  FormDrawer,
  FormGrid,
  InfoLabel,
  Input,
  MessageBar,
  MessageBarBody,
  MessageBarTitle,
  Popover,
  PopoverSurface,
  PopoverTrigger,
  ProgressBar,
  RowEndStatus,
  SegmentedControl,
  Skeleton,
  SkeletonItem,
  Spinner,
  StepStatusIcon,
  Tag,
  TagGroup,
  Textarea,
  Tooltip,
} from '@phantasywind/nidec-app-ui-design';

export function FormDrawerDemo() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerSize, setDrawerSize] = useState<'medium' | 'large'>('medium');
  const [recordName, setRecordName] = useState('Drive Unit D-240');
  const [savedName, setSavedName] = useState('Drive Unit D-240');
  const [notes, setNotes] = useState('Portal surfaces stay opaque and inherit Nidec tokens.');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [dialogStatus, setDialogStatus] = useState('Open FormDrawer for editing, or Dialog for a short confirmation.');

  const dirty = recordName !== savedName;

  const handleDismiss = () => {
    if (dirty) {
      setConfirmOpen(true);
      return;
    }
    setDrawerOpen(false);
  };

  return (
    <div className="demo-stack">
      <div className="site-playground__controls">
        <div className="site-playground__control-group">
          <span>Drawer size:</span>
          <SegmentedControl
            aria-label="FormDrawer size"
            size="small"
            value={drawerSize}
            onValueChange={(_, v) => setDrawerSize(v as 'medium' | 'large')}
            options={[
              { value: 'medium', label: 'Medium' },
              { value: 'large', label: 'Large' },
            ]}
          />
        </div>
      </div>

      <div className="demo-row">
        <Button appearance="primary" onClick={() => setDrawerOpen(true)}>
          Open FormDrawer
        </Button>
        <Dialog>
          <DialogTrigger disableButtonEnhancement>
            <Button appearance="attention">Open confirmation Dialog</Button>
          </DialogTrigger>
          <DialogSurface>
            <DialogBody>
              <DialogTitle>Return record for rework?</DialogTitle>
              <DialogContent>
                Dialogs are reserved for short confirmations, entering a reason, or reminders. Forms always open in a FormDrawer.
              </DialogContent>
              <DialogActions>
                <DialogTrigger disableButtonEnhancement>
                  <Button>Cancel</Button>
                </DialogTrigger>
                <DialogTrigger disableButtonEnhancement>
                  <Button
                    appearance="attention"
                    onClick={() => setDialogStatus('Confirmed short Dialog action: Returned for rework.')}
                  >
                    Confirm return
                  </Button>
                </DialogTrigger>
              </DialogActions>
            </DialogBody>
          </DialogSurface>
        </Dialog>
      </div>

      <span className="demo-status-caption">{dialogStatus}</span>

      <FormDrawer
        open={drawerOpen}
        size={drawerSize}
        onDismiss={handleDismiss}
        title="Edit record details"
        actions={
          <>
            <Button onClick={handleDismiss}>Cancel</Button>
            <Button
              appearance="primary"
              onClick={() => {
                setSavedName(recordName);
                setDrawerOpen(false);
                setDialogStatus(`Saved "${recordName}" from FormDrawer.`);
              }}
            >
              Save
            </Button>
          </>
        }
      >
        <FormGrid columns={1}>
          <Field label="Record name" hint="Modify this value and try closing to test the unsaved-changes guard.">
            <Input value={recordName} onChange={(_, d) => setRecordName(d.value)} />
          </Field>
          <Field label="Notes">
            <Textarea value={notes} onChange={(_, d) => setNotes(d.value)} rows={4} />
          </Field>
        </FormGrid>
      </FormDrawer>

      <Dialog open={confirmOpen} onOpenChange={(_, d) => setConfirmOpen(d.open)}>
        <DialogSurface>
          <DialogBody>
            <DialogTitle>Discard unsaved edits?</DialogTitle>
            <DialogContent>Closing the drawer now will discard changes made to Record name.</DialogContent>
            <DialogActions>
              <Button onClick={() => setConfirmOpen(false)}>Keep editing</Button>
              <Button
                appearance="attention"
                onClick={() => {
                  setRecordName(savedName);
                  setConfirmOpen(false);
                  setDrawerOpen(false);
                  setDialogStatus('Discarded unsaved FormDrawer edits.');
                }}
              >
                Discard
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </div>
  );
}

export function StatusFeedbackDemo() {
  const [regionState, setRegionState] = useState<'ready' | 'loading' | 'empty' | 'error'>('ready');

  return (
    <div className="demo-stack">
      <div className="demo-row">
        <Badge appearance="tint" color="success">Ready</Badge>
        <Badge appearance="tint" color="warning">Review needed</Badge>
        <Badge appearance="tint" color="danger">Blocked</Badge>
        <Badge appearance="tint" color="informative">Info</Badge>
        <CountBadge count={12} />
        <ActiveBadge active />
        <ActiveBadge active={false} />
        <TagGroup aria-label="Metadata tags">
          <Tag appearance="outline">Mechanical</Tag>
          <Tag appearance="outline">v0.3.0</Tag>
        </TagGroup>
      </div>

      <div className="demo-row">
        <StepStatusIcon status="done" label="Electrical check: done on 22 Oct 2026" tooltip="Completed 22 Oct 2026" />
        <span className="demo-status-caption">Electrical check</span>
        <StepStatusIcon status="pending" label="Thermal review: pending" tooltip="Awaiting engineer" />
        <span className="demo-status-caption">Thermal review</span>
        <StepStatusIcon status="notApplicable" label="Seismic test: not applicable" tooltip="Not required for this class" />
        <span className="demo-status-caption">Seismic test</span>
      </div>

      <div className="demo-field-medium">
        <RowEndStatus status={<ActiveBadge active />}>
          <span>Last verified 22 Oct 2026</span>
        </RowEndStatus>
      </div>

      <div className="site-playground__controls">
        <div className="site-playground__control-group">
          <span>Region feedback state:</span>
          <SegmentedControl
            aria-label="Region feedback state"
            size="small"
            value={regionState}
            onValueChange={(_, v) => setRegionState(v as 'ready' | 'loading' | 'empty' | 'error')}
            options={[
              { value: 'ready', label: 'Ready' },
              { value: 'loading', label: 'Loading' },
              { value: 'empty', label: 'Empty' },
              { value: 'error', label: 'Error' },
            ]}
          />
        </div>
      </div>

      {regionState === 'ready' && (
        <div className="demo-stack--tight">
          <MessageBar intent="success">
            <MessageBarBody>
              <MessageBarTitle>Validation passed</MessageBarTitle>
              All fields meet current submission checks.
            </MessageBarBody>
          </MessageBar>
          <ProgressBar value={0.72} aria-label="Completion progress" />
        </div>
      )}

      {regionState === 'loading' && (
        <div className="demo-stack--tight">
          <Spinner size="tiny" label="Loading records..." />
          <Skeleton aria-label="Loading placeholder">
            <SkeletonItem size={20} />
          </Skeleton>
        </div>
      )}

      {regionState === 'empty' && (
        <EmptyState
          title="No matching records"
          description="Try adjusting your search or filter criteria."
          actions={<Button onClick={() => setRegionState('ready')}>Reset filters</Button>}
        />
      )}

      {regionState === 'error' && (
        <MessageBar intent="error">
          <MessageBarBody>
            <MessageBarTitle>Unable to load records</MessageBarTitle>
            Keep error messages visible next to the affected region rather than inside a hover tooltip.
          </MessageBarBody>
        </MessageBar>
      )}
    </div>
  );
}

export function HintsPopoversDemo() {
  return (
    <div className="demo-stack">
      <div className="demo-row">
        <Tooltip content="Short clarification on hover or keyboard focus." relationship="description">
          <Button>Hover or focus for Tooltip</Button>
        </Tooltip>

        <Popover>
          <PopoverTrigger disableButtonEnhancement>
            <Button>Open contextual Popover</Button>
          </PopoverTrigger>
          <PopoverSurface>
            <div className="demo-stack--tight" style={{ maxWidth: 260 }}>
              <strong>Contextual detail</strong>
              <span className="demo-status-caption">
                Use Popover for brief supplementary inspection. Use FormDrawer for editing forms.
              </span>
            </div>
          </PopoverSurface>
        </Popover>
      </div>

      <div className="demo-field-short">
        <Field
          label={
            <InfoLabel info="Rated capacity determines the allowable frame class. Validation errors still belong in Field validationMessage.">
              Rated load
            </InfoLabel>
          }
        >
          <Input defaultValue="1600 kg" />
        </Field>
      </div>
    </div>
  );
}
