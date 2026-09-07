import { pathToFileURL } from 'node:url';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const statuses = [
  'inventoried',
  'contract-qualified',
  'package-qualified',
  'integrated-self-tested',
  'independently-accepted',
  'legacy-retired',
];
const exactVersion = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/;
const sha256 = /^[0-9a-f]{64}$/;
const revision = /^[0-9a-f]{40,64}$/;
const nonEmptyStrings = value => Array.isArray(value) && value.length > 0 && value.every(item => typeof item === 'string' && item.trim());

export function validateAdoptionRecord(record) {
  const errors = [];
  const requireValue = (condition, path, message) => { if (!condition) errors.push(`${path}: ${message}`); };
  requireValue(record?.schemaVersion === 1, 'schemaVersion', 'must equal 1');
  requireValue(typeof record?.consumer?.id === 'string' && record.consumer.id.trim(), 'consumer.id', 'is required');
  requireValue(typeof record?.consumer?.repository === 'string' && record.consumer.repository.trim(), 'consumer.repository', 'is required');
  requireValue(revision.test(record?.consumer?.sourceRevision ?? ''), 'consumer.sourceRevision', 'must be a 40-64 character lowercase hexadecimal revision');
  requireValue(record?.package?.name === '@phantasywind/nidec-app-ui-design', 'package.name', 'must use the governed package name');
  requireValue(exactVersion.test(record?.package?.version ?? ''), 'package.version', 'must be an exact version');
  requireValue(sha256.test(record?.package?.artifactSha256 ?? ''), 'package.artifactSha256', 'must be a lowercase SHA-256');
  requireValue(exactVersion.test(record?.package?.fluentVersion ?? ''), 'package.fluentVersion', 'must be an exact version');
  requireValue(Array.isArray(record?.items) && record.items.length > 0, 'items', 'must contain at least one migration item');

  const ids = new Set();
  for (const [index, item] of (record?.items ?? []).entries()) {
    const path = `items[${index}]`;
    requireValue(typeof item?.id === 'string' && item.id.trim(), `${path}.id`, 'is required');
    if (typeof item?.id === 'string' && item.id.trim()) {
      requireValue(!ids.has(item.id), `${path}.id`, 'must be unique');
      ids.add(item.id);
    }
    requireValue(typeof item?.legacySurface === 'string' && item.legacySurface.trim(), `${path}.legacySurface`, 'is required');
    requireValue(typeof item?.targetCapability === 'string' && item.targetCapability.trim(), `${path}.targetCapability`, 'is required');
    requireValue(typeof item?.owner === 'string' && item.owner.trim(), `${path}.owner`, 'is required');
    requireValue(nonEmptyStrings(item?.sourceLocations), `${path}.sourceLocations`, 'must contain source paths');
    const statusIndex = statuses.indexOf(item?.status);
    requireValue(statusIndex >= 0, `${path}.status`, `must be one of ${statuses.join(', ')}`);
    if (statusIndex >= 1) requireValue(nonEmptyStrings(item?.preservedContracts), `${path}.preservedContracts`, 'required from contract-qualified');
    if (statusIndex >= 2) requireValue(nonEmptyStrings(item?.evidence?.packageQualification), `${path}.evidence.packageQualification`, 'required from package-qualified');
    if (statusIndex >= 3) {
      requireValue(nonEmptyStrings(item?.evidence?.integrationSelfTest), `${path}.evidence.integrationSelfTest`, 'required from integrated-self-tested');
      requireValue(nonEmptyStrings(item?.evidence?.productionBuild), `${path}.evidence.productionBuild`, 'required from integrated-self-tested');
      requireValue(nonEmptyStrings(item?.evidence?.rollback), `${path}.evidence.rollback`, 'required from integrated-self-tested');
    }
    if (statusIndex >= 4) requireValue(nonEmptyStrings(item?.evidence?.independentAcceptance), `${path}.evidence.independentAcceptance`, 'required from independently-accepted');
    if (statusIndex >= 5) {
      requireValue(record?.package?.version !== '0.0.0-development', 'package.version', 'must be an immutable non-development version when any item is legacy-retired');
      requireValue(nonEmptyStrings(item?.evidence?.legacyRemoval), `${path}.evidence.legacyRemoval`, 'required for legacy-retired');
      requireValue(item?.legacyAudit?.activeReferences === 0, `${path}.legacyAudit.activeReferences`, 'must equal 0 for legacy-retired');
      requireValue(item?.legacyAudit?.dynamicEntrypointsChecked === true, `${path}.legacyAudit.dynamicEntrypointsChecked`, 'must be true for legacy-retired');
      requireValue(item?.legacyAudit?.testsAndExamplesChecked === true, `${path}.legacyAudit.testsAndExamplesChecked`, 'must be true for legacy-retired');
    }
  }
  return errors;
}

async function main() {
  const path = resolve(process.argv[2] ?? 'fixtures/governance/consumer-adoption.valid.json');
  const errors = validateAdoptionRecord(JSON.parse(await readFile(path, 'utf8')));
  if (errors.length) throw new Error(`Adoption record is invalid:\n${errors.join('\n')}`);
  console.log(`Adoption record verified: ${path}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) await main();
