import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import * as upstream from '@fluentui/react-datepicker-compat';
import { DatePicker } from '../src/date-picker';
import type * as Shared from '../src/date-picker';

type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2) ? true : false;
const exactProps: Equal<Shared.DatePickerProps, upstream.DatePickerProps> = true;
void exactProps;

describe('DatePicker public subpath', () => {
  it('preserves the qualified Fluent implementation identity', () => {
    expect(DatePicker).toBe(upstream.DatePicker);
  });

  it('renders an explicitly formatted controlled date and disabled state', () => {
    const html = renderToStaticMarkup(createElement(DatePicker, {
      'aria-label': 'Effective date',
      disabled: true,
      formatDate: date => date ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}` : '',
      value: new Date(2026, 8, 23),
    }));
    expect(html).toContain('aria-label="Effective date"');
    expect(html).toContain('value="2026-09-23"');
    expect(html).toContain('disabled=""');
  });
});
