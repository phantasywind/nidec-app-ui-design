import { createElement } from 'react';
import type { ComponentPropsWithRef } from 'react';
import { Option as FluentOption, makeStyles, mergeClasses, tokens } from '@fluentui/react-components';

const useOptionStyles = makeStyles({
  root: {
    '@media (forced-colors: none)': {
      '&:not([aria-disabled="true"]):hover': {
        backgroundColor: tokens.colorNeutralBackground1Hover,
        color: tokens.colorBrandForeground1,
      },
      '&[aria-selected="true"]:not([aria-disabled="true"])': {
        backgroundColor: tokens.colorBrandBackground2,
        color: tokens.colorBrandForeground1,
      },
    },
  },
});

/** Fluent option behavior with the shared grey hover and green selection, including portal content. */
export function Option({ className, ...props }: ComponentPropsWithRef<typeof FluentOption>) {
  const styles = useOptionStyles();
  return createElement(FluentOption, { ...props, className: mergeClasses(styles.root, className) });
}
