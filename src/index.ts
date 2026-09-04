import { createElement } from 'react';
import type { ComponentPropsWithRef } from 'react';

/** Text-labelled native button; no approved brand styling is supplied. */
export type ButtonProps = Omit<ComponentPropsWithRef<'button'>, 'children' | 'dangerouslySetInnerHTML'> & {
  children: string;
};

export function Button({ children, type = 'button', className, ...props }: ButtonProps) {
  return createElement('button', {
    ...props,
    type,
    className: ['nidec-ui-button', className].filter(Boolean).join(' '),
  }, children);
}
