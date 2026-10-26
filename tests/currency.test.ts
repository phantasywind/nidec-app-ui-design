import { describe, expect, it } from 'vitest';
import { formatCurrency } from '../src/index';

describe('formatCurrency', () => {
  it('puts the symbol before the number with one space', () => {
    expect(formatCurrency(100, 'USD')).toBe('$ 100.00');
    expect(formatCurrency('1250.5', 'CNY')).toBe('¥ 1,250.50');
  });

  it('uses the ISO code for every currency but USD and CNY', () => {
    expect(formatCurrency(1200, 'JPY')).toBe('JPY 1,200');
    expect(formatCurrency(50, 'HKD')).toBe('HKD 50.00');
    expect(formatCurrency(3800, 'EUR')).toBe('EUR 3,800.00');
    expect(formatCurrency(3800, 'EUR', { display: 'symbol' })).toBe('€ 3,800.00');
  });

  it('keeps the currency decimals unless told otherwise', () => {
    expect(formatCurrency(12.5, 'USD', { decimals: 4 })).toBe('$ 12.5000');
  });

  it('puts a minus sign before the symbol and can show the ISO code', () => {
    expect(formatCurrency(-86.5, 'USD')).toBe('-$ 86.50');
    expect(formatCurrency(100, 'CNY', { display: 'code' })).toBe('CNY 100.00');
  });

  it('leaves empty and non-numeric input alone', () => {
    expect(formatCurrency('', 'USD')).toBe('');
    expect(formatCurrency(null, 'USD')).toBe('');
    expect(formatCurrency('n/a', 'USD')).toBe('n/a');
    expect(formatCurrency('12,000', 'USD')).toBe('$ 12,000.00');
  });
});
