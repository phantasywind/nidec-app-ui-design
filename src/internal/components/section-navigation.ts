import { createElement, useState } from 'react';
import type { ComponentPropsWithoutRef, MouseEvent, ReactNode } from 'react';
import { withClass } from './with-class';

export type SectionNavigationItem = Readonly<{
  /** The id of the section element on the page; the link targets `#id` unless `href` is given. */
  id: string;
  label: string;
  /** Optional count shown after the label, for example the number of fields or open items. */
  count?: number;
  /** Optional trailing status marker, such as a StepStatusIcon or a Badge. */
  status?: ReactNode;
  href?: string;
}>;

export type SectionNavigationProps = Omit<ComponentPropsWithoutRef<'nav'>, 'children' | 'aria-label'> & {
  'aria-label': string;
  items: readonly SectionNavigationItem[];
  /** Horizontal: a row of links under the record header. Vertical: a list of section groups. */
  orientation?: 'horizontal' | 'vertical';
  /** Controlled current section. Without it the last clicked section is current. */
  currentId?: string;
  /**
   * Called before the default behaviour, which smoothly scrolls a same-page
   * `#id` target into view. Call `event.preventDefault()` to handle it yourself.
   */
  onSectionSelect?: (event: MouseEvent<HTMLAnchorElement>, id: string) => void;
};

/**
 * Navigation among the sections of one record or page. It is not application
 * navigation and does not change the route: links point at sections on the
 * same page, or at whatever `href` the application supplies.
 */
export function SectionNavigation({
  'aria-label': ariaLabel,
  items,
  orientation = 'horizontal',
  currentId,
  onSectionSelect,
  className,
  ...props
}: SectionNavigationProps) {
  const [clickedId, setClickedId] = useState<string | undefined>(undefined);
  if (!ariaLabel.trim()) throw new Error('SectionNavigation requires a non-empty aria-label.');
  if (items.some(item => !item.id.trim() || !item.label.trim())) throw new Error('SectionNavigation items require non-empty ids and labels.');
  if (new Set(items.map(item => item.id)).size !== items.length) throw new Error('SectionNavigation item ids must be unique.');
  const activeId = currentId ?? clickedId;

  const onClick = (event: MouseEvent<HTMLAnchorElement>, item: SectionNavigationItem) => {
    onSectionSelect?.(event, item.id);
    if (currentId === undefined) setClickedId(item.id);
    if (event.defaultPrevented || item.href !== undefined) return;
    const target = event.currentTarget.ownerDocument.getElementById(item.id);
    if (target === null) return;
    event.preventDefault();
    const reduceMotion = event.currentTarget.ownerDocument.defaultView?.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  };

  return createElement('nav', {
    ...props,
    'aria-label': ariaLabel,
    className: withClass(`nidec-ui-section-navigation nidec-ui-section-navigation--${orientation}`, className),
  }, createElement('ul', { className: 'nidec-ui-section-navigation__list' }, items.map(item => createElement('li', { key: item.id },
    createElement('a', {
      'aria-current': item.id === activeId ? 'location' : undefined,
      className: 'nidec-ui-section-navigation__link',
      href: item.href ?? `#${item.id}`,
      onClick: (event: MouseEvent<HTMLAnchorElement>) => onClick(event, item),
    },
    createElement('span', { className: 'nidec-ui-section-navigation__label' }, item.label),
    item.count === undefined ? null : createElement('span', { className: 'nidec-ui-section-navigation__count' }, String(item.count)),
    item.status === undefined ? null : createElement('span', { className: 'nidec-ui-section-navigation__status' }, item.status))))));
}
