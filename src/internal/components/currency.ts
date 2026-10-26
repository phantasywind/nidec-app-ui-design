export type FormatCurrencyOptions = Readonly<{
  /**
   * `auto` (default): the symbol for USD (`$`) and CNY (`¥`), the ISO code for
   * every other currency, so that JPY, HKD and the like never pass for them.
   * `symbol` or `code` forces one.
   */
  display?: 'auto' | 'symbol' | 'code';
  /** Fraction digits. Default: the currency's own (2 for USD, CNY, EUR; 0 for JPY). */
  decimals?: number;
}>;

/**
 * Formats an amount for display in tables and read-only fields: the currency
 * symbol before the number, one space between them, thousands separators and
 * fixed decimals, such as `$ 1,250.00`, `-¥ 86.50` or `JPY 1,200` (Locke, 2026-10-26).
 * Empty input gives an empty string; text that is not a number is returned unchanged.
 */
const SYMBOL_CURRENCIES = new Set(['USD', 'CNY']);

export function formatCurrency(amount: number | string | null | undefined, currency: string, options: FormatCurrencyOptions = {}) {
  if (amount === null || amount === undefined || (typeof amount === 'string' && !amount.trim())) return '';
  const value = typeof amount === 'number' ? amount : Number(amount.replaceAll(',', ''));
  if (!Number.isFinite(value)) return String(amount);
  const parts = new Intl.NumberFormat('en-US', {
    currency,
    currencyDisplay: (options.display ?? 'auto') === 'auto'
      ? (SYMBOL_CURRENCIES.has(currency.toUpperCase()) ? 'narrowSymbol' : 'code')
      : options.display === 'code' ? 'code' : 'narrowSymbol',
    style: 'currency',
    ...(options.decimals === undefined ? {} : { maximumFractionDigits: options.decimals, minimumFractionDigits: options.decimals }),
  }).formatToParts(value);
  const unit = parts.find(part => part.type === 'currency')?.value ?? currency;
  const number = parts.filter(part => part.type !== 'currency' && part.type !== 'literal' && part.type !== 'minusSign')
    .map(part => part.value).join('');
  return `${parts.some(part => part.type === 'minusSign') ? '-' : ''}${unit} ${number}`;
}
