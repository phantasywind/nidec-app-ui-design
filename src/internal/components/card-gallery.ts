import { createElement } from 'react';
import type { ComponentPropsWithoutRef, KeyboardEvent, ReactNode } from 'react';
import { Card as FluentCard, makeStyles, mergeClasses } from '@fluentui/react-components';
import type { CardProps as FluentCardProps } from '@fluentui/react-components';
import { withClass } from './with-class';

export type CardGalleryProps = Omit<ComponentPropsWithoutRef<'ul'>, 'children'> & {
  children?: ReactNode;
  minimumItemWidth?: 'small' | 'medium' | 'large';
};

/** Responsive collection layout; card content and application actions remain consumer-owned. */
export function CardGallery({ children, minimumItemWidth = 'medium', className, ...props }: CardGalleryProps) {
  return createElement('ul', { ...props, className: withClass(`nidec-ui-card-gallery nidec-ui-card-gallery--${minimumItemWidth}`, className) }, children);
}

export type CardGalleryItemProps = Omit<ComponentPropsWithoutRef<'li'>, 'children'> & {
  children?: ReactNode;
  cardProps?: Omit<FluentCardProps, 'children'>;
};

const useCardGalleryItemStyles = makeStyles({
  card: {
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    boxShadow: 'none',
  },
});

export function CardGalleryItem({ children, cardProps, className, ...props }: CardGalleryItemProps) {
  const styles = useCardGalleryItemStyles();
  const { className: cardClassName, ...remainingCardProps } = cardProps ?? {};
  return createElement('li', { ...props, className: withClass('nidec-ui-card-gallery__item', className) },
    createElement(FluentCard, {
      ...remainingCardProps,
      appearance: remainingCardProps.appearance ?? 'subtle',
      className: mergeClasses('nidec-ui-card-gallery__card', styles.card, cardClassName),
    }, children));
}

type ActionableCardGalleryItemBaseProps = Omit<ComponentPropsWithoutRef<'li'>, 'children' | 'onClick'> & {
  'aria-label': string;
  children?: ReactNode;
  cardProps?: Omit<FluentCardProps, 'children' | 'onClick' | 'onKeyDown' | 'role' | 'tabIndex'>;
};

export type ActionableCardGalleryItemProps = ActionableCardGalleryItemBaseProps & (
  | { href: string; onActivate?: never }
  | { href?: never; onActivate: () => void }
);

/** One whole-card primary entry. Do not place a second link or button inside it. */
export function ActionableCardGalleryItem({
  'aria-label': ariaLabel,
  children,
  cardProps,
  href,
  onActivate,
  className,
  ...props
}: ActionableCardGalleryItemProps) {
  if (!ariaLabel.trim()) throw new Error('ActionableCardGalleryItem requires a non-empty aria-label.');
  if (href !== undefined && !href.trim()) throw new Error('ActionableCardGalleryItem requires a non-empty href.');
  const styles = useCardGalleryItemStyles();
  const { className: cardClassName, ...remainingCardProps } = cardProps ?? {};
  const card = createElement(FluentCard, {
    ...remainingCardProps,
    appearance: remainingCardProps.appearance ?? 'subtle',
    className: mergeClasses('nidec-ui-card-gallery__card nidec-ui-card-gallery__card--actionable', styles.card, cardClassName),
  }, children);

  return createElement('li', { ...props, className: withClass('nidec-ui-card-gallery__item', className) },
    href !== undefined
      ? createElement('a', { 'aria-label': ariaLabel, className: 'nidec-ui-card-gallery__entry', href }, card)
      : createElement('div', {
        'aria-label': ariaLabel,
        className: 'nidec-ui-card-gallery__entry',
        onClick: onActivate,
        onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => {
          if (event.key !== 'Enter' && event.key !== ' ') return;
          event.preventDefault();
          onActivate();
        },
        role: 'button',
        tabIndex: 0,
      }, card));
}
