import { useState, type ReactNode } from 'react';
import {
  Badge,
  Button,
  SegmentedControl,
  Table,
  TableBody,
  TableCell,
  TableHeaderCell,
  TableRow,
  RecordTableHeader,
  TableScrollRegion,
  WorkspaceSection,
} from '@phantasywind/nidec-app-ui-design';
import { PACKAGE_NAME } from '../data/metadata';

export type PropRow = Readonly<{
  name: string;
  type: string;
  defaultValue?: string;
  description: string;
}>;

export function CopyButton({ text, label = 'Copy' }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <Button size="small" onClick={handleCopy}>
      {copied ? 'Copied' : label}
    </Button>
  );
}

export function CodeBlock({ code, label = 'TSX' }: { code: string; label?: string }) {
  return (
    <div className="site-code-block">
      <div className="site-code-block__header">
        <span className="site-code-block__label">{label}</span>
        <CopyButton text={code} />
      </div>
      <pre className="site-code-block__pre">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export function ImportBar({
  subpath = '',
  symbols,
}: {
  subpath?: '' | '/layouts' | '/date-picker';
  symbols: readonly string[];
}) {
  const target = `${PACKAGE_NAME}${subpath}`;
  const statement = `import { ${symbols.join(', ')} } from '${target}';`;
  return (
    <div className="site-import-bar" aria-label="Package import">
      <code className="site-import-bar__code">{statement}</code>
      <div className="demo-row">
        <Badge appearance="tint" color={subpath ? 'informative' : 'brand'}>
          {subpath || 'root entry'}
        </Badge>
        <CopyButton text={statement} label="Copy import" />
      </div>
    </div>
  );
}

export function Playground({
  title = 'Interactive preview',
  description,
  code,
  canvasBackground = false,
  allowViewportSwitch = true,
  children,
}: {
  title?: string;
  description?: string;
  code?: string;
  canvasBackground?: boolean;
  allowViewportSwitch?: boolean;
  children: ReactNode;
}) {
  const [viewport, setViewport] = useState<'auto' | '900' | '640'>('auto');
  const [showCode, setShowCode] = useState(false);

  const stageClass = [
    'site-playground__stage',
    canvasBackground ? 'site-playground__stage--canvas' : '',
    viewport === '900' ? 'site-playground__stage--narrow-900' : '',
    viewport === '640' ? 'site-playground__stage--narrow-640' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <WorkspaceSection
      title={title}
      description={description}
      actions={
        <div className="demo-row">
          {allowViewportSwitch && (
            <SegmentedControl
              aria-label="Preview container width"
              size="small"
              value={viewport}
              onValueChange={(_, value) => setViewport(value as 'auto' | '900' | '640')}
              options={[
                { value: 'auto', label: 'Full' },
                { value: '900', label: '900px' },
                { value: '640', label: '640px' },
              ]}
            />
          )}
          {code && (
            <Button size="small" onClick={() => setShowCode((open) => !open)}>
              {showCode ? 'Hide code' : 'View code'}
            </Button>
          )}
        </div>
      }
    >
      <div className="site-playground">
        <div className="site-playground__stage-outer">
          <div className={stageClass}>{children}</div>
        </div>
        {code && showCode && <CodeBlock code={code} label="Usage snippet (TSX)" />}
      </div>
    </WorkspaceSection>
  );
}

export function GuidelinesSection({
  dos,
  donts,
  ownership,
}: {
  dos: readonly string[];
  donts: readonly string[];
  ownership: string;
}) {
  return (
    <WorkspaceSection title="Design rules & boundaries">
      <div className="site-guidelines-grid">
        <div className="site-guideline-card site-guideline-card--do">
          <h3 className="site-guideline-card__heading">Do — Recommended usage</h3>
          <ul className="site-bullet-list">
            {dos.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="site-guideline-card site-guideline-card--dont">
          <h3 className="site-guideline-card__heading">Don&apos;t — Prohibited patterns</h3>
          <ul className="site-bullet-list">
            {donts.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="site-ownership-note">
        <strong>Application ownership:</strong> {ownership}
      </div>
    </WorkspaceSection>
  );
}

export function PropsSection({
  title = 'Props & API contract',
  propsList,
}: {
  title?: string;
  propsList: readonly PropRow[];
}) {
  return (
    <WorkspaceSection title={title} count={propsList.length} countLabel={`${propsList.length} documented props`}>
      <TableScrollRegion aria-label={title}>
        <Table aria-label={title}>
          <RecordTableHeader>
            <TableRow>
              <TableHeaderCell style={{ minWidth: 160 }}>Prop</TableHeaderCell>
              <TableHeaderCell style={{ minWidth: 220 }}>Type</TableHeaderCell>
              <TableHeaderCell style={{ minWidth: 110 }}>Default</TableHeaderCell>
              <TableHeaderCell style={{ minWidth: 260 }}>Description</TableHeaderCell>
            </TableRow>
          </RecordTableHeader>
          <TableBody>
            {propsList.map((row) => (
              <TableRow key={row.name}>
                <TableCell>
                  <code className="site-inline-code">{row.name}</code>
                </TableCell>
                <TableCell>
                  <code className="site-inline-code">{row.type}</code>
                </TableCell>
                <TableCell>{row.defaultValue ? <code className="site-inline-code">{row.defaultValue}</code> : '—'}</TableCell>
                <TableCell>{row.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableScrollRegion>
    </WorkspaceSection>
  );
}
