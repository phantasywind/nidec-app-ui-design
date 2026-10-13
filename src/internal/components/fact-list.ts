import { createElement } from 'react';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { withClass } from './with-class';

export type FactListItem = Readonly<{
  label: string;
  /** Empty values (undefined, null or an empty string) show `emptyValue`. */
  value?: ReactNode;
}>;

export type FactListProps = Omit<ComponentPropsWithoutRef<'section'>, 'children' | 'title'> & {
  facts: readonly FactListItem[];
  /** Optional group heading shown above the facts. */
  title?: ReactNode;
  headingLevel?: 2 | 3 | 4;
  emptyValue?: ReactNode;
  /** Narrowest column before the grid wraps to fewer columns. */
  minColumnWidth?: string;
};

/**
 * Read-only label and value pairs in a responsive grid: a small grey label
 * above a semibold value. What each value means and how it is formatted stays
 * with the application.
 */
export function FactList({
  facts,
  title,
  headingLevel = 3,
  emptyValue = '—',
  minColumnWidth = '12rem',
  className,
  style,
  ...props
}: FactListProps) {
  if (facts.some(fact => !fact.label.trim())) throw new Error('FactList facts require non-empty labels.');
  return createElement('section', {
    ...props,
    className: withClass('nidec-ui-fact-list', className),
    style: { ...style, '--nidec-ui-fact-list-min-column': minColumnWidth } as typeof style,
  },
  title === undefined ? null : createElement(`h${headingLevel}`, { className: 'nidec-ui-fact-list__title' }, title),
  createElement('dl', { className: 'nidec-ui-fact-list__grid' }, facts.map((fact, index) => {
    const empty = fact.value === undefined || fact.value === null || fact.value === '';
    return createElement('div', { className: 'nidec-ui-fact-list__item', key: `${fact.label}-${index}` },
      createElement('dt', { className: 'nidec-ui-fact-list__label' }, fact.label),
      createElement('dd', { className: 'nidec-ui-fact-list__value', 'data-empty': empty ? 'true' : undefined }, empty ? emptyValue : fact.value));
  })));
}
