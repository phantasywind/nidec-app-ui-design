import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';
import { validateAdoptionRecord } from '../scripts/verify-adoption-record.mjs';

const valid = JSON.parse(await readFile(new URL('../fixtures/governance/consumer-adoption.valid.json', import.meta.url), 'utf8'));
const clone = value => structuredClone(value);

describe('Consumer adoption and legacy-retirement record', () => {
  it('accepts the complete neutral example', () => {
    expect(validateAdoptionRecord(valid)).toEqual([]);
  });

  it('rejects non-exact package versions', () => {
    for (const version of ['latest', '^1.2.3', '~1.2.3']) {
      const record = clone(valid);
      record.package.version = version;
      expect(validateAdoptionRecord(record).some(error => error.startsWith('package.version:'))).toBe(true);
    }
  });

  it('allows technical cleanup on a development candidate but blocks formal retirement', () => {
    const technical = clone(valid);
    technical.package.version = '0.0.0-development';
    technical.items[0].status = 'integrated-self-tested';
    expect(validateAdoptionRecord(technical)).toEqual([]);

    const retired = clone(valid);
    retired.package.version = '0.0.0-development';
    expect(validateAdoptionRecord(retired)).toContain('package.version: must be an immutable non-development version when any item is legacy-retired');
  });

  it('does not allow independent acceptance to be omitted', () => {
    const record = clone(valid);
    delete record.items[0].evidence.independentAcceptance;
    expect(validateAdoptionRecord(record)).toContain('items[0].evidence.independentAcceptance: required from independently-accepted');
  });

  it('does not allow retirement while references or dynamic-entry checks remain open', () => {
    const record = clone(valid);
    record.items[0].legacyAudit.activeReferences = 1;
    record.items[0].legacyAudit.dynamicEntrypointsChecked = false;
    expect(validateAdoptionRecord(record)).toEqual(expect.arrayContaining([
      'items[0].legacyAudit.activeReferences: must equal 0 for legacy-retired',
      'items[0].legacyAudit.dynamicEntrypointsChecked: must be true for legacy-retired',
    ]));
  });
});
